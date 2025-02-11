import 'vite/modulepreload-polyfill';
import { displayResults } from "./ATS.resultsDisplay";

document.addEventListener('DOMContentLoaded', function () {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('file-upload');
  const loader = document.getElementById('loader');
  const results = document.getElementById('results');

  // Gestion du drag & drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-indigo-500');
  });

  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-indigo-500');

    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  fileInput.addEventListener('change', (e : InputEvent) => {
    const el = e.target as HTMLInputElement;
    handleFiles(el.files);
  });

  function handleFiles(files: FileList) {
    // Afficher le loader
    loader.classList.remove('hidden');
    results.classList.add('hidden');

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('documents', file);
    });

    // Envoi des fichiers au serveur
    fetch('/api/analyze-documents', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Cacher le loader et afficher les résultats
        loader.classList.add('hidden');
        results.classList.remove('hidden');

        // Déclencher l'affichage des résultats
        displayResults(data);
      })
      .catch((error) => {
        console.error('Erreur:', error);
        loader.classList.add('hidden');
        // Afficher un message d'erreur
        alert('Une erreur est survenue lors du traitement des fichiers');
      });
  }
});
