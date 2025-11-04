import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ClassesManager from './components/ClassesManager';
import StudentsManager from './components/StudentsManager';
import GradesManager from './components/GradesManager';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  // grades: { [studentId]: Array<{ id, date, score }> }
  const [grades, setGrades] = useState({});

  // Keep data integrity when class renamed/removed
  const handleClassRename = (classId, newNameOrNull) => {
    if (newNameOrNull === null) {
      // class removed -> detach from students
      setStudents(prev => prev.map(s => (s.classId === classId ? { ...s, classId: '' } : s)));
    }
  };

  const stats = useMemo(() => ({
    totalClasses: classes.length,
    totalStudents: students.length,
    totalDailyScores: Object.values(grades).reduce((a, arr) => a + arr.length, 0),
  }), [classes, students, grades]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-200 to-teal-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(45,212,191,0.2),transparent_35%)]" />
      <Navbar current={tab} onChange={setTab} />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {tab === 'dashboard' && <Dashboard stats={stats} />}
        {tab === 'classes' && (
          <ClassesManager classes={classes} setClasses={setClasses} onClassRename={handleClassRename} />
        )}
        {tab === 'students' && (
          <StudentsManager classes={classes} students={students} setStudents={setStudents} />
        )}
        {tab === 'grades' && (
          <GradesManager students={students} classes={classes} grades={grades} setGrades={setGrades} />
        )}

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-emerald-800/80">
          Dibuat untuk: ABSENSI SISWA MAS AL-WASHLIYAH NAGUR
        </div>
      </main>
    </div>
  );
}
