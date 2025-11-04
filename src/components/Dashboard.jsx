import React from 'react';

export default function Dashboard({ stats }) {
  const { totalClasses, totalStudents, totalDailyScores } = stats;
  return (
    <div className="space-y-6">
      <section className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-6">
        <h2 className="text-lg font-semibold text-emerald-900">Ringkasan</h2>
        <p className="text-emerald-700/80 text-sm">Ikhtisar cepat aktivitas dan data Anda.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-sm text-emerald-700">Total Kelas</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{totalClasses}</div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-sm text-emerald-700">Total Siswa</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{totalStudents}</div>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <div className="text-sm text-emerald-700">Input Nilai Harian</div>
            <div className="text-2xl font-bold text-emerald-900 mt-1">{totalDailyScores}</div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold">Selamat datang!</h3>
        <p className="text-emerald-50 mt-1 max-w-2xl">
          Ini adalah pusat kendali untuk mengelola kelas, data siswa, dan nilai harian hingga
          rekap bulanan/semester. Gunakan navigasi di atas untuk mulai bekerja.
        </p>
      </section>
    </div>
  );
}
