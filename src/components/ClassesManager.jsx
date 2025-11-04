import React, { useState } from 'react';
import { Plus, Edit, Trash, Save, X } from 'lucide-react';

export default function ClassesManager({ classes, setClasses, onClassRename }) {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const addClass = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = classes.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return;
    const newClass = { id: crypto.randomUUID(), name: trimmed };
    setClasses(prev => [...prev, newClass]);
    setName('');
  };

  const startEdit = (cls) => {
    setEditingId(cls.id);
    setEditingName(cls.name);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) return;
    setClasses(prev => prev.map(c => (c.id === editingId ? { ...c, name: trimmed } : c)));
    onClassRename(editingId, trimmed);
    setEditingId(null);
    setEditingName('');
  };

  const removeClass = (id) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    onClassRename(id, null); // signal deletion so dependents can update
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-4">
        <h2 className="text-lg font-semibold text-emerald-900">Kelola Kelas</h2>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kelas (mis. X IPA 1)"
            className="flex-1 px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button onClick={addClass} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
            <Plus size={18} /> Tambah Kelas
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm border border-emerald-900/10 p-4">
        <h3 className="font-medium text-emerald-900 mb-3">Daftar Kelas</h3>
        <ul className="divide-y divide-emerald-100">
          {classes.length === 0 && (
            <li className="py-6 text-center text-emerald-700/70">Belum ada kelas. Tambahkan di atas.</li>
          )}
          {classes.map((cls) => (
            <li key={cls.id} className="py-3 flex items-center gap-3 justify-between">
              {editingId === cls.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <div className="font-medium text-emerald-900">{cls.name}</div>
                </div>
              )}
              <div className="flex items-center gap-2">
                {editingId === cls.id ? (
                  <>
                    <button onClick={saveEdit} className="p-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"><Save size={16} /></button>
                    <button onClick={() => { setEditingId(null); setEditingName(''); }} className="p-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><X size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(cls)} className="p-2 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200"><Edit size={16} /></button>
                    <button onClick={() => removeClass(cls.id)} className="p-2 rounded-md bg-rose-100 text-rose-700 hover:bg-rose-200"><Trash size={16} /></button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
