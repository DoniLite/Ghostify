import fs from 'node:fs';
import { TrainingDataGenerator } from './Generator';

// Types
interface DatasetMetadata {
  name: string;
  description: string;
  version: string;
  lastUpdated: Date;
  categories: string[];
  size: number;
}

interface Dataset {
  metadata: DatasetMetadata;
  data: TrainingExample[];
}

export interface TrainingExample {
  text: string;
  category: string;
  context?: string;
  confidence?: number;
}

// Gestionnaire de données d'entraînement
export class TrainingDataManager {
  private datasets: Map<string, Dataset>;
  private generator: TrainingDataGenerator;

  constructor() {
    this.datasets = new Map();
    this.generator = new TrainingDataGenerator();
    this.initializeDefaultDatasets();
  }

  private initializeDefaultDatasets() {
    // Initialiser les datasets par défaut
    this.createDataset('cv-technical', 'CV Technical Skills Dataset');
    this.createDataset('cv-soft', 'CV Soft Skills Dataset');
    this.createDataset('cv-education', 'Education and Certifications Dataset');
    this.createDataset('blog-tech', 'Technical Blog Posts Dataset');
    this.createDataset('blog-tutorial', 'Tutorial Blog Posts Dataset');
  }

  // Créer un nouveau dataset
  createDataset(id: string, description: string): void {
    const metadata: DatasetMetadata = {
      name: id,
      description: description,
      version: '1.0.0',
      lastUpdated: new Date(),
      categories: [],
      size: 0,
    };

    this.datasets.set(id, {
      metadata,
      data: [],
    });
  }

  // Générer des données pour un dataset spécifique
  generateDatasetContent(id: string, categoryConfigs: CategoryConfig[]): void {
    const dataset = this.datasets.get(id);
    if (!dataset) throw new Error(`Dataset ${id} not found`);

    categoryConfigs.forEach((config) => {
      this.generator.addCategory(
        config.category,
        config.baseWords,
        config.contextTemplates
      );
    });

    const generatedData = this.generator.generateTrainingData();
    dataset.data = generatedData;
    dataset.metadata.size = generatedData.length;
    dataset.metadata.categories = categoryConfigs.map((c) => c.category);
    dataset.metadata.lastUpdated = new Date();
  }

  // Sauvegarder un dataset au format JSON
  saveDataset(id: string, filepath: string): void {
    const dataset = this.datasets.get(id);
    if (!dataset) {
      throw new Error(`Dataset ${id} not found`);
    }

    const jsonData = JSON.stringify(dataset, null, 2);
    fs.writeFileSync(filepath, jsonData);
    console.log(`Dataset ${id} saved to ${filepath}`);
  }

  // Charger un dataset depuis un fichier JSON
  loadDataset(id: string, filepath: string): void {
    // Dans un environnement Node.js:
    // const jsonData = fs.readFileSync(filepath, 'utf8');
    // const dataset = JSON.parse(jsonData);
    // this.datasets.set(id, dataset);
    console.log(`Dataset ${id} loaded from ${filepath}`);
  }

  // Obtenir des exemples filtrés par catégorie
  getExamplesByCategory(
    datasetId: string,
    category: string
  ): TrainingExample[] {
    const dataset = this.datasets.get(datasetId);
    if (!dataset) {
      throw new Error(`Dataset ${datasetId} not found`);
    }

    return dataset.data.filter((example) => example.category === category);
  }

  // Obtenir les métadonnées d'un dataset
  getDatasetMetadata(id: string): DatasetMetadata | undefined {
    return this.datasets.get(id)?.metadata;
  }

  // Fusionner plusieurs datasets
  mergeDatasets(targetId: string, sourceIds: string[]): void {
    const targetDataset = this.datasets.get(targetId);
    if (!targetDataset) throw new Error(`Target dataset ${targetId} not found`);

    sourceIds.forEach((sourceId) => {
      const sourceDataset = this.datasets.get(sourceId);
      if (sourceDataset) {
        targetDataset.data = [...targetDataset.data, ...sourceDataset.data];
        targetDataset.metadata.categories = [
          ...new Set([
            ...targetDataset.metadata.categories,
            ...sourceDataset.metadata.categories,
          ]),
        ];
      }
    });

    targetDataset.metadata.size = targetDataset.data.length;
    targetDataset.metadata.lastUpdated = new Date();
  }
}

// Configuration des catégories pour différents contextes
export interface CategoryConfig {
  category: string;
  baseWords: string[];
  contextTemplates: string[];
}

// Configurations par défaut pour différents contextes
const cvTechnicalConfig: CategoryConfig[] = [
  {
    category: 'programming_languages',
    baseWords: [
      'JavaScript',
      'Python',
      'Java',
      'C++',
      'TypeScript',
      'Ruby',
      'Go',
      'Rust',
      'PHP',
      'Swift',
      'Kotlin',
      'Scala',
    ],
    contextTemplates: [
      'Expert in ${word} development with 5+ years experience',
      'Advanced ${word} programming and architecture',
      'Built enterprise applications using ${word}',
      'Implemented scalable solutions in ${word}',
      'Led ${word} development team',
      'Optimized ${word} applications for performance',
    ],
  },
  {
    category: 'frameworks',
    baseWords: [
      'React',
      'Angular',
      'Vue.js',
      'Node.js',
      'Django',
      'Flask',
      'Spring Boot',
      'Laravel',
      'Express.js',
      'Next.js',
      'Nuxt.js',
    ],
    contextTemplates: [
      'Developed complex applications with ${word}',
      'Created responsive interfaces using ${word}',
      'Maintained and scaled ${word} applications',
      'Implemented microservices using ${word}',
      'Built REST APIs with ${word}',
    ],
  },
  {
    category: 'cloud_services',
    baseWords: [
      'AWS',
      'Azure',
      'Google Cloud',
      'Kubernetes',
      'Docker',
      'Terraform',
      'Jenkins',
      'GitLab CI',
      'CircleCI',
    ],
    contextTemplates: [
      'Architected solutions on ${word}',
      'Deployed and managed ${word} infrastructure',
      'Implemented CI/CD pipelines using ${word}',
      'Automated deployment with ${word}',
      'Optimized cloud costs using ${word}',
    ],
  },
];

const cvSoftSkillsConfig: CategoryConfig[] = [
  {
    category: 'leadership',
    baseWords: [
      'leadership',
      'management',
      'mentoring',
      'coaching',
      'strategy',
      'vision',
      'direction',
      'guidance',
    ],
    contextTemplates: [
      'Demonstrated strong ${word} abilities',
      'Provided ${word} to junior developers',
      'Excellence in team ${word}',
      'Strategic ${word} of technical projects',
    ],
  },
  {
    category: 'communication',
    baseWords: [
      'communication',
      'presentation',
      'documentation',
      'collaboration',
      'interpersonal',
      'articulation',
      'facilitation',
    ],
    contextTemplates: [
      'Excellent ${word} skills with stakeholders',
      'Strong written and verbal ${word}',
      'Enhanced team ${word} processes',
      'Led technical ${word} sessions',
    ],
  },
];

// Exemple d'utilisation
const manager = new TrainingDataManager();

// Générer des données pour le dataset CV technique
manager.generateDatasetContent('cv-technical', cvTechnicalConfig);

// Générer des données pour le dataset CV soft skills
manager.generateDatasetContent('cv-soft', cvSoftSkillsConfig);

// Obtenir des exemples spécifiques
const programmingExamples = manager.getExamplesByCategory(
  'cv-technical',
  'programming_languages'
);

// Sauvegarder les datasets
manager.saveDataset('cv-technical', './data/cv-technical.json');
manager.saveDataset('cv-soft', './data/cv-soft.json');

// Fusionner des datasets
manager.mergeDatasets('cv-complete', ['cv-technical', 'cv-soft']);
