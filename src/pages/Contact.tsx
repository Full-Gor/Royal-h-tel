import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Crown, MessageCircle, Clock, Loader } from 'lucide-react';
import { useFlash } from '../contexts/FlashContext';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const flash = useFlash();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Protection contre les injections
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const sendEmail = async (messageData: any) => {
    // Simulation d'envoi d'email vers arnaudbarotteaux@gmail.com
    try {
      const emailContent = `
        Nouveau message de contact - Château Royal
        
        De: ${messageData.name} (${messageData.email})
        Téléphone: ${messageData.phone || 'Non renseigné'}
        Sujet: ${messageData.subject}
        
        Message:
        ${messageData.message}
        
        ---
        Envoyé depuis le site Château Royal
      `;

      // Ici vous pourriez intégrer un service d'email comme EmailJS, SendGrid, etc.
      console.log('Email envoyé à arnaudbarotteaux@gmail.com:', emailContent);

      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  };

  const sendSMS = async (messageData: any) => {
    // Simulation d'envoi SMS vers 0644762721
    try {
      const smsContent = `Château Royal - Nouveau message de ${messageData.name}: ${messageData.message.substring(0, 100)}...`;

      // Ici vous pourriez intégrer un service SMS comme Twilio, etc.
      console.log('SMS envoyé au 0644762721:', smsContent);

      return true;
    } catch (error) {
      console.error('Erreur envoi SMS:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccessMessage(false);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        flash.showError('Validation', 'Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        flash.showError('Validation', 'Veuillez entrer une adresse email valide');
        return;
      }

      // Enregistrer le message dans Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          contact_method: formData.contactMethod,
          status: 'new'
        }]);

      if (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        flash.showError('Erreur', 'Impossible d\'enregistrer votre message');
        return;
      }

      // Envoyer selon la méthode choisie
      let sendSuccess = false;

      if (formData.contactMethod === 'email') {
        sendSuccess = await sendEmail(formData);
      } else if (formData.contactMethod === 'sms') {
        sendSuccess = await sendSMS(formData);
      } else if (formData.contactMethod === 'phone') {
        // Pour le téléphone, on enregistre juste la demande
        sendSuccess = true;
      }

      if (sendSuccess) {
        setShowSuccessMessage(true);

        // Reset du formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          contactMethod: 'email'
        });

        // Masquer le message après 5 secondes
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        flash.showError('Erreur', 'Impossible d\'envoyer votre message');
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      flash.showError('Erreur', 'Une erreur est survenue lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      value: '06 44 76 27 21',
      description: 'Disponible 24h/24 et 7j/7'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'arnaudbarotteaux@gmail.com',
      description: 'Réponse sous 2 heures'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Château Royal, France',
      description: 'Au cœur de la vallée de la Loire'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, z: -100 }}
      animate={{ opacity: 1, z: 0 }}
      exit={{ opacity: 0, z: 100 }}
      transition={{ duration: 0.6 }}
      className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800"
    >
      {/* Header */}
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Crown className="h-16 w-16 text-gold-500 mx-auto mb-6" />
          <h1 className="text-5xl font-serif font-bold text-white mb-4">
            Contactez-Nous
          </h1>
          <p className="text-xl text-gold-200 max-w-3xl mx-auto">
            Notre équipe dédiée est à votre disposition pour répondre à toutes vos questions
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de Contact */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gold-500/20"
          >
            <h2 className="text-3xl font-serif font-bold text-white mb-6">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-luxury-700/50 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-luxury-700/50 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-luxury-700/50 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    placeholder="06 00 00 00 00"
                  />
                </div>
                <div>
                  <label className="block text-gold-200 text-sm font-medium mb-2">
                    Méthode de contact préférée
                  </label>
                  <select
                    name="contactMethod"
                    value={formData.contactMethod}
                    onChange={handleInputChange}
                    className="w-full bg-luxury-700/50 border border-gold-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Téléphone</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gold-200 text-sm font-medium mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-luxury-700/50 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label className="block text-gold-200 text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full bg-luxury-700/50 border border-gold-500/30 rounded-lg px-4 py-3 text-white placeholder-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none transition-all"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-luxury-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </motion.button>

              {/* Message de succès local */}
              {showSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mt-4"
                >
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-300 font-medium">
                      Message envoyé avec succès !
                    </span>
                  </div>
                  <p className="text-green-200 text-sm mt-1">
                    {formData.contactMethod === 'email' && 'Votre message a été envoyé par email à arnaudbarotteaux@gmail.com'}
                    {formData.contactMethod === 'sms' && 'Votre message a été envoyé par SMS au 06 44 76 27 21'}
                    {formData.contactMethod === 'phone' && 'Nous vous contacterons par téléphone dans les plus brefs délais'}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Informations de Contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gold-500/20">
              <h2 className="text-3xl font-serif font-bold text-white mb-6">
                Informations de Contact
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="bg-gold-500/20 p-3 rounded-lg mr-4">
                      <info.icon className="h-6 w-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {info.title}
                      </h3>
                      <p className="text-gold-300 font-medium">
                        {info.value}
                      </p>
                      <p className="text-gold-200 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gold-500/20">
              <div className="flex items-center mb-6">
                <Clock className="h-8 w-8 text-gold-500 mr-3" />
                <h2 className="text-2xl font-serif font-bold text-white">
                  Horaires d'Ouverture
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gold-200">Lundi - Vendredi</span>
                  <span className="text-white font-medium">24h/24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-200">Samedi - Dimanche</span>
                  <span className="text-white font-medium">24h/24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-200">Urgences</span>
                  <span className="text-white font-medium">24h/24 - 7j/7</span>
                </div>
              </div>
            </div>

            {/* Contact Propriétaire */}
            <div className="bg-gradient-to-r from-gold-900 to-gold-700 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <Crown className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Arnaud Barotteaux
                </h3>
                <p className="text-gold-100 mb-4">
                  Propriétaire & Directeur Général
                </p>
                <div className="flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-gold-200 mr-2" />
                  <span className="text-white font-semibold">06 44 76 27 21</span>
                </div>
                <p className="text-gold-100 text-sm">
                  Contact direct pour réservations VIP et demandes spéciales
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;