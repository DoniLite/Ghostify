import { WordNet } from 'natural';

// Initialiser WordNet pour obtenir des relations sémantiques
const wordnet = new WordNet();

export interface WordRelations {
    synonyms: string[];
    antonyms: string[];
    hypernyms: string[];
    hyponyms: string[];
}

export async function getWordRelations(word: string): Promise<WordRelations> {
    return new Promise((resolve) => {
        const relations: WordRelations = {
            synonyms: [],
            antonyms: [],
            hypernyms: [],
            hyponyms: []
        };

        wordnet.lookup(word, (results) => {
            results.forEach(result => {
                // Collecter les synonymes
                if (result.synonyms) {
                    relations.synonyms.push(...result.synonyms);
                }

                // Collecter les antonymes
                result.ptrs.forEach(ptr => {
                    if (ptr.pointerSymbol === '!') {
                        wordnet.get(ptr.synsetOffset, ptr.pos, (antonym) => {
                            if (antonym && antonym.lemma) {
                                relations.antonyms.push(antonym.lemma);
                            }
                        });
                    }
                    // Hypernyms (termes plus généraux)
                    else if (ptr.pointerSymbol === '@') {
                        wordnet.get(ptr.synsetOffset, ptr.pos, (hypernym) => {
                            if (hypernym && hypernym.lemma) {
                                relations.hypernyms.push(hypernym.lemma);
                            }
                        });
                    }
                    // Hyponyms (termes plus spécifiques)
                    else if (ptr.pointerSymbol === '~') {
                        wordnet.get(ptr.synsetOffset, ptr.pos, (hyponym) => {
                            if (hyponym && hyponym.lemma) {
                                relations.hyponyms.push(hyponym.lemma);
                            }
                        });
                    }
                });
            });

            // Dédupliquer les résultats
            relations.synonyms = [...new Set(relations.synonyms)];
            relations.antonyms = [...new Set(relations.antonyms)];
            relations.hypernyms = [...new Set(relations.hypernyms)];
            relations.hyponyms = [...new Set(relations.hyponyms)];

            resolve(relations);
        });
    });
}
