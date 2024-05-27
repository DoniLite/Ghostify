import "fastify";
import "@fastify/session";

declare module "fastify" {
  interface Session {
    Weather?: any; // Remplace `any` par le type approprié
    // Ajoute d'autres propriétés de session ici si nécessaire
  }
}
