import type { Category } from '../types';

// 40 catégories avec leurs couleurs et mots-clés
export const categories: Category[] = [
  { id: 'medecin', name: 'Médecin', color: '#DC143C', keywords: ['médecin', 'docteur', 'consultation'] },
  { id: 'amis-fete', name: 'Ami(e)s / Fête', color: '#F5F5DC', keywords: ['ami', 'fête', 'anniversaire'] },
  { id: 'gardien', name: 'Gardien', color: '#FFFFFF', keywords: ['gardien', 'concierge'] },
  { id: 'reunion', name: 'Réunion', color: '#007FFF', keywords: ['réunion', 'meeting'] },
  { id: 'mental', name: 'Mental / Intellectuel', color: '#2A52BE', keywords: ['psy', 'thérapie'] },
  { id: 'accompagner', name: 'Accompagner', color: '#87CEEB', keywords: ['accompagner', 'emmener'] },
  { id: 'banque', name: 'Banque', color: '#00FFFF', keywords: ['banque', 'compte'] },
  { id: 'voyage', name: 'Voyage', color: '#000080', keywords: ['voyage', 'vacances'] },
  { id: 'organiser', name: 'Créer / Organiser', color: '#0F52BA', keywords: ['créer', 'organiser'] },
  { id: 'achat', name: 'Achat(s)', color: '#708090', keywords: ['achat', 'shopping'] },
  { id: 'garage', name: 'Garage / Mécanicien', color: '#BDB76B', keywords: ['garage', 'voiture'] },
  { id: 'ranger', name: 'Ranger / Trier', color: '#4A4A4A', keywords: ['ranger', 'trier'] },
  { id: 'avocat', name: 'Avocat', color: '#9E9E9E', keywords: ['avocat', 'juridique'] },
  { id: 'revision', name: 'Révision', color: '#FFF44F', keywords: ['révision', 'étudier'] },
  { id: 'courrier', name: 'Courrier / Email', color: '#FFD700', keywords: ['courrier', 'email', 'mail'] },
  { id: 'cinema', name: 'Cinéma', color: '#6F4E37', keywords: ['cinéma', 'film'] },
  { id: 'rdv', name: 'Rendez-vous', color: '#C68E17', keywords: ['rendez-vous', 'rdv'] },
  { id: 'menage', name: 'Ménage', color: '#D2691E', keywords: ['ménage', 'vaisselle'] },
  { id: 'photocopie', name: 'Photocopier', color: '#8B4513', keywords: ['photocopie', 'imprimer'] },
  { id: 'couture', name: 'Couture / Pressing', color: '#FFBF00', keywords: ['couture', 'pressing'] },
  { id: 'courses', name: 'Courses', color: '#ED9121', keywords: ['courses', 'supermarché'] },
  { id: 'commande', name: 'Commande', color: '#FF7F50', keywords: ['commande', 'livraison'] },
  { id: 'restaurant', name: 'Restaurant', color: '#FF8C00', keywords: ['restaurant', 'resto'] },
  { id: 'dentiste', name: 'Dentiste', color: '#E30B5C', keywords: ['dentiste', 'dent'] },
  { id: 'hopital', name: 'Hôpital', color: '#F4C2C2', keywords: ['hôpital', 'urgences'] },
  { id: 'radiologie', name: 'Radiologie', color: '#FF00FF', keywords: ['radio', 'analyse'] },
  { id: 'kine', name: 'Kiné', color: '#D8BFD8', keywords: ['kiné', 'massage'] },
  { id: 'veterinaire', name: 'Vétérinaire', color: '#DC143C', keywords: ['vétérinaire', 'animal'] },
  { id: 'sport', name: 'Sport', color: '#E34234', keywords: ['sport', 'gym', 'fitness'] },
  { id: 'aider', name: 'Aider', color: '#F3E5AB', keywords: ['aider', 'aide'] },
  { id: 'randonnee', name: 'Randonnée', color: '#7CFC00', keywords: ['randonnée', 'marche'] },
  { id: 'decider', name: 'Choisir / Décider', color: '#808000', keywords: ['choisir', 'décider'] },
  { id: 'ecole', name: 'École', color: '#93C572', keywords: ['école', 'scolaire'] },
  { id: 'bricolage', name: 'Bricolage', color: '#228B22', keywords: ['bricoler', 'jardin'] },
  { id: 'police', name: 'Police', color: '#702963', keywords: ['police', 'gendarmerie'] },
  { id: 'examen', name: 'Examen', color: '#DF73FF', keywords: ['examen', 'test'] },
  { id: 'social', name: 'Service Social', color: '#E6E6FA', keywords: ['social', 'assistante'] },
  { id: 'admin', name: 'Administration', color: '#8B008B', keywords: ['administration', 'mairie'] },
  { id: 'caf', name: 'CAF', color: '#E0B0FF', keywords: ['caf', 'allocation'] },
  { id: 'justice', name: 'Justice', color: '#673147', keywords: ['justice', 'tribunal'] },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}

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

export const defaultCategory: Category = categories.find(c => c.id === 'rdv')!;
