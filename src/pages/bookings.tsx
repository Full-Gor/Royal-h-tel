import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { Crown, Calendar, MapPin, Users, CreditCard, Clock, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Booking {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  duration_type: 'night' | 'threeDays' | 'week' | 'month';
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_id?: string;
  created_at: string;
  rooms?: {
    name: string;
    images: string[];
    room_categories?: {
      name: string;
    };
  };
}

const Bookings = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const flash = useFlash();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      flash.showWarning('Accès restreint', 'Veuillez vous connecter pour voir vos réservations');
      return;
    }

    loadBookings();
  }, [isAuthenticated, navigate, flash]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            name,
            images,
            room_categories (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des réservations:', error);
        flash.showError('Erreur', 'Impossible de charger vos réservations');
      } else {
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'failed':
      case 'refunded':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDurationLabel = (type: string) => {
    switch (type) {
      case 'night':
        return 'Nuit';
      case 'threeDays':
        return '3 Jours';
      case 'week':
        return 'Semaine';
      case 'month':
        return 'Mois';
      default:
        return type;
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement de vos réservations...</p>
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
      {/* Header */}
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Calendar className="h-16 w-16 text-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl font-serif font-bold text-white mb-4">
            Historique de vos Réservations
          </h1>
          <p className="text-xl text-gold-200 max-w-3xl mx-auto">
            Retrouvez toutes vos réservations passées et à venir au Château Royal
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <Calendar className="h-24 w-24 text-gold-500/50 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-white mb-4">
              Aucune réservation trouvée
            </h2>
            <p className="text-gold-200 mb-8">
              Vous n'avez pas encore effectué de réservation au Château Royal
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chambres')}
              className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Découvrir nos Chambres
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300"
              >
                {/* Image de la chambre */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={booking.rooms?.images?.[0] || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={booking.rooms?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold-500 text-luxury-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {booking.rooms?.room_categories?.name || 'Chambre'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-3">
                    {booking.rooms?.name || 'Chambre inconnue'}
                  </h3>

                  {/* Dates */}
                  <div className="flex items-center text-gold-200 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                    </span>
                  </div>

                  {/* Détails */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gold-200 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Invités
                      </span>
                      <span className="text-white font-medium">{booking.guests}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gold-200 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Durée
                      </span>
                      <span className="text-white font-medium">
                        {getDurationLabel(booking.duration_type)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gold-200 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Nuits
                      </span>
                      <span className="text-white font-medium">
                        {calculateNights(booking.check_in, booking.check_out)}
                      </span>
                    </div>
                  </div>

                  {/* Statut de paiement */}
                  <div className="mb-4">
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium border flex items-center justify-between ${getPaymentStatusColor(booking.payment_status)}`}>
                      <span className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Paiement {booking.payment_status}
                      </span>
                      <span className="font-bold">{booking.total_amount}€</span>
                    </div>
                  </div>

                  {/* Bouton détails */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewDetails(booking)}
                    className="w-full bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/30 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir les détails
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {showDetails && selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-luxury-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Détails de la réservation
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gold-300 hover:text-gold-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedBooking.rooms?.images?.[0]}
                    alt={selectedBooking.rooms?.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {selectedBooking.rooms?.name}
                    </h3>
                    <p className="text-gold-200">
                      {selectedBooking.rooms?.room_categories?.name}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gold-200">Réservation ID:</span>
                      <span className="text-white font-mono text-sm">
                        {selectedBooking.id.substring(0, 8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-200">Date de réservation:</span>
                      <span className="text-white">
                        {formatDate(selectedBooking.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-200">Arrivée:</span>
                      <span className="text-white">
                        {formatDate(selectedBooking.check_in)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-200">Départ:</span>
                      <span className="text-white">
                        {formatDate(selectedBooking.check_out)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-200">Invités:</span>
                      <span className="text-white">{selectedBooking.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gold-200">Type de séjour:</span>
                      <span className="text-white">
                        {getDurationLabel(selectedBooking.duration_type)}
                      </span>
                    </div>
                    {selectedBooking.stripe_payment_id && (
                      <div className="flex justify-between">
                        <span className="text-gold-200">ID Stripe:</span>
                        <span className="text-white font-mono text-sm">
                          {selectedBooking.stripe_payment_id.substring(0, 12)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-luxury-700/30 rounded-lg">
                <div className="flex justify-between items-center text-xl font-bold border-t border-gold-500/20 pt-4">
                  <span className="text-gold-200">Total payé:</span>
                  <span className="text-white">{selectedBooking.total_amount}€</span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-luxury-700 hover:bg-luxury-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Fermer
                </button>
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      // Ici vous pourriez ajouter une fonction pour télécharger la confirmation
                      flash.showInfo('Information', 'Fonction de téléchargement à venir');
                    }}
                    className="flex-1 bg-gold-500 hover:bg-gold-600 text-luxury-900 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Télécharger la confirmation
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Bookings;