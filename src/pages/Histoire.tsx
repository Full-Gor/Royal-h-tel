import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Dumbbell, Car, X } from 'lucide-react';

const Histoire = () => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const sections = [
    {
      id: 'casino',
      title: 'Salle de Jeu Royale',
      description: 'Plongez dans l\'atmosphère feutrée de notre casino privé, où l\'élégance rencontre l\'excitation. Tables de poker, roulette et machines à sous dans un cadre digne des plus grands palaces.',
      videoUrl: 'https://videos.pexels.com/video-files/7607945/7607945-uhd_2560_1440_25fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Sparkles,
      detailedDescription: `Notre Salle de Jeu Royale incarne l'art du divertissement aristocratique dans un cadre d'exception. Inspirée des plus prestigieux casinos européens, cette salle privée offre une expérience de jeu unique où tradition et modernité se rencontrent harmonieusement.

L'atmosphère feutrée de notre casino privé vous transporte dans l'univers raffiné des grandes maisons de jeu du XIXe siècle. Les lustres en cristal de Baccarat illuminent délicatement les tables de jeu en acajou massif, créant une ambiance intimiste et exclusive. Chaque détail a été pensé pour offrir le summum du luxe : fauteuils en cuir Connolly, tapis persans authentiques et boiseries sculptées à la main.

Nos tables de poker Texas Hold'em et Omaha accueillent les amateurs comme les joueurs expérimentés dans un cadre digne des plus grands tournois internationaux. La roulette française, pièce maîtresse de notre établissement, trône au centre de la salle avec sa roue en ébène et ses marquages dorés à l'or fin. Les machines à sous dernière génération côtoient les jeux traditionnels, offrant une diversité d'expériences pour tous les goûts.

Notre équipe de croupiers professionnels, formés dans les meilleures écoles européennes, garantit un service irréprochable et une expertise reconnue. Ils maîtrisent parfaitement les règles de chaque jeu et sauront vous accompagner avec discrétion et professionnalisme, que vous soyez novice ou joueur confirmé.

Le service de notre casino privé s'étend bien au-delà des jeux. Notre bar à champagne propose une sélection exclusive de grands crus et de spiritueux rares, servis par nos sommeliers dans un cadre intimiste. Les cigares cubains de notre cave humidifiée complètent parfaitement l'expérience pour les amateurs de produits d'exception.

La sécurité et la confidentialité sont nos priorités absolues. Notre système de surveillance discret mais efficace garantit la sérénité de tous nos invités, tandis que notre politique de confidentialité stricte assure l'anonymat souhaité par notre clientèle prestigieuse.

Les soirées thématiques organisées régulièrement transforment notre casino en véritable théâtre du divertissement. Soirées James Bond, tournois privés, événements caritatifs : chaque occasion est prétexte à créer des moments d'exception dans un cadre somptueux.

L'accès à notre Salle de Jeu Royale est réservé aux résidents du château et à leurs invités, garantissant une expérience exclusive dans un environnement préservé. Les horaires d'ouverture s'adaptent aux désirs de notre clientèle, avec un service disponible jusqu'aux premières heures du matin pour les passionnés de jeux nocturnes.`
    },
    {
      id: 'spa',
      title: 'Spa & Wellness',
      description: 'Détendez-vous dans notre spa de luxe avec piscine chauffée, sauna finlandais, hammam traditionnel, jacuzzi et massages thaïlandais authentiques par nos thérapeutes certifiés.',
      videoUrl: 'https://videos.pexels.com/video-files/6616372/6616372-hd_1920_1080_25fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Dumbbell,
      detailedDescription: `Notre Spa & Wellness Center représente l'aboutissement de l'art du bien-être à la française, alliant traditions ancestrales et innovations modernes dans un écrin de sérénité absolue. Niché dans l'aile ouest du château, cet espace de 800 m² offre une parenthèse de détente incomparable.

La piscine chauffée à 28°C, véritable joyau de notre spa, s'étend sur 20 mètres dans un bassin en marbre de Carrare. Les baies vitrées offrent une vue panoramique sur les jardins à la française, créant une harmonie parfaite entre architecture et nature. L'éclairage tamisé et la musique d'ambiance transforment chaque baignade en moment de pure évasion.

Notre sauna finlandais authentique, construit en bois de cèdre rouge importé de Laponie, peut accueillir jusqu'à huit personnes dans une atmosphère purifiante. La température, maintenue entre 80 et 90°C, favorise l'élimination des toxines et la relaxation profonde. Les essences d'eucalyptus et de pin sylvestre diffusées régulièrement amplifient les bienfaits de cette expérience nordique.

Le hammam traditionnel, inspiré des thermes ottomans, offre une expérience de purification unique. Les murs en tadelakt marocain et les banquettes chauffées en marbre créent une ambiance orientale authentique. La vapeur parfumée aux huiles essentielles de lavande et de romarin enveloppe les corps dans une douce chaleur humide, favorisant la détoxification et la régénération cellulaire.

Notre jacuzzi extérieur, installé sur la terrasse privée du spa, permet de profiter des bienfaits de l'hydrothérapie en toute saison. Les jets massants ciblés soulagent les tensions musculaires tandis que la vue sur le parc centenaire apaise l'esprit. L'eau maintenue à 37°C offre un contraste saisissant avec l'air frais, stimulant la circulation sanguine.

L'équipe de thérapeutes certifiés de notre spa maîtrise un large éventail de techniques de massage. Les massages thaïlandais traditionnels, dispensés par des praticiens formés à Bangkok, allient étirements et pressions pour libérer les énergies bloquées. Les massages aux pierres chaudes, utilisant des basaltes volcaniques, procurent une détente profonde et durable.

Notre gamme de soins visage utilise exclusivement des produits biologiques français de haute qualité. Les soins anti-âge à base de caviar et d'or 24 carats, les masques purifiants à l'argile verte du Vaucluse, et les gommages aux sels de Guérande offrent une expérience sensorielle exceptionnelle tout en préservant la beauté naturelle de la peau.

La salle de fitness, équipée des dernières technologies Technogym, permet de maintenir sa forme physique dans un cadre privilégié. Vélos elliptiques, tapis de course avec vue sur les jardins, et appareils de musculation haut de gamme sont à disposition, accompagnés des conseils de notre coach personnel diplômé d'État.

L'espace détente, avec ses fauteuils massants et sa tisanerie, prolonge les bienfaits des soins. Une sélection de thés biologiques et d'infusions aux plantes du jardin du château accompagne ces moments de quiétude absolue, dans un silence seulement troublé par le murmure de la fontaine zen.`
    },
    {
      id: 'chambres',
      title: 'Chambres d\'Exception',
      description: 'Nos suites royales offrent un confort inégalé avec vue panoramique sur les jardins. Chaque chambre est unique, décorée avec des œuvres d\'art et des meubles d\'époque.',
      videoUrl: 'https://videos.pexels.com/video-files/6186665/6186665-uhd_2560_1440_30fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Crown,
      detailedDescription: `Nos Chambres d'Exception incarnent l'art de vivre à la française dans sa plus noble expression. Chaque suite du Château Royal raconte une histoire unique, mêlant patrimoine historique et confort contemporain pour créer des espaces de vie d'une élégance intemporelle.

La Suite Royale Versailles, notre joyau absolu, s'étend sur 120 m² et reproduit fidèlement les appartements de Louis XIV. Les boiseries dorées à la feuille, les tapisseries d'Aubusson et le mobilier estampillé par les plus grands ébénistes du XVIIIe siècle créent une atmosphère d'exception. Le lit à baldaquin en bois de rose, surmonté de soieries de Lyon, trône au centre de cette suite présidentielle.

Chaque chambre bénéficie d'une vue panoramique sur nos jardins à la française, dessinés par un disciple de Le Nôtre. Les fenêtres à meneaux, restaurées dans le respect de l'architecture d'origine, encadrent des perspectives soigneusement composées où parterres de buis, bassins et statues de marbre s'harmonisent dans une géométrie parfaite.

Les salles de bain, véritables écrins de marbre italien, allient luxe et fonctionnalité. Les baignoires en marbre de Carrare, taillées dans la masse, côtoient des douches à l'italienne équipées de systèmes de chromothérapie et d'aromathérapie. Les robinetteries en or rose, spécialement conçues par des artisans français, apportent une touche de raffinement ultime.

Notre collection d'œuvres d'art, constituée au fil des siècles, orne chaque chambre de pièces uniques. Toiles de maîtres, sculptures de bronze et porcelaines de Sèvres transforment chaque espace en véritable musée privé. Les éclairages sur mesure, conçus par des designers renommés, mettent en valeur ces trésors tout en créant une ambiance feutrée propice au repos.

Le mobilier d'époque, authentifié par les experts des musées nationaux, témoigne du savoir-faire ancestral des artisans français. Commodes marquetées, secrétaires en laque de Chine, bergères tapissées de soies précieuses : chaque pièce raconte l'histoire du mobilier français et de ses influences internationales.

Les technologies modernes s'intègrent discrètement dans ce décor historique. Systèmes domotiques invisibles, climatisation silencieuse, connexions haut débit et écrans escamotables permettent de profiter du confort contemporain sans altérer l'authenticité des lieux. Les coffres-forts numériques, dissimulés derrière des panneaux secrets, protègent les biens précieux de nos hôtes.

Le service personnalisé de majordome, disponible 24h/24, anticipe tous les désirs de notre clientèle exigeante. Préparation des bagages, réservations de restaurants étoilés, organisation d'excursions privées : rien n'est laissé au hasard pour garantir un séjour d'exception.

Les suites familiales, conçues pour accueillir jusqu'à six personnes, offrent des espaces modulables sans compromettre l'intimité de chacun. Chambres communicantes, salons privés et terrasses fleuries permettent de partager des moments privilégiés en famille tout en préservant les espaces personnels.

L'attention portée aux détails se révèle dans chaque élément : draps en lin de Flandre brodés aux armes du château, oreillers en duvet d'oie de Hongrie, plaids en cachemire d'Écosse. Même les plus petits accessoires, des boutons de tiroirs aux poignées de portes, ont été choisis ou restaurés avec un soin méticuleux pour préserver l'authenticité de ces lieux chargés d'histoire.`
    },
    {
      id: 'voiturier',
      title: 'Service de Voiturier',
      description: 'Notre équipe de voituriers s\'occupe de vos véhicules de prestige avec le plus grand soin. Parking sécurisé et service de nettoyage disponible.',
      videoUrl: 'https://videos.pexels.com/video-files/5098925/5098925-hd_1920_1080_30fps.mp4',
      fallbackImage: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Car,
      detailedDescription: `Notre Service de Voiturier représente l'excellence du service à la française appliquée à l'automobile de prestige. Conscients que votre véhicule est le prolongement de votre personnalité et de votre statut, nous avons développé un service sur mesure qui traite chaque automobile comme un objet d'art précieux.

L'équipe de voituriers professionnels, formée aux techniques de conduite de véhicules de luxe et de collection, maîtrise parfaitement la manipulation de tous types d'automobiles, des supercars italiennes aux limousines britanniques en passant par les véhicules électriques de dernière génération. Chaque membre de notre équipe possède un permis de conduire professionnel et une assurance spécialisée dans les véhicules de prestige.

Notre garage souterrain climatisé, d'une capacité de 50 véhicules, offre un environnement optimal pour la préservation de votre automobile. La température constante de 18°C et l'hygrométrie contrôlée protègent les cuirs précieux, les boiseries et les mécaniques délicates. Le système de ventilation à flux laminaire évite l'accumulation de poussière et maintient un air pur en permanence.

La sécurité constitue notre priorité absolue avec un système de surveillance 24h/24 comprenant caméras haute définition, détecteurs de mouvement et accès sécurisé par badges biométriques. Seuls les voituriers autorisés peuvent accéder aux véhicules, et chaque mouvement est enregistré et tracé. Un service de gardiennage physique complète ce dispositif technologique pour une protection maximale.

Le service de nettoyage et d'entretien, réalisé par des spécialistes certifiés, utilise exclusivement des produits haut de gamme adaptés à chaque type de matériau. Cuirs Connolly, alcantara, fibre de carbone ou boiseries précieuses : chaque surface reçoit un traitement spécifique pour préserver son éclat et sa longévité. Les produits de nettoyage, importés d'Allemagne et d'Italie, respectent les finitions d'origine.

Notre atelier de maintenance préventive, équipé des dernières technologies de diagnostic, peut effectuer les contrôles de routine et les petites réparations. Partenaires officiels des plus grandes marques automobiles, nous disposons des outils spécialisés et des pièces détachées d'origine pour maintenir vos véhicules en parfait état de fonctionnement.

Le service de conciergerie automobile étend nos prestations au-delà du simple stationnement. Rendez-vous chez votre concessionnaire, contrôles techniques, renouvellement d'assurance : notre équipe administrative prend en charge toutes les démarches liées à votre véhicule, vous permettant de vous concentrer sur l'essentiel de votre séjour.

Pour les véhicules de collection et les supercars, nous proposons un service premium incluant la mise en température du moteur, le contrôle des niveaux et la vérification des pneumatiques avant chaque utilisation. Cette attention particulière garantit des performances optimales et préserve la mécanique de ces automobiles d'exception.

Le service de livraison et de récupération s'étend dans un rayon de 200 kilomètres autour du château. Que vous arriviez en jet privé ou que vous souhaitiez récupérer votre véhicule à votre domicile, notre équipe se déplace avec un camion-plateau spécialisé pour transporter votre automobile dans les meilleures conditions.

L'accueil personnalisé de chaque véhicule comprend une inspection complète documentée par photos, garantissant la traçabilité de l'état de votre automobile. Un rapport détaillé vous est remis à l'arrivée et au départ, attestant du soin apporté à votre bien durant tout votre séjour au château.`
    }
  ];

  const VideoComponent = ({ videoUrl, fallbackImage, alt }: { videoUrl: string, fallbackImage: string, alt: string }) => {
    const [hasError, setHasError] = React.useState(false);

    return (
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        {!hasError ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-80 object-cover"
            onError={() => setHasError(true)}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={fallbackImage}
            alt={alt}
            className="w-full h-80 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-900/50 to-transparent"></div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-r from-luxury-900 to-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Crown className="h-16 w-16 text-gold-500 mx-auto mb-6" />
            <h1 className="text-5xl font-serif font-bold text-white mb-6">
              Notre Histoire
            </h1>
            <p className="text-xl text-gold-200 max-w-3xl mx-auto">
              Découvrez l'héritage du Château Royal, où tradition aristocratique et luxe moderne se rencontrent
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vue Extérieure du Château */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <VideoComponent
            videoUrl="https://videos.pexels.com/video-files/6077464/6077464-uhd_2560_1440_30fps.mp4"
            fallbackImage="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Vue extérieure du château"
          />
          <div className="absolute inset-0 bg-luxury-900/40"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl font-serif font-bold text-white mb-4">
                Un Château d'Exception
              </h2>
              <p className="text-xl text-gold-200 max-w-2xl mx-auto">
                Construit au XVIIIe siècle, notre château incarne l'art de vivre à la française
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections avec vidéos */}
      {sections.map((section, index) => (
        <section key={section.id} className={`py-20 ${index % 2 === 0 ? 'bg-luxury-800' : 'bg-luxury-900'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2"
              >
                <VideoComponent
                  videoUrl={section.videoUrl}
                  fallbackImage={section.fallbackImage}
                  alt={section.title}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <div className="flex items-center mb-6">
                  <section.icon className="h-8 w-8 text-gold-500 mr-4" />
                  <h2 className="text-3xl font-serif font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-lg text-gold-200 leading-relaxed mb-8">
                  {section.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedModal(section.id)}
                  className="bg-gold-500 hover:bg-gold-600 text-luxury-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  En Savoir Plus
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Histoire Section */}
      <section className="py-20 bg-gradient-to-r from-gold-900 to-gold-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-serif font-bold text-white mb-8">
              Trois Siècles d'Excellence
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gold-100 mb-6 leading-relaxed">
                Depuis 1720, le Château Royal accueille l'élite européenne dans un cadre d'exception. 
                Construit par le Duc de Montclair, ce joyau architectural a traversé les siècles en 
                préservant son authenticité tout en s'adaptant aux exigences du luxe moderne.
              </p>
              <p className="text-lg text-gold-100 leading-relaxed">
                Aujourd'hui, nous perpétuons cette tradition d'excellence avec un service personnalisé 
                et des équipements de dernière génération, pour offrir à nos hôtes une expérience unique 
                alliant histoire, culture et raffinement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modales détaillées */}
      <AnimatePresence>
        {selectedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-luxury-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gold-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              {sections.map((section) => {
                if (section.id !== selectedModal) return null;
                
                return (
                  <div key={section.id} className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <section.icon className="h-8 w-8 text-gold-500 mr-4" />
                        <h2 className="text-3xl font-serif font-bold text-white">
                          {section.title}
                        </h2>
                      </div>
                      <button
                        onClick={() => setSelectedModal(null)}
                        className="text-gold-300 hover:text-gold-200 transition-colors"
                      >
                        <X className="h-8 w-8" />
                      </button>
                    </div>
                    
                    <div className="prose prose-invert prose-gold max-w-none">
                      <div className="text-gold-200 leading-relaxed whitespace-pre-line">
                        {section.detailedDescription}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Histoire;