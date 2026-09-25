import { useEffect, useRef, useState } from 'react';
import { Loader2, Share } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import loginIntro from '../assets/loginintro.png';

// Optional: point to a hosted APK/Play Store link via env, e.g. VITE_INSTALL_URL
const INSTALL_URL = import.meta.env.VITE_INSTALL_URL || '';

export default function InstallLanding() {
  const [status, setStatus] = useState('default'); // default | pending | coming-soon | ios-hint | installed
  const [installPrompt, setInstallPrompt] = useState(null);
  const [allowFloat, setAllowFloat] = useState(false);

  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const bubble1Ref = useRef(null);
  const bubble2Ref = useRef(null);

  // PWA install availability (Android/Chrome)
  useEffect(() => {
    const onBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    const onInstalled = () => setStatus('installed');
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Entrance choreography + ambient motion
  useGSAP(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const items = gsap.utils.toArray('.anim-item');

      if (reducedMotion) {
        gsap.set([cardRef.current, ...items], { opacity: 1, y: 0, scale: 1, filter: 'none' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 48, scale: 0.94, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9 }
      );

      tl.fromTo(
        items,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 },
        '-=0.35'
      );

      tl.fromTo(
        sheenRef.current,
        { xPercent: -180 },
        { xPercent: 340, duration: 1.15, ease: 'power2.inOut' },
        '-=0.15'
      );

      setAllowFloat(true);

      gsap.to(bubble1Ref.current, {
        x: 44, y: 32, scale: 1.08,
        duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to(bubble2Ref.current, {
        x: -52, y: -38, scale: 1.1,
        duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5
      });
    },
    { scope: rootRef }
  );

  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const handleInstall = async () => {
    if (status === 'pending') return;
    setStatus('pending');

    // 1) Native PWA install dialog when available (Android/Chrome)
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      setStatus(outcome === 'accepted' ? 'installed' : 'default');
      setInstallPrompt(null);
      return;
    }

    // 2) Hosted package link (APK / store) when configured
    if (INSTALL_URL) {
      try {
        const res = await fetch(INSTALL_URL, { method: 'HEAD' });
        if (res.ok) {
          window.location.href = INSTALL_URL;
          return;
        }
      } catch {
        /* fall through to fallback */
      }
    }

    // 3) iOS Safari: guide users to Add to Home Screen
    if (isIOS()) {
      setStatus('ios-hint');
      setTimeout(() => setStatus('default'), 8000);
      return;
    }

    // 4) Fallback — never show a broken link or error page
    setStatus('coming-soon');
    setTimeout(() => setStatus('default'), 4000);
  };

  const isFallback = status === 'coming-soon' || status === 'ios-hint';
  const isPending = status === 'pending';

  return (
    <div
      ref={rootRef}
      className="font-poppins relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-500 to-brand-400 px-4"
    >
      <div
        ref={bubble1Ref}
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl will-change-transform sm:h-96 sm:w-96"
      />
      <div
        ref={bubble2Ref}
        className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl will-change-transform sm:h-[28rem] sm:w-[28rem]"
      />

      <div
        ref={cardRef}
        className={`install-card relative z-10 w-full max-w-sm px-8 py-12 text-center opacity-0 shadow-[0_25px_60px_rgba(0,0,0,0.18)] will-change-transform sm:max-w-md sm:px-10 sm:py-14 ${
          allowFloat ? 'install-card-float' : ''
        }`}
        role="main"
      >
        <div ref={sheenRef} className="install-sheen" aria-hidden="true" />

        <img
          src={loginIntro}
          alt="LastMile Carbon logo"
          className="anim-item mx-auto h-14 w-auto object-contain opacity-0 drop-shadow-[0_4px_14px_rgba(0,0,0,0.25)] sm:h-16"
        />
        <h1 className="anim-item mt-5 text-3xl font-extrabold tracking-tight text-white opacity-0 [text-shadow:0_2px_10px_rgba(0,0,0,0.15)] sm:text-4xl">
          LastMile Carbon
        </h1>

        <p className="anim-item mt-3 text-sm font-normal leading-relaxed text-white/90 opacity-0 sm:text-base">
          Real-time carbon intelligence for delivery riders.
        </p>

        <button
          onClick={handleInstall}
          disabled={isPending}
          className="install-btn anim-item mt-9 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-10 py-3.5 text-base font-semibold opacity-0 transition-transform duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:cursor-wait hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] sm:w-auto"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {status === 'installed' ? 'Opening App…' : 'Install App'}
        </button>

        <p className="anim-item mt-3 text-xs text-white/70 opacity-0">
          Free · No sign-up needed
        </p>

        <p
          className={`mt-4 text-sm font-medium text-white transition-all duration-300 ${
            isFallback ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
          aria-live="polite"
          role="status"
        >
          {status === 'ios-hint' ? (
            <span className="inline-flex items-center gap-1.5">
              <Share className="h-4 w-4" aria-hidden="true" />
              Tap Share → "Add to Home Screen"
            </span>
          ) : (
            'App coming soon'
          )}
        </p>
      </div>
    </div>
  );
}