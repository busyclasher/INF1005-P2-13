import { Link } from 'react-router';
import { Zap, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="bg-[#111111] text-white/60"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
              aria-label="KineticHub – Home"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Zap className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
              </span>
              <span className="text-white font-extrabold text-lg tracking-tight">
                KINETIC<span className="text-primary">HUB</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-white/55">
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
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1a1a1a] text-white/55 transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm mb-4 font-semibold uppercase tracking-wider">
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
                    className="text-sm text-white/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-white text-sm mb-4 font-semibold uppercase tracking-wider">
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
                    className="text-sm text-white/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm mb-4 font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm text-white/55">
                  14 KineticHub Way, Tanjong Pagar<br />Singapore, 088741
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href="tel:+6562345678"
                  className="text-sm text-white/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                >
                  +65 6234 5678
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href="mailto:hello@kinetikhub.sg"
                  className="text-sm text-white/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                >
                  hello@kinetikhub.sg
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e1e1e] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} KineticHub Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-white/50 transition-colors hover:text-white/85 focus-visible:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
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
