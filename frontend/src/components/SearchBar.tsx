interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const categories = ['Semua', 'Roti Manis', 'Croissant', 'Donat', 'Cake', 'Pastry', 'Cookies', 'Brownies', 'Minuman'];

export default function SearchBar({ query, onQueryChange, category, onCategoryChange, sort, onSortChange }: SearchBarProps) {
  return (
    <div className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-[1.8fr_1fr] lg:grid-cols-[2.2fr_1fr_1fr]">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brownDark">Cari Produk</label>
        <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Cari donat, cake, croissant..." className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brownDark">Kategori</label>
        <select value={category} onChange={e => onCategoryChange(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark">
          {categories.map(item => (<option key={item} value={item === 'Semua' ? '' : item}>{item}</option>))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brownDark">Sortir</label>
        <select value={sort} onChange={e => onSortChange(e.target.value)} className="w-full rounded-3xl border border-brownLight bg-cream px-4 py-3 outline-none focus:border-brownDark">
          <option value="">Default</option>
          <option value="terlaris">Terlaris</option>
          <option value="terbaru">Terbaru</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>
    </div>
  );
}
