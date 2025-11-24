import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/onboarding' element={<Onboarding />} />
        </Route>
        {/* DEFAULT ROUTES */}
        <Route path='/' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
