import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  FileText,
  Activity,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  ArrowRight,
  UploadCloud,
  Pill,
  ShieldCheck,
  Plus
} from 'lucide-react';

/* ──────────────────────────────────────────
   MOCK DATA
   ────────────────────────────────────────── */
const PATIENT_DATA = {
  id: 'PT-1001',
  name: 'James Wilson',
  age: 34,
  gender: 'Male',
  phone: '+1 (555) 234-5678',
  email: 'james.wilson@email.com',
  address: '123 Maple Ave, Springfield',
  alerts: ['Penicillin Allergy', 'High Blood Pressure'],
  lastVisit: 'Oct 24, 2025',
  nextAppt: 'Mar 05, 2026',
  balance: 150.00,
  insurance: {
    provider: 'BlueCross BlueShield',
    plan: 'Gold PPO',
    limit: 2000,
    used: 1200
  },
  medications: [
    { name: 'Amoxicillin', dosage: '500mg', freq: '2x Daily', status: 'Active' },
    { name: 'Ibuprofen', dosage: '400mg', freq: 'Correction: As needed', status: 'Active' },
  ],
  scans: [
    { id: 1, type: 'X-Ray', date: 'Oct 24', thumb: 'bg-slate-200' },
    { id: 2, type: 'CT Scan', date: 'Jan 10', thumb: 'bg-slate-300' },
    { id: 3, type: 'Intraoral', date: 'May 12', thumb: 'bg-slate-200' },
    { id: 4, type: 'Pano', date: 'Jan 10', thumb: 'bg-slate-300' },
  ]
};

const TEETH_DATA = Array.from({ length: 32 }, (_, i) => {
  const id = i + 1;
  let status = 'healthy';
  let condition = null;

  // Mock conditions
  if ([3, 14, 19, 30].includes(id)) condition = 'cavity';
  if ([8, 9].includes(id)) condition = 'crown';
  if ([18].includes(id)) condition = 'root-canal';
  if ([1, 16, 17, 32].includes(id)) status = 'missing';

  return { id, status, condition };
});

const HISTORY_DATA = [
  { id: 1, date: 'Oct 24, 2025', title: 'Routine Checkup', doctor: 'Dr. Kennedy', type: 'checkup', note: 'Regular cleaning. No new cavities.' },
  { id: 2, date: 'May 12, 2025', title: 'Cavity Filling', doctor: 'Dr. Wong', type: 'surgery', note: 'Composite filling on Tooth #14.' },
  { id: 3, date: 'Jan 10, 2025', title: 'Root Canal Consult', doctor: 'Dr. Myers', type: 'consultation', note: 'X-rays taken for Tooth #18.' },
  { id: 4, date: 'Jan 10, 2025', title: 'X-Ray Series', doctor: 'Dr. Myers', type: 'xray', note: 'Full mouth series.' },
];

/* ──────────────────────────────────────────
   COMPONENTS
   ────────────────────────────────────────── */

/* ── Anatomical Tooth Shapes ── */
const TOOTH_PATHS = {
  incisor: "M9 2C6 2 5 6 5 10V18C5 20.2 6.8 22 9 22H15C17.2 22 19 20.2 19 18V10C19 6 18 2 15 2H9Z",
  canine: "M12 2C10 2 8 6 7 10V19C7 20.6 8.4 22 10 22H14C15.6 22 17 20.6 17 19V10C16 6 14 2 12 2Z",
  premolar: "M6 5C4 5 4 8 4 10V18C4 20.2 5.8 22 8 22H16C18.2 22 20 20.2 20 18V10C20 8 20 5 18 5C16 5 14 7 12 7C10 7 8 5 6 5Z",
  molar: "M4 4C2 4 2 7 2 9V18C2 20.2 3.8 22 6 22H18C20.2 22 22 20.2 22 18V9C22 7 22 4 20 4C17 4 15 6 12 6C9 6 7 4 4 4Z"
};

function getToothType(id) {
  if ([7, 8, 9, 10, 23, 24, 25, 26].includes(id)) return 'incisor';
  if ([6, 11, 22, 27].includes(id)) return 'canine';
  if ([4, 5, 12, 13, 20, 21, 28, 29].includes(id)) return 'premolar';
  return 'molar';
}

function Tooth({ data, isSelected, onClick }) {
  const { id, status, condition } = data;
  const type = getToothType(id);
  const path = TOOTH_PATHS[type];
  
  const isMissing  = status === 'missing';
  const isCavity   = condition === 'cavity';
  const isRootCanal = condition === 'root-canal';
  const isCrown    = condition === 'crown';

  // Sizing based on type for realistic proportions
  const widthClass = type === 'molar' ? 'w-11' : type === 'premolar' ? 'w-9' : 'w-7';

  // State colors
  let colorClass = 'text-slate-100'; // Healthy default (white-ish)
  if (isSelected) colorClass = 'text-primary-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]'; // Teal glow
  else if (isCavity) colorClass = 'text-red-400 drop-shadow-[0_0_3px_rgba(248,113,113,0.5)]'; // Red
  else if (isRootCanal) colorClass = 'text-amber-400'; // Yellow
  else if (isCrown) colorClass = 'text-blue-300';
  
  if (isMissing) return (
    <div className={`${widthClass} h-14 flex items-center justify-center opacity-20`}>
       <span className="text-xs font-bold text-slate-600">{id}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center group cursor-pointer" onClick={() => onClick(id)}>
      <motion.div
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`relative ${widthClass} h-14 transition-all duration-300 ${colorClass}`}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
           <path 
             d={path} 
             fill="currentColor" 
             stroke="rgba(0,0,0,0.2)" 
             strokeWidth="0.5"
             vectorEffect="non-scaling-stroke"
           />
           {/* Simple root visual hint based on type */}
           {type === 'molar' && <path d="M6 18 L4 26 M18 18 L20 26" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none" />}
           {(type === 'premolar' || type === 'canine') && <path d="M12 18 L12 28" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none" />}
        </svg>

        {/* Selection / Status Dot */}
        {isSelected && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-400 rounded-full shadow-sm" />}
      </motion.div>
      <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-primary-400' : 'text-slate-600 group-hover:text-slate-400'}`}>{id}</span>
    </div>
  );
}

function Odontogram() {
  const [selectedTeeth, setSelectedTeeth] = useState([14, 18]); // Pre-select some for demo

  const toggleTooth = (id) => {
    setSelectedTeeth(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const upperArch = TEETH_DATA.slice(0, 16);
  const lowerArch = TEETH_DATA.slice(16, 32).reverse();

  return (
    <div className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 relative overflow-hidden h-full flex flex-col">
       {/* Background Grid & Gradient */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
       <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/50" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Dental Chart <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-700">ADULT • 32</span>
            </h3>
            <p className="text-slate-400 text-sm mt-1">Interactive Mouth Map</p>
          </div>
          <div className="flex gap-4 text-[11px] font-medium text-slate-400 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-100" /> Healthy</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.5)]" /> Cavity</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400" /> Root Canal</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-400 shadow-[0_0_5px_rgba(45,212,191,0.5)]" /> Selected</div>
          </div>
        </div>

        {/* Teeth Arches */}
        <div className="flex-1 flex flex-col justify-center gap-10">
          {/* Upper Arch */}
          <div className="flex justify-center items-end gap-1 px-4">
            {upperArch.map(tooth => (
              <div key={tooth.id} className={tooth.id === 8 ? 'mr-6' : ''}>
                <Tooth data={tooth} isSelected={selectedTeeth.includes(tooth.id)} onClick={toggleTooth} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 opacity-30">
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent" />
             <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em] px-2">Midline</span>
             <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>

          {/* Lower Arch */}
          <div className="flex justify-center items-start gap-1 px-4">
            {lowerArch.map(tooth => (
              <div key={tooth.id} className={tooth.id === 24 ? 'mr-6' : ''}>
                 <Tooth data={tooth} isSelected={selectedTeeth.includes(tooth.id)} onClick={toggleTooth} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── X-Rays / Billing / Scripts Dashboard ── */
function ClinicalDashboard() {
  const { insurance, scans, medications } = PATIENT_DATA;
  const percentUsed = (insurance.used / insurance.limit) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. X-Rays & Media */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[15px] font-bold text-slate-800">Recent Scans</h3>
          <button className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
            <UploadCloud size={14} /> Upload
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 flex-1">
          {scans.map(scan => (
            <div key={scan.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200">
              <div className={`absolute inset-0 ${scan.thumb} opacity-80 group-hover:scale-110 transition-transform duration-500`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                   <ArrowRight size={16} />
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[11px] font-bold text-white">{scan.type}</p>
                <p className="text-[9px] text-white/80">{scan.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Insurance */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 transition-transform group-hover:scale-110 duration-700" />
         
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h3 className="text-[15px] font-bold text-slate-800">Insurance</h3>
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-100">
            <ShieldCheck size={12} /> Active
          </span>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
               <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{insurance.provider}</p>
              <p className="text-xs text-slate-500 font-medium">{insurance.plan}</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>Limit Used</span>
              <span>${insurance.used.toLocaleString()} / ${insurance.limit.toLocaleString()}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${percentUsed}%` }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-primary-500 rounded-full" 
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-right">Resets Jan 01, 2026</p>
          </div>
        </div>
      </div>

      {/* 3. Prescriptions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[15px] font-bold text-slate-800">Active Scripts</h3>
          <button className="text-slate-400 hover:text-primary-600 transition-colors">
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          {medications.map((med, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
               <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary-500 shrink-0">
                 <Pill size={18} />
               </div>
               <div>
                 <p className="text-[13px] font-bold text-slate-800">{med.name}</p>
                 <p className="text-[11px] text-slate-500 font-medium">{med.dosage} • {med.freq}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="relative">
          <textarea 
            placeholder="Add a quick note..." 
            className="w-full h-20 bg-slate-50 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 resize-none transition-all"
          />
          <button className="absolute bottom-2 right-2 text-xs bg-white text-slate-500 shadow-sm border border-slate-200 px-2 py-1 rounded-md font-bold hover:text-primary-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────── */
export default function PatientProfilePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-[1600px] mx-auto font-sans pb-10"
    >
      {/* ── Header Card ── */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-primary-50/40 to-transparent -z-0 pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row gap-8 items-start justify-between">
          <div className="flex gap-8 items-start">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-3xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner overflow-hidden border-4 border-white shadow-slate-200/50">
               {/* Use mock image or icon */}
               <User size={48} className="text-slate-300" />
            </div>
            
            {/* Info */}
            <div className="pt-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{PATIENT_DATA.name}</h1>
                <span className="bg-primary-50 text-primary-700 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border border-primary-100">
                  {PATIENT_DATA.id}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500 font-medium mb-5">
                <span className="flex items-center gap-2"><Calendar size={15} className="text-slate-400"/> {PATIENT_DATA.age} Years</span>
                <span className="flex items-center gap-2"><User size={15} className="text-slate-400"/> {PATIENT_DATA.gender}</span>
                <span className="flex items-center gap-2"><Phone size={15} className="text-slate-400"/> {PATIENT_DATA.phone}</span>
                <span className="flex items-center gap-2"><MapPin size={15} className="text-slate-400"/> {PATIENT_DATA.address}</span>
              </div>

              <div className="flex gap-2.5">
                {PATIENT_DATA.alerts.map(alert => (
                  <span key={alert} className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[11px] font-bold border border-red-100 shadow-sm">
                    <AlertCircle size={12} strokeWidth={2.5} />
                    {alert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="flex gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
            {[
              { label: 'Last Visit', val: PATIENT_DATA.lastVisit, icon: Calendar },
              { label: 'Next Appt', val: PATIENT_DATA.nextAppt, highlight: true, icon: Clock },
              { label: 'Balance', val: `$${PATIENT_DATA.balance}`, icon: FileText }
            ].map((stat, i) => (
              <div key={i} className="flex-1 min-w-[140px] xl:w-44 bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-center hover:bg-white hover:shadow-md transition-all group">
                <div className="flex justify-center mb-2 text-slate-400 group-hover:text-primary-500 transition-colors"><stat.icon size={20}/></div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-[17px] font-bold ${stat.highlight ? 'text-primary-600' : 'text-slate-700'}`}>{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col: Odontogram (2/3 width on large screens) */}
        <div className="xl:col-span-2 h-[540px]">
          <Odontogram />
        </div>

        {/* Right Col: Timeline (1/3 width) */}
        <div className="xl:col-span-1 h-[540px] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-[16px] font-bold text-slate-800 mb-6 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
              <Activity size={18} />
            </div>
            Treatment History
          </h3>

          <div className="relative pl-3 space-y-7 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {/* Timeline Line */}
            <div className="absolute left-[23px] top-2 bottom-0 w-[2px] bg-slate-100" />

            {HISTORY_DATA.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12 group"
              >
                {/* Timeline Dot */}
                <div className={`
                   absolute left-0 top-1 w-12 h-12 flex items-center justify-center translate-x-[-50%] z-10
                `}>
                   <div className={`
                     w-9 h-9 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm
                     ${item.type === 'surgery' ? 'bg-rose-100 text-rose-600' : 
                       item.type === 'checkup' ? 'bg-emerald-100 text-emerald-600' :
                       item.type === 'xray' ? 'bg-blue-100 text-blue-600' :
                       'bg-slate-100 text-slate-500'}
                   `}>
                      {item.type === 'surgery' ? <Stethoscope size={14} /> :
                       item.type === 'checkup' ? <CheckCircle2 size={14} /> :
                       item.type === 'xray' ? <FileText size={14} /> :
                       <Activity size={14} />}
                   </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group-hover:border-primary-100">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[13px] font-bold text-slate-800">{item.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">{item.date}</span>
                  </div>
                  <p className="text-[11px] text-primary-600 font-bold mb-1.5">{item.doctor}</p>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{item.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            View Full History <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Bottom Row: Clinical Dashboard ── */}
      <ClinicalDashboard />

    </motion.div>
  );
}
