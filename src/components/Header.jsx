import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  ChevronRight,
  X,
  LogOut,
  User,
  Settings,
} from 'lucide-react';

/* ── Page title map ── */
const pageTitles = {
  dashboard:  'Dashboard',
  patients:   'Patients',
  calendar:   'Calendar',
  messages:   'Messages',
  treatments: 'Treatments',
  settings:   'Settings',
};

export default function Header({ activePage, sidebarWidth }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef(null);
  const profileRef = useRef(null);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Auto-focus search input when opened */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <header
      id="top-header"
      className="glass sticky top-0 z-30 flex items-center justify-between h-[72px] px-8 transition-all duration-300"
      style={{ marginLeft: sidebarWidth }}
    >
      {/* ── Breadcrumbs ── */}
      <nav id="breadcrumbs" className="flex items-center gap-2 text-[15px]">
        <span className="text-slate-400 font-medium">
          {pageTitles[activePage] || 'Dashboard'}
        </span>
        <ChevronRight size={16} className="text-slate-300" />
        <span className="text-slate-700 font-semibold">Home</span>
      </nav>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 44, opacity: 0.5 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 44, opacity: 0.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="flex items-center h-11 bg-slate-100 rounded-full overflow-hidden"
              >
                <Search size={18} className="text-slate-400 ml-4 shrink-0" />
                <input
                  id="global-search-input"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search patients, treatments…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 h-full bg-transparent border-none outline-none text-[15px] text-slate-700 placeholder-slate-400 px-3"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="flex items-center justify-center w-9 h-9 mr-1 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                id="global-search-btn"
                onClick={() => setSearchOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2.5 h-11 px-5 bg-slate-100 rounded-full text-[15px] text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Search size={18} />
                <span className="hidden sm:inline">Search…</span>
                <kbd className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-white text-slate-400 rounded border border-slate-200 ml-2">
                  ⌘K
                </kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell */}
        <motion.button
          id="notification-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Bell size={22} className="text-slate-500" />
          {/* Red notification dot */}
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </motion.button>

        {/* Divider */}
        <div className="w-px h-9 bg-slate-200 mx-1" />

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <motion.button
            id="user-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 h-11 pl-1.5 pr-4 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
              DR
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-[15px] font-semibold text-slate-700 leading-tight">Dr. Sarah</span>
              <span className="text-[13px] text-slate-400 leading-tight">Orthodontist</span>
            </div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden z-50"
              >
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-[15px] font-semibold text-slate-800">Dr. Sarah Ahmed</p>
                  <p className="text-[13px] text-slate-400 mt-0.5">sarah@dentalcrm.com</p>
                </div>
                <div className="py-1.5">
                  <button className="flex items-center gap-3 w-full px-5 py-3 text-[15px] text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                    <User size={18} className="text-slate-400" />
                    My Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-5 py-3 text-[15px] text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Settings size={18} className="text-slate-400" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1.5">
                  <button className="flex items-center gap-3 w-full px-5 py-3 text-[15px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
