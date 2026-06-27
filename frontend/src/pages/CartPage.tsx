import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface CartItem {
  id: number;
  qty: number;
  product: {
    id: number;
    nama_produk: string;
    harga: number;
    diskon: number;
    gambar: string;
    stok: number;
  };
}

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get('/cart').then(res => setCart(res.data.cart)).catch(console.error);
  }, [user]);

  const updateQty = async (id: number, qty: number) => {
    if (qty < 1) return;
    await api.put(`/cart/${id}`, { qty });
    setCart(prev => prev.map(item => (item.id === id ? { ...item, qty } : item)));
  };

  const deleteItem = async (id: number) => {
    await api.delete(`/cart/${id}`);
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.qty * (item.product.harga - (item.product.harga * item.product.diskon) / 100), 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center text-brownDark">
          <p className="text-xl font-semibold">Silakan login untuk melihat keranjang Anda.</p>
          <Link to="/login" className="rounded-full bg-brownDark px-6 py-3 text-white">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="mb-8 text-3xl font-semibold text-brownDark">Keranjang Saya</h1>
        {cart.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-brownDark">Keranjang kosong.</p>
            <Link to="/" className="mt-5 inline-block rounded-full bg-brownDark px-6 py-3 text-white">Belanja Sekarang</Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.8fr_0.8fr]">
            <div className="space-y-6">
              {cart.map(item => {
                const price = item.product.harga - (item.product.harga * item.product.diskon) / 100;
                return (
                  <div key={item.id} className="rounded-[2rem] border border-brownLight bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      <img src={item.product.gambar} alt={item.product.nama_produk} className="h-28 w-28 rounded-3xl object-cover" />
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold text-brownDark">{item.product.nama_produk}</h2>
                        <p className="mt-2 text-sm text-brownDark/70">Rp{price.toLocaleString('id-ID')} x {item.qty}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button onClick={() => updateQty(item.id, item.qty - 1)} className="rounded-full border border-brownLight px-4 py-2 text-sm">-</button>
                          <span className="text-sm font-semibold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.qty + 1)} className="rounded-full border border-brownLight px-4 py-2 text-sm">+</button>
                          <button onClick={() => deleteItem(item.id)} className="rounded-full bg-brownLight px-4 py-2 text-sm text-brownDark">Hapus</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-brownDark">Ringkasan Pesanan</h2>
              <div className="mt-6 space-y-4 text-sm text-brownDark/80">
                <div className="flex justify-between"><span>Total Produk</span><span>{cart.length}</span></div>
                <div className="flex justify-between"><span>Total Harga</span><span className="font-semibold text-brownDark">Rp{total.toLocaleString('id-ID')}</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} className="mt-8 w-full rounded-full bg-brownDark px-6 py-4 text-white">Lanjut ke Checkout</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
