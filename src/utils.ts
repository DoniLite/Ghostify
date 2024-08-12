import { EssentialWeatherData, month, StatsData, WeatherData } from "index";
import fs, {promises as fsP} from "node:fs";
import path from "node:path";
import crypto, { createHash, createVerify, sign } from "node:crypto";


export function verifyHash(hash: string) {
  const verify = createVerify("sha256");
  const verification = verify.update(hash);
  console.log(verification);
}

export function customCreateHash(data: string): string{
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest('hex')
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
    return text.slice(0, debordedLength).concat("...");
  }
  return text;
}

export enum ProjectParticipationType {
  free = "free",
  colaboration = "colaboration",
  subscription = "subscription",
}

export const DATA_PATH = path.join(__dirname, "data");
export const DATA_FILE = path.join(DATA_PATH, "statistics.json");

export function createDirIfNotExists(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
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
export function streamTest() {
  fs.realpath("./data/statistics.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const streamReader = fs.createReadStream(data);
    streamReader.on("data", (data) => {});
    const chunks = [] as unknown[];

    streamReader.on("readable", () => {
      let chunk;
      while (null !== (chunk = streamReader.read())) {
        chunks.push(chunk);
      }
    });

    streamReader.on("end", () => {
      const content = chunks.join("");
    });
  });
}
fs.opendir("", () => {});
export const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
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

export function loadStatistics(): StatsData {
  createDirIfNotExists(DATA_PATH);
  if (!fs.existsSync(DATA_FILE)) {
    return createFirstStatistic();
  }
  const jsonStrng = fs.readFileSync(DATA_FILE, "utf8");
  const stats = JSON.parse(jsonStrng) as StatsData;
  return stats;
}

export async function saveStatistic(stat: StatsData) {
  const json = JSON.stringify(stat, null, 4);
  fs.writeFile(DATA_FILE, json, "utf8", (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

export enum Service {
  api = "api",
  blog = "blog",
  superUser = "superUser",
}; 


// Clé secrète (il est important de garder cette clé secrète)
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16); // Initialisation vector (IV)

// Fonction pour chiffrer les données
export function encrypt(text: string) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Fonction pour déchiffrer les données
export function decrypt(encryptedText: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Exemple d'utilisation
const textToEncrypt = "Salut Doni, c'est ton texte chiffré !";
const encryptedText = encrypt(textToEncrypt);
console.log("Texte chiffré:", encryptedText);

const decryptedText = decrypt(encryptedText);
console.log("Texte déchiffré:", decryptedText);