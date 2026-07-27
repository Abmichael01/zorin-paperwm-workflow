# Zorin PaperWM Workflow

A reproducible, switchable PaperWM desktop profile for Zorin OS. It provides
scrollable tiling, numbered workspaces on the focused monitor, touchpad
gestures, and one-click launchers for switching between PaperWM and a normal
Zorin desktop.

## What it installs

- PaperWM 50.0.1 (bundled from the upstream PaperWM project)
- A companion GNOME extension for focused-monitor numbered workspaces
- A Zorin-only `Super+Space` menu extension
- `zorin-desktop-profile`, which enables/disables conflicting extensions and
  shortcuts for each profile
- Touchégg gesture profiles
- **Enable PaperWM Tiling** and **Restore Normal Zorin** application launchers

The extensions are included in this repository. You do not need Extension
Manager to download them separately.

## Compatibility

The complete configuration is tested on:

- Zorin OS 18
- GNOME Shell 46
- X11
- PaperWM 50.0.1

It is **not guaranteed to work on every GNOME desktop**. The bundled upstream
PaperWM release declares GNOME 45–50 support, but the numbered-workspace
companion uses PaperWM internals and is currently declared for GNOME 46 only.

Ubuntu or another GNOME 46 system can use PaperWM and numbered workspaces. The
installer skips Zorin taskbar settings, and `Super+Space` is not enabled when
the Zorin Menu extension is absent. Wayland, newer GNOME releases, Fedora, and
other PaperWM versions are not yet tested.

## Install

Download or clone the repository, then run:

```bash
git clone https://github.com/Abmichael01/zorin-paperwm-workflow.git
cd zorin-paperwm-workflow
./install.sh
```

If Touchégg is missing on Zorin, Ubuntu, or Debian, install the optional system
dependency at the same time:

```bash
./install.sh --install-deps
```

That option uses `sudo apt` and will ask for your password in the terminal. The
normal installer never asks for or stores a password.

Log out and back in once after the first installation so GNOME discovers the
new extensions. Then search the application menu for **Enable PaperWM Tiling**,
or run:

```bash
~/.local/bin/zorin-desktop-profile tiling
```

Check the active state with:

```bash
~/.local/bin/zorin-desktop-profile status
```

## Profiles

### PaperWM tiling

The `tiling` profile:

- disables Zorin Tiling Shell, Workspace Switcher Manager, and desktop icons
  when present
- disables conflicting GNOME/Zorin number-key application shortcuts
- enables dynamic, per-monitor workspaces
- enables PaperWM and the numbered-workspace companion
- installs the PaperWM three-finger gesture profile
- keeps `Super+Q`, `Super+Enter`, the touchpad `areas` click method, and the
  Zorin-only `Super+Space` menu binding

### Normal Zorin

Run this from the application menu or terminal:

```bash
~/.local/bin/zorin-desktop-profile normal
```

It disables PaperWM and its companion, restores Zorin taskbar number shortcuts,
enables desktop icons and X11 Gestures when those extensions exist, and restores
the included normal gesture profile. This is an opinionated Zorin profile, not
a byte-for-byte backup of another person's previous GNOME settings.

## Controls

| Shortcut | Action |
| --- | --- |
| `Super+1` … `Super+9` | Switch to that PaperWM workspace on the focused monitor |
| `Ctrl+Super+1` … `Ctrl+Super+9` | Move the active window to that workspace |
| Three-finger left/right | Previous/next workspace |
| `Super+Up` / `Super+Down` | PaperWM vertical navigation |
| `Super+Page Up` / `Super+Page Down` | Previous/next PaperWM workspace |
| `Ctrl+Super+T` | Toggle tiled/floating (PaperWM scratch layer) |
| `Super+Q` | Close the active window |
| `Super+Enter` | Open the configured terminal shortcut |
| `Super+Space` | Toggle Zorin Menu (Zorin only) |

## Multi-monitor behavior

Numbered shortcuts target the monitor containing the focused window. Each
monitor gets its own ordered set of PaperWM spaces. GNOME's ordinary workspace
gesture may still behave differently depending on session type and installed
gesture extensions; the bundled PaperWM Touchégg profile sends PaperWM's
workspace shortcuts on X11.

## Updating PaperWM

The numbered-workspace extension imports PaperWM's internal `tiling.js`, so an
upstream PaperWM update can require companion changes. Test updates before
replacing the bundled version.

## Uninstall

First restore the normal profile, then remove the installed files:

```bash
~/.local/bin/zorin-desktop-profile normal
rm -rf \
  ~/.local/share/gnome-shell/extensions/paperwm@paperwm.github.com \
  ~/.local/share/gnome-shell/extensions/paperwm-numbered-workspaces@urkel.local \
  ~/.local/share/gnome-shell/extensions/zorin-menu-super-space@urkel.local
rm -f \
  ~/.local/bin/zorin-desktop-profile \
  ~/.local/share/applications/zorin-profile-normal.desktop \
  ~/.local/share/applications/zorin-profile-tiling.desktop
```

Log out and back in afterward.

## Privacy

This public package contains no passwords, tokens, Android emulator data, dconf
database, or user-specific home path. `install.sh` substitutes the current
user's `$HOME` during installation.

## Credits and license

PaperWM is developed by the [PaperWM project](https://github.com/paperwm/PaperWM)
and is bundled under its GPL license, included inside the PaperWM extension
directory. This profile and its companion extensions are distributed under
GPL-3.0-or-later as well.
