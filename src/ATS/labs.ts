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

/**
 * The Script command line args to define for the script execution
 *  - process Is used to define the action that will be proceed ;
 *    * train for training a model
 *    * test for testing a model
 *    * init for the initialization
 *  - model set the defined model that will be used for the `process` (optional)
 *  - epochs Defines the size of the training loop can be a slice of starting and ending number separated by commas
 *  - dataset The dataset that will be used for the process
 *  - saveModel The name that will be used to save the model after the process
 *
 * ```bash
 * $ node script.js --model=OCTOGONE --dataset=cv_data --process=test --epochs=500
 * ```
 */
interface Args {
  process: 'train' | 'init' | 'test';
  model?: MODELS_NAMES;
  epochs: string;
  dataset: DATASETS_NAMES;
  saveModel?: MODELS_NAMES;
}

const args = yargs(hideBin(process.argv)).argv as unknown as Args;

const manager = new TrainingDataManager();
const classifier = new Classifier();

/**
 * The names of the available datasets
 *
 * Each dataset is defined to use a specific model
 *  - cv_data is defined for the `OCTOGONE` model
 *  - blog_data is defined for the ``CAPIYERS` model
 */
export enum DATASETS_NAMES {
  CV = 'cv_data',
  BLOG = 'blog_data',
}

/**
 * The models names that are used for all the process like `test` or `train`
 *
 *  These names are used in the `model` and `saveModel` argument of the script
 */
export enum MODELS_NAMES {
  CV_CLASSIFIER = 'OCTOGONE',
  BLOG_CLASSIFIER = 'CAPIYERS',
}

/**
 * Used to extend the category configuration of the dataset
 *
 * This function is useful for creating an extended dataset model based on the provided data.
 *
 * This maintain the context of the data and enlarge its size properly
 * @param configs the data category config that will be extended
 * @returns {Promise<CategoryConfig[]>}
 */
const extendTrainingDataConfig = async (
  configs: CategoryConfig[],
): Promise<CategoryConfig[]> => {
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

/**
 * Initializes and extends the training datasets by generating additional
 * contextual data for specified configurations and merging them into the
 * main datasets.
 *
 * This function utilizes the `extendTrainingDataConfig` to enhance the
 * base words with their synonyms for various category configurations,
 * then generates dataset content, creates new datasets, merges them into
 * comprehensive ones, and saves them to the specified path.
 *
 * @param customPath - An optional parameter that allows specifying a custom
 * path to save the initialized datasets. If not provided, a default path
 * is used.
 */

export const initDatasets = async (customPath?: string) => {
  const cvEducationConfig_v2 = await extendTrainingDataConfig(
    cvEducationConfig,
  );
  const cvSoftSkillsConfig_v2 = await extendTrainingDataConfig(
    cvSoftSkillsConfig,
  );
  const cvTechnicalConfig_v2 = await extendTrainingDataConfig(
    cvTechnicalConfig,
  );
  const techBlogConfig_v2 = await extendTrainingDataConfig(techBlogConfig);
  const tutorialBlogConfig_v2 = await extendTrainingDataConfig(
    tutorialBlogConfig,
  );
  manager.generateDatasetContent('cv-education', cvEducationConfig_v2);
  manager.generateDatasetContent('cv-soft', cvSoftSkillsConfig_v2);
  manager.generateDatasetContent('blog-tutorial', tutorialBlogConfig_v2);
  manager.generateDatasetContent('blog-tech', techBlogConfig_v2);
  manager.generateDatasetContent('cv-technical', cvTechnicalConfig_v2);
  manager.createDataset(DATASETS_NAMES.CV, 'CV dataset for the training model');
  manager.createDataset(
    DATASETS_NAMES.BLOG,
    'Blog dataset for the training model',
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

/**
 * Executes a specified action ('train' or 'test') on a given machine learning model,
 * using the provided dataset, model name, and epochs. The function initializes and
 * validates the model and dataset, and performs the requested operation (training or
 * testing) using the classifier and data manager. If the 'train' operation is selected,
 * the model is trained and potentially saved with a specified name. Throws errors if
 * dataset and model compatibility checks fail, or if invalid parameters are provided.
 *
 * @param toDo - A string indicating the action to perform ('train' or 'test').
 */

const actionFn = (toDo: 'train' | 'test') => {
  const model = args.model;
  const epochs = args.epochs && !args.epochs.includes(',')
    ? Number(args.epochs)
    : null;
  const epochsSlice = args.epochs && args.epochs.split(',').length > 1
    ? {
      start: Number(args.epochs.split(',')[0]),
      end: Number(args.epochs.split(',')[1]),
    }
    : null;
  const dataset = args.dataset;
  const saveModelName = args.saveModel;

  switch (model) {
    case MODELS_NAMES.CV_CLASSIFIER:
      classifier.loadModel(
        MODELS_NAMES.CV_CLASSIFIER,
        path.resolve(__dirname, '../src/ATS/models'),
      );
      break;
    case MODELS_NAMES.BLOG_CLASSIFIER:
      classifier.loadModel(
        MODELS_NAMES.BLOG_CLASSIFIER,
        path.resolve(__dirname, '../src/ATS/models'),
      );
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
        path.resolve(__dirname, '../src/ATS/datasets'),
      );
      break;
    case DATASETS_NAMES.BLOG:
      manager.loadDataset(
        DATASETS_NAMES.BLOG,
        DATASETS_NAMES.BLOG,
        path.resolve(__dirname, '../src/ATS/datasets'),
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
      'The provided dataset is not valid with the provided model',
    );
  }

  const action = {
    test: () => {
      const testData = manager
        .getDataFromDataset(dataset, epochs || epochsSlice || undefined)
        .map((d) => d.text);
      for (const data of testData) {
        const result = classifier.class(data);
        console.log(
          `test classification result ${result} for the entry ${data}`,
        );
      }
    },
    train: () => {
      const trainData = manager.getDataFromDataset(
        dataset,
        epochs || epochsSlice || undefined,
      );
      for (let i = 0; i < trainData.length; i++) {
        classifier.add([trainData[i].text, trainData[i].category]);
        console.log(`classification number ${i} for the data ${trainData[i]}`);
      }
      if (typeof model !== 'string') {
        switch (saveModelName) {
          case MODELS_NAMES.CV_CLASSIFIER:
            console.log(
              `no model provided but saved model detected ${saveModelName}`,
            );
            break;
          case MODELS_NAMES.BLOG_CLASSIFIER:
            console.log(
              `no model provided but saved model detected ${saveModelName}`,
            );
            break;
          default:
            throw new Error('no valid model parameter provided');
        }
      }
      classifier.train();
      const savedModel = classifier.stringify(
        model || saveModelName,
        path.resolve(__dirname, '../src/ATS/models'),
      );
      if (savedModel) {
        console.log(`model: ${model || saveModelName} saved successfully`);
        return;
      }
      console.log('the operation not completed');
    },
  };
  return action[toDo];
};

switch (args.process) {
  case 'train':
    actionFn(args.process)();
    break;
  case 'test':
    actionFn(args.process)();
    break;
  case 'init': {
    const custom = path.resolve(__dirname, '../src/ATS/datasets');
    initDatasets(custom)
      .then(() => {
        console.log('Datasets initialized');
      })
      .catch((err) => {
        console.error(err);
      });
    break;
  }
  default:
    console.log("Please enter 'train' or 'init'");
    break;
}
