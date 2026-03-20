# KineticHub Enhancement Plan

## Current Status: Font Awesome Migration (Partially Complete)

### What's Done
- Installed `@fortawesome/fontawesome-free`
- Imported Font Awesome CSS globally in `main.tsx`
- Created `FaIcon.tsx` helper component in `src/app/components/`
- Migrated **10 files** from Lucide React → Font Awesome Free:
  - `Navbar.tsx` — Bolt, Shield, Gear, LogOut, Bars, Xmark, ChevronDown
  - `Footer.tsx` — Brand icons (Instagram, Facebook, X-Twitter, YouTube), MapPin, Phone, Envelope
  - `HomePage.tsx` — 15 icon types including Dumbbell, WiFi, Star, Users, Calendar, Award, etc.
  - `ClassesPage.tsx` — Search, Clock, Users, Filter, Xmark, CheckCircle
  - `AboutPage.tsx` — Heart, Award, Users, Bolt, MapPin, Clock, Phone, Envelope
  - `LoginPage.tsx` — Bolt, Eye, EyeSlash, TriangleExclamation, RightToBracket
  - `RegisterPage.tsx` — CircleCheck, Bolt, TriangleExclamation, Eye, EyeSlash, UserPlus
  - `ProgrammesPage.tsx` — Clock, ChartColumn, User, CircleCheck, ArrowRight
  - `MembershipPage.tsx` — CircleCheck, CircleXmark, Bolt, CircleInfo, ArrowRight
  - `NotFoundPage.tsx` — Bolt, House, Calendar

### What's Remaining
- [ ] `DashboardPage.tsx` — still imports from `lucide-react`
- [ ] `AdminPage.tsx` — still imports from `lucide-react`
- [ ] `src/app/components/ui/` — shadcn/ui components (accordion, calendar, carousel, etc.) still use `lucide-react`
- [ ] Build verification (`npm run build`)
- [ ] Optional: uninstall `lucide-react` once all references are removed

---

## Future Enhancements (Library Integration Plan)

### Libraries to Integrate
| Library | Package | Purpose |
|---------|---------|---------|
| Bootstrap 5 | `bootstrap react-bootstrap @popperjs/core` | Replace Tailwind CSS for styling |
| Font Awesome Free | `@fortawesome/fontawesome-free` | **Partially done** — replace Lucide icons |
| Chart.js | `chart.js react-chartjs-2` | Data visualisation on Admin/Dashboard pages |
| PHPMailer | PHP backend required | Contact form, email notifications |
| Auth Library | Firebase Auth / Auth0 / Supabase | Replace mock AuthContext |

### Proposed Features Using These Libraries

#### 1. Contact Form (Bootstrap + PHPMailer)
- Add to `AboutPage.tsx` — currently has contact info but no form
- POST to PHPMailer endpoint for email delivery

#### 2. Booking Confirmation Emails (PHPMailer)
- Send email after class booking on `ClassesPage`
- Include class name, day, time, instructor

#### 3. Registration Welcome Email (PHPMailer)
- Trigger on account creation from `RegisterPage`

#### 4. Admin Analytics Dashboard (Chart.js)
- Doughnut chart — membership distribution by tier
- Bar chart — bookings per class (most popular)
- Line chart — revenue/member growth over 12 months

#### 5. Member Dashboard Charts (Chart.js)
- Weekly activity bar chart (classes attended)
- Doughnut chart (booking status: Confirmed/Attended/Cancelled)

#### 6. Persistent Authentication (Auth)
- Replace `useState`-based auth (currently logs out on page refresh)
- Use Firebase `onAuthStateChanged` or localStorage/sessionStorage

#### 7. Social Brand Icons (Font Awesome) ✅ DONE
- Footer social links now use official `fa-brands` icons

#### 8. Class Waitlist System (Bootstrap + PHPMailer)
- Modal for waitlist signup when sessions are full
- Email notification when a spot opens

#### 9. Password Reset Flow (Auth + PHPMailer)
- `LoginPage` "Forgot password?" link currently does nothing
- Add reset modal or page with email collection

#### 10. FAQ Accordion (Bootstrap)
- Already exists in `MembershipPage` — could expand to `AboutPage`

#### 11. Newsletter Subscription (Bootstrap + PHPMailer)
- Add email input + subscribe button to `Footer`

#### 12. Class Reviews & Ratings (Bootstrap + Font Awesome)
- Star rating selector using `fa-star` icons
- Review form on `DashboardPage` for attended classes
- Display reviews on `ClassesPage`

### Feature × Library Matrix

| Feature | Bootstrap | Font Awesome | Chart.js | PHPMailer | Auth |
|---------|:---------:|:------------:|:--------:|:---------:|:----:|
| Contact form | ✅ | | | ✅ | |
| Booking emails | | | | ✅ | |
| Welcome email | | | | ✅ | |
| Admin charts | ✅ | | ✅ | | |
| Member charts | ✅ | | ✅ | | |
| Persistent auth | | | | | ✅ |
| Brand icons | | ✅ | | | |
| Waitlist system | ✅ | | | ✅ | |
| Password reset | ✅ | | | ✅ | ✅ |
| FAQ accordion | ✅ | | | | |
| Newsletter | ✅ | | | ✅ | |
| Reviews/ratings | ✅ | ✅ | | | ✅ |

---

## Deployment: Google Cloud VM

This is a **Vite + React** project. Opening `index.html` directly will NOT work.

### Already Configured
`vite.config.ts` is set to bind to `0.0.0.0` so the app is accessible from external IPs.

### Step 1: Open Firewall Ports
In Google Cloud Console > **VPC Network > Firewall rules**, create a rule:
- **Direction:** Ingress
- **Targets:** All instances (or specific VM tag)
- **Source IP ranges:** `0.0.0.0/0`
- **Protocols/ports:** TCP: `5173,4173,3000`

Or via gcloud CLI:
```bash
gcloud compute firewall-rules create allow-vite \
  --allow tcp:5173,tcp:4173,tcp:3000 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow Vite dev/preview/serve"
```

### Step 2a: Development Mode
```bash
cd /path/to/INF1005-P2-13
npm install
npm run dev
```
Access at: `http://<VM-EXTERNAL-IP>:5173`

### Production Build
```bash
npm run build
# Output goes to dist/ folder
```

### Deploying to Google Cloud VM
```bash
# Option 1: Serve the built output
npm run build
npx serve dist -l 3000

# Option 2: Use the Vite dev server (not recommended for production)
npm run dev -- --host 0.0.0.0

# Option 3: Use nginx to serve the dist/ folder
# Copy dist/ contents to /var/www/html/
```

> **Note:** Opening `index.html` directly in a browser will NOT work — Vite uses ES modules which require a server.
