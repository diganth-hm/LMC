import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InstallLanding from './pages/InstallLanding';
import HomePage from './pages/HomePage';
import IntroSplash from './components/IntroSplash';

export default function App() {
  return (
    <BrowserRouter>
      <IntroSplash />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/install" element={<InstallLanding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
