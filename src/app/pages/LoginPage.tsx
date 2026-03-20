import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router';
import { Eye, EyeOff, Zap, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LIME = '#C8F400';
const DARK = '#111111';
const CARD = '#1a1a1a';
const BORDER = 'rgba(255,255,255,0.08)';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginPage() {
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const validateField = (field: 'email' | 'password', value: string): string | undefined => {
    if (field === 'email') {
      if (!value.trim()) return 'Email address is required.';
      if (!validateEmail(value)) return 'Please enter a valid email address.';
    }
    if (field === 'password') {
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
    }
    return undefined;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((t) => ({ ...t, [field]: true }));
    const value = field === 'email' ? email : password;
    const error = validateField(field, value);
    setErrors((e) => ({ ...e, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit triggered", { email, password });
    e.preventDefault();
    
    console.log("Validating fields...");
    setTouched({ email: true, password: true });

    const emailErr = validateField('email', email);
    const pwErr = validateField('password', password);
    
    console.log("Validation results:", { emailErr, pwErr });
    
    if (emailErr || pwErr) {
      console.log("Validation failed");
      setErrors({ email: emailErr, password: pwErr });
      return;
    }

    console.log("Validation passed, attempting login...");
    setLoading(true);
    setErrors({});

    try {
      console.log("Calling login from AuthContext...");
      // Use the login function from AuthContext instead of direct fetch
      const result = await login(email, password);
      
      console.log("Login result:", result);
      
      if (result.success) {
        console.log("Login successful! Redirecting...");
        // Navigation will happen automatically via the redirect check above
      } else {
        console.log("Login failed:", result.error);
        setErrors({ general: result.error || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm placeholder-white/20 transition-colors focus:outline-none focus:ring-2 text-white ${
      hasError
        ? 'border-red-500/50 bg-red-500/10 focus:ring-red-500/30'
        : 'focus:ring-[#C8F400]/30 focus:border-[#C8F400]/50'
    }`;

  if (authLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center" style={{ background: DARK }}>
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  return (
    <main
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4"
      style={{ background: DARK }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {/* Header */}
          <div className="px-8 py-8 text-center" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-5" aria-label="KineticHub home">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: LIME }}>
                <Zap className="w-5 h-5" style={{ color: '#111' }} aria-hidden="true" />
              </span>
              <span className="text-white" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                KINETIC<span style={{ color: LIME }}>HUB</span>
              </span>
            </Link>
            <h1 className="text-white" style={{ fontWeight: 700, fontSize: '1.375rem' }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Sign in to access your member dashboard</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {/* Demo credentials hint */}
            <div
              className="rounded-xl p-4 mb-6"
              style={{ background: 'rgba(200,244,0,0.06)', border: `1px solid rgba(200,244,0,0.15)` }}
              role="note"
              aria-label="Demo credentials"
            >
              <p className="text-sm" style={{ color: LIME, fontWeight: 600 }}>Demo Credentials</p>
              <div className="mt-1.5 space-y-1 text-xs" style={{ color: 'rgba(200,244,0,0.7)' }}>
                <p><span style={{ fontWeight: 500 }}>Member:</span> member@kinetikhub.com / Member@1234</p>
                <p><span style={{ fontWeight: 500 }}>Admin:</span> admin@kinetikhub.com / Admin@1234</p>
              </div>
            </div>

            {/* General error */}
            {errors.general && (
              <div
                className="flex items-start gap-2.5 rounded-xl p-4 mb-5"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      setErrors((err) => ({ ...err, email: validateField('email', e.target.value) }));
                    }
                  }}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  className={inputClass(!!errors.email)}
                  style={{ background: '#222', borderColor: errors.email ? undefined : '#333' }}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                  required
                />
                {errors.email && (
                  <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    Password
                  </label>
                  <a href="#" className="text-xs transition-colors hover:opacity-80" style={{ color: LIME }}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) {
                        setErrors((err) => ({ ...err, password: validateField('password', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter your password"
                    className={inputClass(!!errors.password) + ' pr-11'}
                    style={{ background: '#222', borderColor: errors.password ? undefined : '#333' }}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: LIME, color: '#111', fontWeight: 700 }}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" aria-hidden="true" /> Sign In
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="transition-colors hover:opacity-80" style={{ color: LIME, fontWeight: 600 }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}