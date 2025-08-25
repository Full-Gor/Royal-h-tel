import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFlash } from '../contexts/FlashContext';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Users, 
  Bed, 
  TrendingUp, 
  Calendar, 
  Euro,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Loader,
  MessageCircle,
  Upload,
  Save,
  X,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

// Import conditionnel selon le mode
const isMySQLMode = import.meta.env.VITE_SITE_MODE === 'mysql';

interface RoomData {
  id: string;
  name: string;
  category_name: string;
  category_id: string;
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

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

interface BookingData {
  id: string;
  user_id: string;
  room_id: string;
  room_name: string;
  first_name: string;
  last_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  duration_type: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contact_method: string;
  status: string;
  created_at: string;
}

interface CategoryData {
  id: string;
  name: string;
  description: string;
  max_occupancy: number;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const flash = useFlash();
  const [activeTab, setActiveTab] = useState('overview');
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    occupancyRate: 0,
    newMessages: 0
  });

  // États pour les modales
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageData | null>(null);

  // Formulaire de chambre
  const [roomForm, setRoomForm] = useState({
    name: '',
    category_id: '',
    beds: 1,
    has_view: false,
    description: '',
    amenities: '',
    price_night: 0,
    price_three_days: 0,
    price_week: 0,
    price_month: 0,
    available: true
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      flash.showError('Accès refusé', 'Vous n\'avez pas les permissions pour accéder à cette page');
      return;
    }

    loadData();
  }, [isAdmin, navigate, flash]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (isMySQLMode) {
        const { DatabaseService } = await import('../lib/database');
        
        // Charger toutes les données
        const [roomsData, usersData, bookingsData, messagesData, statsData] = await Promise.all([
          DatabaseService.getAllRooms(),
          DatabaseService.getAllUsers(),
          DatabaseService.getAllBookings(),
          DatabaseService.getAllContactMessages(),
          DatabaseService.getStatistics()
        ]);

        setRooms(roomsData);
        setUsers(usersData);
        setBookings(bookingsData);
        setMessages(messagesData);
        setStats({
          ...statsData,
          newMessages: messagesData.filter(m => m.status === 'new').length
        });

      } else {
        const { supabase } = await import('../lib/supabase');
        
        // Charger les chambres
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select(`
            *,
            room_categories(name)
          `);

        if (roomsError) {
          console.error('Erreur lors du chargement des chambres:', roomsError);
          flash.showError('Erreur', 'Impossible de charger les chambres');
        } else {
          setRooms(roomsData?.map(room => ({
            ...room,
            category_name: room.room_categories?.name || 'Non définie'
          })) || []);
        }

        // Charger les utilisateurs
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (usersError) {
          console.error('Erreur lors du chargement des utilisateurs:', usersError);
        } else {
          setUsers(usersData || []);
        }

        // Charger les réservations
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            rooms(name),
            profiles(first_name, last_name)
          `)
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Erreur lors du chargement des réservations:', bookingsError);
        } else {
          setBookings(bookingsData?.map(booking => ({
            ...booking,
            room_name: booking.rooms?.name || 'Chambre supprimée',
            first_name: booking.profiles?.first_name || 'Utilisateur',
            last_name: booking.profiles?.last_name || 'Supprimé'
          })) || []);
        }

        // Charger les messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (messagesError) {
          console.error('Erreur lors du chargement des messages:', messagesError);
        } else {
          setMessages(messagesData || []);
        }

        // Calculer les statistiques
        if (roomsData && bookingsData) {
          const totalRooms = roomsData.length;
          const availableRooms = roomsData.filter(room => room.available).length;
          const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
          const totalRevenue = bookingsData
            .filter(booking => booking.payment_status === 'paid')
            .reduce((sum, booking) => sum + booking.total_amount, 0);

          setStats({
            totalRooms,
            availableRooms,
            totalBookings: bookingsData.length,
            occupancyRate,
            totalRevenue,
            newMessages: messagesData?.filter(m => m.status === 'new').length || 0
          });
        }
      }

      // Charger les catégories
      await loadCategories();

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      if (isMySQLMode) {
        const { getConnection } = await import('../lib/database');
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM room_categories ORDER BY name');
        setCategories(rows as CategoryData[]);
      } else {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('room_categories')
          .select('*')
          .order('name');
        
        if (!error) {
          setCategories(data || []);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const toggleRoomAvailability = async (roomId: string) => {
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return;

      if (isMySQLMode) {
        const { DatabaseService } = await import('../lib/database');
        await DatabaseService.updateRoomAvailability(roomId, !room.available);
      } else {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase
          .from('rooms')
          .update({ available: !room.available })
          .eq('id', roomId);

        if (error) {
          console.error('Erreur lors de la mise à jour:', error);
          flash.showError('Erreur', 'Impossible de modifier la disponibilité');
          return;
        }
      }

      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, available: !room.available } : room
      ));

      flash.showSuccess(
        'Disponibilité mise à jour',
        `La chambre est maintenant ${!room.available ? 'disponible' : 'indisponible'}`
      );
    } catch (error) {
      console.error('Erreur:', error);
      flash.showError('Erreur', 'Une erreur est survenue');
    }
  };

  const handleCreateRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      name: '',
      category_id: categories[0]?.id || '',
      beds: 1,
      has_view: false,
      description: '',
      amenities: '',
      price_night: 0,
      price_three_days: 0,
      price_week: 0,
      price_month: 0,
      available: true
    });
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: RoomData) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      category_id: room.category_id,
      beds: room.beds,
      has_view: room.has_view,
      description: room.description,
      amenities: room.amenities.join(', '),
      price_night: room.price_night,
      price_three_days: room.price_three_days,
      price_week: room.price_week,
      price_month: room.price_month,
      available: room.available
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async () => {
    try {
      if (!roomForm.name || !roomForm.category_id) {
        flash.showError('Validation', 'Veuillez remplir tous les champs obligatoires');
        return;
      }

      const roomData = {
        ...roomForm,
        amenities: roomForm.amenities.split(',').map(a => a.trim()).filter(a => a)
      };

      if (isMySQLMode) {
        const { getConnection } = await import('../lib/database');
        const connection = await getConnection();

        if (editingRoom) {
          // Mise à jour
          await connection.execute(`
            UPDATE rooms SET 
              name = ?, category_id = ?, beds = ?, has_view = ?, description = ?,
              amenities = ?, price_night = ?, price_three_days = ?, price_week = ?, 
              price_month = ?, available = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            roomData.name, roomData.category_id, roomData.beds, roomData.has_view,
            roomData.description, JSON.stringify(roomData.amenities),
            roomData.price_night, roomData.price_three_days, roomData.price_week,
            roomData.price_month, roomData.available, editingRoom.id
          ]);
        } else {
          // Création
          const roomId = crypto.randomUUID();
          await connection.execute(`
            INSERT INTO rooms (
              id, name, category_id, beds, has_view, description, amenities,
              price_night, price_three_days, price_week, price_month, available
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            roomId, roomData.name, roomData.category_id, roomData.beds, roomData.has_view,
            roomData.description, JSON.stringify(roomData.amenities),
            roomData.price_night, roomData.price_three_days, roomData.price_week,
            roomData.price_month, roomData.available
          ]);
        }
      } else {
        const { supabase } = await import('../lib/supabase');
        
        if (editingRoom) {
          const { error } = await supabase
            .from('rooms')
            .update(roomData)
            .eq('id', editingRoom.id);
          
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('rooms')
            .insert([roomData]);
          
          if (error) throw error;
        }
      }

      flash.showSuccess(
        editingRoom ? 'Chambre modifiée' : 'Chambre créée',
        'Les modifications ont été sauvegardées'
      );
      
      setShowRoomModal(false);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      flash.showError('Erreur', 'Impossible de sauvegarder la chambre');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) return;

    try {
      if (isMySQLMode) {
        const { getConnection } = await import('../lib/database');
        const connection = await getConnection();
        await connection.execute('DELETE FROM rooms WHERE id = ?', [roomId]);
      } else {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId);
        
        if (error) throw error;
      }

      setRooms(prev => prev.filter(room => room.id !== roomId));
      flash.showSuccess('Chambre supprimée', 'La chambre a été supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      flash.showError('Erreur', 'Impossible de supprimer la chambre');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      if (isMySQLMode) {
        const { DatabaseService } = await import('../lib/database');
        await DatabaseService.deleteUser(userId);
      } else {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
      }

      setUsers(prev => prev.filter(user => user.id !== userId));
      flash.showSuccess('Utilisateur supprimé', 'L\'utilisateur a été supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      flash.showError('Erreur', 'Impossible de supprimer l\'utilisateur');
    }
  };

  const handleViewMessage = async (message: ContactMessageData) => {
    setSelectedMessage(message);
    setShowMessageModal(true);

    // Marquer comme lu
    if (message.status === 'new') {
      try {
        if (isMySQLMode) {
          const { getConnection } = await import('../lib/database');
          const connection = await getConnection();
          await connection.execute(
            'UPDATE contact_messages SET status = ? WHERE id = ?',
            ['read', message.id]
          );
        } else {
          const { supabase } = await import('../lib/supabase');
          await supabase
            .from('contact_messages')
            .update({ status: 'read' })
            .eq('id', message.id);
        }

        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'read' } : m
        ));
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      if (isMySQLMode) {
        const { getConnection } = await import('../lib/database');
        const connection = await getConnection();
        await connection.execute(
          'UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [status, bookingId]
        );
      } else {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', bookingId);
        
        if (error) throw error;
      }

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));

      flash.showSuccess('Statut mis à jour', 'Le statut de la réservation a été modifié');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      flash.showError('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'rooms', name: 'Chambres', icon: Bed },
    { id: 'bookings', name: 'Réservations', icon: Calendar },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'messages', name: 'Messages', icon: MessageCircle, badge: stats.newMessages },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: 90 }}
      animate={{ opacity: 1, rotateX: 0 }}
      exit={{ opacity: 0, rotateX: -90 }}
      transition={{ duration: 0.6 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800"
    >
      {/* Header */}
      <section className="py-12 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <Crown className="h-10 w-10 text-gold-500 mr-4" />
              <div>
                <h1 className="text-3xl font-serif font-bold text-white">
                  Dashboard Administrateur
                </h1>
                <p className="text-gold-200">
                  Bienvenue, {user?.first_name} {user?.last_name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-500">
                {stats.totalRevenue.toLocaleString()}€
              </div>
              <div className="text-sm text-gold-200">
                Chiffre d'affaires total
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-64"
          >
            <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                      activeTab === tab.id
                        ? 'bg-gold-500 text-luxury-900'
                        : 'text-gold-200 hover:bg-gold-500/20'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                    {tab.badge && tab.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Chambres Occupées', value: `${stats.totalRooms - stats.availableRooms}/${stats.totalRooms}`, icon: Bed, color: 'bg-blue-500' },
                    { title: 'Taux d\'Occupation', value: `${stats.occupancyRate}%`, icon: TrendingUp, color: 'bg-green-500' },
                    { title: 'Réservations', value: stats.totalBookings, icon: Calendar, color: 'bg-purple-500' },
                    { title: 'Revenus', value: `${stats.totalRevenue.toLocaleString()}€`, icon: Euro, color: 'bg-gold-500' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-luxury-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gold-200 text-sm">{stat.title}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Réservations récentes */}
                <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20">
                  <h3 className="text-xl font-serif font-bold text-white mb-4">
                    Réservations Récentes
                  </h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-luxury-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">
                            {booking.first_name} {booking.last_name}
                          </p>
                          <p className="text-gold-200 text-sm">
                            {booking.room_name} - {new Date(booking.check_in).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gold-500 font-bold">{booking.total_amount}€</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gestion des Chambres */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold text-white">
                    Gestion des Chambres
                  </h2>
                  <button 
                    onClick={handleCreateRoom}
                    className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-4 py-2 rounded-lg font-semibold flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une chambre
                  </button>
                </div>

                <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl border border-gold-500/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-luxury-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Nom</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Catégorie</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Prix/Nuit</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Statut</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Réservations</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room.id} className="border-t border-gold-500/10">
                            <td className="px-6 py-4 text-white font-medium">{room.name}</td>
                            <td className="px-6 py-4 text-gold-200">{room.category_name}</td>
                            <td className="px-6 py-4 text-white">{room.price_night}€</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                room.available 
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {room.available ? 'Disponible' : 'Indisponible'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gold-200">{room.total_reservations}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => toggleRoomAvailability(room.id)}
                                  className="text-gold-400 hover:text-gold-300"
                                  title="Changer la disponibilité"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleEditRoom(room)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Gestion des Réservations */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Gestion des Réservations
                </h2>

                <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl border border-gold-500/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-luxury-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Client</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Chambre</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Dates</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Montant</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Statut</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-t border-gold-500/10">
                            <td className="px-6 py-4 text-white font-medium">
                              {booking.first_name} {booking.last_name}
                            </td>
                            <td className="px-6 py-4 text-gold-200">{booking.room_name}</td>
                            <td className="px-6 py-4 text-gold-200">
                              {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-white">{booking.total_amount}€</td>
                            <td className="px-6 py-4">
                              <select
                                value={booking.status}
                                onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                                className="bg-luxury-700 border border-gold-500/30 rounded px-2 py-1 text-white text-sm"
                              >
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="cancelled">Annulée</option>
                                <option value="completed">Terminée</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                booking.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {booking.payment_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Gestion des Utilisateurs */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Gestion des Utilisateurs
                </h2>

                <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl border border-gold-500/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-luxury-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Nom</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Email</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Inscription</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Rôle</th>
                          <th className="px-6 py-4 text-left text-gold-200 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t border-gold-500/10">
                            <td className="px-6 py-4 text-white font-medium">
                              {user.first_name} {user.last_name}
                            </td>
                            <td className="px-6 py-4 text-gold-200">{user.email}</td>
                            <td className="px-6 py-4 text-gold-200">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.is_admin 
                                  ? 'bg-gold-500/20 text-gold-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {user.is_admin ? 'Admin' : 'Utilisateur'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                {!user.is_admin && (
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Messages de Contact */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Messages de Contact
                </h2>

                <div className="grid gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`bg-luxury-800/50 backdrop-blur-sm rounded-xl p-6 border cursor-pointer transition-colors ${
                        message.status === 'new' 
                          ? 'border-gold-500/50 bg-gold-500/5' 
                          : 'border-gold-500/20'
                      }`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {message.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.status === 'new' ? 'bg-green-500/20 text-green-400' :
                              message.status === 'read' ? 'bg-blue-500/20 text-blue-400' :
                              message.status === 'replied' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {message.status}
                            </span>
                          </div>
                          <p className="text-gold-200 mb-2">{message.subject}</p>
                          <p className="text-gold-300 text-sm line-clamp-2">
                            {message.message}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gold-400">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {message.email}
                            </span>
                            {message.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {message.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paramètres */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Paramètres du Système
                </h2>
                <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Mode de Base de Données</h3>
                      <p className="text-gold-200">
                        Mode actuel : <span className="font-semibold text-gold-500">
                          {isMySQLMode ? 'MySQL Local' : 'Supabase Cloud'}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Statistiques</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-luxury-700/30 p-4 rounded-lg">
                          <p className="text-gold-200">Total Chambres</p>
                          <p className="text-2xl font-bold text-white">{stats.totalRooms}</p>
                        </div>
                        <div className="bg-luxury-700/30 p-4 rounded-lg">
                          <p className="text-gold-200">Total Utilisateurs</p>
                          <p className="text-2xl font-bold text-white">{users.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal Chambre */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-luxury-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  {editingRoom ? 'Modifier la chambre' : 'Nouvelle chambre'}
                </h2>
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="text-gold-300 hover:text-gold-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Nom de la chambre
                    </label>
                    <input
                      type="text"
                      value={roomForm.name}
                      onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                      placeholder="Suite Royale..."
                    />
                  </div>
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Catégorie
                    </label>
                    <select
                      value={roomForm.category_id}
                      onChange={(e) => setRoomForm({...roomForm, category_id: e.target.value})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Nombre de lits
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={roomForm.beds}
                      onChange={(e) => setRoomForm({...roomForm, beds: parseInt(e.target.value)})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center text-gold-200">
                      <input
                        type="checkbox"
                        checked={roomForm.has_view}
                        onChange={(e) => setRoomForm({...roomForm, has_view: e.target.checked})}
                        className="mr-2"
                      />
                      Vue panoramique
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={roomForm.description}
                    onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                    rows={3}
                    className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Description de la chambre..."
                  />
                </div>

                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Équipements (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={roomForm.amenities}
                    onChange={(e) => setRoomForm({...roomForm, amenities: e.target.value})}
                    className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    placeholder="Jacuzzi, Balcon, Minibar..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Prix par nuit (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={roomForm.price_night}
                      onChange={(e) => setRoomForm({...roomForm, price_night: parseFloat(e.target.value)})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Prix 3 jours (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={roomForm.price_three_days}
                      onChange={(e) => setRoomForm({...roomForm, price_three_days: parseFloat(e.target.value)})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Prix semaine (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={roomForm.price_week}
                      onChange={(e) => setRoomForm({...roomForm, price_week: parseFloat(e.target.value)})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-2">
                      Prix mois (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={roomForm.price_month}
                      onChange={(e) => setRoomForm({...roomForm, price_month: parseFloat(e.target.value)})}
                      className="w-full bg-luxury-700 border border-gold-500/30 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-gold-200">
                    <input
                      type="checkbox"
                      checked={roomForm.available}
                      onChange={(e) => setRoomForm({...roomForm, available: e.target.checked})}
                      className="mr-2"
                    />
                    Chambre disponible
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowRoomModal(false)}
                  className="flex-1 bg-luxury-700 hover:bg-luxury-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveRoom}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-luxury-900 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Message */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-luxury-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Message de {selectedMessage.name}
                </h2>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gold-300 hover:text-gold-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gold-200 text-sm font-medium mb-1">
                      Email
                    </label>
                    <p className="text-white">{selectedMessage.email}</p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-gold-200 text-sm font-medium mb-1">
                        Téléphone
                      </label>
                      <p className="text-white">{selectedMessage.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-1">
                    Sujet
                  </label>
                  <p className="text-white font-semibold">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-1">
                    Message
                  </label>
                  <div className="bg-luxury-700/30 p-4 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gold-400">
                  <span>Méthode préférée: {selectedMessage.contact_method}</span>
                  <span>Reçu le: {new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 bg-luxury-700 hover:bg-luxury-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`;
                  }}
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-luxury-900 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Répondre par email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;