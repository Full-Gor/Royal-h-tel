import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PasswordValidationResult } from '../lib/passwordValidation';

interface PasswordStrengthMeterProps {
  validation: PasswordValidationResult;
  showDetails?: boolean;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  validation, 
  showDetails = true 
}) => {
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'strong': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'very-strong': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'weak': return 'Faible';
      case 'medium': return 'Moyen';
      case 'strong': return 'Fort';
      case 'very-strong': return 'Très fort';
      default: return 'Inconnu';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'weak': return <XCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'strong': return <Shield className="h-4 w-4" />;
      case 'very-strong': return <CheckCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getProgressColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very-strong': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  if (!validation) return null;

  return (
    <div className="space-y-3">
      {/* Barre de progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gold-200">Force du mot de passe</span>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStrengthColor(validation.strength)}`}>
            {getStrengthIcon(validation.strength)}
            <span className="font-medium">{getStrengthLabel(validation.strength)}</span>
          </div>
        </div>
        
        <div className="w-full bg-luxury-700/50 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${validation.score}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-2 rounded-full ${getProgressColor(validation.strength)}`}
          />
        </div>
        
        <div className="text-right text-xs text-gold-300">
          Score: {validation.score}/100
        </div>
      </div>

      {/* Détails des erreurs */}
      {showDetails && validation.errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <h4 className="text-sm font-medium text-red-400 flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Exigences non respectées :
          </h4>
          <ul className="space-y-1">
            {validation.errors.map((error, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-xs text-red-300 flex items-start space-x-2"
              >
                <span className="text-red-400 mt-0.5">•</span>
                <span>{error}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Conseils de sécurité */}
      {showDetails && validation.isValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
        >
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-300">
              <p className="font-medium mb-1">Mot de passe sécurisé !</p>
              <p>Votre mot de passe respecte toutes les exigences de sécurité.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Conseils généraux */}
      {showDetails && (
        <div className="p-3 bg-luxury-700/30 border border-gold-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="h-4 w-4 text-gold-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gold-200">
              <p className="font-medium mb-1">Conseils de sécurité :</p>
              <ul className="space-y-1">
                <li>• Utilisez au moins 12 caractères</li>
                <li>• Mélangez majuscules, minuscules, chiffres et symboles</li>
                <li>• Évitez les mots de passe communs</li>
                <li>• Ne réutilisez pas vos mots de passe</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
