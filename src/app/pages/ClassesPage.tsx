import { useState, useEffect, useMemo } from 'react';
import { Search, Clock, Users, Filter, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API_BASE = 'http://localhost/backend/api';

type Category = 'all' | 'yoga' | 'hiit' | 'cycling' | 'pilates' | 'boxing' | 'barre';
type Intensity = 'all' | 'Low' | 'Medium' | 'High';
type Day = 'all' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const categoryOptions: { value: Category; label: string }[] = [
  { value: 'all', label: 'All Classes' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'barre', label: 'Barre' },
];

const intensityOptions: { value: Intensity; label: string; colour: string }[] = [
  { value: 'all', label: 'Any Intensity', colour: 'bg-white/10 text-white/60' },
  { value: 'Low', label: 'Low', colour: 'bg-green-900/40 text-green-400' },
  { value: 'Medium', label: 'Medium', colour: 'bg-amber-900/40 text-amber-400' },
  { value: 'High', label: 'High', colour: 'bg-red-900/40 text-red-400' },
];

const dayOptions: Day[] = ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const intensityBadge: Record<string, string> = {
  Low: 'bg-green-900/60 text-green-400',
  Medium: 'bg-amber-900/60 text-amber-400',
  High: 'bg-red-900/60 text-red-400',
};

// Fallback images based on tags/title
function getImageUrl(tags: string = "") {
    if (tags.toLowerCase().includes('yoga')) return 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    if (tags.toLowerCase().includes('hiit') || tags.toLowerCase().includes('cardio')) return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
}

function getAvailabilityStatus(booked: number, capacity: number) {
    const spotsLeft = capacity - booked;
    if (spotsLeft === 0) return { label: 'Full', colour: 'red', spotsLeft };
    if (spotsLeft <= 3) return { label: `${spotsLeft} spots left`, colour: 'amber', spotsLeft };
    return { label: 'Available', colour: 'green', spotsLeft };
}

export function ClassesPage() {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [intensity, setIntensity] = useState<Intensity>('all');
  const [day, setDay] = useState<Day>('all');
  
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch classes and sessions from backend
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [clsRes, sessRes] = await Promise.all([
                fetch(`${API_BASE}/classes.php`),
                fetch(`${API_BASE}/sessions.php`)
            ]);
            
            const clsData = await clsRes.json();
            const sessData = await sessRes.json();

            if (clsData.success && sessData.success) {
                // Group sessions into their respective classes
                const sessionMap: Record<string, any[]> = {};
                sessData.data.forEach((s: any) => {
                    // Match by title since sessions.php joins with classes and returns class title
                    // Actually classes.php returns class_id. Let's map by title
                    if (!sessionMap[s.title]) sessionMap[s.title] = [];
                    sessionMap[s.title].push(s);
                });

                const formattedClasses = clsData.data.map((c: any) => {
                    const classSessions = sessionMap[c.title] || [];
                    return {
                        id: c.class_id,
                        name: c.title,
                        instructor: `${c.first_name} ${c.last_name}`,
                        category: c.tags?.split(',')[0]?.trim().toLowerCase() || 'all',
                        intensity: c.tags?.includes('High') ? 'High' : c.tags?.includes('Low') ? 'Low' : 'Medium',
                        duration: c.duration_mins,
                        description: c.description,
                        tags: c.tags ? c.tags.split(',').map((t: string) => t.trim()) : [],
                        imageUrl: getImageUrl(c.tags),
                        sessions: classSessions.map((s: any) => ({
                            id: s.session_id,
                            day: new Date(s.session_date).toLocaleDateString('en-GB', { weekday: 'long' }),
                            time: s.start_time.substring(0, 5),
                            maxCapacity: s.max_capacity,
                            bookedCount: s.spots_booked,
                            fullDate: s.session_date
                        }))
                    };
                });
                
                setClasses(formattedClasses);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load classes from the server.");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return classes.filter((cls) => {
      const matchSearch =
        search.trim() === '' ||
        cls.name.toLowerCase().includes(search.toLowerCase()) ||
        cls.instructor.toLowerCase().includes(search.toLowerCase()) ||
        cls.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === 'all' || cls.category === category;
      const matchIntensity = intensity === 'all' || cls.intensity === intensity;
      const matchDay = day === 'all' || cls.sessions.some((s: any) => s.day === day);
      return matchSearch && matchCategory && matchIntensity && matchDay;
    });
  }, [classes, search, category, intensity, day]);

  const activeFiltersCount = [
    category !== 'all',
    intensity !== 'all',
    day !== 'all',
    search.trim() !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setIntensity('all');
    setDay('all');
  };

  const handleBook = async (sessionId: number, className: string, day: string, time: string) => {
    if (!isAuthenticated || !user) return;

    // Try to book via POST API
    try {
        const res = await fetch(`${API_BASE}/bookings.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId, user_id: user.id })
        });
        const data = await res.json();
        
        if (data.success) {
            toast.success(`Booked! ${className} – ${day} at ${time}`);
            
            // Optimistically update the session capacity locally
            setClasses(prevClasses => prevClasses.map(c => {
                const newSessions = c.sessions.map((s: any) => {
                    if (s.id === sessionId) {
                        return { ...s, bookedCount: s.bookedCount + 1 };
                    }
                    return s;
                });
                return { ...c, sessions: newSessions };
            }));

        } else {
            toast.error(data.error);
        }

    } catch (err) {
        toast.error("Network error. Failed to make booking.");
    }
  };

  return (
    <main style={{ background: '#111111' }}>
      {/* Header */}
      <section style={{ background: '#111111' }} className="py-16 border-b border-white/5" aria-labelledby="classes-page-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm mb-2" style={{ color: '#C8F400', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Our Timetable
          </p>
          <h1 id="classes-page-heading" className="text-white mb-3" style={{ fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-0.03em' }}>
            Group Fitness Classes
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Six expertly crafted class formats, multiple sessions per week. Filter by category, intensity, or day to find your perfect slot.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section
        className="sticky top-16 z-30"
        style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        aria-label="Class filters"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-3">
             {/* Search */}
             <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search classes, instructors, or tags…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 transition-colors"
                style={{ background: '#222', border: '1px solid #333', color: 'white' }}
                aria-label="Search classes"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 cursor-pointer"
                style={{ background: '#222', border: '1px solid #333', color: 'rgba(255,255,255,0.7)' }}
                aria-label="Filter by category"
              >
                {categoryOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as Intensity)}
                className="px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 cursor-pointer"
                style={{ background: '#222', border: '1px solid #333', color: 'rgba(255,255,255,0.7)' }}
                aria-label="Filter by intensity"
              >
                {intensityOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={day}
                onChange={(e) => setDay(e.target.value as Day)}
                className="px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 cursor-pointer"
                style={{ background: '#222', border: '1px solid #333', color: 'rgba(255,255,255,0.7)' }}
                aria-label="Filter by day"
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>{d === 'all' ? 'Any Day' : d}</option>
                ))}
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                  aria-label="Clear all filters"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section style={{ background: '#111111' }} className="py-10 min-h-[50vh]" aria-label="Class listings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
                <div className="text-center py-20 text-white/50">Loading timetable from backend...</div>
            ) : (
             <>
             <div className="flex items-center justify-between mb-6">
                 <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                 <span className="text-white" style={{ fontWeight: 600 }}>{filtered.length}</span>{' '}
                 {filtered.length === 1 ? 'class' : 'classes'} found
                 </p>
                 {!isAuthenticated && (
                 <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                     <Link to="/login" className="hover:opacity-80 transition-opacity" style={{ color: '#C8F400', fontWeight: 500 }}>Log in</Link>{' '}to book classes
                 </p>
                 )}
             </div>

             {filtered.length === 0 ? (
                 <div className="text-center py-20" role="status" aria-live="polite">
                 <Filter className="w-12 h-12 mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.15)' }} aria-hidden="true" />
                 <h3 className="text-white mb-2" style={{ fontWeight: 600 }}>No classes found</h3>
                 <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your search or filters.</p>
                 <button onClick={clearFilters} className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#C8F400', fontWeight: 500 }}>
                     Clear all filters
                 </button>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" role="list" aria-label="Class results">
                 {filtered.map((cls) => (
                     <article
                     key={cls.id}
                     className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
                     style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                     role="listitem"
                     aria-label={`${cls.name} class`}
                     >
                     <div className="flex flex-col sm:flex-row">
                         <div className="sm:w-48 h-48 sm:h-auto shrink-0 relative">
                         <img
                             src={cls.imageUrl}
                             alt={`${cls.name} class`}
                             className="w-full h-full object-cover"
                             loading="lazy"
                         />
                         <span
                             className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs ${intensityBadge[cls.intensity] || intensityBadge.Medium}`}
                             style={{ fontWeight: 600 }}
                             aria-label={`Intensity: ${cls.intensity}`}
                         >
                             {cls.intensity}
                         </span>
                         </div>

                         <div className="flex-1 p-5">
                         <div className="flex items-start justify-between gap-2 mb-1">
                             <h2 className="text-white" style={{ fontWeight: 700, fontSize: '1.125rem' }}>{cls.name}</h2>
                             <span className="shrink-0 text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: '#2a2a2a', color: 'rgba(255,255,255,0.5)' }}>
                             {cls.category}
                             </span>
                         </div>
                         <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                             with <span style={{ fontWeight: 500, color: 'rgba(255,255,255,0.65)' }}>{cls.instructor}</span>
                         </p>

                         <div className="flex items-center gap-4 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                             <span className="flex items-center gap-1">
                             <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {cls.duration} min
                             </span>
                             <span className="flex items-center gap-1">
                             <Users className="w-3.5 h-3.5" aria-hidden="true" /> Max {cls.sessions[0]?.maxCapacity || 20}
                             </span>
                         </div>

                         <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{cls.description}</p>

                         <div className="flex flex-wrap gap-1.5 mb-4">
                             {cls.tags.map((tag: string) => (
                             <span key={tag} className="px-2 py-0.5 text-xs rounded-full" style={{ background: '#2a2a2a', color: 'rgba(255,255,255,0.45)' }}>
                                 {tag}
                             </span>
                             ))}
                         </div>

                         <div>
                             <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                             Available Sessions
                             </p>
                             <div className="flex flex-wrap gap-2" role="list" aria-label={`Sessions for ${cls.name}`}>
                             {cls.sessions
                                 .filter((s: any) => day === 'all' || s.day === day)
                                 .map((session: any) => {
                                 const avail = getAvailabilityStatus(session.bookedCount, session.maxCapacity);
                                 const isFull = avail.spotsLeft === 0;
                                 const dotColor = avail.colour === 'green' ? '#22c55e' : avail.colour === 'amber' ? '#f59e0b' : '#ef4444';
                                 return (
                                     <div
                                     key={session.id}
                                     className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                     style={{ background: '#222', border: '1px solid #333' }}
                                     role="listitem"
                                     >
                                     <div>
                                         <div className="flex items-center gap-1.5 mb-0.5">
                                         <span
                                             className="w-2 h-2 rounded-full"
                                             style={{ background: dotColor }}
                                             aria-hidden="true"
                                         />
                                         <span className="text-xs text-white" style={{ fontWeight: 600 }}>
                                             {session.day} ({new Date(session.fullDate).toLocaleDateString()})
                                         </span>
                                         </div>
                                         <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{session.time} · {avail.label}</p>
                                     </div>
                                     {isAuthenticated ? (
                                         <button
                                         onClick={() => handleBook(session.id, cls.name, session.day, session.time)}
                                         disabled={isFull}
                                         className="ml-1 px-2.5 py-1 text-xs rounded-full transition-all hover:opacity-90"
                                         style={
                                             isFull
                                             ? { background: '#2a2a2a', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed', fontWeight: 500 }
                                             : { background: '#C8F400', color: '#111', fontWeight: 700 }
                                         }
                                         >
                                         {isFull ? 'Full' : 'Book'}
                                         </button>
                                     ) : (
                                         <Link
                                         to="/login"
                                         className="ml-1 px-2.5 py-1 text-xs rounded-full transition-colors"
                                         style={{ background: '#2a2a2a', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}
                                         >
                                         Log in
                                         </Link>
                                     )}
                                     </div>
                                 );
                                 })}
                             </div>
                         </div>
                         </div>
                     </div>
                     </article>
                 ))}
                 </div>
             )}
             </>
            )}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="py-12" style={{ background: '#C8F400' }} aria-label="Join to book classes">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#111' }} aria-hidden="true" />
            <h2 className="text-black mb-2" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              Ready to book your first class?
            </h2>
            <p className="mb-6" style={{ color: 'rgba(0,0,0,0.6)' }}>Create your free account and start booking in under 2 minutes.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register" className="px-6 py-3 rounded-full text-sm transition-colors hover:opacity-90" style={{ background: '#111', color: '#C8F400', fontWeight: 700 }}>
                Create Account
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-full text-sm transition-colors border" style={{ borderColor: 'rgba(0,0,0,0.2)', color: '#111', fontWeight: 600 }}>
                Log In
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}