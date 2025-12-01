import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AuthLayout from '../components/AuthLayout';
import { GiSoccerBall } from 'react-icons/gi';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore((state) => state);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      if (result.profileComplete) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <AuthLayout title='Log in to your account'>
      <form className='space-y-3' onSubmit={handleLogin}>
        {/* Email field */}
        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
            Email
          </label>
          <div className='mt-1'>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm'
            />
          </div>
        </div>
        {/* Password field */}
        <div>
          <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
            Password
          </label>
          <div className='mt-1'>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm'
            />
          </div>
        </div>
        {/* Error */}
        {error && (
          <div className='rounded-md bg-red-900 p-3'>
            <p className='text-sm text-red-200'>{error}</p>
          </div>
        )}
        {/* Btn Submit */}
        <div className='mt-9'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50'
          >
            {isLoading ? (
              <GiSoccerBall className='animate-spin h-5 w-5' />
            ) : (
              'Login'
            )}
          </button>
        </div>
      </form>
      {/* Register link */}
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-400'>
          Don't have an account?{' '}
          <Link to='/register' className='font-medium text-green-500 cursor-pointer hover:text-green-400'>
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}