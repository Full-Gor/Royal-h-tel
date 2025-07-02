import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, User, LogOut, Settings, Menu, X, ChefHat, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Histoire', path: '/histoire' },
    ...(isAuthenticated ? [{ name: 'Chambres', path: '/chambres' }] : []),
    { name: 'Menu', path: '/menu', icon: ChefHat },
    { name: 'Contact', path: '/contact' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || !isHomePage
          ? 'bg-luxury-900/95 backdrop-blur-md shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Crown className="h-8 w-8 text-gold-500" />
            <span className="text-2xl font-serif font-bold text-white">
              Château Royal
            </span>
          </motion.div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${
                  location.pathname === item.path
                    ? 'text-gold-400'
                    : 'text-white hover:text-gold-300'
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Authentification */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full bg-gold-500/20 hover:bg-gold-500/30 transition-colors"
                >
                  <img
                    src={user?.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-luxury-800 rounded-lg shadow-xl py-2 border border-gold-500/20"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gold-500/20"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-white hover:bg-gold-500/20"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Administration
                        </Link>
                      )}
                      <Link
                        to="/cgv"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gold-500/20"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        CGV
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gold-500/20"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-gold-500/20"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-luxury-900/95 backdrop-blur-md border-t border-gold-500/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-white hover:text-gold-300 transition-colors flex items-center"
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.name}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-white hover:text-gold-300 transition-colors"
                  >
                    Profil
                  </Link>
                  <Link
                    to="/cgv"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-white hover:text-gold-300 transition-colors"
                  >
                    CGV
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-gold-500 text-luxury-900 rounded-lg font-medium text-center"
                >
                  Connexion
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-white hover:text-gold-300 transition-colors"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;