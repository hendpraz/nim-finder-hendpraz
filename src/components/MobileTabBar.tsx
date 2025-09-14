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
        className={`flex flex-col items-center justify-center px-4 py-2 text-xs transition-colors ${
          currentPage === 'student-finder'
            ? 'text-blue-700 font-semibold'
            : 'text-gray-600 hover:text-gray-900 font-medium'
        }`}
      >
        {/* <Users className="h-6 w-6 mb-1" /> */}
        Smart Search
      </Link>
      <Link
        href='/pddikti'
        prefetch={true}
        className={`flex flex-col items-center justify-center px-4 py-2 text-xs transition-colors relative ${
          currentPage === 'pddikti-search'
            ? 'text-blue-700 font-semibold'
            : 'text-gray-600 hover:text-gray-900 font-medium'
        }`}
      >
        {/* <Database className="h-6 w-6 mb-1" /> */}
        PDDIKTI Search
        <span
          className='absolute -top-2 -right-3 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-tr-lg rounded-bl-lg shadow-lg rotate-12 select-none'
          style={{ zIndex: 2 }}
        >
          Try it
        </span>
      </Link>
    </nav>
  );
}
