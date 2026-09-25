import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import brandLogo from '../assets/LMC_Buyer.png';

const NAV_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Impact', href: '#impact' },
  { label: 'FAQ', href: '#faq' },
];

/** Sticky glass navbar with mobile menu. */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route/hash changes
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2.5" aria-label="LastMile Carbon home">
          <img src={brandLogo} alt="LastMile Carbon" className="h-8 w-auto object-contain sm:h-9" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-brand-500"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/install"
            className="hidden items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(252,128,25,0.35)] transition-colors hover:bg-brand-600 xs:inline-flex"
          >
            Install App
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-orange-50 sm:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-orange-100 bg-white transition-[max-height,opacity] duration-300 sm:hidden ${
          open ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-1 px-4 py-3">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-orange-50 hover:text-brand-600"
            >
              {label}
            </a>
          ))}
          <Link
            to="/install"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Install App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
