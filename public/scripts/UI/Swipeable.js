// scripts/ui/Swipeable.js

class Swipeable {
  constructor(element, options = {}) {
    this.element = $(element);
    this.options = {
      threshold: 50,
      direction: 'right',
      onComplete: null,
      ...options
    };
    
    this.startX = 0;
    this.isSwiping = false;
    this._boundEvents = this._getBoundEvents();
    this._init();
  }
  
  _getBoundEvents() {
    return {
      start: this._onStart.bind(this),
      move: this._onMove.bind(this),
      end: this._onEnd.bind(this)
    };
  }
  
  _init() {
    const el = this.element[0];
    const events = this._boundEvents;
    
    el.addEventListener('touchstart', events.start, { passive: false });
    el.addEventListener('touchmove', events.move, { passive: false });
    el.addEventListener('touchend', events.end);
    el.addEventListener('touchcancel', events.end);
    
    el.addEventListener('mousedown', events.start);
    window.addEventListener('mousemove', events.move);
    window.addEventListener('mouseup', events.end);
  }
  
  _isValidDirection(deltaX, deltaY) {
    if (Math.abs(deltaY) > Math.abs(deltaX)) return false;
    
    const dir = this.options.direction;
    if (dir === 'right') return deltaX > 0;
    if (dir === 'left') return deltaX < 0;
    if (dir === 'bottom') return deltaY > 0;
    if (dir === 'top') return deltaY < 0;
    return true;
  }
  
  _updateTransform(deltaX) {
    const max = this.element.parent().width() || window.innerWidth;
    const x = Math.max(-max, Math.min(max, deltaX));
    this.element.css('transform', `translateX(${x}px)`);
  }
  
  _resetTransform() {
    this.element.css('transform', '');
  }
  
  _onStart(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.startX = clientX;
    this.isSwiping = true;
    this.element.css('transition', '');
  }
  
  _onMove(e) {
    if (!this.isSwiping) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - this.startX;
    const deltaY = e.touches ? e.touches[0].clientY - (e.touches[0].clientY - this.startY) : 0;
    
    if (this._isValidDirection(deltaX, deltaY)) {
      e.preventDefault();
      this._updateTransform(deltaX);
    }
  }
  
  _onEnd(e) {
    if (!this.isSwiping) return;
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = clientX - this.startX;
    const completed = Math.abs(deltaX) >= this.options.threshold && 
                      this._isValidDirection(deltaX, 0);
    
    if (completed) {
      const max = this.element.parent().width() || window.innerWidth;
      const targetX = deltaX > 0 ? max : -max;
      this.element.css('transition', 'transform 0.2s ease-out');
      this.element.css('transform', `translateX(${targetX}px)`);
      
      setTimeout(() => {
        this._resetTransform();
        this.element.css('transition', '');
        if (this.options.onComplete) this.options.onComplete();
      }, 200);
    } else {
      this.element.css('transition', 'transform 0.2s ease-out');
      this._resetTransform();
      setTimeout(() => this.element.css('transition', ''), 200);
    }
    
    this.isSwiping = false;
    this.startX = 0;
  }
  
  reset() {
    this._resetTransform();
    this.isSwiping = false;
  }
  
  destroy() {
    const el = this.element[0];
    const events = this._boundEvents;
    
    el.removeEventListener('touchstart', events.start);
    el.removeEventListener('touchmove', events.move);
    el.removeEventListener('touchend', events.end);
    el.removeEventListener('touchcancel', events.end);
    
    el.removeEventListener('mousedown', events.start);
    window.removeEventListener('mousemove', events.move);
    window.removeEventListener('mouseup', events.end);
    
    this.reset();
  }
}

registerClass(Swipeable);