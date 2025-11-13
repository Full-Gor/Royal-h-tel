import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, Loader } from 'lucide-react';
import { useFlash } from '../contexts/FlashContext';
import { localStorageService } from '../lib/localStorageService';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const flash = useFlash();
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);

    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('booking_id');

    useEffect(() => {
        if (sessionId && bookingId) {
            verifyPayment();
        } else {
            setVerifying(false);
            flash.showError('Erreur', 'Paramètres de paiement manquants');
            navigate('/chambres');
        }
    }, [sessionId, bookingId]);

    const verifyPayment = async () => {
        try {
            // MODE DÉMO : Mettre à jour directement dans localStorage
            if (bookingId && bookingId.startsWith('booking-')) {
                console.log('📦 Mode démo détecté - Mise à jour localStorage');

                const bookings = localStorageService.getBookings();
                const booking = bookings.find(b => b.id === bookingId);

                if (booking) {
                    localStorageService.updateBooking(bookingId, {
                        status: 'confirmed',
                        payment_status: 'paid',
                        stripe_session_id: sessionId
                    });

                    setSuccess(true);
                    flash.showSuccess('Paiement confirmé', 'Votre réservation a été confirmée avec succès !');
                } else {
                    flash.showError('Erreur', 'Réservation introuvable');
                    navigate('/chambres');
                }
            } else {
                // MODE NORMAL : Appeler l'API pour vérifier avec Supabase
                const response = await fetch('/api/verify-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        booking_id: bookingId,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    setSuccess(true);
                    flash.showSuccess('Paiement confirmé', 'Votre réservation a été confirmée avec succès !');
                } else {
                    flash.showError('Paiement échoué', 'Le paiement n\'a pas pu être confirmé');
                    navigate('/chambres');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la vérification:', error);
            flash.showError('Erreur', 'Erreur lors de la vérification du paiement');
            navigate('/chambres');
        } finally {
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Vérification du paiement...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center"
        >
            <div className="max-w-2xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8"
                >
                    <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
                    <Crown className="h-16 w-16 text-gold-500 mx-auto" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-4xl md:text-5xl font-serif font-bold text-white mb-6"
                >
                    Réservation Confirmée !
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-xl text-gold-200 mb-8"
                >
                    Félicitations ! Votre réservation au Château Royal a été confirmée avec succès.
                    Un email de confirmation vous a été envoyé.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gold-300 mb-4">Que faire maintenant ?</h3>
                    <div className="space-y-3 text-left">
                        <div className="flex items-center text-gold-200">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span>Votre paiement a été traité avec succès</span>
                        </div>
                        <div className="flex items-center text-gold-200">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span>Un email de confirmation vous a été envoyé</span>
                        </div>
                        <div className="flex items-center text-gold-200">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <span>Vous pouvez consulter vos réservations dans votre profil</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => navigate('/bookings')}
                        className="bg-gold-500 hover:bg-gold-600 text-luxury-900 py-3 px-8 rounded-lg font-semibold transition-colors"
                    >
                        Voir mes réservations
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-luxury-700 hover:bg-luxury-600 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
                    >
                        Retour à l'accueil
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Success;
