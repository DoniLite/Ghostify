#!/bin/bash

# Fonction pour gérer les erreurs
handle_error() {
    echo "Erreur à l'étape : $1"
    exit 1
}

echo "🔄 Fetching data from remote service..."
git pull origin main || handle_error "git pull"

echo "📦 Installing dependencies..."
pnpm install || handle_error "pnpm install"

echo "🛑 Stopping all running instances..."
pm2 list | grep -q "online" && pm2 stop all

echo "🏗️ Running the build script..."
pnpm build || handle_error "pnpm build"

echo "🚀 Starting new instances..."
pm2 delete all 2>/dev/null # Nettoyage des anciennes instances

# Démarrage des applications avec gestion des erreurs
pm2 start pnpm --name "app" -- run start || handle_error "starting app"
pm2 start make --name "api" -- run start-prod || handle_error "starting api"

# Vérification du statut
pm2 list

echo "🔄 Reloading nginx proxy server..."
sudo nginx -t && sudo nginx -s reload || handle_error "nginx reload"

echo "✅ Deployment completed successfully!"

# Affichage des logs en cas d'erreur
pm2 logs --lines 50 --nostream