import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { playerSchema } from '../utils/validationSchema';
import apiClient from '../api/apiClient';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GiSoccerBall } from "react-icons/gi";
import MultiSelect from './ui/MultiSelect';

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
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      positions: [],
      availability: [],
    },
  });

  const onSubmit = async (data) => {
    console.log('Llego aquí');
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
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Age */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Age</label>
          <input
            type="number"
            {...register('age')}
            className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
          />
          <FormError name='age' errors={errors} />
        </div>
        {/* Location */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>City</label>
          <input
            type="text"
            {...register('location')}
            placeholder='Ej: Madrid, España'
            className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
          />
          <FormError name='location' errors={errors} />
        </div>
        {/* Positions (Select) */}
        <div>
          <Controller
            name='positions'
            control={control}
            render={({ field }) => (
              <MultiSelect
                label='Preferred Positions'
                options={POSITIONS}
                selectedValues={field.value}
                onChange={field.onChange}
                error={errors.positions}
              />
            )}
          />
        </div>
        {/* Availability (Select) */}
        <div>
          <Controller
            name='availability'
            control={control}
            render={({ field }) => (
              <MultiSelect
                label='Availability'
                options={AVAILABILITY}
                selectedValues={field.value}
                onChange={field.onChange}
                error={errors.availability}
              />
            )}
          />
        </div>
      </div>
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className='mt-6 flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-green-700 disabled:opacity-50'
      >
        {isLoading ? <GiSoccerBall className='animate-spin h-5 w-5' /> : 'Save Profile'}
      </button>
    </form>
  );
};

export default PlayerOnboarding;

