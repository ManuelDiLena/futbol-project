import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const MultiSelect = ({ label, options, selectedValues = [], onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    let newValues;
    if (selectedValues.includes(value)) {
      newValues = selectedValues.filter((item) => item !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  };

  return (
    <div className='relative' ref={containerRef}>
      <label className='block text-sm font-medium text-gray-300 mb-1'>{label}</label>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-left text-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500'
      >
        <span className='block truncate'>
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : 'Select options...'}
        </span>
        <FaChevronDown className='h-3 w-3 text-gray-400' />
      </button>
      {isOpen && (
        <div className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-600'>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className='relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-300 hover:bg-gray-700 hover:text-white'
            >
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={selectedValues.includes(option)}
                  readOnly
                  className='h-4 w-4 rounded border-gray-500 bg-gray-900 text-green-600 focus:ring-green-500'
                />
                <span className='ml-3 block truncate font-normal'>{option}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='mt-2 flex flex-wrap gap-2'>
        {selectedValues.map((val) => (
          <span key={val} className='inline-flex items-center rounded-full bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-100'>
            {val}
          </span>
        ))}
      </div>
      {error && <p className='mt-1 text-sm text-red-400'>{error.message}</p>}
    </div>
  );
};

export default MultiSelect;