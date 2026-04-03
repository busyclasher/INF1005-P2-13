import { Link } from 'react-router';
import { Zap, Home, Calendar, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-orange-500" aria-hidden="true" />
          </span>
        </div>
        <p className="text-orange-500 text-sm mb-1" style={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          404 — Page Not Found
        </p>
        <h1 className="text-slate-900 mb-3" style={{ fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Oops! Off the beaten track.
        </h1>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on course.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-orange-800 hover:bg-orange-900 text-white rounded-xl transition-colors"
            style={{ fontWeight: 600 }}
          >
            <Home className="w-4 h-4" aria-hidden="true" /> Go Home
          </Link>
          <Link
            to="/classes"
            className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            style={{ fontWeight: 500 }}
          >
            <Calendar className="w-4 h-4" aria-hidden="true" /> Browse Classes
          </Link>
        </div>
      </div>
    </main>
  );
}
