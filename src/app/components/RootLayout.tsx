import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

const SITE_NAME = 'KineticHub';

const ROUTE_TITLES: Record<string, string> = {
  classes: 'Classes',
  programmes: 'Programmes',
  membership: 'Membership',
  about: 'About',
  login: 'Login',
  'forgot-password': 'Forgot password',
  register: 'Register',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  dashboard: 'Dashboard',
  admin: 'Admin',
};

function documentTitleForPath(pathname: string): string {
  if (pathname === '/') return `Home | ${SITE_NAME}`;
  const segment = pathname.split('/').filter(Boolean)[0];
  if (!segment) return `Home | ${SITE_NAME}`;
  const page = ROUTE_TITLES[segment];
  if (page) return `${page} | ${SITE_NAME}`;
  return `Page not found | ${SITE_NAME}`;
}

// Pages that should not render the standard footer
const NO_FOOTER_PATHS = ['/dashboard', '/admin'];

export function RootLayout() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER_PATHS.some((p) => pathname.startsWith(p));
  const outletWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = documentTitleForPath(pathname);
  }, [pathname]);

  useLayoutEffect(() => {
    const main = outletWrapperRef.current?.querySelector('main');
    if (!(main instanceof HTMLElement)) return;
    main.setAttribute('tabindex', '-1');
    main.setAttribute('data-route-focus-root', '');
    main.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div ref={outletWrapperRef} className="flex-1">
          <Outlet />
        </div>
        {showFooter && <Footer />}
      </div>
    </>
  );
}
