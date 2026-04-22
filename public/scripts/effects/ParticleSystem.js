// scripts/effects/ParticleSystem.js

// scripts/effects/ParticleSystem.js

class ParticleSystem {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.particles = [];
    this.emissionTime = 0;
    this.emissionTimer = 0;
    this.emittedCount = 0;
    this.options = { ...this.defaultOptions(), ...options};
    
    // Убеждаемся, что скорость имеет значения
    if (this.options.speedMin === undefined) this.options.speedMin = 1;
    if (this.options.speedMax === undefined) this.options.speedMax = 3;
    
    this.init();
  }

  defaultOptions() {
    return {
      // Общие настройки
      particleType: 'sprite',
      particleCount: 50,
      lifetime: 1.5,
      fade: true,
      
      // Настройки эмиссии
      emissionRate: 0,
      emissionDuration: 0,
      burstCount: 0,
      
      // Физика
      gravity: 0,
      airResistance: 0.98,
      drag: 0,
      
      speedMin: 1.0,
      speedMax: 3.0,
      emitDirection: new THREE.Vector3(0, 1, 0),
      emitConeAngle: Math.PI / 2,
      
      // Визуальные настройки
      colorStart: 0xffaa44,
      colorEnd: 0xff4400,
      shapeColor: 0xFFFFFF,
      sizeStart: 0.3,
      sizeEnd: 0.05,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      
      // Спрайт-специфичные
      spriteTexture: null,
      spriteAtlas: null,
      
      // Текст-специфичные
      textValue: null,           // Текст для отображения (строка или функция)
      textFont: "Bold 60px Arial", // Шрифт
      textColor: "#FFFFFF",      // Цвет текста
      textStrokeColor: null,     // Цвет обводки
      textStrokeWidth: 0,        // Ширина обводки
      textBackgroundColor: null, // Цвет фона
      textPadding: 10,           // Отступ вокруг текста
      
      // 3D объект-специфичные
      geometryRadius: 0.15,
      geometrySegments: 8,
      
      // Эффекты
      rotationSpeed: 0,
      twinkleSpeed: 0,
      
      // Позиционирование
      position: new THREE.Vector3(0, 0, 0),
      spreadRadius: 0.5,
      
      // Отображение поверх всех объектов
      forceTopLayer: true,
      
      // Колбэки
      onParticleUpdate: null,
      onParticleComplete: null,
      onEmissionComplete: null
    }
  }
  
  init() {
    this.createParticlePool();
  }
  
  createParticlePool() {
    for (let i = 0; i < this.options.particleCount; i++) {
      const particle = this.createParticle();
      particle.visible = false;
      this.particles.push(particle);
    }
  }
  
  createParticle() {
    let particle;
    
    switch (this.options.particleType) {
      case 'sprite':
        particle = this.createSpriteParticle();
        break;
      case 'star':
        particle = this.createStarParticle();
        break;
      case 'sphere':
        particle = this.createSphereParticle();
        break;
      case 'cube':
        particle = this.createCubeParticle();
        break;
      case 'text':
        particle = this.createTextParticle();
        break;
      default:
        particle = this.createSpriteParticle();
    }
    
    this.scene.add(particle);
    
    // Обработка rotationSpeed как массива
    let rotationSpeed = this.options.rotationSpeed;
    if (Array.isArray(rotationSpeed)) {
      rotationSpeed = rotationSpeed[0] + Math.random() * (rotationSpeed[1] - rotationSpeed[0]);
    }
    
    particle.userData = {
      active: false,
      life: 0,
      maxLife: this.options.lifetime,
      velocity: new THREE.Vector3(),
      positionOffset: new THREE.Vector3(),
      startColor: new THREE.Color(this.options.colorStart),
      endColor: new THREE.Color(this.options.colorEnd),
      startSize: this.options.sizeStart,
      endSize: this.options.sizeEnd,
      rotationSpeed: rotationSpeed,
      twinkleSpeed: this.options.twinkleSpeed,
      initialPosition: null,
      // Для текстовых частиц
      textValue: this.options.textValue,
      textCanvas: null,
      textTexture: null
    };
    
    return particle;
  }

  getShapeColor(idx=0) {
    if (typeof this.options.shapeColor == 'function')
      return this.options.shapeColor(idx);
    return new THREE.Color(this.options.shapeColor);
  }

  /**
   * Создает текстовую частицу (3D текст на плоскости)
   */
  createTextParticle() {
    // Создаем временный canvas для текста
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Получаем текст
    let text = this.options.textValue;
    if (typeof text === 'function') {
      text = text();
    }
    text = text !== null && text !== undefined ? String(text) : '';
    
    // Настройки шрифта
    ctx.font = this.options.textFont;
    
    // Измеряем текст для определения размера canvas
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(this.options.textFont.match(/\d+/)?.[0] || 60);
    
    // Устанавливаем размер canvas с отступами
    const padding = this.options.textPadding;
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;
    
    // Обновляем контекст с новыми размерами
    ctx.font = this.options.textFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Рисуем фон если указан
    if (this.options.textBackgroundColor) {
      ctx.fillStyle = this.options.textBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Скругленные углы для фона
      const radius = 10;
      ctx.fillStyle = this.options.textBackgroundColor;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();
    }
    
    // Рисуем обводку если указана
    if (this.options.textStrokeColor && this.options.textStrokeWidth > 0) {
      ctx.strokeStyle = this.options.textStrokeColor;
      ctx.lineWidth = this.options.textStrokeWidth;
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    }
    
    // Рисуем текст
    ctx.fillStyle = this.options.textColor;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Создаем текстуру
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    
    // Создаем спрайт с текстурой
    const material = new THREE.SpriteMaterial({
      map: texture,
      blending: this.options.blending,
      transparent: true,
      depthTest: !this.options.forceTopLayer,
      depthWrite: !this.options.forceTopLayer
    });
    
    const sprite = new THREE.Sprite(material);
    
    // Масштабируем спрайт пропорционально размеру canvas
    const aspectRatio = canvas.width / canvas.height;
    const baseSize = this.options.sizeStart;
    sprite.scale.set(baseSize * aspectRatio, baseSize, 1);
    
    if (this.options.forceTopLayer) {
      sprite.renderOrder = 999;
    }
    
    // Сохраняем canvas и текстуру для обновления
    sprite.userData.textCanvas = canvas;
    sprite.userData.textTexture = texture;
    
    return sprite;
  }
  
  /**
   * Обновляет текст существующей текстовой частицы
   * @param {THREE.Sprite} particle - частица
   * @param {string} newText - новый текст
   */
  updateTextParticle(particle, newText) {
    if (!particle.material || !particle.material.map) return;
    
    const canvas = particle.userData.textCanvas;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Настройки шрифта
    ctx.font = this.options.textFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Рисуем фон если указан
    if (this.options.textBackgroundColor) {
      ctx.fillStyle = this.options.textBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Скругленные углы
      const radius = 10;
      ctx.fillStyle = this.options.textBackgroundColor;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();
    }
    
    // Рисуем обводку
    if (this.options.textStrokeColor && this.options.textStrokeWidth > 0) {
      ctx.strokeStyle = this.options.textStrokeColor;
      ctx.lineWidth = this.options.textStrokeWidth;
      ctx.strokeText(newText, canvas.width / 2, canvas.height / 2);
    }
    
    // Рисуем текст
    ctx.fillStyle = this.options.textColor;
    ctx.fillText(newText, canvas.width / 2, canvas.height / 2);
    
    // Обновляем текстуру
    particle.material.map.needsUpdate = true;
    particle.userData.textValue = newText;
  }

  /**
   * Создает частицу в виде звезды (спрайт)
   */
  createStarParticle() {
    let material;
    
    if (this.options.spriteTexture) {
      material = new THREE.SpriteMaterial({
        map: this.options.spriteTexture,
        color: 0xffffff,
        blending: this.options.blending,
        transparent: true,
        depthTest: !this.options.forceTopLayer,
        depthWrite: !this.options.forceTopLayer
      });
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, 128, 128);
      
      const centerX = 64;
      const centerY = 64;
      const outerRadius = 56;
      const innerRadius = 24;
      const points = this.options.points || 5;
      
      const color = this.getShapeColor();
      
      ctx.beginPath();
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      
      // Заливка одним монотонным цветом
      ctx.fillStyle = '#' + color.getHexString();
      ctx.fill();
      
      const texture = new THREE.CanvasTexture(canvas);
      material = new THREE.SpriteMaterial({
        map: texture,
        blending: this.options.blending,
        transparent: true,
        opacity: 1,
        depthTest: !this.options.forceTopLayer,
        depthWrite: !this.options.forceTopLayer
      });
    }
    
    const sprite = new THREE.Sprite(material);
    if (this.options.forceTopLayer) {
      sprite.renderOrder = 999;
    }
    return sprite;
  }
  
  createSpriteParticle() {
    let material;
    
    if (this.options.spriteTexture) {
      material = new THREE.SpriteMaterial({
        map: this.options.spriteTexture,
        color: 0xffffff,
        blending: this.options.blending,
        transparent: true,
        depthTest: !this.options.forceTopLayer,
        depthWrite: !this.options.forceTopLayer
      });
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      let color = this.getShapeColor();
      
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.8)');
      gradient.addColorStop(0.6, 'rgba(255, 100, 50, 0.4)');
      gradient.addColorStop(1, `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      material = new THREE.SpriteMaterial({
        map: texture,
        blending: this.options.blending,
        transparent: true,
        depthTest: !this.options.forceTopLayer,
        depthWrite: !this.options.forceTopLayer
      });
    }
    
    const sprite = new THREE.Sprite(material);
    if (this.options.forceTopLayer) {
      sprite.renderOrder = 999;
    }
    return sprite;
  }
  
  createSphereParticle() {
    const geometry = new THREE.SphereGeometry(
      this.options.geometryRadius,
      this.options.geometrySegments,
      this.options.geometrySegments
    );
    
    const material = new THREE.MeshStandardMaterial({
      color: this.options.colorStart,
      emissive: this.options.colorStart,
      emissiveIntensity: 1,
      roughness: 0.0,
      metalness: 0.0,
      transparent: true,
      depthTest: !this.options.forceTopLayer,
      depthWrite: !this.options.forceTopLayer
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = false;
    sphere.receiveShadow = false;
    if (this.options.forceTopLayer) {
      sphere.renderOrder = 999;
    }
    
    return sphere;
  }
  
  createCubeParticle() {
    const geometry = new THREE.BoxGeometry(
      this.options.geometryRadius * 1.5,
      this.options.geometryRadius * 1.5,
      this.options.geometryRadius * 1.5
    );
    
    const material = new THREE.MeshStandardMaterial({
      color: this.options.colorStart,
      emissive: this.options.colorStart,
      emissiveIntensity: 0.5,
      transparent: true,
      depthTest: !this.options.forceTopLayer,
      depthWrite: !this.options.forceTopLayer
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = false;
    cube.receiveShadow = false;
    if (this.options.forceTopLayer) {
      cube.renderOrder = 999;
    }
    
    return cube;
  }
  
  getRandomVelocity() {
      const direction = this.options.emitDirection.clone().normalize();

      if (this.options.emitConeAngle <= 0 || direction.length() === 0) {
          const speed = this.options.speedMin + Math.random() * (this.options.speedMax - this.options.speedMin);
          return direction.clone().multiplyScalar(speed);
      }

      const theta = Math.random() * Math.PI * 2; // Азимутальный угол (0-360°)
      const phi = Math.acos(1 - Math.random() * (1 - Math.cos(this.options.emitConeAngle))); // Полярный угол (0-coneAngle)
      
      const localDir = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),  // X
          Math.sin(phi) * Math.sin(theta),  // Y
          Math.cos(phi)                      // Z (ось направления)
      );

      const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          direction
      );
      
      const randomDir = localDir.applyQuaternion(quaternion);
      
      // Случайная скорость в заданном диапазоне
      const speed = this.options.speedMin + Math.random() * (this.options.speedMax - this.options.speedMin);
      
      return randomDir.multiplyScalar(speed);
  }
  
  /**
   * Получает случайную позицию в сфере разброса
   */
  getRandomSpreadPosition(center) {
    if (this.options.spreadRadius <= 0) return center.clone();
    
    // Случайная точка внутри сферы
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = this.options.spreadRadius * Math.cbrt(Math.random());
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    return new THREE.Vector3(center.x + x, center.y + y, center.z + z);
  }

  emitParticle(position = null, velocity = null, customData = {}) {
    const inactiveParticle = this.particles.find(p => !p.userData.active);
    if (!inactiveParticle) return null;
    
    const pos = position || this.options.position;
    const finalPos = this.getRandomSpreadPosition(pos);
    
    let vel = velocity;
    if (!vel) {
      vel = this.getRandomVelocity();
    }
    
    // Проверяем, что скорость не нулевая
    if (vel.length() < 0.01) {
      vel = new THREE.Vector3(0, 1, 0).multiplyScalar(this.options.speedMin);
    }
    
    // Обработка rotationSpeed как массива для каждой новой частицы
    let rotationSpeed = this.options.rotationSpeed;
    if (Array.isArray(rotationSpeed)) {
      rotationSpeed = rotationSpeed[0] + Math.random() * (rotationSpeed[1] - rotationSpeed[0]);
    }
    
    inactiveParticle.userData.active = true;
    inactiveParticle.userData.life = 0;
    inactiveParticle.userData.maxLife = this.options.lifetime;
    inactiveParticle.userData.velocity.copy(vel);
    inactiveParticle.userData.initialPosition = finalPos.clone();
    inactiveParticle.userData.rotationSpeed = rotationSpeed;
    
    Object.assign(inactiveParticle.userData, customData);
    inactiveParticle.position.copy(finalPos);
    
    // Для текстовых частиц - обновляем текст если он динамический
    if (this.options.particleType === 'text' && inactiveParticle.userData.textValue) {
      let textValue = inactiveParticle.userData.textValue;
      if (typeof textValue === 'function') {
        textValue = textValue();
      }
      if (textValue !== undefined && textValue !== null) {
        this.updateTextParticle(inactiveParticle, String(textValue));
      }
    }
    
    this.updateParticleVisuals(inactiveParticle, 0);
    inactiveParticle.visible = true;
    
    return inactiveParticle;
  }

  emit(count = 1, position = null, velocity = null) {
    const emitted = [];
    for (let i = 0; i < count; i++) {
      const particle = this.emitParticle(position, velocity);
      if (particle) emitted.push(particle);
    }
    return emitted;
  }

  burst(count = null, position = null) {
    const burstCount = count !== null ? count : this.options.particleCount;
    const pos = position || this.options.position;
    
    console.log(`Burst: emitting ${burstCount} particles, speed range: ${this.options.speedMin}-${this.options.speedMax}`);
    
    for (let i = 0; i < burstCount; i++) {
      const velocity = this.getRandomVelocity();
      this.emitParticle(pos, velocity);
    }
  }

  updateParticleVisuals(particle, progress) {
    const data = particle.userData;
    const color = data.startColor.clone().lerp(data.endColor, progress);
    const size = data.startSize * (1 - progress) + data.endSize * progress;
    
    let opacity = this.options.opacity;

    if (typeof this.options.fade == 'function')
      opacity = this.options.fade(progress) * this.options.opacity;
    else if (this.options.fade) {
      opacity = (1 - progress) * this.options.opacity;
    } else opacity = progress * this.options.opacity;
    
    switch (this.options.particleType) {
      case 'sprite':
      case 'star':
        particle.material.color.set(color);
        particle.scale.set(size, size, 1);
        particle.material.opacity = opacity;
        break;
        
      case 'text':
        // Для текстовых частиц сохраняем пропорции
        const aspectRatio = particle.userData.textCanvas 
          ? particle.userData.textCanvas.width / particle.userData.textCanvas.height 
          : 1;
        particle.scale.set(size * aspectRatio, size, 1);
        if (particle.material) {
          particle.material.opacity = opacity;
          if (particle.material.color) {
            particle.material.color.set(color);
          }
        }
        break;
        
      case 'sphere':
      case 'cube':
        particle.material.color.set(color);
        particle.material.emissive.set(color);
        particle.material.emissiveIntensity = 0.5 * (1 - progress);
        particle.material.opacity = opacity;
        particle.scale.setScalar(size / this.options.geometryRadius);
        break;
    }
    
    if (data.twinkleSpeed > 0) {
      const twinkle = 0.5 + Math.sin(Date.now() * data.twinkleSpeed) * 0.5;
      if (this.options.particleType === 'sprite' || this.options.particleType === 'star' || this.options.particleType === 'text') {
        particle.material.opacity = opacity * (0.7 + twinkle * 0.3);
      } else {
        particle.material.emissiveIntensity = 0.5 * (1 - progress) * (0.7 + twinkle * 0.3);
      }
    }
  }

  updateParticlePosition(particle, dt) {
    const data = particle.userData;
    
    // Гравитация (ускорение)
    data.velocity.y -= this.options.gravity * dt;
    
    // Сопротивление воздуха
    if (this.options.airResistance !== 1) {
      data.velocity.multiplyScalar(Math.pow(this.options.airResistance, dt * 60));
    }
    
    // Линейное сопротивление
    if (this.options.drag > 0) {
      const dragForce = data.velocity.clone().multiplyScalar(this.options.drag * dt);
      data.velocity.sub(dragForce);
    }
    
    // Обновление позиции
    particle.position.x += data.velocity.x * dt;
    particle.position.y += data.velocity.y * dt;
    particle.position.z += data.velocity.z * dt;
    
    // Вращение
    if (data.rotationSpeed > 0) {
      if (this.options.particleType === 'sprite' || this.options.particleType === 'star' || this.options.particleType === 'text') {
        particle.material.rotation += data.rotationSpeed * dt;
      } else {
        // Для 3D объектов вращаем mesh
        particle.rotation.x += data.rotationSpeed * dt;
        particle.rotation.y += data.rotationSpeed * dt;
        particle.rotation.z += data.rotationSpeed * dt;
      }
    }
  }

  updateEmission(deltaTime) {
    if (this.options.emissionRate <= 0) return;
    
    if ((this.options.emissionDuration > 0) && (this.options.emissionDuration <= this.emissionTime)) {
      if (this.options.onEmissionComplete)
        this.options.onEmissionComplete();
      return;
    }
    
    this.emissionTimer += deltaTime;
    this.emissionTime += deltaTime * 1000;

    const emitInterval = 1 / this.options.emissionRate;
    
    while (this.emissionTimer >= emitInterval) {
      this.emissionTimer -= emitInterval;
      
      if (this.emittedCount < this.options.particleCount) {
        this.emitParticle();
        this.emittedCount++;
      } else {
        break;
      }
    }
  }
  
  /**
   * Основной цикл обновления
   */
  update(deltaTime) {
    
    const dt = Math.min(deltaTime, 0.033);
    
    this.updateEmission(dt);
    
    for (const particle of this.particles) {
      if (!particle.userData.active) continue;
      
      particle.userData.life += dt;
      const progress = particle.userData.life / particle.userData.maxLife;
      
      if (progress >= 1) {
        particle.visible = false;
        particle.userData.active = false;
        this.emittedCount--;
        
        if (this.options.onParticleComplete) {
          this.options.onParticleComplete(particle);
        }
        continue;
      }
      
      this.updateParticlePosition(particle, dt);
      this.updateParticleVisuals(particle, progress);
      
      if (this.options.onParticleUpdate) {
        this.options.onParticleUpdate(particle, progress, dt);
      }
    }
  }
  
  stop() {
    for (const particle of this.particles) {
      particle.visible = false;
      particle.userData.active = false;
    }
  }
  
  clear() {
    for (const particle of this.particles) {
      particle.visible = false;
      particle.userData.active = false;
    }
    this.emissionTimer = 0;
    this.emittedCount = 0;
  }
  
  reset() {
    this.clear();
    this.emissionTimer = 0;
    this.emittedCount = 0;
  }
  
  dispose() {
    this.stop();
    
    for (const particle of this.particles) {
      this.scene.remove(particle);
      
      if (particle.material) {
        if (particle.material.map) particle.material.map.dispose();
        particle.material.dispose();
      }
      if (particle.geometry) particle.geometry.dispose();
      
      // Очищаем canvas текстовых частиц
      if (particle.userData.textCanvas) {
        particle.userData.textCanvas = null;
      }
      if (particle.userData.textTexture) {
        particle.userData.textTexture.dispose();
        particle.userData.textTexture = null;
      }
    }
    
    this.particles = [];
  }
}

class DirectParticleSystem extends ParticleSystem {


  updateParticlePosition(particle, dt) {
    const data = particle.userData;
    
    // Получаем прогресс жизни частицы
    const progress = data.life / data.maxLife;
    
    if (this.options.target) {
      // Вектор от частицы к цели
      const toTarget = new THREE.Vector3().subVectors(this.options.target, particle.position);
      const distanceToTarget = toTarget.length();
      
      // Если частица уже близко к цели - останавливаем её движение
      if (distanceToTarget < 0.1) {
        particle.position.copy(this.options.target);
        data.velocity.set(0, 0, 0);
        return;
      }
      
      // Рассчитываем силу притяжения с демпфированием
      let attractionStrength = this.options.attractionStrength || 8.0;
      
      // Увеличиваем силу притяжения по мере приближения к концу жизни
      if (progress > 0.6) {
        const finalPhase = Math.min(1.0, (progress - 0.6) / 0.4);
        attractionStrength = attractionStrength * (1.0 + finalPhase * 3.0);
      }
      
      // Критически важно: добавляем сильное демпфирование скорости при приближении к цели
      // Это предотвращает перелет и кружение
      const dampingFactor = Math.min(0.95, distanceToTarget * 3.0);
      data.velocity.multiplyScalar(dampingFactor);
      
      // Добавляем ускорение к цели
      const directionToTarget = toTarget.clone().normalize();
      const acceleration = directionToTarget.multiplyScalar(attractionStrength * dt);
      data.velocity.add(acceleration);
      
      // Проверяем, не перелетит ли частица цель
      const newPosition = particle.position.clone().add(data.velocity.clone().multiplyScalar(dt));
      const newDistance = newPosition.distanceTo(this.options.target);
      
      // Если после движения частица окажется дальше от цели или перелетит - телепортируем в цель
      /*
      if (newDistance > distanceToTarget || distanceToTarget < data.velocity.length() * dt) {
        particle.position.copy(this.options.target);
        data.velocity.set(0, 0, 0);
        return;
      }*/
    } else {
      // Если цели нет - применяем гравитацию (как в родительском классе)
      data.velocity.y -= this.options.gravity * dt;
    }
    
    // Сопротивление воздуха
    if (this.options.airResistance !== 1) {
      data.velocity.multiplyScalar(Math.pow(this.options.airResistance, dt * 60));
    }
    
    // Линейное сопротивление
    if (this.options.drag > 0) {
      const dragForce = data.velocity.clone().multiplyScalar(this.options.drag * dt);
      data.velocity.sub(dragForce);
    }
    
    // Обновление позиции
    particle.position.x += data.velocity.x * dt;
    particle.position.y += data.velocity.y * dt;
    particle.position.z += data.velocity.z * dt;
    
    // Вращение - применяем для всех типов частиц, кроме спрайтов
    // У спрайтов вращение через rotation не работает, нужно использовать материал
    if (data.rotationSpeed > 0) {
      if (this.options.particleType === 'sprite' || this.options.particleType === 'star') {
        particle.material.rotation += data.rotationSpeed * dt;
      } else {
        // Для 3D объектов вращаем mesh
        particle.rotation.x += data.rotationSpeed * dt;
        particle.rotation.y += data.rotationSpeed * dt;
        particle.rotation.z += data.rotationSpeed * dt;
      }
    }
  }
}

class ParticleSystemObject extends BaseGameObject {
  constructor(game = null, options = {}) {
    super(game);
    
    this.psList = [];
    this.position = options.position || new THREE.Vector3();
    this.options = options;
    if (this.position)
      this.setPosition(this.position);
  }

  isActive() {
    return this.psList.length > 0;
  }

  getPosition() {
    return this.position.clone();
  }

  setPosition(x, y=0, z=0) {
    if (typeof x == 'object') {
      y = x.y;
      z = x.z;
      x = x.x;
    }
    this.position.set(x, y, z);
    if (this.isActive()) {
      this.psList.forEach(p => p.options.position = this.position);
    }
  }

  afterStart() {
    // Переопределяется в дочерних классах
  }

  updatePosition() {
    // Переопределяется для динамического обновления позиции
  }
  
  play() {
    if (!this.isActive()) {
      this.psList = this.createPS();
      this.afterStart();

      let maxDuration = this.psList.reduce((max, ps) => Math.max(max, ps.options.duration), 0);

      if (maxDuration > 0) {
        setTimeout(() => {
          this.dispose();
        }, maxDuration);
      }
    }
  }

  createPS() {
    return [new ParticleSystem(this.game.scene, {
      position: this.getPosition(),
      ...this.options
    })];
  }

  dispose() {
    this.stop();
    super.dispose();
  }
  
  stop() {
    this.psList.forEach(ps => ps.dispose());
    this.psList.length = 0;
  }

  update(dt) {
    super.update(dt);
    if (this.isActive())
      this.psList.forEach(ps => ps.update(dt));
  }

  dispose() {
    this.psList.forEach(pt => pt.dispose());
    super.dispose();
  }
}

class TaskAchievParticles extends ParticleSystemObject {
  
  createPS() {
    return [
        new ParticleSystem(this.game.scene, {
          particleType: 'star',
          particleCount: 20,
          lifetime: 1.3,
          fade: true,
          gravity: 1.5,
          airResistance: 0.96,
          speedMin: 8,
          speedMax: 10,
          colorStart: 0xffdd88,
          colorEnd: 0x0000FF,
          shapeColor: () => {
            return getRandomColorWithIntensity(1, 0.2);
          },
          sizeStart: 0.4,
          sizeEnd: 0.1,
          emissionRate: 80,
          duration: 3000,
          emissionDuration: 600,
          emitConeAngle: Math.PI * 0.3,
          spreadRadius: 0.5,
          position: this.options.position || this.getPosition(),
          blending: THREE.AdditiveBlending,
          twinkleSpeed: 30,
          rotationSpeed: 2
        })
    ];
  }
}

class MagicSwirlParticles extends ParticleSystemObject {
  
  createPS() {
    return [
        new ParticleSystem(this.game.scene, {
          particleType: 'star',
          particleCount: 80,
          lifetime: 1.2,
          fade: true,
          gravity: 1.5,
          airResistance: 0.96,
          speedMin: 0,
          speedMax: 2,
          colorStart: 0xffdd88,
          colorEnd: 0xff6600,
          sizeStart: 0.2,
          sizeEnd: 0.8,
          shapeColor: () => {
            return getRandomColorWithIntensity(1, 0.2);
          },
          emitDirection: new THREE.Vector3(0, 1, 0),
          emissionRate: 80,
          duration: 3000,
          emissionDuration: 600,
          emitConeAngle: Math.PI,
          spreadRadius: 0,
          position: this.getPosition(),
          blending: THREE.AdditiveBlending,
          twinkleSpeed: 30,
          rotationSpeed: 2
        }), 

        new ParticleSystem(this.game.scene, {
          particleType: 'sprite',
          particleCount: 5,
          lifetime: 1.2,
          fade: true,
          airResistance: 0.96,
          speedMin: 0,
          speedMax: 2,
          colorStart: 0xffdd88,
          colorEnd: 0xffdd88,
          sizeStart: 0.5,
          sizeEnd: 2,
          emitDirection: new THREE.Vector3(0, 1, 0),
          emissionRate: 80,
          duration: 3000,
          emissionDuration: 1000,
          emitConeAngle: Math.PI / 4,
          spreadRadius: 2,
          position: this.getPosition(),
          blending: THREE.AdditiveBlending,
          twinkleSpeed: 30,
          rotationSpeed: 2
        })
    ];
  }

  update(dt) {
    if (this.isActive()) {

      let ps = this.psList[0];

      let v = new THREE.Vector3(1.5, 0, 0);
      let emk = ps.emissionTime / ps.options.emissionDuration;
      let rotation = emk * Math.PI * 4;
      const euler = new THREE.Euler(0, rotation, 0);
        
      v.applyEuler(euler);
      v.y = emk * 3;
      ps.options.position = this.getPosition().add(v);
    }
    super.update(dt);
  }
}


class SmokeParticles extends ParticleSystemObject {
  createPS() {
    return [
        new ParticleSystem(this.game.scene, {
          particleType: 'sphere',
          particleCount: 120,
          lifetime: 1.2,
          fade: (v) => Math.sin(v * Math.PI),
          airResistance: 0.99,
          speedMin: 1,
          speedMax: 3,
          colorStart: 0xFFFFFF,
          colorEnd: 0xFFFFFF,
          sizeStart: 0.2,
          sizeEnd: 0.5,
          emitDirection: new THREE.Vector3(0, 1, 0),
          emissionRate: 12,
          emitConeAngle: 0,
          spreadRadius: 0.1,
          position: this.getPosition(),
          blending: THREE.AdditiveBlending,
          twinkleSpeed: 30,
          rotationSpeed: 2
        })
    ];
  }
}

class ShowTargetEffect extends ParticleSystemObject {

  createPS() {
    return [
        new DirectParticleSystem(this.game.scene, {
          particleType: 'star',
          particleCount: 60,
          lifetime: 1.5,
          fade: true,
          points: 8,
          airResistance: 1,
          speedMin: 9,
          speedMax: 10,
          colorStart: 0xffdd88,
          colorEnd: 0x0000FF,
          shapeColor: () => {
            return getRandomColorWithIntensity(1, 0.3);
          },
          sizeStart: 0.3,
          sizeEnd: 0.2,
          emissionRate: 200,
          emissionDuration: 200,
          emitConeAngle: Math.PI * 0.1,
          spreadRadius: 0.5,
          position: this.options.position || this.getPosition(),
          target: this.options.target,
          attractionStrength: 50,
          twinkleSpeed: 30,
          rotationSpeed: [-16, 16]
        })
    ];
  }
}

class AppearParticles extends ParticleSystemObject {
  createPS() {
    return [
        new ParticleSystem(this.game.scene, {
          particleType: 'sprite',
          particleCount: 80,
          lifetime: 0.4,
          fade: (v) => Math.sin(v * Math.PI),
          airResistance: 0.99,
          speedMin: 1,
          speedMax: 2,
          colorStart: 0xFFFFFF,
          colorEnd: 0xFFFFFF,
          sizeStart: 0.8,
          sizeEnd: 0.8,
          emissionRate: 80,
          emissionDuration: 300,
          emitDirection: new THREE.Vector3(0, 1, 0),
          emitConeAngle: Math.PI,
          spreadRadius: 0.8,
          position: this.options.position || this.getPosition(),
          blending: THREE.AdditiveBlending,
          twinkleSpeed: 30
        })
    ];
  }
}

class AddScoreParticles extends ParticleSystemObject {
  createPS() {
    return [
        new DirectParticleSystem(this.game.scene, {
          particleType: 'text',
          particleCount: 10,
          lifetime: 1.5,
          fade: true,
          gravity: 0.5,
          speedMin: 1,
          speedMax: 3,
          textValue: this.options.text || 'X',
          textFont: this.options.font || 'Bold 40px Arial',
          textColor: this.options.color || '#FFD700',
          textStrokeColor: '#FF6600',
          textStrokeWidth: 2,
          textBackgroundColor: 'rgba(0,0,0,0.5)',
          textPadding: 8,
          sizeStart: 0.5,
          sizeEnd: 0.1,
          emissionRate: 80,
          emissionDuration: 300,
          emitConeAngle: Math.PI / 2,
          position: this.options.position || this.getPosition(),
          target: this.options.target || this.getPosition(),
          attractionStrength: 80,
          spreadRadius: 1,
          blending: THREE.AdditiveBlending
        })
    ];
  }
}