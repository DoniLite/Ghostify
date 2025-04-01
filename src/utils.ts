import { month } from './@types/index.d.ts';
import fs, { promises as fsP } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import puppeteer, { Page } from 'puppeteer';
import { prismaClient } from './config/db.ts';
import bcrypt from 'bcrypt';
import {
  // formatDistanceToNow,
  // formatDuration,
  intervalToDuration,
} from 'date-fns';
import { Translate, translate } from 'free-translate';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import Queue from 'bull';
import { EventEmitter } from 'node:events';
import { sign, verify } from 'hono/jwt';
import { NotificationType } from '@prisma/client';
import mime from './modules/mime.ts';
import z from 'zod';

export const ee = () => new EventEmitter();

export const tokenGenerator = async <T extends Record<string, unknown>>(
  payload: T
) => {
  return await sign(payload, Deno.env.get('JWT_SECRET')!);
};

export function getFileHeaders(filePath: string, download?: boolean) {
  // Extraire le nom de fichier
  const fileName = path.basename(filePath);

  // Déterminer le type MIME
  const contentType = mime.getType(fileName) || 'application/octet-stream';

  // Déterminer le mode de disposition
  const disposition = download
    ? 'attachment' // Affichage direct dans le navigateur
    : 'inline'; // Téléchargement forcé

  return {
    'Content-Disposition': `${disposition}; filename="${fileName}"`,
    'Content-Type': contentType,
  };
}

export const hashSomething = async (
  data: string | Buffer,
  saltRound?: number
) => {
  const round = saltRound || 14;
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

export const DATA_PATH = path.resolve(path.join(Deno.cwd(), './data'));
export const DATA_FILE = path.join(DATA_PATH, 'statistics.json');

export async function createDirIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    await fsP.mkdir(path);
  }
  return;
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

// Définir une interface pour les clés
interface Keys {
  secretKey: string;
  iv: string;
}

export const generateKeys = () => {
  const secretKey: Buffer = crypto.randomBytes(32);
  const iv: Buffer = crypto.randomBytes(16);
  return {
    secretKey: secretKey.toString('hex'),
    iv: iv.toString('hex'),
  }
}
// Fonction pour générer et sauvegarder les clés
export async function saveKeys(): Promise<{
  secretKey: Buffer;
  iv: Buffer;
}> {
  

  const keys: Keys = generateKeys();

  const verifyIfKeyExist = await prismaClient.key.findUnique({
    where: {
      uid: server_uid,
    },
  });

  if (verifyIfKeyExist && verifyIfKeyExist.key && verifyIfKeyExist.iv) {
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
    secretKey: Buffer.from(newKey.key!, 'hex'),
    iv: Buffer.from(newKey.iv!, 'hex'),
  };
}

// Fonction pour charger les clés depuis le fichier
export async function loadKeys(): Promise<{ secretKey: Buffer; iv: Buffer }> {
  const keys = await prismaClient.key.findUnique({
    where: {
      uid: server_uid,
    },
  });
  if (!keys || !keys.key || !keys.iv) {
    return await saveKeys();
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
  iv: Buffer
): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
  let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function tokenTimeExpirationChecker(t: number) {
  const now = new Date();
  return now.getTime() <= t;
}

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

export const About = `
# À propos de notre plateforme

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

// Schéma de validation des options
const ContentDownloaderSchema = z.object({
  url: z.string().optional(),
  content: z.string().optional(),
  path: z.object({
    png: z.string(),
    pdf: z.string()
  }).optional()
});

// Type générique pour les options de téléchargement
export type ContentDownloaderOptions = {
  url?: string;
  content?: string;
  path?: {
    png: string;
    pdf: string;
  };
};

// Type générique pour la fonction de transformation
export type PageTransformFn<TReturn = void> = (page: Page) => TReturn | Promise<TReturn>;

// Type utilitaire pour inférer le type de retour conditionnel
type InferDownloadResult<
  TOptions extends ContentDownloaderOptions, 
  TFn extends PageTransformFn | undefined
> = 
  TOptions['path'] extends { png: string; pdf: string } 
    ? {
        data: {
          imageToken: string;
          pdfToken: string;
        };
      }
    : TFn extends PageTransformFn 
      ? {
          t: Awaited<ReturnType<TFn>>;
        }
      : {
          page: Page;
          close: () => Promise<void>
        };

/**
 * Fonction de téléchargement de contenu hautement générique
 */
export async function contentDownloader<
  TOptions extends ContentDownloaderOptions,
  TFn extends PageTransformFn | undefined = undefined
>(
  opts: TOptions, 
  fn?: TFn
): Promise<InferDownloadResult<TOptions, TFn>> {
  // Validation des options
  ContentDownloaderSchema.parse(opts);

  // Chemins statiques
  const STATIC_DIR = path.resolve(Deno.cwd(), './static/downloads/doc');
  const STATIC_IMG_DIR = path.resolve(Deno.cwd(), './static/downloads/cv');

  // Lancement du navigateur
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // Chargement du contenu
    if (opts.content) {
      await page.setContent(opts.content, { waitUntil: 'networkidle0' });
    } else if (opts.url) {
      await page.goto(opts.url, { waitUntil: 'networkidle0' });
    }

    // Gestion des chemins de fichiers
    if (opts.path) {
      const { pdf, png } = opts.path;
      const pdfFilePath = path.join(STATIC_DIR, pdf);
      const pngFilePath = path.join(STATIC_IMG_DIR, png);

      // Génération PDF et PNG
      await Promise.all([
        page.pdf({
          path: pdfFilePath,
          format: 'A4',
          printBackground: true,
          margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
        }),
        page.screenshot({
          path: pngFilePath,
          fullPage: true,
        }),
      ]);

      // Génération des tokens
      const [imageToken, pdfToken] = await Promise.all([
        tokenGenerator({ path: `download/${png}` }),
        tokenGenerator({ path: `download/${pdf}` })
      ]);

      await page.close();
      await browser.close();

      return {
        data: { imageToken, pdfToken }
      } as InferDownloadResult<TOptions, TFn>;
    }

    // Exécution de la fonction personnalisée
    if (fn) {
      const result = await fn(page);
      await page.close();
      await browser.close();
      return {
        t: result
      } as InferDownloadResult<TOptions, TFn>;
    }


    return {
      page,
      close: async () => {
        await browser.close();
      },
    } as InferDownloadResult<TOptions, TFn>;

  } catch (error) {
    await browser.close();
    throw error;
  }
}

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
  const eev = ee();
  const downloaderOpts = {
    url: options.url,
    path: {
      pdf,
      png
    }
  }
  
  const result = await contentDownloader(downloaderOpts);
  const { imageToken, pdfToken } = result.data;

  const pngServicePath = Deno.env.get('APP_HOST') + imageToken;

  const pdfServicePath =  Deno.env.get('APP_HOST') + pdfToken;

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
  console.log('function running end');

  await prismaClient.notifications.create({
    data: {
      title: `Votre CV a été créé`,
      content: `Vous pouvez télécharger votre CV ici ${cvUpdating.pdf}`,
      userId: cvUpdating.userId,
      type: 'Info',
    },
  });

  eev.emit('Info', {
    title: `Votre CV a été créé`,
    content: `Vous pouvez telecharger votre CV ici <a href="${cvUpdating.pdf}"></a>`,
    action: 'update',
  });

  return {
    screenshot: cvUpdating.screenshot,
    downloadLink: cvUpdating.pdf,
  };
};

/**
 * Function to rename a file using its location returns false if the operation fails and the file new full name if not
 * @param file {formidable.File}
 * @param pathTo {string}
 */
export const renaming = async (file: File, pathTo: string) => {
  const ext = path.extname(file.name);
  const date = new Date();
  const r = crypto.randomInt(date.getTime()).toString();
  const fName = `${date.getTime().toString() + r}${ext}`;
  console.log(fName);
  const xPath = path.resolve(process.cwd(), pathTo);
  const uploadPath = path.join(xPath, fName);
  try {
    // Convertir le fichier en tableau de bytes
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Stocker le fichier
    await Deno.writeFile(uploadPath, uint8Array);
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
    console.error(`Erreur : ${(error as { message: string }).message}`);

    // Tente de créer le dossier avec les permissions appropriées
    try {
      fs.mkdirSync(directory, { recursive: true, mode: 0o755 });
      console.log(`Dossier créé : ${directory}`);
    } catch (mkdirError) {
      console.error(
        `Impossible de créer le dossier : ${
          (mkdirError as { message: string }).message
        }`
      );
      throw mkdirError;
    }
  }
}

export function getTimeElapsed(date: Date) {
  const duration = intervalToDuration({ start: date, end: new Date() });

  // sourcery skip: use-braces
  if (duration.weeks && duration.weeks >= 1) return `${duration.weeks}w`;
  if (duration.days && duration.days >= 1) return `${duration.days}d`;
  if (duration.hours && duration.hours >= 1) return `${duration.hours}h`;
  if (duration.minutes && duration.minutes >= 1) return `${duration.minutes}m`;
  if (duration.seconds && duration.seconds >= 1) return `${duration.seconds}s`;

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

export const verifyJWT = async (token: string) => {
  return await verify(token, Deno.env.get('JWT_SECRET')!);
};

// Supposons que `verifyJWT` soit une fonction asynchrone qui prend en charge des chaînes.
export const purgeFiles = (files: string[]) => {
  const STATIC_DIR = path.resolve(process.cwd(), './static');

  // Vérifie que le tableau des fichiers n'est pas vide avant de continuer
  if (files.length === 0) {
    return;
  }

  // Vérifie les tokens pour chaque fichier (vérifie que `verifyJWT` retourne une chaîne pour chaque fichier)
  const processedFiles = files.map(
    (file) => verifyJWT(file) as unknown as string
  );

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
      error
    );
  }
};

export const purgeSingleFile = (path: string) => {
  try {
    fs.rmSync(path);
  } catch (err) {
    console.error(err);
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
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

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
  options: Translate = { to: 'en' }
) => {
  return await translate(text, options);
};

export const cvQueue = new Queue<{
  url: string;
  id: number;
  updating?: boolean;
  docId?: number;
}>('cv-processor', 'redis://127.0.0.1:6379');

export const NotificationQueue = new Queue<{
  userId: number;
  type: NotificationType;
  payload: Record<string | number | symbol, unknown>;
}>('notifications', 'redis://127.0.0.1:6379');
