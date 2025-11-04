import React, { useMemo, useState } from 'react';
import { Plus, Trash, Download } from 'lucide-react';

function formatDate(v) {
  const d = new Date(v);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function semesterOf(date) {
  const d = new Date(date);
  const m = d.getMonth(); // 0..11
  // Semester 1: July(6) - Dec(11), Semester 2: Jan(0) - Jun(5)
  return m >= 6 ? 1 : 2;
}

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
}

export default function GradesManager({ students, classes, grades, setGrades }) {
  const [form, setForm] = useState({ studentId: '', date: new Date().toISOString().slice(0, 10), score: '' });

  const addGrade = () => {
    if (!form.studentId || !form.date || form.score === '') return;
    const scoreNum = Number(form.score);
    if (Number.isNaN(scoreNum)) return;
    const id = crypto.randomUUID();
    setGrades(prev => ({ ...prev, [form.studentId]: [ ...(prev[form.studentId] || []), { id, date: form.date, score: scoreNum } ] }));
    setForm(f => ({ ...f, score: '' }));
  };

  const removeGrade = (studentId, id) => {
    setGrades(prev => ({ ...prev, [studentId]: (prev[studentId] || []).filter(g => g.id !== id) }));
  };

  const selectedStudent = students.find(s => s.id === form.studentId) || null;

  const aggregates = useMemo(() => {
    const result = {};
    for (const s of students) {
      const gs = grades[s.id] || [];
      // By month
      const byMonth = {};
      gs.forEach(g => {
        const mk = monthKey(g.date);
        if (!byMonth[mk]) byMonth[mk] = [];
        byMonth[mk].push(g.score);
      });
      const monthly = Object.entries(byMonth).map(([mk, arr]) => ({
        month: mk,
        average: arr.reduce((a,b)=>a+b,0) / arr.length,
        count: arr.length,
      })).sort((a,b)=>a.month.localeCompare(b.month));

      // By semester (per academic year)
      const bySem = {};
      gs.forEach(g => {
        const d = new Date(g.date);
        const sem = semesterOf(g.date);
        const year = sem === 1 ? d.getFullYear() : d.getFullYear();
        const key = `${year}-S${sem}`;
        if (!bySem[key]) bySem[key] = [];
        bySem[key].push(g.score);
      });
      const semester = Object.entries(bySem).map(([k, arr]) => ({
        semester: k,
        average: arr.reduce((a,b)=>a+b,0) / arr.length,
        count: arr.length,
      })).sort((a,b)=>a.semester.localeCompare(b.semester));

      result[s.id] = { monthly, semester };
    }
    return result;
  }, [students, grades]);

  const exportStudentCSV = (s) => {
    const headers = ['Tanggal', 'Nilai'];
    const rows = (grades[s.id] || []).map(g => [g.date, g.score]);
    const csv = [headers, ...rows].map(line => line.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nilai_${s.name.replace(/\s+/g,'_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportStudentPDF = (s) => {
    const gs = grades[s.id] || [];
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"><title>Nilai ${s.name}</title>
    <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu} h1{font-size:18px}
    table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:8px;font-size:12px}
    th{background:#10b981;color:#fff;text-align:left}</style></head>
    <body><h1>Nilai Harian - ${s.name}</h1>
    <p>Kelas: ${classes.find(c=>c.id===s.classId)?.name || '-'}</p>
    <table><thead><tr><th>Tanggal</th><th>Nilai</th></tr></thead><tbody>
    ${gs.map(g => `<tr><td>${g.date}</td><td>${g.score}</td></tr>`).join('')}
    </tbody></table></body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-4">
        <h2 className="text-lg font-semibold text-emerald-900">Input Nilai Harian</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
          <select value={form.studentId} onChange={(e)=>setForm(f=>({ ...f, studentId: e.target.value }))} className="px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="">Pilih siswa</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({classes.find(c=>c.id===s.classId)?.name || '-'})</option>
            ))}
          </select>
          <input type="date" value={form.date} onChange={(e)=>setForm(f=>({ ...f, date: e.target.value }))} className="px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <input type="number" placeholder="Nilai" value={form.score} onChange={(e)=>setForm(f=>({ ...f, score: e.target.value }))} className="px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
          <button onClick={addGrade} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"><Plus size={18} /> Tambah Nilai</button>
        </div>
      </div>

      {selectedStudent && (
        <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-emerald-900">Nilai {selectedStudent.name}</h3>
              <p className="text-emerald-700/70 text-sm">Kelas: {classes.find(c=>c.id===selectedStudent.classId)?.name || '-'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => exportStudentCSV(selectedStudent)} className="px-3 py-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 inline-flex items-center gap-2"><Download size={16}/> CSV</button>
              <button onClick={() => exportStudentPDF(selectedStudent)} className="px-3 py-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 inline-flex items-center gap-2"><Download size={16}/> PDF</button>
            </div>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="text-left p-2">Tanggal</th>
                  <th className="text-left p-2">Nilai</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100">
                {(grades[selectedStudent.id] || []).length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-emerald-700/70">Belum ada nilai.</td>
                  </tr>
                )}
                {(grades[selectedStudent.id] || []).map(g => (
                  <tr key={g.id} className="bg-white/60 hover:bg-white">
                    <td className="p-2">{formatDate(g.date)}</td>
                    <td className="p-2">{g.score}</td>
                    <td className="p-2">
                      <button onClick={() => removeGrade(selectedStudent.id, g.id)} className="p-2 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"><Trash size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <h4 className="font-medium text-emerald-900 mb-2">Rata-rata Bulanan</h4>
              <ul className="space-y-1 text-sm">
                {(aggregates[selectedStudent.id]?.monthly || []).map(m => (
                  <li key={m.month} className="flex justify-between">
                    <span>{m.month}</span>
                    <span className="font-semibold text-emerald-800">{m.average.toFixed(2)} ({m.count}x)</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <h4 className="font-medium text-emerald-900 mb-2">Rata-rata Semester</h4>
              <ul className="space-y-1 text-sm">
                {(aggregates[selectedStudent.id]?.semester || []).map(s => (
                  <li key={s.semester} className="flex justify-between">
                    <span>{s.semester}</span>
                    <span className="font-semibold text-emerald-800">{s.average.toFixed(2)} ({s.count}x)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-4">
        <h3 className="font-medium text-emerald-900 mb-2">Rekap Cepat Semua Siswa</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="text-left p-2">Nama</th>
                <th className="text-left p-2">Kelas</th>
                <th className="text-left p-2">Jumlah Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {students.map(s => (
                <tr key={s.id} className="bg-white/60">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{classes.find(c=>c.id===s.classId)?.name || '-'}</td>
                  <td className="p-2">{(grades[s.id] || []).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
