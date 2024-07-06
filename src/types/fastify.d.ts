import "fastify";
import "@fastify/jwt";

declare module "fastify" {
  export interface payload {

  }
  interface jwt {
    sign: (payload: payload) => string; // Remplace `any` par le type approprié
    // Ajoute d'autres propriétés de session ici si nécessaire
  }
}
