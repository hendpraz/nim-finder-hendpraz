import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center p-4 border-b'>
          <h2 className='text-xl font-semibold'>How to Use NIMFinder.com</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          <section>
            <h3 className='text-lg font-semibold mb-2'>Search Examples</h3>
            <div className='space-y-2'>
              <p className='text-sm'>
                <b>By Name:</b> "Hendry Prasetya", "Hend Pras"
              </p>
              <p className='text-sm'>
                <b>By NIM:</b> "13517105", "16517"
              </p>
              <p className='text-sm'>
                <b>By Major:</b> "Informatika", "IF", "135"
              </p>
              <p className='text-sm'>
                <b>By Faculty:</b> "STEI", "165"
              </p>
              <p className='text-sm'>
                <b>By Year:</b> "2016", "16"
              </p>
              <p className='text-sm'>
                <b>By Status:</b> "Aktif", "Lulus", "Lulus 2024/2025 Genap"
              </p>
              <p className='text-sm'>
                <b>By Combination:</b> "Hendry Informatika ITB", "Mesin 2021
                Lulus"
              </p>
            </div>
          </section>

          <section>
            <h3 className='text-lg font-semibold mb-2'>Search Tips</h3>
            <ul className='list-disc list-inside space-y-2 text-sm'>
              <li>You can combine search terms: "2017 if hendry"</li>
              <li>Searches are case-insensitive</li>
              <li>
                Partial matches work: "hen pra" will find "Hendry Prasetya"
              </li>
              <li>
                The search shows similar results if exact matches aren't found
              </li>
              <li>Results are sorted ascending in alphabetical order</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
