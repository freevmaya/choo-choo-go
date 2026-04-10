// scripts/utils/EventEmitter.js


class EventEmitter {
  constructor() {
    this.events = {};
    this.broadcast = [];
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event, data) {
    if (this.events[event])
      this.events[event].forEach(listener => listener(data));
    this.broadcast.forEach(b=>b(event, data));
  }

  onBroadcast(listener) {
    this.broadcast.push(listener);
  }

  offBroadcast(listener) {
    let idx = this.broadcast.indexOf(listener);
    if (idx > -1)
      this.broadcast.splice(idx, 1);
  }
}

// Глобальный экземпляр шины событий
const eventBus = new EventEmitter();