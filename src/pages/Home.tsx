import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Star, Shield, Clock, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      icon: Crown,
      title: 'Service Royal',
      description: 'Un service personnalisé digne de la royauté'
    },
    {
      icon: Star,
      title: 'Luxe Absolu',
      description: 'Des équipements et finitions de la plus haute qualité'
    },
    {
      icon: Shield,
      title: 'Sécurité Premium',
      description: 'Votre sécurité et confidentialité sont notre priorité'
    },
    {
      icon: Clock,
      title: 'Service 24/7',
      description: 'Notre équipe est à votre disposition jour et nuit'
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section avec Vidéo */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Erreur vidéo:', e);
              // Fallback vers une image si la vidéo ne charge pas
              e.currentTarget.style.display = 'none';
              const fallbackImg = document.createElement('img');
              fallbackImg.src = 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop';
              fallbackImg.className = 'w-full h-full object-cover';
              e.currentTarget.parentNode?.appendChild(fallbackImg);
            }}
          >
            <source src="https://videos.pexels.com/video-files/6053593/6053593-uhd_2560_1440_30fps.mp4" type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas les vidéos HTML5.
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-900/70 via-luxury-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Crown className="h-16 w-16 text-gold-500 mx-auto mb-6" />
              <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white mb-6">
                Château Royal
              </h1>
              <p className="text-xl sm:text-2xl text-gold-200 mb-8 leading-relaxed">
                Découvrez l'art de vivre à la française dans un cadre d'exception
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/histoire"
                  className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Découvrir Notre Histoire
                </Link>
                <button
                  onClick={() => navigate(isAuthenticated ? '/chambres' : '/login')}
                  className="border-2 border-gold-500 hover:bg-gold-500 text-gold-500 hover:text-luxury-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                >
                  Réserver Maintenant
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white"
        >
          <div className="w-6 h-10 border-2 border-gold-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gold-500 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Excellence & Raffinement
            </h2>
            <p className="text-xl text-gold-200 max-w-3xl mx-auto">
              Plongez dans un univers où chaque détail respire le luxe et l'élégance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-luxury-700/50 backdrop-blur-sm border border-gold-500/20 rounded-xl p-8 text-center hover:bg-luxury-700/70 transition-all duration-300"
              >
                <service.icon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gold-200">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-900 to-gold-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-white mb-6">
              Prêt pour une expérience inoubliable ?
            </h2>
            <p className="text-xl text-gold-100 mb-8 max-w-2xl mx-auto">
              Laissez-nous vous accueillir dans notre univers de raffinement et de prestige
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                className="bg-white hover:bg-gold-50 text-gold-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                Nous Contacter
              </Link>
              <div className="flex items-center text-white">
                <MapPin className="h-5 w-5 mr-2 text-gold-300" />
                <span>Arnaud Barotteaux - 06 44 76 27 21</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;