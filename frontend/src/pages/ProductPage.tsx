import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api';

interface ProductDetail {
  id: number;
  nama_produk: string;
  deskripsi: string;
  harga: number;
  diskon: number;
  stok: number;
  kategori: string;
  berat: number;
  rating: number;
  terjual: number;
  gambar: string;
  images: Array<{ image_url: string }>;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}`).then(res => setProduct(res.data.product)).catch(console.error);
  }, [id]);

  if (!product) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4 text-brownDark">Memuat produk...</div>
      <Footer />
    </div>
  );

  const finalPrice = product.harga - (product.harga * product.diskon) / 100;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[2rem] bg-brownDark/5 p-4">
                <img src={product.gambar} alt={product.nama_produk} className="h-full w-full rounded-[2rem] object-cover" />
              </div>
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-brownLight/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brownDark">{product.kategori}</span>
                <h1 className="text-3xl font-bold text-brownDark">{product.nama_produk}</h1>
                <div className="flex items-center gap-4 text-sm text-brownDark/80">
                  <span>⭐ {product.rating}</span>
                  <span>{product.terjual} terjual</span>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-brownDark">Rp{finalPrice.toLocaleString('id-ID')}</p>
                  {product.diskon > 0 && <p className="text-sm text-brownLight line-through">Rp{product.harga.toLocaleString('id-ID')}</p>}
                </div>
                <p className="text-sm leading-7 text-brownDark/80">{product.deskripsi}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-brownLight/10 p-4 text-sm font-medium text-brownDark">Stok {product.stok}</div>
                  <div className="rounded-3xl bg-brownLight/10 p-4 text-sm font-medium text-brownDark">Berat {product.berat} gr</div>
                </div>
                <button className="mt-4 w-full rounded-3xl bg-brownDark px-6 py-4 text-sm font-semibold text-white transition hover:bg-brownLight">Tambah ke Keranjang</button>
              </div>
            </div>
            <div className="rounded-[2rem] border border-brownLight p-6">
              <h2 className="text-xl font-semibold text-brownDark">Galeri Foto</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {product.images.map((item, index) => (
                  <img key={index} src={item.image_url} alt={`${product.nama_produk} ${index + 1}`} className="h-52 w-full rounded-3xl object-cover" />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-brownDark">Informasi Pembelian</h2>
              <div className="mt-4 space-y-3 text-sm text-brownDark/80">
                <p><strong>Metode :</strong> Produk bisa dipesan via checkout segera.</p>
                <p><strong>Diskon :</strong> Hemat sampai {product.diskon}% untuk waktu terbatas.</p>
                <p><strong>Ekspedisi :</strong> JNE, J&T, SiCepat, Pos Indonesia, AnterAja.</p>
              </div>
            </div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-brownDark">Ulasan</h2>
              <p className="mt-4 text-sm text-brownDark/80">Pelanggan memberikan nilai tinggi berkat kualitas rasa dan kemasan yang menarik.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
