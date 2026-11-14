#!/usr/bin/env bash
set -euo pipefail

echo "==> Building Canicas Online (Rust / Axum) in Release mode..."
export CARGO_BUILD_JOBS=2
cargo build --release
echo "==> Release binary ready at target/release/canicas"
