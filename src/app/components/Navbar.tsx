import { useEffect, useRef, useState } from 'react';
import { Link, useMatch, useNavigate } from 'react-router';
import { Menu, X, ChevronDown, LayoutDashboard, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import kineticHubLogo from '../../../assets/Kinetic-Hub.png';

const navLinks = [
  { to: '/classes', label: 'Classes' },
  { to: '/programmes', label: 'Programmes' },
  { to: '/membership', label: 'Membership' },
  { to: '/about', label: 'About Us' },
];

const LIME = '#C8F400';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement | null>(null);
  const dropdownMenuRef = useRef<HTMLDivElement | null>(null);

    const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';
  
  const userDisplayName = user?.firstName 
    ? user.firstName 
    : user?.email?.split('@')[0] || 'User';
  
  function TopNavItem({ to, label, onNavigate }: { to: string; label: string; onNavigate?: () => void }) {
    const match = useMatch({ path: to, end: true });
    const isActive = !!match;
    return (
      <Link
        to={to}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={`px-4 py-2 rounded-lg transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] ${
          isActive
            ? 'text-white bg-white/10'
            : 'text-white/80 hover:text-white hover:bg-white/5'
        }`}
        style={{ fontWeight: 500 }}
      >
        {label}
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    if (!dropdownOpen && !mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDropdownOpen(false);
      setMobileOpen(false);
      dropdownButtonRef.current?.focus();
    };

    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      if (!dropdownOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (dropdownMenuRef.current?.contains(target)) return;
      if (dropdownButtonRef.current?.contains(target)) return;
      setDropdownOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [dropdownOpen, mobileOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    // Move focus into the menu for keyboard users
    firstMenuItemRef.current?.focus();
  }, [dropdownOpen]);

  return (
    <header style={{ background: '#111111' }} className="sticky top-0 z-50 border-b border-white/5">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
          aria-label="KineticHub – Home"
        >
          <img
            src={kineticHubLogo}
            alt="KineticHub logo"
            className="w-25 h-25 rounded-lg object-contain"
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1 list-none p-0 m-0" role="list">
          {navLinks.map((link) => (
            <li key={link.to} role="listitem">
              <TopNavItem to={link.to} label={link.label} />
            </li>
          ))}
        </ul>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                ref={dropdownButtonRef}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="Account menu"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                  style={{ background: LIME, color: '#111', fontWeight: 700 }}
                >
                  {userInitials}
                </span>
                <span className="max-w-[120px] truncate text-white">{userDisplayName}</span>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-xs rounded" style={{ background: LIME, color: '#111', fontWeight: 600 }}>Admin</span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {dropdownOpen && (
                <div
                  ref={dropdownMenuRef}
                  className="absolute right-0 mt-2 w-52 rounded-xl shadow-2xl border py-1 z-50"
                  style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}
                  aria-label="Account options"
                >
                  <div className="px-4 py-2 border-b" style={{ borderColor: '#2a2a2a' }}>
                    <p className="text-xs text-white/70">Signed in as</p>
                    <p className="text-sm text-white truncate" style={{ fontWeight: 500 }}>{user.email}</p>
                  </div>
                  {user.role === 'admin' ? (
                    <Link
                      ref={firstMenuItemRef}
                      to="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Shield className="w-4 h-4 text-white/70" aria-hidden="true" />
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      ref={firstMenuItemRef}
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-white/70" aria-hidden="true" />
                      My Dashboard
                    </Link>
                  )}
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                    onClick={() => { setDropdownOpen(false); }}
                  >
                    <Settings className="w-4 h-4 text-white/70" aria-hidden="true" />
                    Settings
                  </Link>
                  <div className="border-t mt-1" style={{ borderColor: '#2a2a2a' }}>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                style={{ fontWeight: 500 }}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm rounded-full transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                style={{ background: LIME, color: '#111', fontWeight: 700 }}
              >
                Try for free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t px-4 py-4"
          style={{ background: '#111111', borderColor: '#2a2a2a' }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <TopNavItem
                key={link.to}
                to={link.to}
                label={link.label}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
            <div className="border-t pt-3 mt-2 flex flex-col gap-2" style={{ borderColor: '#2a2a2a' }}>
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                      style={{ background: LIME, color: '#111', fontWeight: 700 }}
                    >
                      {userInitials}
                    </span>
                    <div>
                      <p className="text-sm text-white" style={{ fontWeight: 600 }}>{userDisplayName}</p>
                      <p className="text-xs text-white/70">{user.membershipTier} member</p>
                    </div>
                  </div>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]" onClick={() => setMobileOpen(false)}>
                      <Shield className="w-4 h-4" aria-hidden="true" /> Admin Panel
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> My Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]">
                    <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-3 rounded-full text-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
                    style={{ background: LIME, color: '#111', fontWeight: 700 }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Try for free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
