import { getWordRelations } from './wordnet';

export interface TrainingData {
  input: string;
  output: string;
  category: 'blog' | 'ats';
  context?: string;
}

// Données d'entraînement pour les titres de blog
export const blogTitleTrainingData: TrainingData[] = [
  {
    input: 'Comment optimiser son référencement naturel en 2024',
    output: 'SEO optimization',
    category: 'blog',
    context: 'digital marketing',
  },
  // Ajoutez plus d'exemples ici
];

// Données d'entraînement pour l'ATS
export const atsTrainingData: TrainingData[] = [
  {
    input: "5 ans d'expérience en développement web, expert React et Node.js",
    output: 'senior_developer',
    category: 'ats',
    context: 'tech recruitment',
  },
  // Ajoutez plus d'exemples ici
];

export async function generateTrainingData(
  baseWord: string,
  context: string
): Promise<TrainingData[]> {
  const trainingData: TrainingData[] = [];

  try {
    const relations = await getWordRelations(baseWord);

    // Ajouter l'entrée originale
    trainingData.push({
      input: baseWord,
      output: baseWord,
      category: 'ats',
      context: context,
    });

    // Ajouter les synonymes
    for (const synonym of relations.synonyms) {
      trainingData.push({
        input: synonym,
        output: baseWord,
        category: 'ats',
        context: context,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération des données:', error);
  }

  return trainingData;
}
