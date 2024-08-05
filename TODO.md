# Liste des taches à accomplir

- **Mettre à jour la liste des variables d'environnement dans le déploiment**
- **Mettre à jour la base de donnée avec prisma migrate**
- **Modifier le footer et le personnaliser pour chacune des pages**
- **Trouver la configuration approppriée pour les nouvelles types de données de la page projet**
- **Etablir les routes des pages termes et services, conditions d'utilisaion et autres à partir du templetage d'un unique route se servant du fichier page.ejs et appelant le contenu de la page depuis la base de donnée écrit en markdown**

Je précise que l'outil 'markdown-it' sera utilisé pour cette tache.

- **Installer 'lru-cache' pour le cache des pages avec ejs**

Usage:

```Typescript
    import ejs from 'ejs'
    import LRU from 'lru-cache'
    ejs.cache = LRU(100); // LRU cache with 100-item limit
```

- **Trouver un fichier de definition pour le module markdown-it**
