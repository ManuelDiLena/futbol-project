import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { playerSchema } from '../utils/validationSchema';
import apiClient from '../api/apiClient';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GiSoccerBall } from "react-icons/gi";

const POSITIONS = ['QK', 'CB', 'RB', 'LB', 'CMD', 'CM', 'CAM', 'RW', 'LW', 'ST'];
const AVAILABILITY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Full'];

// Helper to display errors
const FormError = ({ name, errors }) => {
  return errors[name] && (
    <p className="mt-1 text-sm text-red-400">
      {errors[name].message}
    </p>
  );
};

const PlayerOnboarding = () => {
  const navigate = useNavigate();
  const { setProfileComplete } = useAuthStore((state) => state.setProfileComplete);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      positions: [],
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.put('/api/players/me', data);
      setProfileComplete();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      setIsLoading(false);
    }
  };

  return (
    <form className='space-y-6 text-white' onSubmit={handleSubmit(onSubmit)}>
      {/* Age */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Age</label>
        <input
          type='number'
          {...register('age')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm'
        />
        <FormError name='age' errors={errors} />
      </div>
      {/* Location */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>City</label>
        <input
          type='text'
          {...register('location')}
          placeholder='Ej: Madrid, España'
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm'
        />
        <FormError name='location' errors={errors} />
      </div>
      {/* Positions (Checkboxes) */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Preferred Positions</label>
        <div className='mt-2 grid grid-cols-2 gap-4'>
          {POSITIONS.map((pos) => (
            <label key={pos} className='flex items-center space-x-2 rounded-md bg-gray-700 p-2'>
              <input
                type='checkbox'
                {...register('positions')}
                value={pos}
                className='rounded text-green-500'
              />
              <span>{pos}</span>
            </label>
          ))}
        </div>
        <FormError name='positions' errors={errors} />
      </div>
      {/* Availability (Select) */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Availability</label>
        <select
          {...register('availability')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm'
        >
          <option value=''>Select an option</option>
          {AVAILABILITY.map((av) => (
            <option key={av} value={av}>{av}</option>
          ))}
        </select>
        <FormError name='availability' errors={errors} />
      </div>
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type='submit'
        disabled={isLoading}
        className='flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-green-700 disabled:opacity-50'
      >
        {isLoading ? <GiSoccerBall className='animate-spin h-5 w-5' /> : 'Save Profile'}
      </button>
    </form>
  );
};

export default PlayerOnboarding;

