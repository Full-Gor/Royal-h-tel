import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { Crown, Bed, Eye, Calendar, CreditCard, Star, Users, Wifi, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Room {
  id: string;
  name: string;
  category_name: string;
  beds: number;
  has_view: boolean;
  images: string[];
  description: string;
  amenities: string[];
  price_night: number;
  price_three_days: number;
  price_week: number;
  price_month: number;
  available: boolean;
  total_reservations: number;
}

const Chambres = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const flash = useFlash();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    duration: 'night',
    guests: 1
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);

      const { data: roomsData, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_categories(name)
        `)
        .eq('available', true)
        .order('name');

      if (error) {
        console.error('Erreur lors du chargement des chambres:', error);
        flash.showError('Erreur', 'Impossible de charger les chambres');
      } else {
        const formattedRooms = roomsData?.map(room => ({
          ...room,
          category_name: room.room_categories?.name || 'Non définie'
        })) || [];
        setRooms(formattedRooms);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors du chargement des chambres');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;

    const { duration } = bookingData;
    switch (duration) {
      case 'night':
        return selectedRoom.price_night;
      case 'threeDays':
        return selectedRoom.price_three_days;
      case 'week':
        return selectedRoom.price_week;
      case 'month':
        return selectedRoom.price_month;
      default:
        return selectedRoom.price_night;
    }
  };

  const handlePayment = async () => {
    if (!selectedRoom || !user) return;

    try {
      // Créer la réservation d'abord
      const bookingDetails = {
        user_id: user.id,
        room_id: selectedRoom.id,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut || bookingData.checkIn,
        guests: bookingData.guests,
        duration_type: bookingData.duration as 'night' | 'threeDays' | 'week' | 'month',
        total_amount: calculateTotal(),
        status: 'pending' as const,
        payment_status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingDetails])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la réservation:', error);
        flash.showError('Erreur', 'Impossible de créer la réservation');
        return;
      }

      // Créer la session Stripe avec les bonnes URLs
      const stripeResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: data.id,
          amount: calculateTotal(),
          roomName: selectedRoom.name,
          successUrl: `${window.location.origin}/success?booking_id=${data.id}`,
          cancelUrl: `${window.location.origin}/chambres`
        }),
      });

      if (!stripeResponse.ok) {
        throw new Error('Erreur lors de la création de la session Stripe');
      }

      const { url } = await stripeResponse.json();

      if (url) {
        // Redirection vers Stripe
        window.location.href = url;
      } else {
        throw new Error('URL de redirection Stripe manquante');
      }

    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors du paiement');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement des chambres...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.6 }}
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
            Nos Chambres d'Exception
          </h1>
          <p className="text-xl text-gold-200 max-w-3xl mx-auto mb-8">
            Découvrez nos {rooms.length} suites et chambres de luxe, chacune unique et raffinée
          </p>
          <div className="flex justify-center space-x-8 text-gold-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-500">{rooms.filter(r => r.available).length}</div>
              <div className="text-sm">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-500">{rooms.length - rooms.filter(r => r.available).length}</div>
              <div className="text-sm">Occupées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-500">{rooms.length > 0 ? Math.min(...rooms.map(r => r.price_night)) : 0}€</div>
              <div className="text-sm">À partir de</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Chambres Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.images[0] || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold-500 text-luxury-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {room.category_name}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    {room.has_view && (
                      <div className="bg-luxury-900/80 text-gold-300 p-2 rounded-full">
                        <Eye className="h-4 w-4" />
                      </div>
                    )}
                    <div className="bg-luxury-900/80 text-gold-300 p-2 rounded-full flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">{room.beds}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-luxury-900/80 text-gold-300 px-2 py-1 rounded-full text-xs">
                      {room.total_reservations} réservations
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {room.name}
                  </h3>
                  <p className="text-gold-200 mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="bg-luxury-700/50 text-gold-300 px-2 py-1 rounded-lg text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="bg-luxury-700/50 text-gold-300 px-2 py-1 rounded-lg text-xs">
                        +{room.amenities.length - 3} autres
                      </span>
                    )}
                  </div>

                  {/* Prices */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-200">Par nuit</span>
                      <span className="text-white font-semibold">{room.price_night}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-200">3 jours</span>
                      <span className="text-white font-semibold">{room.price_three_days}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-200">Semaine</span>
                      <span className="text-white font-semibold">{room.price_week}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gold-200">Mois</span>
                      <span className="text-white font-semibold">{room.price_month}€</span>
                    </div>
                  </div>

                  {/* Booking Button */}
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBooking(room)}
                      disabled={!room.available}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${room.available
                        ? 'bg-gold-500 hover:bg-gold-600 text-luxury-900'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        }`}
                    >
                      {room.available ? 'Réserver Maintenant' : 'Indisponible'}
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-500 text-gray-300 cursor-not-allowed"
                      title="Connectez-vous pour réserver"
                    >
                      Connectez-vous pour réserver
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
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
                  Réservation - {selectedRoom.name}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gold-300 hover:text-gold-200 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedRoom.images[0]}
                    alt={selectedRoom.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Équipements</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-luxury-700/50 text-gold-300 px-2 py-1 rounded-lg text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Durée du séjour
                    </label>
                    <select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="night">1 Nuit - {selectedRoom.price_night}€</option>
                      <option value="threeDays">3 Jours - {selectedRoom.price_three_days}€</option>
                      <option value="week">1 Semaine - {selectedRoom.price_week}€</option>
                      <option value="month">1 Mois - {selectedRoom.price_month}€</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Date d'arrivée
                    </label>
                    <input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Nombre d'invités
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    >
                      {[...Array(selectedRoom.beds)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1} invité{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-luxury-700/30 rounded-lg">
                <div className="flex justify-between items-center text-lg mb-2">
                  <span className="text-gold-200">Chambre</span>
                  <span className="text-white">{selectedRoom.name}</span>
                </div>
                <div className="flex justify-between items-center text-lg mb-2">
                  <span className="text-gold-200">Catégorie</span>
                  <span className="text-white">{selectedRoom.category_name}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold border-t border-gold-500/20 pt-2">
                  <span className="text-gold-200">Total</span>
                  <span className="text-white">{calculateTotal()}€</span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-luxury-700 hover:bg-luxury-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!bookingData.checkIn}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-luxury-900 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Réserver {calculateTotal()}€
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Chambres;