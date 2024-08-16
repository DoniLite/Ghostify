

declare module "node-vibrant" {
  export class Swatch {
    getHex(): string;
    getRgb(): number[];
    getPopulation(): number;
  }

  export interface Palette {
    Vibrant: Swatch | null;
    Muted: Swatch | null;
    DarkVibrant: Swatch | null;
    DarkMuted: Swatch | null;
    LightVibrant: Swatch | null;
    LightMuted: Swatch | null;
  }

  export default class Vibrant {
    static from(src: string): Vibrant;
    getPalette(): Promise<Palette>;
  }
}
