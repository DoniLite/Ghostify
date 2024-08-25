import {
  EssentialWeatherData,
  ImageAnalysisResult,
  month,
  StatsData,
  WeatherData,
} from './@types';
import fs, { promises as fsP } from 'node:fs';
import path from 'node:path';
import crypto, { createHash, createVerify } from 'node:crypto';
import sharp from 'sharp';
import Vibrant from 'node-vibrant';
import imageHash from 'image-hash';
import Tesseract from 'tesseract.js';
import MarkdownIt from 'markdown-it';

const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const unify = (str: string) => {
  return md.render(str);
};

export async function analyzeImage(
  imagePath: string
): Promise<ImageAnalysisResult> {
  // Analyse des métadonnées
  const metadata = await sharp(imagePath).metadata();

  // Analyse des couleurs dominantes
  const palette = await Vibrant.from(imagePath).getPalette();
  const dominantColors = Object.values(palette).map(
    (color) => color?.getHex() || ''
  );

  // Création de l'empreinte de l'image (hash)
  const imageHashResult = await new Promise<string>((resolve, reject) => {
    imageHash.hash(imagePath, 16, 'hex', (error, hash) => {
      if (error) reject(error);
      resolve(hash);
    });
  });

  // Extraction du texte via OCR
  const ocrResult = await Tesseract.recognize(imagePath, 'eng', {
    logger: (m) => console.log(m), // Optionnel: pour suivre la progression
  });
  const ocrText = ocrResult.data.text;

  // Vérification si l'image doit être marquée
  const flagged = shouldFlagImage(metadata, dominantColors, ocrText);

  // Résultat final
  return {
    metadata,
    dominantColors,
    ocrText,
    imageHash: imageHashResult,
    flagged,
  };
}

export function shouldFlagImage(
  metadata: sharp.Metadata,
  dominantColors: string[],
  ocrText: string
): boolean {
  // Exemple de règles simples pour flagger une image
  const prohibitedColors = ['#000000', '#ff0000']; // Couleurs interdites (ex: noir, rouge vif)
  const prohibitedKeywords = ['violence', 'explicit', 'forbidden']; // Mots interdits dans le texte OCR

  // Vérification des couleurs dominantes
  const containsProhibitedColors = dominantColors.some((color) =>
    prohibitedColors.includes(color.toLowerCase())
  );

  // Vérification du texte OCR
  const containsProhibitedKeywords = prohibitedKeywords.some((keyword) =>
    ocrText.toLowerCase().includes(keyword)
  );

  return containsProhibitedColors || containsProhibitedKeywords;
}

export function verifyHash(hash: string) {
  const verify = createVerify('sha256');
  const verification = verify.update(hash);
  console.log(verification);
}

export function customCreateHash(data: string): string {
  const hash = createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

export function extractEssentialWeatherData(
  data: WeatherData
): EssentialWeatherData {
  const { datetime, tempmax, tempmin, conditions, description, icon } = data;
  return { datetime, tempmax, tempmin, conditions, description, icon };
}

const debordedText = `L'amour naturel veut voir l'être aimé pour soi, et autant que possible le posséder sans partage. Le Christ est venu pour ramener au Père l'humanité égarée;`;
const debordedLength = debordedText.length;

export function reduceQuote(text: string): string {
  if (text.length > debordedLength) {
    return text.slice(0, debordedLength).concat('...');
  }
  return text;
}

export enum ProjectParticipationType {
  free = 'free',
  colaboration = 'colaboration',
  subscription = 'subscription',
}

export const DATA_PATH = path.join(__dirname, 'data');
export const DATA_FILE = path.join(DATA_PATH, 'statistics.json');

export function createDirIfNotExists(path: string) {
  if (!fs.existsSync(path)) fsP.mkdir(path);
  return;
}

export function convertStatsInput(statsInput: string): StatsData {
  return JSON.parse(statsInput);
}

export function stringifyStats(stats: StatsData): string {
  return JSON.stringify(stats);
}

/**
 * This function returns a boolean value indicating whether the month is over if `true` the month is not over
 * If `false` the month is over
 */
export function checkIfMonthIsNotOver(monthParam: month): boolean {
  const date = new Date();
  const thisMonth = getMonthWithDate(date.getMonth());
  return thisMonth === monthParam;
}

export function getWeekIndex(): number {
  const date = new Date();
  const weekIndex = Math.round(date.getDate() / 7);
  return weekIndex;
}

export const months = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Aout',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
] as const;

export const getMonthWithDate = (monthIndex: number) => {
  return months[monthIndex];
};

function createFirstStatistic(): StatsData {
  const date = new Date();
  const month = getMonthWithDate(date.getMonth());
  const week = getWeekIndex();
  const stats: StatsData = {
    total_visitor: 0,
    urls: [],
    weekly: {
      index: week,
      visitor: 0,
    },
    monthly: {
      month: month,
      visitor: 0,
    },
  };
  return stats;
}

export async function loadStatistics(): Promise<StatsData> {
  createDirIfNotExists(DATA_PATH);
  if (!fs.existsSync(DATA_FILE)) {
    return createFirstStatistic();
  }
  const jsonStrng = await fsP.readFile(DATA_FILE, 'utf8');
  const stats = JSON.parse(jsonStrng) as StatsData;
  return stats;
}

export async function saveStatistic(stat: StatsData) {
  try {
    const json = JSON.stringify(stat);
    await fsP.writeFile(DATA_FILE, json, 'utf8');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export enum Service {
  api = 'api',
  blog = 'blog',
  superUser = 'superUser',
}

// Définir une interface pour les clés
interface Keys {
  secretKey: string;
  iv: string;
}

// Chemin vers le fichier où les clés seront stockées
const keysFilePath: string = path.resolve(__dirname, 'data/keys.json');

// Fonction pour générer et sauvegarder les clés
export async function generateAndSaveKeys(): Promise<void> {
  const secretKey: Buffer = crypto.randomBytes(32);
  const iv: Buffer = crypto.randomBytes(16);

  const keys: Keys = {
    secretKey: secretKey.toString('hex'),
    iv: iv.toString('hex'),
  };

  await fsP.writeFile(keysFilePath, JSON.stringify(keys), 'utf8');
  console.log('Clés générées et sauvegardées avec succès !');
}

// Fonction pour charger les clés depuis le fichier
export async function loadKeys(): Promise<{ secretKey: Buffer; iv: Buffer }> {
  if (!fs.existsSync(keysFilePath)) {
    await fsP.mkdir(DATA_PATH);
    await generateAndSaveKeys();
  }
  const data: string = await fsP.readFile(keysFilePath, 'utf8');
  const keys: Keys = JSON.parse(data);

  return {
    secretKey: Buffer.from(keys.secretKey, 'hex'),
    iv: Buffer.from(keys.iv, 'hex'),
  };
}

// Fonction pour chiffrer les données
export function encrypt(text: string, secretKey: Buffer, iv: Buffer): string {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted: string = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Fonction pour déchiffrer les données
export function decrypt(
  encryptedText: string,
  secretKey: Buffer,
  iv: Buffer
): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function subscriptionChecker(t: number) {
  const now = new Date();
  return now.getTime() <= t - 60 * 60 * 24 * 60 * 1000;
}

export function tokenTimeExpirationChecker(t: number) {
  const now = new Date();
  return now.getTime() <= t;
}

export const colors = {
  sun_1: ' #FFD700',
  sun_2: ' #FFA500',
  sun_3: ' #FF8C00',
  sun_4: ' #FF6347',
  sun_5: '#FFA500',
  moon_1: '#8B4513',
  moon_2: '#7B68EE',
  morning_bg_from: 'from-blue-300',
  morning_bg_to: 'to-lime-500',
  evening_bg_from: 'from-blue-300',
  evening_bg_to: 'to-lime-500',
  night_bg_from: 'from-blue-300',
  nigh_bg_from: 'to-lime-500',
} as const;

interface DetectionResult {
  sequence: string;
  isInappropriate: boolean;
  issues: string[];
}

function detectInappropriateContent(sequence: string): DetectionResult {
  const issues: string[] = [];

  // Regex examples for detecting problematic content
  const profanityRegex = /(?:damn|hell|crap)/i;
  const spamRegex = /(buy\s+now|free\s+money|click\s+here)/i;
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const threatRegex =
    /(i'm\s+going\s+to\s+kill|i\s+will\s+hurt|destroy\s+you|burn\s+down|murder\s+you|bomb\s+threat)/i;
  const harassmentRegex =
    /(you\s+are\s+a\s+(loser|idiot|stupid)|nobody\s+likes\s+you|go\s+away|get\s+lost|you're\s+worthless)/i;
  const sexualContentRegex =
    /(sex|porn|nude|xxx|orgasm|erection|masturbate|fetish|hardcore)/i;
  const hateSpeechRegex =
    /(hate\s+(speech|crime|you|them|him|her|this)|racial\s+slur|kill\s+all\s+[a-zA-Z]+|destroy\s+[a-zA-Z]+|[a-zA-Z]+\s+must\s+die)/i;
  const fakeNewsRegex =
    /(hoax|fake\s+news|not\s+true|lies|conspiracy\s+theory|plandemic|5G\s+causes\s+COVID)/i;
  const promotionRegex =
    /(buy\s+now|limited\s+offer|special\s+deal|order\s+today|free\s+gift|money\s+back\s+guarantee)/i;
  const incitementRegex =
    /(kill\s+(them|all|everyone)|burn\s+(them|all|everything)|bomb\s+the|shoot\s+them|attack\s+(now|everyone))/i;
  const sensitivePoliticalContentRegex =
    /(rigged\s+election|stolen\s+votes|political\s+prisoner|deep\s+state|corrupt\s+politician|fake\s+news\s+media)/i;
  const defamationRegex =
    /(slander|defame|libel|false\s+accusation|untrue\s+statements|character\s+assassination)/i;
  const phishingRegex =
    /(claim\s+your\s+prize|congratulations\s+you've\s+won|click\s+here\s+to\s+claim|urgent\s+response\s+required|bank\s+details\s+needed)/i;
  const copyrightViolationRegex =
    /(illegal\s+download|free\s+movie\s+streaming|pirated\s+software|torrent\s+download|unauthorized\s+distribution)/i;
  const discriminationRegex =
    /(sexist\s+remarks|racist\s+jokes|homophobic\s+slurs|hate\s+speech|discrimination\s+against)/i;
  const illegalActivityRegex =
    /(drug\s+dealing|robbery|hacking|illegal\s+weapons|buy\s+drugs\s+online|counterfeit\s+goods)/i;
  const vulgarityRegex = /(fuck|shit|bitch|asshole|bastard|dickhead|cunt)/i;

  const regexArray = [
    { regex: profanityRegex, issue: 'Langage inapproprié détecté' },
    { regex: spamRegex, issue: 'Spam détecté' },
    { regex: urlRegex, issue: 'URL non autorisée détectée' },
    { regex: threatRegex, issue: 'Menace ou violence détectée' },
    { regex: harassmentRegex, issue: 'Harcèlement détecté' },
    {
      regex: sexualContentRegex,
      issue: 'Contenu sexuellement explicite détecté',
    },
    { regex: hateSpeechRegex, issue: 'Discours haineux détecté' },
    { regex: fakeNewsRegex, issue: 'Fake news détectée' },
    {
      regex: promotionRegex,
      issue: 'Contenu promotionnel non autorisé détecté',
    },
    {
      regex: incitementRegex,
      issue: 'Incitation à la violence ou à la haine détectée',
    },
    {
      regex: sensitivePoliticalContentRegex,
      issue: 'Contenu politique sensible détecté',
    },
    { regex: defamationRegex, issue: 'Propos diffamatoires détectés' },
    {
      regex: phishingRegex,
      issue: 'Tentative de phishing ou escroquerie détectée',
    },
    {
      regex: copyrightViolationRegex,
      issue: "Violation des droits d'auteur détectée",
    },
    { regex: discriminationRegex, issue: 'Discrimination détectée' },
    { regex: illegalActivityRegex, issue: 'Activité illégale détectée' },
    { regex: vulgarityRegex, issue: 'Langage grossier détecté' },
  ];

  regexArray.forEach((item) => {
    if (item.regex.test(sequence)) {
      issues.push(item.issue);
    }
  });

  return {
    sequence,
    isInappropriate: issues.length > 0,
    issues,
  };
}

// Découpe le texte en séquences (phrases)
function splitTextIntoSequences(text: string): string[] {
  // Découpe par phrases basées sur les ponctuations communes
  return text.split(/(?<=[.!?])\s+/);
}

// Fonction principale pour vérifier le texte
export function checkTextContent(text: string): DetectionResult[] {
  const sequences = splitTextIntoSequences(text);
  const results: DetectionResult[] = [];

  sequences.forEach((sequence) => {
    const result = detectInappropriateContent(sequence);
    results.push(result);
  });

  return results;
}

export const graphicsUploader = () => {
  const time = new Date();
  if (time.getHours() > 5 && time.getHours() <= 10) {
    return 'Morning' as const;
  }
  if (time.getHours() >= 11 && time.getHours() < 13) {
    return 'Midday' as const;
  }

  if (time.getHours() >= 13 && time.getHours() < 20) {
    return 'Evening' as const;
  }

  return 'Night' as const;
};
