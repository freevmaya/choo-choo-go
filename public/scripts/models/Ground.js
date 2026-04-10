// ============================================================
// FILE: ./public\scripts\models\Ground.js
// ============================================================

// scripts/models/Ground.js

class Ground extends BaseGameObject {
  constructor(texturePath = null, baseColor=null) {
    super();
    this.texturePath = texturePath;
    this.baseColor = baseColor ? baseColor : GAME_SETTINGS.GROUND_COLOR;
    this._texture = null;      // Для хранения текстуры
    this._fallbackTexture = null; // Для хранения fallback текстуры
    this._hoverPlane = null;   // Плоскость подсветки под курсором
    this._lastHoverCell = null; // Последняя подсвеченная ячейка
    this._materialHover = null;
    
    // Отступ от края экрана в пикселях (можно настраивать)
    this.viewMargin = 200;
  }

  getCurrentCell() {
    return this._lastHoverCell;
  }
  
  createModel() {

    let group = new THREE.Group();
    // Параметры плоскости грунта
    this.size = GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.CELL_SIZE; // Размер плоскости
    this.segments = 8; // Сегментация для лучшего отображения текстуры

    // Создаем геометрию плоскости
    const geometry = new THREE.CircleGeometry(this.size * 2, this.segments);
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
    this.gridHelper.material.opacity = 0.3; // делаем линии полупрозрачными для лучшей видимости
    
    // Создаем плоскость подсветки
    this._createHoverPlane(group);
    
    group.add(this.mesh);
    group.add(this.gridHelper);

    this._setupHoverTracking();
    return group;
  }

  /**
   * Создает черную полупрозрачную плоскость для подсветки ячейки под курсором
   */
  _createHoverPlane(group) {
    const size = GAME_SETTINGS.CELL_SIZE;
    const geometry = new THREE.PlaneGeometry(size, size);
    this._materialHover = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
      roughness: 0.5,
      metalness: 0.0,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    
    this._registerGeometry(geometry);
    this._registerMaterial(this._materialHover);
    
    this._hoverPlane = new THREE.Mesh(geometry, this._materialHover);
    // Поворачиваем плоскость горизонтально
    this._hoverPlane.rotation.x = -Math.PI / 2;
    // Немного поднимаем над землей, чтобы избежать z-fighting
    this._hoverPlane.position.y = 0.02;
    this._hoverPlane.visible = false;
    
    // Сохраняем размеры для расчетов
    this._hoverPlane.userData = { size: size };
    group.add(this._hoverPlane);
  }

  loadModel(scene) {
    super.loadModel(scene);
    this._registerClickable(this.mesh);
  }

  _setupHoverTracking() {
    const container = this.game.container[0];

    container.addEventListener('mousemove', this._onMouseMove.bind(this));
    container.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
  }

  _closeHoverTraking() {
    const container = this.game?.container[0];
    if (container) {
      container.removeEventListener('mousemove', this._onMouseMove);
      container.removeEventListener('touchmove', this._onTouchMove);
    }
  }

  _onMouseMove(event) {
    this._updateHoverPlane(event.clientX, event.clientY);
  }

  _onTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      this._updateHoverPlane(touch.clientX, touch.clientY);
    }
  }

  clientToCell(clientX, clientY) {
    if (!this.game.raycasterManager) return;
    
    // Выполняем рейкастинг для определения позиции на плоскости земли
    const intersects = this.game.raycasterManager.raycast(clientX, clientY, [this.mesh]);
    
    if (intersects.length > 0) {
      const hit = intersects[0];
      const point = hit.point;

      return new Vector2Int(Math.floor(point.x / GAME_SETTINGS.CELL_SIZE), 
                            Math.floor(point.z / GAME_SETTINGS.CELL_SIZE));
    }
    return null;
  }

  /**
   * Обновляет позицию плоскости подсветки в зависимости от положения курсора
   */
  _updateHoverPlane(clientX, clientY) {
    if (!this.game.raycasterManager || !this._hoverPlane.visible) return;
    
    
    let cell = this.clientToCell(clientX, clientY);
    
    if (cell) {
      const maxCell = GAME_SETTINGS.BASE_PLATFORM_SIZE / 2;

      if (((cell.x >= -maxCell) && (cell.x < maxCell)) &&
          ((cell.y >= -maxCell) && (cell.y < maxCell))) {
      
        // Если ячейка изменилась, обновляем позицию
        if (!this._lastHoverCell || !cell.equals(this._lastHoverCell)) {

          this._lastHoverCell = cell.clone();
          
          const center = GAME_SETTINGS.CELL_SIZE / 2;
          // Вычисляем позицию центра ячейки
          const posX = cell.x * GAME_SETTINGS.CELL_SIZE + center;
          const posZ = cell.y * GAME_SETTINGS.CELL_SIZE + center;
          
          // Обновляем позицию плоскости подсветки
          this._hoverPlane.position.x = posX;
          this._hoverPlane.position.z = posZ;
          eventBus.emit('change-ground-cell', cell);
        }

        return cell;
      }

      return null;
    }
  }

  hoverShow(visible, accessVis, colors = ['#00FF00', '#FF0000']) {
    let is_mobile = window.matchMedia("(pointer: coarse)").matches;
    this._hoverPlane.visible = visible && !is_mobile;
    this._materialHover.color.setStyle(accessVis ? colors[0] : colors[1]);
  }

  onClick(hit, eventData) {

    const c = GAME_SETTINGS.CELL_SIZE / 2;
    const p = new Vector2Int(Math.round((hit.point.x - c) / GAME_SETTINGS.CELL_SIZE), Math.round((hit.point.z - c) / GAME_SETTINGS.CELL_SIZE));
    
    //if (DEV) 
      //this.game.cameraController.setLookCell(p);
    tracer.log(p);
    eventBus.emit('ground-click', p);

    //this.game.showAchievEffect(hit.point.x, 0, hit.point.z);
  }

  /**
   * Получает экранные координаты центра ячейки
   * @param {Vector2Int} cell - координаты ячейки
   * @returns {THREE.Vector2|null} экранные координаты (x, y) в пикселях, или null если точка за камерой
   */
  getScreenPosition(cell = null) {

    if (cell == null)
      cell = this._lastHoverCell;

    if (!this.game || !this.game.camera || !cell) return null;
    
    const camera = this.game.camera;
    const center = GAME_SETTINGS.CELL_SIZE / 2;
    
    // Получаем мировые координаты центра ячейки
    const worldPos = new THREE.Vector3(
      cell.x * GAME_SETTINGS.CELL_SIZE + center,
      0,
      cell.y * GAME_SETTINGS.CELL_SIZE + center
    );
    
    // Проецируем на экран
    const screenPos = worldPos.clone().project(camera);
    
    // Проверяем, находится ли точка перед камерой
    if (screenPos.z <= 0 || screenPos.z > 1) {
      return null;
    }
    
    // Получаем размеры окна
    const width = this.game.container.width();
    const height = this.game.container.height();
    
    // Преобразуем нормализованные координаты (-1..1) в пиксели
    const screenX = (screenPos.x + 1) / 2 * width;
    const screenY = (1 - (screenPos.y + 1) / 2) * height;
    
    return new THREE.Vector2(screenX, screenY);
  }

  /**
   * Проверяет, находится ли ячейка в пределах видимости с учетом отступа
   * @param {Vector2Int} cell - координаты ячейки
   * @param {number} margin - отступ от края экрана в пикселях (если не указан, используется this.viewMargin)
   * @returns {boolean} true, если ячейка находится в пределах видимости с учетом отступа
   */
  isCellInViewWithMargin(cell, margin = null) {
    const marginPx = margin !== null ? margin : this.viewMargin;
    const screenPos = this.getScreenPosition(cell);
    
    if (!screenPos) return false;
    
    const width = this.game.container.width();
    const height = this.game.container.height();
    
    // Проверяем, находится ли точка в пределах экрана с учетом отступа
    return screenPos.x >= marginPx && 
           screenPos.x <= width - marginPx && 
           screenPos.y >= marginPx && 
           screenPos.y <= height - marginPx;
  }

  /**
   * Проверяет, находится ли ячейка в пределах видимости камеры (без отступа)
   * @param {Vector2Int} cell - координаты ячейки
   * @returns {boolean} true, если ячейка находится в пирамиде видимости
   */
  isCellInView(cell) {
    if (!this.game || !this.game.camera) return true;
    
    const camera = this.game.camera;
    const frustum = new THREE.Frustum();
    const projScreenMatrix = new THREE.Matrix4();
    
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    
    // Получаем центр ячейки в мировых координатах
    const center = GAME_SETTINGS.CELL_SIZE / 2;
    const worldPos = new THREE.Vector3(
      cell.x * GAME_SETTINGS.CELL_SIZE + center,
      0,
      cell.y * GAME_SETTINGS.CELL_SIZE + center
    );
    
    // Проверяем, попадает ли точка в пирамиду видимости
    return frustum.containsPoint(worldPos);
  }

  /**
   * Получает смещение камеры, необходимое для отображения указанной ячейки
   * @param {Vector2Int} cell - координаты целевой ячейки
   * @param {number} margin - отступ от края экрана в пикселях (если не указан, используется this.viewMargin)
   * @returns {Vector2Int|null} смещение в клетках для центрирования ячейки, или null если ячейка уже в зоне видимости с учетом отступа
   */
  getCameraOffsetForCell(cell, margin = null) {
    if (!this.game || !this.game.cameraController) return null;
    
    // Проверяем, видна ли ячейка с учетом отступа
    if (this.isCellInViewWithMargin(cell, margin)) {
      return null;
    }
    
    const look = this.game.cameraController.getLookCell();look
    
    return new Vector2Int(cell.x - look.x, cell.y - look.y);
  }

  /**
   * Устанавливает отступ от края экрана для проверки видимости
   * @param {number} margin - отступ в пикселях
   */
  setViewMargin(margin) {
    this.viewMargin = Math.max(0, margin);
  }

  /**
   * Получает текущий отступ
   * @returns {number} отступ в пикселях
   */
  getViewMargin() {
    return this.viewMargin;
  }

  /**
   * Возвращает абсолютные координаты текущей позиции ячейки под курсором
   * в системе координат плоскости Ground (в мировых координатах)
   * @returns {THREE.Vector3|null} абсолютные координаты (x, y, z) или null, если ячейка не подсвечена
   */
  getCurrentCellWorldPosition() {
    // Проверяем, активна ли подсветка и есть ли ячейка
    if (!this._hoverPlane || !this._hoverPlane.visible || this._lastHoverCell === null) {
      return null;
    }
    
    // Получаем позицию плоскости подсветки (это центр ячейки в мировых координатах)
    const worldPos = this._hoverPlane.position.clone();
    
    // Добавляем небольшое смещение по Y, чтобы точка была на поверхности грунта
    worldPos.y = 0.02;
    
    return worldPos;
  }

  /**
   * Возвращает абсолютные координаты для указанных координат ячейки
   * @param {number} cellX - координата X ячейки
   * @param {number} cellZ - координата Z ячейки
   * @returns {THREE.Vector3} абсолютные координаты центра ячейки
   */
  getCellWorldPosition(cellX, cellZ) {
    const center = GAME_SETTINGS.CELL_SIZE / 2;
    return new THREE.Vector3(
      cellX * GAME_SETTINGS.CELL_SIZE + center,
      0.02,
      cellZ * GAME_SETTINGS.CELL_SIZE + center
    );
  }

  /**
   * Возвращает текущие координаты ячейки под курсором
   * @returns {Object|null} объект с полями cellX и cellZ, или null если ячейка не подсвечена
   */
  getCurrentCellCoordinates() {
    if (!this._hoverPlane || !this._hoverPlane.visible || this._lastHoverCell === null) {
      return null;
    }
    
    return {
      cellX: this._lastHoverCell.x,
      cellZ: this._lastHoverCell.y
    };
  }
  
  loadTexture() {
    let repeat = { x: GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.GROUND_DENSITY, 
                  y: GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.GROUND_DENSITY };
    if (this.texturePath) {
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
    } else 
      this.createFallbackTexture();
  }
  
  createFallbackTexture() {

    const color = new THREE.Color(this.baseColor);

    // Создаем простую текстуру-заглушку для грунта
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Базовый цвет грунта
    ctx.fillStyle = '#' + color.getHexString();
    ctx.fillRect(0, 0, 256, 256);
    
    // Добавляем текстуру - точки и линии
    ctx.fillStyle = '#' + color.multiplyScalar(0.2).getHexString();
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 3 + 1;
      
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Добавляем линии-травинки
    ctx.strokeStyle = '#' + color.multiplyScalar(0.6).getHexString();
    ctx.lineWidth = 1;
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 256;
      const yStart = Math.random() * 256;
      const yEnd = yStart + Math.random() * 20;
      const len = 5 + Math.random() * 10;
      const a = Math.random() * Math.PI * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, yStart);
      ctx.lineTo(x + Math.sin(a) * len, yStart + Math.cos(a) * len);
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
  
  update(deltaTime) {
    // Можно добавить анимацию текстурных координат для эффекта движения
    // if (this._texture) {
    //   this._texture.offset.x += deltaTime * 0.01;
    //   this._texture.offset.y += deltaTime * 0.01;
    // }
  }

  /**
   * Очищает ресурсы при уничтожении объекта
   */
  dispose() {

    this._closeHoverTraking();
    super.dispose();
  }
}