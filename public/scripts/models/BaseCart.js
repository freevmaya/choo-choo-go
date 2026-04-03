class BaseCart extends BaseGameObject {
	constructor() {
		super();

        this.velocity = 0;
        this.weight = this.defaultWeight();
        this.forwardTrain = true;

        this.moveDelta = 0;
	}

    init(game, data) {
        super.init(game);
        let index = this.game.items.find(data.location[0], data.location[1]);
        if (index > -1) {
            this.trackPos = new PositionCart(this, index);
            if (data.trackPos)
                this.trackPos.setCurrentChain(index, data.trackPos.pathIndex, data.trackPos.indexPosInChain, data.trackPos.forwardInTrack);
         
            this.forwardTrain = typeof data.location[2] == 'boolean' ? data.location[2] : true;
            this.updatePosition();
        }
        return this;
    }

    index() {
        return this.game.items.carts.indexOf(this);
    }

    defaultWeight() {
        return 1;
    }

    toSaveData() {
        let cellPos = this.getCellPosition();
        return {
            type: this.constructor.name,
            location: [cellPos.x, cellPos.y, this.forwardTrain],
            trackPos: this.trackPos.toSaveData()
        }
    }

    getCellPosition() {
        if (this.trackPos.currentTrack)
            return this.trackPos.currentTrack.getCellPosition();
        return super.getCellPosition();
    }

    sizeRadius() {
        let size = this.size(); 
        return Math.max(size.width, size.length) / 2;
    }

	size() {
		let wweight = 0.14;
		return {
			width: GAME_SETTINGS.RAIL_SPACE, 
			height: GAME_SETTINGS.RAIL_SPACE, 
			length: GAME_SETTINGS.TRAIN_LEIGHT,
            captureLenght: 0.3,
            baseLength: GAME_SETTINGS.TRAIN_LEIGHT - 0.6,
			wheel: {
				width: wweight,
				radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS
			}
		};
	}

	getWheelPositions() {

		let size = this.size();
        let fc = size.width / 2 + size.wheel.width / 2;
        let d = this.baseLength / 3;
		return [
            { x: -d, z: -fc, radius: size.wheel.radius },
            { x: -d, z: fc, radius: size.wheel.radius },
            { x: d, z: -fc, radius: size.wheel.radius },
            { x: d, z: fc, radius: size.wheel.radius }
        ]
	}

    createBox(length, height, width, material) {
        const boxGeo = new THREE.BoxGeometry(length, height, width);
        const boxPlate = new THREE.Mesh(boxGeo, material);
        boxPlate.castShadow = true;
        this._registerGeometry(boxGeo);
        this.base.add(boxPlate);
        return boxPlate;
    }

	createModel() {

        let size = this.size();
        this.baseLength = size.length - size.captureLenght * 2;

        this.base = new THREE.Group();
        const group = new THREE.Group();

        this.base.rotation.y = PI_HALF;

        group.add(this.base);

        const mainColor = 0xFF4444;
        const wheelColor = 0x333333;
        const rimColor = 0xCCCC33;

        this.mainMaterial = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.4, metalness: 0.3 });
        const rimMaterial = new THREE.MeshStandardMaterial({ color: rimColor, roughness: 0.3, metalness: 0.8});
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: wheelColor, roughness: 0.6, metalness: 0.7});
        const lampMaterial = new THREE.MeshStandardMaterial({ color: 0xFFAA66, emissive: 0xFF4422, emissiveIntensity: 0.6 });

        this._registerMaterial(this.mainMaterial);
        this._registerMaterial(rimMaterial);
        this._registerMaterial(wheelMaterial);
        this._registerMaterial(lampMaterial);
        
        // ========== ОСНОВНОЙ КОРПУС ==========
        // Нижняя платформа
        const basePlate = this.createBox(this.baseLength, 0.2, size.width, this.mainMaterial);
        basePlate.position.y = GAME_SETTINGS.TRAIN_WHEEL_RADIUS;

        this.createBox(size.captureLenght, size.captureLenght / 2, size.captureLenght / 2, this.mainMaterial)
            .position.set((size.length - size.captureLenght) / 2, basePlate.position.y, 0);

        this.createBox(size.captureLenght, size.captureLenght / 2, size.captureLenght / 2, this.mainMaterial)
            .position.set(-(size.length - size.captureLenght) / 2, basePlate.position.y, 0);
        
        // ========== ФАРА ==========
        
        const lampGeo = new THREE.SphereGeometry(0.13, 16, 16);
        const lamp = new THREE.Mesh(lampGeo, lampMaterial);
        lamp.position.set(this.baseLength / 2, basePlate.position.y, 0);
        lamp.castShadow = true;
        this._registerGeometry(lampGeo);
        this.base.add(lamp);
        
        // ========== КОЛЁСА ==========
        this.wheels = [];

        const wheelPositions = this.getWheelPositions();
        
        wheelPositions.forEach((pos) => {

            let wheelGroup = new THREE.Group();

            // Основное колесо
            const wheelGeo = new THREE.CylinderGeometry(pos.radius, pos.radius, size.wheel.width - .02, 24);
            const wheel = new THREE.Mesh(wheelGeo, wheelMaterial);
            wheel.rotation.x = PI_HALF;
            wheel.castShadow = true;
            this._registerGeometry(wheelGeo);
            wheelGroup.add(wheel);
            
            // Ободок
            const rimGeo = new THREE.CylinderGeometry(pos.radius - 0.05, pos.radius - 0.05, size.wheel.width, 24);
            const rim = new THREE.Mesh(rimGeo, rimMaterial);
            rim.rotation.x = PI_HALF;
            rim.castShadow = true;
            this._registerGeometry(rimGeo);
            wheelGroup.add(rim);
            
            // Спицы (крестовина)
            const spokeMat = new THREE.MeshStandardMaterial({ color: 0xCCCC99, metalness: 0.8 });
            this._registerMaterial(spokeMat);
            
            const spoke1Geo = new THREE.BoxGeometry(0.08, 0.08, pos.radius * 1.4);
            const spoke1 = new THREE.Mesh(spoke1Geo, spokeMat);
            spoke1.rotation.x = PI_HALF;
            spoke1.rotation.z = Math.PI / 4;
            this._registerGeometry(spoke1Geo);
            spoke1.position.set(0, 0, (size.wheel.width - 0.08) * (pos.z < 0 ? 1 : -1));
            wheelGroup.add(spoke1);
            /*
            const spoke2Geo = new THREE.BoxGeometry(0.08, 0.08, pos.radius * 1.4);
            const spoke2 = new THREE.Mesh(spoke2Geo, spokeMat);
            spoke2.rotation.x = Math.PI;
            spoke2.rotation.z = -Math.PI / 4;
            spoke2.position.set(0, 0, size.wheel.width);
            this._registerGeometry(spoke2Geo);
            wheelGroup.add(spoke2);*/

            wheelGroup.position.set(pos.x, pos.radius, pos.z);
            wheelGroup.rotation.y = Math.PI;

            this.base.add(wheelGroup);
            
            this.wheels.push({
            	group: wheelGroup,
            	radius: pos.radius
            });
            this._registerClickable(basePlate);
        });

        return group;
	}

    _afterChangeForward() {
        this.updatePosition();
    }

    setForward(value) {
        if (value != this.forwardTrain) {
            this.forwardTrain = !this.forwardTrain;
            this.trackPos.forwardInTrack = !this.trackPos.forwardInTrack;
            this._afterChangeForward();
        }
    }
    
    updateWheels(deltaTime) {
        if (this.isMoving()) {
        
	        this.wheels.forEach(wheel => {
	            wheel.group.rotation.z += this.moveDelta / wheel.radius * (this.forwardTrain ? 1 : -1);
	        });
	    }
    }

    getAlt() {
        return GAME_SETTINGS.SLEEPER_HEIGHT / 2  + GAME_SETTINGS.RAIL_HEIGHT / 2;
    }

    updatePosition() {

        if (this.trackPos.currentTrack) {
            let pos = this.trackPos.calcLocation();

            let lastPos = this.getPosition();
            this.setPosition(pos.x, this.getAlt(), pos.z);
            this.setRotation(0, pos.angle + (this.forwardTrain ? 0 : Math.PI), 0);

            this.moveDelta = this.getPosition().sub(lastPos).length();
            //this.checkOverScreen(currentTrack);
        }
    }
    
    update(dt) {
        this.updateWheels(dt);
        this.updatePosition();
    }

    isMoving() {
    	return Math.abs(this.velocity) > 0.02;
    }
}

registerClass(BaseCart);