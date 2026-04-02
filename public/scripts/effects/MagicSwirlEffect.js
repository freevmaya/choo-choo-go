// scripts/effects/MagicSwirlEffect.js

class MagicSwirlEffect {
  constructor(game, track, options = {}) {
    this.game = game;
    this.track = track;
    this.options = {
      scale: 1.2,
      height: 0.3,
      duration: 2000,
      fadeOut: true,
      ...options
    };
    
    this.plane = null;
    this.animatedTexture = null;
    this.startTime = 0;
    this.isActive = false;
    this.fadeMaterial = null;
    
    this.init();
  }
  
  init() {
    // Создаем анимированную текстуру
    this.animatedTexture = new AnimatedTexture({
      width: 512,
      height: 512,
      frameCount: 24,
      fps: 30,
      colors: this.options.colors || ['#FFD700', '#FFA500', '#FF6B6B', '#FFE55C'],
      swirlIntensity: 0.9
    });
    
    // Создаем материал с текстурой
    this.fadeMaterial = new THREE.MeshStandardMaterial({
      map: this.animatedTexture.getTexture(),
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      emissive: 0xFFAA44,
      emissiveIntensity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    // Создаем плоскость для эффекта
    const cellSize = GAME_SETTINGS.CELL_SIZE;
    const size = cellSize * this.options.scale;
    
    const geometry = new THREE.PlaneGeometry(size, size);
    this.plane = new THREE.Mesh(geometry, this.fadeMaterial);
    this.plane.rotation.x = -Math.PI / 2; // Горизонтально
    
    // Позиционируем над треком
    this.updatePosition();
    
    // Регистрируем геометрию и материал для очистки
    if (this.plane.geometry) this.plane.userData._geometry = this.plane.geometry;
    if (this.plane.material) this.plane.userData._material = this.plane.material;
  }
  
  updatePosition() {
    if (!this.plane || !this.track) return;
    
    const pos = this.track.getPosition();
    this.plane.position.set(pos.x, pos.y + this.options.height, pos.z);
  }
  
  play() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.startTime = performance.now();
    
    // Добавляем в сцену
    if (this.game && this.game.scene) {
      this.game.scene.add(this.plane);
    }
    
    // Запускаем анимацию текстуры
    this.animatedTexture.play();
    
    // Запускаем анимацию затухания
    this.animateFade();
  }
  
  animateFade() {
    if (!this.options.fadeOut) return;
    
    const updateFade = (now) => {
      if (!this.isActive) return;
      
      const elapsed = now - this.startTime;
      const progress = Math.min(1, elapsed / this.options.duration);
      
      if (progress >= 1) {
        this.stop();
        return;
      }
      
      // Затухание и уменьшение
      const opacity = 1 - progress;
      const scale = 1 + progress * 0.5; // Немного увеличивается при затухании
      
      if (this.fadeMaterial) {
        this.fadeMaterial.opacity = opacity;
        this.fadeMaterial.emissiveIntensity = 0.5 * (1 - progress);
      }
      
      if (this.plane) {
        const baseScale = GAME_SETTINGS.CELL_SIZE * this.options.scale;
        this.plane.scale.setScalar(scale);
      }
      
      this.animationFrameId = requestAnimationFrame(updateFade);
    };
    
    this.animationFrameId = requestAnimationFrame(updateFade);
  }
  
  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Удаляем из сцены
    if (this.game && this.game.scene && this.plane) {
      this.game.scene.remove(this.plane);
    }
    
    this.animatedTexture.stop();
  }
  
  dispose() {
    this.stop();
    
    if (this.plane) {
      if (this.plane.geometry) this.plane.geometry.dispose();
      if (this.plane.material) this.plane.material.dispose();
      this.plane = null;
    }
    
    if (this.animatedTexture) {
      this.animatedTexture.dispose();
      this.animatedTexture = null;
    }
    
    this.fadeMaterial = null;
  }
}