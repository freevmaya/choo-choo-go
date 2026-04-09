// scripts/core/CameraController.js

class CameraController extends BaseCameraController {

  constructor(game, options = null) {

    super(game, options);

    this.game = game;

    // Параметры перетаскивания камеры (левая кнопка)
    this.isDraggingCamera = false;
    this.dragStartScreen = new THREE.Vector2();
    this.dragStartLookPoint = new THREE.Vector2();
    
    // Параметры вращения камеры (правая кнопка мыши)
    this.isRotating = false;
    this.rotationStartX = 0;
    this.rotationStartAngle = 0;
    
    // Для отслеживания жеста щипка
    this.initialPinchDistance = 0;
    this.initialScale = 1;
    this.isPinching = false;
    
    // Для отслеживания жеста вращения двумя пальцами
    this.isRotatingWithTouch = false;
    this.initialTouchAngle = 0;
    this.initialRotateAngle = 0;
    this.touchStartPoints = { x1: 0, y1: 0, x2: 0, y2: 0 };
    this.initialCenterPoint = new THREE.Vector2(); // Центр между пальцами в начале
    this.initialLookPoint = new THREE.Vector2();   // Точка обзора в начале вращения

    // Привязываем методы
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onWheel = this.onWheel.bind(this);

    // Инициализируем обработчики
    this.initCameraDrag();
    this.initZoom();

    $(window).on('keydown', (e) => {
      const key = e.key.toLowerCase();
      
      switch(key) {
          case 'a':
              this.angle -= Math.PI * 0.05;
              break;
          case 'd':
              this.angle += Math.PI * 0.05;
              break;
      }
    });
  }

  getLookDirection() {
    let direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    return direction;
  }

  /**
   * Инициализирует обработчики для масштабирования
   */
  initZoom() {
    const containerElement = this.game.container[0];
    containerElement.addEventListener('wheel', this.onWheel, { passive: false });
  }

  onWheel(event) {
    
    event.preventDefault();
    const delta = event.deltaY > 0 ? -this.options.zoomSpeed : this.options.zoomSpeed;
    this.setZoomDelta(delta);
  }

  setZoomDelta(delta) {
    let newScale = this.scaleFocus + delta;
    // Ограничиваем масштаб
    newScale = Math.max(this.options.minScale, Math.min(this.options.maxScale, newScale));
    
    if (newScale !== this.scaleFocus) {
      this.scaleFocus = newScale;
      this.targetFocus = this.calcTargetFocus();
    }
  }

  initCameraDrag() {
    const containerElement = this.game.container[0];
    
    // События мыши
    containerElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    
    // События тачскрина
    containerElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchcancel', this.onTouchEnd);
    containerElement.addEventListener('mouseleave', (e)=>{
      if (this.isDraggingCamera)
        this.stopCameraDrag();
    });
  }

  getTouchAngle(touches) {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.atan2(dy, dx);
  }

  getPinchDistance(touches) {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Получает среднюю точку между двумя касаниями
   */
  getCenterPoint(touches) {
    if (touches.length < 2) return null;
    const centerX = (touches[0].clientX + touches[1].clientX) / 2;
    const centerY = (touches[0].clientY + touches[1].clientY) / 2;
    return new THREE.Vector2(centerX, centerY);
  }

  setEnable(value) {
    super.setEnable(value);
    this.isDraggingCamera = false;
  }

  onMouseDown(event) {
    if (this.enabled) {
      
      // Правая кнопка мыши (button === 2)
      if (event.button === 2) {
        event.preventDefault();
        this.startRotation(event.clientX);
        return;
      }
      
      // Левая кнопка мыши - перетаскивание камеры
      this.startCameraDrag(event.clientX, event.clientY);
      event.preventDefault();
    }
  }

  startRotation(clientX) {
    this.isRotating = true;
    this.rotationStartX = clientX;
    this.rotationStartAngle = this.angle;
    this.game.container.css('cursor', 'ew-resize');
  }

  onMouseMove(event) {
    if (this.enabled) {
      if (this.isRotating) {
        this.updateRotation(event.clientX);
        event.preventDefault();
      } else if (this.isDraggingCamera) {
        this.updateCameraDrag(event.clientX, event.clientY);
        event.preventDefault();
      }
    }
  }

  updateRotation(clientX) {
    if (!this.isRotating) return;
    
    const deltaX = clientX - this.rotationStartX;
    // Изменяем угол камеры (чем больше дельта, тем сильнее поворот)
    this.angle = this.rotationStartAngle - deltaX * this.options.rotationSpeed;
  }

  onMouseUp() {
    if (this.enabled) {
      if (this.isRotating) {
        this.isRotating = false;
        this.game.container.css('cursor', '');
      }
      if (this.isDraggingCamera) {
        this.stopCameraDrag();
      }
    }
  }

  onTouchStart(event) {
    if (this.enabled) {
      event.preventDefault();
      const touches = event.touches;
      
      // Проверяем, начался ли жест щипка или вращения (2 пальца)
      if (touches.length === 2) {
        // Сохраняем начальные данные для щипка и вращения
        this.initialPinchDistance = this.getPinchDistance(touches);
        this.initialScale = this.scaleFocus;
        
        // Для вращения двумя пальцами - сохраняем центр между пальцами
        this.initialTouchAngle = this.getTouchAngle(touches);
        this.initialRotateAngle = this.angle;
        
        // Сохраняем центр между пальцами в экранных координатах
        const centerPoint = this.getCenterPoint(touches);
        if (centerPoint) {
          this.initialCenterPoint.copy(centerPoint);
          
          // Находим мировую точку под центром касания
          const worldPoint = this.screenToWorldPoint(centerPoint.x, centerPoint.y);
          if (worldPoint) {
            this.initialLookPoint.copy(this.targetPoint);
            this.rotationCenterWorld = worldPoint;
          } else {
            this.rotationCenterWorld = null;
          }
        }
        
        this.isRotatingWithTouch = true;
        this.isPinching = true;
        return;
      }
      
      // Один палец - перетаскивание камеры
      const touch = touches[0];
      if (touch) {
        this.startCameraDrag(touch.clientX, touch.clientY);
      }
    }
  }

  onTouchMove(event) {
    if (this.enabled) {
      event.preventDefault();
      const touches = event.touches;
      
      // Если два пальца - обрабатываем одновременно масштабирование и вращение
      if (touches.length === 2 && (this.isPinching || this.isRotatingWithTouch)) {
        // Масштабирование (щипок)
        const currentDistance = this.getPinchDistance(touches);
        if (currentDistance > 0) {
          const delta = (currentDistance - this.initialPinchDistance) * this.options.pinchSpeed;
          let newScale = this.initialScale + delta;
          newScale = Math.max(this.options.minScale, Math.min(this.options.maxScale, newScale));
          
          if (newScale !== this.scaleFocus) {
            this.scaleFocus = newScale;
            this.targetFocus = this.calcTargetFocus();
          }
        }
        
        // Вращение (поворот двумя пальцами) - вращаем вокруг средней точки
        const currentAngle = this.getTouchAngle(touches);
        const deltaAngle = currentAngle - this.initialTouchAngle;
        const newAngle = this.initialRotateAngle + deltaAngle;
        
        // Если есть центр вращения в мировых координатах, корректируем точку обзора
        if (this.rotationCenterWorld && this.initialCenterPoint) {
          // Получаем текущий центр между пальцами
          const currentCenterPoint = this.getCenterPoint(touches);
          
          if (currentCenterPoint) {
            // Находим мировую точку под текущим центром
            const currentWorldPoint = this.screenToWorldPoint(currentCenterPoint.x, currentCenterPoint.y);
            
            if (currentWorldPoint && this.rotationCenterWorld) {
              // Вычисляем смещение точки обзора, чтобы центр вращения оставался на месте
              // при изменении угла камеры
              const angleDiff = newAngle - this.angle;
              
              // Поворачиваем вектор от точки обзора к центру вращения
              const lookToCenter = new THREE.Vector2(
                this.rotationCenterWorld.x - this.targetPoint.x,
                this.rotationCenterWorld.z - this.targetPoint.y
              );
              
              const cos = Math.cos(-angleDiff);
              const sin = Math.sin(-angleDiff);
              
              const rotatedX = lookToCenter.x * cos - lookToCenter.y * sin;
              const rotatedZ = lookToCenter.x * sin + lookToCenter.y * cos;
              
              // Корректируем точку обзора так, чтобы центр вращения остался на месте
              const newTargetX = this.rotationCenterWorld.x - rotatedX;
              const newTargetY = this.rotationCenterWorld.z - rotatedZ;
              
              this.targetPoint.set(newTargetX, newTargetY);
            }
          }
        }
        
        this.angle = newAngle;
        
        return;
      }
      
      // Один палец - перетаскивание камеры
      if (this.isDraggingCamera && touches.length === 1) {
        const touch = touches[0];
        if (touch) {
          this.updateCameraDrag(touch.clientX, touch.clientY);
        }
      }
    }
  }

  onTouchEnd() {
    if (this.enabled) {
      if (this.isPinching) {
        this.isPinching = false;
        this.isRotatingWithTouch = false;
        this.rotationCenterWorld = null;
        this.initialCenterPoint.set(0, 0);
      }
      if (this.isDraggingCamera) {
        this.stopCameraDrag();
      }
    }
  }

  startCameraDrag(clientX, clientY) {
    this.isDraggingCamera = true;
    this.dragStartScreen.set(clientX, clientY);
    this.dragStartLookPoint.copy(this.targetPoint);
    
    // Добавляем класс для курсора
    this.game.container.css('cursor', 'grabbing');
  }

  updateCameraDrag(clientX, clientY) {
    if (!this.isDraggingCamera) return;
    
    // Вычисляем смещение курсора в пикселях
    let delta = new THREE.Vector3(clientY - this.dragStartScreen.y, 0, this.dragStartScreen.x - clientX);

    const quaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.angle
    );

    // Применяем поворот
    delta.applyQuaternion(quaternion);
    
    if (this.options.folowGrid) {
      // Если включено следование по сетке, используем привязку к ячейкам
      const cellSize = GAME_SETTINGS.CELL_SIZE;

      // Преобразуем смещение в смещение по ячейкам с учетом чувствительности
      const cellDeltaX = -delta.x * this.options.dragSensitivity * cellSize / this.scaleFocus;
      const cellDeltaY = -delta.z * this.options.dragSensitivity * cellSize / this.scaleFocus;
      
      // Вычисляем новую целевую точку
      let newTargetX = this.dragStartLookPoint.x - cellDeltaX;
      let newTargetY = this.dragStartLookPoint.y - cellDeltaY;
      
      // Ограничиваем движение (опционально)
      const maxCells = GAME_SETTINGS.BASE_PLATFORM_SIZE / 2;
      newTargetX = Math.max(-maxCells, Math.min(maxCells, newTargetX));
      newTargetY = Math.max(-maxCells, Math.min(maxCells, newTargetY));
      
      this.targetPoint.set(newTargetX, newTargetY);
    } else {
      // Без учета размера ячейки - плавное перемещение в мировых координатах
      // Чувствительность зависит от высоты камеры для более естественного ощущения
      const sensitivity = this.options.dragSensitivity * this.heightOffset / this.scaleFocus;
      
      // Вычисляем смещение в мировых координатах
      const deltaWorldX = delta.x * sensitivity;
      const deltaWorldY = delta.z * sensitivity;
      
      // Вычисляем новую целевую точку
      let newTargetX = this.dragStartLookPoint.x + deltaWorldX;
      let newTargetY = this.dragStartLookPoint.y + deltaWorldY;
      
      // Ограничиваем движение (опционально)
      const maxWorld = GAME_SETTINGS.BASE_PLATFORM_SIZE * GAME_SETTINGS.CELL_SIZE / 1.5;
      newTargetX = Math.max(-maxWorld, Math.min(maxWorld, newTargetX));
      newTargetY = Math.max(-maxWorld, Math.min(maxWorld, newTargetY));
      
      this.targetPoint.set(newTargetX, newTargetY);
    }

    if (this.userDraggedTimer) {
      clearTimeout(this.userDraggedTimer);
      this.userDraggedTimer = false;
    }
    
    this.userDraggedTimer = setTimeout(()=>{
      this.userDraggedTimer = false;
    }, 1000);
  }

  update(dt) {
    super.update(dt);
    if (!this.userDraggedTimer && this.isTrainOutside())
      this.trainToVisibility();
  }

  stopCameraDrag() {
    this.isDraggingCamera = false;
    this.game.container.css('cursor', '');
  }

  setLookPoint(x, y, immediate = false) {
    if (immediate) {
      this.targetPoint.set(x, y);
      this.lookPoint.set(x, y);
    } else {
      this.targetPoint.set(x, y);
    }
  }

  centerOnPosition(position, immediate = false) {
    if (this.options.folowGrid) {
      const cellX = Math.floor(position.x / GAME_SETTINGS.CELL_SIZE);
      const cellZ = Math.floor(position.z / GAME_SETTINGS.CELL_SIZE);
      this.setLookPoint(cellX, cellZ, immediate);
    } else {
      this.setLookPoint(position.x, position.z, immediate);
    }
  }

  isDragging() {
    return this.isDraggingCamera;
  }

  isRotatingCamera() {
    return this.isRotating || this.isRotatingWithTouch;
  }

  setDragSensitivity(sensitivity) {
    this.options.dragSensitivity = Math.max(0.001, Math.min(0.02, sensitivity));
  }

  getDragSensitivity() {
    return this.options.dragSensitivity;
  }

  setAngle(angle) {
    this.angle = angle;
  }

  getAngle() {
    return this.angle;
  }
  
  setPosition(x, y, z) {
    this.camera.position.set(x, y, z);
  }

  getPosition() {
    return this.camera.position.clone();
  }
  
  getCamera() {
    return this.camera;
  }
  
  dispose() {
    const containerElement = this.game.container[0];
    
    containerElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    
    containerElement.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
    
    containerElement.removeEventListener('wheel', this.onWheel);
  }
}