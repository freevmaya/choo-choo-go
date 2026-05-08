class SparkEffect {
  constructor(a_options = {}) {
    // Настройки по умолчанию
    const defaults = {
      container: document.body,
      x: 0, y: 0,
      radius: 20,
      count: 50,
      gravity: 0.1,
      lifetime: 2000,
      colors: ['#ffaa00', '#ff6600', '#ff3300', '#ffff00', '#ff9900'],
      sizes: [5, 10],
      speeds: [2, 8],
      baseRadius: 0,
      loop: false,
      loopDelay: 500,
      rectWidth: 0,
      rectHeight: 0,
      emissionTime: 0,
      emissionType: 'random',
      shape: 'star',
      starPoints: 5,
      starInnerRadius: 0.4,
      rotation: {
        enabled: false,
        speed: [0, 360],
        direction: 'random',
        easing: false,
      },
      className: null,
      velocity: [0, 0],
      ...a_options
    };

    this.options = defaults;
    this.container = defaults.container;
    
    // Состояние
    this.sparks = new Set();
    this.activeEmissions = new Set();
    this.animationId = null;
    this.isRunning = true;
    this.loopTimeout = null;
    this.lastFrameTime = null;
    
    // Константы
    this.TWO_PI = Math.PI * 2;
    
    this.init();
  }
  
  init() {
    if (this.options.loop && this.options.emissionTime > 0) {
      this.startLoopEmission();
    } else if (this.options.emissionTime > 0 && this.options.count > 0) {
      this.startSingleEmission();
    } else {
      this.createAllSparks();
    }
    
    // ВСЕГДА запускаем анимацию, если есть частицы
    this.animate();
  }
  
  startLoopEmission() {
    const emit = () => {
      if (!this.isRunning) return;
      
      // Создаем новую эмиссию
      this.startSingleEmission();
      
      // Запланируем следующую эмиссию
      this.loopTimeout = setTimeout(emit, this.options.emissionTime);
    };
    
    emit();
  }
  
  startSingleEmission() {
    if (!this.isRunning) return;
    
    const emissionId = Symbol('emission');
    const emissionState = {
      id: emissionId,
      pendingSparks: [],
      emittedCount: 0,
      startTime: Date.now(),
      emissionTimer: null
    };
    
    this.activeEmissions.add(emissionState);
    
    const interval = this.options.emissionTime / this.options.count;
    const isLinear = this.options.emissionType === 'linear';
    
    // Создаем расписание частиц
    for (let i = 0; i < this.options.count; i++) {
      const delay = isLinear 
        ? i * interval + (Math.random() * interval * 0.2)
        : Math.random() * this.options.emissionTime;
      emissionState.pendingSparks.push({ delay, index: i });
    }
    
    emissionState.pendingSparks.sort((a, b) => a.delay - b.delay);
    
    this.processEmissionQueue(emissionState);
  }
  
  processEmissionQueue(emissionState) {
    if (!this.isRunning || !this.activeEmissions.has(emissionState)) return;
    if (emissionState.pendingSparks.length === 0) {
      this.activeEmissions.delete(emissionState);
      return;
    }
    
    const currentTime = Date.now() - emissionState.startTime;
    
    while (emissionState.pendingSparks.length > 0 && emissionState.pendingSparks[0].delay <= currentTime) {
      emissionState.pendingSparks.shift();
      this.createSingleSpark();
      emissionState.emittedCount++;
    }
    
    if (emissionState.pendingSparks.length > 0 && this.isRunning) {
      const nextDelay = emissionState.pendingSparks[0].delay - currentTime;
      emissionState.emissionTimer = setTimeout(() => {
        this.processEmissionQueue(emissionState);
      }, Math.max(0, Math.min(nextDelay, 100)));
    } else if (emissionState.pendingSparks.length === 0) {
      this.activeEmissions.delete(emissionState);
    }
  }
  
  createSingleSpark() {
    const sparkData = this.createSparkData();
    const element = this.createSparkElement(sparkData);
    
    this.container.appendChild(element);
    
    this.sparks.add({
      ...sparkData,
      element,
      birthTime: Date.now()
    });
  }
  
  createAllSparks() {
    const fragment = document.createDocumentFragment();
    const newSparks = [];
    
    for (let i = 0; i < this.options.count; i++) {
      const sparkData = this.createSparkData();
      const element = this.createSparkElement(sparkData);
      
      fragment.appendChild(element);
      
      newSparks.push({
        ...sparkData,
        element,
        birthTime: Date.now()
      });
    }
    
    this.container.appendChild(fragment);
    newSparks.forEach(spark => this.sparks.add(spark));
  }
  
  getSpawnPosition() {
    const { x, y, rectWidth, rectHeight, baseRadius } = this.options;
    
    if (rectWidth > 0 && rectHeight > 0) {
      return {
        x: x + (Math.random() - 0.5) * rectWidth,
        y: y + (Math.random() - 0.5) * rectHeight
      };
    } else {
      const angle = Math.random() * this.TWO_PI;
      const radius = baseRadius > 0 ? Math.random() * baseRadius : 0;
      return {
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
      };
    }
  }
  
  getRotationParams() {
    const { enabled, speed, direction, easing } = this.options.rotation;
    
    if (!enabled) {
      return { speed: 0, currentAngle: 0, easing: false };
    }
    
    let speedVal = speed[0] + Math.random() * (speed[1] - speed[0]);
    
    if (direction === 'clockwise') {
      speedVal = Math.abs(speedVal);
    } else if (direction === 'counterclockwise') {
      speedVal = -Math.abs(speedVal);
    } else if (direction === 'random') {
      speedVal = Math.random() > 0.5 ? Math.abs(speedVal) : -Math.abs(speedVal);
    }
    
    return { 
      speed: speedVal, 
      currentAngle: Math.random() * 360,
      easing 
    };
  }
  
  createStarPath(size, points, innerRadiusRatio) {
    const outerRadius = size / 2;
    const innerRadius = outerRadius * innerRadiusRatio;
    const center = size / 2;
    const angleStep = Math.PI / points;
    const points_array = [];
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points_array.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    return points_array.join(' ') + ' Z';
  }
  
  createSparkElement(spark) {
    const element = document.createElement('div');
    const { shape, className, starPoints, starInnerRadius } = this.options;
    const size = spark.size;
    
    const baseStyles = {
      position: 'fixed',
      width: `${size}px`,
      height: `${size}px`,
      pointerEvents: 'none',
      zIndex: '9999',
      left: '0px',
      top: '0px',
      willChange: 'transform, opacity'
    };
    
    if (className) {
      element.className = className;
    }

    let a_shape = Array.isArray(shape) ? shape[Math.floor(Math.random() * shape.length)] : shape;
    
    // Обработка форм
    switch (a_shape) {
      case 'circle':
        baseStyles.borderRadius = '50%';
        baseStyles.backgroundColor = spark.color;
        if (!className) baseStyles.boxShadow = `0 0 ${size * 2}px ${spark.color}`;
        break;
        
      case 'square':
        baseStyles.backgroundColor = spark.color;
        if (!className) baseStyles.boxShadow = `0 0 ${size * 2}px ${spark.color}`;
        break;
        
      case 'diamond':
        baseStyles.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
        baseStyles.backgroundColor = spark.color;
        if (!className) baseStyles.boxShadow = `0 0 ${size * 2}px ${spark.color}`;
        break;
        
      case 'triangle':
        baseStyles.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
        baseStyles.backgroundColor = spark.color;
        if (!className) baseStyles.boxShadow = `0 0 ${size * 2}px ${spark.color}`;
        break;
        
      case 'star':
        this.createStarSVG(element, size, spark.color, starPoints, starInnerRadius);
        baseStyles.backgroundColor = 'transparent';
        baseStyles.display = 'flex';
        baseStyles.alignItems = 'center';
        baseStyles.justifyContent = 'center';
        break;
    }
    
    Object.assign(element.style, baseStyles);
    return element;
  }
  
  createStarSVG(container, size, color, points, innerRadius) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const path = document.createElementNS(svgNS, "path");
    
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    
    const pathData = this.createStarPath(size, points, innerRadius);
    path.setAttribute("d", pathData);
    path.setAttribute("fill", color);
    
    svg.appendChild(path);
    container.appendChild(svg);
  }
  
  createSparkData() {
    const angle = Math.random() * this.TWO_PI;
    const speedMin = this.options.speeds[0];
    const speedMax = this.options.speeds[1];
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    const position = this.getSpawnPosition();
    const sizeMin = this.options.sizes[0];
    const sizeMax = this.options.sizes[1];
    const size = sizeMin + Math.random() * (sizeMax - sizeMin);
    const sparkLifetime = this.options.lifetime * (0.5 + Math.random() * 0.8);
    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    const rotation = this.getRotationParams();
    const [vx0, vy0] = this.options.velocity;
    
    return {
      x: position.x,
      y: position.y,
      vx: Math.cos(angle) * speed + vx0,
      vy: Math.sin(angle) * speed + vy0,
      size,
      lifetime: sparkLifetime,
      color,
      rotationSpeed: rotation.speed,
      rotationAngle: rotation.currentAngle,
      rotationEasing: rotation.easing
    };
  }
  
  restart() {
    this.stop();
    this.isRunning = true;
    this.lastFrameTime = null;
    this.sparks.clear();
    this.activeEmissions.clear();
    
    if (this.options.loop && this.options.emissionTime > 0) {
      this.startLoopEmission();
    } else if (this.options.emissionTime > 0 && this.options.count > 0) {
      this.startSingleEmission();
    } else {
      this.createAllSparks();
    }
    
    this.animate();
  }
  
  clearSparks() {
    for (const spark of this.sparks) {
      if (spark.element?.parentNode) {
        spark.element.parentNode.removeChild(spark.element);
      }
    }
    this.sparks.clear();
  }
  
  stopAllEmissions() {
    for (const emission of this.activeEmissions) {
      if (emission.emissionTimer) {
        clearTimeout(emission.emissionTimer);
      }
    }
    this.activeEmissions.clear();
    
    if (this.loopTimeout) {
      clearTimeout(this.loopTimeout);
      this.loopTimeout = null;
    }
  }
  
  animate() {
    if (!this.isRunning) return;
    
    const currentTime = Date.now();
    const deltaTime = this.lastFrameTime ? Math.min(0.033, (currentTime - this.lastFrameTime) / 1000) : 0.016;
    this.lastFrameTime = currentTime;
    
    let hasActiveSparks = false;
    const toRemove = [];
    
    // Обновляем каждую искру
    for (const spark of this.sparks) {
      const sparkAge = currentTime - spark.birthTime;
      
      if (sparkAge >= spark.lifetime) {
        toRemove.push(spark);
        continue;
      }
      
      hasActiveSparks = true;
      
      // Физика
      spark.vy += this.options.gravity;
      spark.x += spark.vx;
      spark.y += spark.vy;
      
      // Вращение
      if (this.options.rotation.enabled && spark.rotationSpeed !== 0) {
        if (spark.rotationEasing) {
          const lifeProgress = sparkAge / spark.lifetime;
          spark.rotationSpeed *= (1 - lifeProgress * 0.95);
        }
        spark.rotationAngle = (spark.rotationAngle + spark.rotationSpeed * deltaTime) % 360;
      }
      
      // Визуализация
      const lifeProgress = sparkAge / spark.lifetime;
      const opacity = Math.max(0, 1 - lifeProgress * 1.2);
      const scale = 1 - lifeProgress * 0.5;
      
      let transform = `translate(${spark.x}px, ${spark.y}px) scale(${scale})`;
      if (this.options.rotation.enabled && spark.rotationSpeed !== 0) {
        transform += ` rotate(${spark.rotationAngle}deg)`;
      }
      
      if (spark.element) {
        spark.element.style.transform = transform;
        spark.element.style.opacity = opacity;
      }
    }
    
    // Удаляем умершие искры
    for (const spark of toRemove) {
      if (spark.element?.parentNode) {
        spark.element.parentNode.removeChild(spark.element);
      }
      this.sparks.delete(spark);
    }
    
    // Продолжаем анимацию если есть живые искры или активные эмиссии
    const hasEmissions = this.activeEmissions.size > 0;
    
    if ((hasActiveSparks || hasEmissions) && this.isRunning) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else if (!hasActiveSparks && !hasEmissions && !this.options.loop) {
      this.stop();
    } else if (this.isRunning) {
      // Если нет живых искр, но loop включен, всё равно держим анимацию
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }
  
  stop() {
    this.isRunning = false;
    
    this.stopAllEmissions();
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    this.clearSparks();
  }
  
  pause() {
    this.isRunning = false;
    this.stopAllEmissions();
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastFrameTime = Date.now();
      
      // Возобновляем эмиссии если нужно
      if (this.options.loop && this.options.emissionTime > 0) {
        this.startLoopEmission();
      } else if (this.options.emissionTime > 0 && this.options.count > 0 && this.sparks.size === 0) {
        this.startSingleEmission();
      }
      
      this.animate();
    }
  }
  
  updateOptions(newOptions) {
    const hadLoop = this.options.loop;
    Object.assign(this.options, newOptions);
    
    // Если изменился режим loop, перезапускаем
    if (hadLoop !== this.options.loop || newOptions.emissionTime) {
      this.restart();
    }
  }
}