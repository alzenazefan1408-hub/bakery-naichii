import { useEffect, useState } from 'react';
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
  };
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const [namaPenerima, setNamaPenerima] = useState(user?.nama || '');
  const [nomorHp, setNomorHp] = useState('');
  const [alamat, setAlamat] = useState('Jl. Bakery Ceria No.12, Jakarta');
  const [catatan, setCatatan] = useState('');
  const [ekspedisi, setEkspedisi] = useState('JNE');
  const [pembayaran, setPembayaran] = useState('Transfer Bank - BCA');
  const [message, setMessage] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    async function loadCart() {
      try {
        const response = await api.get('/cart');
        setCart(response.data.cart);
      } catch (err) {
        console.error(err);
      }
    }
    if (user) loadCart();
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.qty * (item.product.harga - (item.product.harga * item.product.diskon) / 100), 0);

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setMessage('Silakan login terlebih dahulu.');
      return;
    }
    try {
      await api.post('/orders', {
        alamat,
        ekspedisi,
        pembayaran,
        catatan,
        orderItems: cart.map(item => ({ productId: item.product.id, qty: item.qty, harga: item.product.harga - (item.product.harga * item.product.diskon) / 100 }))
      });
      setMessage('Checkout berhasil. Cek status pesanan di halaman riwayat.');
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat checkout.');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-brownDark">Checkout</h1>
          <div className="mb-8 rounded-[2rem] border border-brownLight bg-cream p-6">
            <h2 className="mb-4 text-xl font-semibold text-brownDark">Ringkasan Keranjang</h2>
            {cart.length === 0 ? (
              <p className="text-sm text-brownDark/70">Keranjang kosong. Silakan tambahkan produk terlebih dahulu.</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => {
                  const price = item.product.harga - (item.product.harga * item.product.diskon) / 100;
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl bg-white p-4">
                      <div>
                        <p className="font-semibold text-brownDark">{item.product.nama_produk}</p>
                        <p className="text-sm text-brownDark/70">{item.qty} x Rp{price.toLocaleString('id-ID')}</p>
                      </div>
                      <p className="font-semibold text-brownDark">Rp{(price * item.qty).toLocaleString('id-ID')}</p>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between border-t border-brownLight/50 pt-4 text-sm font-semibold text-brownDark">
                  <span>Total</span>
                  <span>Rp{total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-brownDark">Nama Penerima</label>
                <input value={namaPenerima} onChange={e => setNamaPenerima(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-brownDark">Nomor HP</label>
                <input value={nomorHp} onChange={e => setNomorHp(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brownDark">Alamat Lengkap</label>
              <textarea value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" rows={4} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brownDark">Catatan Pesanan</label>
              <textarea value={catatan} onChange={e => setCatatan(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" rows={3} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-brownDark">Pilih Ekspedisi</label>
                <select value={ekspedisi} onChange={e => setEkspedisi(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark">
                  <option>JNE</option>
                  <option>J&T</option>
                  <option>SiCepat</option>
                  <option>Pos Indonesia</option>
                  <option>AnterAja</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-brownDark">Metode Pembayaran</label>
                <select value={pembayaran} onChange={e => setPembayaran(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark">
                  <option>Transfer Bank - BCA</option>
                  <option>Transfer Bank - BRI</option>
                  <option>Transfer Bank - BNI</option>
                  <option>Transfer Bank - Mandiri</option>
                  <option>DANA</option>
                  <option>OVO</option>
                  <option>GoPay</option>
                  <option>ShopeePay</option>
                  <option>QRIS</option>
                  <option>COD</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full rounded-full bg-brownDark px-6 py-4 text-white">Bayar Sekarang</button>
            {message && <p className="text-center text-sm text-brownDark/80">{message}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
