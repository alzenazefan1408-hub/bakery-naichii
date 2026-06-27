import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/#products' },
  { label: 'Promo', path: '/#promo' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Keranjang', path: '/cart' },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-brownLight bg-cream/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3 font-semibold text-brownDark">
          <div className="h-10 w-10 rounded-2xl bg-brownLight p-2 text-white">N</div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em]">Naichii</p>
            <p className="text-lg font-bold">Bakery</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `text-sm font-medium transition ${isActive ? 'text-brownDark' : 'text-brownLight hover:text-brownDark'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-brownDark">Halo, {user.nama}</span>
              <button onClick={logout} className="rounded-full bg-brownDark px-4 py-2 text-white transition hover:bg-brownLight">Logout</button>
            </>
          ) : (
            <Link to="/login" className="rounded-full border border-brownDark px-4 py-2 text-sm text-brownDark transition hover:bg-brownDark hover:text-white">Masuk</Link>
          )}
        </div>
      </div>
    </header>
  );
}
