import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Zap,
  MapPin,
  Bell,
  Search,
  MoreHorizontal,
  Video,
  Phone,
  TrendingUp,
  CircleDot
} from 'lucide-react';

/* ══════════════════════════════════════════════
   CONSTANTS & DATA
   ══════════════════════════════════════════════ */
const PROVIDERS = [
  { id: 'p1', name: 'Dr. Sarah Wilson', role: 'Orthodontist', avatar: 'SW', gradient: 'from-rose-500 to-pink-600', ring: 'ring-rose-200' },
  { id: 'p2', name: 'Dr. Mike Chen', role: 'General Dentist', avatar: 'MC', gradient: 'from-blue-500 to-indigo-600', ring: 'ring-blue-200' },
  { id: 'p3', name: 'Jessica Lee', role: 'Hygienist', avatar: 'JL', gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-200' },
];

const START_HOUR = 8;
const END_HOUR = 18;
const SLOT_H = 64;           // px per 30-min slot
const PX_PER_MIN = SLOT_H / 30;  // ~2.13

const TIME_SLOTS = Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }, (_, i) => {
  const totalMin = i * 30;
  const h = Math.floor(totalMin / 60) + START_HOUR;
  const m = totalMin % 60;
  const label = `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  return { label, hour: h, min: m };
});

const APPOINTMENTS = [
  { id: 1, providerId: 'p1', patient: 'Emma Thompson', tx: 'Braces Adjustment', start: '09:00', dur: 60, type: 'ortho', status: 'confirmed', avatar: 'ET' },
  { id: 2, providerId: 'p1', patient: 'Liam Johnson', tx: 'Invisalign Scan', start: '11:30', dur: 30, type: 'checkup', status: 'pending', avatar: 'LJ' },
  { id: 3, providerId: 'p1', patient: 'Mia Rodriguez', tx: 'Wire Change', start: '14:00', dur: 45, type: 'ortho', status: 'confirmed', avatar: 'MR' },
  { id: 4, providerId: 'p2', patient: 'Sophia Garcia', tx: 'Root Canal', start: '10:00', dur: 90, type: 'surgery', status: 'confirmed', avatar: 'SG' },
  { id: 5, providerId: 'p2', patient: 'James Wilson', tx: 'Emergency Checkup', start: '13:00', dur: 45, type: 'consult', status: 'arrived', avatar: 'JW' },
  { id: 6, providerId: 'p2', patient: 'Lucas Lee', tx: 'Crown Prep', start: '15:30', dur: 60, type: 'surgery', status: 'pending', avatar: 'LL' },
  { id: 7, providerId: 'p3', patient: 'Oliver Brown', tx: 'Deep Cleaning', start: '08:30', dur: 60, type: 'checkup', status: 'confirmed', avatar: 'OB' },
  { id: 8, providerId: 'p3', patient: 'Ava Martinez', tx: 'Whitening Session', start: '14:00', dur: 60, type: 'cosmetic', status: 'confirmed', avatar: 'AM' },
  { id: 9, providerId: 'p3', patient: 'Charlotte Ng', tx: 'Fluoride Treatment', start: '10:30', dur: 30, type: 'checkup', status: 'confirmed', avatar: 'CN' },
];

const WAITLIST = [
  { id: 101, name: 'Noah Miller', tx: 'Extraction', urgency: 'high', time: 'ASAP' },
  { id: 102, name: 'Isabella Davis', tx: 'Cleaning', urgency: 'low', time: 'Flexible' },
  { id: 103, name: 'Mason Wilson', tx: 'Checkup', urgency: 'medium', time: 'PM Pref' },
];

/* ── Appointment color themes ── */
const TYPE_THEME = {
  checkup: { bg: 'bg-emerald-50', border: 'border-l-emerald-500', text: 'text-emerald-700', glow: 'hover:shadow-emerald-200/60', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  surgery: { bg: 'bg-blue-50', border: 'border-l-blue-500', text: 'text-blue-700', glow: 'hover:shadow-blue-200/60', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  consult: { bg: 'bg-violet-50', border: 'border-l-violet-500', text: 'text-violet-700', glow: 'hover:shadow-violet-200/60', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  ortho: { bg: 'bg-amber-50', border: 'border-l-amber-500', text: 'text-amber-700', glow: 'hover:shadow-amber-200/60', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  cosmetic: { bg: 'bg-pink-50', border: 'border-l-pink-500', text: 'text-pink-700', glow: 'hover:shadow-pink-200/60', badge: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500' },
};

const STATUS_STYLES = {
  confirmed: 'bg-emerald-500',
  pending: 'bg-amber-400',
  arrived: 'bg-blue-500',
};

/* ── Helpers ── */
function pos(startTime, duration) {
  const [h, m] = startTime.split(':').map(Number);
  const top = ((h - START_HOUR) * 60 + m) * PX_PER_MIN;
  const height = duration * PX_PER_MIN;
  return { top, height };
}

function endTime(start, dur) {
  const [h, m] = start.split(':').map(Number);
  const eM = m + dur;
  const eH = h + Math.floor(eM / 60);
  const finalM = eM % 60;
  const ampm = eH >= 12 ? 'PM' : 'AM';
  const display = eH > 12 ? eH - 12 : eH;
  return `${display}:${finalM.toString().padStart(2, '0')} ${ampm}`;
}

function startLabel(start) {
  const [h, m] = start.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/* ══════════════════════════════════════════════
   MINI CALENDAR
   ══════════════════════════════════════════════ */
function MiniCalendar() {
  const [selected, setSelected] = useState(15);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = 15;
  // Jan 2026 starts on Thursday (index 4), so 4 empty cells before day 1
  const offset = 4;
  const totalDays = 31;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-lg shadow-slate-200/30">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-800">January 2026</h4>
        <div className="flex gap-0.5">
          <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><ChevronLeft size={14} /></button>
          <button className="w-6 h-6 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>
      {/* Day Labels */}
      <div className="grid grid-cols-7 mb-1">
        {days.map((d, i) => <span key={i} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">{d}</span>)}
      </div>
      {/* Date Grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: offset }).map((_, i) => <span key={`e-${i}`} />)}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map(d => {
          const isToday = d === today;
          const isSelected = d === selected;
          const hasAppt = [8, 12, 15, 22, 28].includes(d);
          return (
            <button
              key={d}
              onClick={() => setSelected(d)}
              className={`
                relative w-7 h-7 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-500/30 scale-110'
                  : isToday
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'}
              `}
            >
              {d}
              {hasAppt && !isSelected && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STAT PILL
   ══════════════════════════════════════════════ */
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/80 shadow-sm">
      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center`}>
        <Icon size={14} className="text-white" />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-medium leading-none">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   APPOINTMENT CARD
   ══════════════════════════════════════════════ */
function AppointmentCard({ appt, style }) {
  const theme = TYPE_THEME[appt.type] || TYPE_THEME.checkup;
  const statusDot = STATUS_STYLES[appt.status] || STATUS_STYLES.pending;
  const isSmall = appt.dur <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.03, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        absolute left-1.5 right-1.5 rounded-xl border-l-[4px] cursor-pointer overflow-hidden group
        shadow-sm ${theme.glow} hover:shadow-lg transition-shadow duration-300
        ${theme.bg} ${theme.border}
      `}
      style={style}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      <div className={`relative z-10 h-full flex flex-col justify-between ${isSmall ? 'px-2.5 py-1.5' : 'px-3 py-2.5'}`}>
        {/* Top Row */}
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <p className={`font-bold text-slate-800 truncate leading-tight ${isSmall ? 'text-[11px]' : 'text-[13px]'}`}>
              {appt.patient}
            </p>
            {!isSmall && (
              <p className={`text-[10px] font-semibold mt-0.5 truncate ${theme.text}`}>{appt.tx}</p>
            )}
          </div>
          {/* Avatar */}
          <div className={`${isSmall ? 'w-5 h-5 text-[8px]' : 'w-6 h-6 text-[9px]'} rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0`}>
            {appt.avatar}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-slate-400" />
            <span className="text-[10px] font-semibold text-slate-500">
              {startLabel(appt.start)} – {endTime(appt.start, appt.dur)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            <span className="text-[9px] font-bold text-slate-400 capitalize hidden group-hover:inline">{appt.status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   CURRENT TIME INDICATOR
   ══════════════════════════════════════════════ */
function NowIndicator() {
  const [top, setTop] = useState(0);
  useEffect(() => {
    function calc() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if (h < START_HOUR || h >= END_HOUR) { setTop(-999); return; }
      setTop(((h - START_HOUR) * 60 + m) * PX_PER_MIN);
    }
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);

  if (top < 0) return null;

  return (
    <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ top: `${top}px` }}>
      <div className="flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/40 -ml-1" />
        <div className="flex-1 h-[2px] bg-gradient-to-r from-red-500 to-red-500/0" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function AppointmentsPage() {
  const [view, setView] = useState('day');
  const totalSlots = (END_HOUR - START_HOUR) * 2 + 1;
  const gridH = totalSlots * SLOT_H;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col font-sans min-h-0"
    >
      {/* ═══════════ HEADER ═══════════ */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Schedule</h1>
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm shadow-primary-500/20">
              LIVE
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <CalendarIcon size={14} className="text-primary-500" />
            Wednesday, January 15, 2026
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Stats */}
          <StatPill icon={TrendingUp} label="Today" value="9 Appts" color="bg-primary-500" />
          <StatPill icon={Clock} label="Next" value="15 min" color="bg-amber-500" />

          {/* View Toggle */}
          <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl border border-slate-200/50">
            {['Day', 'Week', 'Month'].map(v => (
              <button
                key={v}
                onClick={() => setView(v.toLowerCase())}
                className={`
                  px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200
                  ${view === v.toLowerCase()
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-400 hover:text-slate-600'}
                `}
              >
                {v}
              </button>
            ))}
          </div>

          {/* New Appointment */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="h-10 px-5 flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow"
          >
            <Plus size={16} strokeWidth={3} /> New Appt
          </motion.button>
        </div>
      </header>

      {/* ═══════════ MAIN LAYOUT ═══════════ */}
      <div className="flex flex-1 gap-5 overflow-hidden min-h-0">

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="w-[260px] flex flex-col gap-4 shrink-0 overflow-y-auto hidden lg:flex pr-1 custom-scrollbar">
          <MiniCalendar />

          {/* Filters */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-lg shadow-slate-200/30">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Filter size={12} className="text-primary-500" /> Filters
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Confirmed', color: 'bg-emerald-500', checked: true },
                { label: 'Pending', color: 'bg-amber-400', checked: true },
                { label: 'Arrived', color: 'bg-blue-500', checked: true },
              ].map(f => (
                <label key={f.label} className="flex items-center gap-2.5 text-xs font-medium text-slate-600 cursor-pointer group">
                  <span className={`w-2 h-2 rounded-full ${f.color} group-hover:scale-125 transition-transform`} />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          {/* Waitlist */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-lg shadow-slate-200/30 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Zap size={12} className="text-amber-500" /> Waitlist
              </h4>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{WAITLIST.length}</span>
            </div>
            <div className="space-y-2.5 overflow-y-auto flex-1 custom-scrollbar">
              {WAITLIST.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-slate-700 group-hover:text-primary-700 transition-colors">{p.name}</p>
                    <span className={`w-2 h-2 rounded-full ${p.urgency === 'high' ? 'bg-red-500 animate-pulse' : p.urgency === 'medium' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 font-medium">{p.tx}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{p.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── SCHEDULE GRID ─── */}
        <main className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden min-w-0">

          {/* Provider Header */}
          <div className="flex shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white/80 backdrop-blur-md">
            {/* Time col header */}
            <div className="w-16 shrink-0 border-r border-slate-100 flex items-center justify-center py-3">
              <Clock size={14} className="text-slate-300" />
            </div>
            {/* Provider cols */}
            {PROVIDERS.map(prov => (
              <div key={prov.id} className="flex-1 p-3 flex items-center gap-3 min-w-[180px] border-r border-slate-50 last:border-0">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${prov.gradient} flex items-center justify-center text-white text-[11px] font-bold shadow-md ring-2 ${prov.ring}`}>
                  {prov.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-800 truncate">{prov.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">{prov.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Grid Body */}
          <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar relative">
            <div className="flex relative" style={{ height: `${gridH}px` }}>

              {/* Time Column */}
              <div className="w-16 shrink-0 border-r border-slate-100 relative bg-slate-50/30">
                {TIME_SLOTS.map((slot, i) => (
                  <div
                    key={i}
                    className="absolute w-full flex justify-end pr-2 items-start"
                    style={{ top: `${i * SLOT_H}px`, height: `${SLOT_H}px` }}
                  >
                    <span className={`text-[10px] font-semibold leading-none pt-1 ${slot.min === 0 ? 'text-slate-500' : 'text-slate-300'}`}>
                      {slot.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Provider Columns with Cards */}
              <div className="flex-1 flex relative">
                {/* Horizontal grid lines layer */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  {TIME_SLOTS.map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-full ${i % 2 === 0 ? 'border-b border-slate-100' : 'border-b border-slate-50'}`}
                      style={{ top: `${i * SLOT_H}px`, height: `${SLOT_H}px` }}
                    />
                  ))}
                </div>

                {/* Current time indicator */}
                <NowIndicator />

                {/* Column per provider */}
                {PROVIDERS.map((prov) => {
                  const colAppts = APPOINTMENTS.filter(a => a.providerId === prov.id);
                  return (
                    <div key={prov.id} className="flex-1 relative border-r border-slate-50 last:border-0" style={{ height: `${gridH}px` }}>
                      {colAppts.map(appt => {
                        const { top, height } = pos(appt.start, appt.dur);
                        return (
                          <AppointmentCard
                            key={appt.id}
                            appt={appt}
                            style={{ top: `${top}px`, height: `${Math.max(height - 4, 24)}px` }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
