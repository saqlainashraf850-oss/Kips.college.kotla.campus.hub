import React from 'react';
import { usePortal } from '../context/PortalContext';
import { GraduationCap, Phone, Mail, MapPin, Clock, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { db, setActiveView, setActiveLoginRole } = usePortal();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-sky-900/40 pt-14 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          {/* Column 1: College Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white font-black flex items-center justify-center overflow-hidden shadow-lg shadow-sky-500/20">
                {db.branding.logoUrl ? (
                  <img src={db.branding.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-black text-white text-base tracking-tight">{db.branding.title}</h3>
                <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">
                  Kotla Arab Ali Khan Campus
                </p>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Premier institution dedicated to academic excellence in Intermediate education (FSc Pre-Engineering, Pre-Medical, ICS & ICOM). Featuring specialized Mathematics masterclasses and digital card-based campus tracking on Bhimber Road.
            </p>
            
            <div className="flex items-center space-x-2 pt-1 text-[11px] text-sky-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Affiliated with BISE Gujranwala • Approved Campus</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-sky-300 transition">Campus Home</a></li>
              <li><a href="#about" className="hover:text-sky-300 transition">About College</a></li>
              <li><a href="#principal" className="hover:text-sky-300 transition">Principal's Desk</a></li>
              <li><a href="#faculty" className="hover:text-sky-300 transition">Faculty & Maths</a></li>
              <li><a href="#gallery" className="hover:text-sky-300 transition">Campus Gallery</a></li>
              <li><a href="#results-portal" className="hover:text-sky-300 transition">Online Results</a></li>
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#programs" className="hover:text-sky-300 transition">FSc Pre-Medical</a></li>
              <li><a href="#programs" className="hover:text-sky-300 transition">FSc Pre-Engineering</a></li>
              <li><a href="#programs" className="hover:text-sky-300 transition">ICS (Computer Science)</a></li>
              <li><a href="#programs" className="hover:text-sky-300 transition">ICOM (Commerce)</a></li>
              <li><a href="#admissions" className="hover:text-sky-300 transition">Entry Test Coaching</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Office Hours (Dynamic from Admin!) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">Contact & Office Hours</h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{db.contact.address}</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{db.contact.phone}</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{db.contact.email}</span>
              </p>
              <p className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>{db.contact.hours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Admin button */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {db.branding.title} Kotla Arab Ali Khan. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { setActiveLoginRole('admin'); setActiveView('login'); }}
              className="px-3 py-1 rounded-lg bg-sky-950 text-sky-400 hover:text-white border border-sky-800 transition font-bold"
            >
              Admin Portal
            </button>
            <span className="text-slate-800">•</span>
            <span className="flex items-center space-x-1">
              <span>Dedicated to Academic Excellence</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline ml-1" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
