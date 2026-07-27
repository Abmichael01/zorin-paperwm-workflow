#!/usr/bin/env bash

set -euo pipefail

PACKAGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_HOME="$PACKAGE_DIR/files/home"
PROFILE_DIR="$HOME/.local/share/zorin-desktop-profiles"
TOUCHEGG_CONFIG="$HOME/.config/touchegg/touchegg.conf"
TOUCHEGG_BACKUP="$PROFILE_DIR/user-backups/touchegg.conf"

if [[ "${1:-}" == "--install-deps" ]]; then
    if ! command -v apt-get >/dev/null 2>&1; then
        printf '%s\n' '--install-deps currently supports Debian, Ubuntu, and Zorin only.' >&2
        exit 1
    fi
    sudo apt-get update
    sudo apt-get install -y libglib2.0-bin touchegg x11-utils xdotool
fi

if ! command -v gnome-extensions >/dev/null 2>&1; then
    printf 'GNOME Shell tools are required. Run this from your Zorin GNOME session.\n' >&2
    exit 1
fi

mkdir -p \
    "$HOME/.local/bin" \
    "$HOME/.local/share/applications" \
    "$HOME/.local/share/gnome-shell/extensions" \
    "$PROFILE_DIR/user-backups" \
    "$HOME/.config/touchegg"

if test -f "$TOUCHEGG_CONFIG" && ! test -f "$TOUCHEGG_BACKUP"; then
    cp -a "$TOUCHEGG_CONFIG" "$TOUCHEGG_BACKUP"
fi

cp -a "$SOURCE_HOME/.local/bin/." "$HOME/.local/bin/"
cp -a "$SOURCE_HOME/.local/share/applications/." "$HOME/.local/share/applications/"
cp -a "$SOURCE_HOME/.local/share/gnome-shell/extensions/." "$HOME/.local/share/gnome-shell/extensions/"
cp -a "$SOURCE_HOME/.local/share/zorin-desktop-profiles/." "$HOME/.local/share/zorin-desktop-profiles/"

# The desktop launchers and companion extension need the real home directory.
# Escape characters that are meaningful in a sed replacement.
escaped_home=$(printf '%s' "$HOME" | sed 's/[&|\\]/\\&/g')
sed -i "s|@HOME@|$escaped_home|g" \
    "$HOME/.local/share/applications/zorin-profile-android-emulator.desktop" \
    "$HOME/.local/share/applications/zorin-profile-normal.desktop" \
    "$HOME/.local/share/applications/zorin-profile-tiling.desktop" \
    "$HOME/.local/share/gnome-shell/extensions/paperwm-numbered-workspaces@urkel.local/extension.js"

chmod 755 "$HOME/.local/bin/zorin-desktop-profile"
chmod 755 "$HOME/.local/bin/paperwm-android-emulator-toolbar"

for schema_dir in \
    "$HOME/.local/share/gnome-shell/extensions/zorin-menu-super-space@urkel.local/schemas" \
    "$HOME/.local/share/gnome-shell/extensions/paperwm-numbered-workspaces@urkel.local/schemas" \
    "$HOME/.local/share/gnome-shell/extensions/paperwm@paperwm.github.com/schemas"; do
    if test -d "$schema_dir"; then
        glib-compile-schemas "$schema_dir"
    fi
done

if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$HOME/.local/share/applications"
fi

printf '\nPaperWM profile files restored successfully.\n'
printf 'Log out and back in once if GNOME has not seen these extensions before.\n'
printf 'Then run: %s/.local/bin/zorin-desktop-profile tiling\n' "$HOME"
