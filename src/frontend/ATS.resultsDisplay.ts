export function displayResults(
  data: {
    documents: {
      name: unknown;
      relevance: unknown;
    }[];
    extractedInfo: Record<string, unknown> | ArrayLike<unknown>;
    finalAnalysis: unknown;
  },
) {
  const filteredDocs = document.getElementById('filteredDocs');
  const extractedInfo = document.getElementById('extractedInfo');
  const finalAnalysis = document.getElementById('finalAnalysis');

  // Afficher les documents filtrés
  filteredDocs!.innerHTML = data.documents
    .map(
      (doc: { name: unknown; relevance: unknown }) => `
        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
                <h3 class="text-sm font-medium text-gray-900">${doc.name}</h3>
                <p class="text-sm text-gray-500">Pertinence: ${doc.relevance}%</p>
            </div>
        </div>
    `,
    )
    .join('');

  // Afficher les informations extraites
  extractedInfo!.innerHTML = Object.entries(data.extractedInfo)
    .map(
      ([key, value]) => `
        <div class="bg-gray-50 p-4 rounded-lg">
            <dt class="text-sm font-medium text-gray-500">${key}</dt>
            <dd class="mt-1 text-sm text-gray-900">${value}</dd>
        </div>
    `,
    )
    .join('');

  // Afficher l'analyse finale
  finalAnalysis!.innerHTML = `
        <div class="prose max-w-none">
            <p class="text-sm text-gray-700">${data.finalAnalysis}</p>
        </div>
    `;
}

// Fonction pour mettre à jour la progression
export function updateProgress(step: unknown, total: unknown) {
  // Vous pouvez ajouter une barre de progression si nécessaire
  console.log(`Étape ${step} sur ${total}`);
}
