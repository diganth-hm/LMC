import { useEffect, useState } from 'react';

const BRAND_ORANGE = '#fc8019';
const LOADER_MS = 1900;
const SPLIT_MS = 900;
const TOTAL_BUFFER_MS = 80;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readSeen() {
  try {
    return sessionStorage.getItem('introSplashSeen') === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem('introSplashSeen', '1');
  } catch {
    /* private mode */
  }
}

function getInitialPhase() {
  if (readSeen() || prefersReducedMotion()) return 'done';
  return 'loader';
}

interface IntroSplashProps {
  onFinish?: () => void;
}

export default function IntroSplash({ onFinish }: IntroSplashProps) {
  const [phase, setPhase] = useState(getInitialPhase);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (mq.matches && phase === 'loader') setPhase('done');
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'loader') return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setPhase('split'), LOADER_MS);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'split') return;
    const t = setTimeout(() => {
      markSeen();
      setPhase('done');
      onFinish?.();
    }, SPLIT_MS + TOTAL_BUFFER_MS);
    return () => clearTimeout(t);
  }, [phase, onFinish]);

  if (phase === 'done') return null;

  const isSplitting = phase === 'split';

  return (
    <div
      className="fixed inset-0 z-[999] overflow-hidden"
      role="status"
      aria-label="Website intro animation"
    >
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          backgroundColor: BRAND_ORANGE,
          transform: isSplitting ? 'translateX(-100%)' : 'translateX(0)',
          transition: `transform ${SPLIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
          willChange: 'transform',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          backgroundColor: BRAND_ORANGE,
          transform: isSplitting ? 'translateX(100%)' : 'translateX(0)',
          transition: `transform ${SPLIT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
          willChange: 'transform',
        }}
      />
      {!isSplitting && (
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="pendulum-dot"
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#ffffff',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
