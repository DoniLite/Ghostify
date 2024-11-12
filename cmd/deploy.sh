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

echo "🛑 Arrêt des instances en cours..."
pm2 list | grep -q "online" && pm2 stop all

echo "🏗️ Construction du projet..."
pnpm build || handle_error "pnpm build"

echo "🚀 Démarrage des nouvelles instances..."
pm2 delete all 2>/dev/null 

# Démarrage des applications
pm2 start pnpm --name "app" -- run start || handle_error "starting app"
pm2 start make --name "api" -- run start-prod || handle_error "starting api"

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