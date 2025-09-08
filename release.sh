#!/bin/sh
set -eu

# ===== CONFIG =====
VERSION="${1:-}"

if [ -z "$VERSION" ]; then
    echo "Usage: sh release.sh <version>"
    exit 1
fi

# ===== GIT TAG =====
echo "=== Creating git tag v$VERSION ==="
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin "v$VERSION"