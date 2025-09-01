import { supabase } from './supabase';

// Types pour l'audit
export interface AuditEvent {
    action_type: string;
    table_name?: string;
    record_id?: string;
    old_values?: any;
    new_values?: any;
    success?: boolean;
    error_message?: string;
    metadata?: any;
}

export interface SecurityAlert {
    id: string;
    alert_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    user_email?: string;
    ip_address?: string;
    description: string;
    created_at: string;
    resolved: boolean;
}

export interface AuditStats {
    total_events: number;
    failed_events: number;
    unique_users: number;
    unique_ips: number;
    most_common_action?: string;
    most_active_user?: string;
}

/**
 * Service d'audit pour journaliser les événements et gérer les alertes
 */
export class AuditService {
    private static instance: AuditService;
    private sessionId: string;

    private constructor() {
        this.sessionId = this.generateSessionId();
    }

    public static getInstance(): AuditService {
        if (!AuditService.instance) {
            AuditService.instance = new AuditService();
        }
        return AuditService.instance;
    }

    /**
     * Générer un ID de session unique
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Journaliser un événement d'authentification
     */
    async logAuthEvent(eventType: string, success: boolean = true, errorMessage?: string): Promise<void> {
        try {
            const { error } = await supabase.rpc('log_auth_event', {
                event_type: eventType,
                success: success,
                error_message: errorMessage
            });

            if (error) {
                console.error('Erreur lors de la journalisation auth:', error);
            }
        } catch (error) {
            console.error('Erreur audit auth:', error);
        }
    }

    /**
     * Journaliser un événement de paiement
     */
    async logPaymentEvent(bookingId: string, amount: number, success: boolean, errorMessage?: string): Promise<void> {
        try {
            await this.logAuthEvent('PAYMENT_ATTEMPT', success, errorMessage);

            // Log supplémentaire avec métadonnées
            const metadata = {
                booking_id: bookingId,
                amount: amount,
                currency: 'EUR',
                payment_method: 'stripe'
            };

            const { error } = await supabase
                .from('audit_logs')
                .insert({
                    action_type: 'PAYMENT_ATTEMPT',
                    success: success,
                    error_message: errorMessage,
                    metadata: metadata
                });

            if (error) {
                console.error('Erreur lors de la journalisation paiement:', error);
            }
        } catch (error) {
            console.error('Erreur audit paiement:', error);
        }
    }

    /**
     * Journaliser un événement d'accès aux données
     */
    async logDataAccess(tableName: string, recordId?: string, action: string = 'SELECT'): Promise<void> {
        try {
            const metadata = {
                table: tableName,
                record_id: recordId,
                action: action,
                timestamp: new Date().toISOString()
            };

            const { error } = await supabase
                .from('audit_logs')
                .insert({
                    action_type: 'DATA_ACCESS',
                    table_name: tableName,
                    record_id: recordId,
                    metadata: metadata
                });

            if (error) {
                console.error('Erreur lors de la journalisation accès:', error);
            }
        } catch (error) {
            console.error('Erreur audit accès:', error);
        }
    }

    /**
     * Journaliser un événement d'action administrative
     */
    async logAdminAction(action: string, details?: any): Promise<void> {
        try {
            const metadata = {
                admin_action: action,
                details: details,
                timestamp: new Date().toISOString()
            };

            const { error } = await supabase
                .from('audit_logs')
                .insert({
                    action_type: 'ADMIN_ACTION',
                    metadata: metadata
                });

            if (error) {
                console.error('Erreur lors de la journalisation admin:', error);
            }
        } catch (error) {
            console.error('Erreur audit admin:', error);
        }
    }

    /**
     * Obtenir les alertes de sécurité non résolues
     */
    async getUnresolvedAlerts(): Promise<SecurityAlert[]> {
        try {
            const { data, error } = await supabase.rpc('get_unresolved_alerts');

            if (error) {
                console.error('Erreur lors de la récupération des alertes:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Erreur récupération alertes:', error);
            return [];
        }
    }

    /**
     * Résoudre une alerte de sécurité
     */
    async resolveAlert(alertId: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { error } = await supabase.rpc('resolve_alert', {
                alert_id: alertId,
                resolved_by_user_id: user.id
            });

            if (error) {
                console.error('Erreur lors de la résolution de l\'alerte:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erreur résolution alerte:', error);
            return false;
        }
    }

    /**
     * Obtenir les statistiques d'audit
     */
    async getAuditStats(daysBack: number = 7): Promise<AuditStats | null> {
        try {
            const { data, error } = await supabase.rpc('get_audit_stats', {
                days_back: daysBack
            });

            if (error) {
                console.error('Erreur lors de la récupération des stats:', error);
                return null;
            }

            return data?.[0] || null;
        } catch (error) {
            console.error('Erreur récupération stats:', error);
            return null;
        }
    }

    /**
     * Obtenir les logs d'audit récents
     */
    async getRecentAuditLogs(limit: number = 50): Promise<any[]> {
        try {
            const { data, error } = await supabase
                .from('audit_logs')
                .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Erreur lors de la récupération des logs:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Erreur récupération logs:', error);
            return [];
        }
    }

    /**
     * Obtenir les logs d'audit filtrés
     */
    async getFilteredAuditLogs(filters: {
        action_type?: string;
        table_name?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
        success?: boolean;
    }, limit: number = 100): Promise<any[]> {
        try {
            let query = supabase
                .from('audit_logs')
                .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
                .order('created_at', { ascending: false })
                .limit(limit);

            // Appliquer les filtres
            if (filters.action_type) {
                query = query.eq('action_type', filters.action_type);
            }
            if (filters.table_name) {
                query = query.eq('table_name', filters.table_name);
            }
            if (filters.user_id) {
                query = query.eq('user_id', filters.user_id);
            }
            if (filters.date_from) {
                query = query.gte('created_at', filters.date_from);
            }
            if (filters.date_to) {
                query = query.lte('created_at', filters.date_to);
            }
            if (filters.success !== undefined) {
                query = query.eq('success', filters.success);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Erreur lors de la récupération des logs filtrés:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Erreur récupération logs filtrés:', error);
            return [];
        }
    }

    /**
     * Nettoyer les anciens logs (fonction admin)
     */
    async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
        try {
            const { data, error } = await supabase.rpc('cleanup_old_audit_logs', {
                days_to_keep: daysToKeep
            });

            if (error) {
                console.error('Erreur lors du nettoyage des logs:', error);
                return 0;
            }

            return data || 0;
        } catch (error) {
            console.error('Erreur nettoyage logs:', error);
            return 0;
        }
    }

    /**
     * Nettoyer les anciennes alertes résolues (fonction admin)
     */
    async cleanupResolvedAlerts(daysToKeep: number = 30): Promise<number> {
        try {
            const { data, error } = await supabase.rpc('cleanup_resolved_alerts', {
                days_to_keep: daysToKeep
            });

            if (error) {
                console.error('Erreur lors du nettoyage des alertes:', error);
                return 0;
            }

            return data || 0;
        } catch (error) {
            console.error('Erreur nettoyage alertes:', error);
            return 0;
        }
    }

    /**
     * Vérifier s'il y a des alertes critiques non résolues
     */
    async hasCriticalAlerts(): Promise<boolean> {
        try {
            const alerts = await this.getUnresolvedAlerts();
            return alerts.some(alert => alert.severity === 'critical');
        } catch (error) {
            console.error('Erreur vérification alertes critiques:', error);
            return false;
        }
    }

    /**
     * Obtenir le nombre d'alertes par sévérité
     */
    async getAlertCounts(): Promise<{ low: number; medium: number; high: number; critical: number }> {
        try {
            const alerts = await this.getUnresolvedAlerts();

            return {
                low: alerts.filter(a => a.severity === 'low').length,
                medium: alerts.filter(a => a.severity === 'medium').length,
                high: alerts.filter(a => a.severity === 'high').length,
                critical: alerts.filter(a => a.severity === 'critical').length
            };
        } catch (error) {
            console.error('Erreur comptage alertes:', error);
            return { low: 0, medium: 0, high: 0, critical: 0 };
        }
    }
}

// Export de l'instance singleton
export const auditService = AuditService.getInstance();

// Fonctions utilitaires pour l'intégration facile
export const logAuthEvent = (eventType: string, success: boolean = true, errorMessage?: string) => {
    return auditService.logAuthEvent(eventType, success, errorMessage);
};

export const logPaymentEvent = (bookingId: string, amount: number, success: boolean, errorMessage?: string) => {
    return auditService.logPaymentEvent(bookingId, amount, success, errorMessage);
};

export const logDataAccess = (tableName: string, recordId?: string, action?: string) => {
    return auditService.logDataAccess(tableName, recordId, action);
};

export const logAdminAction = (action: string, details?: any) => {
    return auditService.logAdminAction(action, details);
};
