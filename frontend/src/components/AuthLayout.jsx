import React from 'react';

const AuthLayout = ({ title, children }) => {
  return (
    <div className='flex min-h-screen flex-col justify-center bg-gray-900 py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-white'>
          {title}
        </h2>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-gray-800 px-4 py-8 shadow-lg shadow-green-900/10 sm:rounded-lg sm:px-10'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;