const testimonials = [
  { name: 'Dina', comment: 'Roti dan cake Naichii sangat lembut dan harum. Pengiriman cepat, rasanya juara!', role: 'Pelanggan Setia' },
  { name: 'Rian', comment: 'Belanja mudah, pilihan produk lengkap, dan customer service ramah.', role: 'Pelanggan' },
  { name: 'Lina', comment: 'Cocok untuk kado ulang tahun. Packaging rapi dan kualitas top.', role: 'Pelanggan' }
];

export default function TestimonialSection() {
  return (
    <section className="py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-brownLight">Testimoni</p>
          <h2 className="text-3xl font-semibold text-brownDark">Kata Pelanggan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(item => (
            <div key={item.name} className="rounded-3xl border border-brownLight bg-white p-6 shadow-sm">
              <p className="text-sm leading-7 text-brownDark/80">“{item.comment}”</p>
              <div className="mt-6">
                <p className="font-semibold text-brownDark">{item.name}</p>
                <p className="text-sm text-brownLight">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
