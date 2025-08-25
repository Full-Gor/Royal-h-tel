import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Crown, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import { useFlash } from '../contexts/FlashContext';

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flash = useFlash();
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (sessionId && bookingId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId, bookingId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          booking_id: bookingId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentVerified(true);
        flash.showSuccess('Paiement confirmé', 'Votre réservation a été confirmée avec succès !');
      } else {
        flash.showError('Erreur de paiement', 'Le paiement n\'a pas pu être vérifié');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

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
            <CheckCircle className="h-24 w-24 text-green-400 mx-auto mb-6" />
            <h1 className="text-5xl font-serif font-bold text-white mb-4">
              Paiement Réussi !
            </h1>
            <p className="text-xl text-gold-200 max-w-2xl mx-auto">
              {paymentVerified 
                ? "Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation sous peu."
                : "Votre paiement a été traité. Nous vérifions actuellement votre réservation."
              }
            </p>
          </div>

          {sessionId && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gold-500/20"
            >
              <h2 className="text-2xl font-serif font-bold text-white mb-6">
                Détails de la transaction
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gold-400 mr-3" />
                  <div>
                    <p className="text-gold-200 text-sm">ID de session</p>
                    <p className="text-white font-mono text-sm">{sessionId.substring(0, 20)}...</p>
                  </div>
                </div>
                
                {bookingId && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gold-400 mr-3" />
                    <div>
                      <p className="text-gold-200 text-sm">ID de réservation</p>
                      <p className="text-white font-mono text-sm">{bookingId.substring(0, 20)}...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/bookings')}
              className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Voir mes réservations
              <ArrowRight className="h-5 w-5 ml-2" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chambres')}
              className="bg-luxury-700 hover:bg-luxury-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-gold-500/30"
            >
              Nouvelle réservation
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gold-300 text-sm">
              Un email de confirmation vous sera envoyé à l'adresse utilisée lors du paiement.
            </p>
            <p className="text-gold-400 text-sm mt-2">
              Pour toute question, contactez-nous à{' '}
              <a href="mailto:contact@royal-hotel.com" className="underline hover:text-gold-300">
                contact@royal-hotel.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Success;
