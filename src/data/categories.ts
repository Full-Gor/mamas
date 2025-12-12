import type { Category } from '../types';

// 40 catégories avec leurs couleurs et mots-clés pour la reconnaissance vocale
export const categories: Category[] = [
  {
    id: 'medecin',
    name: 'Médecin',
    color: '#DC143C', // Rouge cerise
    keywords: ['médecin', 'docteur', 'consultation', 'généraliste', 'médical']
  },
  {
    id: 'amis-fete',
    name: 'Ami(e)s / Fête',
    color: '#F5F5DC', // Beige
    keywords: ['ami', 'amis', 'amie', 'fête', 'anniversaire', 'soirée', 'copain', 'copine']
  },
  {
    id: 'gardien',
    name: 'Gardien',
    color: '#FFFFFF', // Blanc
    keywords: ['gardien', 'concierge', 'immeuble']
  },
  {
    id: 'reunion',
    name: 'Réunion',
    color: '#007FFF', // Bleu azur
    keywords: ['réunion', 'meeting', 'rendez-vous professionnel', 'conf']
  },
  {
    id: 'mental-intellectuel',
    name: 'Mental / Intellectuel',
    color: '#2A52BE', // Bleu cérulé
    keywords: ['psychologue', 'psy', 'thérapie', 'mental', 'intellectuel', 'coaching']
  },
  {
    id: 'accompagner',
    name: 'Accompagner',
    color: '#87CEEB', // Bleu ciel
    keywords: ['accompagner', 'accompagnement', 'emmener', 'chercher', 'déposer']
  },
  {
    id: 'banque',
    name: 'Banque',
    color: '#00FFFF', // Bleu cyan
    keywords: ['banque', 'bancaire', 'conseiller', 'compte', 'crédit']
  },
  {
    id: 'voyage',
    name: 'Voyage',
    color: '#000080', // Bleu marine
    keywords: ['voyage', 'vacances', 'départ', 'avion', 'train', 'hôtel']
  },
  {
    id: 'creer-organiser',
    name: 'Créer / Organiser',
    color: '#0F52BA', // Bleu saphir
    keywords: ['créer', 'organiser', 'planifier', 'préparer', 'organisation']
  },
  {
    id: 'achat',
    name: 'Achat(s)',
    color: '#708090', // Gris ardoise
    keywords: ['achat', 'acheter', 'shopping', 'magasin']
  },
  {
    id: 'garage-mecanicien',
    name: 'Garage / Mécanicien',
    color: '#BDB76B', // Gris argile
    keywords: ['garage', 'mécanicien', 'voiture', 'auto', 'réparation', 'contrôle technique']
  },
  {
    id: 'ranger-trier',
    name: 'Ranger / Trier',
    color: '#4A4A4A', // Gris fer
    keywords: ['ranger', 'trier', 'rangement', 'organiser maison', 'ménage']
  },
  {
    id: 'avocat',
    name: 'Avocat',
    color: '#9E9E9E', // Gris souris
    keywords: ['avocat', 'juridique', 'justice', 'procès', 'consultation juridique']
  },
  {
    id: 'revision',
    name: 'Révision',
    color: '#FFF44F', // Jaune citron
    keywords: ['révision', 'réviser', 'étudier', 'examen', 'cours']
  },
  {
    id: 'courrier-email',
    name: 'Courrier / SMS / E-mail',
    color: '#FFD700', // Jaune or
    keywords: ['courrier', 'email', 'mail', 'sms', 'lettre', 'message', 'envoyer']
  },
  {
    id: 'cinema',
    name: 'Cinéma',
    color: '#6F4E37', // Marron café
    keywords: ['cinéma', 'film', 'ciné', 'séance']
  },
  {
    id: 'rendez-vous',
    name: 'Rendez-vous',
    color: '#C68E17', // Marron caramel
    keywords: ['rendez-vous', 'rdv', 'rencontre']
  },
  {
    id: 'menage',
    name: 'Repassage / Vaisselle',
    color: '#D2691E', // Marron citrouille
    keywords: ['repassage', 'vaisselle', 'ménage', 'linge', 'nettoyer']
  },
  {
    id: 'photocopier',
    name: 'Photocopier',
    color: '#8B4513', // Marron noisette
    keywords: ['photocopie', 'photocopier', 'imprimer', 'copie', 'scanner']
  },
  {
    id: 'couture-pressing',
    name: 'Couture / Pressing',
    color: '#FFBF00', // Orange abricot
    keywords: ['couture', 'pressing', 'teinturier', 'coudre', 'retouche']
  },
  {
    id: 'courses',
    name: 'Courses',
    color: '#ED9121', // Orange carotte
    keywords: ['courses', 'supermarché', 'marché', 'épicerie', 'provisions']
  },
  {
    id: 'commande-abonnement',
    name: 'Commande / Abonnement',
    color: '#FF7F50', // Orange corail
    keywords: ['commande', 'abonnement', 'commander', 'renouvellement', 'livraison']
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    color: '#FF8C00', // Orange mandarine
    keywords: ['restaurant', 'resto', 'dîner', 'déjeuner', 'repas', 'manger']
  },
  {
    id: 'dentiste',
    name: 'Spécialiste Santé / Dentiste',
    color: '#E30B5C', // Rose cerise
    keywords: ['dentiste', 'dent', 'spécialiste', 'ophtalmologue', 'dermatologue', 'ORL']
  },
  {
    id: 'hopital',
    name: 'Hôpital',
    color: '#F4C2C2', // Rose dragée
    keywords: ['hôpital', 'urgences', 'clinique', 'hospitalisation', 'opération']
  },
  {
    id: 'radiologie',
    name: 'Radiologie / Analyse',
    color: '#FF00FF', // Rose fuchsia
    keywords: ['radiologie', 'radio', 'analyse', 'prise de sang', 'scanner', 'IRM', 'laboratoire']
  },
  {
    id: 'kine',
    name: 'Kinésithérapeute',
    color: '#D8BFD8', // Rose thé
    keywords: ['kiné', 'kinésithérapeute', 'kinésithérapie', 'rééducation', 'massage']
  },
  {
    id: 'veterinaire',
    name: 'Vétérinaire',
    color: '#DC143C', // Rouge grenadine
    keywords: ['vétérinaire', 'véto', 'animal', 'chien', 'chat', 'vaccin animal']
  },
  {
    id: 'sport',
    name: 'Activité / Sport',
    color: '#E34234', // Rouge vermillon
    keywords: ['sport', 'gym', 'fitness', 'piscine', 'foot', 'tennis', 'yoga', 'course']
  },
  {
    id: 'aider',
    name: 'Aider',
    color: '#F3E5AB', // Vanille
    keywords: ['aider', 'aide', 'bénévolat', 'service', 'coup de main']
  },
  {
    id: 'randonnee',
    name: 'Randonnée / Promenade',
    color: '#7CFC00', // Vert gazon
    keywords: ['randonnée', 'promenade', 'marche', 'balade', 'forêt', 'nature']
  },
  {
    id: 'choisir-decider',
    name: 'Choisir / Décider',
    color: '#808000', // Vert olive
    keywords: ['choisir', 'décider', 'décision', 'réfléchir', 'choix']
  },
  {
    id: 'ecole',
    name: 'École',
    color: '#93C572', // Vert pistache
    keywords: ['école', 'scolaire', 'professeur', 'parent élève', 'réunion école']
  },
  {
    id: 'bricolage',
    name: 'Jardiner / Réparer / Bricoler',
    color: '#228B22', // Vert sapin
    keywords: ['jardiner', 'réparer', 'bricoler', 'jardin', 'bricolage', 'plantes']
  },
  {
    id: 'police',
    name: 'Police',
    color: '#702963', // Violet byzantin
    keywords: ['police', 'gendarmerie', 'commissariat', 'plainte', 'déclaration']
  },
  {
    id: 'examen',
    name: 'Examen',
    color: '#DF73FF', // Violet héliotrope
    keywords: ['examen', 'test', 'épreuve', 'concours', 'diplôme']
  },
  {
    id: 'service-social',
    name: 'Service Social',
    color: '#E6E6FA', // Violet lavande
    keywords: ['service social', 'assistante sociale', 'social', 'aide sociale']
  },
  {
    id: 'assurance-admin',
    name: 'Assurance / Administration',
    color: '#8B008B', // Violet magenta foncé
    keywords: ['assurance', 'administration', 'papiers', 'mairie', 'préfecture', 'impôts']
  },
  {
    id: 'caf',
    name: 'CAF',
    color: '#E0B0FF', // Violet mauve
    keywords: ['caf', 'allocation', 'aide familiale', 'allocations']
  },
  {
    id: 'justice',
    name: 'Justice',
    color: '#673147', // Violet prune
    keywords: ['justice', 'tribunal', 'audience', 'convocation', 'procès']
  }
];

// Fonction pour trouver une catégorie par mot-clé
export function findCategoryByKeyword(text: string): Category | null {
  const lowerText = text.toLowerCase();

  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }

  return null;
}

// Fonction pour obtenir une catégorie par ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

// Catégorie par défaut si aucune n'est trouvée
export const defaultCategory: Category = {
  id: 'rendez-vous',
  name: 'Rendez-vous',
  color: '#C68E17',
  keywords: ['rendez-vous', 'rdv', 'rencontre']
};
