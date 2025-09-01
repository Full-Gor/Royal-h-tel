import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, Phone, Eye, EyeOff, Loader, RefreshCw, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { validatePassword, generateSecurePassword } from '../lib/passwordValidation';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';


const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<any>(null);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const flash = useFlash();

  // Réinitialiser la validation quand on change de mode
  useEffect(() => {
    setPasswordValidation(null);
    setShowPasswordGenerator(false);
  }, [isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Protection renforcée contre XSS
    let sanitizedValue = value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();

    // Limiter la longueur selon le champ
    const maxLengths: Record<string, number> = {
      email: 254,
      firstName: 50,
      lastName: 50,
      phone: 20,
      password: 128
    };

    if (maxLengths[name]) {
      sanitizedValue = sanitizedValue.substring(0, maxLengths[name]);
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Validation en temps réel du mot de passe
    if (name === 'password') {
      console.log('🔍 Validation mot de passe:', sanitizedValue);
      const validation = validatePassword(sanitizedValue);
      console.log('✅ Résultat validation:', validation);
      setPasswordValidation(validation);
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      flash.showError('Validation', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      flash.showError('Validation', 'Veuillez entrer une adresse email valide');
      return false;
    }

    // Validation basique pour tous les cas - DÉSACTIVÉE
    // if (formData.password.length < 6) {
    //   flash.showError('Validation', 'Le mot de passe doit contenir au moins 6 caractères');
    //   return false;
    // }

    if (!isLogin) {
      if (!formData.firstName || !formData.lastName) {
        flash.showError('Validation', 'Veuillez remplir tous les champs obligatoires');
        return false;
      }
    }

    return true;
  };

  const handleGeneratePassword = () => {
    const securePassword = generateSecurePassword(16);
    setFormData(prev => ({
      ...prev,
      password: securePassword
    }));
    const validation = validatePassword(securePassword);
    setPasswordValidation(validation);
    setShowPasswordGenerator(false);
    flash.showSuccess('Mot de passe généré', 'Un mot de passe sécurisé a été généré pour vous');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      let success = false;

      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData);
      }

      if (success) {
        navigate('/');
      }
    } catch (err) {
      flash.showError('Erreur', 'Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-luxury-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gold-500/20 p-8"
        >
          <div className="text-center">
            <Crown className="h-12 w-12 text-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-white">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="mt-2 text-gold-200">
              {isLogin ? 'Accédez à votre espace royal' : 'Rejoignez notre communauté exclusive'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                        placeholder="Prénom"
                        required={!isLogin}
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">Nom</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                        placeholder="Nom"
                        required={!isLogin}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="Adresse email"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="sr-only">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                      placeholder="Numéro de téléphone"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-20 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="Mot de passe"
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <div className="absolute right-3 top-3 flex space-x-1">
                    {!isLogin && (
                      <button
                        type="button"
                        onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
                        className="text-gold-400 hover:text-gold-300 transition-colors"
                        title="Générer un mot de passe sécurisé"
                      >
                        <Sparkles className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Générateur de mot de passe */}
                {!isLogin && showPasswordGenerator && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 p-3 bg-luxury-700/30 border border-gold-500/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gold-200">Générer un mot de passe sécurisé</span>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-xs bg-gold-500 hover:bg-gold-600 text-luxury-900 px-2 py-1 rounded transition-colors"
                      >
                        Générer
                      </button>
                    </div>
                    <p className="text-xs text-gold-300">
                      Cliquez sur "Générer" pour créer un mot de passe qui respecte toutes les exigences de sécurité.
                    </p>
                  </motion.div>
                )}

                {/* Indicateur de force du mot de passe */}
                {passwordValidation && (
                  <div className="mt-3">
                    <PasswordStrengthMeter validation={passwordValidation} />
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-luxury-900 font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-luxury-800 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  {isLogin ? 'Connexion...' : 'Inscription...'}
                </>
              ) : (
                isLogin ? 'Se connecter' : 'S\'inscrire'
              )}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold-300 hover:text-gold-200 text-sm transition-colors"
              >
                {isLogin
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"
                }
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;