import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Route,
  Radar,
  Leaf,
  Gauge,
  BellRing,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';
import TextLoop from '../components/TextLoop';

import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import brandLogo from '../assets/LMC_Buyer.png';

const FEATURES = [
  {
    icon: Route,
    title: 'Smarter, Greener Routes',
    text: 'Mapbox routing plus our Green Route Score picks the lowest-CO2 path for every delivery, not just the fastest one.',
  },
  {
    icon: Radar,
    title: 'Live Route Carbon Tracking',
    text: 'CarbonAPI calculates the CO2 cost of your ride in under 3 seconds, before you even leave for the delivery.',
  },
  {
    icon: Leaf,
    title: 'Green Rewards for Riders',
    text: 'Choose the cleaner route and earn a cash bonus for every kilogram of CO2 you save.',
  },
  {
    icon: Gauge,
    title: 'Green Route Score',
    text: 'A 0-100 score for every route option, so the greenest choice is always obvious at a glance.',
  },
  {
    icon: BellRing,
    title: 'Instant Verified Payouts',
    text: 'Stripe Connect pays your green bonus straight to your account the moment a delivery is verified.',
  },
  {
    icon: BarChart3,
    title: 'Impact Dashboards',
    text: 'Riders and platforms see CO2 saved, routes optimized, and earnings in one clear view.',
  },
];

const STEPS = [
  { n: '1', title: 'Get Assigned', text: 'A delivery comes in and three route options are scored for CO2 in under 3 seconds.' },
  { n: '2', title: 'Choose Green', text: 'Pick the lowest-CO2 route and watch a live emissions meter track the ride.' },
  { n: '3', title: 'Earn Bonus', text: 'Delivery completes, emissions are verified, and your green bonus lands instantly.' },
];

const STATS = [
  { value: 78, suffix: '%', label: 'CO2 reduction (30-day pilot)' },
  { value: 94, suffix: '%', label: 'Green route adoption' },
  { prefix: '₹', value: 18, suffix: 'K', label: 'Extra monthly income (Month 3)' },
  { value: 300, suffix: '', label: 'Trees equivalent saved / rider / year' },
];

const PILOT_RESULTS = [
  { week: 'Week 0', co2: '3.81 kg/day', bonus: '₹0' },
  { week: 'Week 1', co2: '3.12 kg/day', bonus: '₹380' },
  { week: 'Week 2', co2: '2.64 kg/day', bonus: '₹920' },
  { week: 'Week 3', co2: '1.98 kg/day', bonus: '₹1,640' },
  { week: 'Week 4', co2: '0.84 kg/day', bonus: '₹2,180' },
];

const FAQS = [
  {
    q: 'What exactly does LastMile Carbon do?',
    a: 'It scores every delivery route for CO2 in real time using Mapbox and CarbonAPI, then pays riders a cash bonus for choosing the greener option through Stripe Connect.',
  },
  {
    q: 'Do I need special hardware?',
    a: 'No extra hardware. LastMile Carbon runs entirely through the rider app on your existing phone.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'The rider app runs on Android and iOS, and the impact dashboard works in any modern browser.',
  },
  {
    q: 'How is the green bonus calculated?',
    a: 'You earn ₹8.50 for every kilogram of CO2 saved versus the baseline route, verified through CarbonAPI before payout.',
  },
];

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white transition-shadow hover:shadow-[0_10px_28px_rgba(252,128,25,0.10)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-ink-strong">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-50 text-ink">
      <ScrollProgress />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="bg-dots absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <Reveal>
                <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold tracking-wide text-brand-600">
                  Real-time carbon intelligence
                </span>
              </Reveal>
              <Reveal delay={90}>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-strong sm:text-5xl xl:text-6xl">
                  Every route scored.
                  <br />
                  <span className="text-gradient-brand">Every rider paid.</span>
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg lg:mx-0">
                  LastMile Carbon calculates the CO2 cost of your delivery route in real time —
                  and pays you a green bonus for choosing the cleaner one.
                </p>
              </Reveal>
              <Reveal delay={270}>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Link
                    to="/install"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 font-semibold text-white shadow-[0_10px_24px_rgba(252,128,25,0.4)] transition-all hover:-translate-y-0.5 hover:bg-brand-600 sm:w-auto"
                  >
                    Get the App
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#how"
                    className="inline-flex w-full items-center justify-center rounded-full border-2 border-orange-200 px-7 py-3.5 font-semibold text-brand-600 transition-colors hover:bg-orange-50 sm:w-auto"
                  >
                    How it works
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} className="relative">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-orange-200/70 to-amber-100/50 blur-xl" />
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_30px_60px_rgba(45,26,13,0.18)]">
                <video
                  src="/media/lmcfinal.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="aspect-video w-full object-cover"
                />
                <img
                  src={brandLogo}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[3.5%] right-[1.5%] w-[14%] max-w-[100px] drop-shadow-[0_2px_6px_rgba(45,26,13,0.45)]"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats band */}
        <section id="impact" className="scroll-mt-24 bg-white border-y border-orange-100">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <div className="grid grid-cols-2 gap-8 sm:gap-6 lg:grid-cols-4">
              {STATS.map(({ prefix = '', value, decimals = 0, suffix, label }) => (
                <Reveal key={label} className="text-center">
                  <p className="text-3xl font-extrabold tracking-tight text-brand-500 sm:text-4xl">
                    {prefix}
                    <CountUp end={value} decimals={decimals} suffix={suffix} />
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-ink/60 sm:text-sm">{label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Mission marquee — infinite loop */}
        <section className="bg-brand-500 py-10">
          <TextLoop
            text="Every kilometer counted"
            shape="wave"
            speed={90}
            separator="•"
            color="#ffffff"
            ribbon
            ribbonColor="#E8871E"
            ribbonWidth={70}
            fontSize={36}
            fontWeight={800}
          />
        </section>

        {/* Features */}
        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-strong sm:text-3xl">
                Why riders choose us
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
                Six quiet superpowers working on every trip.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={(i % 3) * 90}>
                  <div className="group h-full rounded-3xl border border-orange-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(252,128,25,0.14)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 transition-colors group-hover:bg-brand-500">
                      <Icon className="h-6 w-6 text-brand-500 transition-colors group-hover:text-white" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-ink-strong">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 bg-white border-y border-orange-100">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-strong sm:text-3xl">
                How it works
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
                Three steps from route to reward.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
              {STEPS.map(({ n, title, text }, i) => (
                <Reveal key={n} delay={i * 120} className="relative text-center">
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute left-[calc(50%+2.6rem)] top-6 hidden h-0.5 w-[calc(100%-5.2rem)] bg-gradient-to-r from-brand-300 to-orange-100 sm:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(252,128,25,0.35)]">
                    {n}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink-strong">{title}</h3>
                  <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-ink/70">{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pilot results — real data, not testimonials */}
        <section>
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-strong sm:text-3xl">
                30-day pilot results
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
                One rider's real week-by-week transformation, from our Mangaluru pilot.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-5">
              {PILOT_RESULTS.map(({ week, co2, bonus }, i) => (
                <Reveal key={week} delay={i * 90}>
                  <div className="flex h-full flex-col rounded-3xl border border-orange-100 bg-white p-5 text-center transition-shadow hover:shadow-[0_16px_36px_rgba(252,128,25,0.12)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">{week}</p>
                    <p className="mt-3 text-sm text-ink/70">CO2</p>
                    <p className="text-lg font-bold text-ink-strong">{co2}</p>
                    <p className="mt-3 text-sm text-ink/70">Green bonus</p>
                    <p className="text-lg font-bold text-ink-strong">{bonus}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 bg-white border-y border-orange-100">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-strong sm:text-3xl">
                Frequently asked questions
              </h2>
            </Reveal>
            <div className="mt-10 space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 70}>
                  <Accordion q={q} a={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-400">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to green your last mile?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
                Join the riders already earning more by riding greener.
              </p>
              <div className="mt-8">
                <Link
                  to="/install"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-brand-600 shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  Install App
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/70">Free for riders · Android &amp; iOS</p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}