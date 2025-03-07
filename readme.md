# Projet Gostify

![screen1](/src/public/screen/screen1.png) ![screen2](/src/public/screen/screen2.png)

Ce projet est le code source de mon site professionel c'est en quelque sorte un personnal hub com pour moi. Il contient l'essentiel de l'architecture backend et frontend que j'ai utilisé pour la crétion du site.\
L'architecture est basé sur server Backend fournissant les assets(documents ou données publiques) et les pages de toute la partie frontend. L'essentiel du front est logé dans les **/views** du projet. Les scripts sont disponibles via le dossier **/public** des assets.\
L'essentie du code est constitué de typeScript considérez tous les fichiers portant une extension en rapport avec ce langage comme étant une implémentation du serveur ou d'une fonctionnalité attaché au site.

## langages

- **TypeScript**
- **EJS** (pour le templatage)
- **CSS** l'essentiel du style a été écrit en [tailwind](https://tailwind.com/) via les fichiers **views** comme [blog](/src/views/blog.ejs) par exemple.
- **JavaScript**

## structure

Le dossier **src/** est le dossier principal du projet. Cependant tous le code qui y est contenu est sensé etre _**compiler**_, _**builder**_, _**servi**_ par le serveur à travers les fichiers publics cependant garder à l'esprit que certaines fonctionnalités du _front_ sont contenus dans les fichiers js comme:

- [1](/src/public/script/1.js)
- [loader](/src/public/script/loader.js)
- [uploaoder](/src/public/script/uploader.js)

## les tests

Le projet possede des tests programmable et exécutable via le repository pour les [controle](https://github.com/) et des **tests** attachés au serveur via la librairie [Playwright](https://playwright.com/) programmées en tàches de fond sur le serveur,
