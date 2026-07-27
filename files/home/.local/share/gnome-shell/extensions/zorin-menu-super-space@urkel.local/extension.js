import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const KEYBINDING = 'toggle-zorin-menu';
const ZORIN_MENU_UUID = 'zorin-menu@zorinos.com';

export default class ZorinMenuSuperSpaceExtension extends Extension {
    enable() {
        this._settings = this.getSettings();

        Main.wm.addKeybinding(
            KEYBINDING,
            this._settings,
            Meta.KeyBindingFlags.NONE,
            Shell.ActionMode.NORMAL |
                Shell.ActionMode.OVERVIEW |
                Shell.ActionMode.POPUP,
            () => {
                const zorinMenu = Main.extensionManager.lookup(ZORIN_MENU_UUID);
                zorinMenu?.stateObj?._toggleMenu();
            }
        );
    }

    disable() {
        Main.wm.removeKeybinding(KEYBINDING);
        this._settings = null;
    }
}
