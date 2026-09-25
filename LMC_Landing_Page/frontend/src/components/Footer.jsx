import { Link } from 'react-router-dom';
import brandLogo from '../assets/LMC_Buyer.png';

const FOOTER_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Impact', href: '#impact' },
  { label: 'FAQ', href: '#faq' },
];

/** Shared site footer with brand, quick links, and install CTA. */
export default function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <img src={brandLogo} alt="LastMile Carbon logo" className="h-8 w-auto object-contain" />
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
              Real-time carbon intelligence for delivery riders — every route scored, every rider paid.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50">Explore</h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-ink/70 transition-colors hover:text-brand-500">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50">Get started</h3>
            <p className="mt-3 text-sm text-ink/60">Free for riders · Android &amp; iOS</p>
            <Link
              to="/install"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(252,128,25,0.35)] transition-colors hover:bg-brand-600"
            >
              Install App
            </Link>
            <a
              href="https://lastmilecarbon.app/login"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-orange-200 px-5 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-orange-50"
            >
              Login
            </a>
            <p className="mt-2 text-xs text-ink/40">For admins and corporate buyers</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-orange-100 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-ink/50">
            © {new Date().getFullYear()} LastMile Carbon. All rights reserved.
          </p>
          <p className="text-xs text-ink/40">Built for a greener last mile 🌿</p>
        </div>
      </div>
    </footer>
  );
}