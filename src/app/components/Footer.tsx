import { Link } from 'react-router';
import { Zap, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const LIME = '#C8F400';
const DARK = '#111111';

export function Footer() {
  return (
    <footer style={{ background: DARK, color: 'rgba(255,255,255,0.5)' }} role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" aria-label="KineticHub – Home">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: LIME }}>
                <Zap className="w-4 h-4" style={{ color: '#111' }} aria-hidden="true" />
              </span>
              <span className="text-white" style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
                KINETIC<span style={{ color: LIME }}>HUB</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              A boutique fitness studio dedicated to helping you move better, feel stronger, and live fully.
            </p>
            <div className="flex items-center gap-3" aria-label="Social media links">
              {[
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter / X' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = LIME;
                    (e.currentTarget as HTMLAnchorElement).style.color = '#111';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#1a1a1a';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)';
                  }}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm mb-4" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Explore
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/classes', label: 'Group Classes' },
                { to: '/programmes', label: 'Training Programmes' },
                { to: '/membership', label: 'Membership Plans' },
                { to: '/about', label: 'About Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = LIME)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-white text-sm mb-4" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Members
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/login', label: 'Log In' },
                { to: '/register', label: 'Create Account' },
                { to: '/dashboard', label: 'My Dashboard' },
                { to: '/membership', label: 'Upgrade Plan' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = LIME)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm mb-4" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Contact
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: LIME }} aria-hidden="true" />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  14 KineticHub Way, Tanjong Pagar<br />Singapore, 088741
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: LIME }} aria-hidden="true" />
                <a
                  href="tel:+6562345678"
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = LIME)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  +65 6234 5678
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: LIME }} aria-hidden="true" />
                <a
                  href="mailto:hello@kinetikhub.sg"
                  className="text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = LIME)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  hello@kinetikhub.sg
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: '#1e1e1e' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} KineticHub Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}