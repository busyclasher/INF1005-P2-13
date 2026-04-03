import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

const DARK = '#111111';
const CARD = '#1a1a1a';
const BORDER = 'rgba(255,255,255,0.08)';
const LIME = '#C8F400';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ForgotPasswordPage() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Email address is required.');
      emailRef.current?.focus();
      return;
    }
    if (!validateEmail(trimmed)) {
      setError('Please enter a valid email address.');
      emailRef.current?.focus();
      return;
    }

    setError(undefined);
    setSubmitting(true);
    try {
      // Placeholder flow: backend endpoint not implemented in this project.
      await new Promise((r) => setTimeout(r, 600));
      toast.success('If an account exists for that email, a reset link will be sent shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4" style={{ background: DARK }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="px-8 py-8 text-center" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: '1.375rem' }}>Reset your password</h1>
            <p className="text-sm mt-1" style={{ color: '#a3a3a3' }}>
              Enter your email and we’ll send reset instructions (demo flow).
            </p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div
                className="rounded-xl p-4 mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                role="alert"
                aria-live="assertive"
              >
                <p className="text-red-400 text-sm" style={{ fontWeight: 600 }}>Please fix the following:</p>
                <button
                  type="button"
                  className="mt-2 text-left text-sm text-red-300 hover:underline"
                  onClick={() => emailRef.current?.focus()}
                >
                  Email: {error}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="reset-email" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                Email address
              </label>
              <p id="reset-email-hint" className="text-xs mb-2" style={{ color: '#a3a3a3' }}>
                We’ll send instructions to this address.
              </p>
              <input
                id="reset-email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm text-white placeholder-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8F400]/30"
                style={{ background: '#222', borderColor: error ? 'rgba(239,68,68,0.5)' : '#333' }}
                aria-describedby={error ? 'reset-email-hint reset-email-error' : 'reset-email-hint'}
                aria-invalid={!!error}
                aria-errormessage={error ? 'reset-email-error' : undefined}
                required
              />
              {error && (
                <p id="reset-email-error" className="mt-1.5 text-red-400 text-xs" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-6 py-3 rounded-full text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: LIME, color: '#111', fontWeight: 700 }}
                aria-busy={submitting}
              >
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#a3a3a3' }}>
              Remembered it?{' '}
              <Link to="/login" className="transition-colors hover:opacity-80" style={{ color: LIME, fontWeight: 600 }}>
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

