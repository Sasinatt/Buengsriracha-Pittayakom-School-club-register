
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AcademicDashboard from './components/AcademicDashboard';
import Header from './components/Header';
import { UserRole } from './types';
import RoleSelection from './components/RoleSelection';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-10 w-10 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!user) {
      if (!selectedRole) {
        return <RoleSelection onSelect={(role) => setSelectedRole(role)} />;
      }
      return <Login role={selectedRole} onBack={() => setSelectedRole(null)} />;
    }
    
    switch (user.role) {
      case UserRole.STUDENT:
        return <StudentDashboard student={user} />;
      case UserRole.TEACHER:
        return <TeacherDashboard teacher={user} />;
      case UserRole.ACADEMIC:
        return <AcademicDashboard academic={user} />;
      default:
        // This case should ideally not be reached if a user is logged in
        // But as a fallback, show the role selection.
        setSelectedRole(null);
        return <RoleSelection onSelect={(role) => setSelectedRole(role)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
