import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Paperclip,
  Smile,
  Send,
  ChevronRight,
  Clock,
  Calendar,
  Stethoscope,
  User,
  Star,
  Bell,
  MoreHorizontal,
  MapPin,
  FileText,
  Image as ImageIcon,
  CheckCheck,
  Circle,
  ArrowRight,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════ */
const CONVERSATIONS = [
  {
    id: 1,
    name: 'Emma Thompson',
    avatar: 'ET',
    gradient: 'from-rose-400 to-pink-500',
    channel: 'sms',
    lastMsg: 'Thank you so much! See you on the 24th 😊',
    time: '2m',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'James Wilson',
    avatar: 'JW',
    gradient: 'from-blue-400 to-indigo-500',
    channel: 'whatsapp',
    lastMsg: 'Is it normal to feel some pressure after the filling?',
    time: '10m',
    unread: 1,
    online: true,
  },
  {
    id: 3,
    name: 'Sophia Garcia',
    avatar: 'SG',
    gradient: 'from-amber-400 to-orange-500',
    channel: 'email',
    lastMsg: 'I need to reschedule my appointment for next week.',
    time: '1h',
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: 'Oliver Brown',
    avatar: 'OB',
    gradient: 'from-emerald-400 to-teal-500',
    channel: 'sms',
    lastMsg: 'Got it, I will bring the insurance card.',
    time: '3h',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: 'Ava Martinez',
    avatar: 'AM',
    gradient: 'from-violet-400 to-purple-500',
    channel: 'whatsapp',
    lastMsg: 'Can I eat normally after whitening?',
    time: '5h',
    unread: 0,
    online: true,
  },
  {
    id: 6,
    name: 'Liam Johnson',
    avatar: 'LJ',
    gradient: 'from-cyan-400 to-blue-500',
    channel: 'email',
    lastMsg: 'Please send me the post-op care instructions.',
    time: '1d',
    unread: 0,
    online: false,
  },
];

const MESSAGES_DATA = {
  1: [
    { id: 1, from: 'patient', text: 'Hi! I wanted to confirm my appointment for next week.', time: '9:30 AM' },
    { id: 2, from: 'clinic', text: 'Hello Emma! Yes, your appointment is confirmed for Oct 24th at 9:00 AM with Dr. Sarah Wilson.', time: '9:32 AM' },
    { id: 3, from: 'patient', text: 'Great! Should I bring anything specific?', time: '9:33 AM' },
    { id: 4, from: 'clinic', text: 'Please bring your insurance card and arrive 10 minutes early to fill out updated forms. Also, please don\'t eat or drink anything 2 hours before your appointment.', time: '9:35 AM' },
    { id: 5, from: 'patient', text: 'Perfect, I\'ll make sure to do that.', time: '9:36 AM' },
    { id: 6, from: 'clinic', text: 'Wonderful! If you have any other questions before your visit, don\'t hesitate to reach out. See you soon! 😊', time: '9:37 AM' },
    { id: 7, from: 'patient', text: 'Thank you so much! See you on the 24th 😊', time: '9:38 AM' },
  ],
  2: [
    { id: 1, from: 'patient', text: 'Hello, I had a filling done yesterday and I\'m feeling some sensitivity.', time: '11:20 AM' },
    { id: 2, from: 'clinic', text: 'Hi James! Some sensitivity after a filling is completely normal and should subside within a few days. Are you experiencing any sharp pain?', time: '11:25 AM' },
    { id: 3, from: 'patient', text: 'No sharp pain, just a dull ache when I bite down on that side.', time: '11:26 AM' },
    { id: 4, from: 'clinic', text: 'That\'s expected. Try to chew on the opposite side for a couple of days. If the sensitivity persists beyond a week, please call us and we\'ll do a quick check.', time: '11:28 AM' },
    { id: 5, from: 'patient', text: 'Is it normal to feel some pressure after the filling?', time: '11:30 AM' },
  ],
};

const PATIENT_CONTEXT = {
  1: {
    name: 'Emma Thompson',
    age: 28,
    phone: '+1 (555) 123-4567',
    email: 'emma.t@email.com',
    nextAppt: 'Oct 24, 09:00 AM',
    nextDoctor: 'Dr. Sarah Wilson',
    lastTreatment: 'Routine Cleaning',
    lastDate: 'Sep 15, 2025',
    insurance: 'Delta Dental — Gold',
    balance: '$0.00',
    notes: 'Prefers morning appointments. Very punctual.',
    tags: ['VIP', 'Orthodontics'],
  },
  2: {
    name: 'James Wilson',
    age: 34,
    phone: '+1 (555) 234-5678',
    email: 'james.w@email.com',
    nextAppt: 'Mar 05, 10:00 AM',
    nextDoctor: 'Dr. Mike Chen',
    lastTreatment: 'Composite Filling (#14)',
    lastDate: 'Jan 14, 2026',
    insurance: 'BlueCross PPO',
    balance: '$150.00',
    notes: 'Patient is anxious about needles. Use topical anesthetic first. Prefers TV during procedures.',
    tags: ['Anxiety', 'Follow-up'],
  },
};

const QUICK_REPLIES = [
  { label: 'Confirm Appt', text: 'Your appointment is confirmed! We look forward to seeing you.' },
  { label: 'Send Location', text: '📍 Our clinic is located at 456 Medical Plaza, Suite 200. Here\'s the Google Maps link: maps.google.com/...' },
  { label: 'Post-Op Care', text: '📋 Post-Op Instructions:\n• Avoid hot food/drinks for 2 hours\n• Take prescribed medication as directed\n• Apply ice if swelling occurs\n• Call us if pain persists beyond 48 hours' },
  { label: 'Reschedule', text: 'No problem! Let me check our available slots. What day works best for you?' },
  { label: 'Payment Info', text: 'You can make payments via card, bank transfer, or at the front desk. Would you like me to send a payment link?' },
];

/* ── Channel Icons ── */
const CHANNEL_ICON = {
  sms: { icon: Phone, color: 'text-blue-500' },
  whatsapp: { icon: MessageCircle, color: 'text-emerald-500' },
  email: { icon: Mail, color: 'text-violet-500' },
};

/* ══════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════ */

/* ── Conversation Item ── */
function ConvoItem({ convo, isActive, onClick }) {
  const Ch = CHANNEL_ICON[convo.channel];
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 group relative
        ${isActive
          ? 'bg-primary-50 border border-primary-100 shadow-sm'
          : 'hover:bg-slate-50 border border-transparent'}
      `}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${convo.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
          {convo.avatar}
        </div>
        {convo.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-[13px] font-bold truncate ${isActive ? 'text-primary-800' : 'text-slate-800'}`}>
            {convo.name}
          </span>
          <Ch.icon size={11} className={Ch.color} />
        </div>
        <p className="text-[11px] text-slate-500 truncate leading-snug font-medium">{convo.lastMsg}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10px] text-slate-400 font-semibold">{convo.time}</span>
        {convo.unread > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            {convo.unread}
          </span>
        )}
      </div>
    </button>
  );
}

/* ── Chat Bubble ── */
function Bubble({ msg, index }) {
  const isClinic = msg.from === 'clinic';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`flex ${isClinic ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`
          max-w-[75%] px-4 py-3 text-[13px] leading-relaxed relative group
          ${isClinic
            ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-2xl rounded-br-md shadow-md shadow-primary-500/15'
            : 'bg-white text-slate-700 rounded-2xl rounded-bl-md shadow-sm border border-slate-100'}
        `}
      >
        <p className="whitespace-pre-line">{msg.text}</p>
        <div className={`flex items-center gap-1 mt-1.5 ${isClinic ? 'justify-end' : ''}`}>
          <span className={`text-[10px] font-medium ${isClinic ? 'text-primary-200' : 'text-slate-400'}`}>
            {msg.time}
          </span>
          {isClinic && <CheckCheck size={12} className="text-primary-200" />}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MESSAGES PAGE
   ══════════════════════════════════════════════ */
export default function MessagesPage() {
  const [activeConvo, setActiveConvo] = useState(1);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(MESSAGES_DATA);
  const chatEndRef = useRef(null);

  const convo = CONVERSATIONS.find(c => c.id === activeConvo);
  const context = PATIENT_CONTEXT[activeConvo] || PATIENT_CONTEXT[1];
  const chat = messages[activeConvo] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.length, activeConvo]);

  /* ── Filter conversations ── */
  const filteredConvos = CONVERSATIONS.filter(c => {
    if (filter === 'unread' && c.unread === 0) return false;
    if (filter === 'urgent' && c.unread < 2) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  /* ── Send message ── */
  function handleSend() {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: 'clinic',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => ({
      ...prev,
      [activeConvo]: [...(prev[activeConvo] || []), newMsg],
    }));
    setInputText('');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex font-sans rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl"
    >
      {/* ═══════════════════════════════════
           LEFT: INBOX LIST (25%)
         ═══════════════════════════════════ */}
      <aside className="w-[280px] shrink-0 border-r border-slate-100 flex-col bg-slate-50/50 hidden lg:flex">
        {/* Header */}
        <div className="p-4 pb-3 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Inbox</h2>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                <Bell size={16} />
              </button>
              <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-100">
            {['all', 'unread', 'urgent'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${filter === f
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 custom-scrollbar">
          {filteredConvos.map(c => (
            <ConvoItem
              key={c.id}
              convo={c}
              isActive={c.id === activeConvo}
              onClick={() => setActiveConvo(c.id)}
            />
          ))}
          {filteredConvos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageCircle size={32} className="text-slate-200 mb-2" />
              <p className="text-xs font-bold text-slate-400">No conversations</p>
            </div>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════════
           CENTER: CHAT WINDOW (50%)
         ═══════════════════════════════════ */}
      <section className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${convo?.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
              {convo?.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{convo?.name}</span>
                {convo?.online && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                    <Circle size={6} fill="currentColor" /> Online
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {convo?.channel === 'sms' ? 'via SMS' : convo?.channel === 'whatsapp' ? 'via WhatsApp' : 'via Email'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"><Phone size={15} /></button>
            <button className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"><Video size={15} /></button>
            <button className="w-8 h-8 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"><MoreHorizontal size={15} /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50/30 custom-scrollbar">
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-5">
            <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">Today</span>
          </div>

          <AnimatePresence>
            {chat.map((msg, i) => (
              <Bubble key={msg.id} msg={msg} index={i} />
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-5 pt-3 flex gap-2 flex-wrap shrink-0">
          {QUICK_REPLIES.map(qr => (
            <button
              key={qr.label}
              onClick={() => setInputText(qr.text)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-700 text-slate-600 rounded-full text-[11px] font-bold border border-slate-200 hover:border-primary-200 transition-all"
            >
              {qr.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 rounded-2xl border border-slate-200 p-2 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors shrink-0">
              <Paperclip size={16} />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors shrink-0">
              <ImageIcon size={16} />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none py-2 max-h-24"
            />
            <button className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors shrink-0">
              <Smile size={16} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${inputText.trim()
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-slate-100 text-slate-300'
                }`}
            >
              <Send size={15} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
           RIGHT: CONTEXT PANEL (25%)
         ═══════════════════════════════════ */}
      <aside className="w-[280px] shrink-0 border-l border-slate-100 flex-col bg-slate-50/30 overflow-y-auto custom-scrollbar hidden xl:flex">
        {/* Patient Mini Profile */}
        <div className="p-5 pb-4 text-center border-b border-slate-100">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${convo?.gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg mx-auto mb-3`}>
            {convo?.avatar}
          </div>
          <h3 className="text-[15px] font-extrabold text-slate-800">{context.name}</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{context.age} years • {context.phone}</p>
          <div className="flex justify-center gap-1.5 mt-3">
            {context.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-full border border-primary-100">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="p-4 space-y-3 flex-1">
          {/* Next Appointment */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                <Calendar size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Next Appt</span>
            </div>
            <p className="text-sm font-bold text-slate-800">{context.nextAppt}</p>
            <p className="text-[11px] text-slate-500 font-medium">{context.nextDoctor}</p>
          </div>

          {/* Last Treatment */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Stethoscope size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Treatment</span>
            </div>
            <p className="text-sm font-bold text-slate-800">{context.lastTreatment}</p>
            <p className="text-[11px] text-slate-500 font-medium">{context.lastDate}</p>
          </div>

          {/* Insurance & Balance */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileText size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Billing</span>
            </div>
            <p className="text-[12px] font-bold text-slate-800">{context.insurance}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[11px] text-slate-500">Outstanding</span>
              <span className={`text-[12px] font-bold ${context.balance === '$0.00' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {context.balance}
              </span>
            </div>
          </div>

          {/* Staff Notes */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Star size={14} />
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Staff Notes</span>
            </div>
            <textarea
              defaultValue={context.notes}
              placeholder="Add internal notes..."
              className="w-full text-[12px] text-slate-700 bg-slate-50 rounded-lg border border-slate-100 p-2.5 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all placeholder-slate-400 leading-relaxed"
            />
          </div>

          {/* View Full Profile Button */}
          <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 text-[11px] font-bold hover:bg-white hover:border-primary-200 hover:text-primary-600 transition-all flex items-center justify-center gap-1.5">
            View Full Profile <ArrowRight size={12} />
          </button>
        </div>
      </aside>
    </motion.div>
  );
}
