class Wagon extends BaseCart {
    constructor() {
        super();
        
        // Цвета
        this.wallColor = 0x4A90D9;   // Синий
        this.trimColor = 0xFFD700;   // Золотая отделка
        this.roofColor = 0x8B4513;   // Коричневая крыша
        this.windowFrameColor = 0xDEB887; // Деревянные рамы
    }

    size() {
        let size = super.size();
        size.height = 0.7;
        size.wallHeight = 0.6;
        size.wallWidth = 0.05;
        size.baseY = GAME_SETTINGS.TRAIN_WHEEL_RADIUS * 2;
        size.wallY = size.baseY + size.wallHeight / 2;
        size.wagonWidth = size.width * 1.5;
        return size;
    }
    
    defaultWeight() {
        return GAME_SETTINGS.WAGON_WEIGHT * 0.8;
    }
    
    getWheelPositions() {
        let size = this.size();
        let fc = size.width / 2 + size.wheel.width / 2;
        let d = this.baseLength / 2.5;
        return [
            { x: -d, z: -fc, radius: size.wheel.radius },
            { x: -d, z: fc, radius: size.wheel.radius },
            { x: d, z: -fc, radius: size.wheel.radius },
            { x: d, z: fc, radius: size.wheel.radius }
        ];
    }
    
    createModel() {
        let group = super.createModel();
        
        let size = this.size();
        let length = this.baseLength;
        let w2 = size.wagonWidth / 2;
        let l2 = length / 2;
        
        // Материалы
        this.wallMaterial = new THREE.MeshStandardMaterial({ 
            color: this.wallColor, 
            roughness: 0.5, 
            metalness: 0.1 
        });
        
        const trimMaterial = new THREE.MeshStandardMaterial({ 
            color: this.trimColor, 
            roughness: 0.3, 
            metalness: 0.6 
        });
        
        this._registerMaterial(this.wallMaterial);
        this._registerMaterial(trimMaterial);
        
        // ========== НИЖНЯЯ ПЛАТФОРМА ==========
        const floor = this.createBox(length, size.wallWidth, size.wagonWidth, this.wallMaterial);
        floor.position.y = size.baseY + 0.1;
        
        // ========== СТЕНЫ (до высоты окон) ==========
        // Передняя стена
        const frontWall = this.createBox(length + size.wallWidth, size.wallHeight, size.wallWidth, this.wallMaterial);
        frontWall.position.set(0, size.wallY, w2);
        
        // Задняя стена
        const backWall = this.createBox(length + size.wallWidth, size.wallHeight, size.wallWidth, this.wallMaterial);
        backWall.position.set(0, size.wallY, -w2);
        
        // Левая стена
        const leftWall = this.createBox(size.wallWidth, size.wallHeight, size.wagonWidth + size.wallWidth, this.wallMaterial);
        leftWall.position.set(-l2, size.wallY, 0);
        
        // Правая стена
        const rightWall = this.createBox(size.wallWidth, size.wallHeight, size.wagonWidth + size.wallWidth, this.wallMaterial);
        rightWall.position.set(l2, size.wallY, 0);

        let collider = this.createColliderBox(size.wagonWidth + size.wallWidth, 
                size.height + size.wheel.radius * 2, size.length);

        collider.position.y = size.height / 2 + size.wheel.radius;
        group.add(collider)
        this._registerClickable(collider);
        
        return group;
    }

    onClick(hit, eventData) {
        super.onClick(hit, eventData);
        this.deChain();
    }

    headTrain() {
        return this.game.items.carts.find(c => {
            return (c instanceof Train) && c.hasInChain(this);
        });
    }

    deChain() {
        let train = this.headTrain();
        if (train) {
            train.removeChain(this);
        }
    }
    
    update(dt) {
        super.update(dt);
        
        // Легкое покачивание вагона при движении
        if (this.isMoving()) {
            const sway = Math.sin(Date.now() * 0.008) * 0.01;
            this.base.rotation.z = sway;
            this.base.rotation.x = sway * 0.5;
        } else {
            this.base.rotation.z *= 0.95;
            this.base.rotation.x *= 0.95;
        }
    }

    defaultWeight() {
        return GAME_SETTINGS.WAGON_WEIGHT;
    }
}

registerClass(Wagon);