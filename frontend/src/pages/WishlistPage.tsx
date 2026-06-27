import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    nama_produk: string;
    harga: number;
    diskon: number;
    gambar: string;
  };
}

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get('/wishlist').then(res => setWishlist(res.data.wishlist)).catch(console.error);
  }, [user]);

  const removeItem = async (id: number) => {
    await api.delete(`/wishlist/${id}`);
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center text-brownDark">
          <p className="text-xl font-semibold">Silakan login untuk melihat wishlist Anda.</p>
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
        <h1 className="mb-8 text-3xl font-semibold text-brownDark">Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-brownDark">Wishlist masih kosong.</p>
            <Link to="/" className="mt-5 inline-block rounded-full bg-brownDark px-6 py-3 text-white">Temukan Produk</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlist.map(item => {
              const price = item.product.harga - (item.product.harga * item.product.diskon) / 100;
              return (
                <div key={item.id} className="rounded-[2rem] border border-brownLight bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <img src={item.product.gambar} alt={item.product.nama_produk} className="h-28 w-28 rounded-3xl object-cover" />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-brownDark">{item.product.nama_produk}</h2>
                      <p className="mt-2 text-sm text-brownDark/70">Rp{price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button className="rounded-full bg-brownDark px-5 py-3 text-sm font-semibold text-white">Tambah ke Keranjang</button>
                      <button onClick={() => removeItem(item.id)} className="rounded-full border border-brownDark px-5 py-3 text-sm text-brownDark">Hapus</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
