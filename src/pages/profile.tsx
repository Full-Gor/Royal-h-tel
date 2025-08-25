import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { Crown, User, Phone, Mail, Camera, Save, Loader, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const flash = useFlash();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || ''
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      flash.showWarning('Accès restreint', 'Veuillez vous connecter pour accéder à votre profil');
      return;
    }
  }, [isAuthenticated, navigate, flash]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      flash.showError('Erreur', 'Veuillez sélectionner un fichier image valide');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      flash.showError('Erreur', 'L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Convertir en base64 pour l'affichage immédiat
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          profileImage: base64String
        }));
      };
      reader.readAsDataURL(file);

      // Simuler un upload (en réalité, on stocke en base64)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      flash.showSuccess('Image uploadée', 'Votre photo de profil a été mise à jour');
    } catch (error) {
      flash.showError('Erreur', 'Impossible d\'uploader l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await updateProfile(formData);
      if (success) {
        flash.showSuccess('Profil mis à jour', 'Vos informations ont été sauvegardées avec succès');
      }
    } catch (error) {
      flash.showError('Erreur', 'Impossible de mettre à jour votre profil');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800"
    >
      {/* Header */}
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Crown className="h-16 w-16 text-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl font-serif font-bold text-white mb-4">
            Mon Profil
          </h1>
          <p className="text-xl text-gold-200 max-w-3xl mx-auto">
            Gérez vos informations personnelles et préférences
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo de profil */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gold-500/20 text-center">
              <div className="relative inline-block mb-6">
                <img
                  src={formData.profileImage}
                  alt="Photo de profil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gold-500/30"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 rounded-full p-2 transition-colors"
                >
                  {uploadingImage ? (
                    <Loader className="h-4 w-4 text-luxury-900 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 text-luxury-900" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gold-300 mb-4">{user.email}</p>
              
              {user.isAdmin && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold-500/20 border border-gold-500/30">
                  <Crown className="h-4 w-4 text-gold-400 mr-2" />
                  <span className="text-gold-300 text-sm font-medium">Administrateur</span>
                </div>
              )}

              <div className="mt-6 p-4 bg-luxury-700/30 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Upload className="h-5 w-5 text-gold-400 mr-2" />
                  <span className="text-gold-200 text-sm font-medium">Changer la photo</span>
                </div>
                <p className="text-gold-400 text-xs">
                  Formats acceptés: JPG, PNG, GIF<br />
                  Taille max: 5MB
                </p>
              </div>
            </div>
          </motion.div>

          {/* Formulaire de modification */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gold-500/20">
              <h3 className="text-2xl font-serif font-bold text-white mb-6">
                Informations personnelles
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-luxury-700/30 border border-gold-500/20 rounded-lg text-gold-300 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-gold-400 text-xs mt-1">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gold-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-luxury-700/50 border border-gold-500/30 rounded-lg text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-luxury-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder les modifications
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;