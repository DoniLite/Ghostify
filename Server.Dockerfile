# syntax=docker/dockerfile:1

ARG DENO_VERSION=2.2.5
ARG PYTHON_VERSION=3.12

################################################################################
# Base image avec Deno et Python
FROM denoland/deno:${DENO_VERSION} as base

# Install necessary system packages (including Python)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python${PYTHON_VERSION} \
    python3-pip \
    sudo \
    make \
    pandoc \
    && rm -rf /var/lib/apt/lists/*

# Create a user with sudo rights
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup deno && \
    echo "deno ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deno

WORKDIR /usr/app

# Give ownership to deno user
RUN chown -R deno:appgroup /usr/app

################################################################################
# Stage de récupération des dépendances
FROM base as deps

COPY --chown=deno:appgroup ./deno.json ./deno.json
COPY --chown=deno:appgroup ./deno.lock ./deno.lock

# Cache les modules Deno pour éviter de les re-télécharger à chaque build
RUN deno cache --lock=deno.lock --lock-write $(cat deno.json | jq -r '.imports | keys[]') \
    deno install --reload --lock=deno.lock --frozen=false --allow-scripts

################################################################################
# Build l'application
FROM deps as build

COPY --chown=deno:appgroup . .

# Compile et optimise l'application (optionnel)
RUN deno compile --unstable --output app main.ts

################################################################################
# Final stage - production
FROM base as final

# Utiliser un environnement de production
ENV DENO_ENV=production

# Définir l'utilisateur par défaut
USER deno

# Copier les fichiers nécessaires
COPY --chown=deno:appgroup --from=build /usr/app /usr/app

EXPOSE 8080

# Lancer l'application avec Deno
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "--allow-run", "main.ts"]
