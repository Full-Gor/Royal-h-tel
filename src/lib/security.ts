// Utilitaires de sécurité pour Château Royal
export class SecurityUtils {

    /**
     * Sanitise les entrées utilisateur contre XSS
     */
    static sanitizeInput(input: string): string {
        if (!input || typeof input !== 'string') return '';

        return input
            // Supprimer les scripts
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Supprimer les événements JavaScript
            .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
            // Supprimer javascript: dans les URLs
            .replace(/javascript:/gi, '')
            // Supprimer les balises potentiellement dangereuses
            .replace(/<(iframe|object|embed|form|input|script|style)[^>]*>/gi, '')
            // Nettoyer les attributs dangereux
            .replace(/\s*(onerror|onload|onclick|onmouseover|onfocus|onblur)\s*=/gi, '')
            // Limiter la longueur
            .substring(0, 10000)
            .trim();
    }

    /**
     * Valide un email
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Valide un numéro de téléphone français
     */
    static validatePhone(phone: string): boolean {
        if (!phone) return true; // Optionnel
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Valide un montant
     */
    static validateAmount(amount: number): boolean {
        return typeof amount === 'number' &&
            amount > 0 &&
            amount <= 50000 && // Max 50k€
            Number.isFinite(amount);
    }

    /**
     * Valide un UUID
     */
    static validateUUID(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    /**
     * Limite le taux de requêtes (simple)
     */
    static rateLimiter = new Map<string, { count: number; timestamp: number }>();

    static checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
        const now = Date.now();
        const userRequests = this.rateLimiter.get(identifier);

        if (!userRequests || (now - userRequests.timestamp) > windowMs) {
            this.rateLimiter.set(identifier, { count: 1, timestamp: now });
            return true;
        }

        if (userRequests.count >= maxRequests) {
            return false;
        }

        userRequests.count++;
        return true;
    }

    /**
     * Génère un token CSRF
     */
    static generateCSRFToken(): string {
        return crypto.randomUUID();
    }

    /**
     * Nettoie les données sensibles des logs
     */
    static sanitizeForLog(data: any): any {
        const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];
        const sanitized = { ...data };

        for (const key in sanitized) {
            if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                sanitized[key] = '[REDACTED]';
            }
        }

        return sanitized;
    }
}
