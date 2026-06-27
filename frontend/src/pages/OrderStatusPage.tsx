import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import OrdersStatusTimeline from '../components/OrdersStatusTimeline';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function OrderStatusPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    api.get('/orders').then(res => setOrders(res.data.orders)).catch(console.error);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-10 text-center text-brownDark">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="mb-4 text-xl font-semibold">Silakan login untuk melihat status pesanan.</p>
            <Link to="/login" className="rounded-full bg-brownDark px-6 py-3 text-white">Masuk</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="mb-8 text-3xl font-semibold text-brownDark">Status Pesanan Saya</h1>
        {orders.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-brownDark">Anda belum memiliki pesanan.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-brownDark">Pesanan #{order.id}</p>
                    <p className="text-sm text-brownDark/70">Total Rp{order.total.toLocaleString('id-ID')}</p>
                  </div>
                  <span className="rounded-full bg-brownLight/30 px-4 py-2 text-sm text-brownDark">{order.status}</span>
                </div>
                <div className="mt-6">
                  <OrdersStatusTimeline currentStatus={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
