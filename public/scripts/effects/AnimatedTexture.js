// scripts/effects/AnimatedTexture.js

class AnimatedTexture {
  constructor(options = {}) {
    this.options = {
      width: 512,
      height: 512,
      frameCount: 24,
      fps: 24,
      colors: ['#FFD700', '#FFA500', '#FF6B6B', '#FFE55C'],
      particleCount: 50,
      swirlIntensity: 0.8,
      loop: true,
      ...options
    };
    
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.ctx = this.canvas.getContext('2d');
    
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(1, 1);
    
    this.currentFrame = 0;
    this.animationId = null;
    this.isPlaying = false;
    this.frames = [];
    
    this.init();
  }
  
  init() {
    this.generateFrames();
  }
  
  generateFrames() {
    for (let frame = 0; frame < this.options.frameCount; frame++) {
      const t = frame / this.options.frameCount; // 0..1 прогресс анимации
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Центр вихря
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const maxRadius = this.canvas.width / 2.5;
      
      // Рисуем вихревые линии
      this.drawSwirl(centerX, centerY, maxRadius, t);
      
      // Рисуем искры
      this.drawSparks(centerX, centerY, maxRadius, t);
      
      // Рисуем свечение
      this.drawGlow(centerX, centerY, maxRadius, t);
      
      this.frames.push(this.canvas.toDataURL());
    }
  }
  
  drawSwirl(cx, cy, maxRadius, t) {
    const swirlCount = 4;
    const angleOffset = t * Math.PI * 2;
    
    for (let s = 0; s < swirlCount; s++) {
      const swirlAngle = (s / swirlCount) * Math.PI * 2;
      const gradient = this.ctx.createLinearGradient(cx, cy, cx + maxRadius, cy);
      
      const colorIndex = s % this.options.colors.length;
      const baseColor = this.options.colors[colorIndex];
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.3, this.options.colors[(colorIndex + 1) % this.options.colors.length]);
      gradient.addColorStop(0.7, this.options.colors[(colorIndex + 2) % this.options.colors.length]);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      this.ctx.beginPath();
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 8 + Math.sin(t * Math.PI * 2) * 3;
      
      // Спираль
      const points = [];
      for (let r = 0; r <= maxRadius; r += maxRadius / 30) {
        const angle = (r / maxRadius) * Math.PI * 2 * this.options.swirlIntensity * 3 + 
                      swirlAngle + angleOffset * 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * 0.8; // Эллиптическая форма
        points.push({ x, y });
      }
      
      for (let i = 0; i < points.length - 1; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(points[i].x, points[i].y);
        this.ctx.lineTo(points[i + 1].x, points[i + 1].y);
        this.ctx.stroke();
      }
    }
  }
  
  drawSparks(cx, cy, maxRadius, t) {
    const sparkCount = this.options.particleCount;
    const baseAngle = t * Math.PI * 4;
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = baseAngle + (i / sparkCount) * Math.PI * 2;
      const radius = maxRadius * (0.3 + Math.sin(t * Math.PI * 4 + i) * 0.2);
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius * 0.8;
      
      const size = 3 + Math.sin(t * Math.PI * 8 + i) * 2;
      const alpha = 0.7 + Math.sin(t * Math.PI * 12 + i) * 0.3;
      
      const color = this.options.colors[i % this.options.colors.length];
      this.ctx.fillStyle = color;
      this.ctx.shadowBlur = size * 2;
      this.ctx.shadowColor = color;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0;
  }
  
  drawGlow(cx, cy, maxRadius, t) {
    const pulse = 0.5 + Math.sin(t * Math.PI * 6) * 0.3;
    const gradient = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
    
    gradient.addColorStop(0, `rgba(255, 215, 0, ${0.6 * pulse})`);
    gradient.addColorStop(0.3, `rgba(255, 165, 0, ${0.4 * pulse})`);
    gradient.addColorStop(0.6, `rgba(255, 100, 100, ${0.2 * pulse})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentFrame = 0;
    
    const frameDelay = 1000 / this.options.fps;
    const startTime = performance.now();
    
    const animate = (now) => {
      if (!this.isPlaying) return;
      
      const elapsed = now - startTime;
      this.currentFrame = Math.floor(elapsed / frameDelay) % this.options.frameCount;
      
      this.updateTexture();
      
      if (this.options.loop || this.currentFrame < this.options.frameCount - 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.stop();
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }
  
  stop() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.currentFrame = 0;
    this.clear();
  }
  
  updateTexture() {
    if (this.frames[this.currentFrame]) {
      const img = new Image();
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
        this.texture.needsUpdate = true;
      };
      img.src = this.frames[this.currentFrame];
    }
  }
  
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture.needsUpdate = true;
  }
  
  getTexture() {
    return this.texture;
  }
  
  dispose() {
    this.stop();
    if (this.texture) {
      this.texture.dispose();
    }
  }
}