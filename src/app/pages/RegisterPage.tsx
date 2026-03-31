import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Zap, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { membershipTiers } from '../data/mockData';

const LIME = '#C8F400';
const DARK = '#111111';
const CARD = '#1a1a1a';
const BORDER = 'rgba(255,255,255,0.08)';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://35.212.166.173/backend/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  membershipTier: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  membershipTier?: string;
  agreeTerms?: string;
  submit?: string;
}

function validateEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function validatePhone(p: string) {
  return p.trim() === '' || /^[+\d\s\-()]{7,20}$/.test(p);
}

function passwordStrength(pw: string): { score: number; label: string; colour: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colours = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
  return { score, label: pw ? labels[Math.min(score - 1, 3)] || 'Weak' : '', colour: colours[Math.min(score - 1, 3)] || 'bg-red-500' };
}

const steps = ['Account Details', 'Choose Plan', 'Confirmation'];

const inputBase = `w-full px-3.5 py-2.5 rounded-xl border text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-colors`;

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    membershipTier: '',
    agreeTerms: false,
    agreeMarketing: false,
  });
  

  const update = (key: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validateStep0 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required.';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    else if (!validateEmail(form.email)) errs.email = 'Please enter a valid email address.';
    if (!validatePhone(form.phone)) errs.phone = 'Please enter a valid phone number.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep1 = (): boolean => {
    const errs: FormErrors = {};
    if (!form.membershipTier) errs.membershipTier = 'Please select a membership plan.';
    if (!form.agreeTerms) errs.agreeTerms = 'You must agree to the terms and conditions.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    console.log("handleNext called, current step:", step);
    if (step === 0 && validateStep0()){
      console.log("Step 0 validated, moving to step 1");
      setStep(1);
    } 
    else if (step === 1 && validateStep1()){
      console.log("Step 1 validated, moving to step 2");
      setStep(2);
    } 
  };

  const handleRegister = async () => {

    try {
      const response = await fetch(`${API_BASE}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone_number: form.phone,
          email: form.email,
          password: form.password
        })
      });
      const result = await response.json();
      if (!result.success) {
        console.error("Server error: ", result.error);
        setErrors((errs) => ({ ...errs, submit: result.error || 'Registration failed.' }));
        setSuccess(false);
        return false;
      }
      return true;
    } catch (error) {
      setErrors((errs) => ({ ...errs, submit: 'Error while submitting to backend: ' + error }));
      setSuccess(false);
      return false;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 2) { return;}
    setSubmitting(true);
    const registered = await handleRegister();
    setSubmitting(false);
    if (registered) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    }
  };

  const pwStrength = passwordStrength(form.password);
  const selectedTier = membershipTiers.find((t) => t.id === form.membershipTier);

  const fieldStyle = (hasError: boolean) => ({
    background: '#222',
    borderColor: hasError ? 'rgba(239,68,68,0.5)' : '#333',
  });

  if (success) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4" style={{ background: DARK }}>
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(200,244,0,0.12)' }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: LIME }} aria-hidden="true" />
          </div>
          <h1 className="text-white mb-2" style={{ fontWeight: 700, fontSize: '1.375rem' }}>Account created!</h1>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Welcome to KineticHub, {form.firstName}!</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Redirecting you to login…</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4"
      style={{ background: DARK }}
    >
      <div className="w-full max-w-lg">
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {/* Header */}
          <div className="px-8 py-7 text-center" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: LIME }}>
                <Zap className="w-4 h-4" style={{ color: '#111' }} aria-hidden="true" />
              </span>
              <span className="text-white" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                KINETIC<span style={{ color: LIME }}>HUB</span>
              </span>
            </Link>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: '1.25rem' }}>Create your account</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Join 1,200+ members transforming their fitness</p>
          </div>

          {/* Stepper */}
          <div className="px-8 pt-6 pb-0">
            <ol className="flex items-center gap-0" role="list">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors"
                      style={{
                        background: i < step ? '#22c55e' : i === step ? LIME : '#2a2a2a',
                        color: i < step ? '#fff' : i === step ? '#111' : 'rgba(255,255,255,0.4)',
                        fontWeight: 700,
                      }}
                      aria-current={i === step ? 'step' : undefined}
                    >
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span
                      className="text-xs mt-1 whitespace-nowrap"
                      style={{
                        color: i === step ? LIME : 'rgba(255,255,255,0.3)',
                        fontWeight: i === step ? 600 : 400,
                      }}
                    >
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-1 mb-4 transition-colors"
                      style={{ background: i < step ? '#22c55e' : '#2a2a2a' }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="px-8 py-6">
            {errors.submit && (
              <div
                className="flex items-start gap-2.5 rounded-xl p-4 mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Step 0: Account details */}
            {step === 0 && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {(['firstName', 'lastName'] as const).map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                        {field === 'firstName' ? 'First name' : 'Last name'}
                      </label>
                      <input
                        id={field}
                        type="text"
                        autoComplete={field === 'firstName' ? 'given-name' : 'family-name'}
                        value={form[field]}
                        onChange={(e) => update(field, e.target.value)}
                        className={inputBase}
                        style={fieldStyle(!!errors[field])}
                        aria-invalid={!!errors[field]}
                        aria-describedby={errors[field] ? `${field}-error` : undefined}
                        required
                      />
                      {errors[field] && (
                        <p id={`${field}-error`} className="mt-1 text-red-400 text-xs flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                    style={fieldStyle(!!errors.email)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    required
                  />
                  {errors.email && <p id="email-error" className="mt-1 text-red-400 text-xs flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.email}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    Phone number <span style={{ color: 'rgba(255,255,255,0.3)' }}>(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+44 7700 900000"
                    className={inputBase}
                    style={{ background: '#222', borderColor: '#333' }}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      placeholder="Min. 8 characters"
                      className={inputBase + ' pr-11'}
                      style={fieldStyle(!!errors.password)}
                      aria-invalid={!!errors.password}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] rounded-md"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1" aria-hidden="true">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < pwStrength.score ? pwStrength.colour : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Password strength: <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{pwStrength.label}</span>
                      </p>
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-red-400 text-xs flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.password}</p>}
                </div>

                <div className="mb-2">
                  <label htmlFor="confirmPassword" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Confirm password</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className={inputBase + ' pr-11'}
                      style={fieldStyle(!!errors.confirmPassword)}
                      aria-invalid={!!errors.confirmPassword}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a] rounded-md"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}>
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-red-400 text-xs flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.confirmPassword}</p>}
                </div>
              </div>
            )}

            {/* Step 1: Membership */}
            {step === 1 && (
              <div>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Select the plan that best fits your goals. You can always upgrade later.</p>
                <div className="space-y-3 mb-5" role="radiogroup" aria-label="Select membership plan">
                  {membershipTiers.slice(0, 3).map((tier) => (
                    <label
                      key={tier.id}
                      className="flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: form.membershipTier === tier.id ? LIME : '#2a2a2a',
                        background: form.membershipTier === tier.id ? 'rgba(200,244,0,0.06)' : '#222',
                      }}
                    >
                      <input
                        type="radio"
                        name="membershipTier"
                        value={tier.id}
                        checked={form.membershipTier === tier.id}
                        onChange={() => update('membershipTier', tier.id)}
                        className="mt-0.5"
                        style={{ accentColor: LIME }}
                        aria-label={`${tier.name} plan - £${tier.monthlyPrice}/month`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-white text-sm" style={{ fontWeight: 700 }}>{tier.name}</span>
                          <span className="text-white text-sm" style={{ fontWeight: 700 }}>S${tier.monthlyPrice}<span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/mo</span></span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{tier.description}</p>
                        {tier.popular && (
                          <span
                            className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs"
                            style={{ background: LIME, color: '#111', fontWeight: 600 }}
                          >Most Popular</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.membershipTier && <p className="text-red-400 text-xs flex items-center gap-1 mb-3" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.membershipTier}</p>}

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => update('agreeTerms', e.target.checked)}
                      style={{ accentColor: LIME }}
                      className="mt-0.5"
                      aria-required="true"
                      aria-describedby={errors.agreeTerms ? 'terms-error' : undefined}
                    />
                    <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      I agree to the{' '}
                      <a href="#" className="hover:underline" style={{ color: LIME }}>Terms & Conditions</a>{' '}
                      and{' '}
                      <a href="#" className="hover:underline" style={{ color: LIME }}>Privacy Policy</a>
                      <span className="text-red-400 ml-0.5">*</span>
                    </span>
                  </label>
                  {errors.agreeTerms && <p id="terms-error" className="text-red-400 text-xs flex items-center gap-1" role="alert"><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.agreeTerms}</p>}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeMarketing}
                      onChange={(e) => update('agreeMarketing', e.target.checked)}
                      style={{ accentColor: LIME }}
                      className="mt-0.5"
                    />
                    <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      I'd like to receive news, offers, and updates from KineticHub. You can unsubscribe at any time.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div>
                <div className="rounded-xl p-5 mb-5" style={{ background: '#222', border: '1px solid #333' }}>
                  <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Review Your Details</p>
                  <dl className="space-y-2">
                    {[
                      { label: 'Full Name', value: `${form.firstName} ${form.lastName}` },
                      { label: 'Email', value: form.email },
                      { label: 'Phone', value: form.phone || '—' },
                      { label: 'Plan', value: selectedTier ? `${selectedTier.name} – £${selectedTier.monthlyPrice}/mo` : '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</dt>
                        <dd className="text-xs text-right text-white" style={{ fontWeight: 500 }}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div
                  className="rounded-xl p-4 mb-4 flex items-start gap-2.5"
                  style={{ background: 'rgba(200,244,0,0.06)', border: `1px solid rgba(200,244,0,0.15)` }}
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: LIME }} aria-hidden="true" />
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,244,0,0.8)' }}>
                    Your first class is <span style={{ fontWeight: 600 }}>complimentary</span>. A welcome email will be sent to your registered address upon account creation.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={`flex gap-3 mt-4 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-full text-sm transition-colors hover:bg-white/5"
                  style={{ border: '1px solid #333', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full text-sm transition-all hover:opacity-90"
                  style={{ background: LIME, color: '#111', fontWeight: 700 }}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: LIME, color: '#111', fontWeight: 700 }}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" aria-hidden="true" />Creating account…</>
                  ) : (
                    <><UserPlus className="w-4 h-4" aria-hidden="true" />Create Account</>
                  )}
                </button>
              )}
            </div>
            {step === 2 && errors.firstName && (
              <div className="mt-2 text-red-400 text-xs flex items-center gap-1" role="alert">
                <span>{errors.firstName}</span>
              </div>
            )}
          </form>

          <div className="px-8 pb-6 text-center">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Already have an account?{' '}
              <Link to="/login" className="transition-colors hover:opacity-80" style={{ color: LIME, fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}