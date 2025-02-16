import {
  ImageAnalysisResult,
  month,
  SecurityHashPayload,
  StatsData,
} from './@types/index.d.ts';
import fs, { promises as fsP } from 'node:fs';
import path from 'node:path';
import crypto, { randomInt } from 'node:crypto';
import sharp from 'sharp';
import { Vibrant } from 'node-vibrant/node';
import imageHash from 'image-hash';
import Tesseract from 'tesseract.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import { prismaClient } from './config/db.ts';
import bcrypt from 'bcrypt';
import formidable from 'formidable';
import { ee, tokenGenerator } from './server.ts';
import {
  // formatDistanceToNow,
  // formatDuration,
  intervalToDuration,
} from 'date-fns';
import jwt from 'jsonwebtoken';
import { Translate, translate } from 'free-translate';

export const hashSomething = async (
  data: string | Buffer,
  saltRond?: number,
) => {
  const round = saltRond || 14;
  const salt = await bcrypt.genSalt(round);
  return await bcrypt.hash(data, salt);
};

export const compareHash = async (data: string | Buffer, hash: string) => {
  return await bcrypt.compare(data, hash);
};

const server_uid = process.env.SECRET_UID;
export enum DocInputFormat {
  MicrosoftWord = '.docx',
  OpenDocumentText = '.odt',
  RichtTextFormat = '.rtf',
  PlainText = '.txt',
  MicrosoftExcel = '.xlsx',
  OpenDocumentSpreadsheet = '.ods',
  CommaSeparatedValues = '.csv',
  MicrosoftPowerPoint = '.pptx',
  OpenDocumentPresentation = '.odp',
  PortableDocumentFormat = '.pdf',
  HypertextMarkupLanguage = '.html',
}

export enum DocOutputFormat {
  PNG = '.png',
  JPEG = '.jpeg',
  PlainText = '.txt',
  PortableDocumentFormat = '.pdf',
  HypertextMarkupLanguage = '.html',
}

export const unify = async (str: string) => {
  const { window } = new JSDOM('');
  const purify = DOMPurify(window);
  const result = await marked(str);
  return purify.sanitize(result);
};

export enum Can {
  CreateUser = 'createUser',
  MakeComment = 'makeComment',
  CRUD = 'crud',
  UpdateCirtificate = 'updateCirtificate',
  MakeSecureAction = 'makeSecureAction',
  NotDefined = 'notDef',
}

export const filterIncludesType = (k: string, obj: Record<string, unknown>) => {
  if (typeof obj['title'] === 'string') {
    return obj['title'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  if (typeof obj['description'] === 'string') {
    return obj['description'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  if (typeof obj['desc'] === 'string') {
    return obj['desc'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  if (typeof obj['content'] === 'string') {
    return obj['content'].toLowerCase().includes(k.toLocaleLowerCase());
  }
  return false;
};

export async function analyzeImage(
  imagePath: string,
): Promise<ImageAnalysisResult> {
  /*  // const arr = [
    ['#df750c', '#753911', '#f9d88a', '#ac7860', '#513d28', '#ae9d9c'][
      ('#c04c1c', '#6b4115', '#f5c17e', '#507c9a', '#524d31', '#cdc4b6')
    ][('#b47c53', '#041419', '#ecb28c', '#a58266', '#4d3e33', '#d0c3b5')][
      ('#509ca8', '#21696f', '#ec9d7f', '#9b6c59', '#344851', '#aec1d0')
    ][('#e62050', '#783d32', '#eeb699', '#a87460', '#523629', '#cb9b8f')],
  ]; */
  // Analyse des métadonnées
  const metadata = await sharp(imagePath).metadata();

  // Analyse des couleurs dominantes
  const palette = await Vibrant.from(imagePath).getPalette();
  const dominantColors = Object.values(palette).map(
    (color) => color.hex || '',
  );

  // Création de l'empreinte de l'image (hash)
  const imageHashResult = await new Promise<string>((resolve, reject) => {
    imageHash.hash(imagePath, 16, 'hex', (error, hash) => {
      if (error) {
        reject(error);
      }
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
  ocrText: string,
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

export function reduceStringSuite(text: string): string {
  const debordedLength = Math.round(text.length / 2.5);
  return text.slice(0, debordedLength).concat('...');
}

export enum ProjectParticipationType {
  free = 'free',
  colaboration = 'colaboration',
  subscription = 'subscription',
}

export const DATA_PATH = path.resolve(path.join(__dirname, '../data'));
export const DATA_FILE = path.join(DATA_PATH, 'statistics.json');

export async function createDirIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    await fsP.mkdir(path);
  }
  return;
}

export function convertStatsInput(statsInput: string): StatsData {
  return JSON.parse(statsInput);
}

export function stringifyStats(stats: StatsData): string {
  return JSON.stringify(stats, null, 4);
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
  return Math.round(date.getDate() / 7);
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
  return convertStatsInput(jsonStrng);
}

export async function saveStatistic(stat: StatsData) {
  try {
    const json = stringifyStats(stat);
    await fsP.writeFile(DATA_FILE, json, 'utf8');
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export enum Service {
  api = 'api',
  poster = 'poster',
  superUser = 'superUser',
}

// Définir une interface pour les clés
interface Keys {
  secretKey: string;
  iv: string;
}

// Fonction pour générer et sauvegarder les clés
export async function generateAndSaveKeys(): Promise<{
  secretKey: Buffer;
  iv: Buffer;
}> {
  const secretKey: Buffer = crypto.randomBytes(32);
  const iv: Buffer = crypto.randomBytes(16);

  const keys: Keys = {
    secretKey: secretKey.toString('hex'),
    iv: iv.toString('hex'),
  };

  const verifyIfKeyExist = await prismaClient.key.findUnique({
    where: {
      uid: server_uid,
    },
  });

  if (verifyIfKeyExist) {
    return {
      secretKey: Buffer.from(verifyIfKeyExist.key, 'hex'),
      iv: Buffer.from(verifyIfKeyExist.iv, 'hex'),
    };
  }

  const newKey = await prismaClient.key.create({
    data: {
      key: keys.secretKey,
      iv: keys.iv,
      uid: server_uid,
      type: 'SessionKey',
    },
  });
  console.log('Clés générées et sauvegardées avec succès !');
  return {
    secretKey: Buffer.from(newKey.key, 'hex'),
    iv: Buffer.from(newKey.iv, 'hex'),
  };
}

// Fonction pour charger les clés depuis le fichier
export async function loadKeys(): Promise<{ secretKey: Buffer; iv: Buffer }> {
  const keys = await prismaClient.key.findUnique({
    where: {
      uid: server_uid,
    },
  });
  if (!keys) {
    return await generateAndSaveKeys();
  }

  return {
    secretKey: Buffer.from(keys.key, 'hex'),
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
  iv: Buffer,
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
  return `background/${randomInt(1, 8)}.ejs`;
};

export const termsMD = `
# 📝 **Terms of Service**

Welcome to our platform! We’re thrilled to have you here. Please take a moment to read through our terms before using our services.

---

## 1. **🎯 Acceptance of Terms**

By accessing or using our services, you agree to these terms. If you don’t agree, feel free to close this page or contact us for more information.

---

## 2. **🔐 User Responsibilities**

You are responsible for keeping your account information safe. Ensure your password is strong, and if you detect any suspicious activity, notify us immediately.

---

## 3. **🔄 Changes to Services**

We may update or modify the services as needed. We’ll try to notify you beforehand, but some changes may occur without prior notice.

---

## 4. **⚖️ Limitation of Liability**

We are not liable for any damages resulting from the use or inability to use the service. This includes, but is not limited to, loss of data, indirect damages, or technical issues.

---

## 5. **💬 Contact Us**

If you have any questions, suggestions, or feedback, don’t hesitate to contact us via **<support@ghostify.site>** or **[contact](/home?pagination=5)**.
`;

export const conditionsMD = `
# 📑 **Conditions d'Utilisation**

Bienvenue ! En utilisant nos services, vous acceptez de respecter les conditions ci-dessous. Prenez le temps de bien les lire !

---

## 1. **👤 Accès au Service**

Nos services sont réservés aux utilisateurs majeurs. Si vous avez moins de 18 ans, l'accord parental est nécessaire.

---

## 2. **🔑 Compte et Sécurité**

Vous devez garder vos informations de connexion confidentielles. Si vous remarquez une utilisation non autorisée de votre compte, contactez-nous immédiatement.

---

## 3. **📜 Contenu Utilisateur**

Tout contenu que vous publiez sur notre plateforme vous appartient, mais vous nous accordez le droit de l'utiliser pour améliorer notre service. Nous nous réservons également le droit de supprimer tout contenu inapproprié.

---

## 4. **🔄 Modifications des Conditions**

Nous pouvons mettre à jour ces conditions à tout moment. Vous serez averti par e-mail ou via une notification sur notre site.

---

## 5. **📧 Nous Contacter**

Pour toute question, vous pouvez nous joindre à **<contact@votre-site.com>**.
`;

export const privacyMD = `
# 🔐 **Privacy Policy**

Your privacy is our priority. Here’s how we handle your data and ensure its protection.

---

## 1. **📊 Data Collection**

We collect information to make your experience better. This may include your name, email, and how you interact with our services.

---

## 2. **🔍 How We Use Your Data**

Your data is used to personalize your experience, such as recommending content and sending notifications about updates.

---

## 3. **🤝 Third-Party Sharing**

We don’t sell your data to third parties. However, we may share information with partners who assist in improving our services, under strict confidentiality agreements.

---

## 4. **🔒 Your Rights**

You have full control over your data! You can request access, correction, or deletion of your personal information at any time.

---

## 5. **📬 Questions or Concerns?**

Feel free to contact our privacy team at **<privacy@yourwebsite.com>** for any questions.

`;

export const FAQMD = `
# ❓ **Frequently Asked Questions (FAQ)**

We’ve compiled answers to some of the most common questions from our users. If you can’t find the answer here, feel free to reach out!

---

## 1. **📥 How do I create an account?**

Creating an account is easy! Simply click the **Sign Up** button on the top right, fill in the required details, and you’re good to go.

---

## 2. **🔐 Is my personal information secure?**

Absolutely! We follow industry-leading practices to keep your data safe. Check out our [Privacy Policy](#) for more information.

---

## 3. **💳 Can I change my subscription plan?**

Yes! You can upgrade, downgrade, or cancel your subscription anytime via the **Account Settings** page.

---

## 4. **💬 Who can I contact for support?**

Our support team is available 24/7. You can reach them via **<support@yourwebsite.com>** or the chat feature in the bottom-right corner of our site.

---

## 5. **🚀 How can I improve my experience on the platform?**

Make sure to check out our latest updates and follow us on social media for tips and tricks to enhance your experience!

`;

export const About = `# À propos de notre plateforme

Bienvenue sur notre plateforme, un espace innovant dédié à la création et à la publication de contenu de qualité. Nous avons conçu notre service pour répondre aux besoins des utilisateurs souhaitant s'exprimer, partager des idées et développer des compétences professionnelles. Voici un aperçu des trois services principaux que nous proposons :

## 1. Création et publication d'articles de blog

Notre plateforme vous permet de **créer et publier facilement des articles de blog** sur des sujets qui vous passionnent. Que vous soyez un écrivain débutant ou un blogueur expérimenté, vous trouverez des outils intuitifs pour rédiger, formater et partager votre contenu avec le monde. 

### Caractéristiques :

- Éditeur de texte riche avec des options de formatage.
- Possibilité d'ajouter des images et des vidéos.
- Fonctionnalité de prévisualisation avant publication.
- Gestion des catégories et des balises pour une meilleure organisation.

## 2. Génération et conversion de documents

Nous facilitons également la **génération et la conversion de documents** en divers formats. Que vous ayez besoin de créer des PDF à partir de vos articles ou de convertir des fichiers dans des formats spécifiques, notre service est là pour vous aider.

### Caractéristiques :

- Conversion rapide et fiable entre différents formats de fichiers.
- Options de personnalisation pour les documents générés.
- Téléchargement facile et sécurisé de vos fichiers.

## 3. Création de CV

Notre outil de **création de CV** vous permet de concevoir des curriculums vitae professionnels qui attirent l'attention des recruteurs. Grâce à des modèles variés et à des conseils de rédaction, vous serez en mesure de présenter vos compétences et expériences de manière efficace.

### Caractéristiques :

- Modèles de CV personnalisables adaptés à différents secteurs.
- Assistance à la rédaction pour mettre en valeur vos compétences.
- Exportation de votre CV dans des formats populaires (PDF, DOCX).

## 4. API

Pour les développeurs et les entreprises, nous proposons également des **API** qui vous permettent d'intégrer nos services dans vos propres applications. Profitez de la puissance de notre plateforme pour enrichir vos projets avec des fonctionnalités de création de contenu.

### Caractéristiques :

- Documentation complète pour une intégration facile.
- Accès à des fonctionnalités de génération de contenu et de gestion de documents.
- Support technique dédié pour répondre à vos questions.

## Rejoignez-nous !

Nous sommes passionnés par l'idée de vous aider à créer, partager et développer vos compétences. Rejoignez notre communauté et découvrez tout ce que notre plateforme a à offrir.

Pour toute question ou suggestion, n'hésitez pas à nous contacter à l'adresse suivante : [contact@votreplateforme.com](mailto:contact@votreplateforme.com).

---

Merci de faire partie de notre aventure !
`;

export const cvDownloader = async (options: {
  url: string;
  id: number;
  updating?: boolean;
  docId?: number;
}) => {
  console.log('function running start');
  let doc;
  const date = new Date();
  const pdf = date.getTime().toString() + '.pdf';
  const png = date.getTime().toString() + '.png';
  const STATIC_DIR = path.resolve(__dirname, '../static/downloads/doc');
  const STATIC_IMG_DIR = path.resolve(__dirname, '../static/downloads/cv');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.NODE_ENV === 'production'
      ? '/usr/bin/chromium-browser'
      : '/usr/bin/google-chrome',
    args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(options.url, { waitUntil: 'networkidle0' });
  const pdfFilePath = path.join(STATIC_DIR, pdf);
  const pngFilePath = path.join(STATIC_IMG_DIR, png);
  await page.pdf({ path: pdfFilePath, format: 'A4', printBackground: true });

  // Prendre un screenshot de la page entière
  await page.screenshot({ path: pngFilePath, fullPage: true });

  const pngServicePath = process.env.NODE_ENV === 'production'
    ? 'https://ghostify.site/staticFile/' +
      tokenGenerator(`downloads/cv/${png}`)
    : 'http://localhost:3085/staticFile/' +
      tokenGenerator(`downloads/cv/${png}`);

  const pdfServicePath = process.env.NODE_ENV === 'production'
    ? 'https://ghostify.site/downloader/' +
      tokenGenerator(`downloads/doc/${pdf}`)
    : 'http://localhost:3085/downloader/' +
      tokenGenerator(`downloads/doc/${pdf}`);

  const cvUpdating = await prismaClient.cV.update({
    where: {
      id: options.id,
    },
    data: {
      screenshot: pngServicePath,
      pdf: pdfServicePath,
    },
  });

  if (typeof options.updating === 'undefined' || !options.updating) {
    doc = await prismaClient.document.create({
      data: {
        uid: tokenGenerator((date.getTime() + randomInt(1000)).toString()),
        type: 'pdf',
        userId: cvUpdating.userId,
        downloadLink: cvUpdating.pdf,
      },
    });
  }

  doc = await prismaClient.document.update({
    where: {
      id: options.docId,
    },
    data: {
      downloadLink: cvUpdating.pdf,
    },
  });

  console.log('user doc created: ', doc);

  await browser.close();
  console.log('function running end');

  await prismaClient.notifications.create({
    data: {
      title: `Votre CV a été créé`,
      content: `Vous pouvez télécharger votre CV ici ${cvUpdating.pdf}`,
      userId: cvUpdating.userId,
      type: 'Info',
    },
  });

  ee.emit('Info', {
    title: `Votre CV a été créé`,
    content: `Vous pouvez telecharger votre CV ici ${cvUpdating.pdf}`,
    action: 'update',
  });

  return {
    screenshot: cvUpdating.screenshot,
    downloadLink: cvUpdating.pdf,
  };
};

export enum Reactions {
  Love = 'Love',
  Laugh = 'Laugh',
  Hurted = 'Hurted',
  Good = 'Good',
}

export const orderReactions = (reactions: Reactions[]) => {
  const reactionsObj = {
    Love: {
      index: 0,
      component: `<i class="fa-solid fa-heart -ml-1 fa-lg text-red-600"></i>`,
    },
    Laugh: {
      index: 0,
      component:
        `<i class="fa-solid fa-lg fa-face-laugh-squint -ml-1 text-orange-400"></i>`,
    },
    Hurted: {
      index: 0,
      component:
        `<i class="fa-regular fa-thumbs-down fa-lg -ml-1 text-white"></i>`,
    },
    Good: {
      index: 0,
      component:
        `<i class="fa-regular fa-thumbs-up fa-lg -ml-1 text-white"></i>`,
    },
  };
  reactions.forEach((reaction) => {
    reactionsObj[reaction].index++;
  });
  return Object.entries(reactionsObj)
    .map((el) => el[1])
    .filter((el) => el.index > 0)
    .sort((a, b) => a.index - b.index)
    .reverse()
    .map((el) => el.component);
};

/**
 * Function to rename a file using its location returns false if the operation fails and the file new full name if not
 * @param file {formidable.File}
 * @param pathTo {string}
 * @returns {false | string}
 */
export const renaming = async (file: formidable.File, pathTo: string) => {
  const ext = path.extname(file.originalFilename);
  const date = new Date();
  const r = crypto.randomInt(date.getTime()).toString();
  const fName = `${date.getTime().toString() + r}${ext}`;
  console.log(fName);
  const xPath = path.resolve(__dirname, pathTo);
  const uploadPath = path.join(xPath, fName);
  try {
    fs.renameSync(file.filepath, uploadPath);
    return fName;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export function ensureDirectoryAccess(directory: string) {
  try {
    // Vérifie si le dossier existe et est accessible
    fs.accessSync(directory, fs.constants.W_OK);
  } catch (error) {
    console.error(`Problème d'accès au dossier : ${directory}`);
    console.error(`Erreur : ${error.message}`);

    // Tente de créer le dossier avec les permissions appropriées
    try {
      fs.mkdirSync(directory, { recursive: true, mode: 0o755 });
      console.log(`Dossier créé : ${directory}`);
    } catch (mkdirError) {
      console.error(`Impossible de créer le dossier : ${mkdirError.message}`);
      throw mkdirError;
    }
  }
}

export function getTimeElapsed(date: Date) {
  const duration = intervalToDuration({ start: date, end: new Date() });

  // sourcery skip: use-braces
  if (duration.weeks >= 1) return `${duration.weeks}w`;
  if (duration.days >= 1) return `${duration.days}d`;
  if (duration.hours >= 1) return `${duration.hours}h`;
  if (duration.minutes >= 1) return `${duration.minutes}m`;
  if (duration.seconds >= 1) return `${duration.seconds}s`;

  return '0s';
}

export const cvClass = {
  v1: {
    mode1: {
      bg1: 'cv1-mode1-bg1',
      bg2: 'cv1-mode1-bg2',
      bg3: 'cv1-mode1-bg3',
      text1: 'cv1-mode1-text1',
      text2: 'cv1-mode1-text2',
      text3: 'cv1-mode1-text3',
      level: 'cv1-mode1-level',
    },
    mode2: {
      bg1: 'cv1-mode2-bg1',
      bg2: 'cv1-mode2-bg2',
      bg3: 'cv1-mode2-bg3',
      text1: 'cv1-mode2-text1',
      text2: 'cv1-mode2-text2',
      text3: 'cv1-mode2-text3',
      level: 'cv1-mode2-level',
    },
    mode3: {
      bg1: 'cv1-mode3-bg1',
      bg2: 'cv1-mode3-bg2',
      bg3: 'cv1-mode3-bg3',
      text1: 'cv1-mode3-text1',
      text2: 'cv1-mode3-text2',
      text3: 'cv1-mode3-text3',
      level: 'cv1-mode3-level',
    },
    mode4: {
      bg1: 'cv1-mode4-bg1',
      bg2: 'cv1-mode4-bg2',
      bg3: 'cv1-mode4-bg3',
      text1: 'cv1-mode4-text1',
      text2: 'cv1-mode4-text2',
      text3: 'cv1-mode4-text3',
      level: 'cv1-mode4-level',
    },
    mode5: {
      bg1: 'cv1-mode5-bg1',
      bg2: 'cv1-mode5-bg2',
      bg3: 'cv1-mode5-bg3',
      text1: 'cv1-mode5-text1',
      text2: 'cv1-mode5-text2',
      text3: 'cv1-mode5-text3',
      level: 'cv1-mode5-level',
    },
    mode6: {
      bg1: 'cv1-mode6-bg1',
      bg2: 'cv1-mode6-bg2',
      bg3: 'cv1-mode6-bg3',
      text1: 'cv1-mode6-text1',
      text2: 'cv1-mode6-text2',
      text3: 'cv1-mode6-text3',
      level: 'cv1-mode6-level',
    },
  },
  v2: {
    mode1: {
      bg1: 'cv2-mode1-bg1',
      text1: 'cv2-mode1-text1',
      bg2: 'cv2-mode1-bg2',
      text2: 'cv2-mode1-text2',
    },
    mode2: {
      bg1: 'cv2-mode2-bg1',
      text1: 'cv2-mode2-text1',
      bg2: 'cv2-mode2-bg2',
      text2: 'cv2-mode2-text2',
    },
    mode3: {
      bg1: 'cv2-mode3-bg1',
      text1: 'cv2-mode3-text1',
      bg2: 'cv2-mode3-bg2',
      text2: 'cv2-mode3-text2',
    },
    mode4: {
      bg1: 'cv2-mode4-bg1',
      text1: 'cv2-mode4-text1',
      bg2: 'cv2-mode4-bg2',
      text2: 'cv2-mode4-text2',
    },
    mode5: {
      bg1: 'cv2-mode5-bg1',
      text1: 'cv2-mode5-text1',
      bg2: 'cv2-mode5-bg2',
      text2: 'cv2-mode5-text2',
    },
  },
  v3: {
    mode1: {
      gradient: 'cv3-gradient1',
      bg: 'cv3-bg1',
      text: 'cv3-text1',
      level: 'cv3-level1',
    },
    mode2: {
      gradient: 'cv3-gradient2',
      bg: 'cv3-bg2',
      text: 'cv3-text2',
      level: 'cv3-level2',
    },
    mode3: {
      gradient: 'cv3-gradient3',
      bg: 'cv3-bg3',
      text: 'cv3-text3',
      level: 'cv3-level3',
    },
    mode4: {
      gradient: 'cv3-gradient4',
      bg: 'cv3-bg4',
      text: 'cv3-text4',
      level: 'cv3-level4',
    },
    mode5: {
      gradient: 'cv3-gradient5',
      bg: 'cv3-bg5',
      text: 'cv3-text5',
      level: 'cv3-level5',
    },
  },
} as const;

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Supposons que `verifyJWT` soit une fonction asynchrone qui prend en charge des chaînes.
export const purgeFiles = async (files: string[]) => {
  const STATIC_DIR = path.resolve(__dirname, '../static');

  // Vérifie que le tableau des fichiers n'est pas vide avant de continuer
  if (files.length === 0) {
    return;
  }

  // Vérifie les tokens pour chaque fichier (vérifie que `verifyJWT` retourne une chaîne pour chaque fichier)
  const processedFiles = files.map((file) => verifyJWT(file) as string);

  // Obtient le chemin d'architecture de dossiers en utilisant le premier fichier comme référence
  const filePath = processedFiles[0].split('/');
  filePath.pop(); // Retire le nom du fichier, gardant ainsi le chemin du dossier
  const scanDir = filePath.join('/');
  const DIR = path.join(STATIC_DIR, scanDir);

  try {
    const keepingFiles = processedFiles.map((f) => {
      const eachFilePath = f.split('/');
      return eachFilePath.pop(); // Récupère uniquement le nom du fichier
    });

    // Récupère les fichiers actuels dans le dossier
    const dirFiles = fs.readdirSync(DIR);

    // Parcours et supprime les fichiers qui ne sont pas dans `keepingFiles`
    dirFiles.forEach((file) => {
      if (!keepingFiles.includes(file)) {
        fs.rmSync(path.join(DIR, file));
      }
    });
  } catch (error) {
    console.error(
      `Erreur lors de la purge des fichiers dans le dossier ${DIR}:`,
      error,
    );
  }
};

export const purgeSingleFIle = (path: string) => {
  try {
    fs.rmSync(path);
  } catch (err) {
    console.error(err);
  }
};

const setupSecurity = async () => {
  try {
    console.log('creating the new security.json');
    const SECURITY_DIR = path.resolve(__filename, '../../security');
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const hash = tokenGenerator(date.toString());
    const security: SecurityHashPayload = {
      hash,
      env: process.env.NODE_ENV,
      expire: date.toISOString(),
    };
    console.log('setup the security hash to expire in ' + date.toUTCString());
    const filePath = path.join(SECURITY_DIR, 'security.json');
    fs.writeFileSync(filePath, JSON.stringify(security, null, 2));
    console.log('security.json successfully created');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const verifySecurity = async () => {
  try {
    const SECURITY_DIR = path.resolve(__dirname, '../../security');
    const filePath = path.join(SECURITY_DIR, 'security.json');
    if (fs.existsSync(filePath)) {
      console.log('found security.json processing file examination');
      const content = fs.readFileSync(filePath, 'utf8');
      const security: SecurityHashPayload = JSON.parse(content);
      const date = new Date(security.expire);
      if (Date.now() > date.getTime()) {
        console.log('security expired trying to create a new security.json');
        return await setupSecurity();
      }
      if (process.env.NODE_ENV !== security.env) {
        console.log(
          'security env are not set correctly updating security.json',
        );
        return await setupSecurity();
      }
      return true;
    }
    console.log('No security file found creating a new security.json');
    return await setupSecurity();
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const loadSecurityBearer = async () => {
  const SECURITY_DIR = path.resolve(__dirname, '../../security');
  const filePath = path.join(SECURITY_DIR, 'security.json');
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const security: SecurityHashPayload = JSON.parse(fileContent);
    return security;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export enum DocumentMimeTypes {
  // Documents texte
  PLAIN_TEXT = 'text/plain',
  HTML = 'text/html',
  CSS = 'text/css',
  CSV = 'text/csv',
  XML = 'application/xml',
  XHTML = 'application/xhtml+xml',

  // Documents Microsoft Office
  DOC = 'application/msword',
  DOCX =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX =
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Documents OpenDocument
  ODT = 'application/vnd.oasis.opendocument.text',
  ODS = 'application/vnd.oasis.opendocument.spreadsheet',
  ODP = 'application/vnd.oasis.opendocument.presentation',

  // PDF
  PDF = 'application/pdf',

  // Formats texte enrichi
  RTF = 'application/rtf',

  // Ebooks
  EPUB = 'application/epub+zip',
}

export enum ImageMimeType {
  // Images (documents visuels)
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',
  TIFF = 'image/tiff',
  ICO = 'image/x-icon',
}

export const useTranslator = async (
  text: string,
  options: Translate = { to: 'en' },
) => {
  return await translate(text, options);
};
