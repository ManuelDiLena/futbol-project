import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import useTeamStore from '../store/teamStore';
import { FaShieldAlt } from 'react-icons/fa';
import { GiSoccerBall } from 'react-icons/gi';

const EMBLEMS = ['🛡️', '⚽', '🦅', '🦁', '🦈', '⚡', '🔥', '👑'];

export default function CreateTeam() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { createTeam } = useTeamStore();

  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, control, setValue } = useForm({
    defaultValues: { location: user?.profile?.location || '', emblem: '🛡️' }
  });

  const selectedEmblem = useWatch({
    control,
    name: 'emblem'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createTeam(data);
    if (result.success) {
      updateUser({ role: result.updatedUserRole, team: result.team?._id });
      navigate('/my-team');
    } else {
      alert(result.message);
    }
    setLoading(false);
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-4'>
      <div className='max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mt-10'>
        <h2 className='text-2xl font-bold text-green-500 mb-6 flex items-center gap-2'>
          <FaShieldAlt /> Create Team
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm text-gray-400'>Team Name</label>
            <input {...register('name', { required: true })} className='w-full bg-gray-700 rounded p-2 mt-1 border border-gray-600' />
          </div>
          <div>
            <label className='block text-sm text-gray-400'>Location</label>
            <input {...register('location', { required: true })} className='w-full bg-gray-700 rounded p-2 mt-1 border border-gray-600' />
          </div>
          <div>
            <label className='block text-sm text-gray-400 mb-2'>Emblem</label>
            <div className='flex gap-2 overflow-x-auto pb-2'>
              {EMBLEMS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setValue('emblem', em)}
                  className={`text-2xl p-2 rounded ${selectedEmblem === em ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <button disabled={loading} className='w-full bg-green-600 py-2 rounded font-bold hover:bg-green-700'>
            {loading ? <GiSoccerBall className='animate-spin mx-auto'/> : 'Create Team'}
          </button>
        </form>
      </div>
    </div>
  );
}