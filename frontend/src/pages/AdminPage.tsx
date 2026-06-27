import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ totalProducts: 0, totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    api.get('/admin/metrics').then(res => setMetrics(res.data)).catch(console.error);
    api.get('/admin/orders').then(res => setOrders(res.data.orders)).catch(console.error);
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-10 text-center text-brownDark">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-xl font-semibold">Halaman admin hanya untuk pengguna terotorisasi.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="mb-8 text-3xl font-semibold text-brownDark">Dashboard Admin</h1>
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-brownLight">Total Produk</p>
            <p className="mt-4 text-3xl font-semibold text-brownDark">{metrics.totalProducts}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-brownLight">Total Pelanggan</p>
            <p className="mt-4 text-3xl font-semibold text-brownDark">{metrics.totalUsers}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-brownLight">Total Pesanan</p>
            <p className="mt-4 text-3xl font-semibold text-brownDark">{metrics.totalOrders}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-brownLight">Total Pendapatan</p>
            <p className="mt-4 text-3xl font-semibold text-brownDark">Rp{metrics.totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-brownDark">Pesanan Terbaru</h2>
          </div>
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="rounded-3xl border border-brownLight p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-brownDark">Pesanan #{order.id}</p>
                    <p className="text-sm text-brownDark/75">{order.user.nama} - {order.status}</p>
                  </div>
                  <p className="text-sm font-semibold text-brownDark">Rp{order.total.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
