import natural, {
  ApparatusClassification,
  BayesClassifier,
  LevenshteinDistance,
  PorterStemmer,
  WordTokenizer,
} from 'natural';
import fs from 'node:fs';
import path from 'node:path';
import process from "node:process";

const MODELS_PATH = path.resolve(process.cwd(), '/src/ATS/datasets');

type StringifyClassifier<T> = T extends string ? boolean
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

  /**
   * Save the classifier to a file or return it as a string.
   * @param name - The name of the file to save the classifier to. If not provided, the classifier is returned as a string.
   * @param customPath - The path to the directory where the classifier should be saved. If not provided, the classifier is saved to the default `MODELS_PATH`.
   * @returns If a name is provided, the function returns a boolean indicating whether the classifier was saved successfully. If no name is provided, the function returns the classifier as a JSON string.
   */

  stringify<T, K extends string>(
    name?: T,
    customPath?: K,
  ): StringifyClassifier<T> {
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
        },
      );
      return true as StringifyClassifier<T>;
    }
    return JSON.stringify(this.#classifier, null, 2) as StringifyClassifier<T>;
  }

  /**
   * Loads a model from a JSON file and restores it into the classifier.
   *
   * @param name - The name of the model file (without the .json extension) to be loaded.
   * @param customPath - An optional custom path to the directory containing the model file.
   * If not provided, a default path is used.
   *
   * This method reads the specified JSON file, parses it, and restores the classifier
   * using the loaded data. If the operation fails, an error is logged to the console.
   */

  loadModel(name: string, customPath?: string): void {
    try {
      const data = JSON.parse(
        fs.readFileSync(
          path.join(customPath || MODELS_PATH, `${name}.json`),
          'utf8',
        ),
      ) as Record<string, unknown>;
      this.#classifier = natural.BayesClassifier.restore(data);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Tokenizes a given string using the word tokenizer.
   *
   * @param entry - The string to be tokenized.
   * @returns An array of strings, where each string is a word in the input string.
   */
  tokenize<T extends string>(entry: T): string[] {
    return this.#tokenizer.tokenize(entry);
  }
}
