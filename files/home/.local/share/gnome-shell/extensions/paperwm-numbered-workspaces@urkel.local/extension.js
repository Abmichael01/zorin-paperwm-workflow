import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import GLib from 'gi://GLib';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// install.sh replaces this token with the installing user's absolute home path.
import * as Tiling from 'file://@HOME@/.local/share/gnome-shell/extensions/paperwm@paperwm.github.com/tiling.js';

const PAPERWM_UUID = 'paperwm@paperwm.github.com';
const KEY_COUNT = 9;

export default class PaperWMNumberedWorkspacesExtension extends Extension {
    enable() {
        this._settings = this.getSettings();

        for (let number = 1; number <= KEY_COUNT; number++) {
            Main.wm.addKeybinding(
                `workspace-${number}`,
                this._settings,
                Meta.KeyBindingFlags.NONE,
                Shell.ActionMode.NORMAL,
                () => this._activateWorkspace(number - 1)
            );
            Main.wm.addKeybinding(
                `paperwm-move-to-workspace-${number}`,
                this._settings,
                Meta.KeyBindingFlags.PER_WINDOW,
                Shell.ActionMode.NORMAL,
                () => this._moveWindowToWorkspace(number - 1)
            );
        }
    }

    disable() {
        for (let number = 1; number <= KEY_COUNT; number++) {
            Main.wm.removeKeybinding(`workspace-${number}`);
            Main.wm.removeKeybinding(`paperwm-move-to-workspace-${number}`);
        }

        this._settings = null;
    }

    _activateWorkspace(index) {
        const context = this._workspaceContext(index);

        if (!context || context.target === context.currentSpace)
            return;

        const {spaces, target} = context;
        this._activateTarget(spaces, target, target.selectedWindow);
    }

    _moveWindowToWorkspace(index) {
        const context = this._workspaceContext(index);

        if (!context || context.target === context.currentSpace || !context.focusedWindow)
            return;

        const {spaces, currentSpace, target, focusedWindow} = context;

        if (currentSpace.indexOf(focusedWindow) !== -1)
            currentSpace.removeWindow(focusedWindow);

        focusedWindow.change_workspace(target.workspace);
        this._activateTarget(spaces, target, focusedWindow);
    }

    _activateTarget(spaces, target, focusedWindow) {
        spaces.space_defaultAnimation = false;
        spaces.space_paperwmAnimation = true;

        if (focusedWindow)
            target.workspace.activate_with_focus(focusedWindow, global.get_current_time());
        else
            target.workspace.activate(global.get_current_time());

        // GNOME emits switch-workspace asynchronously. Keep PaperWM's animation
        // flag alive until the signal has been handled, then restore defaults.
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
            spaces.space_defaultAnimation = true;
            spaces.space_paperwmAnimation = false;
            return GLib.SOURCE_REMOVE;
        });
    }

    _workspaceContext(index) {
        const paperwm = Main.extensionManager.lookup(PAPERWM_UUID);
        const spaces = Tiling.spaces;

        if (!paperwm?.stateObj || !spaces)
            return null;

        const focusedWindow = global.display.focus_window;
        const monitorIndex = focusedWindow?.get_monitor();
        const monitor = Number.isInteger(monitorIndex)
            ? Main.layoutManager.monitors[monitorIndex]
            : spaces.activeSpace?.monitor;
        const currentSpace = spaces.monitors.get(monitor) ?? spaces.activeSpace;

        if (!currentSpace)
            return null;

        const monitorSpaces = spaces._getOrderedSpaces(currentSpace.monitor);
        const target = monitorSpaces[index];

        if (!target)
            return null;

        return {spaces, currentSpace, target, focusedWindow};
    }
}
