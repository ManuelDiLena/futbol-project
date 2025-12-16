import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useTeamStore from '../store/teamStore';
import apiClient from '../api/apiClient';
import PlayerDashboard from '../components/PlayerDashboard';
import { GiSoccerBall } from 'react-icons/gi';
import { CiEdit } from 'react-icons/ci';
import { FaSearch, FaPlusCircle } from 'react-icons/fa';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { myTeam, fetchMyTeam } = useTeamStore();

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
    if (user?.role === 'player' || user?.role === 'adminTeam') {
      fetchMyTeam();
    }
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
        <div className='mt-8'>
          <h2 className='text-xl font-semibold text-gray-400'>Next matches...</h2>
        </div>
      </main>
      {user?.role !== 'adminField' && (
        <div className='w-full max-w-4xl mx-auto mt-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>Your Team</h2>
            {myTeam ? (
              <Link to='/my-team' className='block bg-linear-to-r from-green-900 to-gray-800 p-6 rounded-lg border border-green-800 hover:border-green-500 transition shadow-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <span className='text-4xl'>{myTeam.emblem}</span>
                    <div>
                      <h3 className='text-2xl font-bold text-white'>{myTeam.name}</h3>
                      <p className='text-green-400 text-sm'>Enter the squad &rarr;</p>
                    </div>
                  </div>
                  {user.role === 'adminTeam' && <span className='bg-yellow-600 text-xs px-2 py-1 rounded text-black font-bold'>CAPTAIN</span>}
                </div>
              </Link>
            ) : (
              <div className='grid grid-cols-2 gap-4'>
                <Link to='/create-team' className='bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 flex flex-col items-center justify-center text-center gap-2 group'>
                  <FaPlusCircle className='text-3xl text-gray-500 group-hover:text-green-500 transition' />
                  <span className='font-semibold text-gray-300 group-hover:text-white'>Create Team</span>
                </Link>
                <Link to='/find-team' className='bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 flex flex-col items-center justify-center text-center gap-2 group'>
                  <FaSearch className='text-3xl text-gray-500 group-hover:text-green-500 transition' />
                  <span className='font-semibold text-gray-300 group-hover:text-white'>Find Team</span>
                </Link>
              </div>
            )}
        </div>
      )}
    </div>
  );
};