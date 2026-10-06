import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Search, X, BookOpen, GraduationCap, Bell, ArrowRight, Layers, FileText } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { db, setActiveView, setActiveLoginRole } = usePortal();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Programs' | 'Faculty' | 'Announcements'>('All');

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  // Programs
  const programs = [
    { title: "FSc Pre-Medical", type: "Program", duration: "2 Years", desc: "Biology, Chemistry, Physics" },
    { title: "FSc Pre-Engineering", type: "Program", duration: "2 Years", desc: "Mathematics, Physics, Chemistry" },
    { title: "ICS (Computer Science)", type: "Program", duration: "2 Years", desc: "Computer, Maths, Physics" },
    { title: "ICOM (Commerce)", type: "Program", duration: "2 Years", desc: "Commerce, Math, Economics" },
  ].filter(p => !cleanQ || p.title.toLowerCase().includes(cleanQ) || p.desc.toLowerCase().includes(cleanQ));

  // Faculty
  const faculty = db.teachers.filter(
    t => !cleanQ || t.name.toLowerCase().includes(cleanQ) || t.subject.toLowerCase().includes(cleanQ)
  );

  // Announcements
  const announcements = db.announcements.filter(
    a => !cleanQ || a.title.toLowerCase().includes(cleanQ) || a.desc.toLowerCase().includes(cleanQ)
  );

  const totalResults = programs.length + faculty.length + announcements.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sky-200 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar animate-fade-in text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-sky-700 font-bold text-sm">
            <Search className="w-5 h-5 text-sky-600" />
            <span>Search Campus Portal</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search (e.g. Science, Mathematics, Admissions, Faculty)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-sky-200 bg-sky-50/50 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-3.5" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 text-xs font-bold overflow-x-auto pb-1">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-full transition ${
              filterType === 'All' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({totalResults})
          </button>
          <button
            onClick={() => setFilterType('Programs')}
            className={`px-3 py-1.5 rounded-full transition ${
              filterType === 'Programs' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Programs ({programs.length})
          </button>
          <button
            onClick={() => setFilterType('Faculty')}
            className={`px-3 py-1.5 rounded-full transition ${
              filterType === 'Faculty' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Faculty ({faculty.length})
          </button>
          <button
            onClick={() => setFilterType('Announcements')}
            className={`px-3 py-1.5 rounded-full transition ${
              filterType === 'Announcements' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Announcements ({announcements.length})
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-2.5 pt-2">
          {totalResults === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching records found for "{query}". Try searching "Mathematics", "Medical", or "Admissions".
            </div>
          ) : (
            <>
              {(filterType === 'All' || filterType === 'Programs') && programs.map((p, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('programs');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-white hover:bg-sky-50 rounded-2xl border border-slate-100 hover:border-sky-300 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{p.title}</h4>
                      <p className="text-[10px] text-slate-500">{p.desc} • {p.duration}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-600">Program →</span>
                </div>
              ))}

              {(filterType === 'All' || filterType === 'Faculty') && faculty.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('faculty');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-white hover:bg-sky-50 rounded-2xl border border-slate-100 hover:border-sky-300 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img src={t.photo} alt={t.name} className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                      <p className="text-[10px] text-sky-600">{t.subject}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600">Faculty →</span>
                </div>
              ))}

              {(filterType === 'All' || filterType === 'Announcements') && announcements.map((a) => (
                <div
                  key={a.id}
                  onClick={() => {
                    onClose();
                    const el = document.getElementById('notices');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3 bg-white hover:bg-sky-50 rounded-2xl border border-slate-100 hover:border-sky-300 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 truncate max-w-xs">{a.title}</h4>
                      <p className="text-[10px] text-slate-400">{a.date} • {a.priority}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600">Notice →</span>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
