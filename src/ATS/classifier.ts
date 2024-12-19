import natural, {
  ApparatusClassification,
  BayesClassifier,
  LevenshteinDistance,
  PorterStemmer,
  WordTokenizer,
} from 'natural';

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

  getClass<T>(data: T): ApparatusClassification[] {
    return this.#classifier.getClassifications(data as string | string[]);
  }

  stringify<T>(path?: T): StringifyClassifier<T> {
    if (path && typeof path === 'string') {
      this.#classifier.save(path, (err, classifier) => {
        // the classifier is saved to the classifier.json file!
        if (err) {
          console.error(err);
          return;
        }
        console.log(classifier);
        console.log('successfully saved');
      });
      return true as StringifyClassifier<T>;
    }
    return JSON.stringify(this.#classifier) as StringifyClassifier<T>;
  }
  tokenize<T extends string>(entry: T): Array<string> {
    return this.#tokenizer.tokenize(entry);
  }
}

const classifierTest = new Classifier();
const t = classifierTest.tokenize('doni is the best');
t.includes('t');
