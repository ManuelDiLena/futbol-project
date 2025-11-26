import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Dashboard() {
  const { user, logout } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white'>
      <h1 className='text-4xl font-bold text-green-500'>Dashboard</h1>
      <p className='mt-4 text-xl'>
        Logged in as {user?.name} ({user?.role})!
      </p>
      <div className='mt-8'>
        {user?.role === 'player' ? (
          <p> (Here you'll see matches, teams, etc.)</p>
        ) : (
          <p> (Here you will see your fields, reservations, etc.)</p>
        )}
      </div>
      <button
        onClick={handleLogout}
        className='mt-8 rounded-md bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700'
      >
        Sign Out
      </button>
    </div>
  );
};