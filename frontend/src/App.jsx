import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CreateTeam from './pages/CreateTeam';
import FindTeam from './pages/FindTeam';
import TeamDashboard from './pages/TeamDashboard';

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
          <Route path='/create-team' element={<CreateTeam />} />
          <Route path='/find-team' element={<FindTeam />} />
          <Route path='/my-team' element={<TeamDashboard />} />
        </Route>
        {/* DEFAULT ROUTES */}
        <Route path='/' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
