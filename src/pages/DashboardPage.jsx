import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarCheck,
  DollarSign,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Bell,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart, Area,
  ComposedChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ════════════════════════════════════════════
   MOCK DATA
   ════════════════════════════════════════════ */

const sparkPatients     = [20,35,25,45,30,55,40,60,50,65,55,70];
const sparkAppointments = [10,25,15,40,20,35,45,30,50,35,55,48];
const sparkRevenue      = [30,45,35,55,40,65,50,70,60,80,65,85];

const revenueData = [
  { month: 'Jan', appointments: 350, surgeries: 120 },
  { month: 'Feb', appointments: 420, surgeries: 180 },
  { month: 'Mar', appointments: 380, surgeries: 150 },
  { month: 'Apr', appointments: 500, surgeries: 220 },
  { month: 'May', appointments: 460, surgeries: 200 },
  { month: 'Jun', appointments: 580, surgeries: 280 },
  { month: 'Jul', appointments: 520, surgeries: 250 },
  { month: 'Aug', appointments: 600, surgeries: 300 },
  { month: 'Sep', appointments: 550, surgeries: 260 },
  { month: 'Oct', appointments: 640, surgeries: 320 },
  { month: 'Nov', appointments: 580, surgeries: 290 },
  { month: 'Dec', appointments: 700, surgeries: 350 },
];

const doctors = [
  { name: 'Dr. Lillie Kennedy', specialty: 'Periodontist - 9 yrs', rating: 5.0, avatar: 'LK', color: 'from-rose-400 to-rose-600' },
  { name: 'Dr. Kerri Myers',   specialty: 'Endodontist - 6 yrs',  rating: 4.9, avatar: 'KM', color: 'from-violet-400 to-violet-600' },
  { name: 'Dr. Tobias Wong',   specialty: 'Orthodontist - 5 yrs', rating: 4.8, avatar: 'TW', color: 'from-blue-400 to-blue-600' },
];

const todayAppts = [
  { id: 1, name: 'Kitty Miller',   type: 'Consultation', time: '09:00', color: 'bg-rose-500',   avatar: 'KM', avatarColor: 'from-rose-400 to-rose-600' },
  { id: 2, name: 'Anne Wallace',   type: 'Medication',   time: '09:45', color: 'bg-amber-500',  avatar: 'AW', avatarColor: 'from-amber-400 to-amber-600' },
  { id: 3, name: 'Lesley Chaney',  type: 'Laboratory',   time: '10:15', color: 'bg-blue-500',   avatar: 'LC', avatarColor: 'from-blue-400 to-blue-600' },
  { id: 4, name: 'Darcy May',      type: 'Check-up',     time: '11:30', color: 'bg-emerald-500', avatar: 'DM', avatarColor: 'from-emerald-400 to-emerald-600' },
];

const patientStats = [
  { label: 'New Patients',    value: '2,000', change: '+20.2%', period: 'In January', icon: '👶' },
  { label: 'Return Patients', value: '6,000', change: '+22.8%', period: 'In January', icon: '🔄' },
  { label: 'Male Patients',   value: '3,000', change: '+18.9%', period: 'In January', icon: '👨' },
  { label: 'Female Patients', value: '4,000', change: '+48.3%', period: 'In January', icon: '👩' },
];

/* ── Animation ── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } } };

/* ════════════════════════════════════════════
   SPARKLINE
   ════════════════════════════════════════════ */
function Sparkline({ data, color = '#2dd4bf' }) {
  const chartData = data.map((v, i) => ({ v, i }));
  const gradientId = `spark-${color.replace('#', '')}`;
  return (
    <div className="w-full h-16 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone" dataKey="v" stroke={color} strokeWidth={3}
            fill={`url(#${gradientId})`} dot={false} isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ════════════════════════════════════════════
   MINI CALENDAR
   ════════════════════════════════════════════ */
function MiniCalendar() {
  const [viewDate, setViewDate] = useState(new Date(2025, 0, 1));
  const today = 13;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 h-full flex flex-col justify-center relative overflow-hidden">
       {/* Decorative bg blur */}
       <div className="absolute top-0 right-0 w-20 h-20 bg-primary-50 rounded-bl-full -z-0 opacity-50" />
      
      <div className="relative z-10">
        <h3 className="text-[15px] font-bold text-slate-800 mb-5 tracking-tight">Appointments</h3>
        <div className="flex items-center justify-between mb-5 bg-slate-50 p-1.5 rounded-xl">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center cursor-pointer transition-all text-slate-500">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-slate-700">{monthName} {year}</span>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm flex items-center justify-center cursor-pointer transition-all text-slate-500">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-2">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
            <span key={d} className="text-center text-[11px] font-bold text-slate-400 py-1 uppercase tracking-wider">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 place-items-center">
          {days.map((day, i) => (
            <div key={i} className="flex items-center justify-center w-full">
              {day ? (
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 ${
                  day === today
                    ? 'bg-primary-600 text-white font-bold shadow-md shadow-primary-200'
                    : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:scale-110'
                }`}>
                  {day}
                </span>
              ) : <span className="w-8 h-8" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white text-slate-800 text-xs rounded-xl px-3 py-2.5 shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
      <p className="font-bold mb-2 text-slate-900 border-b border-slate-100 pb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
             <span className={`w-2 h-2 rounded-full ${i===0?'bg-primary-600':'bg-primary-300'}`} />
             {p.name}
          </span>
          <span className="font-bold tabular-nums text-slate-700">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   DASHBOARD PAGE
   ════════════════════════════════════════════ */
export default function DashboardPage() {
  const [chartYear, setChartYear] = useState('2024');

  return (
    <motion.div 
      variants={stagger} initial="hidden" animate="show" 
      className="min-h-full flex flex-col font-sans"
    >
      {/* ── Top Bar ── */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8 sticky top-0 z-30 py-2 bg-gray-50/80 backdrop-blur-sm -mx-4 px-4 sm:-mx-0 sm:px-0">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text" placeholder="Search patients, files…"
              className="h-12 w-72 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all shadow-sm"
            />
          </div>
          <nav className="flex items-center gap-2 text-sm text-slate-400 hidden lg:flex bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            <span>🏠</span><span>/</span>
            <span className="text-slate-700 font-semibold">Dentist Admin</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm tracking-wide">
            📅 12 Dec – 13 Jan
          </span>
          <button className="relative w-11 h-11 rounded-full bg-white hover:bg-slate-50 border border-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-md group">
            <Bell size={20} className="text-slate-500 group-hover:text-slate-700" />
            <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════
          GRID LAYOUT (Spacious)
         ════════════════════════════════════════ */}
      <div className="grid grid-cols-[1fr_340px] gap-8 flex-1 pb-10">

        {/* ========== CENTER COLUMN ========== */}
        <div className="min-w-0 space-y-8">

          {/* ── 3 Stat Cards ── */}
          <div className="grid grid-cols-3 gap-6">
            {/* Patients */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 min-w-0 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300">
                    <Users size={22} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={20} /></button>
                </div>
                <p className="text-4xl font-bold text-slate-800 tracking-tight mb-1">660</p>
                <p className="text-sm text-slate-400 font-medium">Total Patients</p>
              </div>
              <Sparkline data={sparkPatients} color="#2dd4bf" />
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <ArrowUpRight size={12} strokeWidth={3} /> 40%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </motion.div>

            {/* Appointments */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 min-w-0 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                    <CalendarCheck size={22} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={20} /></button>
                </div>
                <p className="text-4xl font-bold text-slate-800 tracking-tight mb-1">230</p>
                <p className="text-sm text-slate-400 font-medium">Appointments</p>
              </div>
              <Sparkline data={sparkAppointments} color="#60a5fa" />
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <ArrowUpRight size={12} strokeWidth={3} /> 30%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </motion.div>

            {/* Revenue */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 min-w-0 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300">
                    <DollarSign size={22} />
                  </div>
                  <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={20} /></button>
                </div>
                <p className="text-4xl font-bold text-slate-800 tracking-tight mb-1">$9,900</p>
                <p className="text-sm text-slate-400 font-medium">Total Revenue</p>
              </div>
              <Sparkline data={sparkRevenue} color="#34d399" />
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <ArrowUpRight size={12} strokeWidth={3} /> 20%
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </motion.div>
          </div>

          {/* ── Available Doctors ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow min-w-0">
            <h2 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Available Doctors</h2>
            <div className="grid grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc.name} className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-primary-100 hover:shadow-lg hover:shadow-primary-100/40 transition-all duration-300 cursor-pointer group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.color} flex items-center justify-center text-white text-base font-bold shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                    {doc.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-slate-900 truncate group-hover:text-primary-700 transition-colors">{doc.name}</p>
                    <p className="text-xs text-slate-500 truncate mt-1 font-medium">{doc.specialty}</p>
                    <div className="flex items-center gap-1.5 mt-2 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100 w-fit">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Revenue Chart (Modern) ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow min-w-0 relative overflow-hidden">
             {/* Gradient accent */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-bl-full opacity-30 -z-0 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Revenue Analytics</h2>
                <p className="text-sm text-slate-400 mt-1">Income vs Surgeries performed</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-100 backdrop-blur-sm">
                {['2024','2023','2022'].map((y) => (
                  <button
                    key={y} onClick={() => setChartYear(y)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chartYear === y
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full h-80 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.7} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={15} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.5 }} />
                  <Bar dataKey="surgeries" name="Surgeries" fill="#14b8a6" radius={[6,6,0,0]} barSize={28} opacity={1} />
                  <Area
                    type="monotone" dataKey="appointments" name="Appointments"
                    stroke="#2dd4bf" strokeWidth={3} fill="url(#areaGrad)" 
                    dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#2dd4bf' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-8 mt-6 justify-center pt-4 opacity-80">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-400" /> Appointments
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600" /> Surgeries
              </span>
            </div>
          </motion.div>

          {/* ── Patient Stats ── */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow min-w-0">
            <h2 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Patient Demographics</h2>
            <div className="grid grid-cols-4 gap-6">
              {patientStats.map((s) => (
                <div key={s.label} className="text-center min-w-0 bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-primary-100 hover:bg-white hover:shadow-lg hover:shadow-primary-100/20 transition-all duration-300 group cursor-default">
                  <div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{s.icon}</div>
                  <p className="text-sm text-slate-500 font-medium mb-1 truncate">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-800 tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-xs font-bold text-primary-600 mt-1">{s.change}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ========== RIGHT COLUMN (340px) ========== */}
        <div className="min-w-0 space-y-8 flex flex-col">
          {/* Calendar */}
          <motion.div variants={fadeUp} className="flex-1 min-h-[340px]">
            <MiniCalendar />
          </motion.div>

          {/* Today's Appointments */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[15px] font-bold text-slate-800 tracking-tight">Today&apos;s Schedule</h3>
              <button className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1 rounded-full">View All</button>
            </div>
            <div className="space-y-4">
              {todayAppts.map((appt) => (
                <div key={appt.id} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${appt.avatarColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    {appt.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-slate-700 truncate group-hover:text-slate-900">{appt.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{appt.type}</p>
                  </div>
                  <span className={`${appt.color} text-white text-[11px] font-bold px-3 py-1 rounded-full shrink-0 shadow-sm opacity-90 group-hover:opacity-100`}>
                    {appt.time}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Featured Doctor Card */}
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white shadow-xl shadow-primary-900/20 group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/15 transition-colors duration-500" />
            <div className="absolute bottom-6 right-6 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold backdrop-blur-md border border-white/20 shadow-lg">
                  TW
                </div>
                <div>
                  <p className="text-xl font-bold leading-tight tracking-tight">Dr. Tobias</p>
                  <p className="text-primary-100 text-sm font-medium mt-0.5">Orthodontist</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                     <Clock size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-bold tracking-wide text-white/90">Next Shift</span>
                </div>
                <p className="text-xs text-white/80 font-medium ml-9 leading-relaxed">
                  Monday, 20th Jan<br/>
                  09:00 AM – 02:00 PM
                </p>
              </div>
            </div>
          </motion.div>

          {/* Overview */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-[15px] font-bold text-slate-800 mb-6 tracking-tight">Status Overview</h3>
            <div className="space-y-6">
              {[
                { label: 'Total Bookings', val: '482', bar: 75, barColor: 'bg-primary-500' },
                { label: 'Completed',      val: '367', bar: 60, barColor: 'bg-emerald-500' },
                { label: 'Cancelled',      val: '28',  bar: 15, barColor: 'bg-red-400' },
                { label: 'Pending',        val: '87',  bar: 30, barColor: 'bg-amber-400' },
              ].map((o) => (
                <div key={o.label}>
                  <div className="flex justify-between text-xs mb-2.5">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">{o.label}</span>
                    <span className="font-bold text-slate-800 text-sm">{o.val}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-50 shadow-inner overflow-hidden border border-slate-100">
                    <div className={`h-full rounded-full ${o.barColor} transition-all duration-1000 ease-out shadow-sm`} style={{ width: `${o.bar}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
