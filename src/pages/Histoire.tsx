import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Dumbbell, Car } from 'lucide-react';

const Histoire = () => {
  const sections = [
    {
      id: 'casino',
      title: 'Salle de Jeu Royale',
      description: 'Plongez dans l\'atmosphère feutrée de notre casino privé, où l\'élégance rencontre l\'excitation. Tables de poker, roulette et machines à sous dans un cadre digne des plus grands palaces.',
      videoUrl: 'https://videos.pexels.com/video-files/7607945/7607945-uhd_2560_1440_25fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Sparkles
    },
    {
      id: 'spa',
      title: 'Spa & Wellness',
      description: 'Détendez-vous dans notre spa de luxe avec piscine chauffée, sauna finlandais, hammam traditionnel, jacuzzi et massages thaïlandais authentiques par nos thérapeutes certifiés.',
      videoUrl: 'https://videos.pexels.com/video-files/6616372/6616372-hd_1920_1080_25fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Dumbbell
    },
    {
      id: 'chambres',
      title: 'Chambres d\'Exception',
      description: 'Nos suites royales offrent un confort inégalé avec vue panoramique sur les jardins. Chaque chambre est unique, décorée avec des œuvres d\'art et des meubles d\'époque.',
      videoUrl: 'https://videos.pexels.com/video-files/6186665/6186665-uhd_2560_1440_30fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Crown
    },
    {
      id: 'voiturier',
      title: 'Service de Voiturier',
      description: 'Notre équipe de voituriers s\'occupe de vos véhicules de prestige avec le plus grand soin. Parking sécurisé et service de nettoyage disponible.',
      videoUrl: 'https://videos.pexels.com/video-files/5098925/5098925-hd_1920_1080_30fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Car
    }
  ];

  const VideoComponent = ({ videoUrl, fallbackImage, alt }: { videoUrl: string, fallbackImage: string, alt: string }) => {
    const [hasError, setHasError] = React.useState(false);

    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        {!hasError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-80 object-cover"
            onError={() => setHasError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={fallbackImage}
            alt={alt}
            className="w-full h-80 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900/50 to-transparent"></div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-r from-luxury-900 to-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Crown className="h-16 w-16 text-gold-500 mx-auto mb-6" />
            <h1 className="text-5xl font-serif font-bold text-white mb-6">
              Notre Histoire
            </h1>
            <p className="text-xl text-gold-200 max-w-3xl mx-auto">
              Découvrez l'héritage du Château Royal, où tradition aristocratique et luxe moderne se rencontrent
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vue Extérieure du Château */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <VideoComponent
            videoUrl="https://videos.pexels.com/video-files/6077464/6077464-uhd_2560_1440_30fps.mp4"
            fallbackImage="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Vue extérieure du château"
          />
          <div className="absolute inset-0 bg-luxury-900/40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Un Château d'Exception
              </h2>
              <p className="text-xl text-gold-200 max-w-2xl mx-auto">
                Construit au XVIIIe siècle, notre château incarne l'art de vivre à la française
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections avec vidéos */}
      {sections.map((section, index) => (
        <section key={section.id} className={`py-20 ${index % 2 === 0 ? 'bg-luxury-800' : 'bg-luxury-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2"
              >
                <VideoComponent
                  videoUrl={section.videoUrl}
                  fallbackImage={section.fallbackImage}
                  alt={section.title}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <div className="flex items-center mb-6">
                  <section.icon className="h-8 w-8 text-gold-500 mr-4" />
                  <h2 className="text-3xl font-serif font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-lg text-gold-200 leading-relaxed mb-8">
                  {section.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  En Savoir Plus
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Histoire Section */}
      <section className="py-20 bg-gradient-to-r from-gold-900 to-gold-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-white mb-8">
              Trois Siècles d'Excellence
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gold-100 mb-6 leading-relaxed">
                Depuis 1720, le Château Royal accueille l'élite européenne dans un cadre d'exception. 
                Construit par le Duc de Montclair, ce joyau architectural a traversé les siècles en 
                préservant son authenticité tout en s'adaptant aux exigences du luxe moderne.
              </p>
              <p className="text-lg text-gold-100 leading-relaxed">
                Aujourd'hui, nous perpétuons cette tradition d'excellence avec un service personnalisé 
                et des équipements de dernière génération, pour offrir à nos hôtes une expérience unique 
                alliant histoire, culture et raffinement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Histoire;