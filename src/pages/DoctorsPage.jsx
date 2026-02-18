import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  Users,
  Calendar,
  Clock,
  Activity,
  ChevronRight,
  X,
  TrendingUp,
  Award,
  Stethoscope,
  UserCheck,
  Filter,
  MapPin,
  Phone,
  Mail,
  BarChart3,
  CircleDot,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════ */
const DOCTORS = [
  {
    id: 1, name: 'Dr. Sarah Wilson', role: 'Orthodontist', experience: 12,
    avatar: 'SW', gradient: 'from-rose-500 to-pink-600',
    rating: 4.9, totalPatients: 1247, apptsToday: 5, status: 'online',
    phone: '+1 (555) 123-4567', email: 'sarah.w@dentalcare.com',
    specializations: ['Braces', 'Invisalign', 'Retainers'],
    revenue: [42, 58, 45, 62, 55, 70],
    schedule: [
      { time: '09:00 AM', patient: 'Emma Thompson', tx: 'Braces Adjustment', duration: '60 min' },
      { time: '10:30 AM', patient: 'Liam Park', tx: 'Wire Change', duration: '30 min' },
      { time: '11:30 AM', patient: 'Ava Chen', tx: 'Invisalign Check', duration: '30 min' },
      { time: '01:00 PM', patient: 'Mia Rodriguez', tx: 'Retainer Fit', duration: '45 min' },
      { time: '02:30 PM', patient: 'Noah Kim', tx: 'Initial Consult', duration: '60 min' },
    ],
  },
  {
    id: 2, name: 'Dr. Mike Chen', role: 'General Dentist', experience: 8,
    avatar: 'MC', gradient: 'from-blue-500 to-indigo-600',
    rating: 4.8, totalPatients: 2034, apptsToday: 7, status: 'online',
    phone: '+1 (555) 234-5678', email: 'mike.c@dentalcare.com',
    specializations: ['Fillings', 'Root Canals', 'Crowns'],
    revenue: [38, 42, 50, 48, 60, 65],
    schedule: [
      { time: '08:30 AM', patient: 'James Wilson', tx: 'Composite Filling', duration: '45 min' },
      { time: '09:30 AM', patient: 'Sophia Garcia', tx: 'Root Canal', duration: '90 min' },
      { time: '11:30 AM', patient: 'Lucas Lee', tx: 'Crown Prep', duration: '60 min' },
      { time: '01:00 PM', patient: 'Ella Brown', tx: 'Deep Cleaning', duration: '45 min' },
      { time: '02:30 PM', patient: 'Oliver Davis', tx: 'Exam + X-Ray', duration: '30 min' },
    ],
  },
  {
    id: 3, name: 'Jessica Lee', role: 'Hygienist', experience: 5,
    avatar: 'JL', gradient: 'from-emerald-500 to-teal-600',
    rating: 4.9, totalPatients: 890, apptsToday: 8, status: 'online',
    phone: '+1 (555) 345-6789', email: 'jessica.l@dentalcare.com',
    specializations: ['Cleanings', 'Whitening', 'Fluoride'],
    revenue: [22, 28, 30, 35, 32, 40],
    schedule: [
      { time: '08:00 AM', patient: 'Charlotte Ng', tx: 'Routine Cleaning', duration: '45 min' },
      { time: '09:00 AM', patient: 'Oliver Brown', tx: 'Deep Cleaning', duration: '60 min' },
      { time: '10:30 AM', patient: 'Ava Martinez', tx: 'Whitening', duration: '60 min' },
      { time: '12:00 PM', patient: 'Ethan Hall', tx: 'Fluoride Treatment', duration: '30 min' },
      { time: '01:00 PM', patient: 'Grace Kim', tx: 'Perio Maintenance', duration: '45 min' },
    ],
  },
  {
    id: 4, name: 'Dr. Kerri Myers', role: 'Endodontist', experience: 15,
    avatar: 'KM', gradient: 'from-violet-500 to-purple-600',
    rating: 4.7, totalPatients: 1580, apptsToday: 4, status: 'online',
    phone: '+1 (555) 456-7890', email: 'kerri.m@dentalcare.com',
    specializations: ['Root Canals', 'Retreatments', 'Apicoectomy'],
    revenue: [50, 55, 48, 65, 58, 72],
    schedule: [
      { time: '09:00 AM', patient: 'David Park', tx: 'Root Canal #19', duration: '90 min' },
      { time: '11:00 AM', patient: 'Sophie Wang', tx: 'Retreatment #14', duration: '60 min' },
      { time: '01:00 PM', patient: 'Ryan Torres', tx: 'Root Canal #30', duration: '90 min' },
      { time: '03:00 PM', patient: 'Amy Foster', tx: 'Consult', duration: '30 min' },
    ],
  },
  {
    id: 5, name: 'Dr. Alex Rivera', role: 'Oral Surgeon', experience: 10,
    avatar: 'AR', gradient: 'from-amber-500 to-orange-600',
    rating: 4.8, totalPatients: 956, apptsToday: 3, status: 'offline',
    phone: '+1 (555) 567-8901', email: 'alex.r@dentalcare.com',
    specializations: ['Extractions', 'Implants', 'Bone Grafts'],
    revenue: [60, 45, 70, 55, 75, 80],
    schedule: [
      { time: '09:00 AM', patient: 'Mark Johnson', tx: 'Wisdom Extraction', duration: '60 min' },
      { time: '10:30 AM', patient: 'Nina Patel', tx: 'Implant Placement', duration: '90 min' },
      { time: '01:00 PM', patient: 'Tom Blake', tx: 'Bone Graft', duration: '60 min' },
    ],
  },
  {
    id: 6, name: 'Dr. Priya Patel', role: 'Pediatric Dentist', experience: 7,
    avatar: 'PP', gradient: 'from-pink-500 to-rose-600',
    rating: 5.0, totalPatients: 720, apptsToday: 6, status: 'online',
    phone: '+1 (555) 678-9012', email: 'priya.p@dentalcare.com',
    specializations: ['Pediatric Care', 'Sealants', 'Space Maintainers'],
    revenue: [25, 30, 28, 35, 38, 42],
    schedule: [
      { time: '09:00 AM', patient: 'Lily Chen (8)', tx: 'Sealant Application', duration: '30 min' },
      { time: '09:45 AM', patient: 'Max Wilson (6)', tx: 'First Dental Visit', duration: '45 min' },
      { time: '10:45 AM', patient: 'Zoe Park (10)', tx: 'Filling', duration: '45 min' },
      { time: '12:00 PM', patient: 'Leo Brown (12)', tx: 'Ortho Consult', duration: '30 min' },
      { time: '01:00 PM', patient: 'Mia Torres (7)', tx: 'Fluoride + Cleaning', duration: '45 min' },
    ],
  },
  {
    id: 7, name: 'Dr. James Okafor', role: 'Prosthodontist', experience: 11,
    avatar: 'JO', gradient: 'from-cyan-500 to-blue-600',
    rating: 4.6, totalPatients: 640, apptsToday: 4, status: 'offline',
    phone: '+1 (555) 789-0123', email: 'james.o@dentalcare.com',
    specializations: ['Crowns', 'Bridges', 'Dentures'],
    revenue: [45, 50, 42, 55, 52, 60],
    schedule: [
      { time: '09:00 AM', patient: 'Helen White', tx: 'Crown Seat', duration: '45 min' },
      { time: '10:00 AM', patient: 'Frank Moore', tx: 'Bridge Impression', duration: '60 min' },
      { time: '11:30 AM', patient: 'Betty Adams', tx: 'Denture Adjustment', duration: '30 min' },
      { time: '01:00 PM', patient: 'Carl Young', tx: 'Implant Crown', duration: '60 min' },
    ],
  },
  {
    id: 8, name: 'Maria Santos', role: 'Dental Assistant', experience: 3,
    avatar: 'MS', gradient: 'from-slate-500 to-slate-600',
    rating: 4.8, totalPatients: 0, apptsToday: 0, status: 'online',
    phone: '+1 (555) 890-1234', email: 'maria.s@dentalcare.com',
    specializations: ['Chairside Assist', 'Sterilization', 'Patient Prep'],
    revenue: [0, 0, 0, 0, 0, 0],
    schedule: [],
  },
];

const ROLES = ['All', 'General Dentist', 'Orthodontist', 'Oral Surgeon', 'Endodontist', 'Pediatric Dentist', 'Hygienist', 'Prosthodontist', 'Dental Assistant'];
const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

/* ══════════════════════════════════════════════
   STAT CARD
   ══════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, sub, color, iconBg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
        <Icon size={20} className={color} />
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-end gap-2">
          <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</span>
          {sub && <span className="text-[11px] font-bold text-emerald-500 mb-0.5">{sub}</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   DOCTOR CARD
   ══════════════════════════════════════════════ */
function DoctorCard({ doctor, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Gradient Banner */}
      <div className={`h-20 bg-gradient-to-r ${doctor.gradient} relative`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-40" />
        {/* Status Dot */}
        <div className="absolute top-3 right-3">
          <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${doctor.status === 'online'
              ? 'bg-white/20 text-white'
              : 'bg-black/20 text-white/70'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${doctor.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-white/40'}`} />
            {doctor.status === 'online' ? 'Active' : 'Away'}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-9 relative z-10">
        <div className={`w-[70px] h-[70px] rounded-2xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center text-white text-xl font-bold shadow-xl ring-4 ring-white group-hover:scale-105 transition-transform`}>
          {doctor.avatar}
        </div>
      </div>

      {/* Info */}
      <div className="text-center px-4 pt-3 pb-2">
        <h3 className="text-[15px] font-extrabold text-slate-800">{doctor.name}</h3>
        <span className="inline-block mt-1 px-3 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-full border border-primary-100">
          {doctor.role}
        </span>
        <p className="text-[11px] text-slate-400 font-medium mt-1.5">{doctor.experience} Years Experience</p>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-3 border-t border-slate-50 mx-4 mt-2 py-3">
        {[
          { icon: Star, value: doctor.rating, label: 'Rating', color: 'text-amber-500' },
          { icon: Users, value: doctor.totalPatients >= 1000 ? `${(doctor.totalPatients / 1000).toFixed(1)}k` : doctor.totalPatients, label: 'Patients', color: 'text-blue-500' },
          { icon: Calendar, value: doctor.apptsToday, label: 'Today', color: 'text-emerald-500' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <stat.icon size={11} className={stat.color} />
              <span className="text-sm font-extrabold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4 pt-1">
        <button className="flex-1 h-9 rounded-xl border-2 border-primary-200 text-primary-700 text-[11px] font-bold hover:bg-primary-50 transition-colors flex items-center justify-center gap-1.5">
          <Calendar size={12} /> Schedule
        </button>
        <button className="flex-1 h-9 rounded-xl border-2 border-slate-200 text-slate-600 text-[11px] font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
          <ChevronRight size={12} /> Profile
        </button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   SLIDE-OVER PANEL
   ══════════════════════════════════════════════ */
function SlideOverPanel({ doctor, onClose }) {
  if (!doctor) return null;
  const maxRev = Math.max(...doctor.revenue, 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden"
      >
        {/* Header Banner */}
        <div className={`h-28 bg-gradient-to-r ${doctor.gradient} relative shrink-0`}>
          <div className="absolute inset-0 bg-black/10" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-4 left-5 flex items-end gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${doctor.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-white`}>
              {doctor.avatar}
            </div>
            <div className="pb-1">
              <h3 className="text-lg font-extrabold text-white drop-shadow-sm">{doctor.name}</h3>
              <p className="text-xs text-white/80 font-medium">{doctor.role} • {doctor.experience} yrs</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Status + Contact */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${doctor.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-xs font-bold text-slate-600">{doctor.status === 'online' ? 'Currently Active' : 'Away / Offline'}</span>
            </div>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors"><Phone size={14} /></button>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-colors"><Mail size={14} /></button>
            </div>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.specializations.map(s => (
                <span key={s} className="px-3 py-1 bg-primary-50 text-primary-700 text-[11px] font-bold rounded-full border border-primary-100">{s}</span>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Rating', value: doctor.rating, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Patients', value: doctor.totalPatients.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Today', value: doctor.apptsToday, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 bg-white rounded-xl border border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
                <p className="text-lg font-extrabold text-slate-800">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <BarChart3 size={12} /> Revenue (Last 6 Months)
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-end gap-2 h-28">
                {doctor.revenue.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / maxRev) * 100}%` }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                      className={`w-full rounded-lg bg-gradient-to-t ${doctor.gradient} min-h-[4px]`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {MONTHS.map(m => (
                  <span key={m} className="flex-1 text-center text-[9px] font-bold text-slate-400">{m}</span>
                ))}
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs font-bold text-slate-600">${doctor.revenue.reduce((a, b) => a + b, 0)}k total</span>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={12} /> Today's Schedule
            </h4>
            {doctor.schedule.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No appointments scheduled</p>
            ) : (
              <div className="space-y-2">
                {doctor.schedule.map((appt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:shadow-sm transition-shadow"
                  >
                    <div className="w-14 text-center shrink-0">
                      <p className="text-[11px] font-bold text-primary-600">{appt.time}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{appt.duration}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 truncate">{appt.patient}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{appt.tx}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filtered = useMemo(() => {
    return DOCTORS.filter(d => {
      const matchRole = roleFilter === 'All' || d.role === roleFilter;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.role.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [search, roleFilter]);

  const activeCount = DOCTORS.filter(d => d.status === 'online').length;
  const totalToday = DOCTORS.reduce((s, d) => s + d.apptsToday, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-sans">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Medical Team</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Performance overview & team management</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Stethoscope} label="Total Doctors" value={DOCTORS.length} sub="+2 this month" color="text-primary-600" iconBg="bg-primary-50" />
        <StatCard icon={Activity} label="Active Now" value={activeCount} sub="Online" color="text-emerald-600" iconBg="bg-emerald-50" />
        <StatCard icon={UserCheck} label="Patients Today" value={totalToday} sub="+12% vs avg" color="text-blue-600" iconBg="bg-blue-50" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full h-10 pl-10 pr-4 bg-white rounded-xl border-2 border-slate-100 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all font-medium"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap overflow-x-auto">
          {['All', 'General Dentist', 'Orthodontist', 'Hygienist', 'Oral Surgeon'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${roleFilter === r
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((doc, i) => (
          <DoctorCard key={doc.id} doctor={doc} index={i} onClick={() => setSelectedDoc(doc)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Stethoscope size={40} className="text-slate-200 mb-3" />
          <p className="text-sm font-bold text-slate-400">No team members found</p>
          <p className="text-xs text-slate-400 mt-1">Try a different filter or search term</p>
        </div>
      )}

      {/* Slide-Over Panel */}
      <AnimatePresence>
        {selectedDoc && <SlideOverPanel key="panel" doctor={selectedDoc} onClose={() => setSelectedDoc(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}
