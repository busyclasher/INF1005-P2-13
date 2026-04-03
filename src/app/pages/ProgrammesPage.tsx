import { useState } from 'react';
import { CheckCircle2, Clock, BarChart2, ArrowRight, User } from 'lucide-react';
import { programmes } from '../data/mockData';
import { PageHeader, PrimaryButton, SurfaceCard } from '../components/brand';

type LevelFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

const levelColour: Record<string, string> = {
  Beginner: 'bg-green-900/40 text-green-300',
  Intermediate: 'bg-amber-900/40 text-amber-300',
  Advanced: 'bg-red-900/40 text-red-300',
};

const levelBorder: Record<string, string> = {
  Beginner: 'border-green-200',
  Intermediate: 'border-amber-200',
  Advanced: 'border-red-200',
};

export function ProgrammesPage() {
  const [filter, setFilter] = useState<LevelFilter>('all');

  const filtered = programmes.filter(
    (p) => filter === 'all' || p.level === filter
  );

  return (
    <main>
      <section className="bg-slate-900 py-16" aria-labelledby="programmes-heading">
        <PageHeader
          titleId="programmes-heading"
          eyebrow="Structured Training"
          title="Training Programmes"
          subtitle="Goal-driven, expert-designed training programmes that deliver measurable results. Choose your pathway and commit to the transformation."
          tone="dark"
          align="center"
        />
      </section>

      {/* How it works */}
      <section className="bg-orange-50 border-b border-orange-100 py-8" aria-label="How programmes work">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: '01', title: 'Choose Your Programme', desc: 'Select the plan that aligns with your goals and current fitness level.' },
              { step: '02', title: 'Meet Your Trainer', desc: 'Complete an initial consultation to personalise your programme.' },
              { step: '03', title: 'Train & Transform', desc: 'Follow your structured plan with ongoing support and progress tracking.' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <span className="w-10 h-10 bg-orange-800 text-white rounded-full flex items-center justify-center text-sm mb-3" style={{ fontWeight: 700 }}>
                  {item.step}
                </span>
                <h3 className="text-slate-900 mb-1" style={{ fontWeight: 600 }}>{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-slate-900 border-b border-slate-800 py-4 sticky top-16 z-30" aria-label="Programme level filter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-300 mr-1">Filter by level:</span>
            {(['all', 'Beginner', 'Intermediate', 'Advanced'] as LevelFilter[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  filter === lvl
                    ? 'bg-orange-800 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                style={{ fontWeight: 500 }}
                aria-pressed={filter === lvl}
                aria-label={`Filter by ${lvl === 'all' ? 'all levels' : lvl}`}
              >
                {lvl === 'all' ? 'All Levels' : lvl}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programme Cards */}
      <section className="bg-slate-900 py-12" aria-label="Programme listings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((prog) => (
              <SurfaceCard
                key={prog.id}
                as="article"
                variant="dark"
                padding="none"
                className="overflow-hidden border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group"
                aria-label={`${prog.name} programme`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={prog.imageUrl}
                    alt={`${prog.name} training programme`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" aria-hidden="true" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs ${levelColour[prog.level]}`} style={{ fontWeight: 600 }}>
                        {prog.level}
                      </span>
                      <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
                        {prog.goal}
                      </span>
                    </div>
                    <h2 className="text-white" style={{ fontWeight: 800, fontSize: '1.375rem' }}>{prog.name}</h2>
                  </div>
                </div>

                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1.5 text-sm text-slate-300">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {prog.weeks} weeks
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-300">
                      <BarChart2 className="w-4 h-4" aria-hidden="true" />
                      {prog.level}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-300">
                      <User className="w-4 h-4" aria-hidden="true" />
                      {prog.trainerName}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-5">{prog.description}</p>

                  {/* Includes */}
                  <div className="mb-6">
                    <p className="text-xs text-slate-300 mb-3" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      What's Included
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {prog.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trainer + Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={prog.trainerImage}
                        alt={prog.trainerName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm text-slate-100" style={{ fontWeight: 600 }}>{prog.trainerName}</p>
                        <p className="text-xs text-slate-300">Lead Trainer</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-50 mb-0.5" style={{ fontWeight: 800, fontSize: '1.5rem' }}>£{prog.price}</p>
                      <PrimaryButton
                        to="/register"
                        variant="brand"
                        className="px-4 py-2 text-sm gap-1.5"
                        aria-label={`Enrol in ${prog.name}`}
                      >
                        Enrol <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16" aria-labelledby="programmes-cta">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            id="programmes-cta"
            className="text-white mb-3 mx-auto max-w-[22ch]"
            style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.02em', textWrap: 'balance' as any }}
          >
            Not sure which programme is right for you?
          </h2>
          <p className="text-slate-300 mb-8">
            Book a free 20-minute consultation with one of our trainers. We'll assess your goals and recommend the best pathway for you.
          </p>
          <PrimaryButton
            to="/register"
            variant="brand"
            className="px-8 py-3.5 gap-2"
          >
            Book Free Consultation <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
