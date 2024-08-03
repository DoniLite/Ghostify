import "fastify";
import "@fastify/jwt";
import { EssentialWeatherData, SessionQuote } from "index";

declare module "fastify" {
  export interface payload {

  }
  interface jwt {
    sign: (payload: payload) => string; // Remplace `any` par le type approprié
    // Ajoute d'autres propriétés de session ici si nécessaire
  }

  interface Session {
    Weather?: EssentialWeatherData; 
    Quote?: SessionQuote
  }

  interface FastifyRequest {
    setSession(payload: any, dest: "Weather" | "Quote"): Promise<void>;
  }
}
