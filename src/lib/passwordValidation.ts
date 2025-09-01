// Service de validation des mots de passe - Château Royal
// Exigences de sécurité élevées pour l'authentification forte

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventCommonPasswords: boolean;
  preventSequentialChars: boolean;
  preventRepeatedChars: boolean;
}

export class PasswordValidator {
  private static readonly COMMON_PASSWORDS = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
    'admin', 'admin123', 'root', 'user', 'test', 'guest', 'welcome',
    'letmein', 'monkey', 'dragon', 'master', 'sunshine', 'princess',
    'charlie', 'jordan', 'michael', 'michelle', 'jennifer', 'thomas',
    'jessica', 'joshua', 'amanda', 'daniel', 'sarah', 'matthew',
    'basketball', 'shadow', 'mickey', 'mustang', 'superman', 'batman',
    'spider', 'marvel', 'avengers', 'starwars', 'harrypotter', 'lordoftherings'
  ];

  private static readonly SEQUENTIAL_CHARS = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm'
  ];

  private static readonly REPEATED_CHARS = /(.)\1{2,}/;

  /**
   * Valide un mot de passe selon les exigences de sécurité élevées
   */
  static validatePassword(password: string, requirements?: Partial<PasswordRequirements>): PasswordValidationResult {
    const defaultRequirements: PasswordRequirements = {
      minLength: 12, // Exigence élevée pour l'authentification forte
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      preventCommonPasswords: true,
      preventSequentialChars: true,
      preventRepeatedChars: true
    };

    const req = { ...defaultRequirements, ...requirements };
    const errors: string[] = [];
    let score = 0;

    // Vérification de la longueur minimale
    if (password.length < req.minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${req.minLength} caractères`);
    } else {
      score += 20;
    }

    // Vérification des majuscules
    if (req.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
    } else if (req.requireUppercase) {
      score += 15;
    }

    // Vérification des minuscules
    if (req.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    } else if (req.requireLowercase) {
      score += 15;
    }

    // Vérification des chiffres
    if (req.requireNumbers && !/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    } else if (req.requireNumbers) {
      score += 15;
    }

    // Vérification des symboles
    if (req.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)');
    } else if (req.requireSymbols) {
      score += 15;
    }

    // Vérification des mots de passe communs
    if (req.preventCommonPasswords && this.COMMON_PASSWORDS.includes(password.toLowerCase())) {
      errors.push('Ce mot de passe est trop commun, veuillez en choisir un autre');
    } else if (req.preventCommonPasswords) {
      score += 10;
    }

    // Vérification des caractères séquentiels
    if (req.preventSequentialChars) {
      const hasSequential = this.SEQUENTIAL_CHARS.some(seq => {
        for (let i = 0; i <= seq.length - 3; i++) {
          const sequence = seq.substring(i, i + 3);
          if (password.toLowerCase().includes(sequence)) {
            return true;
          }
        }
        return false;
      });

      if (hasSequential) {
        errors.push('Le mot de passe ne doit pas contenir de caractères séquentiels (abc, 123, etc.)');
      } else {
        score += 10;
      }
    }

    // Vérification des caractères répétés
    if (req.preventRepeatedChars && this.REPEATED_CHARS.test(password)) {
      errors.push('Le mot de passe ne doit pas contenir de caractères répétés plus de 2 fois');
    } else if (req.preventRepeatedChars) {
      score += 10;
    }

    // Bonus pour la longueur
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 5;

    // Bonus pour la diversité des caractères
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.8) score += 10;

    // Détermination de la force
    let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
    if (score < 50) strength = 'weak';
    else if (score < 70) strength = 'medium';
    else if (score < 90) strength = 'strong';
    else strength = 'very-strong';

    return {
      isValid: errors.length === 0,
      errors,
      strength,
      score: Math.min(100, score)
    };
  }

  /**
   * Génère un mot de passe sécurisé selon les exigences
   */
  static generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    
    // Assurer au moins un de chaque type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Remplir le reste
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Mélanger le mot de passe
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Vérifie si un mot de passe respecte les exigences de base
   */
  static isPasswordAcceptable(password: string): boolean {
    const result = this.validatePassword(password);
    return result.isValid && result.strength !== 'weak';
  }
}

// Fonctions utilitaires exportées
export const validatePassword = (password: string) => PasswordValidator.validatePassword(password);
export const generateSecurePassword = (length?: number) => PasswordValidator.generateSecurePassword(length);
export const isPasswordAcceptable = (password: string) => PasswordValidator.isPasswordAcceptable(password);
