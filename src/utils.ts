import { EssentialWeatherData, WeatherData } from "index";

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
    return text.slice(0,debordedLength).concat("...");
  }
  return text;
}
