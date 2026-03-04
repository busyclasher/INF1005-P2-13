import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router';
import {
  LayoutDashboard, Calendar, User, CreditCard, LogOut, CheckCircle2,
  Clock, ChevronRight, Zap, AlertCircle, XCircle, Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminBookings, membershipTiers } from '../data/mockData';
import { toast } from 'sonner';

type Tab = 'overview' | 'bookings' | 'profile' | 'membership';

const statusColour: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Attended: 'bg-slate-100 text-slate-600',
  Cancelled: 'bg-red-100 text-red-600',
};

export function DashboardPage() {
  const { user, logout, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileErrors, setProfileErrors] = useState<{ name?: string }>({});

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const myBookings = adminBookings.filter((b) => b.memberId === user.id);
  const confirmedCount = myBookings.filter((b) => b.status === 'Confirmed').length;
  const attendedCount = myBookings.filter((b) => b.status === 'Attended').length;
  const currentTier = membershipTiers.find((t) => t.name === user.membershipTier);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileSave = () => {
    if (!profileForm.name.trim()) {
      setProfileErrors({ name: 'Name is required.' });
      return;
    }
    updateProfile({ name: profileForm.name, phone: profileForm.phone });
    setEditMode(false);
    toast.success('Profile updated successfully.');
  };

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'membership', label: 'Membership', icon: CreditCard },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50" aria-label="Member dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0" aria-label="Dashboard navigation">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Profile card */}
              <div className="bg-slate-900 p-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center text-white" style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {user.avatarInitials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{user.name}</p>
                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-orange-500 text-white text-xs rounded-full" style={{ fontWeight: 500 }}>
                    {user.membershipTier}
                  </span>
                  <span className="text-slate-400 text-xs">Member</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="p-2" aria-label="Dashboard menu">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors mb-0.5 ${
                      tab === id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    style={{ fontWeight: tab === id ? 600 : 400 }}
                    aria-current={tab === id ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </nav>

              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {tab === 'overview' && (
              <section aria-labelledby="overview-heading">
                <h1 id="overview-heading" className="text-slate-900 mb-6" style={{ fontWeight: 700, fontSize: '1.5rem' }}>
                  Welcome back, {user.name.split(' ')[0]}! 👋
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Upcoming Classes', value: confirmedCount, icon: Calendar, colour: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Classes Attended', value: attendedCount, icon: CheckCircle2, colour: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Total Bookings', value: myBookings.length, icon: Zap, colour: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Member Since', value: new Date(user.joinDate).getFullYear(), icon: User, colour: 'text-purple-600', bg: 'bg-purple-50' },
                  ].map(({ label, value, icon: Icon, colour, bg }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className={`w-4 h-4 ${colour}`} aria-hidden="true" />
                      </div>
                      <p className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>{value}</p>
                      <p className="text-slate-500 text-xs mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Upcoming bookings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-slate-900" style={{ fontWeight: 700 }}>Upcoming Classes</h2>
                    <button onClick={() => setTab('bookings')} className="text-orange-500 text-sm hover:underline" style={{ fontWeight: 500 }}>
                      View all
                    </button>
                  </div>
                  {myBookings.filter(b => b.status === 'Confirmed').length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-slate-500 text-sm">No upcoming bookings.</p>
                      <Link to="/classes" className="text-orange-500 text-sm hover:underline mt-1 inline-block" style={{ fontWeight: 500 }}>Browse classes</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.filter(b => b.status === 'Confirmed').map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-orange-500" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{booking.className}</p>
                              <p className="text-slate-500 text-xs">{booking.day} at {booking.time}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColour[booking.status]}`} style={{ fontWeight: 500 }}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick links */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-slate-900 mb-4" style={{ fontWeight: 700 }}>Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Book a Class', desc: 'Browse the weekly timetable', to: '/classes', icon: Calendar },
                      { label: 'Explore Programmes', desc: 'Structured training pathways', to: '/programmes', icon: Zap },
                      { label: 'Upgrade Plan', desc: 'Unlock more benefits', to: '/membership', icon: CreditCard },
                      { label: 'Edit Profile', desc: 'Update your details', action: () => setTab('profile'), icon: Settings },
                    ].map((item) => (
                      <div key={item.label} className="group">
                        {'to' in item ? (
                          <Link to={item.to} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-orange-500" aria-hidden="true" />
                              <div>
                                <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{item.label}</p>
                                <p className="text-slate-400 text-xs">{item.desc}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" aria-hidden="true" />
                          </Link>
                        ) : (
                          <button onClick={item.action} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-orange-50 transition-colors text-left">
                            <div className="flex items-center gap-3">
                              <item.icon className="w-4 h-4 text-orange-500" aria-hidden="true" />
                              <div>
                                <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{item.label}</p>
                                <p className="text-slate-400 text-xs">{item.desc}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Bookings */}
            {tab === 'bookings' && (
              <section aria-labelledby="bookings-heading">
                <div className="flex items-center justify-between mb-6">
                  <h1 id="bookings-heading" className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>My Bookings</h1>
                  <Link to="/classes" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                    Book a Class
                  </Link>
                </div>
                {myBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-slate-600" style={{ fontWeight: 500 }}>No bookings yet</p>
                    <p className="text-slate-400 text-sm">Browse our classes and book your first session.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full" role="table" aria-label="My class bookings">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {['Class', 'Day & Time', 'Booked On', 'Status'].map((h) => (
                            <th key={h} scope="col" className="text-left text-xs text-slate-500 px-4 py-3" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>{b.className}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="text-slate-600 text-sm">{b.day}</p>
                              <p className="text-slate-400 text-xs">{b.time}</p>
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 text-sm">{b.bookedAt}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs ${statusColour[b.status]}`} style={{ fontWeight: 500 }}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* Profile */}
            {tab === 'profile' && (
              <section aria-labelledby="profile-heading">
                <div className="flex items-center justify-between mb-6">
                  <h1 id="profile-heading" className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>My Profile</h1>
                  {!editMode && (
                    <button onClick={() => setEditMode(true)} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  {editMode ? (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="profile-name" className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 500 }}>Full Name</label>
                        <input
                          id="profile-name"
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                            profileErrors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                          }`}
                        />
                        {profileErrors.name && <p className="mt-1 text-red-600 text-xs" role="alert">{profileErrors.name}</p>}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="profile-email" className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 500 }}>Email Address</label>
                        <input id="profile-email" type="email" value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed" />
                        <p className="mt-1 text-slate-400 text-xs">Email cannot be changed. Contact support if needed.</p>
                      </div>
                      <div className="mb-6">
                        <label htmlFor="profile-phone" className="block text-slate-700 text-sm mb-1.5" style={{ fontWeight: 500 }}>Phone Number</label>
                        <input
                          id="profile-phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleProfileSave} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors" style={{ fontWeight: 600 }}>
                          Save Changes
                        </button>
                        <button onClick={() => { setEditMode(false); setProfileErrors({}); }} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-slate-100">
                      {[
                        { label: 'Full Name', value: user.name },
                        { label: 'Email Address', value: user.email },
                        { label: 'Phone Number', value: user.phone || 'Not provided' },
                        { label: 'Member Since', value: new Date(user.joinDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                        { label: 'Account Role', value: user.role === 'admin' ? 'Administrator' : 'Member' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-3.5 gap-4">
                          <dt className="text-slate-500 text-sm">{label}</dt>
                          <dd className="text-slate-800 text-sm text-right" style={{ fontWeight: 500 }}>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </section>
            )}

            {/* Membership */}
            {tab === 'membership' && (
              <section aria-labelledby="membership-dash-heading">
                <h1 id="membership-dash-heading" className="text-slate-900 mb-6" style={{ fontWeight: 700, fontSize: '1.5rem' }}>My Membership</h1>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <p className="text-slate-500 text-sm">Current Plan</p>
                      <p className="text-slate-900 mt-0.5" style={{ fontWeight: 800, fontSize: '1.375rem' }}>{user.membershipTier}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full" style={{ fontWeight: 600 }}>
                      Active
                    </span>
                  </div>
                  {currentTier && (
                    <>
                      <p className="text-slate-900 mb-1" style={{ fontWeight: 700, fontSize: '1.875rem' }}>
                        £{currentTier.monthlyPrice}<span className="text-slate-400 text-base" style={{ fontWeight: 400 }}>/month</span>
                      </p>
                      <p className="text-slate-500 text-sm mb-5">{currentTier.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {currentTier.features.filter(f => f.included).map(f => (
                          <div key={f.text} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" aria-hidden="true" />
                            {f.text}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                    <Link to="/membership" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors" style={{ fontWeight: 600 }}>
                      Upgrade Plan
                    </Link>
                    <button className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                      Freeze Membership
                    </button>
                    <button className="px-5 py-2.5 border border-red-200 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors" style={{ fontWeight: 500 }}>
                      Cancel Membership
                    </button>
                  </div>
                </div>

                {/* Billing notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-blue-800 text-sm" style={{ fontWeight: 600 }}>Next billing date</p>
                    <p className="text-blue-700 text-sm">Your next payment of £{currentTier?.monthlyPrice || 0} is due on 1 April 2026.</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}