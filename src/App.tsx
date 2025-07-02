import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FlashProvider } from './contexts/FlashContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Histoire from './pages/Histoire';
import Chambres from './pages/Chambres';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Profile from './pages/profile';
import Menu from './pages/menu';
import CGV from './pages/CGV';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <FlashProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-luxury-900">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/histoire" element={<Histoire />} />
                <Route path="/chambres" element={<Chambres />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cgv" element={<CGV />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </FlashProvider>
  );
}

export default App;