import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { user } = useAuth();
  const [namaPenerima, setNamaPenerima] = useState(user?.nama || '');
  const [nomorHp, setNomorHp] = useState(user?.email ? user.email : '');
  const [alamat, setAlamat] = useState('Jl. Bakery Ceria No.12, Jakarta');
  const [catatan, setCatatan] = useState('');
  const [ekspedisi, setEkspedisi] = useState('JNE');
  const [pembayaran, setPembayaran] = useState('Transfer Bank - BCA');
  const [message, setMessage] = useState('');

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/orders', {
        alamat,
        ekspedisi,
        pembayaran,
        catatan,
        orderItems: [{ productId: 1, qty: 1, harga: 28000 }]
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
