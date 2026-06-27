import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  nama_produk: string;
  gambar: string;
  harga: number;
  diskon: number;
  kategori: string;
  rating: number;
  terjual: number;
}

export default function ProductCard({ id, nama_produk, gambar, harga, diskon, kategori, rating, terjual }: ProductCardProps) {
  const discountPrice = harga - (harga * diskon) / 100;

  return (
    <Link to={`/product/${id}`} className="group overflow-hidden rounded-3xl border border-brownLight bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden bg-cream">
        <img src={gambar} alt={nama_produk} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-brownLight">{kategori}</div>
        <h3 className="text-sm font-semibold text-brownDark">{nama_produk}</h3>
        <div className="flex items-center gap-2 text-sm text-brownDark/80">
          <span className="font-semibold text-brownDark">Rp{discountPrice.toLocaleString('id-ID')}</span>
          {diskon > 0 && <span className="text-xs line-through text-brownLight">Rp{harga.toLocaleString('id-ID')}</span>}
        </div>
        <div className="flex items-center justify-between text-xs text-brownDark/70">
          <span>⭐ {rating}</span>
          <span>{terjual} terjual</span>
        </div>
      </div>
    </Link>
  );
}
