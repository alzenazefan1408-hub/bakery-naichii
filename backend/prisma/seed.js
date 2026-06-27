import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.createMany({
    data: [
      { nama: 'Admin Naichii', email: 'admin@naichii.com', password: passwordHash, nomor_hp: '081234567890', role: 'admin' },
      { nama: 'Rina Bakery', email: 'rina@naichii.com', password: await bcrypt.hash('Customer123!', 10), nomor_hp: '081987654321' }
    ],
    skipDuplicates: true
  });

  const categories = ['Roti Manis', 'Croissant', 'Donat', 'Cake', 'Pastry', 'Cookies', 'Brownies', 'Minuman'];
  await Promise.all(categories.map(nama_kategori => prisma.category.upsert({ where: { nama_kategori }, update: {}, create: { nama_kategori } })));

  await prisma.product.createMany({
    data: [
      { nama_produk: 'Croissant Butter', slug: 'croissant-butter', deskripsi: 'Croissant lembut dengan aroma butter premium.', harga: 28000, diskon: 10, stok: 45, kategori: 'Croissant', berat: 80, rating: 4.8, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/croissant.jpg', terjual: 220 },
      { nama_produk: 'Donat Coklat', slug: 'donat-coklat', deskripsi: 'Donat coklat lembut dengan topping glaze premium.', harga: 22000, diskon: 5, stok: 78, kategori: 'Donat', berat: 90, rating: 4.7, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/donut.jpg', terjual: 180 },
      { nama_produk: 'Red Velvet Cake', slug: 'red-velvet-cake', deskripsi: 'Cake red velvet lembut dengan cream cheese frosting.', harga: 180000, diskon: 15, stok: 20, kategori: 'Cake', berat: 800, rating: 4.9, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/red-velvet-cake.jpg', terjual: 90 },
      { nama_produk: 'Roti Tawar Gandum', slug: 'roti-tawar-gandum', deskripsi: 'Roti tawar gandum sehat dengan tekstur lembut.', harga: 35000, diskon: 0, stok: 60, kategori: 'Roti Manis', berat: 500, rating: 4.6, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/wholewheat-bread.jpg', terjual: 130 },
      { nama_produk: 'Coklat Chip Cookies', slug: 'coklat-chip-cookies', deskripsi: 'Cookies renyah dengan potongan coklat premium.', harga: 30000, diskon: 10, stok: 50, kategori: 'Cookies', berat: 120, rating: 4.7, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/cookies.jpg', terjual: 145 },
      { nama_produk: 'Brownies Panggang', slug: 'brownies-panggang', deskripsi: 'Brownies panggang coklat dengan tekstur moist.', harga: 45000, diskon: 10, stok: 40, kategori: 'Brownies', berat: 150, rating: 4.8, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/brownies.jpg', terjual: 115 },
      { nama_produk: 'Latte Susu', slug: 'latte-susu', deskripsi: 'Minuman latte lembut dengan susu premium.', harga: 25000, diskon: 0, stok: 100, kategori: 'Minuman', berat: 350, rating: 4.5, gambar: 'https://res.cloudinary.com/demo/image/upload/v1/latte.jpg', terjual: 140 }
    ],
    skipDuplicates: true
  });

  const products = await prisma.product.findMany();
  for (const product of products) {
    const existing = await prisma.productImage.findFirst({ where: { product_id: product.id } });
    if (!existing) {
      await prisma.productImage.create({ data: { product_id: product.id, image_url: product.gambar } });
    }
  }

  await prisma.voucher.createMany({
    data: [
      { kode: 'NAICHII10', diskon: 10, tanggal_mulai: new Date(), tanggal_berakhir: new Date(new Date().setMonth(new Date().getMonth() + 1)) },
      { kode: 'BAKERY25', diskon: 25, tanggal_mulai: new Date(), tanggal_berakhir: new Date(new Date().setMonth(new Date().getMonth() + 1)) }
    ],
    skipDuplicates: true
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
