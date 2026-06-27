import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { Server } from 'socket.io';
import http from 'http';
import 'express-async-errors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

app.get('/api', (req, res) => res.json({ status: 'ok', message: 'Naichii Bakery API is running' }));

app.post('/api/auth/register', async (req, res) => {
  const { nama, email, password, nomor_hp } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { nama, email, password: hashed, nomor_hp, role: 'customer' } });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, nama: user.nama, email: user.email, role: user.role }, token });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, nama: user.nama, email: user.email, role: user.role, foto: user.foto }, token });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'If the email exists, password reset instructions have been sent.' });
});

app.get('/api/users/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ user });
});

app.put('/api/users/me', authMiddleware, async (req, res) => {
  const { nama, nomor_hp, alamat } = req.body;
  const user = await prisma.user.update({ where: { id: req.user.id }, data: { nama, nomor_hp, alamat } });
  res.json({ user });
});

const upload = multer({ storage: multer.memoryStorage() });
app.put('/api/users/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Avatar required' });
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({ folder: 'naichii/avatar', resource_type: 'image' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(req.file.buffer);
    });

    const user = await prisma.user.update({ where: { id: req.user.id }, data: { foto: uploadResult.secure_url } });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

app.get('/api/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json({ categories });
});

app.get('/api/products', async (req, res) => {
  const { search, category, minPrice, maxPrice, rating, sort } = req.query;
  const filters = { where: {} };
  if (search) filters.where.OR = [{ nama_produk: { contains: search, mode: 'insensitive' } }, { deskripsi: { contains: search, mode: 'insensitive' } }];
  if (category) filters.where.kategori = category;
  if (minPrice || maxPrice) filters.where.harga = {};
  if (minPrice) filters.where.harga.gte = Number(minPrice);
  if (maxPrice) filters.where.harga.lte = Number(maxPrice);
  if (rating) filters.where.rating = { gte: Number(rating) };
  filters.orderBy = [];
  if (sort === 'terlaris') filters.orderBy.push({ terjual: 'desc' });
  if (sort === 'terbaru') filters.orderBy.push({ created_at: 'desc' });
  const products = await prisma.product.findMany({
    ...filters,
    include: { images: true }
  });
  res.json({ products });
});

app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) }, include: { images: true } });
  res.json({ product });
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { productId, qty } = req.body;
  const existing = await prisma.cart.findFirst({ where: { user_id: req.user.id, product_id: Number(productId) } });
  if (existing) {
    const cart = await prisma.cart.update({ where: { id: existing.id }, data: { qty: existing.qty + Number(qty) } });
    return res.json({ cart });
  }
  const cart = await prisma.cart.create({ data: { user_id: req.user.id, product_id: Number(productId), qty: Number(qty) } });
  res.json({ cart });
});

app.get('/api/cart', authMiddleware, async (req, res) => {
  const cart = await prisma.cart.findMany({ where: { user_id: req.user.id }, include: { product: { include: { images: true } } } });
  res.json({ cart });
});

app.put('/api/cart/:id', authMiddleware, async (req, res) => {
  const { qty } = req.body;
  const cart = await prisma.cart.update({ where: { id: Number(req.params.id) }, data: { qty: Number(qty) } });
  res.json({ cart });
});

app.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  await prisma.cart.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

app.post('/api/wishlist', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  const existing = await prisma.wishlist.findFirst({ where: { user_id: req.user.id, product_id: Number(productId) } });
  if (existing) return res.status(400).json({ error: 'Already in wishlist' });
  const wishlist = await prisma.wishlist.create({ data: { user_id: req.user.id, product_id: Number(productId) } });
  res.json({ wishlist });
});

app.get('/api/wishlist', authMiddleware, async (req, res) => {
  const wishlist = await prisma.wishlist.findMany({ where: { user_id: req.user.id }, include: { product: { include: { images: true } } } });
  res.json({ wishlist });
});

app.delete('/api/wishlist/:id', authMiddleware, async (req, res) => {
  await prisma.wishlist.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  const { alamat, ekspedisi, pembayaran, catatan, orderItems } = req.body;
  const total = orderItems.reduce((sum, item) => sum + item.qty * item.harga, 0);
  const order = await prisma.order.create({
    data: {
      user_id: req.user.id,
      total,
      alamat,
      ekspedisi,
      pembayaran,
      status: 'Menunggu Pembayaran',
      catatan,
      items: { create: orderItems.map(item => ({ product_id: item.productId, qty: item.qty, harga: item.harga })) }
    },
    include: { items: true }
  });
  io.emit('order_created', { orderId: order.id, status: order.status });
  res.json({ order });
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  const orders = await prisma.order.findMany({ where: { user_id: req.user.id }, include: { items: true } });
  res.json({ orders });
});

app.put('/api/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: Number(req.params.id) }, data: { status } });
  io.emit('order_status_updated', { orderId: order.id, status });
  res.json({ order });
});

app.post('/api/reviews', authMiddleware, async (req, res) => {
  const { productId, rating, komentar, foto } = req.body;
  const review = await prisma.review.create({ data: { user_id: req.user.id, product_id: Number(productId), rating: Number(rating), komentar, foto } });
  res.json({ review });
});

app.get('/api/reviews/product/:productId', async (req, res) => {
  const reviews = await prisma.review.findMany({ where: { product_id: Number(req.params.productId) }, include: { user: true } });
  res.json({ reviews });
});

app.get('/api/admin/metrics', authMiddleware, adminMiddleware, async (req, res) => {
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } });
  res.json({ totalProducts, totalUsers, totalOrders, totalRevenue: totalRevenue._sum.total || 0 });
});

app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true, user: true } });
  res.json({ orders });
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

app.get('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
  const products = await prisma.product.findMany({ include: { images: true } });
  res.json({ products });
});

app.post('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
  const { nama_produk, slug, deskripsi, harga, diskon, stok, kategori, berat, rating, gambar, imageUrls } = req.body;
  const product = await prisma.product.create({ data: { nama_produk, slug, deskripsi, harga: Number(harga), diskon: Number(diskon), stok: Number(stok), kategori, berat: Number(berat), rating: Number(rating), gambar, images: { create: (imageUrls || []).map(url => ({ image_url: url })) } } });
  res.json({ product });
});

app.put('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { nama_produk, slug, deskripsi, harga, diskon, stok, kategori, berat, rating, gambar, imageUrls } = req.body;
  const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: { nama_produk, slug, deskripsi, harga: Number(harga), diskon: Number(diskon), stok: Number(stok), kategori, berat: Number(berat), rating: Number(rating), gambar, images: { deleteMany: {}, create: (imageUrls || []).map(url => ({ image_url: url })) } } });
  res.json({ product });
});

app.delete('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.json({ success: true });
});

app.post('/api/admin/vouchers', authMiddleware, adminMiddleware, async (req, res) => {
  const { kode, diskon, tanggal_mulai, tanggal_berakhir } = req.body;
  const voucher = await prisma.voucher.create({ data: { kode, diskon: Number(diskon), tanggal_mulai: new Date(tanggal_mulai), tanggal_berakhir: new Date(tanggal_berakhir) } });
  res.json({ voucher });
});

io.on('connection', socket => {
  console.log('Socket connected', socket.id);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const port = Number(process.env.PORT || 4000);
server.listen(port, () => console.log(`Naichii Bakery backend running on port ${port}`));
