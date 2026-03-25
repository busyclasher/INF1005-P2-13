import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight, ArrowUpRight, ChevronRight, CheckCircle2,
  Star, Users, Calendar, Award, Wifi, Dumbbell, Plus, Activity,
  ChevronLeft, Coffee, Maximize2
} from 'lucide-react';
import { fitnessClasses, membershipTiers, testimonials } from '../data/mockData';
import { PrimaryButton, SecondaryButton } from '../components/brand';
const battleRopesImg = '/images/battle-ropes.png';
const ptDeadliftImg = '/images/pt-deadlift.png';
const diverseTrainingImg = '/images/diverse-training.png';

const LIME = '#C8F400';
const DARK = '#111111';
const CARD_DARK = '#1a1a1a';
const CARD_MID = '#222222';

const HERO_ATHLETE = battleRopesImg;
const ZONE_POWER = ptDeadliftImg;
const ZONE_CARDIO = battleRopesImg;
const GYM_FEATURE = diverseTrainingImg;

const intensityColour: Record<string, { bg: string; text: string }> = {
  Low: { bg: 'rgba(200,244,0,0.15)', text: LIME },
  Medium: { bg: 'rgba(251,191,36,0.15)', text: '#FBB224' },
  High: { bg: 'rgba(248,113,113,0.15)', text: '#F87171' },
};

const categoryLabel: Record<string, string> = {
  yoga: 'Yoga', hiit: 'HIIT', cycling: 'Cycling',
  pilates: 'Pilates', boxing: 'Boxing', barre: 'Barre',
};

const zones = [
  { label: 'Power Zone', subtitle: 'Space for working with free weights', img: ZONE_POWER },
  { label: 'Cardio Zone', subtitle: 'High-performance cardio equipment', img: ZONE_CARDIO },
];

const featureItems = [
  { icon: <Dumbbell className="w-5 h-5" style={{ color: LIME }} />, text: 'Professional coaches, each with at least 5 years of experience.' },
  { icon: <Plus className="w-5 h-5" style={{ color: LIME }} />, text: "The medical professional's office on-site." },
  { icon: <span className="text-white" style={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>4</span>, text: 'Sports zones for every training style.' },
  { icon: <Wifi className="w-5 h-5" style={{ color: LIME }} />, text: 'Wi-Fi Free throughout the studio.' },
  { icon: <Activity className="w-5 h-5" style={{ color: LIME }} />, text: 'Fitness trackers & smart performance analysis.' },
  { icon: <Coffee className="w-5 h-5" style={{ color: LIME }} />, text: 'A bar serving wholesome drinks & snacks.' },
  { icon: <span style={{ color: LIME, fontWeight: 800, fontSize: '1.1rem' }}>☀️</span>, text: 'Tanning bed & recovery suite.' },
  { icon: <Maximize2 className="w-5 h-5" style={{ color: LIME }} />, text: '500 M² of premium training space.' },
];

const benefits = [
  { icon: '🏆', title: 'Expert-Led Classes', desc: 'Every session is designed and delivered by qualified, experienced instructors passionate about your progress.' },
  { icon: '📲', title: 'Seamless Booking', desc: 'Book classes in seconds through our app or website. Manage your schedule and never miss a spot.' },
  { icon: '🎯', title: 'Personalised Programmes', desc: 'Tailored training plans crafted around your goals, fitness level, and lifestyle.' },
  { icon: '🤝', title: 'Vibrant Community', desc: 'Join a welcoming, diverse community of like-minded individuals working towards a healthier, more active life.' },
];

export function HomePage() {
  const featuredClasses = fitnessClasses.slice(0, 3);
  const pricingTiers = membershipTiers.slice(0, 3);
  const [activeZone, setActiveZone] = useState(0);

  return (
    <main style={{ background: DARK }}>

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: DARK }}
        aria-labelledby="hero-heading"
      >
        {/* Content row */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 items-center gap-8 py-16 lg:py-24">
          {/* Left */}
          <div>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8"
              style={{ background: 'rgba(200,244,0,0.12)', color: LIME, fontWeight: 600, border: `1px solid rgba(200,244,0,0.25)` }}
            >
              Singapore's Premier Boutique Fitness Studio
            </span>
            <h1
              id="hero-heading"
              className="text-white mb-6"
              style={{
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
              }}
            >
              Be stronger.<br />
              Be <span style={{ color: LIME }}>confident.</span><br />
              Be kinetic.
            </h1>
            <p className="mb-10 max-w-lg" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.125rem', lineHeight: 1.7 }}>
              A curated selection of group fitness classes, personalised training programmes, and an expert team committed to helping you achieve measurable, lasting results.
            </p>
            <div className="flex flex-wrap gap-4">
              <PrimaryButton
                to="/register"
                variant="brand"
                rounded="full"
                className="px-7 py-3.5 text-[0.95rem] font-bold gap-2 hover:-translate-y-0.5 hover:opacity-90"
              >
                Try for free <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </PrimaryButton>
              <SecondaryButton
                to="/about"
                variant="onDark"
                rounded="full"
                className="px-7 py-3.5 text-[0.95rem] font-semibold border-white/20 text-white/90"
              >
                More about KineticHub
              </SecondaryButton>
            </div>
          </div>

          {/* Right – athlete image */}
          <div className="hidden lg:flex justify-end items-center">
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ width: 480, height: 560, background: '#1a1a1a' }}
            >
              <img
                src={HERO_ATHLETE}
                alt="Athlete in motion at KineticHub"
                className="w-full h-full object-cover object-top"
                style={{ opacity: 0.85 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.7) 0%, transparent 50%)' }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Bottom info strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Members card */}
            <div
              className="rounded-2xl p-6 flex items-start gap-4"
              style={{ background: '#ffffff' }}
            >
              <div className="flex -space-x-2 shrink-0">
                {['SM', 'JK', 'AR'].map((initials, i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs"
                    style={{
                      background: i === 0 ? '#333' : i === 1 ? '#555' : '#444',
                      color: '#fff',
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-black" style={{ fontWeight: 800, fontSize: '1.75rem', lineHeight: 1 }}>1,200+</p>
                <p className="text-black/50 text-sm mt-0.5">satisfied members</p>
                <p className="text-black/40 text-xs mt-2 leading-relaxed">
                  They arrive with different goals, yet all find the support and motivation they need.
                </p>
              </div>
            </div>

            {/* Quote card */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between"
              style={{ background: CARD_MID }}
            >
              <div className="flex items-center justify-between mb-3">
                <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white mb-4" style={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 }}>
                "Your muscles grow while you rest. Make 7–9 hours your secret weapon for maximum progress."
              </p>
              <div className="flex items-center justify-between">
                <p className="text-white/40 text-sm">Singapore</p>
                <p className="text-white/40 text-sm">Nov. 2025</p>
              </div>
            </div>

            {/* CTA lime card */}
            <div
              className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
              style={{ background: LIME }}
            >
              <div className="flex justify-end">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: '#111' }}
                >
                  <ArrowUpRight className="w-4 h-4" style={{ color: LIME }} />
                </span>
              </div>
              <div>
                <p className="text-black" style={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.2 }}>
                  Get 7 days for free
                </p>
                <p className="text-black/60 text-sm mt-2">
                  Register today or message us in the chat to get started.
                </p>
                <Link to="/register" className="inline-block mt-4">
                  <span className="text-black text-sm" style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    Join now →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio Zones ── */}
      <section className="py-20" style={{ background: '#f5f5f3' }} aria-labelledby="zones-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm mb-8"
                style={{ border: '1.5px solid #111', color: '#111', fontWeight: 600 }}
              >
                Fitness Space
              </span>
              <h2
                id="zones-heading"
                className="text-black mb-6"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em' }}
              >
                Welcome to KineticHub, where people work on strengthening both body and mind.
              </h2>
              <p className="mb-8" style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7 }}>
                Our studio is divided into purpose-built training zones, each designed to maximise your performance — whether you're lifting heavy, working on cardio, or recovering with mobility work.
              </p>
              <Link
                to="/classes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: '#111', color: '#fff', fontWeight: 700 }}
              >
                Explore <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Right zone cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4 h-96">
                {zones.map((zone, i) => (
                  <div
                    key={zone.label}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setActiveZone(i)}
                    style={{ border: activeZone === i ? `2px solid ${LIME}` : '2px solid transparent' }}
                  >
                    <img
                      src={zone.img}
                      alt={zone.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%)' }}
                      aria-hidden="true"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-3 py-1.5 rounded-full text-sm"
                        style={{ background: 'rgba(255,255,255,0.92)', color: '#111', fontWeight: 700 }}
                      >
                        {zone.label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm" style={{ fontWeight: 600 }}>{zone.subtitle}</p>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.2)' }}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Navigation arrows */}
              <div className="flex items-center gap-3 mt-4 justify-end">
                <button
                  onClick={() => setActiveZone(prev => (prev - 1 + zones.length) % zones.length)}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-colors hover:bg-black/10"
                  style={{ borderColor: '#ccc' }}
                  aria-label="Previous zone"
                >
                  <ChevronLeft className="w-4 h-4 text-black" />
                </button>
                <button
                  onClick={() => setActiveZone(prev => (prev + 1) % zones.length)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: '#111' }}
                  aria-label="Next zone"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8" aria-label="Studio features">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden p-8 md:p-12"
            style={{ background: CARD_DARK }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {/* Row 1: 2 items | center image | 2 items */}
              {/* Left column group */}
              <div className="flex flex-col border-r" style={{ borderColor: '#2a2a2a' }}>
                {featureItems.slice(0, 3).map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 border-b"
                    style={{ borderColor: '#2a2a2a' }}
                  >
                    <div className="shrink-0 mt-0.5">{f.icon}</div>
                    <p className="text-white/80 text-sm leading-relaxed" style={{ fontWeight: 500 }}>{f.text}</p>
                  </div>
                ))}
              </div>

              {/* Center: gym image spanning 2 cols */}
              <div
                className="col-span-2 relative hidden md:block border-r"
                style={{ borderColor: '#2a2a2a', minHeight: 320 }}
              >
                <img
                  src={GYM_FEATURE}
                  alt="KineticHub training floor"
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.7 }}
                />
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <p className="text-white" style={{ fontWeight: 900, fontSize: 'clamp(2.5rem,5vw,4rem)', letterSpacing: '-0.05em', lineHeight: 1 }}>
                      KINETIC<span style={{ color: LIME }}>HUB</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right column group */}
              <div className="flex flex-col">
                {featureItems.slice(3).map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 border-b"
                    style={{ borderColor: '#2a2a2a' }}
                  >
                    <div className="shrink-0 mt-0.5">{f.icon}</div>
                    <p className="text-white/80 text-sm leading-relaxed" style={{ fontWeight: 500 }}>{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Classes ── */}
      <section className="py-20" style={{ background: DARK }} aria-labelledby="classes-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-sm mb-2" style={{ color: LIME, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                What We Offer
              </p>
              <h2 id="classes-heading" className="text-white" style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
                Featured Classes
              </h2>
            </div>
            <Link
              to="/classes"
              className="inline-flex items-center gap-1.5 text-sm transition-colors shrink-0 hover:opacity-80"
              style={{ color: LIME, fontWeight: 600 }}
            >
              View all classes <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredClasses.map((cls) => {
              const totalSessions = cls.sessions.length;
              const availableSessions = cls.sessions.filter(s => s.bookedCount < s.maxCapacity).length;
              const ic = intensityColour[cls.intensity];
              return (
                <article
                  key={cls.id}
                  className="rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                  style={{ background: CARD_DARK, border: '1px solid #2a2a2a' }}
                  aria-label={`${cls.name} class`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={cls.imageUrl}
                      alt={`${cls.name} class at KineticHub`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.8) 0%, transparent 60%)' }} aria-hidden="true" />
                    <span
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs"
                      style={{ background: ic.bg, color: ic.text, fontWeight: 600 }}
                      aria-label={`Intensity: ${cls.intensity}`}
                    >
                      {cls.intensity}
                    </span>
                    <span
                      className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', backdropFilter: 'blur(8px)' }}
                    >
                      {categoryLabel[cls.category]}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white mb-1" style={{ fontWeight: 700, fontSize: '1.125rem' }}>{cls.name}</h3>
                    <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>with {cls.instructor} · {cls.duration} min</p>
                    <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{cls.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {availableSessions}/{totalSessions} sessions available
                      </span>
                      <Link
                        to="/classes"
                        className="px-4 py-1.5 rounded-full text-sm transition-all hover:opacity-90"
                        style={{ background: LIME, color: '#111', fontWeight: 700 }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why KineticHub ── */}
      <section className="py-20" style={{ background: '#0d0d0d' }} aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm mb-2" style={{ color: LIME, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Why Choose Us
            </p>
            <h2 id="benefits-heading" className="text-white mb-3" style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
              The KineticHub Difference
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              We're not just a gym. We're a community of coaches, athletes, and everyday people committed to helping you reach your full potential.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{ background: CARD_DARK, border: '1px solid #2a2a2a' }}
              >
                <span className="text-3xl mb-4 block" aria-hidden="true">{b.icon}</span>
                <h3 className="text-white mb-2" style={{ fontWeight: 700 }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-10" style={{ background: LIME }} aria-label="Studio statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '1,200+', label: 'Active Members' },
              { icon: Calendar, value: '36', label: 'Classes per Week' },
              { icon: Award, value: '12', label: 'Expert Trainers' },
              { icon: Maximize2, value: '5', label: 'Years in Singapore' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(0,0,0,0.12)' }}>
                  <Icon className="w-5 h-5 text-black" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-black" style={{ fontWeight: 900, fontSize: '1.5rem', lineHeight: 1 }}>{value}</p>
                  <p className="text-black/60 text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PT Banner ── */}
      <section className="py-20" style={{ background: DARK }} aria-labelledby="pt-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl overflow-hidden grid md:grid-cols-2 min-h-[440px]"
            style={{ background: '#161616', border: '1px solid #2a2a2a' }}
          >
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <p className="text-sm mb-3" style={{ color: LIME, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Personalised Training
              </p>
              <h2 id="pt-heading" className="text-white mb-4" style={{ fontWeight: 900, fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', letterSpacing: '-0.03em' }}>
                Your goals.<br />Our expertise.
              </h2>
              <p className="mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Work one-to-one with one of our certified personal trainers. Get a fully customised programme, expert coaching, and the accountability to actually reach your goals.
              </p>
              <ul className="space-y-2 mb-8">
                {['Bespoke training plans', 'Nutritional guidance', 'Regular progress reviews', 'Flexible scheduling'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: LIME }} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/programmes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all hover:opacity-90 self-start"
                style={{ background: LIME, color: '#111', fontWeight: 700 }}
              >
                Explore Programmes <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="hidden md:block relative">
              <img
                src={ptDeadliftImg}
                alt="Personal trainer working with a client"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.75 }}
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #161616 0%, transparent 40%)' }} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Membership Preview ── */}
      <section className="py-20" style={{ background: '#0d0d0d' }} aria-labelledby="membership-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm mb-2" style={{ color: LIME, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Membership Plans</p>
            <h2 id="membership-heading" className="text-white mb-3" style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
              Find your perfect plan
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              From first timers to dedicated athletes — there's a plan designed to match your lifestyle and ambitions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-2xl p-6 flex flex-col transition-all hover:-translate-y-1"
                style={
                  tier.popular
                    ? { background: LIME, border: `2px solid ${LIME}` }
                    : { background: CARD_DARK, border: '1px solid #2a2a2a' }
                }
                aria-label={`${tier.name} membership plan`}
              >
                {tier.popular && (
                  <span
                    className="self-start px-2.5 py-1 rounded-full mb-3 text-xs"
                    style={{ background: 'rgba(0,0,0,0.15)', color: '#111', fontWeight: 600 }}
                  >
                    Most Popular
                  </span>
                )}
                <h3
                  className="mb-1"
                  style={{ fontWeight: 700, fontSize: '1.125rem', color: tier.popular ? '#111' : '#fff' }}
                >
                  {tier.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: tier.popular ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.4)' }}>
                  {tier.description}
                </p>
                <div className="mb-4">
                  <span style={{ fontWeight: 900, fontSize: '2rem', color: tier.popular ? '#111' : '#fff' }}>
                    S${tier.monthlyPrice}
                  </span>
                  <span className="text-sm" style={{ color: tier.popular ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.35)' }}>/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.slice(0, 4).map((f) => (
                    <li key={f.text} className={`flex items-start gap-2 text-sm ${!f.included ? 'opacity-30' : ''}`}>
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: tier.popular ? '#111' : LIME }}
                        aria-hidden="true"
                      />
                      <span style={{ color: tier.popular ? '#111' : 'rgba(255,255,255,0.7)' }}>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/membership"
                  className="w-full text-center py-2.5 rounded-full text-sm transition-all hover:opacity-90"
                  style={
                    tier.popular
                      ? { background: '#111', color: LIME, fontWeight: 700 }
                      : { background: LIME, color: '#111', fontWeight: 700 }
                  }
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/membership"
              className="text-sm transition-colors inline-flex items-center gap-1 hover:opacity-80"
              style={{ color: LIME, fontWeight: 600 }}
            >
              Compare all plans <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20" style={{ background: DARK }} aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm mb-2" style={{ color: LIME, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Member Stories</p>
            <h2 id="testimonials-heading" className="text-white" style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.03em' }}>
              What our members say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-2xl p-6"
                style={{ background: CARD_DARK, border: '1px solid #2a2a2a' }}
              >
                <div className="flex items-center gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" style={{ color: '#FBBF24' }} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>"{t.quote}"</p>
                <footer className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs"
                    style={{ background: LIME, color: '#111', fontWeight: 700 }}
                  >
                    {t.avatarInitials}
                  </span>
                  <div>
                    <cite className="text-white text-sm not-italic" style={{ fontWeight: 600 }}>{t.name}</cite>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.membershipTier} · Member since {t.memberSince}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24" style={{ background: '#0d0d0d' }} aria-labelledby="cta-heading">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-white mb-4" style={{ fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}>
            Ready to start your journey?
          </h2>
          <p className="mb-10" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.125rem' }}>
            Join over 1,200 members transforming their lives at KineticHub. Your first class is on us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: LIME, color: '#111', fontWeight: 700 }}
            >
              Join KineticHub
            </Link>
            <Link
              to="/classes"
              className="px-8 py-4 rounded-full border transition-colors hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}
            >
              Browse Classes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}