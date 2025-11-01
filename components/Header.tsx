import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../App';
import { UserRole } from '../types';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, currentUserRole, setCurrentUserRole }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getNavItems = (role: UserRole): Page[] => {
    switch(role) {
      case 'Admin':
        return ['Dashboard', 'Reporting', 'Admin'];
      case 'Operator':
      case 'Security':
        return ['Dashboard']; // Simple view for non-admins
      default:
        return [];
    }
  }

  const navItems = getNavItems(currentUserRole);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    setDropdownOpen(false);
    // Always switch to dashboard view on role change for simplicity
    setCurrentPage('Dashboard');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">
              DockFlow
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-300">{currentUserRole}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border dark:border-gray-700">
                  <span className="block px-4 py-2 text-xs text-gray-400">Switch Role</span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleRoleChange('Admin'); }}
                    className={`block px-4 py-2 text-sm ${currentUserRole === 'Admin' ? 'bg-indigo-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    Admin
                  </a>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleRoleChange('Operator'); }}
                    className={`block px-4 py-2 text-sm ${currentUserRole === 'Operator' ? 'bg-indigo-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    Operator
                  </a>
                   <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleRoleChange('Security'); }}
                    className={`block px-4 py-2 text-sm ${currentUserRole === 'Security' ? 'bg-indigo-500 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    Security
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
