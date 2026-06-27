import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-10 md:px-6">
        <div className="w-full rounded-[2rem] bg-white p-10 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-brownDark">Masuk ke Akun</h1>
          {error && <div className="mb-4 rounded-3xl bg-red-100 p-4 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-brownDark">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" placeholder="email@contoh.com" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-brownDark">Kata Sandi</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" placeholder="Masukkan kata sandi" required />
            </div>
            <button className="w-full rounded-full bg-brownDark px-6 py-3 text-sm font-semibold text-white">Masuk</button>
            <p className="text-center text-sm text-brownDark/70">Belum punya akun? <Link to="/register" className="font-semibold text-brownDark underline">Daftar</Link></p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
