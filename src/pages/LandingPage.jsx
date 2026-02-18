import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ChevronRight,
  Play,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Bell,
  Star,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Heart,
  Phone,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';

/* ── Tooth Logo ── */
function ToothLogo({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.5 2 7.5 3 6.5 5C5.5 7 5 9 5 11C5 13 5.5 15 6 17C6.5 19 7 21 8.5 22C9.5 22.5 10.5 20 11 18C11.5 16 12 15 12 15C12 15 12.5 16 13 18C13.5 20 14.5 22.5 15.5 22C17 21 17.5 19 18 17C18.5 15 19 13 19 11C19 9 18.5 7 17.5 5C16.5 3 14.5 2 12 2Z" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   ANIMATION VARIANTS
   ══════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/* ══════════════════════════════════════════════
   MOCK DASHBOARD (Hero Visual)
   ══════════════════════════════════════════════ */
function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden w-full max-w-[520px]">
      {/* Window Chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-md px-10 py-1 text-[9px] text-slate-400 font-medium border border-slate-100">
            dentalcare.app/dashboard
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {[
            { label: 'Total Patients', val: '2,847', color: 'bg-primary-500', pct: '+12%' },
            { label: 'Appointments', val: '156', color: 'bg-blue-500', pct: '+8%' },
            { label: 'Revenue', val: '$48.2k', color: 'bg-emerald-500', pct: '+23%' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
              <div className={`w-6 h-6 rounded-lg ${s.color} mb-2`} />
              <p className="text-[9px] text-slate-400 font-bold">{s.label}</p>
              <div className="flex items-end gap-1">
                <span className="text-sm font-extrabold text-slate-800">{s.val}</span>
                <span className="text-[8px] font-bold text-emerald-500 mb-0.5">{s.pct}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-bold text-slate-500">Revenue Overview</span>
            <span className="text-[8px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">This Week</span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {[35, 50, 40, 65, 55, 80, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-sm opacity-80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Table Preview */}
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-4 gap-2 px-3 py-1.5 bg-slate-50 text-[8px] font-bold text-slate-400 uppercase">
            <span>Patient</span><span>Treatment</span><span>Status</span><span>Time</span>
          </div>
          {[
            { n: 'Emma T.', tx: 'Cleaning', st: 'bg-emerald-100 text-emerald-700', sl: 'Done', t: '9:00' },
            { n: 'James W.', tx: 'Root Canal', st: 'bg-blue-100 text-blue-700', sl: 'In Progress', t: '10:30' },
            { n: 'Sophia G.', tx: 'Checkup', st: 'bg-amber-100 text-amber-700', sl: 'Waiting', t: '11:00' },
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 px-3 py-2 text-[9px] border-t border-slate-50 items-center">
              <span className="font-bold text-slate-700">{r.n}</span>
              <span className="text-slate-500">{r.tx}</span>
              <span className={`${r.st} text-[7px] font-bold px-1.5 py-0.5 rounded-full text-center`}>{r.sl}</span>
              <span className="text-slate-400">{r.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FEATURES DATA
   ══════════════════════════════════════════════ */
const FEATURES = [
  { icon: Heart, color: 'bg-rose-100 text-rose-600', title: 'Visual Charting', desc: 'Mark treatments on an interactive odontogram with anatomically accurate tooth maps and real-time status tracking.' },
  { icon: Calendar, color: 'bg-blue-100 text-blue-600', title: 'Smart Scheduling', desc: 'Drag-and-drop appointment management with provider views, waitlists, and automated patient reminders.' },
  { icon: CreditCard, color: 'bg-emerald-100 text-emerald-600', title: 'Instant Billing', desc: 'Generate invoices from treatment catalogs, process payments, and track insurance claims — all in one click.' },
  { icon: Users, color: 'bg-violet-100 text-violet-600', title: 'Patient Portal', desc: 'Give patients secure access to their records, upcoming appointments, and treatment history online.' },
  { icon: BarChart3, color: 'bg-amber-100 text-amber-600', title: 'Analytics Dashboard', desc: 'Track revenue, patient flow, and provider performance with beautiful, real-time charts and reports.' },
  { icon: Shield, color: 'bg-cyan-100 text-cyan-600', title: 'HIPAA Compliant', desc: 'Enterprise-grade security with encrypted data, audit logs, role-based access, and automatic backups.' },
];

const STATS = [
  { value: '10,000+', label: 'Active Clinics', icon: MapPin, color: 'text-blue-600 bg-blue-100' },
  { value: '2.5M', label: 'Patients Managed', icon: Users, color: 'text-emerald-600 bg-emerald-100' },
  { value: '99.9%', label: 'Uptime SLA', icon: Zap, color: 'text-amber-600 bg-amber-100' },
  { value: '4.9/5', label: 'User Rating', icon: Star, color: 'text-primary-600 bg-primary-100' },
];

const TESTIMONIALS = [
  { name: 'Dr. Sarah Mitchell', role: 'Orthodontist, SmileCare NYC', text: 'DentalCRM transformed how we manage our clinic. The odontogram alone saved us hours of documentation each week.', rating: 5 },
  { name: 'Dr. David Park', role: 'General Dentist, FamilyDent', text: 'The scheduling and billing integration is seamless. Our front desk staff learned the system in under a day.', rating: 5 },
  { name: 'Lisa Chen', role: 'Clinic Manager, BrightSmile', text: 'We reduced no-shows by 40% with automated reminders. The analytics dashboard helps us make better business decisions.', rating: 5 },
];

/* ══════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════ */
export default function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.getElementById('landing-scroll-container');
    if (!el) return;
    function handleScroll() { setScrolled(el.scrollTop > 20); }
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="landing-scroll-container" className="h-screen w-full overflow-y-auto overflow-x-hidden bg-white font-sans scroll-smooth">

      {/* ═══════════════════════════════════
           NAVBAR
         ═══════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-md border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="mx-auto flex items-center justify-between h-16" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
              <ToothLogo size={18} />
            </div>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">DentalCRM</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Solutions', 'Pricing', 'Resources'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[13px] font-semibold text-slate-600 hover:text-primary-600 transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="text-[13px] font-bold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
            >
              Login
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-[12px] font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow whitespace-nowrap"
              style={{ padding: '8px 18px' }}
            >
              Book a Demo
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════
           HERO SECTION
         ═══════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-blue-50/50" />
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/3 w-40 h-40 bg-emerald-200/20 rounded-full blur-2xl" />

        <div className="relative z-10 w-full pt-20 pb-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          {/* Left: Text */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="text-center lg:text-left flex-1">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-6 mx-auto lg:mx-0">
              <Zap size={14} className="text-primary-600" />
              <span className="text-[12px] font-bold text-primary-700">Trusted by 10,000+ dental clinics worldwide</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Modern Dentistry,{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                Simplified.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-xl text-slate-600 leading-relaxed mb-8 mx-auto lg:mx-0">
              The all-in-one platform to manage patients, appointments, and billing with ease. Built for modern clinics that value efficiency and care.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate?.('dashboard')}
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-2xl text-[13px] font-bold shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow flex items-center gap-2 whitespace-nowrap"
                style={{ padding: '14px 28px' }}
              >
                Get Started Free <ArrowRight size={16} />
              </motion.button>
              <button className="border-2 border-slate-200 text-slate-700 rounded-2xl text-[13px] font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2.5 whitespace-nowrap" style={{ padding: '10px 28px' }}>
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <Play size={10} className="text-slate-600 ml-0.5" fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-4 justify-center lg:justify-start" style={{ marginTop: '12px' }}>
              <div className="flex -space-x-2">
                {['from-rose-400 to-pink-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500'].map((g, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}>
                    {['SM', 'DP', 'LC', 'AK'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} className="text-amber-400" fill="currentColor" />)}
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Loved by <strong className="text-slate-700">2,500+</strong> dental professionals</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="hidden lg:flex justify-center flex-1"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full"
            >
              <DashboardMockup />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           STATS BAR
         ═══════════════════════════════════ */}
      <section className="py-6 bg-slate-50/50">
        <div style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-default"
                  style={{ padding: '24px' }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`} style={{ marginBottom: '20px' }}>
                    <Icon size={26} fill="currentColor" className="opacity-80" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight" style={{ marginBottom: '8px' }}>{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           FEATURES SECTION
         ═══════════════════════════════════ */}
      <section id="features" className="py-24" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <div style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center" style={{ marginBottom: '48px' }}
          >
            <span className="text-[12px] font-bold text-primary-600 uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ marginTop: '12px' }}>
              Everything Your Clinic Needs to{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">Thrive</span>
            </h2>
            <p className="text-lg text-slate-500" style={{ maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto', marginTop: '16px' }}>
              From patient check-in to treatment charting to billing — streamlined into one beautiful platform.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '24px' }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  style={{ padding: '20px' }}
                >
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform`} style={{ marginBottom: '16px' }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800" style={{ marginBottom: '8px' }}>{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           TESTIMONIALS
         ═══════════════════════════════════ */}
      <section className="py-24 bg-slate-50/50" style={{ paddingBottom: '60px' }}>
        <div style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center" style={{ marginBottom: '48px' }}
          >
            <span className="text-[12px] font-bold text-primary-600 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight" style={{ marginTop: '12px' }}>Trusted by the Best Clinics</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                style={{ padding: '20px' }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-800">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           CTA BANNER
         ═══════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center" style={{ paddingLeft: '40px', paddingRight: '40px', paddingTop: '48px', paddingBottom: '48px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-white tracking-tight" style={{ marginBottom: '16px' }}>
              Ready to modernize your practice?
            </h2>
            <p className="text-lg text-primary-200" style={{ marginBottom: '32px', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}>
              Join thousands of dental professionals who've already made the switch. Start free, no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate?.('dashboard')}
                className="bg-white text-primary-700 rounded-2xl text-[13px] font-bold shadow-2xl hover:shadow-white/20 transition-shadow flex items-center gap-2 whitespace-nowrap"
                style={{ padding: '14px 28px' }}
              >
                Create Free Account <ArrowRight size={18} />
              </motion.button>
              <button className="border-2 border-white/30 text-white rounded-2xl text-[13px] font-bold hover:bg-white/10 transition-all whitespace-nowrap" style={{ padding: '14px 28px' }}>
                Talk to Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           FOOTER
         ═══════════════════════════════════ */}
      <footer className="bg-slate-900 text-slate-400" style={{ paddingTop: '48px', paddingBottom: '32px' }}>
        <div style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: '40px', marginBottom: '48px' }}>
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center">
                  <ToothLogo size={18} />
                </div>
                <span className="text-lg font-extrabold text-white">DentalCRM</span>
              </div>
              <p className="text-sm leading-relaxed">
                The modern platform for dental practice management. Built with care.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog', 'API Docs'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'] },
              { title: 'Resources', links: ['Blog', 'Guides', 'Case Studies', 'Webinars', 'Support'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'HIPAA', 'Security', 'Cookies'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-primary-400 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4" style={{ paddingTop: '10px' }}>
            <p className="text-sm">© 2026 DentalCRM. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
