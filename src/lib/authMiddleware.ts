import { supabase } from './supabase';

/**
 * Middleware de vérification des tokens d'authentification
 * Vérifie la validité et l'expiration des tokens JWT
 */
export const verifyToken = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            throw new Error('Token invalide ou expiré');
        }

        // Vérifier l'expiration du token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('Session expirée');
        }

        return { user, session };
    } catch (error) {
        console.error('Erreur de vérification du token:', error);
        await supabase.auth.signOut();
        throw error;
    }
};

/**
 * Vérifier si l'utilisateur est authentifié et a les droits admin
 */
export const verifyAdminAccess = async () => {
    try {
        const { user, session } = await verifyToken();

        // Vérifier le rôle admin
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (error || !profile?.is_admin) {
            throw new Error('Accès administrateur requis');
        }

        return { user, session, profile };
    } catch (error) {
        console.error('Erreur de vérification admin:', error);
        throw error;
    }
};

/**
 * Monitoring des sessions pour détecter l'expiration proche
 */
export const monitorSession = () => {
    return setInterval(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const expiresAt = new Date(session.expires_at! * 1000);
                const now = new Date();
                const timeUntilExpiry = expiresAt.getTime() - now.getTime();

                // Alerter si le token expire dans moins de 5 minutes
                if (timeUntilExpiry < 5 * 60 * 1000) {
                    console.warn('⚠️ Token expirera bientôt, rafraîchissement en cours...');
                }

                // Alerter si le token a expiré
                if (timeUntilExpiry <= 0) {
                    console.error('❌ Token expiré, déconnexion automatique...');
                    await supabase.auth.signOut();
                }
            }
        } catch (error) {
            console.error('Erreur de monitoring de session:', error);
        }
    }, 60000); // Vérifier toutes les minutes
};

/**
 * Nettoyer les données sensibles lors de la déconnexion
 */
export const cleanupSession = () => {
    try {
        // Nettoyer le localStorage
        localStorage.removeItem('user_preferences');
        localStorage.removeItem('booking_data');
        localStorage.removeItem('form_data');

        // Nettoyer le sessionStorage
        sessionStorage.clear();

        // Nettoyer les cookies non-Supabase
        document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            if (name.trim() && !name.includes('supabase')) {
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }
        });

        console.log('✅ Nettoyage de session terminé');
    } catch (error) {
        console.error('Erreur lors du nettoyage de session:', error);
    }
};

/**
 * Vérifier la sécurité de la connexion
 */
export const checkConnectionSecurity = () => {
    const isSecure = window.location.protocol === 'https:';
    const isLocalhost = window.location.hostname === 'localhost';

    if (!isSecure && !isLocalhost) {
        console.warn('⚠️ Connexion non sécurisée détectée');
        return false;
    }

    return true;
};
