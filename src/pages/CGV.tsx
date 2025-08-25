import React from 'react';
import { motion } from 'framer-motion';
import { Crown, FileText, Phone, Mail } from 'lucide-react';

const CGV = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pt-20 min-h-screen bg-gradient-to-br from-luxury-900 to-luxury-800"
        >
            {/* Header */}
            <section className="py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <FileText className="h-16 w-16 text-gold-500 mx-auto mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-white mb-4">
                        Conditions Générales de Vente
                    </h1>
                    <p className="text-xl text-gold-200 max-w-3xl mx-auto">
                        Conditions d'utilisation et de réservation du Château Royal
                    </p>
                </motion.div>
            </section>

            {/* Contenu CGV */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-luxury-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gold-500/20"
                >
                    <div className="prose prose-invert prose-gold max-w-none">
                        <div className="text-gold-200 leading-relaxed space-y-8">

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 1 - Objet et champ d'application</h2>
                                <p>
                                    Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les prestations de services proposées par le Château Royal,
                                    établissement hôtelier de luxe situé en France.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 2 - Réservations</h2>
                                <h3 className="text-xl font-semibold text-gold-300 mb-2">2.1 Modalités de réservation</h3>
                                <p>Les réservations peuvent être effectuées :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>En ligne via notre site internet</li>
                                    <li>Par téléphone au 06 44 76 27 21</li>
                                    <li>Par email à contact@chateauroyal.com</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">2.2 Confirmation de réservation</h3>
                                <p>Toute réservation est confirmée par l'envoi d'un email de confirmation contenant :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Les dates de séjour</li>
                                    <li>Le type de chambre réservée</li>
                                    <li>Le montant total</li>
                                    <li>Les conditions d'annulation</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 3 - Tarifs et paiement</h2>
                                <h3 className="text-xl font-semibold text-gold-300 mb-2">3.1 Tarifs</h3>
                                <p>Les tarifs sont exprimés en euros TTC et peuvent varier selon :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>La saison</li>
                                    <li>La durée du séjour</li>
                                    <li>Le type de chambre</li>
                                    <li>Les services additionnels</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">3.2 Modalités de paiement</h3>
                                <p>Le paiement s'effectue :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Par carte bancaire (Visa, Mastercard, American Express)</li>
                                    <li>Par virement bancaire</li>
                                    <li>En espèces (dans la limite légale)</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">3.3 Facturation</h3>
                                <p>Un acompte de 30% est demandé à la réservation. Le solde est réglé à l'arrivée ou au départ selon les modalités convenues.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 4 - Annulation et modification</h2>
                                <h3 className="text-xl font-semibold text-gold-300 mb-2">4.1 Annulation par le client</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Annulation gratuite jusqu'à 48h avant l'arrivée</li>
                                    <li>Entre 48h et 24h : 50% du montant total</li>
                                    <li>Moins de 24h : 100% du montant total</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">4.2 Modification de réservation</h3>
                                <p>Les modifications sont possibles sous réserve de disponibilité et peuvent entraîner un supplément.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 5 - Arrivée et départ</h2>
                                <h3 className="text-xl font-semibold text-gold-300 mb-2">5.1 Horaires</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Arrivée : à partir de 15h00</li>
                                    <li>Départ : avant 12h00</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">5.2 Retard</h3>
                                <p>En cas de retard, merci de nous prévenir. Les chambres sont maintenues jusqu'à 20h00 sauf avis contraire.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 6 - Services et équipements</h2>
                                <h3 className="text-xl font-semibold text-gold-300 mb-2">6.1 Services inclus</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Accès WiFi gratuit</li>
                                    <li>Service de conciergerie</li>
                                    <li>Accès aux espaces communs</li>
                                    <li>Service de voiturier</li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">6.2 Services payants</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Spa et wellness</li>
                                    <li>Restaurant et room service</li>
                                    <li>Blanchisserie</li>
                                    <li>Excursions et activités</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 7 - Responsabilité</h2>
                                <h3 className="text-xl font-semibold text-gold-300 mb-2">7.1 Responsabilité de l'établissement</h3>
                                <p>Le Château Royal s'engage à fournir des prestations conformes aux standards de l'hôtellerie de luxe.</p>

                                <h3 className="text-xl font-semibold text-gold-300 mb-2 mt-4">7.2 Responsabilité du client</h3>
                                <p>Le client s'engage à :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Respecter le règlement intérieur</li>
                                    <li>Utiliser les équipements avec précaution</li>
                                    <li>Signaler tout dommage</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 8 - Réclamations</h2>
                                <p>Toute réclamation doit être formulée :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Sur place auprès de la réception</li>
                                    <li>Par écrit dans les 8 jours suivant le départ</li>
                                    <li>À l'adresse : contact@chateauroyal.com</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 9 - Protection des données</h2>
                                <p>Conformément au RGPD, vos données personnelles sont collectées et traitées pour :</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>La gestion de votre réservation</li>
                                    <li>L'amélioration de nos services</li>
                                    <li>L'envoi d'offres promotionnelles (avec votre accord)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 10 - Droit applicable</h2>
                                <p>Les présentes CGV sont soumises au droit français. Tout litige sera de la compétence des tribunaux français.</p>
                            </section>

                            <section className="bg-gold-900/20 p-6 rounded-lg border border-gold-500/30">
                                <h2 className="text-2xl font-serif font-bold text-gold-400 mb-4">Article 11 - Contact</h2>
                                <div className="space-y-2">
                                    <p className="text-xl font-semibold text-white">Château Royal</p>
                                    <p><strong>Propriétaire :</strong> Arnaud Barotteaux</p>
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-gold-400" />
                                        <span>06 44 76 27 21</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-gold-400" />
                                        <span>contact@chateauroyal.com</span>
                                    </div>
                                </div>
                            </section>

                            <div className="text-center text-gold-400 text-sm mt-8">
                                <p><em>Dernière mise à jour : Décembre 2024</em></p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CGV;