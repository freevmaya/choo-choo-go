// scripts/models/Ground.js

class Ground extends BaseGameObject {
  constructor(texturePath) {
    super();
    this.texturePath = texturePath;
    this._texture = null;      // Для хранения текстуры
    this._fallbackTexture = null; // Для хранения fallback текстуры
  }
  
  createModel() {

    let group = new THREE.Group();
    // Параметры плоскости грунта
    this.size = GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.CELL_SIZE; // Размер плоскости
    this.segments = 8; // Сегментация для лучшего отображения текстуры

    // Создаем геометрию плоскости
    const geometry = new THREE.CircleGeometry(this.size, this.segments);
    // Регистрируем геометрию для последующего освобождения
    this._registerGeometry(geometry);
    
    // Создаем материал
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: false
    });
    // Регистрируем материал
    this._registerMaterial(material);
    
    this.mesh = new THREE.Mesh(geometry, material);
    
    // Поворачиваем плоскость горизонтально (по умолчанию CircleGeometry смотрит вверх по Y)
    this.mesh.rotation.x = Math.PI * 0.5;
    this.mesh.rotation.z = 0;
    
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = false;
    
    // Загружаем текстуру
    this.loadTexture();
    
    // Создаем сетку (GridHelper) в центре сцены (0, 0, 0)
    // Параметры: размер, количество делений, цвет линий, цвет центральных линий

    this.gridHelper = new THREE.GridHelper(this.size, GAME_SETTINGS.BASE_PLATFORM_SIZE, 0xffffff, 0xffffff);
    
    // Регистрируем геометрию и материал GridHelper
    if (this.gridHelper.geometry) {
      this._registerGeometry(this.gridHelper.geometry);
    }
    if (this.gridHelper.material) {
      if (Array.isArray(this.gridHelper.material)) {
        this.gridHelper.material.forEach(m => this._registerMaterial(m));
      } else {
        this._registerMaterial(this.gridHelper.material);
      }
    }
    
    // Позиционируем сетку так, чтобы она лежала на поверхности земли
    this.gridHelper.position.set(0, 0.01, 0); // небольшое смещение вверх, чтобы избежать z-fighting
    this.gridHelper.material.transparent = true;
    this.gridHelper.material.opacity = 0.7; // делаем линии полупрозрачными для лучшей видимости
    
    group.add(this.mesh);
    group.add(this.gridHelper);
    return group;
  }

  loadModel(scene) {
    scene.add(this.model);

    When(() => this.game && this.game.raycasterManager)
      .then(() => {
        this.game.registerClickableObject(this.mesh, this);
        console.log("Ground registered as clickable object (retry)");
      });
  }

  onClick(hit, eventData) {

    const c = GAME_SETTINGS.CELL_SIZE / 2;
    const p = new Vector2Int(Math.round((hit.point.x - c) / GAME_SETTINGS.CELL_SIZE), Math.round((hit.point.z - c) / GAME_SETTINGS.CELL_SIZE));
    this.game.cameraController.setLookPoint(p);

    eventBus.emit('ground-down', p);
  }

  drawText(text, cellX, cellY) {


    // Создаем canvas элемент
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    // Рисуем текст на canvas
    context.font = 'Bold 60px Arial';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Three.js Текст', canvas.width / 2, canvas.height / 2);

    // Создаем текстуру из canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Создаем материал с текстурой
    const text_material = new THREE.MeshBasicMaterial({ 
        map: texture,
        side: THREE.DoubleSide,
        transparent: true
    });

    // Создаем плоскость и накладываем текст
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        text_material
    );

    plane.position(cellX * GAME_SETTINGS.CELL_SIZE, 0.01, cellY * GAME_SETTINGS.CELL_SIZE);
    this.game.scene.add(plane);
    this._registerGeometry(plane);
  }
  
  loadTexture() {
    let repeat = { x: GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.GROUND_DENSITY, 
                  y: GAME_SETTINGS.BASE_PLATFORM_SIZE* GAME_SETTINGS.GROUND_DENSITY };
    textureLoader.loadTexture(
      this.texturePath,
      (texture) => {
        // Настраиваем повторение текстуры для большей площади
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeat.x, repeat.y);
        
        // Регистрируем текстуру для последующего освобождения
        this._registerTexture(texture);
        
        // Если был fallback, освобождаем его
        if (this._fallbackTexture) {
          this._disposeTexture(this._fallbackTexture);
          this._fallbackTexture = null;
        }
        
        // Если у материала уже есть текстура, освобождаем её
        if (this.mesh.material.map && this.mesh.material.map !== texture) {
          this._disposeTexture(this.mesh.material.map);
        }
        
        this.mesh.material.map = texture;
        this.mesh.material.needsUpdate = true;
        this._texture = texture;
        
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
    
    // Регистрируем fallback текстуру
    this._registerTexture(fallbackTexture);
    this._fallbackTexture = fallbackTexture;
    
    // Если у материала уже есть текстура, освобождаем её
    if (this.mesh.material.map) {
      this._disposeTexture(this.mesh.material.map);
    }
    
    this.mesh.material.map = fallbackTexture;
    this.mesh.material.needsUpdate = true;
    this._texture = fallbackTexture;
  }
  
  /**
   * Безопасное освобождение текстуры
   * @param {THREE.Texture} texture - текстура для освобождения
   */
  _disposeTexture(texture) {
    if (texture && texture.dispose) {
      try {
        texture.dispose();
      } catch (e) {
        console.warn('Error disposing texture:', e);
      }
    }
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
  
  /**
   * Безопасное освобождение геометрии
   * @param {THREE.BufferGeometry} geometry - геометрия для освобождения
   */
  _disposeGeometry(geometry) {
    if (geometry && geometry.dispose) {
      try {
        geometry.dispose();
      } catch (e) {
        console.warn('Error disposing geometry:', e);
      }
    }
  }
  
  /**
   * Безопасное освобождение материала
   * @param {THREE.Material} material - материал для освобождения
   */
  _disposeMaterial(material) {
    if (material && material.dispose) {
      try {
        // Освобождаем текстуры материала
        if (material.map) {
          this._disposeTexture(material.map);
          material.map = null;
        }
        if (material.alphaMap) {
          this._disposeTexture(material.alphaMap);
          material.alphaMap = null;
        }
        if (material.envMap) {
          this._disposeTexture(material.envMap);
          material.envMap = null;
        }
        material.dispose();
      } catch (e) {
        console.warn('Error disposing material:', e);
      }
    }
  }
  
  update(deltaTime) {
    // Можно добавить анимацию текстурных координат для эффекта движения
    // if (this._texture) {
    //   this._texture.offset.x += deltaTime * 0.01;
    //   this._texture.offset.y += deltaTime * 0.01;
    // }
  }
}