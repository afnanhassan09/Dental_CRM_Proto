import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Stethoscope,
  UserCircle,
  Grid3x3,
  CreditCard,
  UserPlus,
  PhoneCall,
  MessageSquare,
  Settings,
} from 'lucide-react';

/* ── Tooth Logo (SVG) ── */
function ToothIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C9.5 2 7.5 3 6.5 5C5.5 7 5 9 5 11C5 13 5.5 15 6 17C6.5 19 7 21 8.5 22C9.5 22.5 10.5 20 11 18C11.5 16 12 15 12 15C12 15 12.5 16 13 18C13.5 20 14.5 22.5 15.5 22C17 21 17.5 19 18 17C18.5 15 19 13 19 11C19 9 18.5 7 17.5 5C16.5 3 14.5 2 12 2Z" />
    </svg>
  );
}

/* ── Navigation Items ── */
const navItems = [
  { id: 'dashboard2', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'My Patients', icon: Users },
  { id: 'calendar', label: 'Appointments', icon: CalendarDays },
  { id: 'treatments', label: 'Treatments', icon: Stethoscope },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'profile', label: 'Patient Profile', icon: UserCircle },
  { id: 'doctors', label: 'Doctors', icon: Grid3x3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    /* 
     * This component renders INSIDE the <aside> in App.jsx.
     * It fills the full height via flex-1 and uses flex-col 
     * so the Emergency button can be pushed to the bottom with mt-auto.
     */
    <div className="flex flex-col h-full">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-6 h-14 shrink-0 border-b border-gray-100" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center">
          <ToothIcon size={18} />
        </div>
        <span className="text-[15px] font-bold text-slate-800">DentalCare</span>
      </div>

      {/* ── User Profile ── */}
      <div className="flex flex-col items-center py-5 px-6 border-b border-gray-100 shrink-0" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-lg font-bold mb-2 shadow-md">
          BH
        </div>
        <p className="text-sm font-bold text-slate-800">Britney Hardin</p>
        <p className="text-xs text-slate-400">Department Admin</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-6 space-y-1" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`
                relative flex items-center gap-3.5 w-full h-10 px-3.5 rounded-xl text-[14px] font-medium
                transition-all duration-200 cursor-pointer group
                ${isActive
                  ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute left-0 top-2 bottom-2 w-[4px] rounded-r-full bg-primary-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={18} className={`transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Emergency Contact ── */}
      <div className="mt-auto px-6 pb-6 shrink-0" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <button className="flex items-center justify-center gap-2.5 w-full h-11 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-[13px] font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
          <PhoneCall size={16} />
          <span>Emergency Contact</span>
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2 font-medium tracking-wide">24/7 Support Line</p>
      </div>
    </div>
  );
}
