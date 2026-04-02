// ─── Types ─────────────────────────────────────────────────────────────────

export interface ClassSession {
  id: string;
  day: string;
  time: string;
  bookedCount: number;
  maxCapacity: number;
}

export interface FitnessClass {
  id: string;
  name: string;
  category: 'yoga' | 'hiit' | 'cycling' | 'pilates' | 'boxing' | 'barre';
  instructor: string;
  duration: number;
  intensity: 'Low' | 'Medium' | 'High';
  description: string;
  imageUrl: string;
  sessions: ClassSession[];
  tags: string[];
}

export interface Programme {
  id: string;
  name: string;
  weeks: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  price: number;
  imageUrl: string;
  includes: string[];
  trainerName: string;
  trainerImage: string;
  goal: string;
}

export interface MembershipFeature {
  text: string;
  included: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: MembershipFeature[];
  popular?: boolean;
  badge?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  membershipTier: string;
  joinDate: string;
  status: 'Active' | 'Suspended' | 'Expired';
  bookingsCount: number;
  phone: string;
}

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  classId: string;
  className: string;
  day: string;
  time: string;
  status: 'Confirmed' | 'Cancelled' | 'Attended';
  bookedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialities: string[];
  bio: string;
  imageUrl: string;
  experience: string;
}

// ─── Classes ───────────────────────────────────────────────────────────────

export const fitnessClasses: FitnessClass[] = [
  {
    id: 'yoga-flow',
    name: 'Yoga Flow',
    category: 'yoga',
    instructor: 'Maya Chen',
    duration: 60,
    intensity: 'Low',
    description:
      'A dynamic vinyasa-style flow that links breath to movement, building flexibility, strength, and mindfulness. Suitable for all levels with modifications offered throughout.',
    imageUrl: 'https://images.unsplash.com/photo-1761034114091-6d30447e25aa?w=800&q=80',
    tags: ['Flexibility', 'Mindfulness', 'Breathwork'],
    sessions: [
      { id: 'yf-1', day: 'Monday', time: '07:00', bookedCount: 12, maxCapacity: 15 },
      { id: 'yf-2', day: 'Wednesday', time: '18:00', bookedCount: 8, maxCapacity: 15 },
      { id: 'yf-3', day: 'Friday', time: '09:00', bookedCount: 14, maxCapacity: 15 },
      { id: 'yf-4', day: 'Saturday', time: '10:00', bookedCount: 15, maxCapacity: 15 },
    ],
  },
  {
    id: 'power-hiit',
    name: 'Power HIIT',
    category: 'hiit',
    instructor: 'Jordan Reid',
    duration: 45,
    intensity: 'High',
    description:
      'High-intensity interval training that alternates bursts of maximal effort with active recovery. Designed to torch calories, build endurance, and elevate your metabolism long after the class ends.',
    imageUrl: 'https://images.unsplash.com/photo-1723117976407-43d6b5b2afa4?w=800&q=80',
    tags: ['Cardio', 'Fat Burn', 'Endurance'],
    sessions: [
      { id: 'ph-1', day: 'Tuesday', time: '06:00', bookedCount: 18, maxCapacity: 20 },
      { id: 'ph-2', day: 'Thursday', time: '06:00', bookedCount: 20, maxCapacity: 20 },
      { id: 'ph-3', day: 'Saturday', time: '09:00', bookedCount: 16, maxCapacity: 20 },
    ],
  },
  {
    id: 'indoor-cycling',
    name: 'Rhythm Ride',
    category: 'cycling',
    instructor: 'Priya Sharma',
    duration: 45,
    intensity: 'High',
    description:
      'An immersive indoor cycling experience set to motivating music in a darkened studio. Combines speed, resistance, and rhythm to deliver an intense cardiovascular workout for all fitness levels.',
    imageUrl: 'https://images.unsplash.com/photo-1562869319-a1368ba7fe75?w=800&q=80',
    tags: ['Cardio', 'Leg Strength', 'Music-driven'],
    sessions: [
      { id: 'rc-1', day: 'Monday', time: '06:00', bookedCount: 16, maxCapacity: 20 },
      { id: 'rc-2', day: 'Wednesday', time: '19:00', bookedCount: 11, maxCapacity: 20 },
      { id: 'rc-3', day: 'Friday', time: '07:00', bookedCount: 20, maxCapacity: 20 },
      { id: 'rc-4', day: 'Sunday', time: '09:00', bookedCount: 7, maxCapacity: 20 },
    ],
  },
  {
    id: 'reformer-pilates',
    name: 'Reformer Pilates',
    category: 'pilates',
    instructor: 'Lena Novak',
    duration: 55,
    intensity: 'Medium',
    description:
      'Precision-led Reformer Pilates focusing on core stability, postural alignment, and controlled movement. Small class sizes ensure personalised attention and technique refinement.',
    imageUrl: 'https://images.unsplash.com/photo-1734873477108-6837b02f2b9d?w=800&q=80',
    tags: ['Core', 'Posture', 'Rehabilitation'],
    sessions: [
      { id: 'rp-1', day: 'Tuesday', time: '10:00', bookedCount: 9, maxCapacity: 10 },
      { id: 'rp-2', day: 'Thursday', time: '18:30', bookedCount: 7, maxCapacity: 10 },
      { id: 'rp-3', day: 'Saturday', time: '11:00', bookedCount: 10, maxCapacity: 10 },
    ],
  },
  {
    id: 'boxfit',
    name: 'BoxFit',
    category: 'boxing',
    instructor: 'Marcus Webb',
    duration: 50,
    intensity: 'High',
    description:
      'A non-contact boxing-inspired conditioning class that combines pad work, bag work, and bodyweight circuits. Build power, coordination, and cardiovascular fitness in this high-energy class.',
    imageUrl: 'https://images.unsplash.com/photo-1729673516991-b0bce1f60d27?w=800&q=80',
    tags: ['Strength', 'Cardio', 'Coordination'],
    sessions: [
      { id: 'bf-1', day: 'Monday', time: '20:00', bookedCount: 14, maxCapacity: 18 },
      { id: 'bf-2', day: 'Wednesday', time: '20:00', bookedCount: 10, maxCapacity: 18 },
      { id: 'bf-3', day: 'Friday', time: '19:00', bookedCount: 18, maxCapacity: 18 },
    ],
  },
  {
    id: 'barre-fusion',
    name: 'Barre Fusion',
    category: 'barre',
    instructor: 'Sophie Laurent',
    duration: 55,
    intensity: 'Medium',
    description:
      'A ballet-inspired total body workout that blends barre exercises with Pilates and yoga elements. Targets muscles with small, isometric movements to tone, lengthen, and strengthen from head to toe.',
    imageUrl: 'https://images.unsplash.com/photo-1758671916868-b853bc18d031?w=800&q=80',
    tags: ['Toning', 'Balance', 'Flexibility'],
    sessions: [
      { id: 'bar-1', day: 'Tuesday', time: '12:00', bookedCount: 11, maxCapacity: 15 },
      { id: 'bar-2', day: 'Thursday', time: '12:00', bookedCount: 6, maxCapacity: 15 },
      { id: 'bar-3', day: 'Saturday', time: '10:00', bookedCount: 13, maxCapacity: 15 },
    ],
  },
];

// ─── Programmes ────────────────────────────────────────────────────────────

export const programmes: Programme[] = [
  {
    id: 'strength-builder',
    name: '8-Week Strength Builder',
    weeks: 8,
    level: 'Intermediate',
    goal: 'Build Strength',
    description:
      'A structured progressive overload programme designed to build functional strength across all major muscle groups. Combines compound lifts, accessory work, and recovery protocols for measurable results.',
    price: 249,
    imageUrl: 'https://images.unsplash.com/photo-1734873477108-6837b02f2b9d?w=800&q=80',
    includes: [
      '3 x 1-hour PT sessions per week',
      'Personalised nutrition guidance',
      'Weekly progress assessments',
      'Access to all gym facilities',
      'Digital workout tracking',
      'Recovery & mobility sessions',
    ],
    trainerName: 'Jordan Reid',
    trainerImage: 'https://images.unsplash.com/photo-1750698545009-679820502908?w=400&q=80',
  },
  {
    id: 'cardio-blast',
    name: '6-Week Cardio Blast',
    weeks: 6,
    level: 'Beginner',
    goal: 'Improve Fitness',
    description:
      'A beginner-friendly cardio acceleration programme combining HIIT, cycling, and endurance training. Build your aerobic base, improve stamina, and kickstart your fitness journey with expert guidance.',
    price: 189,
    imageUrl: 'https://images.unsplash.com/photo-1723117976407-43d6b5b2afa4?w=800&q=80',
    includes: [
      '2 x group class sessions per week',
      '1 x PT session per week',
      'Cardio nutrition plan',
      'Heart rate monitoring',
      'Progress tracking dashboard',
      'Post-programme consultation',
    ],
    trainerName: 'Priya Sharma',
    trainerImage: 'https://images.unsplash.com/photo-1664673531303-c933ac4cee70?w=400&q=80',
  },
  {
    id: 'body-transformation',
    name: '12-Week Body Transformation',
    weeks: 12,
    level: 'Advanced',
    goal: 'Total Transformation',
    description:
      'Our most comprehensive programme — a holistic 12-week transformation covering strength, conditioning, nutrition, sleep, and mindset. Designed for those committed to a complete lifestyle overhaul.',
    price: 499,
    imageUrl: 'https://images.unsplash.com/photo-1602827114685-efbb2717da9f?w=800&q=80',
    includes: [
      '4 x PT sessions per week',
      'Full nutrition & meal planning',
      'Body composition analysis (fortnightly)',
      'Unlimited class access',
      'Mindset coaching sessions',
      'Lifestyle & sleep optimisation',
      'Post-programme 1-month check-in',
    ],
    trainerName: 'Marcus Webb',
    trainerImage: 'https://images.unsplash.com/photo-1750698545009-679820502908?w=400&q=80',
  },
  {
    id: 'mindfulness-mobility',
    name: '4-Week Mindfulness & Mobility',
    weeks: 4,
    level: 'Beginner',
    goal: 'Flexibility & Wellbeing',
    description:
      'A restorative programme integrating yoga flow, mobility work, breathwork, and mindfulness practices. Perfect as a standalone well-being journey or as active recovery alongside another programme.',
    price: 129,
    imageUrl: 'https://images.unsplash.com/photo-1761034114091-6d30447e25aa?w=800&q=80',
    includes: [
      '3 x yoga/mobility sessions per week',
      'Guided breathwork practice',
      'Mindfulness resources & journal',
      'Nutrition for recovery guide',
      'Weekly 1:1 check-in',
    ],
    trainerName: 'Maya Chen',
    trainerImage: 'https://images.unsplash.com/photo-1664673531303-c933ac4cee70?w=400&q=80',
  },
];

// ─── Membership Tiers ──────────────────────────────────────────────────────

export const membershipTiers: MembershipTier[] = [
  {
    id: 'essential',
    name: 'Essential',
    monthlyPrice: 29,
    annualPrice: 290,
    description: 'Perfect for those just starting their fitness journey.',
    features: [
      { text: '4 group classes per month', included: true },
      { text: 'Access to studio facilities', included: true },
      { text: 'Member app access', included: true },
      { text: 'Unlimited classes', included: false },
      { text: 'Personal training sessions', included: false },
      { text: 'Nutrition guidance', included: false },
      { text: 'Priority booking', included: false },
      { text: 'Guest passes', included: false },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    monthlyPrice: 49,
    annualPrice: 490,
    description: 'Great for regular fitness enthusiasts wanting flexibility.',
    popular: true,
    features: [
      { text: 'Unlimited group classes', included: true },
      { text: 'Access to studio facilities', included: true },
      { text: 'Member app access', included: true },
      { text: '1 PT session per month', included: true },
      { text: 'Nutrition guidance', included: false },
      { text: 'Priority booking', included: false },
      { text: 'Guest passes', included: false },
      { text: 'Body composition analysis', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 79,
    annualPrice: 790,
    description: 'The complete package for serious results.',
    badge: 'Best Value',
    features: [
      { text: 'Unlimited group classes', included: true },
      { text: 'Access to studio facilities', included: true },
      { text: 'Member app access', included: true },
      { text: '4 PT sessions per month', included: true },
      { text: 'Monthly nutrition plan', included: true },
      { text: 'Priority booking', included: true },
      { text: '2 guest passes per month', included: true },
      { text: 'Quarterly body composition analysis', included: true },
    ],
  },
  {
    id: 'annual',
    name: 'Annual Elite',
    monthlyPrice: 65,
    annualPrice: 780,
    description: 'All Premium benefits at a discounted annual rate.',
    badge: 'Save 18%',
    features: [
      { text: 'Unlimited group classes', included: true },
      { text: 'Access to studio facilities', included: true },
      { text: 'Member app access', included: true },
      { text: '4 PT sessions per month', included: true },
      { text: 'Monthly nutrition plan', included: true },
      { text: 'Priority booking', included: true },
      { text: '4 guest passes per month', included: true },
      { text: 'Bi-monthly body composition analysis', included: true },
    ],
  },
];

// ─── Team Members ──────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Maya Chen',
    role: 'Lead Yoga & Mindfulness Instructor',
    specialities: ['Vinyasa Yoga', 'Yin Yoga', 'Breathwork', 'Meditation'],
    bio: 'With over 12 years of practice and 8 years of teaching, Maya brings a calming yet energising presence to every class. Certified in multiple yoga disciplines, she tailors each session to help students find their edge safely.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    experience: '8 years teaching',
  },
  {
    id: 'tm2',
    name: 'Jordan Reid',
    role: 'Head Strength & Conditioning Coach',
    specialities: ['Strength Training', 'HIIT', 'Athletic Conditioning', 'Nutrition'],
    bio: 'Jordan is a BSc Sport Science graduate with a Level 4 Personal Training qualification. Former competitive athlete turned coach, Jordan has helped hundreds of clients achieve transformational results through evidence-based programming.',
    imageUrl: 'https://images.unsplash.com/photo-1750698545009-679820502908?w=600&q=80',
    experience: '10 years coaching',
  },
  {
    id: 'tm3',
    name: 'Priya Sharma',
    role: 'Cycling & Cardio Specialist',
    specialities: ['Indoor Cycling', 'Cardio Training', 'Endurance', 'Group Fitness'],
    bio: 'Priya is a passionate indoor cycling instructor and certified personal trainer who believes movement should be joyful. Her energetic classes are known for their infectious playlists and motivational coaching style.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    experience: '6 years teaching',
  },
  {
    id: 'tm4',
    name: 'Marcus Webb',
    role: 'BoxFit & HIIT Coach',
    specialities: ['Boxing', 'Functional Fitness', 'HIIT', 'Sports Conditioning'],
    bio: 'A former semi-professional boxer, Marcus channels his competitive background into creating classes that are demanding yet inclusive. His BoxFit sessions have a cult following for good reason — they deliver results every time.',
    imageUrl: 'https://images.unsplash.com/photo-1729673516991-b0bce1f60d27?w=600&q=80',
    experience: '7 years coaching',
  },
];

// ─── Admin: Members ────────────────────────────────────────────────────────

export const adminMembers: Member[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'member@kinetikhub.com', role: 'member', membershipTier: 'Premium', joinDate: '2024-06-15', status: 'Active', bookingsCount: 24, phone: '+44 7700 900123' },
  { id: 'u3', name: 'Charlotte Davies', email: 'c.davies@email.com', role: 'member', membershipTier: 'Standard', joinDate: '2024-08-02', status: 'Active', bookingsCount: 18, phone: '+44 7700 900234' },
  { id: 'u4', name: 'Ravi Patel', email: 'r.patel@email.com', role: 'member', membershipTier: 'Essential', joinDate: '2025-01-10', status: 'Active', bookingsCount: 6, phone: '+44 7700 900345' },
  { id: 'u5', name: 'Emma Wilson', email: 'e.wilson@email.com', role: 'member', membershipTier: 'Premium', joinDate: '2023-11-20', status: 'Active', bookingsCount: 52, phone: '+44 7700 900456' },
  { id: 'u6', name: 'Tom Bradley', email: 't.bradley@email.com', role: 'member', membershipTier: 'Standard', joinDate: '2024-03-05', status: 'Suspended', bookingsCount: 9, phone: '+44 7700 900567' },
  { id: 'u7', name: 'Natasha Ivanova', email: 'n.ivanova@email.com', role: 'member', membershipTier: 'Annual Elite', joinDate: '2023-07-14', status: 'Active', bookingsCount: 87, phone: '+44 7700 900678' },
  { id: 'u8', name: 'Callum Fraser', email: 'c.fraser@email.com', role: 'member', membershipTier: 'Essential', joinDate: '2025-02-01', status: 'Active', bookingsCount: 3, phone: '+44 7700 900789' },
  { id: 'u2', name: 'Sarah Mitchell', email: 'admin@kinetikhub.com', role: 'admin', membershipTier: 'Staff', joinDate: '2023-01-10', status: 'Active', bookingsCount: 0, phone: '+44 7700 900890' },
];

// ─── Admin: Bookings ───────────────────────────────────────────────────────

export const adminBookings: Booking[] = [
  { id: 'b1', memberId: 'u1', memberName: 'Alex Johnson', classId: 'yoga-flow', className: 'Yoga Flow', day: 'Monday', time: '07:00', status: 'Confirmed', bookedAt: '2026-02-25' },
  { id: 'b2', memberId: 'u1', memberName: 'Alex Johnson', classId: 'power-hiit', className: 'Power HIIT', day: 'Thursday', time: '06:00', status: 'Confirmed', bookedAt: '2026-02-25' },
  { id: 'b3', memberId: 'u1', memberName: 'Alex Johnson', classId: 'indoor-cycling', className: 'Rhythm Ride', day: 'Friday', time: '07:00', status: 'Attended', bookedAt: '2026-02-18' },
  { id: 'b4', memberId: 'u3', memberName: 'Charlotte Davies', classId: 'barre-fusion', className: 'Barre Fusion', day: 'Tuesday', time: '12:00', status: 'Confirmed', bookedAt: '2026-02-26' },
  { id: 'b5', memberId: 'u4', memberName: 'Ravi Patel', classId: 'yoga-flow', className: 'Yoga Flow', day: 'Wednesday', time: '18:00', status: 'Confirmed', bookedAt: '2026-02-24' },
  { id: 'b6', memberId: 'u5', memberName: 'Emma Wilson', classId: 'power-hiit', className: 'Power HIIT', day: 'Saturday', time: '09:00', status: 'Attended', bookedAt: '2026-02-22' },
  { id: 'b7', memberId: 'u6', memberName: 'Tom Bradley', classId: 'boxfit', className: 'BoxFit', day: 'Monday', time: '20:00', status: 'Cancelled', bookedAt: '2026-02-20' },
  { id: 'b8', memberId: 'u7', memberName: 'Natasha Ivanova', classId: 'reformer-pilates', className: 'Reformer Pilates', day: 'Tuesday', time: '10:00', status: 'Confirmed', bookedAt: '2026-02-27' },
];

// ─── Testimonials ──────────────────────────────────────────────────────────

export const testimonials = [
  {
    id: 't1',
    name: 'Emma Wilson',
    memberSince: '2023',
    membershipTier: 'Premium',
    quote: 'KineticHub completely transformed my relationship with fitness. The instructors are world-class and the community is unlike anything I\'ve experienced at other studios. I\'ve lost 12kg and gained so much confidence.',
    rating: 5,
    avatarInitials: 'EW',
  },
  {
    id: 't2',
    name: 'Ravi Patel',
    memberSince: '2025',
    membershipTier: 'Standard',
    quote: 'I was nervous about joining a boutique studio but the team made me feel welcome from day one. The Rhythm Ride classes are addictive — I now go three times a week. Best decision I\'ve made for my health.',
    rating: 5,
    avatarInitials: 'RP',
  },
  {
    id: 't3',
    name: 'Charlotte Davies',
    memberSince: '2024',
    membershipTier: 'Standard',
    quote: 'The Barre Fusion classes are phenomenal. Sophie is an incredible instructor who always ensures perfect form. The online booking system is seamless and the facilities are immaculate. Highly recommend.',
    rating: 5,
    avatarInitials: 'CD',
  },
];

// ─── Availability Helper ───────────────────────────────────────────────────

export function getAvailabilityStatus(booked: number, max: number): {
  label: string;
  colour: 'green' | 'amber' | 'red';
  spotsLeft: number;
} {
  const spotsLeft = max - booked;
  const pct = spotsLeft / max;
  if (spotsLeft === 0) return { label: 'Full', colour: 'red', spotsLeft: 0 };
  if (pct > 0.5) return { label: `${spotsLeft} spots left`, colour: 'green', spotsLeft };
  if (pct > 0.25) return { label: `${spotsLeft} spots left`, colour: 'amber', spotsLeft };
  return { label: `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`, colour: 'red', spotsLeft };
}
