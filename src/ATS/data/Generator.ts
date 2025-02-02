import { getWordRelations } from './wordnet';

// Types de base
interface TrainingExample {
  text: string;
  category: string;
}

interface CategoryData {
  baseWords: string[];
  contextTemplates: string[];
  variations: string[];
}

export class TrainingDataGenerator {
  private categories: Map<string, CategoryData>;
  private variations: string[] = [];

  constructor() {
    this.categories = new Map();
  }

  // Ajouter une nouvelle catégorie avec ses données de base
  addCategory(
    categoryName: string,
    baseWords: string[],
    contextTemplates: string[] = [],
    variations: string[] = []
  ) {
    this.categories.set(categoryName, {
      baseWords,
      contextTemplates,
      variations,
    });
  }

  // Générer des variations d'un mot de manière plus intelligente
  private generateWordVariations(word: string): string[] {
    const variations: Set<string> = new Set([
      word,
      word.toLowerCase(),
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    ]);

    // Seulement si le mot fait plus de 4 caractères
    if (word.length > 4) {
      // Génération de fautes d'orthographe plausibles
      this.generateCommonWord(word);
      this.variations.forEach((typo) => variations.add(typo));
    }

    return Array.from(variations);
  }

  // Générer uniquement des fautes d'orthographe plausibles
  private generateCommonWord(word: string): void {
    // return Array.from(typos);
    getWordRelations(word)
      .then((relations) => {
        this.variations.push(
          ...relations.synonyms,
          ...relations.hypernyms,
          ...relations.hyponyms
        );
      })
      .catch((err) => {
        console.error(err);
        throw new Error('error during the relations word creation');
      });
  }

  // Vérifier si une faute est plausible
  private isPlausibleTypo(typo: string, original: string): boolean {
    // Calcul simple de la distance de Levenshtein
    let distance = 0;
    for (let i = 0; i < Math.max(typo.length, original.length); i++) {
      if (typo[i] !== original[i]) {
        distance++;
      }
    }
    // Accepter seulement les variations avec une distance de 1 ou 2
    return distance > 0 && distance <= 2;
  }

  // Génération de phrases contextuelles sophistiquées
  private generateSentences(categoryData: CategoryData): string[] {
    const sentences: Set<string> = new Set();

    for (const baseWord of categoryData.baseWords) {
      const variations = this.generateWordVariations(baseWord);

      for (const template of categoryData.contextTemplates) {
        for (const variation of variations) {
          // Remplacement intelligent avec gestion de la casse
          const sentence = this.applyTemplate(template, variation);
          if (this.isValidSentence(sentence)) {
            sentences.add(sentence);
          }
        }
      }
    }

    return Array.from(sentences);
  }

  // Appliquer un template de manière intelligente
  private applyTemplate(template: string, word: string): string {
    // Gestion de la position dans la phrase pour la casse
    if (template.startsWith('${word}')) {
      word = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return template.replace('${word}', word);
  }

  // Valider une phrase générée
  private isValidSentence(sentence: string): boolean {
    // Vérifications de base pour la validité d'une phrase
    return (
      sentence.length > 5 &&
      /^[A-Z]/.test(sentence) && // Commence par une majuscule
      /[a-zA-Z\s]$/.test(sentence) && // Se termine correctement
      !/\s\s+/.test(sentence)
    ); // Pas d'espaces multiples
  }

  // Générer toutes les données d'entraînement
  generateTrainingData(): TrainingExample[] {
    const trainingData: TrainingExample[] = [];

    for (const [category, categoryData] of this.categories.entries()) {
      const sentences = this.generateSentences(categoryData);

      for (const sentence of sentences) {
        trainingData.push({
          text: sentence,
          category: category,
        });
      }
    }

    return this.shuffleArray(trainingData);
  }

  // Mélanger les données générées
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Exporter les données au format JSON
  exportToJSON(): string {
    return JSON.stringify(this.generateTrainingData(), null, 2);
  }
}
