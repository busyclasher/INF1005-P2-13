import { Link } from 'react-router';

export function PrivacyPage() {
  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-slate-900 text-3xl font-extrabold mb-4">Privacy Policy</h1>
      <p className="text-slate-600 mb-6">
        This is a placeholder Privacy Policy page for the project demo. Replace with your organisation’s official policy.
      </p>

      <section aria-labelledby="privacy-summary" className="space-y-3">
        <h2 id="privacy-summary" className="text-slate-900 text-lg font-bold">Summary</h2>
        <ul className="list-disc pl-5 text-slate-600 space-y-1">
          <li>We collect the details you provide (e.g. name, email) to create and manage your account.</li>
          <li>We use data to provide bookings and membership features.</li>
          <li>You can request updates or deletion of your account data (where applicable).</li>
        </ul>
      </section>

      <div className="mt-8">
        <Link to="/register" className="text-orange-600 hover:underline font-medium">
          Back to registration
        </Link>
      </div>
    </main>
  );
}

