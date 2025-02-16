import { concurrently } from 'concurrently';

/*
Fonction d'excecution de test pour la plateforme
*/
export const { result: playwrightTestResult } = concurrently([
  'test',
  {
    command: 'pnpm exec playwright test',
    name: 'playwright test',
  },
]);
