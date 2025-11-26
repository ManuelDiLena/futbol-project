import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Onboarding() {
  const { user, logout } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    alert('Profile completed (simulation)');
    navigate('/dashboard');
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white'>
      <h1 className='text-3xl font-bold text-green-500'>Welcome, {user?.name}!</h1>
      <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-white'>
          One more step!
        </h2>
        <p className='mt-2 text-center text-lg text-gray-400'>
          Complete your profile to continue
        </p>
        <p className='mt-2 text-gray-400'>
          (Role detected: {user?.role})
        </p>
        <div className='mt-8 w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg'>
          <h2 className='text-xl font-semibold'>Onboarding form</h2>
          <p className='mt-4 text-gray-400'>
            {user?.role === 'player'
              ? 'We will ask for your age, city, positions, etc.'
              : 'We will ask you for information about your field, schedules, etc.'}
          </p>
        </div>
        <button className='mt-6 rounded-md bg-green-600 px-6 py-2 font-semibold text-white cursor-pointer hover:bg-green-700' onClick={handleCompleteProfile}>
          (Simulate) Complete Profile
        </button>
        <button 
          className='mt-4 text-sm text-gray-500 cursor-pointer hover:text-gray-400'
          onClick={() => {
            logout();
            navigate('/login')
          }}
        >
          Sign Out
        </button>
    </div>
  );
};

