import fs from 'node:fs';
import { TrainingDataGenerator } from './Generator.ts';
import path from 'node:path';
import process from "node:process";

const DATASETS_PATH = path.resolve(process.cwd(), '/src/ATS/datasets');
// Types
interface DatasetMetadata {
  name: string;
  description: string;
  version: string;
  lastUpdated: Date;
  categories: string[];
  size: number;
}

type SliceType = { start: number; end: number };

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

  updateMetaData(id: string, meta: Record<string, unknown>): void {
    const dataset = this.datasets.get(id);
    if (!dataset) throw new Error(`Dataset ${id} not found`);
    for (const [key, value] of Object.entries(meta)) {
      dataset.metadata[key as 'name' | 'description'] = value as string;
    }
    this.datasets.set(id, dataset);
  }

  /**
   * Retrieve a list of all dataset IDs.
   *
   * @returns {string[]} An array of dataset IDs.
   */

  getDatasetIds(): string[] {
    const datasets: string[] = [];
    for (const [id, _] of this.datasets.entries()) {
      datasets.push(id);
    }
    return datasets;
  }

  getDataFromDataset(id: string, size?: number | SliceType): TrainingExample[] {
    const dataset = this.datasets.get(id);
    if (!dataset) throw new Error(`Dataset ${id} not found`);
    return size && typeof size === 'number'
      ? dataset.data.slice(0, size)
      : size && typeof size !== 'number'
      ? dataset.data.slice(size.start, size.end)
      : dataset.data;
  }

  // Générer des données pour un dataset spécifique
  generateDatasetContent(id: string, categoryConfigs: CategoryConfig[]): void {
    const dataset = this.datasets.get(id);
    if (!dataset) throw new Error(`Dataset ${id} not found`);

    categoryConfigs.forEach((config) => {
      this.generator.addCategory(
        config.category,
        config.baseWords,
        config.contextTemplates,
      );
    });

    const generatedData = this.generator.generateTrainingData();
    dataset.data = generatedData;
    dataset.metadata.size = generatedData.length;
    dataset.metadata.categories = categoryConfigs.map((c) => c.category);
    dataset.metadata.lastUpdated = new Date();
    this.datasets.set(id, dataset);
  }

  // Sauvegarder un dataset au format JSON
  saveDataset(id: string, name: string, customPath?: string): void {
    const dataset = this.datasets.get(id);
    if (!dataset) {
      throw new Error(`Dataset ${id} not found`);
    }

    const jsonData = JSON.stringify(dataset, null, 2);
    fs.writeFileSync(
      path.join(customPath || DATASETS_PATH, `${name}.json`),
      jsonData,
    );
    console.log(
      `Dataset ${id} saved to ${path.join(DATASETS_PATH, `${name}.json`)}`,
    );
  }

  // Charger un dataset depuis un fichier JSON
  loadDataset(id: string, name: string, customPath?: string): void {
    const dataPath = path.join(customPath || DATASETS_PATH, `${name}.json`);
    const data = fs.readFileSync(dataPath, 'utf8');
    const dataset = JSON.parse(data) as Dataset;
    this.datasets.set(id, dataset);
    console.log(`Dataset ${id} loaded from ${dataPath}`);
  }

  // Obtenir des exemples filtrés par catégorie
  getExamplesByCategory(
    datasetId: string,
    category: string,
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
    this.datasets.set(targetId, targetDataset);
  }
}

// Configuration des catégories pour différents contextes
export interface CategoryConfig {
  category: string;
  baseWords: string[];
  contextTemplates: string[];
}
