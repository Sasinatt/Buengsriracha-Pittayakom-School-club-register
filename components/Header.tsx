
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
            </svg>
            <span className="ml-3 text-xl font-semibold text-slate-700 hidden sm:block">ระบบลงทะเบียนชุมนุม</span>
          </div>
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-slate-600 mr-4">
                สวัสดี, <span className="font-medium">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-teal-600 bg-teal-100 border border-transparent rounded-md hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
