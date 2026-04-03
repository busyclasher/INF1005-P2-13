import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router';
import {
  LayoutDashboard, Calendar, User, CreditCard, LogOut, CheckCircle2,
  Zap, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { SurfaceCard } from '../components/brand';

type Tab = 'overview' | 'bookings' | 'profile' | 'membership';

// You can configure this base URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://35.212.166.173/backend/api';

const statusColour: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-800',
  Attended: 'bg-slate-100 text-slate-700',
  Cancelled: 'bg-red-100 text-red-800',
};

export function DashboardPage() {
  const { user, logout, isAuthenticated, updateProfile, deleteAccount, getAuthHeaders, token } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [editMode, setEditMode] = useState(false);
  
  // State for fetched data
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [currentTier, setCurrentTier] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Profile Form state
  const fullName = user ? `${user.firstName} ${user.lastName}` : '';
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';
  
  const [profileForm, setProfileForm] = useState({
    name: fullName,
    phone: user?.phone || '',
  });
  const [profileErrors, setProfileErrors] = useState<{ name?: string }>({});
  const profileNameRef = useRef<HTMLInputElement | null>(null);

  // Fetch initial data
  useEffect(() => {
    if (!user) return;

    if (user) {
      setProfileForm({
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '',
      });
    }


    const fetchDashboardData = async () => {
      setLoadingContent(true);
      try {
        // Fetch bookings
        const bookingsRes = await fetch(`${API_BASE}/bookings.php?user_id=${user.id}`, {headers: {...getAuthHeaders(), 'Content-Type': 'application/json'}});
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          // Format the bookings
          const formatted = bookingsData.data.map((b: any) => ({
            id: b.booking_id,
            className: b.title,
            day: new Date(b.session_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
            time: b.start_time.substring(0, 5),
            status: 'Confirmed', // Default logic based on your DB or date comparison
            bookedAt: new Date(b.booking_time).toLocaleDateString('en-GB')
          }));
          setMyBookings(formatted);
        }

        // Fetch membership
        const memRes = await fetch(`${API_BASE}/memberships.php?user_id=${user.id}`, {headers: {...getAuthHeaders(), 'Content-Type': 'application/json'}});
        const memData = await memRes.json();
        if (memData.success && memData.data) {
          setCurrentTier(memData.data);
        }
      } catch (err) {
        toast.error("Failed to load dashboard data. Assuming local dev environment issues.");
        console.error(err);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchDashboardData();
  }, [user, getAuthHeaders, logout, navigate]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      const res = await fetch(`${API_BASE}/bookings.php`, {
        method: 'DELETE',
        headers: {...getAuthHeaders() , 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, user_id: user.id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setMyBookings(myBookings.filter(b => b.id !== bookingId));
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Network error cancelling booking.");
    }
  };

  const handleProfileSave = async () => {
  if (!profileForm.name.trim()) {
    setProfileErrors({ name: 'Name is required.' });
    profileNameRef.current?.focus();
    return;
  }
  
  const nameParts = profileForm.name.trim().split(' ') || [''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Only include phone if it has a value, otherwise keep existing
  const phoneToSend = profileForm.phone.trim() !== '' ? profileForm.phone : user?.phone || '';
  
  setLoadingContent(true);
  setSavingProfile(true);
  const result = await updateProfile({ firstName, lastName, phone: phoneToSend });
  setLoadingContent(false);
  setSavingProfile(false);
  
  if (result.success) {
    setEditMode(false);
    toast.success('Profile updated successfully.');
    // Refresh the form with the new data
    setProfileForm({
      name: `${firstName} ${lastName}`,
      phone: phoneToSend,
    });
  } else {
    toast.error(result.error || 'Failed to update profile.');
  }
};

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    const result = await deleteAccount();
    setDeletingAccount(false);

    if (result.success){
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    }
    else {
      toast.error(result.error || 'Failed to delete account');
    }
  } 

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'membership', label: 'Membership', icon: CreditCard },
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50" aria-labelledby="dashboard-page-heading">
      <h1 id="dashboard-page-heading" className="sr-only">Member dashboard</h1>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0" aria-label="Dashboard navigation">
            <SurfaceCard variant="light" padding="none" className="overflow-hidden shadow-sm">
              <div className="bg-slate-900 p-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-black font-bold text-base">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate font-semibold">{fullName}</p>
                    <p className="text-slate-300 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 bg-orange-800 text-white text-xs rounded-full font-medium">
                    {currentTier ? currentTier.plan_name : (user.membershipTier || 'Basic')}
                  </span>
                  <span className="text-slate-300 text-xs">{user.role || 'Member'}</span>
                </div>
              </div>

              <nav className="p-2" aria-label="Dashboard menu">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors mb-0.5 ${
                      tab === id ? 'bg-orange-100 text-orange-900 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal'
                    }`}
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-800 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </SurfaceCard>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {loadingContent ? (
                <div className="p-10 text-center text-slate-500">Loading dashboard...</div>
            ) : (
                <>
                {tab === 'overview' && (
              <section aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="text-slate-900 mb-6 font-bold text-2xl">
                  Welcome back, {user?.firstName || 'Member'}! <span aria-hidden="true">👋</span>
                </h2>

                {/* Status Alert - Fulfills requirement of success/error messages */}
                {currentTier?.status === 'active' && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">Member Status: </strong>
                    <span className="block sm:inline">Your {currentTier.plan_name} plan is active until {new Date(currentTier.end_date).toLocaleDateString()}.</span>
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Upcoming', value: myBookings.length, icon: Calendar, colour: 'text-blue-800', bg: 'bg-blue-100' },
                    { label: 'Attended', value: 0, icon: CheckCircle2, colour: 'text-green-800', bg: 'bg-green-100' },
                    { label: 'Total', value: myBookings.length, icon: Zap, colour: 'text-orange-900', bg: 'bg-orange-100' },
                    { label: 'Member Since', value: new Date(user.joinDate || Date.now()).getFullYear(), icon: User, colour: 'text-purple-900', bg: 'bg-purple-100' },
                  ].map(({ label, value, icon: Icon, colour, bg }) => (
                    <SurfaceCard key={label} variant="light" padding="default" className="rounded-xl p-4 shadow-sm">
                      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className={`w-4 h-4 ${colour}`} aria-hidden="true" />
                      </div>
                      <p className="text-slate-900 font-extrabold text-2xl leading-none">{value}</p>
                      <p className="text-slate-600 text-xs mt-1">{label}</p>
                    </SurfaceCard>
                  ))}
                </div>

                {/* Upcoming bookings */}
                <SurfaceCard variant="light" className="mb-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-slate-900 font-bold">Upcoming Classes</h2>
                    <button onClick={() => setTab('bookings')} className="text-orange-800 text-sm hover:underline font-medium">
                      View all
                    </button>
                  </div>
                  {myBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" aria-hidden="true" />
                      <p className="text-slate-500 text-sm">No upcoming bookings.</p>
                      <Link to="/classes" className="text-orange-800 text-sm hover:underline mt-1 inline-block font-medium">Browse classes</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-orange-800" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="text-slate-800 text-sm font-semibold">{booking.className}</p>
                              <p className="text-slate-600 text-xs">{booking.day} at {booking.time}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${statusColour[booking.status]}`} style={{ fontWeight: 500 }}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </SurfaceCard>
              </section>
            )}

            {tab === 'bookings' && (
              <section aria-labelledby="bookings-heading">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="bookings-heading" className="text-slate-900 font-bold text-2xl">My Bookings</h2>
                  <Link to="/classes" className="px-4 py-2 bg-orange-800 hover:bg-orange-900 text-white text-sm rounded-lg transition-colors font-medium">
                    Book a Class
                  </Link>
                </div>
                {myBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-slate-600 font-medium">No bookings yet</p>
                    <p className="text-slate-600 text-sm">Browse our classes and book your first session.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full" role="table">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {['Class', 'Day & Time', 'Booked On', 'Status', 'Action'].map((h) => (
                            <th key={h} scope="col" className="text-left text-xs text-slate-600 px-4 py-3 font-semibold uppercase tracking-wide">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {myBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <p className="text-slate-800 text-sm font-semibold">{b.className}</p>
                            </td>
                            <td className="px-4 py-3.5">
                              <p className="text-slate-600 text-sm">{b.day}</p>
                              <p className="text-slate-600 text-xs">{b.time}</p>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600 text-sm">{b.bookedAt}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-xs ${statusColour[b.status]}`} style={{ fontWeight: 500 }}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                                <button 
                                    onClick={() => cancelBooking(b.id)}
                                    className="px-3 py-1 bg-red-50 text-red-800 border border-red-300 rounded text-xs hover:bg-red-100 font-medium transition-colors">
                                    Cancel
                                </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {tab === 'profile' && (
              <section aria-labelledby="profile-heading">
                <div className="flex items-center justify-between mb-6">
                  <h2 id="profile-heading" className="text-slate-900 font-bold text-2xl">My Profile</h2>
                  {!editMode && (
                    <button onClick={() =>{setEditMode(true);}} className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors font-medium">
                      Edit Profile
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  {editMode ? (
                    <div>
                      {profileErrors.name && (
                        <div
                          className="rounded-xl p-4 mb-5 bg-red-50 border border-red-200"
                          role="alert"
                          aria-live="assertive"
                        >
                          <p className="text-red-800 text-sm font-semibold">Please fix the following:</p>
                          <ul className="mt-2">
                            <li>
                              <button
                                type="button"
                                className="text-left text-sm text-red-700 hover:underline"
                                onClick={() => profileNameRef.current?.focus()}
                              >
                                Full Name: {profileErrors.name}
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                      <div className="mb-4">
                        <label htmlFor="profile-name" className="block text-slate-700 text-sm mb-1.5 font-medium">Full Name</label>
                        <p id="profile-name-hint" className="text-xs mb-2 text-slate-500">
                          Enter your first and last name.
                        </p>
                        <input
                          id="profile-name"
                          ref={profileNameRef}
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(f => ({ ...f, name: e.target.value }))}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                            profileErrors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'
                          }`}
                          aria-invalid={!!profileErrors.name}
                          aria-describedby={profileErrors.name ? 'profile-name-hint profile-name-error' : 'profile-name-hint'}
                          aria-errormessage={profileErrors.name ? 'profile-name-error' : undefined}
                        />
                        {profileErrors.name && <p id="profile-name-error" className="mt-1 text-red-600 text-xs" role="alert">{profileErrors.name}</p>}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="profile-email" className="block text-slate-700 text-sm mb-1.5 font-medium">Email Address</label>
                        <input id="profile-email" type="email" value={user.email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed" />
                      </div>
                      <div className="mb-6">
                        <label htmlFor="profile-phone" className="block text-slate-700 text-sm mb-1.5 font-medium">Phone Number</label>
                        <input
                          id="profile-phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => {handleProfileSave();}} disabled={savingProfile} className="px-5 py-2.5 bg-orange-800 hover:bg-orange-900 text-white text-sm rounded-lg transition-colors font-semibold">
                          {savingProfile ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={() => { setEditMode(false); setProfileErrors({}); }} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                    <dl className="divide-y divide-slate-100">
                      {[
                        { label: 'Full Name', value: fullName },
                        { label: 'Email Address', value: user.email },
                        { label: 'Phone Number', value: user.phone || 'Not provided' },
                        { label: 'Member Since', value: new Date(user.joinDate || Date.now()).toLocaleDateString('en-GB') },
                        { label: 'Account Role', value: user.role === 'admin' ? 'Administrator' : 'Member' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-3.5 gap-4">
                          <dt className="text-slate-500 text-sm">{label}</dt>
                          <dd className="text-slate-800 text-sm text-right font-medium">{value}</dd>
                        </div>
                      ))}
                    </dl>

                      {/* Delete Account Section */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <h3 className="text-red-800 font-semibold text-sm mb-2">Danger Zone</h3>
                        <p className="text-red-600 text-xs mb-4">Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
                        
                        {!showDeleteConfirm ? (
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors font-medium"
                          >
                            Delete Account
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-red-700 text-sm font-medium">Are you sure you want to delete your account?</p>
                            <div className="flex gap-3">
                              <button
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors font-medium disabled:opacity-50"
                              >
                                {deletingAccount ? 'Deleting...' : 'Yes, Delete My Account'}
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {tab === 'membership' && (
              <section aria-labelledby="membership-dash-heading">
                <h2 id="membership-dash-heading" className="text-slate-900 mb-6 font-bold text-2xl">My Membership</h2>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                  {currentTier ? (
                    <>
                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                      <div>
                        <p className="text-slate-500 text-sm">Current Plan</p>
                        <p className="text-slate-900 mt-0.5 font-extrabold text-xl">{currentTier.plan_name}</p>
                      </div>
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-full font-semibold">
                        {currentTier.status.charAt(0).toUpperCase() + currentTier.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-slate-900 mb-1 font-bold text-3xl">
                      £{currentTier.price}<span className="text-slate-600 text-base font-normal">/month</span>
                    </p>
                    <p className="text-slate-500 text-sm mb-5">{currentTier.description}</p>
                    
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                      <Link to="/membership" className="px-5 py-2.5 bg-orange-800 hover:bg-orange-900 text-white text-sm rounded-lg transition-colors font-semibold">
                        Change Plan
                      </Link>
                    </div>
                    </>
                  ) : (
                      <div className="text-center py-6">
                          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <h3 className="text-lg font-bold">No Active Membership</h3>
                          <p className="text-slate-500 mb-4">You do not have an active membership plan.</p>
                          <Link to="/membership" className="px-5 py-2.5 bg-orange-800 hover:bg-orange-900 text-white text-sm rounded-lg transition-colors font-semibold">
                            Browse Plans
                          </Link>
                      </div>
                  )}
                </div>

                {currentTier && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-blue-800 text-sm font-semibold">Next billing date</p>
                    <p className="text-blue-700 text-sm">Your next payment of £{currentTier.price} is due on {new Date(currentTier.end_date).toLocaleDateString()}.</p>
                  </div>
                </div>
                )}
              </section>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}