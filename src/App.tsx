/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { LoginView } from './components/LoginView';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { ParticleBackground } from './components/ParticleBackground';
import { SearchModal } from './components/SearchModal';

const MainAppContent: React.FC = () => {
  const { activeView } = usePortal();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/70 text-slate-900 selection:bg-sky-500 selection:text-white relative">
      <ParticleBackground />
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 relative z-10">
        {activeView === 'public' && <PublicHome />}
        {activeView === 'login' && <LoginView />}
        {activeView === 'student' && <StudentPortal />}
        {activeView === 'teacher' && <TeacherPortal />}
        {activeView === 'admin' && <AdminPortal />}
      </main>

      <Footer />

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <PortalProvider>
      <MainAppContent />
    </PortalProvider>
  );
}
