import HotkeyManager from "./HotkeyManager";
import actions from "./actions";

export default function registerHotkeys(): void {
  const hotkeymgr = HotkeyManager.instance;

  hotkeymgr.bind("Backquote", actions.goToQueuesList);
  for(let i = 0; i < 10; i++) {
    hotkeymgr.bind(`Digit${i}`, (e: KeyboardEvent) => actions.goToQueue(e, i - 1 < 0 ? 9 : i - 1));
  }

  hotkeymgr.bind("KeyT", actions.switchInfo);
}
