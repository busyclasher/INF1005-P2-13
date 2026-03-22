import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { CheckCircle2, XCircle, ArrowRight, Zap, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// You can configure this base URL
const API_BASE = 'http://35.212.166.173/backend/api';

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

const tierAccentColour = ['text-slate-600', 'text-orange-500', 'text-orange-600', 'text-amber-600'];
const tierBorderColour = ['border-slate-200', 'border-orange-300', 'border-orange-400', 'border-amber-400'];

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
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="bg-slate-50 py-16" aria-label="Membership pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
                <div className="text-center text-slate-500 py-12">Loading plans...</div>
            ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-center">
            {plans.map((tier, index) => (
              <article
                key={tier.plan_id}
                className={`bg-white rounded-2xl border-2 ${tierBorderColour[index % tierBorderColour.length]} overflow-hidden flex flex-col`}
                aria-label={`${tier.plan_name} plan`}
              >
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className={`mb-1 ${tierAccentColour[index % tierAccentColour.length]}`} style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                    {tier.plan_name}
                  </h2>
                  <p className="text-slate-500 text-sm mb-5">{tier.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-slate-900" style={{ fontWeight: 800, fontSize: '2.5rem', lineHeight: 1 }}>
                      £{tier.price}
                    </span>
                    <span className="text-slate-500 text-sm">/mo</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {/* Simulated features since our DB doesn't store feature list */}
                    {hardcodedFeatures.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            {f.included || index > 0 ? (
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" aria-hidden="true" />
                            ) : (
                            <XCircle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" aria-hidden="true" />
                            )}
                            <span className={`text-sm ${f.included || index > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                            {f.text}
                            </span>
                        </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(tier.plan_id)}
                    className={`w-full text-center py-3 rounded-xl text-sm transition-colors bg-slate-900 hover:bg-slate-800 text-white`}
                    style={{ fontWeight: 600 }}
                  >
                    Select Plan
                  </button>
                </div>
              </article>
            ))}
          </div>
            )}
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
                  >
                    <span className="text-slate-800 text-sm pr-4" style={{ fontWeight: 600 }}>{item.q}</span>
                    <Info
                      className={`w-4 h-4 shrink-0 transition-colors ${openFaq === idx ? 'text-orange-500' : 'text-slate-400'}`}
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

    </main>
  );
}
