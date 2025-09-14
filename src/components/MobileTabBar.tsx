'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function MobileTabBar() {
  const pathname = usePathname();
  const currentPage = pathname === '/' ? 'student-finder' : 'pddikti-search';

  return (
    <nav className='right-0 z-50 bg-white border-t border-gray-200 shadow sm:hidden flex justify-around py-2'>
      <Link
        href='/'
        prefetch={true}
        className={`flex flex-col items-center justify-center px-4 py-2 text-xs font-medium transition-colors ${
          currentPage === 'student-finder'
            ? 'text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {/* <Users className="h-6 w-6 mb-1" /> */}
        Smart Search
      </Link>
      <Link
        href='/pddikti'
        prefetch={true}
        className={`flex flex-col items-center justify-center px-4 py-2 text-xs font-medium transition-colors ${
          currentPage === 'pddikti-search'
            ? 'text-blue-700'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {/* <Database className="h-6 w-6 mb-1" /> */}
        PDDIKTI Search
      </Link>
    </nav>
  );
}
