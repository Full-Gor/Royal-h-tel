// /*
// // ... tout le code existant du fichier est maintenant commenté pour éviter les erreurs de build côté front-end ...
// // ... existing code ...
// */

// import mysql from 'mysql2/promise';

// // Configuration de la base de données
// const dbConfig = {
//   host: import.meta.env.VITE_DB_HOST || 'localhost',
//   user: import.meta.env.VITE_DB_USER || 'root',
//   password: import.meta.env.VITE_DB_PASSWORD || '',
//   database: import.meta.env.VITE_DB_NAME || 'chateau_royal',
//   port: parseInt(import.meta.env.VITE_DB_PORT || '3306'),
//   charset: 'utf8mb4'
// };

// // Pool de connexions pour optimiser les performances
// let pool: mysql.Pool | null = null;

// export const getConnection = async () => {
//   if (!pool) {
//     pool = mysql.createPool({
//       ...dbConfig,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//       acquireTimeout: 60000,
//       timeout: 60000
//     });
//   }
//   return pool;
// };

// // Interface pour les utilisateurs
// export interface DatabaseUser {
//   id: string;
//   email: string;
//   password_hash: string;
//   email_verified: boolean;
//   created_at: string;
//   updated_at: string;
// }

// // Interface pour les profils
// export interface DatabaseProfile {
//   id: string;
//   first_name: string;
//   last_name: string;
//   phone?: string;
//   profile_image: string;
//   is_admin: boolean;
//   created_at: string;
//   updated_at: string;
// }

// // Interface pour les chambres
// export interface DatabaseRoom {
//   id: string;
//   name: string;
//   category_id: string;
//   beds: number;
//   has_view: boolean;
//   images: string[];
//   description: string;
//   amenities: string[];
//   price_night: number;
//   price_three_days: number;
//   price_week: number;
//   price_month: number;
//   available: boolean;
//   total_reservations: number;
//   created_at: string;
//   updated_at: string;
//   category_name?: string;
// }

// // Interface pour les réservations
// export interface DatabaseBooking {
//   id: string;
//   user_id: string;
//   room_id: string;
//   check_in: string;
//   check_out: string;
//   guests: number;
//   duration_type: 'night' | 'threeDays' | 'week' | 'month';
//   total_amount: number;
//   status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
//   payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
//   stripe_payment_id?: string;
//   created_at: string;
//   updated_at: string;
// }

// // Interface pour les messages de contact
// export interface DatabaseContactMessage {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   subject: string;
//   message: string;
//   contact_method: 'email' | 'phone' | 'sms';
//   status: 'new' | 'read' | 'replied' | 'archived';
//   created_at: string;
// }

// // Fonctions utilitaires pour la base de données
// export class DatabaseService {

//   // Authentification
//   static async createUser(email: string, passwordHash: string, userData: {
//     firstName: string;
//     lastName: string;
//     phone?: string;
//   }): Promise<string> {
//     const connection = await getConnection();

//     try {
//       await connection.execute('START TRANSACTION');

//       // Générer un UUID pour l'utilisateur
//       const userId = crypto.randomUUID();

//       // Créer l'utilisateur
//       await connection.execute(
//         'INSERT INTO users (id, email, password_hash, email_verified) VALUES (?, ?, ?, ?)',
//         [userId, email, passwordHash, true]
//       );

//       // Créer le profil
//       await connection.execute(
//         'INSERT INTO profiles (id, first_name, last_name, phone, is_admin) VALUES (?, ?, ?, ?, ?)',
//         [userId, userData.firstName, userData.lastName, userData.phone || null, false]
//       );

//       await connection.execute('COMMIT');
//       return userId;
//     } catch (error) {
//       await connection.execute('ROLLBACK');
//       throw error;
//     }
//   }

//   static async getUserByEmail(email: string): Promise<(DatabaseUser & DatabaseProfile) | null> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT u.*, p.first_name, p.last_name, p.phone, p.profile_image, p.is_admin
//       FROM users u
//       LEFT JOIN profiles p ON u.id = p.id
//       WHERE u.email = ?
//     `, [email]);

//     const users = rows as any[];
//     return users.length > 0 ? users[0] : null;
//   }

//   static async getUserById(id: string): Promise<(DatabaseUser & DatabaseProfile) | null> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT u.*, p.first_name, p.last_name, p.phone, p.profile_image, p.is_admin
//       FROM users u
//       LEFT JOIN profiles p ON u.id = p.id
//       WHERE u.id = ?
//     `, [id]);

//     const users = rows as any[];
//     return users.length > 0 ? users[0] : null;
//   }

//   static async updateProfile(userId: string, data: Partial<DatabaseProfile>): Promise<void> {
//     const connection = await getConnection();

//     const fields = [];
//     const values = [];

//     if (data.first_name) {
//       fields.push('first_name = ?');
//       values.push(data.first_name);
//     }
//     if (data.last_name) {
//       fields.push('last_name = ?');
//       values.push(data.last_name);
//     }
//     if (data.phone !== undefined) {
//       fields.push('phone = ?');
//       values.push(data.phone);
//     }
//     if (data.profile_image) {
//       fields.push('profile_image = ?');
//       values.push(data.profile_image);
//     }

//     if (fields.length > 0) {
//       fields.push('updated_at = CURRENT_TIMESTAMP');
//       values.push(userId);

//       await connection.execute(
//         `UPDATE profiles SET ${fields.join(', ')} WHERE id = ?`,
//         values
//       );
//     }
//   }

//   // Gestion des chambres
//   static async getAllRooms(): Promise<DatabaseRoom[]> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT r.*, rc.name as category_name
//       FROM rooms r
//       LEFT JOIN room_categories rc ON r.category_id = rc.id
//       ORDER BY r.name
//     `);

//     return (rows as any[]).map(room => ({
//       ...room,
//       images: JSON.parse(room.images || '[]'),
//       amenities: JSON.parse(room.amenities || '[]')
//     }));
//   }

//   static async getRoomById(id: string): Promise<DatabaseRoom | null> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT r.*, rc.name as category_name
//       FROM rooms r
//       LEFT JOIN room_categories rc ON r.category_id = rc.id
//       WHERE r.id = ?
//     `, [id]);

//     const rooms = rows as any[];
//     if (rooms.length === 0) return null;

//     const room = rooms[0];
//     return {
//       ...room,
//       images: JSON.parse(room.images || '[]'),
//       amenities: JSON.parse(room.amenities || '[]')
//     };
//   }

//   static async updateRoomAvailability(roomId: string, available: boolean): Promise<void> {
//     const connection = await getConnection();

//     await connection.execute(
//       'UPDATE rooms SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
//       [available, roomId]
//     );
//   }

//   // Gestion des réservations
//   static async createBooking(booking: Omit<DatabaseBooking, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
//     const connection = await getConnection();

//     const bookingId = crypto.randomUUID();

//     await connection.execute(`
//       INSERT INTO bookings (
//         id, user_id, room_id, check_in, check_out, guests, 
//         duration_type, total_amount, status, payment_status, stripe_payment_id
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       bookingId,
//       booking.user_id,
//       booking.room_id,
//       booking.check_in,
//       booking.check_out,
//       booking.guests,
//       booking.duration_type,
//       booking.total_amount,
//       booking.status,
//       booking.payment_status,
//       booking.stripe_payment_id || null
//     ]);

//     return bookingId;
//   }

//   static async getUserBookings(userId: string): Promise<DatabaseBooking[]> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT b.*, r.name as room_name
//       FROM bookings b
//       LEFT JOIN rooms r ON b.room_id = r.id
//       WHERE b.user_id = ?
//       ORDER BY b.created_at DESC
//     `, [userId]);

//     return rows as DatabaseBooking[];
//   }

//   static async getAllBookings(): Promise<DatabaseBooking[]> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT b.*, r.name as room_name, p.first_name, p.last_name
//       FROM bookings b
//       LEFT JOIN rooms r ON b.room_id = r.id
//       LEFT JOIN profiles p ON b.user_id = p.id
//       ORDER BY b.created_at DESC
//     `);

//     return rows as DatabaseBooking[];
//   }

//   // Messages de contact
//   static async createContactMessage(message: Omit<DatabaseContactMessage, 'id' | 'created_at'>): Promise<string> {
//     const connection = await getConnection();

//     const messageId = crypto.randomUUID();

//     await connection.execute(`
//       INSERT INTO contact_messages (
//         id, name, email, phone, subject, message, contact_method, status
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       messageId,
//       message.name,
//       message.email,
//       message.phone || null,
//       message.subject,
//       message.message,
//       message.contact_method,
//       message.status
//     ]);

//     return messageId;
//   }

//   static async getAllContactMessages(): Promise<DatabaseContactMessage[]> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT * FROM contact_messages
//       ORDER BY created_at DESC
//     `);

//     return rows as DatabaseContactMessage[];
//   }

//   // Statistiques
//   static async getStatistics(): Promise<{
//     totalRooms: number;
//     availableRooms: number;
//     totalBookings: number;
//     totalRevenue: number;
//     occupancyRate: number;
//   }> {
//     const connection = await getConnection();

//     // Statistiques des chambres
//     const [roomStats] = await connection.execute(`
//       SELECT 
//         COUNT(*) as total_rooms,
//         SUM(CASE WHEN available = TRUE THEN 1 ELSE 0 END) as available_rooms
//       FROM rooms
//     `);

//     // Statistiques des réservations
//     const [bookingStats] = await connection.execute(`
//       SELECT 
//         COUNT(*) as total_bookings,
//         SUM(CASE WHEN payment_status = 'paid' THEN total_amount ELSE 0 END) as total_revenue
//       FROM bookings
//     `);

//     const roomData = (roomStats as any[])[0];
//     const bookingData = (bookingStats as any[])[0];

//     const occupancyRate = roomData.total_rooms > 0
//       ? Math.round(((roomData.total_rooms - roomData.available_rooms) / roomData.total_rooms) * 100)
//       : 0;

//     return {
//       totalRooms: roomData.total_rooms,
//       availableRooms: roomData.available_rooms,
//       totalBookings: bookingData.total_bookings,
//       totalRevenue: parseFloat(bookingData.total_revenue || '0'),
//       occupancyRate
//     };
//   }

//   // Gestion des utilisateurs (admin)
//   static async getAllUsers(): Promise<(DatabaseUser & DatabaseProfile)[]> {
//     const connection = await getConnection();

//     const [rows] = await connection.execute(`
//       SELECT u.*, p.first_name, p.last_name, p.phone, p.profile_image, p.is_admin
//       FROM users u
//       LEFT JOIN profiles p ON u.id = p.id
//       ORDER BY p.created_at DESC
//     `);

//     return rows as (DatabaseUser & DatabaseProfile)[];
//   }

//   static async deleteUser(userId: string): Promise<void> {
//     const connection = await getConnection();

//     // La suppression en cascade supprimera automatiquement le profil
//     await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
//   }
// }

// // Fonction pour tester la connexion
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     const connection = await getConnection();
//     await connection.execute('SELECT 1');
//     return true;
//   } catch (error) {
//     console.error('Erreur de connexion à la base de données:', error);
//     return false;
//   }
// };