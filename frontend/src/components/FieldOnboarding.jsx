import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fieldSchema } from '../utils/validationSchema';
import apiClient from '../api/apiClient';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GiSoccerBall } from "react-icons/gi";

const MATCH_TYPES = ['F5', 'F7', 'F9', 'F11'];

// Helper to display errors
const FormError = ({ name, errors }) => {
  return errors[name] && (
    <p className="mt-1 text-sm text-red-400">
      {errors[name].message}
    </p>
  );
};

const FieldOnboarding = () => {
  const navigate = useNavigate();
  const { setProfileComplete } = useAuthStore((state) => state.setProfileComplete);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      matchTypes: [],
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.put('/api/fields/me', data);
      setProfileComplete();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 text-white'>
      {/* FieldName */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Field Name</label>
        <input
          type='text'
          {...register('fieldName')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white'
        />
        <FormError name='fieldName' errors={errors} />
      </div>
      {/* City */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>City</label>
        <input
          type='text'
          {...register('location')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white'
        />
        <FormError name='location' errors={errors} />
      </div>
      {/* Schedules */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Schedules</label>
        <textarea
          {...register('schedules')}
          rows={3}
          placeholder='For example: Monday to Friday from 10:00 to 23:00...'
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white'
        />
        <FormError name='schedules' errors={errors} />
      </div>
      {/* Number of Fields */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Nº of Fields</label>
        <input
          type='number'
          {...register('fieldCount')}
          className='mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white'
        />
        <FormError name='fieldCount' errors={errors} />
      </div>
      {/* Match Types (Checkboxes) */}
      <div>
        <label className='block text-sm font-medium text-gray-300'>Match Types</label>
        <div className='mt-2 grid grid-cols-3 gap-4'>
          {MATCH_TYPES.map((type) => (
            <label key={type} className='flex items-center space-x-2 rounded-md bg-gray-700 p-2'>
              <input
                type='checkbox'
                {...register('matchTypes')}
                value={type}
                className='rounded text-green-500'
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
        <FormError name='matchTypes' errors={errors} />
      </div>
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type='submit'
        disabled={isLoading}
        className='flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-white cursor-pointer hover:bg-green-700 disabled:opacity-50'
      >
        {isLoading ? <GiSoccerBall className='animate-spin h-5 w-5' /> : 'Save Profile'}
      </button>
    </form>
  );
};

export default FieldOnboarding;