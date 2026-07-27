# Zorin PaperWM Workflow

A reproducible, switchable PaperWM desktop profile that makes Zorin GNOME feel
more like [Niri](https://github.com/YaLTeR/niri). It is for people who love
Niri's scrollable tiling workflow but want to keep using Zorin or GNOME instead
of replacing their whole desktop session.

It combines PaperWM with focused-monitor numbered workspaces, touchpad gestures,
Niri-like keyboard controls, and one-click launchers for switching between the
tiling workflow and a normal Zorin desktop.

## Why this exists

The goal is not to turn GNOME into Niri or claim complete feature parity. Niri
is a separate Wayland compositor, while this project builds a similar everyday
workflow on top of GNOME Shell and PaperWM. It packages the small extensions,
conflict fixes, gestures, and profile switching that were needed to make that
experience practical—especially on a multi-monitor Zorin setup.

This is shared for anyone who wants the same Niri-like speed and spatial window
management without migrating away from a familiar GNOME-based operating system.

## What it installs

- PaperWM 50.0.1 (bundled from the upstream PaperWM project)
- A companion GNOME extension for focused-monitor numbered workspaces
- A Zorin-only `Super+Space` menu extension
- An Android Emulator helper that can detach its side controls into a separate
  PaperWM window
- `zorin-desktop-profile`, which enables/disables conflicting extensions and
  shortcuts for each profile
- Touchégg gesture profiles
- **Enable PaperWM Tiling** and **Restore Normal Zorin** application launchers

Before changing gestures, the installer saves an existing Touchégg configuration
under `~/.local/share/zorin-desktop-profiles/user-backups/`. The Normal profile
restores that saved file.

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

To install Touchégg and the X11 utilities used by the Android Emulator helper
on Zorin, Ubuntu, or Debian, run:

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
the user's pre-install Touchégg file when one was found. Other GNOME settings use
an opinionated Zorin profile rather than a byte-for-byte desktop backup.

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

### Known second-monitor limitation

The current setup is most reliable with one monitor. When a second monitor is
connected—especially when it is hot-plugged after login—PaperWM and GNOME can
occasionally disagree about which workspace belongs to which monitor. A
workspace may appear on the wrong display, both displays may seem to move
together, or the focused-monitor numbering may become inconsistent until the
GNOME session or PaperWM is reloaded.

The companion extension improves direct numbered switching, but it does not
fully replace GNOME's underlying global workspace model. Treat independent,
Niri-style workspaces on multiple monitors as experimental for now. If
per-monitor separation is essential, test the setup with your exact monitor
layout before relying on it for daily work.

## Android Emulator side controls

The standalone Android Emulator exposes its narrow controls as a sticky,
always-on-top utility window attached to the phone. PaperWM normally excludes
that kind of window. After the emulator is open, launch **Tile Android Emulator
Controls** from the application menu or run:

```bash
~/.local/bin/paperwm-android-emulator-toolbar
```

The helper targets only a visible Android `Emulator` utility window no wider
than 100 pixels. It converts that toolbar to a normal window, removes its parent
relationship, and reloads PaperWM so the phone and controls can be selected and
reordered separately. Restarting the emulator restores Android's original
attached-toolbar behavior.

This is an X11-specific workaround tested with Android Emulator 36.6.11. It is
experimental because a future emulator release may change its Qt window
properties.

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
  ~/.local/bin/paperwm-android-emulator-toolbar \
  ~/.local/share/applications/zorin-profile-android-emulator.desktop \
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
