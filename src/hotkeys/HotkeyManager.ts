type Trigger = string | string[];
type Action = (e: KeyboardEvent) => void;

interface Binding {
  action: Action;
  allowInInput: boolean;
}

export default class HotkeyManager {
  private static _instance: HotkeyManager | null = null;
  private bindings: Map<string, Binding[]> = new Map<string, Binding[]>();
  private sequence: string[] = [];
  private sequenceTimeoutId: number | null = null;
  private sequenceTimeoutMs: number = 1000;
  private activeModifiers: Set<string> = new Set();

  static get instance(): HotkeyManager {
    if (!this._instance) {
      this._instance = new HotkeyManager();
    }
    return this._instance;
  }

  private constructor() {
    document.addEventListener("keydown", this.handleKeydown.bind(this));
    document.addEventListener("keyup", this.handleKeyup.bind(this));
  }

  public setSequenceTimeout(ms: number): void {
    this.sequenceTimeoutMs = ms;
  }

  public bind(trigger: Trigger, action: Action, options: { allowInInput?: boolean } = {}): void {
    const triggerKey = this.parseTriggerKey(trigger);
    const binding: Binding = { action, allowInInput: options.allowInInput ?? false };
    if (this.bindings.has(triggerKey)) {
      const bindings = this.bindings.get(triggerKey) || [];
      bindings.push(binding);
      this.bindings.set(triggerKey, bindings);
    } else {
      this.bindings.set(triggerKey, [binding]);
    }
  }

  public unbind(trigger: Trigger, action: Action): void {
    const triggerKey = this.parseTriggerKey(trigger);
    if (!this.bindings.has(triggerKey)) {
      return;
    }
    const bindings = this.bindings.get(triggerKey);
    if (!bindings) {
      return;
    }

    const i = bindings.findIndex((b) => b.action === action);
    if (i !== -1) {
      bindings.splice(i, 1);
    }

    if (bindings.length === 0) {
      this.bindings.delete(triggerKey);
    }
  }

  private parseTriggerKey(trigger: Trigger): string {
    if (typeof trigger === "string") {
      return trigger;
    }

    return trigger.join(">");
  }

  private handleKeydown(e: KeyboardEvent): void {
    const key = e.code;
    if (
      ["ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "AltLeft", "AltRight"]
      .includes(key)
    ) {
      this.activeModifiers.add(key);
      return;
    }

    let currentKey = "";
    if (this.activeModifiers.size > 0) {
      const modifiers = Array.from(this.activeModifiers).sort();
      currentKey = [...modifiers, key].join("+");
    } else {
      currentKey = key;
    }

    this.sequence.push(currentKey);

    if (this.sequenceTimeoutId) {
      clearTimeout(this.sequenceTimeoutId);
    }

    this.sequenceTimeoutId = window.setTimeout(() => {
      this.sequence = [];
      this.sequenceTimeoutId = null;
    }, this.sequenceTimeoutMs);

    const sequenceKey = this.sequence.join(">");
    const bindings = 
      this.bindings.get(sequenceKey) || this.bindings.get(currentKey);

    if (bindings) {
      const isInputElement =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement;

      bindings.forEach((binding) => {
        if (!isInputElement || binding.allowInInput) {
          binding.action(e);
        }
      });
      this.sequence = [];
      this.sequenceTimeoutId = null;
    }
  }

  private handleKeyup(e: KeyboardEvent): void {
    const key = e.code;
    this.activeModifiers.delete(key);
  }
}
