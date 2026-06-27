const categories = ['Roti Manis', 'Croissant', 'Donat', 'Cake', 'Pastry', 'Cookies', 'Brownies', 'Minuman'];

export default function CategoryGrid() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-brownLight">Kategori</p>
            <h2 className="text-3xl font-semibold text-brownDark">Jelajahi Menu Bakery</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(kategori => (
            <div key={kategori} className="rounded-3xl border border-brownLight bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <p className="text-base font-semibold text-brownDark">{kategori}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
