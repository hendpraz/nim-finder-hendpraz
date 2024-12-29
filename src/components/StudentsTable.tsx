import React from 'react';
import { Student } from '../types/student';

interface StudentsTableProps {
  students: Student[];
  isLoading: boolean;
}

export function StudentsTable({ students, isLoading }: StudentsTableProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading students...
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No students found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.majorId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.facultyId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.majorId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.major}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}