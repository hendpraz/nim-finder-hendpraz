'use client';

import { Database, GraduationCap, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();

  const currentPage = pathname === '/' ? 'student-finder' : 'pddikti-search';

  const onPageChange = (page: 'student-finder' | 'pddikti-search') => {
    if (page === 'student-finder') {
      router.push('/');
    } else {
      router.push('/pddikti');
    }
  };

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <GraduationCap className='h-8 w-8 text-blue-600 mr-2' />
            <span className='text-xl font-bold text-gray-900'>NIM Finder</span>
          </div>

          <div className='flex space-x-1'>
            <button
              onClick={() => onPageChange('student-finder')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'student-finder'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className='h-4 w-4 mr-2' />
              Student Search
            </button>

            <button
              onClick={() => onPageChange('pddikti-search')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'pddikti-search'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Database className='h-4 w-4 mr-2' />
              PDDIKTI Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
