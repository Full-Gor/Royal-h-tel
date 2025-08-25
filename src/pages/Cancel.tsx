import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Crown, ArrowLeft, CreditCard, RefreshCw } from 'lucide-react';
import { useFlash } from '../contexts/FlashContext';

const Cancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flash = useFlash();

  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    flash.showWarning('Paiement annulé', 'Votre paiement a été annulé. Votre réservation reste en attente.');
  }, [flash]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <div className="mb-8">
            <XCircle className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-5xl font-serif font-bold text-white mb-4">
              Paiement Annulé
            </h1>
            <p className="text-xl text-gold-200 max-w-2xl mx-auto">
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
              Votre réservation reste temporairement en attente.
            </p>
          </div>

          {bookingId && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-yellow-500/20"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-4">
                Que s'est-il passé ?
              </h2>
              
              <div className="text-left space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-500/20 p-2 rounded-lg mr-4">
                    <CreditCard className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Paiement interrompu</p>
                    <p className="text-gold-200 text-sm">
                      Vous avez fermé la fenêtre de paiement ou cliqué sur "Retour"
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                    <RefreshCw className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Réservation en attente</p>
                    <p className="text-gold-200 text-sm">
                      Votre réservation #{bookingId.substring(0, 8)}... est temporairement conservée
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-luxury-800/30 rounded-2xl p-6 mb-8 border border-gold-500/20"
          >
            <h3 className="text-xl font-serif font-bold text-white mb-4">
              Options disponibles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-luxury-700/30 rounded-lg p-4">
                <h4 className="text-gold-400 font-semibold mb-2">Réessayer le paiement</h4>
                <p className="text-gold-200">
                  Retournez aux chambres et refaites une réservation
                </p>
              </div>
              
              <div className="bg-luxury-700/30 rounded-lg p-4">
                <h4 className="text-gold-400 font-semibold mb-2">Modifier votre réservation</h4>
                <p className="text-gold-200">
                  Consultez vos réservations en cours et modifiez les détails
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chambres')}
              className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Réessayer le paiement
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bookings')}
              className="bg-luxury-700 hover:bg-luxury-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-gold-500/30"
            >
              Voir mes réservations
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-luxury-600 hover:bg-luxury-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12 text-center"
          >
            <p className="text-gold-300 text-sm">
              Besoin d'aide ? Notre équipe est disponible 24h/24.
            </p>
            <p className="text-gold-400 text-sm mt-2">
              Contactez-nous à{' '}
              <a href="mailto:contact@royal-hotel.com" className="underline hover:text-gold-300">
                contact@royal-hotel.com
              </a>
              {' '}ou au{' '}
              <a href="tel:+33123456789" className="underline hover:text-gold-300">
                01 23 45 67 89
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cancel;
