type Listener = () => void;

class DebugStore {
  private tools: string[] = [];
  private listeners: Listener[] = [];

  register(id: string) {
    if (!this.tools.includes(id)) {
      this.tools.push(id);
      this.notify();
    }
  }

  unregister(id: string) {
    this.tools = this.tools.filter((t) => t !== id);
    this.notify();
  }

  getIndex(id: string) {
    return this.tools.indexOf(id);
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const debugStore = new DebugStore();
