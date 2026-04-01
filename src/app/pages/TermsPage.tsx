import { Link } from 'react-router';

export function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-slate-900 text-3xl font-extrabold mb-4">Terms &amp; Conditions</h1>
      <p className="text-slate-600 mb-6">
        This is a placeholder Terms page for the project demo. Replace with your organisation’s official terms.
      </p>

      <section aria-labelledby="terms-summary" className="space-y-3">
        <h2 id="terms-summary" className="text-slate-900 text-lg font-bold">Summary</h2>
        <ul className="list-disc pl-5 text-slate-600 space-y-1">
          <li>Memberships, bookings, and payments are subject to availability and studio policies.</li>
          <li>Account access is personal—do not share credentials.</li>
          <li>We may update these terms; changes apply from the published date.</li>
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

