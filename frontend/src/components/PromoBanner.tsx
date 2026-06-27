const slides = [
  { title: 'Diskon Spesial 25%', subtitle: 'Nikmati promo bakery premium setiap hari.', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80' },
  { title: 'Kue Red Velvet', subtitle: 'Rasakan cake lembut dengan cream cheese terbaik.', image: 'https://images.unsplash.com/photo-1541599540903-216a46ca9c86?auto=format&fit=crop&w=1000&q=80' },
  { title: 'Croissant Butter', subtitle: 'Renyah di luar, lembut di dalam.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80' },
];

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-brownDark text-white shadow-xl">
      <div className="grid gap-6 md:grid-cols-3">
        {slides.map((slide, index) => (
          <article key={slide.title} className="relative min-h-[320px] overflow-hidden bg-cover bg-center p-8 md:p-10" style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="absolute inset-0 bg-brownDark/70" />
            <div className="relative z-10 flex h-full flex-col justify-center gap-3">
              <span className="text-sm uppercase tracking-[0.4em] text-brownLight/90">Promo</span>
              <h3 className="text-3xl font-bold">{slide.title}</h3>
              <p className="max-w-sm text-sm leading-6 text-white/90">{slide.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
