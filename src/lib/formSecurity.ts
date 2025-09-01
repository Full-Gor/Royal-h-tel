// Service de sécurité des formulaires - Château Royal
// Protection contre le spam, l'injection et les attaques CSRF

import { supabase } from './supabase';

export interface FormSecurityConfig {
    enableCSRF: boolean;
    enableRateLimit: boolean;
    enableHoneypot: boolean;
    maxSubmissionsPerHour: number;
    maxSubmissionsPerDay: number;
    minSubmissionInterval: number; // en millisecondes
}

export interface FormSubmission {
    formId: string;
    userId?: string;
    ipAddress: string;
    userAgent: string;
    timestamp: Date;
    data: any;
    csrfToken?: string;
}

export class FormSecurityService {
    private static instance: FormSecurityService;
    private submissionHistory: Map<string, FormSubmission[]> = new Map();
    private csrfTokens: Map<string, { token: string; expires: Date }> = new Map();

    private constructor() { }

    public static getInstance(): FormSecurityService {
        if (!FormSecurityService.instance) {
            FormSecurityService.instance = new FormSecurityService();
        }
        return FormSecurityService.instance;
    }

    /**
     * Génère un token CSRF unique
     */
    generateCSRFToken(formId: string): string {
        const token = this.generateSecureToken();
        const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        this.csrfTokens.set(formId, { token, expires });

        // Nettoyer les tokens expirés
        this.cleanupExpiredTokens();

        return token;
    }

    /**
     * Valide un token CSRF
     */
    validateCSRFToken(formId: string, token: string): boolean {
        const stored = this.csrfTokens.get(formId);
        if (!stored) return false;

        if (stored.expires < new Date()) {
            this.csrfTokens.delete(formId);
            return false;
        }

        return stored.token === token;
    }

    /**
     * Vérifie le rate limiting pour un utilisateur/IP
     */
    async checkRateLimit(
        formId: string,
        identifier: string,
        config: FormSecurityConfig
    ): Promise<{ allowed: boolean; reason?: string; retryAfter?: number }> {
        if (!config.enableRateLimit) {
            return { allowed: true };
        }

        const submissions = this.submissionHistory.get(identifier) || [];
        const now = new Date();

        // Filtrer les soumissions récentes
        const recentSubmissions = submissions.filter(
            sub => sub.formId === formId &&
                (now.getTime() - sub.timestamp.getTime()) < 24 * 60 * 60 * 1000 // 24h
        );

        // Vérifier l'intervalle minimum
        const lastSubmission = recentSubmissions[recentSubmissions.length - 1];
        if (lastSubmission) {
            const timeSinceLast = now.getTime() - lastSubmission.timestamp.getTime();
            if (timeSinceLast < config.minSubmissionInterval) {
                return {
                    allowed: false,
                    reason: 'Soumission trop rapide',
                    retryAfter: config.minSubmissionInterval - timeSinceLast
                };
            }
        }

        // Vérifier la limite horaire
        const hourlySubmissions = recentSubmissions.filter(
            sub => (now.getTime() - sub.timestamp.getTime()) < 60 * 60 * 1000
        );
        if (hourlySubmissions.length >= config.maxSubmissionsPerHour) {
            return {
                allowed: false,
                reason: 'Limite horaire dépassée',
                retryAfter: 60 * 60 * 1000 // 1 heure
            };
        }

        // Vérifier la limite quotidienne
        if (recentSubmissions.length >= config.maxSubmissionsPerDay) {
            return {
                allowed: false,
                reason: 'Limite quotidienne dépassée',
                retryAfter: 24 * 60 * 60 * 1000 // 24 heures
            };
        }

        return { allowed: true };
    }

    /**
     * Enregistre une soumission de formulaire
     */
    recordSubmission(submission: FormSubmission): void {
        const identifier = submission.userId || submission.ipAddress;
        const submissions = this.submissionHistory.get(identifier) || [];

        submissions.push(submission);

        // Garder seulement les 100 dernières soumissions par utilisateur
        if (submissions.length > 100) {
            submissions.splice(0, submissions.length - 100);
        }

        this.submissionHistory.set(identifier, submissions);
    }

    /**
     * Valide et nettoie les données du formulaire
     */
    sanitizeFormData(data: any, allowedFields: string[]): any {
        const sanitized: any = {};

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                sanitized[field] = this.sanitizeValue(data[field]);
            }
        }

        return sanitized;
    }

    /**
     * Nettoie une valeur individuelle
     */
    private sanitizeValue(value: any): any {
        if (typeof value !== 'string') return value;

        return value
            // Supprimer les balises HTML
            .replace(/<[^>]*>/g, '')
            // Supprimer les scripts
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Supprimer les événements JavaScript
            .replace(/on\w+\s*=/gi, '')
            // Supprimer les URLs javascript:
            .replace(/javascript:/gi, '')
            // Supprimer les caractères de contrôle
            .replace(/[\x00-\x1F\x7F]/g, '')
            // Limiter la longueur
            .substring(0, 1000)
            .trim();
    }

    /**
     * Détecte les tentatives de spam
     */
    detectSpam(submission: FormSubmission): { isSpam: boolean; score: number; reasons: string[] } {
        let score = 0;
        const reasons: string[] = [];

        // Vérifier la fréquence des soumissions
        const identifier = submission.userId || submission.ipAddress;
        const submissions = this.submissionHistory.get(identifier) || [];
        const recentSubmissions = submissions.filter(
            sub => (Date.now() - sub.timestamp.getTime()) < 60 * 60 * 1000 // 1h
        );

        if (recentSubmissions.length > 10) {
            score += 50;
            reasons.push('Soumissions trop fréquentes');
        }

        // Vérifier les patterns de spam dans les données
        const dataStr = JSON.stringify(submission.data).toLowerCase();

        // Mots-clés de spam
        const spamKeywords = [
            'viagra', 'casino', 'loan', 'credit', 'debt', 'weight loss',
            'make money', 'earn money', 'work from home', 'free trial',
            'click here', 'buy now', 'limited time', 'act now'
        ];

        spamKeywords.forEach(keyword => {
            if (dataStr.includes(keyword)) {
                score += 20;
                reasons.push(`Mot-clé de spam détecté: ${keyword}`);
            }
        });

        // Vérifier les URLs suspectes
        const urlPattern = /https?:\/\/[^\s]+/g;
        const urls = dataStr.match(urlPattern) || [];
        if (urls.length > 3) {
            score += 30;
            reasons.push('Trop d\'URLs dans le message');
        }

        // Vérifier la longueur excessive
        if (dataStr.length > 5000) {
            score += 25;
            reasons.push('Message trop long');
        }

        // Vérifier les caractères répétés
        const repeatedChars = /(.)\1{10,}/g;
        if (repeatedChars.test(dataStr)) {
            score += 40;
            reasons.push('Caractères répétés excessifs');
        }

        return {
            isSpam: score >= 50,
            score,
            reasons
        };
    }

    /**
     * Log les tentatives de spam pour audit
     */
    async logSpamAttempt(submission: FormSubmission, spamResult: any): Promise<void> {
        try {
            const { data, error } = await supabase
                .from('audit_logs')
                .insert({
                    action_type: 'SPAM_DETECTED',
                    table_name: 'form_submissions',
                    old_values: null,
                    new_values: {
                        formId: submission.formId,
                        spamScore: spamResult.score,
                        reasons: spamResult.reasons,
                        data: submission.data
                    },
                    metadata: {
                        ipAddress: submission.ipAddress,
                        userAgent: submission.userAgent,
                        timestamp: submission.timestamp
                    }
                });

            if (error) {
                console.error('Erreur lors du log de spam:', error);
            }
        } catch (error) {
            console.error('Erreur lors du log de spam:', error);
        }
    }

    /**
     * Génère un token sécurisé
     */
    private generateSecureToken(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Nettoie les tokens CSRF expirés
     */
    private cleanupExpiredTokens(): void {
        const now = new Date();
        for (const [formId, tokenData] of this.csrfTokens.entries()) {
            if (tokenData.expires < now) {
                this.csrfTokens.delete(formId);
            }
        }
    }

    /**
     * Obtient les statistiques de sécurité
     */
    getSecurityStats(): {
        totalSubmissions: number;
        spamAttempts: number;
        rateLimitBlocks: number;
        activeTokens: number;
    } {
        let totalSubmissions = 0;
        let spamAttempts = 0;
        let rateLimitBlocks = 0;

        for (const submissions of this.submissionHistory.values()) {
            totalSubmissions += submissions.length;
        }

        return {
            totalSubmissions,
            spamAttempts,
            rateLimitBlocks,
            activeTokens: this.csrfTokens.size
        };
    }
}

// Configuration par défaut
export const DEFAULT_FORM_SECURITY_CONFIG: FormSecurityConfig = {
    enableCSRF: true,
    enableRateLimit: true,
    enableHoneypot: true,
    maxSubmissionsPerHour: 5,
    maxSubmissionsPerDay: 20,
    minSubmissionInterval: 5000 // 5 secondes
};

// Instance singleton
export const formSecurityService = FormSecurityService.getInstance();
