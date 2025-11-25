import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AuthLayout from '../components/AuthLayout';
import { GiSoccerBall, GiSoccerField, GiSoccerKick } from 'react-icons/gi'

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore((state) => state);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/onboarding'); 
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!role) {
      setError('Select an account type');
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await register(name, email, password, role);
    setIsLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <AuthLayout title='Create your account'>
      <form className='space-y-3' onSubmit={handleRegister}>
        {/* Name input */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Name</label>
          <input
            type='text'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white'
          />
        </div>
        {/* Email input */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Email</label>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white'
          />
        </div>
        {/* Password input */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Password</label>
          <input
            type='password'
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white'
          />
        </div>
        {/* Rol selector */}
        <div>
          <label className='block text-sm font-medium text-gray-300'>Account Type</label>
          <div className='mt-2 grid grid-cols-2 gap-4'>
            {/* Player option */}
            <button
              type='button'
              onClick={() => setRole('player')}
              className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer 
                          ${role === 'player' 
                            ? 'border-green-500 bg-gray-700' 
                            : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                          }`}
            >
              <GiSoccerKick className={`h-8 w-8 ${role === 'player' ? 'text-green-500' : 'text-gray-400'}`} />
              <span className='mt-2 font-medium text-white'>Player</span>
            </button>
            {/* Admin Pitch option */}
            <button
              type='button'
              onClick={() => setRole('adminPitch')}
              className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer
                          ${role === 'adminPitch' 
                            ? 'border-green-500 bg-gray-700' 
                            : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                          }`}
            >
              <GiSoccerField className={`h-8 w-8 ${role === 'adminPitch' ? 'text-green-500' : 'text-gray-400'}`} />
              <span className='mt-2 font-medium text-white'>Futbol pitch</span>
            </button>
          </div>
        </div>
        {/* Error */}
        {error && (
          <div className='rounded-md bg-red-900 p-3'>
            <p className='text-sm text-red-200'>{error}</p>
          </div>
        )}
        {/* Submit button */}
        <div>
          <button
            type='submit'
            disabled={isLoading}
            className='flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-green-700 disabled:opacity-50'
          >
            {isLoading ? (
              <GiSoccerBall className='animate-spin h-5 w-5' />
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
      </form>
      {/* Link a Login */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-400'>
          Have an account?{' '}
          <Link to='/login' className='font-medium text-green-500 hover:text-green-400 cursor-pointer'>
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}