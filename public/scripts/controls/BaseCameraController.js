class BaseCameraController {
	constructor(game, options = null) {

	    this.options = {...options, ...{
	      followSpeed: CAMERA_FOLLOW_SPEED,
	      dragSensitivity: 0.001,

	    // Параметры масштабирования
	      minScale: 0.5,        // Минимальное приближение (дальше)
	      maxScale: 2.0,        // Максимальное приближение (ближе)
	      zoomSpeed: 0.05,      // Скорость масштабирования (мышь)
	      pinchSpeed: 0.005,    // Скорость масштабирования (щипок)
	      
	      // Параметры вращения
	      rotationSpeed: 0.01,   // Скорость вращения камеры
	      rotationSensitivity: 0.5, // Чувствительность вращения
	      folowGrid: false
	    }};

    	this.game = game;
		this.camera = game.camera;

	    this.scaleFocus = 1;
	    this.targetFocus = this.calcTargetFocus();

	    this.heightOffset = CAMERA_HEIGHT_OFFSET;
	    this.lookPoint = new THREE.Vector2();
	    this.targetPoint = new THREE.Vector2();

    	this.angle = Math.PI / 4; // Начальный угол камеры
    	this.enabled = true;

    	this.pointer = $(`<div class="train-pointer"><div><i class="bi bi-arrow-up-short"></i></div></div>`);
    	this.pointer.click(this.onPointerClick.bind(this));

    	this.game.game_container.append(this.pointer);
    	this.timerPointer = setInterval(this.updatePointer.bind(this), 200);
	}

	setEnable(value) {
		if (this.enabled != value) {
			this.enabled = value;
		}
	}

	updatePointer() {
		let point_edge = this.getTrainEdge();
		this.setTrainOutside(point_edge);
	}

	setTrainOutside(point_edge) {
		let lastNull = this.point_edge == null;

		this.point_edge = point_edge;
		if ((lastNull && point_edge) || (!lastNull && !point_edge))
			this.afterChangeTrainOutside();

		if (this.point_edge) {
			this.pointer.css({...{display: 'flex'}, ...this.point_edge});
		} else this.pointer.css({display: 'none'});
	}

	isTrainOutside() {
		return this.point_edge != null;
	}

	afterChangeTrainOutside() {

	}

	getTrainEdge() {
		if (this.game.items) {
			let trains = this.game.items.findTrains();
			if (trains.length > 0) {
				let pos = this.game.ground.getScreenPosition(trains[0].getCellPosition());
				return this.calcEdgePoint(pos, Bounds.fromElement(this.game.container[0]));
			}
		}

		return null;
	}

	calcEdgePoint(pos, bounds) {
	    // Если точка внутри bounds — возвращаем null
	    if (bounds.containsPoint(pos.x, pos.y)) {
	        return null;
	    }

	    // Ограничиваем точку границами bounds
	    const edge = new Vector2Int(Math.min(bounds.right, Math.max(bounds.left, pos.x)), 
	    						Math.min(bounds.bottom, Math.max(bounds.top, pos.y)));

	    // Центр области
	    const centerX = bounds.x + bounds.w / 2;
	    const centerY = bounds.y + bounds.h / 2;

	    // Вектор от центра до точки на границе
	    const dx = edge.x - centerX;
	    const dy = edge.y - centerY;
	    const rotation = Math.atan2(dy, dx) + Math.PI / 2;
	    const degrees = rotation * 180 / Math.PI;
	    const delta = edge.clone().sub(pos);
	    delta.x = addIgnoreSign(delta.x, 40);
	    delta.y = addIgnoreSign(delta.y, 40);
	    const vPoint = pos.clone().add(delta);

	    return {
	        left: vPoint.x,
	        top: vPoint.y,
	        transform: `rotate(${degrees}deg)`,
	        pos: pos,
	        edge: edge
	    };
	}

	onPointerClick() {
		this.trainToVisibility();
	}

	trainToVisibility() {
		if (this.point_edge) {

			let delta = this.screenToWorldPoint(this.point_edge.pos)
							.sub(this.screenToWorldPoint(this.point_edge.edge));

			//delta.multiplyScalar(2);
			let newCellX = this.lookPoint.x + addIgnoreSign(delta.x / this.cellSize(), 1);
			let newCellY = this.lookPoint.y + addIgnoreSign(delta.z / this.cellSize(), 1);
			this.setLookCell(new THREE.Vector2(newCellX, newCellY));
			this.point_edge = null;
		}
	}

	reset() {
		this.camera.position.set(0, 0, 12);
		this.camera.lookAt(0, this.camera.position.y, 0);
		this.targetPoint.set(0, 0);
		this.lookPoint.set(0, 0);
		this.scaleFocus = 1;
		this.targetFocus = this.calcTargetFocus();
		this.angle = Math.PI / 4;
	}
  
	resize(aspectRatio) {
		this.camera.aspect = aspectRatio;
		this.targetFocus = this.calcTargetFocus();
		this.camera.updateProjectionMatrix();
	}

	begin() {
		this.targetFocus = this.calcTargetFocus();
	}

	calcTargetFocus() {
		let minsize = Math.min(this.game.container.width(), this.game.container.height());
		let k = Math.min(minsize / MAXSCREENSIZE, 1);
		let baseFocus = lerp(CAMERA_FOCUS[0], CAMERA_FOCUS[1], k);

		let newFocus = baseFocus / this.scaleFocus;
		return Math.max(10, Math.min(80, newFocus));
	}

	getZoom() {
		return this.scaleFocus;
	}

	setZoom(scale) {
		let newScale = Math.max(this.options.minScale, Math.min(this.options.maxScale, scale));

		if (newScale !== this.scaleFocus) {
		  this.scaleFocus = newScale;
		  this.targetFocus = this.calcTargetFocus();
		}
	}

	getLookCell() {
		return this.targetPoint.clone();
	}

	setLookCell(value) {
		this.targetPoint = value;
	}

	setFocus(f) {
		this.camera.fov = f;
		this.camera.updateProjectionMatrix();
	}

	cellSize() {
		return this.game.getConst('CELL_SIZE');
	}

	update(dt) {

		let cellSize = this.cellSize();
		this.lookPoint.x = this.lookPoint.x + (this.targetPoint.x - this.lookPoint.x) * this.options.followSpeed * dt;
		this.lookPoint.y = this.lookPoint.y + (this.targetPoint.y - this.lookPoint.y) * this.options.followSpeed * dt;

		let lookAt;
		if (this.options.folowGrid) {

		  let center = cellSize / 2;

		  lookAt = new THREE.Vector3(this.lookPoint.x * cellSize + center, 0, 
		      this.lookPoint.y * cellSize + center);
		} else {
		  lookAt = new THREE.Vector3(this.lookPoint.x, 0, this.lookPoint.y);
		}

		let camPos = new THREE.Vector3(-this.heightOffset, this.heightOffset, 0);
		const euler = new THREE.Euler(0, this.angle, 0);
		camPos.applyEuler(euler);

		this.camera.position.set(lookAt.x + camPos.x, lookAt.y + camPos.y, lookAt.z + camPos.z);
		this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
		this.setFocus(this.camera.fov + (this.targetFocus - this.camera.fov) * dt * this.options.followSpeed);
	}

	/*
	Преобразует экранные координаты в мировую точку на плоскости Y=0
	*/
	screenToWorldPoint(screenX, screenY = null) {
		if (screenX instanceof Object) {
			screenY = screenX.y;
			screenX = screenX.x;
		}

		const rect = this.game.container[0].getBoundingClientRect();
		const mouseX = ((screenX - rect.left) / rect.width) * 2 - 1;
		const mouseY = -((screenY - rect.top) / rect.height) * 2 + 1;

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), this.camera);

		// Находим пересечение с плоскостью Y = 0
		const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
		const intersectionPoint = new THREE.Vector3();

		if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
			return intersectionPoint;
		}
		return null;
	}

	dispose() {
		clearInterval(this.timerPointer);
	}
}