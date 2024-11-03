#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction d'aide
show_help() {
    echo -e "${BLUE}Usage:${NC}"
    echo -e "  $0 [options]"
    echo -e "\n${BLUE}Options:${NC}"
    echo -e "  -d, --dirs     Liste des dossiers à créer (séparés par des virgules)"
    echo -e "  -f, --files    Liste des fichiers à créer (séparés par des virgules)"
    echo -e "  -h, --help     Affiche cette aide"
    echo -e "\n${BLUE}Exemple:${NC}"
    echo -e "  $0 -d 'src/components,src/pages,dist' -f 'src/index.js,README.md'"
    exit 0
}

# Dossiers par défaut
DEFAULT_DIRS=(
    "src"
    "src/assets"
    "src/assets/images"
    "src/assets/styles"
    "src/components"
    "src/layouts"
    "src/pages"
    "src/utils"
    "src/services"
    "public"
    "tests"
    "docs"
)

# Fichiers par défaut
DEFAULT_FILES=(
    "src/assets/styles/main.css:./* { margin: 0; padding: 0; box-sizing: border-box; }"
    ".gitignore:node_modules/\ndist/\n.env\n.DS_Store"
    "README.md:# Project Name\n\nDescription of your project goes here."
)

# Fonction pour créer un dossier
create_directory() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo -e "${GREEN}✓${NC} Création du dossier: ${BLUE}$1${NC}"
    else
        echo -e "${YELLOW}→${NC} Le dossier existe déjà: ${BLUE}$1${NC}"
    fi
}

# Fonction pour créer un fichier avec contenu optionnel
create_file() {
    # Sépare le nom du fichier et son contenu (s'il existe)
    IFS=':' read -r file_path file_content <<< "$1"
    
    dir_path=$(dirname "$file_path")
    
    # Crée le dossier parent si nécessaire
    if [ ! -d "$dir_path" ]; then
        mkdir -p "$dir_path"
    fi
    
    if [ ! -f "$file_path" ]; then
        if [ -n "$file_content" ]; then
            echo -e "$file_content" > "$file_path"
        else
            touch "$file_path"
        fi
        echo -e "${GREEN}✓${NC} Création du fichier: ${BLUE}$file_path${NC}"
    else
        echo -e "${YELLOW}→${NC} Le fichier existe déjà: ${BLUE}$file_path${NC}"
    fi
}

# Initialisation des variables
directories=()
files=()
use_defaults=true

# Traitement des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        -d|--dirs)
            IFS=',' read -ra directories <<< "$2"
            use_defaults=false
            shift 2
            ;;
        -f|--files)
            IFS=',' read -ra files <<< "$2"
            use_defaults=false
            shift 2
            ;;
        *)
            echo -e "${RED}Option invalide: $1${NC}"
            show_help
            ;;
    esac
done

# Message de début
echo -e "\n${BLUE}=== Initialisation de la structure du projet ===${NC}\n"

# Utilisation des valeurs par défaut ou des paramètres
if [ "$use_defaults" = true ]; then
    echo -e "${YELLOW}Utilisation de la configuration par défaut${NC}\n"
    directories=("${DEFAULT_DIRS[@]}")
    files=("${DEFAULT_FILES[@]}")
fi

# Création des dossiers
for dir in "${directories[@]}"; do
    create_directory "$dir"
done

# Création des fichiers
for file in "${files[@]}"; do
    create_file "$file"
done

# Message de fin
echo -e "\n${GREEN}=== Structure du projet initialisée avec succès ===${NC}\n"

# Afficher l'arborescence
if command -v tree &> /dev/null; then
    echo -e "${BLUE}Structure du projet :${NC}"
    tree -L 3 --dirsfirst
else
    echo -e "${RED}La commande 'tree' n'est pas installée. Installation recommandée pour visualiser l'arborescence.${NC}"
fi