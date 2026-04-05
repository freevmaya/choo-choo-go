// scripts/controls/RGBColorControl.js

class RGBColorControl {
  constructor(options = {}) {
    this.container = options.container || $('body');
    this.position = options.position || { top: 80, right: 10 };
    this.initialColor = options.initialColor || { r: 255, g: 100, b: 100 };
    
    this.r = this.initialColor.r;
    this.g = this.initialColor.g;
    this.b = this.initialColor.b;
    
    this.panel = null;
    this.createPanel();
  }
  
  createPanel() {
    this.panel = $(`
      <div class="rgb-control" style="
        position: fixed;
        top: ${this.position.top}px;
        right: ${this.position.right}px;
        background: rgba(0,0,0,0.75);
        backdrop-filter: blur(8px);
        padding: 12px 16px;
        border-radius: 12px;
        z-index: 10000;
        font-family: monospace;
        font-size: 12px;
        color: white;
        border: 1px solid rgba(255,255,255,0.2);
        min-width: 180px;
      ">
        <div style="margin-bottom: 8px; font-weight: bold; font-size: 14px;">🎨 RGB Color</div>
        <div class="rgb-slider-row" style="margin-bottom: 8px;">
          <span style="display: inline-block; width: 30px; color: #ff6666;">R</span>
          <input type="range" class="rgb-slider r-slider" min="0" max="255" step="1" value="${this.r}" style="width: 100px;">
          <span class="r-value" style="display: inline-block; width: 35px; text-align: right;">${this.r}</span>
        </div>
        <div class="rgb-slider-row" style="margin-bottom: 8px;">
          <span style="display: inline-block; width: 30px; color: #66ff66;">G</span>
          <input type="range" class="rgb-slider g-slider" min="0" max="255" step="1" value="${this.g}" style="width: 100px;">
          <span class="g-value" style="display: inline-block; width: 35px; text-align: right;">${this.g}</span>
        </div>
        <div class="rgb-slider-row" style="margin-bottom: 8px;">
          <span style="display: inline-block; width: 30px; color: #6666ff;">B</span>
          <input type="range" class="rgb-slider b-slider" min="0" max="255" step="1" value="${this.b}" style="width: 100px;">
          <span class="b-value" style="display: inline-block; width: 35px; text-align: right;">${this.b}</span>
        </div>
        <div class="rgb-preview" style="
          width: 100%;
          height: 30px;
          margin-top: 10px;
          border-radius: 6px;
          background: rgb(${this.r}, ${this.g}, ${this.b});
          border: 1px solid rgba(255,255,255,0.3);
        "></div>
        <div class="rgb-hex" style="
          text-align: center;
          margin-top: 6px;
          font-size: 11px;
          color: #aaa;
        ">#${this.getHex()}</div>
      </div>
    `);
    
    this.container.append(this.panel);
    this.bindEvents();
  }
  
  bindEvents() {
    this.panel.find('.r-slider').on('input', (e) => {
      this.r = parseInt(e.target.value);
      this.panel.find('.r-value').text(this.r);
      this.updatePreview();
    });
    
    this.panel.find('.g-slider').on('input', (e) => {
      this.g = parseInt(e.target.value);
      this.panel.find('.g-value').text(this.g);
      this.updatePreview();
    });
    
    this.panel.find('.b-slider').on('input', (e) => {
      this.b = parseInt(e.target.value);
      this.panel.find('.b-value').text(this.b);
      this.updatePreview();
    });
  }
  
  updatePreview() {
    const color = `rgb(${this.r}, ${this.g}, ${this.b})`;
    this.panel.find('.rgb-preview').css('background', color);
    this.panel.find('.rgb-hex').text('#' + this.getHex());
    
    // Генерируем событие с цветом
    eventBus.emit('rgb-color-change', {
      r: this.r,
      g: this.g,
      b: this.b,
      hex: '#' + this.getHex(),
      rgb: `rgb(${this.r}, ${this.g}, ${this.b})`,
      color: new THREE.Color(`rgb(${this.r}, ${this.g}, ${this.b})`)
    });
  }
  
  getHex() {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return toHex(this.r) + toHex(this.g) + toHex(this.b);
  }
  
  setColor(r, g, b) {
    this.r = Math.max(0, Math.min(255, r));
    this.g = Math.max(0, Math.min(255, g));
    this.b = Math.max(0, Math.min(255, b));
    
    this.panel.find('.r-slider').val(this.r);
    this.panel.find('.g-slider').val(this.g);
    this.panel.find('.b-slider').val(this.b);
    this.panel.find('.r-value').text(this.r);
    this.panel.find('.g-value').text(this.g);
    this.panel.find('.b-value').text(this.b);
    
    this.updatePreview();
  }
  
  setColorHex(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      this.setColor(
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      );
    }
  }
  
  setColorThree(color) {
    if (color instanceof THREE.Color) {
      this.setColor(
        Math.round(color.r * 255),
        Math.round(color.g * 255),
        Math.round(color.b * 255)
      );
    }
  }
  
  getColor() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      hex: '#' + this.getHex(),
      rgb: `rgb(${this.r}, ${this.g}, ${this.b})`
    };
  }
  
  hide() {
    this.panel.hide();
  }
  
  show() {
    this.panel.show();
  }
  
  destroy() {
    this.panel.remove();
  }
}