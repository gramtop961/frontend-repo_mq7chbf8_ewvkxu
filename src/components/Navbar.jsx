import React from 'react';
import { Home, Layers, Users, GraduationCap } from 'lucide-react';

const tabs = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'classes', label: 'Kelas', icon: Layers },
  { key: 'students', label: 'Siswa', icon: Users },
  { key: 'grades', label: 'Nilai Siswa', icon: GraduationCap },
];

export default function Navbar({ current, onChange }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-emerald-900/60 border-b border-emerald-700/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 shadow-inner shadow-emerald-900/40 grid place-items-center text-white font-bold">A</div>
          <div>
            <h1 className="text-white font-semibold leading-tight">ABSENSI SISWA MAS AL-WASHLIYAH NAGUR</h1>
            <p className="text-emerald-100/80 text-xs">Sistem sederhana untuk kelola siswa, kelas, dan nilai</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                current === key
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>
      <div className="md:hidden border-t border-emerald-800/40">
        <div className="max-w-6xl mx-auto px-4 py-2 grid grid-cols-4 gap-2">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                current === key
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-emerald-100 hover:bg-emerald-800/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
