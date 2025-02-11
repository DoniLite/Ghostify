# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install necessary system packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    sudo \
    make \
    pandoc \
    && rm -rf /var/lib/apt/lists/*

# Create a user with more privileges
ARG UID=10001
RUN addgroup --system --gid $UID appgroup && \
    adduser \
    --system \
    --disabled-password \
    --gecos "" \
    --home "/app" \
    --shell "/bin/bash" \
    --uid "${UID}" \
    --gid "${UID}" \
    appuser && \
    echo "appuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/appuser

# Give ownership to appuser
RUN chown -R appuser:appgroup /app

# Install dependencies with proper permissions
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.prod.txt,target=requirements.prod.txt \
    --mount=type=bind,source=Makefile,target=Makefile \
    make setup-prod

# Switch to appuser but with enhanced permissions
USER appuser

# Create necessary directories with proper permissions
RUN sudo mkdir -p /app/logs /app/data /app/uploads && \
    sudo chown -R appuser:appgroup /app/*

# Copy the source code
COPY --chown=appuser:appgroup ./python .
COPY --chown=appuser:appgroup Makefile .

EXPOSE 8080

CMD ["make", "start-prod"]