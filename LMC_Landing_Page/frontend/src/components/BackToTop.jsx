import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/** Floating button that appears after scrolling and smooth-scrolls back to top. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-[0_10px_28px_rgba(252,128,25,0.35)] ring-1 ring-brand-100 transition-all duration-300 hover:bg-brand-500 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
