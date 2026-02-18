import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Phone,
  MapPin,
  Upload,
  Clock,
  Users,
  CreditCard,
  Bell,
  Settings as SettingsIcon,
  Palette,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Sun,
  Moon,
  Monitor,
  Mail,
  MessageSquare,
  FileText,
  Shield,
  Globe,
  ChevronDown,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════ */
const TABS = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'services', label: 'Services', icon: FileText },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_HOURS = DAYS.map((day, i) => ({
  day,
  open: i < 5 ? '09:00 AM' : '10:00 AM',
  close: i < 5 ? '05:00 PM' : '02:00 PM',
  closed: i >= 6, // Sunday closed
}));

const TIME_OPTIONS = [
  '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
  '07:00 PM', '07:30 PM', '08:00 PM',
];

const STAFF_MEMBERS = [
  { id: 1, name: 'Dr. Sarah Wilson', role: 'Orthodontist', status: 'active', avatar: 'SW', gradient: 'from-rose-500 to-pink-600', email: 'sarah@dentalcare.com' },
  { id: 2, name: 'Dr. Mike Chen', role: 'General Dentist', status: 'active', avatar: 'MC', gradient: 'from-blue-500 to-indigo-600', email: 'mike@dentalcare.com' },
  { id: 3, name: 'Jessica Lee', role: 'Hygienist', status: 'active', avatar: 'JL', gradient: 'from-emerald-500 to-teal-600', email: 'jessica@dentalcare.com' },
  { id: 4, name: 'Dr. Kerri Myers', role: 'Endodontist', status: 'active', avatar: 'KM', gradient: 'from-violet-500 to-purple-600', email: 'kerri@dentalcare.com' },
  { id: 5, name: 'Lisa Park', role: 'Receptionist', status: 'inactive', avatar: 'LP', gradient: 'from-slate-400 to-slate-500', email: 'lisa@dentalcare.com' },
];

const BRAND_COLORS = [
  '#0d9488', '#0891b2', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#475569',
];

/* ══════════════════════════════════════════════
   REUSABLE COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Toggle Switch ── */
function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between py-3 cursor-pointer group">
      <div className="flex-1 mr-4">
        <p className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{label}</p>
        {description && <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-all duration-300 shrink-0
          ${checked
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-md shadow-primary-500/25'
            : 'bg-slate-200'}
        `}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </label>
  );
}

/* ── Input Field ── */
function InputField({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 ${Icon ? 'pl-10' : 'pl-4'} pr-4 bg-white rounded-xl border-2 border-slate-100 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all font-medium`}
        />
      </div>
    </div>
  );
}

/* ── Section Card ── */
function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-5">
      <div className="mb-5">
        <h3 className="text-[15px] font-extrabold text-slate-800">{title}</h3>
        {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB: GENERAL
   ══════════════════════════════════════════════ */
function GeneralTab() {
  const [clinicName, setClinicName] = useState('DentalCare Clinic');
  const [phone, setPhone] = useState('+1 (555) 000-1234');
  const [address, setAddress] = useState('456 Medical Plaza, Suite 200, Springfield');
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [brandColor, setBrandColor] = useState('#0d9488');

  function updateHour(index, field, value) {
    setHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Clinic Info */}
      <Section title="Clinic Information" description="Basic details about your practice">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Clinic Name" icon={Building2} value={clinicName} onChange={setClinicName} placeholder="Enter clinic name" />
          <InputField label="Phone Number" icon={Phone} value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="mt-4">
          <InputField label="Address" icon={MapPin} value={address} onChange={setAddress} placeholder="Full clinic address" />
        </div>
      </Section>

      {/* Branding */}
      <Section title="Branding" description="Customize your clinic's visual identity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Clinic Logo</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl h-36 flex flex-col items-center justify-center hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center mb-2 transition-colors">
                <Upload size={20} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <p className="text-xs font-bold text-slate-500 group-hover:text-primary-600 transition-colors">Drop logo here or click to upload</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PNG, SVG up to 2MB</p>
            </div>
          </div>

          {/* Brand Color */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Brand Color</label>
            <div className="flex flex-wrap gap-2.5 mb-3">
              {BRAND_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setBrandColor(color)}
                  className={`w-9 h-9 rounded-xl transition-all duration-200 ${brandColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-8 rounded-lg border border-slate-200" style={{ backgroundColor: brandColor }} />
              <span className="text-xs font-mono font-bold text-slate-500">{brandColor}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Operating Hours */}
      <Section title="Operating Hours" description="Set your weekly schedule">
        <div className="space-y-2">
          {hours.map((h, i) => (
            <div key={h.day} className={`flex items-center gap-4 py-2.5 px-4 rounded-xl transition-all flex-wrap ${h.closed ? 'bg-slate-50 opacity-60' : 'hover:bg-slate-50'}`}>
              <span className="w-24 text-[13px] font-bold text-slate-700">{h.day}</span>

              <select
                value={h.open}
                onChange={(e) => updateHour(i, 'open', e.target.value)}
                disabled={h.closed}
                className="h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-primary-400 disabled:opacity-40 transition-all"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <span className="text-xs text-slate-400 font-bold">to</span>

              <select
                value={h.close}
                onChange={(e) => updateHour(i, 'close', e.target.value)}
                disabled={h.closed}
                className="h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-primary-400 disabled:opacity-40 transition-all"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">{h.closed ? 'Closed' : 'Open'}</span>
                <Toggle checked={!h.closed} onChange={(val) => updateHour(i, 'closed', !val)} />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   TAB: STAFF
   ══════════════════════════════════════════════ */
function StaffTab() {
  const [staff, setStaff] = useState(STAFF_MEMBERS);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');

  function removeStaff(id) {
    setStaff(prev => prev.filter(s => s.id !== id));
  }

  function addStaff() {
    if (!newName.trim() || !newRole.trim()) return;
    const initials = newName.split(' ').map(n => n[0]).join('').toUpperCase();
    const gradients = ['from-cyan-500 to-blue-600', 'from-amber-500 to-orange-600', 'from-fuchsia-500 to-pink-600'];
    setStaff(prev => [...prev, {
      id: Date.now(),
      name: newName,
      role: newRole,
      status: 'active',
      avatar: initials.slice(0, 2),
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      email: newEmail || `${newName.toLowerCase().replace(/\s/g, '.')}@dentalcare.com`,
    }]);
    setNewName(''); setNewRole(''); setNewEmail('');
    setShowModal(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Section title="Team Members" description="Manage your clinic's staff and providers">
        {/* Actions */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-xs text-slate-400 font-medium">{staff.length} members</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="h-9 px-4 flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20 hover:shadow-primary-500/30 transition-shadow"
          >
            <Plus size={14} strokeWidth={3} /> Add Staff
          </motion.button>
        </div>

        {/* Staff List */}
        <div className="space-y-2">
          {staff.map((member, i) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group bg-white"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-800">{member.name}</p>
                <p className="text-[11px] text-slate-400 font-medium">{member.role} • {member.email}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${member.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                {member.status}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => removeStaff(member.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-slate-800">Add Staff Member</h3>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <InputField label="Full Name" value={newName} onChange={setNewName} placeholder="Dr. John Doe" />
                <InputField label="Role" value={newRole} onChange={setNewRole} placeholder="Orthodontist" />
                <InputField label="Email" icon={Mail} value={newEmail} onChange={setNewEmail} placeholder="john@dentalcare.com" />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 h-11 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={addStaff}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold shadow-md shadow-primary-500/20 flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Add Member
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   TAB: NOTIFICATIONS (System Preferences)
   ══════════════════════════════════════════════ */
function NotificationsTab() {
  const [theme, setTheme] = useState('light');
  const [emailRemind, setEmailRemind] = useState(true);
  const [smsConfirm, setSmsConfirm] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [apptReminder, setApptReminder] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Theme */}
      <Section title="Appearance" description="Choose your preferred theme">
        <div className="flex gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`
                flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-200
                ${theme === opt.id
                  ? 'border-primary-400 bg-primary-50 shadow-md shadow-primary-100/50'
                  : 'border-slate-100 hover:border-slate-200 bg-white'}
              `}
            >
              <opt.icon size={22} className={theme === opt.id ? 'text-primary-600' : 'text-slate-400'} />
              <span className={`text-xs font-bold ${theme === opt.id ? 'text-primary-700' : 'text-slate-500'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Notification Toggles */}
      <Section title="Notifications" description="Configure how you and your patients receive alerts">
        <div className="divide-y divide-slate-50">
          <Toggle checked={emailRemind} onChange={setEmailRemind} label="Email Reminders to Patients" description="Send appointment reminders 24h before via email" />
          <Toggle checked={smsConfirm} onChange={setSmsConfirm} label="SMS Confirmations" description="Auto-send SMS when an appointment is booked or changed" />
          <Toggle checked={dailySummary} onChange={setDailySummary} label="Daily Summary Report" description="Receive a daily digest of appointments, revenue, and tasks" />
          <Toggle checked={apptReminder} onChange={setApptReminder} label="Staff Appointment Alerts" description="Notify providers 15 minutes before their next patient" />
          <Toggle checked={marketingEmail} onChange={setMarketingEmail} label="Marketing Emails" description="Send promotional offers and newsletters to patients" />
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" description="Account security preferences">
        <div className="divide-y divide-slate-50">
          <Toggle checked={true} onChange={() => { }} label="Two-Factor Authentication" description="Require 2FA for all admin accounts" />
          <Toggle checked={true} onChange={() => { }} label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" />
        </div>
      </Section>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   PLACEHOLDER TABS
   ══════════════════════════════════════════════ */
function PlaceholderTab({ name }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
        <SettingsIcon size={28} className="text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-400 mb-1">{name} Settings</h3>
      <p className="text-sm text-slate-400">This section is coming soon</p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1100px] mx-auto font-sans"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Clinic Settings</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">Manage your clinic configuration and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
              `}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'general' && <GeneralTab key="general" />}
        {activeTab === 'staff' && <StaffTab key="staff" />}
        {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
        {activeTab === 'services' && <PlaceholderTab key="services" name="Services" />}
        {activeTab === 'billing' && <PlaceholderTab key="billing" name="Billing" />}
      </AnimatePresence>

      {/* Save Bar */}
      <div className="sticky bottom-4 mt-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl p-4 flex items-center justify-between">
          <p className="text-xs text-slate-400 font-medium">Changes are saved automatically</p>
          <div className="flex gap-3">
            <button className="h-10 px-5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
              Discard
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-10 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 flex items-center gap-2"
            >
              <Check size={15} /> Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
