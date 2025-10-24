import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFlash } from './FlashContext';
import { supabase } from '../lib/supabase';
import { monitorSession, cleanupSession, checkConnectionSecurity } from '../lib/authMiddleware';
import { logAuthEvent } from '../lib/auditService';
import { localStorageService } from '../lib/localStorageService';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const flash = useFlash();

  useEffect(() => {
    // Vérifier la sécurité de la connexion
    checkConnectionSecurity();

    // Vérifier la session existante
    const initAuth = async () => {
      try {
        // MODE DÉMO : Vérifier d'abord si un utilisateur démo est en session
        const demoUserJson = localStorage.getItem('demo_user');
        if (demoUserJson) {
          const demoUser = JSON.parse(demoUserJson);
          setUser(demoUser);
          setLoading(false);
          return;
        }

        console.log('Auth state change: INITIAL_SESSION', 'undefined');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);

      if (event === 'TOKEN_REFRESHED') {
        console.log('✅ Token rafraîchi avec succès');
        logAuthEvent('TOKEN_REFRESHED', true);
      }

      if (session?.user) {
        await loadUserProfile(session.user);
        if (event === 'SIGNED_IN') {
          logAuthEvent('SIGNED_IN', true);
          flash.showSuccess('Connexion réussie', 'Bienvenue dans votre espace royal !');
        }
      } else {
        // MODE DÉMO : Ne pas écraser l'utilisateur si c'est un utilisateur démo
        const demoUserJson = localStorage.getItem('demo_user');
        if (!demoUserJson) {
          setUser(null);
        }
        if (event === 'SIGNED_OUT') {
          logAuthEvent('SIGNED_OUT', true);
          cleanupSession(); // Nettoyer les données sensibles
          flash.showInfo('Déconnexion', 'À bientôt au Château Royal !');
        }
      }
    });

    // Démarrer le monitoring des sessions
    const sessionMonitor = monitorSession();

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionMonitor);
    };
  }, [flash]);

  const loadUserProfile = async (authUser: any) => {
    try {
      console.log('Profil utilisateur chargé:', authUser.email);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement du profil:', error);

        // Si le profil n'existe pas, le créer
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{
              id: authUser.id,
              first_name: authUser.user_metadata?.first_name || 'Utilisateur',
              last_name: authUser.user_metadata?.last_name || 'Nouveau',
              phone: authUser.user_metadata?.phone || null,
              is_admin: authUser.email === 'admin@chateauroyal.com'
            }]);

          if (insertError) {
            console.error('Erreur création profil:', insertError);
            flash.showError('Erreur', 'Impossible de créer votre profil');
            return;
          }

          // Recharger le profil créé
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          profile = newProfile;
        } else {
          flash.showError('Erreur', 'Impossible de charger votre profil');
          return;
        }
      }

      setUser({
        id: authUser.id,
        email: authUser.email,
        firstName: profile?.first_name || 'Utilisateur',
        lastName: profile?.last_name || 'Nouveau',
        phone: profile?.phone,
        profileImage: profile?.profile_image || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isAdmin: profile?.is_admin || false
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors du chargement de votre profil');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // MODE DÉMO : Connexions fictives sans base de données
      const demoUsers = {
        'user': {
          password: 'user123',
          user: {
            id: 'demo-user-1',
            email: 'user@demo.com',
            firstName: 'Utilisateur',
            lastName: 'Demo',
            phone: '0612345678',
            profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            isAdmin: false
          }
        },
        'nazari': {
          password: 'nazari123',
          user: {
            id: 'demo-admin-1',
            email: 'nazari@admin.com',
            firstName: 'Nazari',
            lastName: 'Administrateur',
            phone: '0644762721',
            profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
            isAdmin: true
          }
        }
      };

      // Vérifier les identifiants démo
      const username = email.toLowerCase().trim();
      const demoUser = demoUsers[username as keyof typeof demoUsers];

      if (demoUser && demoUser.password === password) {
        // Connexion réussie avec utilisateur démo
        setUser(demoUser.user);
        // Sauvegarder dans localStorage pour persister la session
        localStorage.setItem('demo_user', JSON.stringify(demoUser.user));
        logAuthEvent('LOGIN_SUCCESS_DEMO', true);
        flash.showSuccess('Connexion réussie', `Bienvenue ${demoUser.user.firstName} ! (Mode démo)`);
        return true;
      }

      // Si ce n'est pas un utilisateur démo, essayer Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Erreur de connexion:', error);
        logAuthEvent('LOGIN_FAILED', false, error.message);
        flash.showError('Erreur de connexion', 'Identifiants incorrects. Utilisez "user" / "user123" ou "nazari" / "nazari123"');
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName.trim(),
            last_name: userData.lastName.trim(),
            phone: userData.phone?.trim()
          }
        }
      });

      if (error) {
        console.error('Erreur d\'inscription:', error);
        if (error.message.includes('already registered')) {
          flash.showError('Erreur d\'inscription', 'Cette adresse email est déjà utilisée');
        } else {
          flash.showError('Erreur d\'inscription', 'Impossible de créer votre compte');
        }
        return false;
      }

      if (data.user) {
        flash.showSuccess('Inscription réussie', 'Votre compte a été créé avec succès !');
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      // MODE DÉMO : Utiliser localStorage
      if (user.id?.startsWith('demo-')) {
        const updatedUser = localStorageService.updateCurrentUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          profileImage: userData.profileImage
        });

        if (updatedUser) {
          setUser(updatedUser);
          flash.showSuccess('Profil mis à jour', 'Vos informations ont été sauvegardées');
          return true;
        }
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          profile_image: userData.profileImage,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erreur de mise à jour:', error);
        flash.showError('Erreur', 'Impossible de mettre à jour votre profil');
        return false;
      }

      // Recharger le profil
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await loadUserProfile(authUser);
      }

      flash.showSuccess('Profil mis à jour', 'Vos informations ont été sauvegardées');
      return true;
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors de la mise à jour');
      return false;
    }
  };

  const logout = async () => {
    try {
      // Nettoyer l'utilisateur démo du localStorage
      localStorage.removeItem('demo_user');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      flash.showError('Erreur', 'Erreur lors de la déconnexion');
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};