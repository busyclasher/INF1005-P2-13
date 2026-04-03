import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { PageHeader, PrimaryButton, SurfaceCard } from '../components/brand';
import { cn } from '../components/ui/utils';

// You can configure this base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://35.212.166.173/backend/api';

const faqItems = [
  {
    q: 'Can I cancel my membership at any time?',
    a: 'Monthly memberships can be cancelled with 30 days written notice. Annual memberships are non-refundable but can be frozen for up to 2 months per year.',
  },
  {
    q: 'Can I change my plan?',
    a: 'Yes. You can upgrade or downgrade your plan at any time via your member dashboard or by contacting us directly.',
  },
];

const tierAccentColour = ['text-slate-100', 'text-orange-500', 'text-orange-600', 'text-amber-600'];
const tierBorderColour = ['border-slate-800', 'border-orange-300', 'border-orange-400', 'border-amber-400'];

const hardcodedFeatures = [
    { text: 'Access to gym equipment', included: true },
    { text: 'Group classes', included: true },
    { text: 'Personal Training', included: false },
    { text: 'Locker use', included: true },
];

export function MembershipPage() {
  // Always use monthly for now since DB only has one price column
  const [billing] = useState<'monthly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const res = await fetch(`${API_BASE}/membership_plans.php`);
            const data = await res.json();
            if (data.success) {
                setPlans(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: number) => {
    if (!isAuthenticated || !user) {
        toast.info("Please log in to subscribe to a plan.");
        navigate('/login');
        return;
    }

    try {
        // We will try to POST first. If it fails due to active membership, we could PUT.
        // For simplicity, let's just POST. Our memberships.php PUT method is also available.
        // We will do a generic approach: if they get the "already active" error, we will use PUT.
        const res = await fetch(`${API_BASE}/memberships.php`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ user_id: user.id, plan_id: planId })
        });
        const data = await res.json();
        
        if (data.success) {
            toast.success(data.message);
            navigate('/dashboard');
        } else {
            // If they already have a membership, try updating it
            if (data.error.includes("already have an active membership")) {
                const putRes = await fetch(`${API_BASE}/memberships.php`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ user_id: user.id, new_plan_id: planId })
                });
                const putData = await putRes.json();
                if (putData.success) {
                    toast.success(putData.message);
                    navigate('/dashboard');
                } else {
                    toast.error(putData.error);
                }
            } else {
                toast.error(data.error);
            }
        }
    } catch (err) {
        toast.error("Network error while subscribing.");
    }
  };

  return (
    <main id="main-content">
      <section className="bg-slate-900 py-16" aria-labelledby="membership-page-heading">
        <PageHeader
          titleId="membership-page-heading"
          eyebrow="Flexible Plans"
          title="Membership Plans"
          subtitle="Choose the plan that fits your lifestyle. No hidden fees. No long-term lock-ins on monthly plans."
          tone="dark"
          align="center"
        />
      </section>

      {/* Pricing Cards */}
      <section className="bg-slate-900 py-16" aria-label="Membership pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
                <div className="text-center text-slate-300 py-12">Loading plans...</div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-center">
            {plans.map((tier, index) => (
              <SurfaceCard
                key={tier.plan_id}
                as="article"
                variant="dark"
                padding="none"
                className={cn(
                  'overflow-hidden flex flex-col border-2 shadow-sm',
                  tierBorderColour[index % tierBorderColour.length],
                )}
                aria-label={`${tier.plan_name} plan`}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className={`mb-1 ${tierAccentColour[index % tierAccentColour.length]}`} style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                    {tier.plan_name}
                  </h2>
                  <p className="text-sm mb-5" style={{ color: '#b3b3b3' }}>{tier.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-white" style={{ fontWeight: 800, fontSize: '2.5rem', lineHeight: 1 }}>
                      £{tier.price}
                    </span>
                    <span className="text-sm" style={{ color: '#b3b3b3' }}>/mo</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {/* Simulated features since our DB doesn't store feature list */}
                    {hardcodedFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            {f.included || index > 0 ? (
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                            ) : (
                            <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
                            )}
                            <span
                              className={`text-sm ${f.included || index > 0 ? 'text-slate-200' : ''}`}
                              style={!(f.included || index > 0) ? { color: '#9ca3af' } : undefined}
                            >
                            {f.text}
                            </span>
                        </li>
                    ))}
                  </ul>

                  <PrimaryButton
                    variant="brand"
                    className="w-full py-3"
                    onClick={() => handleSubscribe(tier.plan_id)}
                  >
                    Select Plan
                  </PrimaryButton>
                </div>
              </SurfaceCard>
            ))}
          </div>
            )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-900 py-16" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-white text-center mb-8" style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <dl className="space-y-3">
            {faqItems.map((item, idx) => (
              <SurfaceCard key={idx} variant="dark" padding="none" className="overflow-hidden rounded-xl border-slate-800 shadow-sm">
                <dt>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-slate-50 text-sm pr-4" style={{ fontWeight: 600 }}>{item.q}</span>
                    <Info
                      className={`w-4 h-4 shrink-0 transition-colors ${openFaq === idx ? 'text-orange-500' : 'text-slate-300'}`}
                    />
                  </button>
                </dt>
                {openFaq === idx && (
                  <dd id={`faq-answer-${idx}`} className="px-5 pb-4">
                    <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
                  </dd>
                )}
              </SurfaceCard>
            ))}
          </dl>
        </div>
      </section>

    </main>
  );
}
