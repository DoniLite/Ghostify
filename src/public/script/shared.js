// public/js/app.js
window.App = {
  // Services partagés
  services: {
    api: {
      get: async (url) => {
        // vos appels API réutilisables
      },
      post: async (url, data) => {
        // ...
      },
    },
  },

  // Utilitaires partagés
  utils: {
    formatDate: (date) => {
      // ...
    },
    validation: {
      // ...
    },
  },

  // État global si nécessaire
  state: {
    user: null,
    settings: {},
  },
};
