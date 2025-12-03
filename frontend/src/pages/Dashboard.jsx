import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import apiClient from '../api/apiClient';
import { GiSoccerBall } from "react-icons/gi";
import { CiEdit } from "react-icons/ci";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => state);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.role) return;
      const endpoint = user.role === 'player' ? '/api/players/me' : '/api/fields/me';
      try {
        const { data } = await apiClient.get(endpoint);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='flex min-h-screen flex-col bg-gray-900 text-white p-4 md:p-8'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-green-500'>
          Welcome, {user?.name}
        </h1>
        <button className='rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white cursor-pointer hover:bg-red-700' onClick={handleLogout}>
          Sign Out
        </button>
      </header>
      <main className='w-full max-w-4xl mx-auto'>
        <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
          {isLoading && (
            <div className='flex justify-center items-center h-48'>
              <GiSoccerBall className='animate-spin h-12 w-12 text-green-500' />
            </div>
          )}
          {error && <p className='text-center text-red-500'>{error}</p>}
          {profile && (
            <div>
              <button className='float-right text-gray-400 cursor-pointer hover:text-white'>
                <CiEdit className='h-5 w-5' />
              </button>
              {user.role === 'player' ? (
                <PlayerDashboard profile={profile} />
              ) : (
                <FieldDashboard profile={profile} />
              )}
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-400">Next matches...</h2>
        </div>
      </main>
    </div>
  );
};