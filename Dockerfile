# ========================================================
# 🦀 Multi-stage Dockerfile for Canicas Mexicanas 3D Online
# Optimized for Render.com, Fly.io, Railway & Cloud Run
# ========================================================

# 1. Builder Stage
FROM rust:1-slim-bookworm AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends pkg-config && rm -rf /var/lib/apt/lists/*

ENV CARGO_BUILD_JOBS=2

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
COPY .cargo ./.cargo
RUN mkdir -p src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src target/release/deps/canicas* target/release/canicas* target/release/.fingerprint/canicas*

# Build actual application
COPY src ./src
RUN touch src/main.rs && cargo build --release

# 2. Runtime Stage
FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Security hardening: run as dedicated non-root user
RUN useradd -m -u 1000 canicas && chown -R canicas:canicas /app
USER canicas

# Copy compiled binary and static assets
COPY --from=builder --chown=canicas:canicas /app/target/release/canicas /app/canicas
COPY --chown=canicas:canicas public /app/public

# Render dynamically passes PORT (defaults to 10000 on Render, or 3000 locally)
ENV PORT=10000
EXPOSE 10000 3000

CMD ["/app/canicas"]

