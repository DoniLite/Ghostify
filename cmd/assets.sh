#!/bin/bash

SRC_DIR="$1"
DEST_DIR="/var/www/html/static"

# Vérifier si le répertoire de destination existe
if [ ! -d "$DEST_DIR" ]; then
  sudo mkdir -p "$DEST_DIR"
  echo "Répertoire de destination créé : $DEST_DIR"
fi

# Copier les fichiers du répertoire source vers la destination
sudo cp -r "$SRC_DIR"/* "$DEST_DIR"
echo "Fichiers copiés avec succès."