# Zorin desktop profiles

The stable desktop state from 2026-07-27 is preserved as the **Normal Zorin**
profile. A raw dconf database and monitor layout backup are stored under
`backups/2026-07-27-before-paperwm/` as an additional emergency copy.

## Switch profiles

- Open the Zorin menu and run **Enable PaperWM Tiling**.
- Open the Zorin menu and run **Restore Normal Zorin** to undo the tiling setup.
- From a terminal, run `zorin-desktop-profile tiling` or
  `zorin-desktop-profile normal`.

Both profiles preserve Super+Space, Super+Q, Super+Enter, and touchpad
right-click areas.

## PaperWM controls

- Three-finger left/right swipe: switch workspace on the focused monitor.
- Super+1 through Super+9: directly select a dynamic workspace on the focused monitor.
- Ctrl+Super+1 through Ctrl+Super+9: move the active window to that workspace and follow it.
- Super+Page Up / Super+Page Down: switch workspace on the focused monitor.
- Super+Numpad 9 / Super+Numpad 3 also work when Num Lock is off.
- Super+Left / Super+Right: focus the previous or next tiled window.
- Super+Ctrl+Left / Super+Ctrl+Right: move a tiled window.
- Super+Ctrl+T: toggle the active window between tiled and scratch/floating.
- Super+Shift+Left / Super+Shift+Right: focus the monitor to the left or right.
- Super+Ctrl+Shift+Left / Super+Ctrl+Shift+Right: move a window to another monitor.
