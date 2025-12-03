import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fieldSchema } from '../utils/validationSchema';
import apiClient from '../api/apiClient';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { GiSoccerBall } from 'react-icons/gi';
import MultiSelect from './ui/MultiSelect';

const MATCH_TYPES = ['F5', 'F7', 'F9', 'F11'];

// Helper to display errors
const FormError = ({ name, errors }) => {
  return errors[name] && (
    <p className='mt-1 text-sm text-red-400'>
      {errors[name].message}
    </p>
  );
};

const FieldOnboarding = () => {
  const navigate = useNavigate();
  const { setProfileComplete } = useAuthStore((state) => state.setProfileComplete);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      matchTypes: [],
      schedules: '',
    },
  });

  const onSubmit = async (data) => {
    if (!openTime || !closeTime) {
      setError('Please define the opening and closing times');
      return;
    }
    const scheduleString = `${openTime} - ${closeTime}`;
    data.schedules = scheduleString;
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
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* FieldName */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Field Name</label>
          <input
            type="text"
            {...register('fieldName')}
            className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
          />
          <FormError name='fieldName' errors={errors} />
        </div>
        {/* City */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>City</label>
          <input
            type="text"
            {...register('location')}
            className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
          />
          <FormError name='location' errors={errors} />
        </div>
      </div>
      {/* Schedules */}
      <div className='border-t border-gray-700 pt-4'>
        <label className='block text-sm font-medium text-gray-300 mb-2'>Schedules</label>
        <div className='flex items-center gap-4'>
          <div className='flex-1'>
            <span className='text-xs text-gray-400 block mb-1'>Opening</span>
            <input
              type="time"
              value={openTime}
              onChange={(e) => {
                setOpenTime(e.target.value);
                setValue('schedules', `${e.target.value} - ${closeTime}`);
              }}
              className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
            />
          </div>
          <div className='flex-1'>
            <span className='text-xs text-gray-400 block mb-1'>Closing</span>
            <input
              type="time"
              value={closeTime}
              onChange={(e) => {
                setCloseTime(e.target.value);
                setValue('schedules', `${openTime} - ${e.target.value}`);
              }}
              className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
            />
          </div>
        </div>
        {!openTime || !closeTime ? (
          errors.schedules && <p className='mt-1 text-sm text-red-400'>You must define both schedules</p>
        ) : null}
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-gray-700 pt-4'>
        {/* Number of Fields */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Nº of Fields</label>
          <input
            type="number"
            {...register('fieldCount')}
            className='mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-green-500 focus:ring-green-500'
          />
          <FormError name='fieldCount' errors={errors} />
        </div>
        {/* Match Types (Checkboxes) */}
        <div>
          <Controller
            name='matchTypes'
            control={control}
            render={({ field }) => (
              <MultiSelect
                label='Match Types'
                options={MATCH_TYPES}
                selectedValues={field.value}
                onChange={field.onChange}
                error={errors.matchTypes}
              />
            )}
          />
        </div>
      </div>
      {error && <p className='text-sm text-red-400'>{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className='mt-6 flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 font-medium text-white cursor-pointer hover:bg-green-700 disabled:opacity-50'
      >
        {isLoading ? <GiSoccerBall className='animate-spin h-5 w-5' /> : 'Save Profile'}
      </button>
    </form>
  );
};

export default FieldOnboarding;