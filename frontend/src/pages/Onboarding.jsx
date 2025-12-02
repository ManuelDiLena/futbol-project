import React from 'react';
import useAuthStore from '../store/authStore';
import PlayerOnboarding from '../components/PlayerOnboarding';
import FieldOnboarding from '../components/FieldOnboarding';

export default function Onboarding() {
  const { user } = useAuthStore((state) => state);

  const renderForm = () => {
    if (user?.role === 'player') {
      return <PlayerOnboarding />;
    }
    if (user?.role === 'adminField') {
      return <FieldOnboarding />;
    }
    return <p className='text-center text-red-500'>Error: User role not recognized</p>
  }

  return (
    <div className='flex min-h-screen flex-col justify-center bg-gray-900 py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-white'>
          One more step!
        </h2>
        <p className='mt-2 text-center text-lg text-gray-400'>
          Complete your profile to continue
        </p>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-2xl'> {/* Un poco más ancho */}
        <div className='bg-gray-800 px-4 py-8 shadow-lg shadow-green-900/10 sm:rounded-lg sm:px-10'>
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

