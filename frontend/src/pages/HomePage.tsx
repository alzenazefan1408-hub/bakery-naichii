import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromoBanner from '../components/PromoBanner';
import CategoryGrid from '../components/CategoryGrid';
import TestimonialSection from '../components/TestimonialSection';
import ProductCard from '../components/ProductCard';
import api from '../api';

interface Product {
  id: number;
  nama_produk: string;
  harga: number;
  diskon: number;
  kategori: string;
  rating: number;
  terjual: number;
  gambar: string;
}

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const best = await api.get('/products?sort=terlaris');
        const newest = await api.get('/products?sort=terbaru');
        setBestSellers(best.data.products.slice(0, 4));
        setNewProducts(newest.data.products.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative overflow-hidden bg-bakery-pattern px-4 py-10 md:px-6">
        <section className="mx-auto max-w-7xl rounded-[2rem] bg-white/90 p-8 shadow-2xl md:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-brownLight/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-brownDark">Bakery Premium</span>
              <h1 className="text-4xl font-bold tracking-tight text-brownDark md:text-5xl">Naichii Bakery: Kue, Roti, dan Minuman Premium</h1>
              <p className="max-w-xl text-base leading-8 text-brownDark/80">Dapatkan roti manis, cake, donat, pastry, dan minuman premium dengan tampilan modern dan pengalaman belanja cepat ala Shopee & TikTok Shop.</p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="rounded-full bg-brownDark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brownLight">Lihat Produk</a>
                <a href="#promo" className="rounded-full border border-brownDark px-6 py-3 text-sm font-semibold text-brownDark transition hover:bg-brownDark hover:text-white">Promo Hari Ini</a>
              </div>
            </div>
            <div className="rounded-[2rem] bg-brownDark/5 p-6">
              <img src="https://images.unsplash.com/photo-1599785209791-0f5becddcfe9?auto=format&fit=crop&w=900&q=80" alt="Naichii Bakery" className="w-full rounded-[2rem] object-cover" />
            </div>
          </div>
        </section>

        <section id="promo" className="mt-14">
          <PromoBanner />
        </section>

        <CategoryGrid />

        <section id="products" className="py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-brownLight">Produk Terlaris</p>
                <h2 className="text-3xl font-semibold text-brownDark">Favorit Pelanggan</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {bestSellers.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-brownLight">Produk Terbaru</p>
                <h2 className="text-3xl font-semibold text-brownDark">Varian Baru</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {newProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="rounded-[2rem] bg-brownLight/10 p-8 text-center">
              <p className="text-sm uppercase tracking-[0.4em] text-brownDark">Promo Spesial</p>
              <h2 className="mt-4 text-3xl font-semibold text-brownDark">Potongan Harga dan Voucher Eksklusif</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-brownDark/80">Gunakan kode voucher saat checkout dan dapatkan diskon langsung untuk roti, cake, pastry, dan minuman favorit.</p>
            </div>
          </div>
        </section>

        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
}
