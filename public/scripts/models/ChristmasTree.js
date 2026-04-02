// scripts/models/ChristmasTree.js

class ChristmasTree extends BaseGameObject {
  constructor() {
    super();
    this.type = 'christmas-tree';
    this.treeGroup = null;
    this.ornaments = [];
    this.lights = [];
    this.star = null;
    this.animationTime = 0;
    this.particleSystem = null;
    
    // Параметры ёлки
    this.treeHeight = 5;
    this.baseRadius = 1.2;
    this.topRadius = 0.05;
    this.segments = 8;
    this.tierCount = 4;
  }
  
  createModel() {
    this.treeGroup = new THREE.Group();
    
    // Создаем слои ёлки (конусы)
    this.createTreeLayers();
    
    // Добавляем ствол
    this.createTrunk();
    
    // Добавляем украшения
    this.createOrnaments();
    
    // Добавляем гирлянду (светящиеся шарики)
    this.createLights();
    
    // Добавляем звезду на макушку
    this.createStar();
    
    // Добавляем снежную шапку на ветки
    this.addSnow();
    
    // Добавляем парящие снежинки
    this.createSnowParticles();
    
    return this.treeGroup;
  }
  
  createTreeLayers() {
    // Материал для ёлки (зеленый с мультяшным оттенком)
    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x4caf50,
      emissive: 0x1a4d1a,
      emissiveIntensity: 0.15,
      roughness: 0.6,
      metalness: 0.1,
      flatShading: true
    });
    
    this._registerMaterial(greenMaterial);
    
    const tierHeights = [1.2, 1.1, 1.0, 0.9];
    const tierRadii = [1.2, 0.95, 0.7, 0.45];
    let yOffset = 0;
    
    for (let i = 0; i < this.tierCount; i++) {
      const height = tierHeights[i];
      const radiusBottom = tierRadii[i];
      const radiusTop = i === this.tierCount - 1 ? this.topRadius : tierRadii[i + 1] * 0.8;
      
      // Создаем конус
      const coneGeometry = new THREE.ConeGeometry(radiusBottom, height, this.segments);
      const cone = new THREE.Mesh(coneGeometry, greenMaterial);
      cone.position.y = yOffset + height / 2;
      cone.castShadow = true;
      cone.receiveShadow = true;
      
      this._registerGeometry(coneGeometry);
      this.treeGroup.add(cone);
      
      // Добавляем мультяшные кольца на каждый слой
      this.addCartoonRing(cone.position.y - height / 2, radiusBottom + 0.05);
      
      yOffset += height - 0.15;
    }
  }
  
  addCartoonRing(yPos, radius) {
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x8bc34a,
      emissive: 0x33691e,
      emissiveIntensity: 0.1,
      roughness: 0.4
    });
    
    this._registerMaterial(ringMaterial);
    
    const ringGeometry = new THREE.TorusGeometry(radius, 0.08, 16, 40);
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = yPos;
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    
    this._registerGeometry(ringGeometry);
    this.treeGroup.add(ring);
  }
  
  createTrunk() {
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.8,
      metalness: 0.1
    });
    
    this._registerMaterial(trunkMaterial);
    
    const trunkGeometry = new THREE.CylinderGeometry(0.45, 0.55, 0.6, 6);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -0.3;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    
    this._registerGeometry(trunkGeometry);
    this.treeGroup.add(trunk);
  }
  
  createOrnaments() {
    const colors = [0xff4444, 0xffaa44, 0xff66cc, 0x44aaff, 0xff8844];
    const ornamentPositions = [
      { y: 0.8, radius: 0.9, angle: 0.3 },
      { y: 0.8, radius: 0.9, angle: 2.1 },
      { y: 0.8, radius: 0.9, angle: 3.9 },
      { y: 1.5, radius: 0.75, angle: 0.8 },
      { y: 1.5, radius: 0.75, angle: 2.5 },
      { y: 1.5, radius: 0.75, angle: 4.2 },
      { y: 2.2, radius: 0.6, angle: 0.5 },
      { y: 2.2, radius: 0.6, angle: 2.0 },
      { y: 2.2, radius: 0.6, angle: 3.5 },
      { y: 2.9, radius: 0.45, angle: 1.2 },
      { y: 2.9, radius: 0.45, angle: 3.0 },
      { y: 3.5, radius: 0.3, angle: 0.0 },
      { y: 3.5, radius: 0.3, angle: 2.1 },
      { y: 4.0, radius: 0.2, angle: 1.5 }
    ];
    
    ornamentPositions.forEach((pos, index) => {
      const color = colors[index % colors.length];
      const ornamentMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.7
      });
      
      this._registerMaterial(ornamentMaterial);
      
      const ornamentGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
      
      const x = Math.cos(pos.angle) * pos.radius;
      const z = Math.sin(pos.angle) * pos.radius;
      ornament.position.set(x, pos.y, z);
      ornament.castShadow = true;
      
      this._registerGeometry(ornamentGeometry);
      this.treeGroup.add(ornament);
      
      // Сохраняем для анимации
      this.ornaments.push({
        mesh: ornament,
        originalY: pos.y,
        floatSpeed: 0.5 + Math.random() * 0.5,
        floatPhase: Math.random() * Math.PI * 2
      });
      
      // Добавляем блестящую точку на шарике
      const highlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.5
      });
      
      this._registerMaterial(highlightMaterial);
      
      const highlightGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
      highlight.position.set(0.08, 0.08, 0.08);
      ornament.add(highlight);
      this._registerGeometry(highlightGeometry);
    });
  }
  
  createLights() {
    const lightColors = [0xff3333, 0xffaa33, 0x33ff33, 0x33ffaa, 0x33aaff, 0xff33ff];
    const spiralSteps = 36;
    const spiralTurns = 2.5;
    
    for (let i = 0; i <= spiralSteps; i++) {
      const t = i / spiralSteps;
      const y = t * this.treeHeight - 0.2;
      const radius = this.baseRadius * (1 - t * 0.85);
      const angle = t * Math.PI * 2 * spiralTurns;
      
      const color = lightColors[Math.floor(Math.random() * lightColors.length)];
      const lightMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      
      this._registerMaterial(lightMaterial);
      
      const lightGeometry = new THREE.SphereGeometry(0.09, 12, 12);
      const lightBall = new THREE.Mesh(lightGeometry, lightMaterial);
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      lightBall.position.set(x, y, z);
      lightBall.castShadow = true;
      
      this._registerGeometry(lightGeometry);
      this.treeGroup.add(lightBall);
      
      // Сохраняем для анимации мерцания
      this.lights.push({
        mesh: lightBall,
        material: lightMaterial,
        baseIntensity: 0.6,
        flickerSpeed: 0.8 + Math.random() * 1.5,
        flickerPhase: Math.random() * Math.PI * 2
      });
    }
  }
  
  createStar() {
    const starGroup = new THREE.Group();
    
    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdd77,
      emissive: 0xffaa44,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.2
    });
    
    this._registerMaterial(starMaterial);
    
    // Создаем звезду из экструдированной формы
    const shape = new THREE.Shape();
    const outerRadius = 0.35;
    const innerRadius = 0.15;
    const points = 5;
    
    shape.absellipse(0, 0, outerRadius, outerRadius, 0, Math.PI * 2, false, 0);
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI * 2) / (points * 2);
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    
    const extrudeSettings = {
      steps: 1,
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3
    };
    
    const starGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    starGeometry.center();
    starGeometry.computeVertexNormals();
    
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.rotation.z = Math.PI / points;
    star.position.y = this.treeHeight + 0.15;
    star.castShadow = true;
    
    this._registerGeometry(starGeometry);
    starGroup.add(star);
    
    // Добавляем сияние вокруг звезды
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa66,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    this._registerMaterial(glowMaterial);
    
    const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.y = this.treeHeight + 0.15;
    starGroup.add(glow);
    
    this._registerGeometry(glowGeometry);
    this.treeGroup.add(starGroup);
    this.star = { group: starGroup, glow: glow, star: star };
  }
  
  addSnow() {
    const snowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0.05,
      emissive: 0x88aaff,
      emissiveIntensity: 0.1
    });
    
    this._registerMaterial(snowMaterial);
    
    // Добавляем снежные шапки на концы веток
    const snowPositions = [
      { y: 0.5, radius: 1.1, angle: 0.7, size: 0.18 },
      { y: 0.5, radius: 1.1, angle: 2.0, size: 0.18 },
      { y: 0.5, radius: 1.1, angle: 3.3, size: 0.18 },
      { y: 1.2, radius: 0.95, angle: 0.4, size: 0.16 },
      { y: 1.2, radius: 0.95, angle: 1.9, size: 0.16 },
      { y: 1.2, radius: 0.95, angle: 3.4, size: 0.16 },
      { y: 1.9, radius: 0.8, angle: 0.2, size: 0.14 },
      { y: 1.9, radius: 0.8, angle: 1.6, size: 0.14 },
      { y: 1.9, radius: 0.8, angle: 3.0, size: 0.14 },
      { y: 2.6, radius: 0.65, angle: 0.9, size: 0.12 },
      { y: 2.6, radius: 0.65, angle: 2.4, size: 0.12 },
      { y: 3.2, radius: 0.5, angle: 0.5, size: 0.1 },
      { y: 3.2, radius: 0.5, angle: 2.1, size: 0.1 },
      { y: 3.8, radius: 0.35, angle: 1.3, size: 0.09 }
    ];
    
    snowPositions.forEach(pos => {
      const snowGeometry = new THREE.SphereGeometry(pos.size, 10, 10);
      const snow = new THREE.Mesh(snowGeometry, snowMaterial);
      
      const x = Math.cos(pos.angle) * pos.radius;
      const z = Math.sin(pos.angle) * pos.radius;
      snow.position.set(x, pos.y, z);
      snow.castShadow = true;
      
      this._registerGeometry(snowGeometry);
      this.treeGroup.add(snow);
    });
    
    // Добавляем небольшие снежные комочки на кончики веток
    for (let i = 0; i < 25; i++) {
      const t = Math.random();
      const y = t * this.treeHeight - 0.1;
      const radius = this.baseRadius * (1 - t * 0.85) + 0.05;
      const angle = Math.random() * Math.PI * 2;
      
      const snowGeometry = new THREE.SphereGeometry(0.07 + Math.random() * 0.06, 8, 8);
      const snow = new THREE.Mesh(snowGeometry, snowMaterial);
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      snow.position.set(x, y, z);
      snow.castShadow = true;
      
      this._registerGeometry(snowGeometry);
      this.treeGroup.add(snow);
    }
  }
  
  createSnowParticles() {
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Случайное положение вокруг ёлки
      const radius = 1.2 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * (this.treeHeight + 0.8) - 0.5;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    this._registerMaterial(particleMaterial);
    this._registerGeometry(particleGeometry);
    
    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.treeGroup.add(this.particleSystem);
  }
  
  update(dt) {
    this.animationTime += dt;
    
    // Анимация мерцания гирлянды
    this.lights.forEach(light => {
      const intensity = 0.4 + Math.sin(this.animationTime * light.flickerSpeed + light.flickerPhase) * 0.3;
      light.material.emissiveIntensity = intensity;
    });
    
    // Анимация украшений (легкое покачивание)
    this.ornaments.forEach(ornament => {
      const yOffset = Math.sin(this.animationTime * ornament.floatSpeed + ornament.floatPhase) * 0.02;
      ornament.mesh.position.y = ornament.originalY + yOffset;
    });
    
    // Анимация звезды (вращение и пульсация)
    if (this.star) {
      this.star.group.rotation.y += dt * 0.8;
      const pulse = 0.7 + Math.sin(this.animationTime * 3) * 0.3;
      this.star.glow.material.opacity = 0.2 + Math.sin(this.animationTime * 4) * 0.15;
      this.star.star.material.emissiveIntensity = 0.6 + Math.sin(this.animationTime * 5) * 0.3;
    }
    
    // Анимация снежинок (медленное вращение)
    if (this.particleSystem) {
      this.particleSystem.rotation.y += dt * 0.1;
    }
  }
  
  dispose() {
    super.dispose();
    this.ornaments = [];
    this.lights = [];
    this.star = null;
    this.particleSystem = null;
  }
}


registerClass(ChristmasTree);