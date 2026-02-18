import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import PatientProfilePage from './pages/PatientProfilePage';
import AppointmentsPage from './pages/AppointmentsPage';
import TreatmentsPage from './pages/TreatmentsPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import DoctorsPage from './pages/DoctorsPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  function handleSelectPatient(patientId) {
    setSelectedPatientId(patientId);
    setActivePage('patient-profile');
  }

  /* ═══════════════════════════════════
     LANDING PAGE — Full-screen, no sidebar
     ═══════════════════════════════════ */
  if (activePage === 'landing') {
    return <LandingPage onNavigate={setActivePage} />;
  }

  /* ═══════════════════════════════════
     DASHBOARD LAYOUT — Sidebar + Main
     ═══════════════════════════════════ */
  return (
    <div className="bg-gray-100" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* ── SIDEBAR — Rigid 240px, never shrinks ── */}
      <aside className="bg-white border-r border-gray-200 flex flex-col" style={{ width: '240px', flexShrink: 0, height: '100%', overflowY: 'auto' }}>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      </aside>

      {/* ── MAIN CONTENT — Takes ALL remaining space, scrollable ── */}
      <main className="" style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '32px', paddingBottom: '30px' }}>
        <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
          {(activePage === 'dashboard' || activePage === 'dashboard2') && (
            <DashboardPage />
          )}

          {activePage === 'patients' && (
            <PatientsPage onSelectPatient={handleSelectPatient} />
          )}

          {(activePage === 'patient-profile' || activePage === 'profile') && (
            <PatientProfilePage />
          )}

          {activePage === 'calendar' && (
            <AppointmentsPage />
          )}

          {activePage === 'treatments' && (
            <TreatmentsPage />
          )}

          {activePage === 'messages' && (
            <MessagesPage />
          )}

          {activePage === 'settings' && (
            <SettingsPage />
          )}

          {(activePage === 'doctors' || activePage === 'cards') && (
            <DoctorsPage />
          )}

          {activePage !== 'dashboard' &&
            activePage !== 'dashboard2' &&
            activePage !== 'patients' &&
            activePage !== 'profile' &&
            activePage !== 'patient-profile' &&
            activePage !== 'calendar' &&
            activePage !== 'treatments' &&
            activePage !== 'messages' &&
            activePage !== 'settings' &&
            activePage !== 'doctors' &&
            activePage !== 'cards' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center justify-center h-[60vh] text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center mb-5">
                  <span className="text-4xl">🦷</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2 capitalize">
                  {activePage.replace('-', ' ')}
                </h2>
                <p className="text-sm text-slate-400 max-w-md">
                  This page is under construction. We're building something beautiful — stay tuned!
                </p>
              </motion.div>
            )}
        </div>
      </main>
    </div>
  );
}
