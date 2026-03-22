// scripts/models/Ground.js

class Ground extends BasePlatform {
  constructor(position, texturePath) {
    super(position, 0);
    this.texturePath = texturePath;
  }
  
  createModel() {
    
    // Параметры плоскости грунта
    this.size = GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.CELL_SIZE; // Размер плоскости
    this.segments = 8; // Сегментация для лучшего отображения текстуры

    // Создаем геометрию плоскости
    const geometry = new THREE.CircleGeometry(this.size, this.segments);
    
    // Создаем материал
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: false
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    
    let pos = this.absPosition();
    this.mesh.position.set(pos.x, pos.y, pos.z);
    
    // Поворачиваем плоскость горизонтально (по умолчанию CircleGeometry смотрит вверх по Y)
    this.mesh.rotation.x = Math.PI * 0.5;
    this.mesh.rotation.z = 0;
    
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
    
    // Загружаем текстуру
    this.loadTexture();
    
    // Создаем сетку (GridHelper) в центре сцены (0, 0, 0)
    // Параметры: размер, количество делений, цвет линий, цвет центральных линий
    const gridSize = this.size;
    this.gridHelper = new THREE.GridHelper(gridSize, GAME_SETTINGS.BASE_PLATFORM_SIZE, 0xffffff, 0xffffff);
    
    // Позиционируем сетку так, чтобы она лежала на поверхности земли
    this.gridHelper.position.set(pos.x, pos.y + 0.01, pos.z); // небольшое смещение вверх, чтобы избежать z-fighting
    this.gridHelper.material.transparent = true;
    this.gridHelper.material.opacity = 0.7; // делаем линии полупрозрачными для лучшей видимости
    
    return this.mesh;
  }

  loadModel() {
    
    this.scene.add(this.mesh);
    this.scene.add(this.gridHelper);
  }
  
  loadTexture() {
    let repeat = { x: GAME_SETTINGS.BASE_PLATFORM_SIZE, 
                  y: GAME_SETTINGS.BASE_PLATFORM_SIZE };
    textureLoader.loadTexture(
      this.texturePath,
      (texture) => {
        // Настраиваем повторение текстуры для большей площади
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeat.x, repeat.y);
        
        this.mesh.material.map = texture;
        this.mesh.material.needsUpdate = true;
        this.texture = texture;
        
        console.log('Текстура грунта загружена');
      },
      (error) => {
        console.warn('Не удалось загрузить текстуру грунта:', error);
        // Создаем запасную текстуру
        this.createFallbackTexture();
      },
      {
        repeat: repeat,
        anisotropy: 16
      }
    );
  }
  
  createFallbackTexture() {
    // Создаем простую текстуру-заглушку для грунта
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Базовый цвет грунта
    ctx.fillStyle = '#5d8c6b';
    ctx.fillRect(0, 0, 256, 256);
    
    // Добавляем текстуру - точки и линии
    ctx.fillStyle = '#3a6b47';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 3 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Добавляем линии-травинки
    ctx.strokeStyle = '#2d5a3a';
    ctx.lineWidth = 1;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 256;
      const yStart = Math.random() * 256;
      const yEnd = yStart + Math.random() * 20;
      
      ctx.beginPath();
      ctx.moveTo(x, yStart);
      ctx.lineTo(x + (Math.random() - 0.5) * 10, yEnd);
      ctx.stroke();
    }
    
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    fallbackTexture.wrapS = THREE.RepeatWrapping;
    fallbackTexture.wrapT = THREE.RepeatWrapping;
    fallbackTexture.repeat.set(8, 8);
    
    this.mesh.material.map = fallbackTexture;
    this.mesh.material.needsUpdate = true;
    this.texture = fallbackTexture;
  }
  
  setOpacity(opacity) {
    if (this.mesh && this.mesh.material) {
      this.mesh.material.opacity = opacity;
      this.mesh.material.transparent = opacity < 1.0;
    }
    
    // Также делаем сетку более прозрачной при уменьшении opacity
    if (this.gridHelper && this.gridHelper.material) {
      this.gridHelper.material.opacity = opacity * 0.7;
      this.gridHelper.material.transparent = opacity < 1.0;
    }
  }
  
  setSize(size) {
    this.size = size;
    if (this.mesh) {
      this.scene.remove(this.mesh);
      const geometry = new THREE.CircleGeometry(size, this.segments);
      this.mesh.geometry.dispose();
      this.mesh.geometry = geometry;
      this.scene.add(this.mesh);
    }
  }
  
  update(deltaTime) {
    // Можно добавить анимацию текстурных координат для эффекта движения
    // if (this.texture) {
    //   this.texture.offset.x += deltaTime * 0.01;
    //   this.texture.offset.y += deltaTime * 0.01;
    // }
  }
  
  dispose() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      
      if (this.mesh.geometry) {
        this.mesh.geometry.dispose();
      }
      
      if (this.mesh.material) {
        if (Array.isArray(this.mesh.material)) {
          this.mesh.material.forEach(m => m.dispose());
        } else {
          this.mesh.material.dispose();
        }
      }
    }
    
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
      if (this.gridHelper.geometry) {
        this.gridHelper.geometry.dispose();
      }
      if (this.gridHelper.material) {
        this.gridHelper.material.dispose();
      }
    }
    
    if (this.texture) {
      this.texture.dispose();
    }
  }
}