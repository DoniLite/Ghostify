import natural, {
  ApparatusClassification,
  BayesClassifier,
  LevenshteinDistance,
  PorterStemmer,
  WordTokenizer,
} from 'natural';



type StringifyClassifier<
  T extends unknown
> =  T extends  string ? boolean : string;

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

  add(row: [string, string]): void {
    this.#classifier.addDocument(row[0], row[1]);
  }

  class(data: string | string[]): string {
    return this.#classifier.classify(data);
  }

  getClass(data: string | string[]): ApparatusClassification[] {
    return this.#classifier.getClassifications(data);
  }

  stringify<T>(path?: T): StringifyClassifier<T> {
    if (path && typeof path === 'string') {
      this.#classifier.save(path, (err, classifier) => {
        // the classifier is saved to the classifier.json file!
      });
      return true as StringifyClassifier<T>;
    }
    return JSON.stringify(this.#classifier) as StringifyClassifier<T>;
  }
  tokenize(entry: string): string[] {
    return this.#tokenizer.tokenize(entry)
  }
}

