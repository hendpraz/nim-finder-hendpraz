'use client';

import { Database, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Navbar() {
  const pathname = usePathname();

  const currentPage = pathname === '/' ? 'student-finder' : 'pddikti-search';

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <GraduationCap className='h-8 w-8 text-blue-600 mr-2' />
            <span className='text-xl font-bold text-gray-900'>NIM Finder</span>
          </div>

          {/* Desktop menu: hidden on mobile */}
          <div className='hidden sm:flex space-x-1'>
            <Link
              href='/'
              prefetch={true}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'student-finder'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className='h-4 w-4 mr-2' />
              Smart Search
            </Link>

            <Link
              href='/pddikti'
              prefetch={true}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'pddikti-search'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Database className='h-4 w-4 mr-2' />
              PDDIKTI Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
