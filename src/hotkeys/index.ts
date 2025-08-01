import HotkeyManager from "./HotkeyManager";
import actions from "./actions";

export default function registerHotkeys(): void {
  const hotkeymgr = HotkeyManager.instance;

  hotkeymgr.bind("Backquote", actions.goToQueuesList);
}
