import { useState } from 'react';
import { Link } from 'react-router';
import { CheckCircle2, XCircle, ArrowRight, Zap, Info } from 'lucide-react';
import { membershipTiers } from '../data/mockData';

const faqItems = [
  {
    q: 'Can I cancel my membership at any time?',
    a: 'Monthly memberships can be cancelled with 30 days written notice. Annual memberships are non-refundable but can be frozen for up to 2 months per year.',
  },
  {
    q: 'Can I freeze my membership?',
    a: 'Yes. Standard and Premium members can freeze their membership for up to 1 month per year. Annual Elite members can freeze for up to 2 months.',
  },
  {
    q: 'Do unused classes roll over?',
    a: 'Essential plan classes do not roll over month to month. All unlimited plans give you full access every month regardless of attendance.',
  },
  {
    q: 'Is there a joining fee?',
    a: 'There is a one-time admin fee of £25 for all new members, waived during promotional periods.',
  },
  {
    q: 'Can I change my plan?',
    a: 'Yes. You can upgrade or downgrade your plan at any time via your member dashboard or by contacting us directly.',
  },
];

const tierAccentColour: Record<string, string> = {
  essential: 'text-slate-600',
  standard: 'text-orange-500',
  premium: 'text-orange-600',
  annual: 'text-amber-600',
};

const tierBorderColour: Record<string, string> = {
  essential: 'border-slate-200',
  standard: 'border-orange-300',
  premium: 'border-orange-400',
  annual: 'border-amber-400',
};

const allFeatures = [
  'Classes per month',
  'Unlimited classes',
  'Access to studio facilities',
  'Member app access',
  'PT sessions per month',
  'Nutrition guidance',
  'Priority booking',
  'Guest passes',
  'Body composition analysis',
];

export function MembershipPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const displayPrice = (tier: typeof membershipTiers[0]) =>
    billing === 'annual' ? Math.round(tier.annualPrice / 12) : tier.monthlyPrice;

  const saving = (tier: typeof membershipTiers[0]) =>
    Math.round(((tier.monthlyPrice * 12 - tier.annualPrice) / (tier.monthlyPrice * 12)) * 100);

  return (
    <main>
      {/* Header */}
      <section className="bg-slate-900 py-16" aria-labelledby="membership-page-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-orange-400 text-sm mb-2" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Flexible Plans
          </p>
          <h1 id="membership-page-heading" className="text-white mb-3" style={{ fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.02em' }}>
            Membership Plans
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Choose the plan that fits your lifestyle. No hidden fees. No long-term lock-ins on monthly plans.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center bg-slate-800 rounded-xl p-1 gap-1"
            role="group"
            aria-label="Billing period"
          >
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm transition-all ${
                billing === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{ fontWeight: 500 }}
              aria-pressed={billing === 'monthly'}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{ fontWeight: 500 }}
              aria-pressed={billing === 'annual'}
            >
              Annual
              <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">Save up to 18%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-slate-50 py-16" aria-label="Membership pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {membershipTiers.map((tier) => (
              <article
                key={tier.id}
                className={`bg-white rounded-2xl border-2 ${tierBorderColour[tier.id]} overflow-hidden flex flex-col ${
                  tier.popular ? 'shadow-xl relative' : ''
                }`}
                aria-label={`${tier.name} plan`}
              >
                {tier.popular && (
                  <div className="bg-orange-500 text-white text-center text-xs py-1.5" style={{ fontWeight: 600 }}>
                    ★ Most Popular
                  </div>
                )}
                {tier.badge && !tier.popular && (
                  <div className="bg-amber-500 text-white text-center text-xs py-1.5" style={{ fontWeight: 600 }}>
                    {tier.badge}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <h2 className={`mb-1 ${tierAccentColour[tier.id]}`} style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                    {tier.name}
                  </h2>
                  <p className="text-slate-500 text-sm mb-5">{tier.description}</p>

                  {/* Price */}
                  <div className="mb-1">
                    <span className="text-slate-900" style={{ fontWeight: 800, fontSize: '2.5rem', lineHeight: 1 }}>
                      £{displayPrice(tier)}
                    </span>
                    <span className="text-slate-500 text-sm">/mo</span>
                  </div>
                  {billing === 'annual' && (
                    <p className="text-xs text-green-600 mb-4" style={{ fontWeight: 500 }}>
                      Billed annually · Save {saving(tier)}%
                    </p>
                  )}
                  {billing === 'monthly' && <div className="mb-4" />}

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5">
                        {f.included ? (
                          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        <span className={`text-sm ${f.included ? 'text-slate-700' : 'text-slate-400'}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`w-full text-center py-3 rounded-xl text-sm transition-colors ${
                      tier.popular
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                    style={{ fontWeight: 600 }}
                    aria-label={`Get started with ${tier.name} plan`}
                  >
                    Get Started
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Money back notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <Zap className="w-4 h-4 text-orange-400" aria-hidden="true" />
            All plans include a 7-day satisfaction guarantee. No questions asked.
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white overflow-x-auto" aria-labelledby="comparison-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="comparison-heading" className="text-slate-900 mb-2" style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>
              Plan Comparison
            </h2>
            <p className="text-slate-500 text-sm">A full breakdown of what's included in each plan.</p>
          </div>

          <div className="min-w-[640px]">
            <table className="w-full border-collapse" role="table" aria-label="Membership plan feature comparison">
              <thead>
                <tr>
                  <th scope="col" className="text-left text-sm text-slate-500 pb-4 pr-4 w-48" style={{ fontWeight: 500 }}>
                    Feature
                  </th>
                  {membershipTiers.map((tier) => (
                    <th key={tier.id} scope="col" className="text-center pb-4 px-4">
                      <span className={`text-sm ${tierAccentColour[tier.id]}`} style={{ fontWeight: 700 }}>
                        {tier.name}
                      </span>
                      <br />
                      <span className="text-slate-400 text-xs">
                        £{displayPrice(tier)}/mo
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {membershipTiers[0].features.map((feature, i) => (
                  <tr key={feature.text} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="text-sm text-slate-700 py-3 pr-4 pl-3 rounded-l-lg" style={{ fontWeight: 500 }}>
                      {feature.text}
                    </td>
                    {membershipTiers.map((tier) => {
                      const f = tier.features[i];
                      return (
                        <td key={tier.id} className="text-center py-3 px-4">
                          {f.included ? (
                            <CheckCircle2
                              className="w-5 h-5 text-orange-500 mx-auto"
                              aria-label="Included"
                            />
                          ) : (
                            <XCircle
                              className="w-5 h-5 text-slate-300 mx-auto"
                              aria-label="Not included"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-slate-900 text-center mb-8" style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <dl className="space-y-3">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <dt>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    aria-expanded={openFaq === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="text-slate-800 text-sm pr-4" style={{ fontWeight: 600 }}>{item.q}</span>
                    <Info
                      className={`w-4 h-4 shrink-0 transition-colors ${openFaq === idx ? 'text-orange-500' : 'text-slate-400'}`}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                {openFaq === idx && (
                  <dd id={`faq-answer-${idx}`} className="px-5 pb-4">
                    <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-14" aria-labelledby="membership-cta">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 id="membership-cta" className="text-white mb-3" style={{ fontWeight: 800, fontSize: '1.875rem', letterSpacing: '-0.02em' }}>
            Start your journey today
          </h2>
          <p className="text-orange-100 mb-7">Join KineticHub and experience a new level of fitness. Your first class is free.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
            style={{ fontWeight: 700 }}
          >
            Join Now <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
