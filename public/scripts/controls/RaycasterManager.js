// scripts/controls/RaycasterManager.js

class RaycasterManager {
  constructor(game) {
    this.game = game;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.enabled = true;
    this.clickableObjects = new Set(); // Объекты, которые могут быть кликабельны
    this.debugMode = false; // Для отладки, показывает луч
    
    // Привязываем методы с сохранением контекста
    this.onClick = this.onClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    
    this.init();
  }
  
  init() {
    // Используем нативный DOM API вместо jQuery для критичных обработчиков
    const containerElement = this.game.container[0];
    
    // События мыши через нативный API
    containerElement.addEventListener('click', this.onClick);
    containerElement.addEventListener('mousedown', this.onMouseDown);
    
    // События тачскрина
    containerElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    containerElement.addEventListener('touchend', this.onTouchEnd);
    
    // Если нужен debug режим
    if (this.debugMode) {
      this.createDebugHelper();
    }
  }
  
  /**
   * Добавляет объект в список кликабельных
   * @param {THREE.Object3D} object - объект для отслеживания
   */
  addClickableObject(object) {
    if (object) {
      this.clickableObjects.add(object);
    }
  }
  
  /**
   * Удаляет объект из списка кликабельных
   * @param {THREE.Object3D} object - объект для удаления
   */
  removeClickableObject(object) {
    this.clickableObjects.delete(object);
  }
  
  /**
   * Очищает список кликабельных объектов
   */
  clearClickableObjects() {
    this.clickableObjects.clear();
  }
  
  /**
   * Получает позицию мыши/пальца в нормализованных координатах
   * @param {number} clientX - X координата
   * @param {number} clientY - Y координата
   * @returns {THREE.Vector2} нормализованные координаты
   */
  getMousePosition(clientX, clientY) {
    const rect = this.game.container[0].getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;
    return new THREE.Vector2(x, y);
  }
  
  /**
   * Выполняет рейкастинг и возвращает пересечения
   * @param {number} clientX - X координата
   * @param {number} clientY - Y координата
   * @param {Array} customObjects - опциональный массив объектов для проверки
   * @returns {Array} отсортированный массив пересечений
   */
  raycast(clientX, clientY, customObjects = null) {
    if (!this.enabled) return [];
    
    // Получаем позицию мыши
    this.mouse.copy(this.getMousePosition(clientX, clientY));
    
    // Устанавливаем луч из камеры
    const camera = this.game.cameraController.getCamera();
    this.raycaster.setFromCamera(this.mouse, camera);
    
    // Определяем объекты для проверки
    const objectsToCheck = customObjects || Array.from(this.clickableObjects);
    
    if (objectsToCheck.length === 0) return [];
    
    // Выполняем рейкастинг
    const intersects = this.raycaster.intersectObjects(objectsToCheck, true);
    
    // Сортируем по расстоянию от камеры
    intersects.sort((a, b) => a.distance - b.distance);
    
    // Добавляем дополнительную информацию
    const enrichedIntersects = intersects.map(intersect => ({
      ...intersect,
      distanceFromCamera: intersect.distance,
      clickPosition: {
        x: clientX,
        y: clientY
      }
    }));
    
    return enrichedIntersects;
  }
  
  /**
   * Обработчик клика мыши
   * @param {MouseEvent} event - событие мыши
   */
  onClick(event) {
    if (!this.enabled) return;
    
    // Получаем координаты
    const clientX = event.clientX;
    const clientY = event.clientY;
    
    // Выполняем рейкастинг
    const intersects = this.raycast(clientX, clientY);
    
    if (intersects.length > 0) {
      // Генерируем событие клика
      this.dispatchEvent('gameObject:click', {
        type: 'click',
        originalEvent: event,
        intersects: intersects,
        mousePosition: { x: clientX, y: clientY }
      });
      
      // Генерируем событие для каждого объекта отдельно
      intersects.forEach((intersect, index) => {
        const targetObject = intersect.object;
        
        // Находим корневой объект, если это вложенный объект
        let rootObject = targetObject;
        while (rootObject.parent && !this.clickableObjects.has(rootObject)) {
          rootObject = rootObject.parent;
        }
        
        const objectId = rootObject.id || rootObject.uuid;
        if (this.clickableObjects.has(rootObject) || this.clickableObjects.has(targetObject)) {
          this.dispatchEvent(`gameObject:click:${objectId}`, {
            type: 'click',
            originalEvent: event,
            intersect: intersect,
            index: index,
            totalHits: intersects.length,
            rootObject: rootObject
          });
        }
      });
    } else {
      // Клик мимо объектов
      this.dispatchEvent('gameObject:click:miss', {
        type: 'click',
        originalEvent: event,
        mousePosition: { x: clientX, y: clientY }
      });
    }
  }
  
  /**
   * Обработчик mousedown
   * @param {MouseEvent} event - событие мыши
   */
  onMouseDown(event) {
    if (!this.enabled) return;
    
    const clientX = event.clientX;
    const clientY = event.clientY;
    const intersects = this.raycast(clientX, clientY);
    
    if (intersects.length > 0) {
      this.dispatchEvent('gameObject:mousedown', {
        type: 'mousedown',
        originalEvent: event,
        intersects: intersects,
        mousePosition: { x: clientX, y: clientY }
      });
    }
  }
  
  /**
   * Обработчик тач-события
   * @param {TouchEvent} event - событие касания
   */
  onTouchStart(event) {
    if (!this.enabled) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    if (!touch) return;
    
    // Выполняем рейкастинг
    const intersects = this.raycast(touch.clientX, touch.clientY);
    
    if (intersects.length > 0) {
      // Генерируем событие тапа с правильной структурой
      this.dispatchEvent('gameObject:tap', {
        type: 'tap',
        originalEvent: event,
        touch: touch,
        intersects: intersects
      });
      
      // Генерируем события для каждого объекта
      intersects.forEach((intersect, index) => {
        const targetObject = intersect.object;
        
        let rootObject = targetObject;
        while (rootObject.parent && !this.clickableObjects.has(rootObject)) {
          rootObject = rootObject.parent;
        }
        
        const objectId = rootObject.id || rootObject.uuid;
        if (this.clickableObjects.has(rootObject) || this.clickableObjects.has(targetObject)) {
          this.dispatchEvent(`gameObject:tap:${objectId}`, {
            type: 'tap',
            originalEvent: event,
            intersect: intersect,
            touch: touch,
            index: index,
            rootObject: rootObject
          });
        }
      });
    } else {
      this.dispatchEvent('gameObject:tap:miss', {
        type: 'tap',
        originalEvent: event,
        touch: touch
      });
    }
  }
  
  /**
   * Обработчик touchend
   * @param {TouchEvent} event - событие завершения касания
   */
  onTouchEnd(event) {
    if (!this.enabled) return;
    
    this.dispatchEvent('gameObject:touchend', {
      type: 'touchend',
      originalEvent: event
    });
  }
  
  /**
   * Безопасная отправка событий через eventBus
   * @param {string} eventName - имя события
   * @param {Object} data - данные события
   */
  dispatchEvent(eventName, data) {
    // Используем setTimeout для асинхронной обработки, чтобы не блокировать основной поток
    setTimeout(() => {
      try {
        eventBus.emit(eventName, data);
      } catch (error) {
        console.warn(`Error dispatching event ${eventName}:`, error);
      }
    }, 0);
  }
  
  /**
   * Создает визуальный помощник для отладки лучей
   */
  createDebugHelper() {
    this.debugLines = [];
    
    // Создаем материал для линии
    this.debugMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    
    // Подписываемся на события для отображения лучей
    eventBus.on('gameObject:click', (data) => {
      if (data.intersects && data.intersects[0]) {
        this.showRay(data.intersects[0].point);
      }
    });
    
    eventBus.on('gameObject:tap', (data) => {
      if (data.intersects && data.intersects[0]) {
        this.showRay(data.intersects[0].point);
      }
    });
  }
  
  /**
   * Показывает луч от камеры до точки попадания
   * @param {THREE.Vector3} point - точка попадания
   */
  showRay(point) {
    if (!this.debugMode || !point) return;
    
    // Удаляем старые линии
    this.debugLines.forEach(line => {
      if (line.parent) this.game.scene.remove(line);
      if (line.geometry) line.geometry.dispose();
      if (line.material) line.material.dispose();
    });
    this.debugLines = [];
    
    // Создаем новую линию
    const cameraPos = this.game.cameraController.getCamera().position.clone();
    const points = [cameraPos, point.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, this.debugMaterial);
    
    this.game.scene.add(line);
    this.debugLines.push(line);
    
    // Добавляем сферу в точке попадания
    const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(point);
    this.game.scene.add(sphere);
    this.debugLines.push(sphere);
    
    // Удаляем через 0.5 секунды
    setTimeout(() => {
      this.debugLines.forEach(line => {
        if (line.parent) this.game.scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
      });
      this.debugLines = [];
    }, 500);
  }
  
  /**
   * Включает/выключает рейкастер
   * @param {boolean} enabled - состояние
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }
  
  /**
   * Включает режим отладки
   * @param {boolean} enabled - состояние
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    if (enabled && !this.debugLines) {
      this.createDebugHelper();
    }
  }
  
  /**
   * Очищает все ресурсы
   */
  dispose() {
    const containerElement = this.game.container[0];
    
    // Удаляем обработчики событий
    containerElement.removeEventListener('click', this.onClick);
    containerElement.removeEventListener('mousedown', this.onMouseDown);
    containerElement.removeEventListener('touchstart', this.onTouchStart);
    containerElement.removeEventListener('touchend', this.onTouchEnd);
    
    this.clickableObjects.clear();
    
    if (this.debugLines) {
      this.debugLines.forEach(line => {
        if (line.parent) this.game.scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
      });
      this.debugLines = [];
    }
    
    if (this.debugMaterial) {
      this.debugMaterial.dispose();
    }
  }
}