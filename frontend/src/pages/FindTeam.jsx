import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

export default function FindTeam() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await apiClient.get(`/api/teams?location=${search}`);
        setTeams(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, [search]);

  const handleJoin = async (id) => {
    try {
      await apiClient.post(`/api/teams/${id}/join`);
      alert('Join request sent!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4 pb-20'>
      <h2 className='text-2xl font-bold text-green-500 mb-4'>Signings</h2>
      <div className='relative mb-6'>
        <FaSearch className='absolute left-3 top-3 text-gray-400' />
        <input 
          type="text" 
          placeholder='Search by city...' 
          className='w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 border border-gray-700 focus:border-green-500 outline-none'
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className='grid gap-4'>
        {teams.map(team => (
          <div key={team._id} className='bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700'>
            <div className='flex items-center gap-3'>
              <span className='text-3xl'>{team.emblem}</span>
              <div>
                <h3 className='font-bold'>{team.name}</h3>
                <p className='text-sm text-gray-400'>{team.location} • {team.members.length}/20 Players</p>
              </div>
            </div>
            <button 
              onClick={() => handleJoin(team._id)}
              className='bg-green-600 p-2 rounded-full hover:bg-green-700 text-white'
            >
              <FaUserPlus />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}