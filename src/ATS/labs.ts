#!/usr/bin/env node
import { Classifier } from './classifier';
import {
  cvEducationConfig,
  cvSoftSkillsConfig,
  cvTechnicalConfig,
  techBlogConfig,
  tutorialBlogConfig,
} from './data/dataTemplates';
import {
  CategoryConfig,
  TrainingDataManager,
} from './data/TrainingDataGenerator';
import { getWordRelations } from './data/wordnet';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import path from 'node:path';

type Args = {
  process: 'train' | 'init';
  model?: MODELS_NAMES;
  epochs: string;
  dataset: DATASETS_NAMES;
  saveModel?: MODELS_NAMES; 
};

const args = yargs(hideBin(process.argv)).argv as unknown as Args;

const manager = new TrainingDataManager();
const classifier = new Classifier();

export enum DATASETS_NAMES {
  CV = 'cv_data',
  BLOG = 'blog_data',
}

export enum MODELS_NAMES {
  CV_CLASSIFIER = 'OCTOGONE',
  BLOG_CLASSIFIER = 'CAPIYERS',
}

const extendTrainingDataConfig = async (configs: CategoryConfig[]) => {
  const newConfigs: CategoryConfig[] = [];
  for (const config of configs) {
    config.baseWords.forEach(async (word) => {
      const relations = await getWordRelations(word);
      relations.synonyms.forEach((n) => {
        if (!config.baseWords.includes(n)) {
          config.baseWords.push(n);
        }
      });
    });
    newConfigs.push(config);
  }
  return newConfigs;
};

export const initDatasets = async (customPath?: string) => {
  const cvEducationConfig_v2 = await extendTrainingDataConfig(
    cvEducationConfig
  );
  const cvSoftSkillsConfig_v2 = await extendTrainingDataConfig(
    cvSoftSkillsConfig
  );
  const cvTechnicalConfig_v2 = await extendTrainingDataConfig(
    cvTechnicalConfig
  );
  const techBlogConfig_v2 = await extendTrainingDataConfig(techBlogConfig);
  const tutorialBlogConfig_v2 = await extendTrainingDataConfig(
    tutorialBlogConfig
  );
  manager.generateDatasetContent('cv-education', cvEducationConfig_v2);
  manager.generateDatasetContent('cv-soft', cvSoftSkillsConfig_v2);
  manager.generateDatasetContent('blog-tutorial', tutorialBlogConfig_v2);
  manager.generateDatasetContent('blog-tech', techBlogConfig_v2);
  manager.generateDatasetContent('cv-technical', cvTechnicalConfig_v2);
  manager.createDataset(DATASETS_NAMES.CV, 'CV dataset for the training model');
  manager.createDataset(
    DATASETS_NAMES.BLOG,
    'Blog dataset for the training model'
  );
  manager.mergeDatasets(DATASETS_NAMES.CV, [
    'cv-technical',
    'cv-education',
    'cv-soft',
  ]);
  manager.mergeDatasets(DATASETS_NAMES.BLOG, ['blog-tutorial', 'blog-tech']);
  manager.saveDataset(DATASETS_NAMES.CV, DATASETS_NAMES.CV, customPath);
  manager.saveDataset(DATASETS_NAMES.BLOG, DATASETS_NAMES.BLOG, customPath);
};

export const trainingLoop = () => {
  const model = args.model;
  const epochs = Number(args.epochs);
  const dataset = args.dataset;
  const saveModelName = args.saveModel;
  switch (model) {
    case MODELS_NAMES.CV_CLASSIFIER:
      classifier.loadModel(MODELS_NAMES.CV_CLASSIFIER);
      break;
    case MODELS_NAMES.BLOG_CLASSIFIER:
      classifier.loadModel(MODELS_NAMES.BLOG_CLASSIFIER);
      break;
    default:
      console.log('no model selected running the default mode...');
      break;
  }
  switch (dataset) {
    case DATASETS_NAMES.CV:
      manager.loadDataset(
        DATASETS_NAMES.CV,
        DATASETS_NAMES.CV,
        path.resolve(__dirname, '../src/ATS/datasets')
      );
      break;
    case DATASETS_NAMES.BLOG:
      manager.loadDataset(
        DATASETS_NAMES.BLOG,
        DATASETS_NAMES.BLOG,
        path.resolve(__dirname, '../src/ATS/datasets')
      );
      break;

    default:
      throw new Error('Please provide a valid datasetName');
  }

  if (
    (model === MODELS_NAMES.BLOG_CLASSIFIER &&
      dataset !== DATASETS_NAMES.BLOG) ||
    (model === MODELS_NAMES.CV_CLASSIFIER && dataset !== DATASETS_NAMES.CV)
  ) {
    throw new Error(
      'The provided dataset is not valid with the provided model'
    );
  }
  const trainData = manager.getDataFromDataset(dataset, epochs || undefined);
  for (let i = 0; i < trainData.length; i++) {
    classifier.add([trainData[i].text, trainData[i].category]);
    console.log(`classification number ${i} for the data ${trainData[i]}`);
  }
  if(typeof model !== 'string') {
    switch (saveModelName) {
      case MODELS_NAMES.CV_CLASSIFIER:
        console.log(`no model provided but saved model detected ${saveModelName}`);
        break;
      case MODELS_NAMES.BLOG_CLASSIFIER:
        console.log(
          `no model provided but saved model detected ${saveModelName}`
        );
        break;
      default:
        throw new Error('no valid model parameter provided');
    }
  }
  const savedModel = classifier.stringify(model || saveModelName, path.resolve(__dirname, "../src/ATS/models"))
  if (savedModel) {
    console.log(`model: ${model || saveModelName} saved successfully`);
    return;
  }
  console.log('the operation not completed')
};

switch (args.process) {
  case 'train':
    trainingLoop();
    break;
  case 'init':
    const custom = path.resolve(__dirname, "../src/ATS/datasets");
    initDatasets(custom)
      .then(() => {
        console.log('Datasets initialized');
      })
      .catch((err) => {
        console.error(err);
      });
    break;
  default:
    console.log("Please enter 'train' or 'init'");
    break;
}
