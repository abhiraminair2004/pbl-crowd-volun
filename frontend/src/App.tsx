import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AboutUs from './pages/AboutUs';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/about" replace />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  );
};

export default App;