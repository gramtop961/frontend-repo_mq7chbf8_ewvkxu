import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash, Save, X, Download } from 'lucide-react';

export default function StudentsManager({ classes, students, setStudents }) {
  const [form, setForm] = useState({ name: '', classId: '' });
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({ name: '', classId: '' });

  const addStudent = () => {
    const name = form.name.trim();
    if (!name) return;
    const newStudent = { id: crypto.randomUUID(), name, classId: form.classId || '' };
    setStudents(prev => [...prev, newStudent]);
    setForm({ name: '', classId: '' });
  };

  const removeStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditing({ name: s.name, classId: s.classId });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const name = editing.name.trim();
    if (!name) return;
    setStudents(prev => prev.map(s => (s.id === editingId ? { ...s, name, classId: editing.classId } : s)));
    setEditingId(null);
  };

  const dataForExport = useMemo(() => {
    return students.map(s => ({
      id: s.id,
      nama: s.name,
      kelas: classes.find(c => c.id === s.classId)?.name || '-'
    }));
  }, [students, classes]);

  const exportCSV = () => {
    const headers = ['ID', 'Nama', 'Kelas'];
    const rows = dataForExport.map(r => [r.id, r.nama, r.kelas]);
    const csv = [headers, ...rows].map(line => line.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar_siswa.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Daftar Siswa</title>
      <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;}
      h1{font-size:18px;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;font-size:12px;} th{background:#10b981;color:#fff;text-align:left;}</style>
      </head><body><h1>Daftar Siswa</h1><table><thead><tr><th>ID</th><th>Nama</th><th>Kelas</th></tr></thead><tbody>
      ${dataForExport.map(r => `<tr><td>${r.id}</td><td>${r.nama}</td><td>${r.kelas}</td></tr>`).join('')}
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
        <h2 className="text-lg font-semibold text-emerald-900">Kelola Siswa</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Nama siswa"
            className="px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <select
            value={form.classId}
            onChange={(e) => setForm(f => ({ ...f, classId: e.target.value }))}
            className="px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Pilih kelas (opsional)</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={addStudent} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus size={18} /> Tambah Siswa
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-emerald-900">Daftar Siswa</h3>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><Download size={16} /> CSV</button>
            <button onClick={exportPDF} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><Download size={16} /> PDF</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="text-left p-2">Nama</th>
                <th className="text-left p-2">Kelas</th>
                <th className="text-left p-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-emerald-700/70">Belum ada siswa.</td>
                </tr>
              )}
              {students.map(s => (
                <tr key={s.id} className="bg-white/60 hover:bg-white">
                  <td className="p-2">
                    {editingId === s.id ? (
                      <input value={editing.name} onChange={(e) => setEditing(ed => ({ ...ed, name: e.target.value }))} className="w-full px-2 py-1 rounded border border-emerald-200" />
                    ) : (
                      <span className="text-emerald-900 font-medium">{s.name}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === s.id ? (
                      <select value={editing.classId} onChange={(e) => setEditing(ed => ({ ...ed, classId: e.target.value }))} className="w-full px-2 py-1 rounded border border-emerald-200">
                        <option value="">-</option>
                        {classes.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    ) : (
                      classes.find(c => c.id === s.classId)?.name || '-'
                    )}
                  </td>
                  <td className="p-2">
                    {editingId === s.id ? (
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="p-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"><Save size={16} /></button>
                        <button onClick={() => setEditingId(null)} className="p-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(s)} className="p-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><Edit size={16} /></button>
                        <button onClick={() => removeStudent(s.id)} className="p-2 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"><Trash size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
