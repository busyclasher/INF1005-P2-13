import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import {
  LayoutDashboard, Calendar, Users, BookOpen, Shield, LogOut,
  TrendingUp, CheckCircle2, XCircle, Plus, Search,
  Edit3, Trash2, Eye, Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminMembers, adminBookings, fitnessClasses } from '../data/mockData';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'classes' | 'members' | 'bookings'| 'notices';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://35.212.166.173/backend/api';

const statusColour: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Suspended: 'bg-red-100 text-red-600',
  Expired: 'bg-slate-100 text-slate-500',
};

const bookingStatusColour: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Attended: 'bg-slate-100 text-slate-600',
  Cancelled: 'bg-red-100 text-red-600',
};

type AdminNotice = {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  is_published: number;
};

export function AdminPage() {
  console.log("Admin page: ");
  const { user, logout, isAuthenticated } = useAuth();
  console.log("admin user data", user);
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [memberSearch, setMemberSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [members, setMembers] = useState(adminMembers);
  const [bookings, setBookings] = useState(adminBookings);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [notices, setNotices] = useState<AdminNotice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAuthorName, setNoticeAuthorName] = useState('');
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);
  const [deletingNoticeId, setDeletingNoticeId] = useState<number | null>(null);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMemberStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'Active' ? 'Suspended' : 'Active' } : m
      )
    );
    const member = members.find((m) => m.id === id);
    if (member) {
      toast.success(`${member.name} ${member.status === 'Active' ? 'suspended' : 'reactivated'}.`);
    }
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
    toast.success('Booking cancelled.');
  };

  const fetchNotices = async () => {
    setNoticesLoading(true);

    try {
      const response = await fetch(`${API_BASE}/notices.php`);
      const result: { success: boolean; data?: AdminNotice[]; error?: string } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch notices.');
      }

      setNotices(result.data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notices.';
      toast.error(message);
    } finally {
      setNoticesLoading(false);
    }
  };

  const handleCreateNotice = async () => {
    if (!noticeTitle.trim() || !noticeContent.trim() || !noticeAuthorName.trim()) {
      toast.error('Please enter a title, content, and author name.');
      return;
    }

    setNoticeSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/notices.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noticeTitle.trim(),
          content: noticeContent.trim(),
          author_name: noticeAuthorName.trim(),
        }),
      });

      const result: { success: boolean; data?: AdminNotice; error?: string } = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || 'Failed to create notice.');
      }

      setNotices((prev) => [result.data as AdminNotice, ...prev]);
      setNoticeTitle('');
      setNoticeContent('');
      setNoticeAuthorName('');
      setShowAddNotice(false);
      toast.success('Notice created.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create notice.';
      toast.error(message);
    } finally {
      setNoticeSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    setDeletingNoticeId(id);

    try {
      const response = await fetch(`${API_BASE}/notices.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const result: { success: boolean; error?: string } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete notice.');
      }

      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      toast.success('Notice deleted.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete notice.';
      toast.error(message);
    } finally {
      setDeletingNoticeId(null);
    }
  };

  useEffect(() => {
    if (tab === 'notices') {
      void fetchNotices();
    }
  }, [tab]);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (b) =>
      b.memberName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.className.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  // Stats
  const totalMembers = members.filter(m => m.role === 'member').length;
  const activeMembers = members.filter(m => m.status === 'Active' && m.role === 'member').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const totalClasses = fitnessClasses.length;

  const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'classes', label: 'Classes', icon: Calendar },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
    { id: 'notices', label: 'Notices', icon: BookOpen }
  ];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50" aria-label="Admin panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0" aria-label="Admin navigation">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center text-white" style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Shield className="w-3 h-3 text-orange-400" aria-hidden="true" />
                      <span className="text-orange-400 text-xs" style={{ fontWeight: 500 }}>Administrator</span>
                    </div>
                  </div>
                </div>
              </div>

              <nav className="p-2" aria-label="Admin menu">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors mb-0.5 ${
                      tab === id ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <section aria-labelledby="admin-overview-heading">
                <h1 id="admin-overview-heading" className="text-slate-900 mb-6" style={{ fontWeight: 700, fontSize: '1.5rem' }}>
                  Admin Dashboard
                </h1>

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Members', value: totalMembers, sub: `${activeMembers} active`, icon: Users, colour: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
                    { label: 'Active Classes', value: totalClasses, sub: '36 sessions/wk', icon: Calendar, colour: 'text-green-600', bg: 'bg-green-50', trend: 'stable' },
                    { label: 'Confirmed Bookings', value: confirmedBookings, sub: 'this week', icon: CheckCircle2, colour: 'text-orange-600', bg: 'bg-orange-50', trend: '+8%' },
                    { label: 'Monthly Revenue', value: '£4,820', sub: 'memberships', icon: TrendingUp, colour: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%' },
                  ].map(({ label, value, sub, icon: Icon, colour, bg, trend }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${colour}`} aria-hidden="true" />
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`} style={{ fontWeight: 500 }}>
                          {trend}
                        </span>
                      </div>
                      <p className="text-slate-900" style={{ fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>{value}</p>
                      <p className="text-slate-500 text-xs mt-1">{label}</p>
                      <p className="text-slate-400 text-xs">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Recent bookings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                  <h2 className="text-slate-900 mb-4" style={{ fontWeight: 700 }}>Recent Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]" role="table" aria-label="Recent bookings">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {['Member', 'Class', 'Day / Time', 'Status'].map(h => (
                            <th key={h} scope="col" className="text-left text-xs text-slate-400 pb-3 pr-4" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 pr-4 text-slate-800 text-sm" style={{ fontWeight: 500 }}>{b.memberName}</td>
                            <td className="py-3 pr-4 text-slate-600 text-sm">{b.className}</td>
                            <td className="py-3 pr-4 text-slate-500 text-sm">{b.day} {b.time}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${bookingStatusColour[b.status]}`} style={{ fontWeight: 500 }}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Membership breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-slate-900 mb-4" style={{ fontWeight: 700 }}>Membership Distribution</h2>
                  <div className="space-y-3">
                    {['Essential', 'Standard', 'Premium', 'Annual Elite'].map((tier) => {
                      const count = members.filter(m => m.membershipTier === tier && m.role === 'member').length;
                      const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                      return (
                        <div key={tier}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-700 text-sm" style={{ fontWeight: 500 }}>{tier}</span>
                            <span className="text-slate-500 text-xs">{count} members ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${tier}: ${pct}%`}>
                            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ── CLASSES ── */}
            {tab === 'classes' && (
              <section aria-labelledby="admin-classes-heading">
                <div className="flex items-center justify-between mb-6">
                  <h1 id="admin-classes-heading" className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Manage Classes</h1>
                  <button
                    onClick={() => setShowAddClass(!showAddClass)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
                    style={{ fontWeight: 600 }}
                    aria-expanded={showAddClass}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" /> Add Class
                  </button>
                </div>

                {showAddClass && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5" role="region" aria-label="Add new class form">
                    <h2 className="text-slate-900 mb-4" style={{ fontWeight: 600 }}>Add New Class</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="new-class-name" className="block text-slate-700 text-sm mb-1" style={{ fontWeight: 500 }}>Class Name</label>
                        <input
                          id="new-class-name"
                          type="text"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="e.g. Power Yoga"
                          className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-class-instructor" className="block text-slate-700 text-sm mb-1" style={{ fontWeight: 500 }}>Instructor</label>
                        <input
                          id="new-class-instructor"
                          type="text"
                          placeholder="Instructor name"
                          className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (newClassName.trim()) {
                            toast.success(`Class "${newClassName}" added.`);
                            setNewClassName('');
                            setShowAddClass(false);
                          } else {
                            toast.error('Please enter a class name.');
                          }
                        }}
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Save Class
                      </button>
                      <button onClick={() => setShowAddClass(false)} className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors" style={{ fontWeight: 500 }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4" role="list" aria-label="Class list">
                  {fitnessClasses.map((cls) => {
                    const totalBooked = cls.sessions.reduce((sum, s) => sum + s.bookedCount, 0);
                    const totalCap = cls.sessions.reduce((sum, s) => sum + s.maxCapacity, 0);
                    const pct = totalCap > 0 ? Math.round((totalBooked / totalCap) * 100) : 0;
                    return (
                      <div key={cls.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4" role="listitem">
                        <img src={cls.imageUrl} alt={cls.name} className="w-14 h-14 rounded-xl object-cover shrink-0" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{cls.name}</p>
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">{cls.category}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${cls.intensity === 'High' ? 'bg-red-100 text-red-700' : cls.intensity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                              {cls.intensity}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs mt-0.5">{cls.instructor} · {cls.duration} min · {cls.sessions.length} sessions/wk</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                              <div className={`h-full rounded-full ${pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} aria-hidden="true" />
                            </div>
                            <span className="text-slate-400 text-xs">{pct}% full</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toast.info(`Editing ${cls.name}…`)}
                            className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            aria-label={`Edit ${cls.name}`}
                          >
                            <Edit3 className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => toast.success(`${cls.name} removed.`)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label={`Delete ${cls.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── MEMBERS ── */}
            {tab === 'members' && (
              <section aria-labelledby="admin-members-heading">
                <div className="flex items-center justify-between mb-6">
                  <h1 id="admin-members-heading" className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Manage Members</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <input
                      type="search"
                      placeholder="Search members…"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 w-52"
                      aria-label="Search members"
                    />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]" role="table" aria-label="Members table">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {['Name', 'Email', 'Plan', 'Joined', 'Bookings', 'Status', 'Actions'].map(h => (
                            <th key={h} scope="col" className="text-left text-xs text-slate-500 px-4 py-3" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs shrink-0" style={{ fontWeight: 700 }}>
                                  {member.name ? member.name.split(' ').map(n => n[0]).join('').slice(0, 2) : ''}
                                </span>
                                <div>
                                  <p className="text-slate-800 text-sm" style={{ fontWeight: 500 }}>{member.name}</p>
                                  {member.role === 'admin' && <span className="text-xs text-orange-500">Admin</span>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 text-sm">{member.email}</td>
                            <td className="px-4 py-3.5 text-slate-600 text-sm">{member.membershipTier}</td>
                            <td className="px-4 py-3.5 text-slate-500 text-sm">{member.joinDate}</td>
                            <td className="px-4 py-3.5 text-slate-600 text-sm text-center">{member.bookingsCount}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs ${statusColour[member.status]}`} style={{ fontWeight: 500 }}>
                                {member.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toast.info(`Viewing ${member.name}'s profile`)}
                                  className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                  aria-label={`View ${member.name}`}
                                >
                                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                                {member.role !== 'admin' && (
                                  <button
                                    onClick={() => toggleMemberStatus(member.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      member.status === 'Active'
                                        ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                        : 'text-slate-400 hover:text-green-500 hover:bg-green-50'
                                    }`}
                                    aria-label={member.status === 'Active' ? `Suspend ${member.name}` : `Reactivate ${member.name}`}
                                  >
                                    {member.status === 'Active' ? (
                                      <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                    ) : (
                                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredMembers.length === 0 && (
                    <div className="p-10 text-center">
                      <p className="text-slate-400 text-sm">No members match your search.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── BOOKINGS ── */}
            {tab === 'bookings' && (
              <section aria-labelledby="admin-bookings-heading">
                <div className="flex items-center justify-between mb-6">
                  <h1 id="admin-bookings-heading" className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Manage Bookings</h1>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <input
                      type="search"
                      placeholder="Search bookings…"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 w-52"
                      aria-label="Search bookings"
                    />
                  </div>
                </div>

                {/* Summary chips */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {[
                    { label: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length, colour: 'bg-green-100 text-green-700' },
                    { label: 'Attended', count: bookings.filter(b => b.status === 'Attended').length, colour: 'bg-slate-100 text-slate-600' },
                    { label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length, colour: 'bg-red-100 text-red-600' },
                  ].map(({ label, count, colour }) => (
                    <span key={label} className={`px-3 py-1.5 rounded-full text-sm ${colour}`} style={{ fontWeight: 600 }}>
                      {label}: {count}
                    </span>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px]" role="table" aria-label="Bookings management table">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {['Member', 'Class', 'Day / Time', 'Booked On', 'Status', 'Actions'].map(h => (
                            <th key={h} scope="col" className="text-left text-xs text-slate-500 px-4 py-3" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3.5 text-slate-800 text-sm" style={{ fontWeight: 500 }}>{b.memberName}</td>
                            <td className="px-4 py-3.5 text-slate-600 text-sm">{b.className}</td>
                            <td className="px-4 py-3.5">
                              <p className="text-slate-600 text-sm">{b.day}</p>
                              <p className="text-slate-400 text-xs">{b.time}</p>
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 text-sm">{b.bookedAt}</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs ${bookingStatusColour[b.status]}`} style={{ fontWeight: 500 }}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => cancelBooking(b.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                  style={{ fontWeight: 500 }}
                                  aria-label={`Cancel booking for ${b.memberName} - ${b.className}`}
                                >
                                  <XCircle className="w-3 h-3" aria-hidden="true" /> Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredBookings.length === 0 && (
                    <div className="p-10 text-center">
                      <p className="text-slate-400 text-sm">No bookings match your search.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── NOTICES ── */}
            {tab === 'notices' && (
              <section aria-labelledby="admin-notices-heading">
                <div className="flex items-center justify-between mb-6">
                  <h1 id="admin-notices-heading" className="text-slate-900" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Manage Notices</h1>
                  <button
                    onClick={() => setShowAddNotice(!showAddNotice)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition-colors"
                    style={{ fontWeight: 600 }}
                    aria-expanded={showAddNotice}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" /> Add Notice
                  </button>
                </div>

                {showAddNotice && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5" role="region" aria-label="Add new notice form">
                    <h2 className="text-slate-900 mb-4" style={{ fontWeight: 600 }}>Add New Notice</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="sm:col-span-2">
                        <label htmlFor="new-notice-title" className="block text-slate-700 text-sm mb-1" style={{ fontWeight: 500 }}>Title</label>
                        <input
                          id="new-notice-title"
                          type="text"
                          value={noticeTitle}
                          onChange={(e) => setNoticeTitle(e.target.value)}
                          placeholder="Notice title"
                          className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-notice-author" className="block text-slate-700 text-sm mb-1" style={{ fontWeight: 500 }}>Author Name</label>
                        <input
                          id="new-notice-author"
                          type="text"
                          value={noticeAuthorName}
                          onChange={(e) => setNoticeAuthorName(e.target.value)}
                          placeholder="Author name"
                          className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="new-notice-content" className="block text-slate-700 text-sm mb-1" style={{ fontWeight: 500 }}>Content</label>
                        <textarea
                          id="new-notice-content"
                          value={noticeContent}
                          onChange={(e) => setNoticeContent(e.target.value)}
                          placeholder="Write the notice content"
                          rows={5}
                          className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => void handleCreateNotice()}
                        disabled={noticeSubmitting}
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm rounded-lg transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        {noticeSubmitting ? 'Saving...' : 'Save Notice'}
                      </button>
                      <button
                        onClick={() => setShowAddNotice(false)}
                        className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {noticesLoading ? (
                    <div className="p-10 text-center">
                      <p className="text-slate-400 text-sm">Loading notices...</p>
                    </div>
                  ) : notices.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-slate-400 text-sm">No notices available.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notices.map((notice) => (
                        <div key={notice.id} className="p-5 flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <p className="text-slate-900 text-sm" style={{ fontWeight: 700 }}>{notice.title}</p>
                              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{notice.author_name}</span>
                            </div>
                            <p className="text-slate-600 text-sm whitespace-pre-line">{notice.content}</p>
                            <p className="text-slate-400 text-xs mt-2">Posted {new Date(notice.created_at).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => void handleDeleteNotice(notice.id)}
                            disabled={deletingNoticeId === notice.id}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:text-slate-300 rounded-lg transition-colors shrink-0"
                            aria-label={`Delete ${notice.title}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}