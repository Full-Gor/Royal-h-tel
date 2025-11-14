/**
 * Service de stockage local pour le mode démo
 * Permet de stocker et gérer toutes les données dans le navigateur
 */

// Clés de stockage
const STORAGE_KEYS = {
  ROOMS: 'demo_rooms',
  USERS: 'demo_users',
  BOOKINGS: 'demo_bookings',
  MESSAGES: 'demo_messages',
  CATEGORIES: 'demo_categories',
  MENU_CATEGORIES: 'demo_menu_categories',
  MENU_ITEMS: 'demo_menu_items',
  CURRENT_USER: 'demo_user'
};

// Types
interface Room {
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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  isAdmin: boolean;
  created_at?: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
}

interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  room_name: string;
  first_name: string;
  last_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  adults?: number;
  children?: number;
  duration_type: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface Message {
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

interface Category {
  id: string;
  name: string;
  description: string;
  max_occupancy: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  active?: boolean;
  display_order?: number;
}

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available?: boolean;
  allergens?: string[];
  is_vegetarian?: boolean;
}

class LocalStorageService {
  // Initialiser les données de démo si elles n'existent pas
  initialize() {
    // Initialiser les chambres
    if (!this.getRooms().length) {
      const defaultRooms: Room[] = [
        {
          id: 'demo-1',
          name: 'Suite Royale Impériale',
          category_name: 'Suite Présidentielle',
          category_id: 'cat-1',
          beds: 2,
          has_view: true,
          images: ['https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200'],
          description: 'Notre suite la plus prestigieuse avec vue panoramique sur la ville.',
          amenities: ['Jacuzzi privé', 'Vue panoramique', 'Butler 24/7', 'Terrasse privée', 'Salle de cinéma'],
          price_night: 850,
          price_three_days: 2400,
          price_week: 5200,
          price_month: 20000,
          available: true,
          total_reservations: 47
        },
        {
          id: 'demo-2',
          name: 'Suite Deluxe Palace',
          category_name: 'Suite Deluxe',
          category_id: 'cat-2',
          beds: 2,
          has_view: true,
          images: ['https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200'],
          description: 'Suite élégante avec balcon et vue magnifique.',
          amenities: ['Balcon privé', 'Minibar premium', 'Salle de bain marbre', 'Bureau'],
          price_night: 450,
          price_three_days: 1250,
          price_week: 2800,
          price_month: 11000,
          available: true,
          total_reservations: 89
        },
        {
          id: 'demo-3',
          name: 'Chambre Executive',
          category_name: 'Chambre Executive',
          category_id: 'cat-3',
          beds: 1,
          has_view: true,
          images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200'],
          description: 'Chambre confortable parfaite pour les voyageurs d\'affaires.',
          amenities: ['Bureau', 'WiFi haute vitesse', 'Minibar', 'Coffre-fort'],
          price_night: 280,
          price_three_days: 780,
          price_week: 1750,
          price_month: 6800,
          available: true,
          total_reservations: 156
        }
      ];
      this.saveRooms(defaultRooms);
    }

    // Initialiser les catégories
    if (!this.getCategories().length) {
      const defaultCategories: Category[] = [
        { id: 'cat-1', name: 'Suite Présidentielle', description: 'Le summum du luxe', max_occupancy: 4 },
        { id: 'cat-2', name: 'Suite Deluxe', description: 'Élégance et confort', max_occupancy: 3 },
        { id: 'cat-3', name: 'Chambre Executive', description: 'Pour les professionnels', max_occupancy: 2 }
      ];
      this.saveCategories(defaultCategories);
    }

    // Initialiser les catégories de menu
    if (!this.getMenuCategories().length) {
      const defaultMenuCategories: MenuCategory[] = [
        { id: 'menu-cat-1', name: 'Petit-Déjeuner', description: 'Commencez votre journée', active: true, display_order: 1 },
        { id: 'menu-cat-2', name: 'Déjeuner', description: 'Plats savoureux', active: true, display_order: 2 },
        { id: 'menu-cat-3', name: 'Dîner', description: 'Cuisine gastronomique', active: true, display_order: 3 },
        { id: 'menu-cat-4', name: 'Boissons', description: 'Carte des boissons', active: true, display_order: 4 }
      ];
      this.saveMenuCategories(defaultMenuCategories);
    }

    // Initialiser les items du menu
    if (!this.getMenuItems().length) {
      const defaultMenuItems: MenuItem[] = [
        // Petit-Déjeuner
        {
          id: 'item-1',
          category_id: 'menu-cat-1',
          name: 'Petit-Déjeuner Continental',
          description: 'Viennoiseries fraîches, confitures maison, jus d\'orange pressé, café ou thé',
          price: 22,
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Croissants', 'Pain au chocolat', 'Confitures maison'],
          is_vegetarian: true
        },
        {
          id: 'item-2',
          category_id: 'menu-cat-1',
          name: 'Petit-Déjeuner Anglais',
          description: 'Œufs brouillés crémeux, bacon croustillant, saucisses artisanales',
          price: 28,
          image: 'https://images.pexels.com/photos/2662875/pexels-photo-2662875.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Œufs', 'Bacon', 'Saucisses'],
          is_vegetarian: false
        },
        {
          id: 'item-3',
          category_id: 'menu-cat-1',
          name: 'Pancakes aux Fruits Rouges',
          description: 'Pancakes moelleux garnis de fruits rouges frais, sirop d\'érable pur',
          price: 18,
          image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Pancakes', 'Fruits rouges', 'Sirop d\'érable'],
          is_vegetarian: true
        },
        // Déjeuner
        {
          id: 'item-4',
          category_id: 'menu-cat-2',
          name: 'Salade César Royale',
          description: 'Salade romaine croquante, poulet grillé mariné, parmesan AOP, croûtons dorés',
          price: 24,
          image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Salade romaine', 'Poulet', 'Parmesan'],
          is_vegetarian: false
        },
        {
          id: 'item-5',
          category_id: 'menu-cat-2',
          name: 'Risotto aux Cèpes',
          description: 'Riz Carnaroli crémeux, cèpes sauvages, parmesan Reggiano, truffe noire',
          price: 32,
          image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Riz Carnaroli', 'Cèpes', 'Parmesan', 'Truffe'],
          is_vegetarian: true
        },
        {
          id: 'item-6',
          category_id: 'menu-cat-2',
          name: 'Pavé de Saumon Grillé',
          description: 'Saumon norvégien grillé, légumes de saison rôtis, sauce citron-aneth',
          price: 36,
          image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Saumon', 'Légumes', 'Citron'],
          is_vegetarian: false
        },
        // Dîner
        {
          id: 'item-7',
          category_id: 'menu-cat-3',
          name: 'Filet de Bœuf Rossini',
          description: 'Filet de bœuf français Label Rouge, foie gras poêlé, truffe noire',
          price: 58,
          image: 'https://images.pexels.com/photos/2613157/pexels-photo-2613157.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Filet de bœuf', 'Foie gras', 'Truffe'],
          is_vegetarian: false
        },
        {
          id: 'item-8',
          category_id: 'menu-cat-3',
          name: 'Homard Thermidor',
          description: 'Homard breton entier gratiné, sauce crémeuse au cognac, moutarde de Dijon',
          price: 68,
          image: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Homard', 'Cognac', 'Crème'],
          is_vegetarian: false
        },
        {
          id: 'item-9',
          category_id: 'menu-cat-3',
          name: 'Magret de Canard aux Cerises',
          description: 'Magret de canard du Sud-Ouest, cerises noires confites, sauce au vin rouge',
          price: 42,
          image: 'https://images.pexels.com/photos/6210746/pexels-photo-6210746.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Magret de canard', 'Cerises', 'Vin rouge'],
          is_vegetarian: false
        },
        {
          id: 'item-10',
          category_id: 'menu-cat-3',
          name: 'Assiette Végétarienne Gastronomique',
          description: 'Légumes bio de saison rôtis et grillés, quinoa aux herbes, houmous maison',
          price: 34,
          image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Légumes bio', 'Quinoa', 'Pois chiches'],
          is_vegetarian: true
        },
        // Boissons
        {
          id: 'item-11',
          category_id: 'menu-cat-4',
          name: 'Jus d\'Orange Pressé Frais',
          description: 'Oranges fraîchement pressées, saveur naturelle et vitaminée',
          price: 8,
          image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Oranges fraîches'],
          is_vegetarian: true
        },
        {
          id: 'item-12',
          category_id: 'menu-cat-4',
          name: 'Cocktail de Fruits Tropicaux',
          description: 'Mélange exotique de mangue, ananas et fruit de la passion',
          price: 12,
          image: 'https://images.pexels.com/photos/1486218/pexels-photo-1486218.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Mangue', 'Ananas', 'Fruit de la passion'],
          is_vegetarian: true
        },
        {
          id: 'item-13',
          category_id: 'menu-cat-4',
          name: 'Smoothie Fruits Rouges',
          description: 'Fraises, framboises et myrtilles mixées avec yaourt grec',
          price: 10,
          image: 'https://images.pexels.com/photos/775032/pexels-photo-775032.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Fraises', 'Framboises', 'Myrtilles', 'Yaourt'],
          is_vegetarian: true
        },
        {
          id: 'item-14',
          category_id: 'menu-cat-4',
          name: 'Jus Vert Détox',
          description: 'Concombre, céleri, pomme verte, épinards et citron',
          price: 9,
          image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=1200',
          available: true,
          allergens: ['Concombre', 'Céleri', 'Pomme', 'Épinards'],
          is_vegetarian: true
        }
      ];
      this.saveMenuItems(defaultMenuItems);
    }
  }

  // === ROOMS ===
  getRooms(): Room[] {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return data ? JSON.parse(data) : [];
  }

  saveRooms(rooms: Room[]) {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }

  addRoom(room: Room) {
    const rooms = this.getRooms();
    rooms.push(room);
    this.saveRooms(rooms);
    return room;
  }

  updateRoom(roomId: string, updates: Partial<Room>) {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.id === roomId);
    if (index !== -1) {
      rooms[index] = { ...rooms[index], ...updates };
      this.saveRooms(rooms);
      return rooms[index];
    }
    return null;
  }

  deleteRoom(roomId: string) {
    const rooms = this.getRooms().filter(r => r.id !== roomId);
    this.saveRooms(rooms);
    return true;
  }

  // === USERS ===
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [
      {
        id: 'demo-user-1',
        email: 'user@demo.com',
        firstName: 'Utilisateur',
        lastName: 'Demo',
        phone: '0612345678',
        profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        isAdmin: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'demo-admin-1',
        email: 'nazari@admin.com',
        firstName: 'Nazari',
        lastName: 'Administrateur',
        phone: '0644762721',
        profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        isAdmin: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  updateCurrentUser(updates: Partial<User>) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

    // Mettre à jour aussi dans la liste des utilisateurs
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }

    return updatedUser;
  }

  // === BOOKINGS ===
  getBookings(): Booking[] {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  }

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }

  addBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.push(booking);
    this.saveBookings(bookings);

    // Incrémenter le nombre de réservations de la chambre
    const room = this.getRooms().find(r => r.id === booking.room_id);
    if (room) {
      this.updateRoom(room.id, { total_reservations: (room.total_reservations || 0) + 1 });
    }

    return booking;
  }

  updateBooking(bookingId: string, updates: Partial<Booking>) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      this.saveBookings(bookings);
      return bookings[index];
    }
    return null;
  }

  deleteBooking(bookingId: string) {
    const bookings = this.getBookings().filter(b => b.id !== bookingId);
    this.saveBookings(bookings);
    return true;
  }

  // === MESSAGES ===
  getMessages(): Message[] {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return data ? JSON.parse(data) : [];
  }

  saveMessages(messages: Message[]) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  addMessage(message: Message) {
    const messages = this.getMessages();
    messages.push(message);
    this.saveMessages(messages);
    return message;
  }

  updateMessage(messageId: string, updates: Partial<Message>) {
    const messages = this.getMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates };
      this.saveMessages(messages);
      return messages[index];
    }
    return null;
  }

  deleteMessage(messageId: string) {
    const messages = this.getMessages().filter(m => m.id !== messageId);
    this.saveMessages(messages);
    return true;
  }

  // === CATEGORIES ===
  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  saveCategories(categories: Category[]) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  // === MENU CATEGORIES ===
  getMenuCategories(): MenuCategory[] {
    const data = localStorage.getItem(STORAGE_KEYS.MENU_CATEGORIES);
    return data ? JSON.parse(data) : [];
  }

  saveMenuCategories(categories: MenuCategory[]) {
    localStorage.setItem(STORAGE_KEYS.MENU_CATEGORIES, JSON.stringify(categories));
  }

  addMenuCategory(category: MenuCategory) {
    const categories = this.getMenuCategories();
    categories.push(category);
    this.saveMenuCategories(categories);
    return category;
  }

  updateMenuCategory(categoryId: string, updates: Partial<MenuCategory>) {
    const categories = this.getMenuCategories();
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveMenuCategories(categories);
      return categories[index];
    }
    return null;
  }

  deleteMenuCategory(categoryId: string) {
    const categories = this.getMenuCategories().filter(c => c.id !== categoryId);
    this.saveMenuCategories(categories);
    // Supprimer aussi les items de cette catégorie
    const items = this.getMenuItems().filter(i => i.category_id !== categoryId);
    this.saveMenuItems(items);
    return true;
  }

  // === MENU ITEMS ===
  getMenuItems(): MenuItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    return data ? JSON.parse(data) : [];
  }

  saveMenuItems(items: MenuItem[]) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  }

  addMenuItem(item: MenuItem) {
    const items = this.getMenuItems();
    items.push(item);
    this.saveMenuItems(items);
    return item;
  }

  updateMenuItem(itemId: string, updates: Partial<MenuItem>) {
    const items = this.getMenuItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveMenuItems(items);
      return items[index];
    }
    return null;
  }

  deleteMenuItem(itemId: string) {
    const items = this.getMenuItems().filter(i => i.id !== itemId);
    this.saveMenuItems(items);
    return true;
  }

  // === STATS ===
  getStats() {
    const rooms = this.getRooms();
    const bookings = this.getBookings();
    const messages = this.getMessages();

    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.available).length;
    const totalBookings = bookings.length;
    const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
    const totalRevenue = bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + b.total_amount, 0);
    const newMessages = messages.filter(m => m.status === 'new').length;

    return {
      totalRooms,
      availableRooms,
      totalBookings,
      occupancyRate,
      totalRevenue,
      newMessages
    };
  }

  // === RESET ===
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const localStorageService = new LocalStorageService();
