import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  FileText,
  ChevronDown,
  ShieldCheck,
  Receipt,
  Sparkles,
  User,
  CheckCircle2,
  Hash,
  Tag,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════ */
const PROCEDURES = [
  { id: 1,  name: 'Routine Cleaning',       code: 'D1110', price: 120,   cat: 'General' },
  { id: 2,  name: 'Comprehensive Exam',     code: 'D0150', price: 85,    cat: 'General' },
  { id: 3,  name: 'Dental X-Ray (Full)',     code: 'D0210', price: 150,   cat: 'General' },
  { id: 4,  name: 'Fluoride Treatment',      code: 'D1206', price: 45,    cat: 'General' },
  { id: 5,  name: 'Tooth Filling (Composite)', code: 'D2391', price: 225, cat: 'General' },
  { id: 6,  name: 'Zirconia Crown',          code: 'D2740', price: 1200,  cat: 'General' },
  { id: 7,  name: 'Braces (Full Treatment)', code: 'D8080', price: 5500,  cat: 'Orthodontics' },
  { id: 8,  name: 'Invisalign Aligner',      code: 'D8040', price: 4800,  cat: 'Orthodontics' },
  { id: 9,  name: 'Retainer (Hawley)',        code: 'D8680', price: 350,   cat: 'Orthodontics' },
  { id: 10, name: 'Bracket Replacement',     code: 'D8670', price: 75,    cat: 'Orthodontics' },
  { id: 11, name: 'Root Canal (Anterior)',   code: 'D3310', price: 950,   cat: 'Surgery' },
  { id: 12, name: 'Root Canal (Molar)',      code: 'D3330', price: 1350,  cat: 'Surgery' },
  { id: 13, name: 'Tooth Extraction',        code: 'D7140', price: 275,   cat: 'Surgery' },
  { id: 14, name: 'Wisdom Tooth Removal',    code: 'D7230', price: 450,   cat: 'Surgery' },
  { id: 15, name: 'Bone Graft',              code: 'D7953', price: 800,   cat: 'Surgery' },
  { id: 16, name: 'Teeth Whitening',         code: 'D9972', price: 550,   cat: 'Cosmetic' },
  { id: 17, name: 'Porcelain Veneer',        code: 'D2962', price: 1500,  cat: 'Cosmetic' },
  { id: 18, name: 'Dental Bonding',          code: 'D2330', price: 350,   cat: 'Cosmetic' },
  { id: 19, name: 'Gum Contouring',          code: 'D4210', price: 900,   cat: 'Cosmetic' },
];

const CATEGORIES = ['All', 'General', 'Orthodontics', 'Surgery', 'Cosmetic'];

const CAT_COLORS = {
  'All':           { bg: 'bg-slate-100',   text: 'text-slate-600',   active: 'bg-slate-800 text-white' },
  'General':       { bg: 'bg-emerald-50',  text: 'text-emerald-600', active: 'bg-emerald-600 text-white' },
  'Orthodontics':  { bg: 'bg-blue-50',     text: 'text-blue-600',    active: 'bg-blue-600 text-white' },
  'Surgery':       { bg: 'bg-rose-50',     text: 'text-rose-600',    active: 'bg-rose-600 text-white' },
  'Cosmetic':      { bg: 'bg-violet-50',   text: 'text-violet-600',  active: 'bg-violet-600 text-white' },
};

const PATIENTS_LIST = [
  { id: 1, name: 'James Wilson',    ins: 'BlueCross PPO' },
  { id: 2, name: 'Emma Thompson',   ins: 'Delta Dental' },
  { id: 3, name: 'Sophia Garcia',   ins: 'Cigna DHMO' },
];

const INSURANCE_RATE = 0.15; // 15% coverage mock

/* ══════════════════════════════════════════════
   PROCEDURE CARD
   ══════════════════════════════════════════════ */
function ProcedureCard({ proc, onAdd, inCart }) {
  const catColor = CAT_COLORS[proc.cat] || CAT_COLORS['General'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        group bg-white rounded-2xl p-4 border-2 transition-all duration-300 cursor-pointer relative overflow-hidden
        ${inCart
          ? 'border-primary-300 shadow-md shadow-primary-100/50'
          : 'border-slate-100 hover:border-primary-400 hover:shadow-lg shadow-sm'}
      `}
      onClick={() => onAdd(proc)}
    >
      {/* Added badge */}
      {inCart && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
        >
          <CheckCircle2 size={12} className="text-white" />
        </motion.div>
      )}

      {/* Top row: code + category */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 flex items-center gap-1">
          <Hash size={9} /> {proc.code}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${catColor.bg} ${catColor.text}`}>
          {proc.cat}
        </span>
      </div>

      {/* Name */}
      <h4 className="text-[14px] font-bold text-slate-800 mb-3 leading-snug group-hover:text-primary-700 transition-colors">
        {proc.name}
      </h4>

      {/* Footer: Price + Add */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-extrabold text-primary-600 tracking-tight">
          ${proc.price.toLocaleString()}
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onAdd(proc); }}
          className={`
            w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
            ${inCart
              ? 'bg-primary-100 text-primary-600'
              : 'bg-slate-100 text-slate-500 hover:bg-primary-500 hover:text-white hover:shadow-md hover:shadow-primary-500/25'}
          `}
        >
          <Plus size={16} strokeWidth={3} />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   INVOICE LINE ITEM
   ══════════════════════════════════════════════ */
function LineItem({ item, onQtyChange, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="flex items-center gap-3 py-3 border-b border-dashed border-slate-100 last:border-0 group"
    >
      {/* Name + Code */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-800 truncate">{item.name}</p>
        <p className="text-[10px] text-slate-400 font-semibold">{item.code}</p>
      </div>

      {/* Qty Stepper */}
      <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-100 px-1 py-0.5">
        <button
          onClick={() => onQtyChange(item.id, -1)}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="w-6 text-center text-xs font-bold text-slate-800">{item.qty}</span>
        <button
          onClick={() => onQtyChange(item.id, 1)}
          className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Price */}
      <span className="text-sm font-bold text-slate-800 w-20 text-right">
        ${(item.price * item.qty).toLocaleString()}
      </span>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════ */
export default function TreatmentsPage() {
  const [search, setSearch]             = useState('');
  const [activeCat, setActiveCat]       = useState('All');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS_LIST[0]);
  const [showPatientDd, setShowPatientDd] = useState(false);

  /* ── Filter procedures ── */
  const filtered = useMemo(() => {
    return PROCEDURES.filter(p => {
      const matchCat = activeCat === 'All' || p.cat === activeCat;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.code.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCat]);

  /* ── Add procedure to invoice ── */
  function addToInvoice(proc) {
    setInvoiceItems(prev => {
      const existing = prev.find(i => i.id === proc.id);
      if (existing) {
        return prev.map(i => i.id === proc.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...proc, qty: 1 }];
    });
  }

  /* ── Change qty ── */
  function changeQty(id, delta) {
    setInvoiceItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0)
    );
  }

  /* ── Remove item ── */
  function removeItem(id) {
    setInvoiceItems(prev => prev.filter(i => i.id !== id));
  }

  /* ── Totals ── */
  const subtotal  = invoiceItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const insurance = Math.round(subtotal * INSURANCE_RATE);
  const total     = subtotal - insurance;
  const cartIds   = new Set(invoiceItems.map(i => i.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col font-sans min-h-0"
    >
      {/* ═══════════ HEADER ═══════════ */}
      <header className="flex items-end justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Treatments & Billing</h1>
          <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
            <Receipt size={14} className="text-primary-500" />
            Select procedures and generate invoices instantly
          </p>
        </div>
      </header>

      {/* ═══════════ MAIN SPLIT ═══════════ */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">

        {/* ─────────────────────────────────────
             LEFT: PROCEDURE CATALOG (60%)
           ───────────────────────────────────── */}
        <section className="flex-[3] flex flex-col min-w-0 min-h-0">

          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Root Canal, Whitening, D2740..."
              className="w-full h-11 pl-11 pr-4 bg-white/70 backdrop-blur-xl border-2 border-slate-100 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all font-medium"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {CATEGORIES.map(cat => {
              const isActive = activeCat === cat;
              const colors = CAT_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
                    ${isActive
                      ? `${colors.active} shadow-md`
                      : `${colors.bg} ${colors.text} hover:shadow-sm`}
                  `}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1.5 opacity-60">
                      ({PROCEDURES.filter(p => p.cat === cat).length})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Procedures Grid */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <motion.div layout className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map(proc => (
                  <ProcedureCard
                    key={proc.id}
                    proc={proc}
                    onAdd={addToInvoice}
                    inCart={cartIds.has(proc.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search size={40} className="text-slate-200 mb-3" />
                <p className="text-sm font-bold text-slate-400">No procedures found</p>
                <p className="text-xs text-slate-400">Try a different search term or category</p>
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────
             RIGHT: INVOICE (40%)
           ───────────────────────────────────── */}
        <aside className="flex-[2] flex flex-col min-w-[340px] max-w-[480px]">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-full relative overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPHBhdGggZD0iTTAgMzBoNjAiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50 pointer-events-none" />

            {/* Invoice Header */}
            <div className="relative z-10 px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Invoice</h3>
                    <p className="text-[10px] text-slate-400 font-bold">#INV-1024</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  Jan 15, 2026
                </span>
              </div>

              {/* Patient Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowPatientDd(!showPatientDd)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-300 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-800">{selectedPatient.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{selectedPatient.ins}</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                <AnimatePresence>
                  {showPatientDd && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                    >
                      {PATIENTS_LIST.map(p => (
                        <button
                          key={p.id}
                          onClick={() => { setSelectedPatient(p); setShowPatientDd(false); }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {p.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.ins}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Line Items */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {invoiceItems.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                      <Sparkles size={28} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">No items yet</p>
                    <p className="text-xs text-slate-400 mt-1">Click <strong className="text-primary-500">+</strong> on a procedure to add it</p>
                  </motion.div>
                ) : (
                  invoiceItems.map(item => (
                    <LineItem
                      key={item.id}
                      item={item}
                      onQtyChange={changeQty}
                      onRemove={removeItem}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="relative z-10 px-6 pb-6 pt-3 border-t border-slate-100 bg-gradient-to-t from-slate-50/80 to-white/40 backdrop-blur-sm">
              {/* Subtotal */}
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400 font-medium">Subtotal</span>
                <span className="text-slate-600 font-semibold">${subtotal.toLocaleString()}</span>
              </div>
              {/* Insurance */}
              <div className="flex justify-between text-sm mb-3">
                <span className="text-emerald-500 font-medium flex items-center gap-1.5">
                  <ShieldCheck size={13} /> Insurance ({Math.round(INSURANCE_RATE * 100)}%)
                </span>
                <span className="text-emerald-600 font-semibold">-${insurance.toLocaleString()}</span>
              </div>
              {/* Divider */}
              <div className="border-t border-dashed border-slate-200 my-3" />
              {/* Grand Total */}
              <div className="flex justify-between items-end mb-5">
                <span className="text-sm font-bold text-slate-500">Grand Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-extrabold text-slate-900 tracking-tight"
                >
                  ${total.toLocaleString()}
                </motion.span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-shadow"
                >
                  <CreditCard size={16} /> Process Payment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 px-4 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <Printer size={16} /> Print
                </motion.button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
