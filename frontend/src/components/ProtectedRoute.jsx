import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { GiSoccerBall } from "react-icons/gi";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profileComplete = useAuthStore((state) => state.profileComplete);
  // const loadingAuth = useAuthStore((state) => state.loadingAuth);

  const location = useLocation();

  // if (loadingAuth) {
  //   return (
  //     <div className='w-full h-screen flex items-center justify-center'>
  //       <GiSoccerBall className='animate-spin h-10 w-10 text-primary' />
  //     </div>
  //   );
  // }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!profileComplete) {
    if (!location.pathname.startsWith('/onboarding')) {
      return <Navigate to='/onboarding' replace />;
    }
    return <Outlet />
  }

  if (profileComplete && location.pathname.startsWith('/onboarding')) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;