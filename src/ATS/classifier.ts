import natural, {
  ApparatusClassification,
  BayesClassifier,
  LevenshteinDistance,
  PorterStemmer,
  WordTokenizer,
} from 'natural';
import fs from 'node:fs';
import path from 'node:path';

const MODELS_PATH = path.resolve(__dirname, '../../src/ATS/datasets');

type StringifyClassifier<T extends unknown> = T extends string
  ? boolean
  : string;

/**
 * `Classifier` is a classification class based on NLP rules
 */
export class Classifier {
  #classifier: BayesClassifier;
  distance: typeof LevenshteinDistance;
  stemmer: typeof PorterStemmer;
  #tokenizer: WordTokenizer;
  constructor() {
    this.#classifier = new BayesClassifier();
    this.distance = LevenshteinDistance;
    this.stemmer = PorterStemmer;
    this.#tokenizer = new WordTokenizer();
  }

  add(row: [string | string[], string]): void {
    this.#classifier.addDocument(row[0], row[1]);
  }

  class<T>(data: T): string {
    return this.#classifier.classify(data as string | string[]);
  }

  train(): void {
    this.#classifier.train();
  }

  getClass<T>(data: T): ApparatusClassification[] {
    return this.#classifier.getClassifications(data as string | string[]);
  }

  stringify<T, K extends string>(name?: T, customPath?: K): StringifyClassifier<T> {
    if (name && typeof name === 'string') {
      this.#classifier.save(
        path.join(customPath || MODELS_PATH, `${name}.json`),
        (err, classifier) => {
          // the classifier is saved to the classifier.json file!
          if (err) {
            console.error(err);
            return;
          }
          console.log(classifier);
          console.log('successfully saved');
        }
      );
      return true as StringifyClassifier<T>;
    }
    return JSON.stringify(this.#classifier, null, 2) as StringifyClassifier<T>;
  }

  loadModel(name: string, customPath?: string): void {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(customPath || MODELS_PATH, `${name}.json`), 'utf8')
      ) as Record<string, unknown>;
      this.#classifier = natural.BayesClassifier.restore(data);
    } catch (e) {
      console.error(e);
    }
  }
  tokenize<T extends string>(entry: T): Array<string> {
    return this.#tokenizer.tokenize(entry);
  }
}
