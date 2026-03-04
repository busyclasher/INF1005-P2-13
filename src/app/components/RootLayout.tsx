import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from 'sonner';

// Pages that should not render the standard footer
const NO_FOOTER_PATHS = ['/dashboard', '/admin'];

export function RootLayout() {
  const { pathname } = useLocation();
  const showFooter = !NO_FOOTER_PATHS.some((p) => pathname.startsWith(p));

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        {showFooter && <Footer />}
      </div>
    </>
  );
}
