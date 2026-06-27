export default function Footer() {
  return (
    <footer className="border-t border-brownLight bg-white/90 py-10 text-brownDark">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-xl font-semibold">Naichii Bakery</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-brownDark/80">Nikmati aneka roti, cake, donat, pastry, dan minuman premium dengan tampilan profesional, cepat, dan mudah.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold">Kategori</h4>
          <ul className="mt-3 space-y-2 text-sm text-brownDark/80">
            <li>Roti Manis</li>
            <li>Croissant</li>
            <li>Donat</li>
            <li>Cake</li>
            <li>Pastry</li>
            <li>Cookies</li>
            <li>Brownies</li>
            <li>Minuman</li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold">Hubungi Kami</h4>
          <p className="mt-3 text-sm leading-6 text-brownDark/80">Email: support@naichii.com</p>
          <p className="text-sm leading-6 text-brownDark/80">Telepon: 0812-3456-7890</p>
          <p className="text-sm leading-6 text-brownDark/80">Alamat: Jl. Bakery Ceria No.12, Jakarta</p>
        </div>
      </div>
      <div className="mt-10 border-t border-brownLight/60 py-4 text-center text-sm text-brownDark/70">© 2026 Naichii Bakery. Semua hak cipta dilindungi.</div>
    </footer>
  );
}
