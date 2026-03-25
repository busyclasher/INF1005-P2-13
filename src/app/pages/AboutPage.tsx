import { MapPin, Phone, Mail, Clock, Award, Heart, Users, Zap } from 'lucide-react';
import { teamMembers } from '../data/mockData';
import { PageHeader, PrimaryButton, SurfaceCard } from '../components/brand';

const STUDIO_IMG = 'https://images.unsplash.com/photo-1761971975769-97e598bf526b?w=1200&q=80';

const values = [
  { icon: Heart, title: 'Inclusivity', desc: 'Fitness is for everyone. We welcome all fitness levels, backgrounds, and abilities, creating a space where everyone belongs.' },
  { icon: Award, title: 'Excellence', desc: 'We hold ourselves to the highest standards — in coaching quality, facility maintenance, and the member experience.' },
  { icon: Users, title: 'Community', desc: 'We foster genuine connection between members and trainers, building a community that motivates and supports each other.' },
  { icon: Zap, title: 'Innovation', desc: 'We continuously evolve our programmes, equipment, and technology to deliver the best possible training environment.' },
];

export function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative py-24 bg-slate-900 flex items-center overflow-hidden"
        aria-labelledby="about-heading"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${STUDIO_IMG})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/90" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PageHeader
            titleId="about-heading"
            eyebrow="Our Story"
            title="We exist to make you move"
            subtitle="KineticHub was born from a simple belief: that expert fitness coaching, delivered in an inspiring environment, should be accessible to everyone — not just elite athletes."
            tone="dark"
            size="large"
            align="center"
            titleClassName="mb-4"
            subtitleClassName="mb-0 text-slate-300 max-w-2xl mx-auto text-lg leading-[1.7]"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <PageHeader
                titleId="story-heading"
                heading="h2"
                tone="light"
                align="left"
                className="max-w-none mx-0 px-0 mb-4"
                eyebrow="How We Started"
                title="Built by fitness professionals, for real people"
                titleClassName="text-[clamp(1.5rem,3.5vw,2.25rem)] mb-4"
              />
              <div className="space-y-4 text-slate-600" style={{ lineHeight: 1.8 }}>
                <p>
                  KineticHub was founded in 2021 by a team of certified coaches and wellness professionals who were frustrated by the impersonal, intimidating nature of traditional gym culture. They envisioned a studio where every person — regardless of their starting point — would receive expert guidance, genuine encouragement, and a welcoming community.
                </p>
                <p>
                  Starting with just two class formats and a converted railway arch in Shoreditch, KineticHub quickly grew through word of mouth. Members didn't just see results — they genuinely enjoyed the process. Today, we operate from a purpose-built 3,000 sq ft studio, offer six class formats across 36 weekly sessions, and have welcomed over 1,200 members through our doors.
                </p>
                <p>
                  Our mission remains unchanged: to help every person who walks through our doors move with purpose, train with passion, and build a healthier, more confident version of themselves.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img
                  src={STUDIO_IMG}
                  alt="KineticHub studio space showing modern fitness equipment and open floor"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Stats overlay */}
              <div className="absolute -bottom-6 -left-6 bg-orange-500 rounded-2xl p-5 shadow-xl text-white hidden sm:block">
                <p style={{ fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>1,200+</p>
                <p className="text-orange-100 text-sm">Happy members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-50" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            titleId="values-heading"
            heading="h2"
            tone="light"
            align="center"
            className="max-w-none mx-0 px-0 mb-12"
            eyebrow="What Drives Us"
            title="Our Core Values"
            titleClassName="text-[clamp(1.75rem,4vw,2.25rem)]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <SurfaceCard
                key={title}
                variant="light"
                className="text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-500" aria-hidden="true" />
                </div>
                <h3 className="text-slate-900 mb-2 font-bold">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white" aria-labelledby="team-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            titleId="team-heading"
            heading="h2"
            tone="light"
            align="center"
            className="max-w-none mx-0 px-0 mb-12"
            eyebrow="The People Behind KineticHub"
            title="Meet Our Trainers"
            subtitle="Our instructors are certified professionals with genuine passion for their disciplines — and for helping you succeed."
            titleClassName="text-[clamp(1.75rem,4vw,2.25rem)] mb-3"
            subtitleClassName="max-w-xl"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <SurfaceCard
                key={member.id}
                as="article"
                variant="muted"
                padding="none"
                className="overflow-hidden border-slate-100 shadow-sm group"
                aria-label={`${member.name}, ${member.role}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs bg-orange-500 text-white px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
                      {member.experience}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-slate-900 mb-0.5" style={{ fontWeight: 700 }}>{member.name}</h3>
                  <p className="text-orange-500 text-sm mb-3" style={{ fontWeight: 500 }}>{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialities.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Details */}
      <section className="py-16 bg-slate-50" aria-labelledby="studio-info-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-orange-500 text-sm mb-2" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Find Us
              </p>
              <h2 id="studio-info-heading" className="text-slate-900 mb-6" style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
                Visit the Studio
              </h2>
              <address className="not-italic space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Address</p>
                    <p className="text-slate-500 text-sm">14 Kinetic Way, Shoreditch<br />London, EC2A 4BX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Opening Hours</p>
                    <div className="text-slate-500 text-sm space-y-0.5">
                      <p>Monday – Friday: 05:30 – 22:00</p>
                      <p>Saturday: 07:00 – 19:00</p>
                      <p>Sunday: 08:00 – 17:00</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Phone</p>
                    <a href="tel:+442071234567" className="text-slate-500 text-sm hover:text-orange-500 transition-colors">
                      +44 (0)20 7123 4567
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>Email</p>
                    <a href="mailto:hello@kinetikhub.com" className="text-slate-500 text-sm hover:text-orange-500 transition-colors">
                      hello@kinetikhub.com
                    </a>
                  </div>
                </div>
              </address>
            </div>

            {/* Map placeholder */}
            <div className="bg-slate-200 rounded-2xl overflow-hidden min-h-[320px] flex items-center justify-center" aria-label="Map showing studio location">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" aria-hidden="true" />
                <p className="text-slate-600 text-sm" style={{ fontWeight: 500 }}>14 Kinetic Way, Shoreditch</p>
                <p className="text-slate-400 text-xs mt-1">London EC2A 4BX</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Open in Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-14" aria-labelledby="about-cta">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 id="about-cta" className="text-white mb-3" style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em' }}>
            Come say hello
          </h2>
          <p className="text-slate-400 mb-7">
            Visit us for a free trial class and see for yourself what makes KineticHub different.
          </p>
          <PrimaryButton to="/register" variant="marketing" rounded="xl" className="px-8 py-3.5 gap-2">
            Get Your Free Class
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
