#!/bin/bash

handle_error() {
    echo "❌ Erreur à l'étape : $1"
    exit 1
}

echo "🔄 Sauvegarde et nettoyage des changements locaux..."
# Sauvegarde des changements locaux dans un stash avec timestamp
timestamp=$(date +%Y%m%d_%H%M%S)
git stash push -m "backup_before_pull_$timestamp" || true

echo "♻️ Réinitialisation de l'état du répertoire..."
# Force la réinitialisation du répertoire de travail
git reset --hard HEAD

echo "🔄 Mise à jour depuis le dépôt distant..."
git pull origin main || handle_error "git pull"

echo "📦 Installation des dépendances..."
pnpm install || handle_error "pnpm install"

echo "🏗️ Construction du projet..."
pnpm build || handle_error "pnpm build"

echo "attribution de toutes les permissions nécessaires..."
sudo chmod -R 755 ./

echo "🚀 Rechargement des nouvelles instances..."

pm2 reload all || pm2 restart all

# Vérification du statut
pm2 list

echo "🔄 Rechargement du serveur nginx..."
sudo nginx -t && sudo nginx -s reload || handle_error "nginx reload"

echo "✅ Déploiement terminé avec succès!"

# Logs pour vérification
pm2 logs --lines 50 --nostream

# Optionnel : afficher les stash sauvegardés
echo "📝 Sauvegardes locales disponibles :"
git stash list | grep "backup_before_pull"