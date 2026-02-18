import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  Calendar,
  Filter,
  Users,
  UserCheck,
  UserPlus
} from 'lucide-react';

/* ──────────────────────────────────────────
   Mock Patient Data
   ────────────────────────────────────────── */
const PATIENTS = [
  { id: 'PT-1001', name: 'James Wilson', phone: '+1 (555) 234-5678', email: 'james.wilson@email.com', age: 34, gender: 'M', lastVisit: '2025-10-24', nextAppt: '2026-03-05', nextApptConfirmed: true, status: 'Active', balance: 150.0, avatar: null },
  { id: 'PT-1002', name: 'Emily Chen', phone: '+1 (555) 876-1234', email: 'emily.chen@email.com', age: 28, gender: 'F', lastVisit: '2025-11-02', nextAppt: '2026-02-28', nextApptConfirmed: true, status: 'In Treatment', balance: 480.0, avatar: null },
  { id: 'PT-1003', name: 'Michael Brown', phone: '+1 (555) 345-9012', email: 'michael.b@email.com', age: 45, gender: 'M', lastVisit: '2025-09-18', nextAppt: '2026-03-12', nextApptConfirmed: false, status: 'Active', balance: 0, avatar: null },
  { id: 'PT-1004', name: 'Sarah Johnson', phone: '+1 (555) 789-4561', email: 'sarahj@email.com', age: 31, gender: 'F', lastVisit: '2025-12-05', nextAppt: '2026-02-20', nextApptConfirmed: true, status: 'Recovery', balance: 75.0, avatar: null },
  { id: 'PT-1005', name: 'David Martinez', phone: '+1 (555) 567-8901', email: 'david.m@email.com', age: 52, gender: 'M', lastVisit: '2025-08-30', nextAppt: null, nextApptConfirmed: false, status: 'Archived', balance: 0, avatar: null },
  { id: 'PT-1006', name: 'Aisha Khan', phone: '+1 (555) 123-7890', email: 'aisha.khan@email.com', age: 24, gender: 'F', lastVisit: '2026-01-15', nextAppt: '2026-03-01', nextApptConfirmed: true, status: 'Active', balance: 320.0, avatar: null },
  { id: 'PT-1007', name: 'Robert Taylor', phone: '+1 (555) 432-6543', email: 'rob.taylor@email.com', age: 61, gender: 'M', lastVisit: '2025-11-20', nextAppt: '2026-04-10', nextApptConfirmed: false, status: 'In Treatment', balance: 1250.0, avatar: null },
  { id: 'PT-1008', name: 'Lisa Park', phone: '+1 (555) 654-3210', email: 'lisa.park@email.com', age: 29, gender: 'F', lastVisit: '2026-02-01', nextAppt: '2026-02-22', nextApptConfirmed: true, status: 'Active', balance: 0, avatar: null },
  { id: 'PT-1009', name: 'Omar Hassan', phone: '+1 (555) 321-0987', email: 'omar.h@email.com', age: 38, gender: 'M', lastVisit: '2025-10-10', nextAppt: '2026-03-18', nextApptConfirmed: false, status: 'Recovery', balance: 200.0, avatar: null },
  { id: 'PT-1010', name: 'Catherine Lee', phone: '+1 (555) 210-8765', email: 'cat.lee@email.com', age: 42, gender: 'F', lastVisit: '2025-12-28', nextAppt: '2026-02-25', nextApptConfirmed: true, status: 'Active', balance: 90.0, avatar: null },
];

/* ──────────────────────────────────────────
   Helpers
   ────────────────────────────────────────── */
function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  'from-primary-400 to-primary-600',
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-emerald-400 to-emerald-600',
  'from-cyan-400 to-cyan-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
];

function avatarGradient(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount) {
  if (!amount || amount === 0) return '—';
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ── Status Badge config ── */
const STATUS_STYLES = {
  Active:        { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500', border: 'border-emerald-100' },
  'In Treatment': { bg: 'bg-blue-50',    text: 'text-blue-700',     dot: 'bg-blue-500',    border: 'border-blue-100' },
  Recovery:      { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500',   border: 'border-amber-100' },
  Archived:      { bg: 'bg-slate-50',    text: 'text-slate-500',    dot: 'bg-slate-400',   border: 'border-slate-100' },
};

/* ── Dropdown wrapper component ── */
function SelectDropdown({ id, value, onChange, options, icon: Icon }) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        {Icon && <Icon size={16} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />}
      </div>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          appearance-none h-11 rounded-xl border border-slate-200 bg-white
          text-[14px] text-slate-600 font-medium
          focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400
          transition-all duration-200 cursor-pointer shadow-sm hover:border-slate-300
          ${Icon ? 'pl-10 pr-10' : 'pl-4 pr-10'}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={14} className="text-slate-400" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 15 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } },
};

const ROWS_PER_PAGE = 8;

/* ──────────────────────────────────────────
   PatientsPage Component
   ────────────────────────────────────────── */
export default function PatientsPage({ onSelectPatient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastVisit');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionId, setOpenActionId] = useState(null);

  /* ── Filter + Sort logic ── */
  const filteredPatients = useMemo(() => {
    let list = [...PATIENTS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'balance':
          return b.balance - a.balance;
        case 'lastVisit':
        default:
          return new Date(b.lastVisit) - new Date(a.lastVisit);
      }
    });

    return list;
  }, [searchQuery, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ROWS_PER_PAGE));
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  /* Reset page on filter changes */
  function handleSearch(val) {
    setSearchQuery(val);
    setCurrentPage(1);
  }
  function handleStatusFilter(val) {
    setStatusFilter(val);
    setCurrentPage(1);
  }
  function handleSort(val) {
    setSortBy(val);
    setCurrentPage(1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8 font-sans"
    >
      {/* ════════════════════════════════════════
          Sticky Header
         ════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sticky top-0 z-30 py-3 bg-gray-100/80 backdrop-blur-md -mx-8 px-8 border-b border-transparent transition-all">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patient List</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your patients and their appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 mr-4 text-xs font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
             <span className="flex items-center gap-2"><Users size={14} className="text-primary-500"/> {filteredPatients.length} Total</span>
             <span className="w-px h-3 bg-slate-200" />
             <span className="flex items-center gap-2"><UserCheck size={14} className="text-emerald-500"/> {PATIENTS.filter(p => p.status === 'Active').length} Active</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 h-11 px-5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[14px] font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Download size={18} />
            Export
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px -6px rgba(13,148,136,0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[14px] font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Patient
          </motion.button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          Filter Bar
         ════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        {/* Search */}
        <div className="relative flex-1 w-full group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, phone, or ID…"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 focus:bg-white transition-all duration-200 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <SelectDropdown
            id="status-filter" value={statusFilter} onChange={handleStatusFilter} icon={Filter}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'In Treatment', label: 'In Treatment' },
              { value: 'Recovery', label: 'Recovery' },
            ]}
          />
          <SelectDropdown
            id="sort-by" value={sortBy} onChange={handleSort} icon={Calendar}
            options={[
              { value: 'lastVisit', label: 'Last Visit' },
              { value: 'name', label: 'Name' },
              { value: 'balance', label: 'Balance Due' },
            ]}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════
          Data Table
         ════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2.2fr_1.6fr_0.8fr_1fr_1.1fr_1fr_0.8fr_48px] gap-4 px-8 py-5 border-b border-slate-100 bg-slate-50/50">
          {['Patient Name', 'Contact', 'Age / Gender', 'Last Visit', 'Next Appt', 'Status', 'Balance', ''].map(
            (heading, i) => (
              <span key={i} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {heading}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-slate-50">
          {paginatedPatients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-lg font-bold text-slate-700">No patients found</p>
              <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                We couldn't find any patients matching your search. Try adjusting the filters.
              </p>
            </div>
          )}

          {paginatedPatients.map((patient) => {
            const statusStyle = STATUS_STYLES[patient.status] || STATUS_STYLES.Active;
            const globalIndex = PATIENTS.indexOf(patient);

            return (
              <motion.div
                key={patient.id}
                variants={rowVariants}
                onClick={() => onSelectPatient?.(patient.id)}
                className="grid grid-cols-[2.2fr_1.6fr_0.8fr_1fr_1.1fr_1fr_0.8fr_48px] gap-4 items-center px-8 py-5 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer group relative"
              >
                {/* Name + Avatar */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGradient(globalIndex)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    {getInitials(patient.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-slate-700 truncate group-hover:text-primary-700 transition-colors">
                      {patient.name}
                    </p>
                    <p className="text-[12px] text-slate-400 font-medium mt-0.5 tracking-wide">{patient.id}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 mb-1">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-slate-400 ">
                    <Mail size={14} className="text-slate-300 shrink-0" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                </div>

                {/* Age/Gender */}
                <span className="text-[14px] font-medium text-slate-600">
                  {patient.age} yrs <span className="text-slate-300 mx-1">/</span> {patient.gender}
                </span>

                {/* Last Visit */}
                <span className="text-[14px] font-medium text-slate-500">{formatDate(patient.lastVisit)}</span>

                {/* Next Appt */}
                <div className="flex items-center gap-2.5">
                  {patient.nextAppt ? (
                    <>
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${patient.nextApptConfirmed ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-amber-400 shadow-sm shadow-amber-200'}`} />
                      <span className="text-[14px] font-medium text-slate-600">{formatDate(patient.nextAppt)}</span>
                    </>
                  ) : <span className="text-slate-300 text-sm">—</span>}
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {patient.status}
                  </span>
                </div>

                {/* Balance */}
                <span className={`text-[14px] font-bold ${patient.balance > 0 ? 'text-slate-700' : 'text-slate-300'}`}>
                  {formatCurrency(patient.balance)}
                </span>

                {/* Action */}
                <div className="relative flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === patient.id ? null : patient.id); }}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white hover:shadow-sm hover:border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  <AnimatePresence>
                    {openActionId === patient.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 ring-1 ring-slate-900/5"
                      >
                         <button className="w-full text-left px-5 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors cursor-pointer border-b border-slate-50">View Profile</button>
                         <button className="w-full text-left px-5 py-3 text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors cursor-pointer">Edit Details</button>
                         <button className="w-full text-left px-5 py-3 text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer">Archive</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500">
            Showing <span className="font-bold text-slate-700">{(currentPage - 1) * ROWS_PER_PAGE + 1}-{Math.min(currentPage * ROWS_PER_PAGE, filteredPatients.length)}</span> of <span className="font-bold text-slate-700">{filteredPatients.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
               disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}
               className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page} onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${page === currentPage ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                {page}
              </button>
            ))}
            <button
               disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
               className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
