// scripts/models/Train.js

class Train extends BaseGameObject {
    constructor() {
        super();
        this.type = 'train';
        this.speed = 0;
        this.isMoving = false;
        this.speed = 0;
        this.forwardInTrack = true;

        this.eyeBlinkTimer = 0;
        this.eyeBlinkInterval = 3;
        this.isBlinking = false;
        this.blinkProgress = 0;
        this.smokeTimer = 0;
        this.smokeInterval = 0.5;
        this.whistleTimer = 0;
        this.whistleInterval = 8;
        this.wheelAngle = 0;
        this.wheelRotationSpeed = 0;
        this.animationTime = 0;
    }

    init(game, track, startChainIndex = 0) {
        super.init(game);
        this.track = track;
        this.setCurrentChain(startChainIndex, 0);
    }

    setCurrentChain(index, pathIndex) {
        this.currentChainIndex  = index;
        this.indexPosInChain    = -1;
        this.pathIndex          = pathIndex;
        this.updatePosition();
    }
    
    createModel() {
        const base = new THREE.Group();
        const group = new THREE.Group();

        base.rotation.y = PI_HALF;

        let wweight = 0.14;

        group.add(base);

        let width = GAME_SETTINGS.RAIL_SPACE - wweight;
        let length = GAME_SETTINGS.TRAIN_LEIGHT;
        let width2 = width / 2;
        
        // Цвета
        const mainColor = 0xFF4444;
        const darkColor = 0xCC3333;
        const wheelColor = 0x333333;
        const rimColor = 0xCCCC33;
        const eyeColor = 0xFFFFFF;
        const pupilColor = 0x000000;
        const pipeColor = 0x666666;
        
        // Материалы
        const mainMaterial = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.4, metalness: 0.3 });
        const darkMaterial = new THREE.MeshStandardMaterial({ color: darkColor, roughness: 0.5, metalness: 0.2 });
        const wheelMaterial = new THREE.MeshStandardMaterial({ color: wheelColor, roughness: 0.6, metalness: 0.7});
        const rimMaterial = new THREE.MeshStandardMaterial({ color: rimColor, roughness: 0.3, metalness: 0.8});
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: eyeColor, roughness: 0.2, metalness: 0.1 });
        const pupilMaterial = new THREE.MeshStandardMaterial({ color: pupilColor, roughness: 0.1, metalness: 0.0 });
        const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor, roughness: 0.3, metalness: 0.6 });
        const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 0.5 });
        
        this._registerMaterial(mainMaterial);
        this._registerMaterial(darkMaterial);
        this._registerMaterial(wheelMaterial);
        this._registerMaterial(rimMaterial);
        this._registerMaterial(eyeMaterial);
        this._registerMaterial(pupilMaterial);
        this._registerMaterial(pipeMaterial);
        this._registerMaterial(highlightMaterial);
        
        // ========== ОСНОВНОЙ КОРПУС ==========
        // Нижняя платформа
        const basePlateGeo = new THREE.BoxGeometry(length, 0.2, width);
        const basePlate = new THREE.Mesh(basePlateGeo, mainMaterial);
        basePlate.position.y = GAME_SETTINGS.TRAIN_WHEEL_RADIUS;
        basePlate.castShadow = true;
        this._registerGeometry(basePlateGeo);
        base.add(basePlate);
        
        // Основной корпус (цилиндр, расположенный горизонтально)
        const bodyGeo = new THREE.CylinderGeometry(width2, width2, length * 0.8, 16);
        const body = new THREE.Mesh(bodyGeo, mainMaterial);
        body.rotation.z = PI_HALF;
        body.position.set(0.4, GAME_SETTINGS.TRAIN_WHEEL_RADIUS + 0.55, 0);
        body.castShadow = true;
        this._registerGeometry(bodyGeo);
        base.add(body);

        const cab_group = new THREE.Group();
        
        // Кабина машиниста (сзади)
        const cabGeo = new THREE.BoxGeometry(0.8, 0.7, 0.9);
        const cab = new THREE.Mesh(cabGeo, darkMaterial);
        cab.position.set(0, 0, 0);
        cab.castShadow = true;
        this._registerGeometry(cabGeo);
        cab_group.add(cab);
        
        // Крыша кабины
        const roofGeo = new THREE.BoxGeometry(0.85, 0.1, 0.95);
        const roof = new THREE.Mesh(roofGeo, darkMaterial);
        roof.position.set(0, 0.4, 0);
        roof.castShadow = true;
        this._registerGeometry(roofGeo);
        cab_group.add(roof);

        cab_group.position.set(-0.6, GAME_SETTINGS.TRAIN_WHEEL_RADIUS + 1, 0);

        base.add(cab_group);
        
        /*
        // Передняя часть
        const frontGeo = new THREE.BoxGeometry(0.6, 0.55, 1.0);
        const front = new THREE.Mesh(frontGeo, mainMaterial);
        front.position.set(0.9, 0.4, 0);
        front.castShadow = true;
        this._registerGeometry(frontGeo);
        group.add(front);
        */
        
        let pipe_group = new THREE.Group();
        // ========== ТРУБА ==========
        const pipeGeo = new THREE.CylinderGeometry(0.24, 0.15, 0.7, 12);
        const pipe = new THREE.Mesh(pipeGeo, pipeMaterial);
        pipe.castShadow = true;
        this._registerGeometry(pipeGeo);
        pipe_group.add(pipe);
        
        const pipeTopGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.3, 12);
        const pipeTop = new THREE.Mesh(pipeTopGeo, pipeMaterial);
        pipeTop.position.set(0, 0.5, 0);
        pipeTop.castShadow = true;
        this._registerGeometry(pipeTopGeo);
        pipe_group.add(pipeTop);

        pipe_group.position.set(0.9, GAME_SETTINGS.TRAIN_WHEEL_RADIUS + 1.15);

        base.add(pipe_group);

        let eyeGroup = new THREE.Group();
        
        // ========== БОЛЬШИЕ ГЛАЗА ==========
        // Левое глазное яблоко
        const leftEyeGeo = new THREE.SphereGeometry(0.22, 32, 32);
        const leftEye = new THREE.Mesh(leftEyeGeo, eyeMaterial);
        leftEye.castShadow = true;
        this._registerGeometry(leftEyeGeo);
        eyeGroup.add(leftEye);
        eyeGroup.Eye = leftEye;
        
        // Зрачки
        const pupilGeo = new THREE.SphereGeometry(0.12, 32, 32);
        const pupil = new THREE.Mesh(pupilGeo, pupilMaterial);
        pupil.position.set(0.2, 0, 0);
        pupil.castShadow = true;
        this._registerGeometry(pupilGeo);
        eyeGroup.add(pupil);
        eyeGroup.Pupil = pupil;

        eyeGroup.position.set(1.3, 1, 0.4);
        base.add(eyeGroup);

        let eyeGroup2 = eyeGroup.clone();
        eyeGroup2.position.set(1.3, 1, -0.4);
        base.add(eyeGroup2);
        
        // ========== КОЛЁСА ==========
        this.wheels = [];
        let fc = width / 2 + wweight / 2;
        let d = length / 3;
        const wheelPositions = [
            { x: -d, z: -fc, radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS },
            { x: -d, z: fc, radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS },
            { x: 0.0, z: -fc, radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS },
            { x: 0.0, z: fc, radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS },
            { x: d, z: -fc, radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS },
            { x: d, z: fc, radius: GAME_SETTINGS.TRAIN_WHEEL_RADIUS }
        ];
        
        wheelPositions.forEach((pos) => {

            let wheelGroup = new THREE.Group();

            // Основное колесо
            const wheelGeo = new THREE.CylinderGeometry(pos.radius, pos.radius, wweight - .02, 24);
            const wheel = new THREE.Mesh(wheelGeo, wheelMaterial);
            wheel.rotation.x = PI_HALF;
            wheel.castShadow = true;
            this._registerGeometry(wheelGeo);
            wheelGroup.add(wheel);
            
            // Ободок
            const rimGeo = new THREE.CylinderGeometry(pos.radius - 0.05, pos.radius - 0.05, wweight, 24);
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
            spoke1.position.set(0, 0, (wweight - 0.08) * (pos.z < 0 ? 1 : -1));
            wheelGroup.add(spoke1);
            /*
            const spoke2Geo = new THREE.BoxGeometry(0.08, 0.08, pos.radius * 1.4);
            const spoke2 = new THREE.Mesh(spoke2Geo, spokeMat);
            spoke2.rotation.x = Math.PI;
            spoke2.rotation.z = -Math.PI / 4;
            spoke2.position.set(0, 0, wweight);
            this._registerGeometry(spoke2Geo);
            wheelGroup.add(spoke2);*/

            wheelGroup.position.set(pos.x, pos.radius, pos.z);
            wheelGroup.rotation.y = Math.PI;
            base.add(wheelGroup);
            
            this.wheels.push({
                mesh: wheel,
                rim: rim,
                spoke1: spoke1,
                originalPos: { x: pos.x, z: pos.z }
            });
        });
        
        // ========== ФАРА ==========
        const lampMaterial = new THREE.MeshStandardMaterial({ color: 0xFFAA66, emissive: 0xFF4422, emissiveIntensity: 0.6 });
        this._registerMaterial(lampMaterial);
        
        const lampGeo = new THREE.SphereGeometry(0.13, 16, 16);
        const lamp = new THREE.Mesh(lampGeo, lampMaterial);
        lamp.position.set(1.15, 0.45, 0);
        lamp.castShadow = true;
        this._registerGeometry(lampGeo);
        base.add(lamp);
        
        // ========== СВИСТОК ==========
        const whistleGeo = new THREE.ConeGeometry(0.08, 0.25, 8);
        const whistle = new THREE.Mesh(whistleGeo, rimMaterial);
        whistle.position.set(-0.4, 0.85, 0.75);
        whistle.rotation.x = 0.3;
        whistle.rotation.z = 0.3;
        whistle.castShadow = true;
        this._registerGeometry(whistleGeo);
        base.add(whistle);
        
        // ========== ДЕКОРАТИВНЫЕ ПОЛОСКИ ==========
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFFDD88, metalness: 0.5 });
        this._registerMaterial(stripeMat);
        
        const stripeGeo = new THREE.BoxGeometry(1.2, 0.06, 0.08);
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(0.2, 0.78, width2);
        stripe.castShadow = true;
        this._registerGeometry(stripeGeo);
        base.add(stripe);
        
        const stripe2 = new THREE.Mesh(stripeGeo, stripeMat);
        stripe2.position.set(0.2, 0.78, -width2);
        stripe2.castShadow = true;
        base.add(stripe2);
        
        // Сохраняем ссылки на анимируемые элементы
        this.animatedParts = {
            eyes: [eyeGroup],
            wheels: this.wheels,
            lamp: lamp,
            pipeTop: pipeTop
        };
        
        // Создаем систему дыма
        this.createSmokeSystem(base);

        When(() => this.game && this.game.raycasterManager)
            .then(() => {
                this.game.registerClickableObject(body, this);
                this.game.registerClickableObject(cab, this);
            });

        return group;
    }

    onClick(hit, eventData) {

        if (DEV)
            this.toggle();
    }
    
    createSmokeSystem(parentGroup) {
        this.smokeGroup = new THREE.Group();
        
        const smokeMat = new THREE.MeshStandardMaterial({
            color: 0xCCCCCC,
            roughness: 0.8,
            transparent: true,
            opacity: 0.7
        });
        this._registerMaterial(smokeMat);
        
        this.smokeParticles = [];
        
        for (let i = 0; i < 6; i++) {
            const smokeGeo = new THREE.SphereGeometry(0.6, 8, 8);
            const particle = new THREE.Mesh(smokeGeo, smokeMat);
            particle.visible = false;
            particle.userData = {
                active: false,
                life: 0,
                maxLife: 1.2,
                yOffset: 0
            };
            this._registerGeometry(smokeGeo);
            this.smokeGroup.add(particle);
            this.smokeParticles.push(particle);
        }

        this.smokeGroup.position.set(0.9, GAME_SETTINGS.TRAIN_WHEEL_RADIUS + 1.8, 0);
        
        parentGroup.add(this.smokeGroup);
    }
    
    updateSmoke(deltaTime) {
        if (!this.smokeParticles) return;
        
        this.smokeTimer += deltaTime;
        
        if (this.smokeTimer >= this.smokeInterval && this.isMoving) {
            this.smokeTimer = 0;
            
            const inactiveParticle = this.smokeParticles.find(p => !p.visible);
            if (inactiveParticle) {
                inactiveParticle.visible = true;
                inactiveParticle.userData.active = true;
                inactiveParticle.userData.life = 0;
                inactiveParticle.material.opacity = 0.7;
                inactiveParticle.scale.setScalar(0.1);
                inactiveParticle.position.set(0, 0, 0);
            }
        }
        
        this.smokeParticles.forEach(particle => {
            if (particle.visible) {
                particle.userData.life += deltaTime;
                const lifeProgress = particle.userData.life / 1.2;
                
                if (lifeProgress >= 1) {
                    particle.visible = false;
                } else {
                    particle.position.y += deltaTime * 0.5;
                    const newScale = 0.1 + lifeProgress * 0.15;
                    particle.scale.setScalar(newScale);
                    particle.material.opacity = 0.7 * (1 - lifeProgress);
                }
            }
        });
    }
    
    updateWheels(deltaTime) {
        if (!this.isMoving) return;
        
        this.wheelAngle += this.wheelRotationSpeed * deltaTime;
        const rotation = this.wheelAngle;
        
        this.wheels.forEach(wheel => {
            wheel.mesh.rotation.y = rotation;
            wheel.rim.rotation.y = rotation;
            if (wheel.spoke1) wheel.spoke1.rotation.y = rotation;
            //if (wheel.spoke2) wheel.spoke2.rotation.z = rotation;
        });
    }
    
    updateEyes(deltaTime) {
        this.eyeBlinkTimer += deltaTime;
        
        if (!this.isBlinking && this.eyeBlinkTimer >= this.eyeBlinkInterval) {
            this.isBlinking = true;
            this.blinkProgress = 0;
            this.eyeBlinkTimer = 0;
        }
        
        if (this.isBlinking) {
            this.blinkProgress += deltaTime * 10;
            
            if (this.blinkProgress >= 1) {
                this.isBlinking = false;
                this.blinkProgress = 0;
            }
            
            const scaleY = 1 - Math.sin(this.blinkProgress * Math.PI) * 0.95;

            this.animatedParts.eyes.forEach((eye)=>{
                eye.Pupil.scale.y = Math.max(0.05, scaleY);
            });
        } else {
            /*
            this.animatedParts.eyes.left.scale.y = 1;
            this.animatedParts.eyes.right.scale.y = 1;
            
            const wiggle = Math.sin(Date.now() * 0.003) * 0.02;
            this.animatedParts.eyes.left.position.x = 0.35 + wiggle * 0.5;
            this.animatedParts.eyes.right.position.x = 0.35 + wiggle * 0.5;
            */
        }
    }

    getAlt() {
        return GAME_SETTINGS.SLEEPER_HEIGHT / 2  + GAME_SETTINGS.RAIL_HEIGHT / 2;
    }
    
    updateLamp(deltaTime) {
        if (!this.animatedParts.lamp) return;
        const intensity = this.isMoving ? 0.6 + Math.sin(Date.now() * 0.02) * 0.3 : 0.3;
        this.animatedParts.lamp.material.emissiveIntensity = intensity;
    }

    updatePosition() {

        let currentTrack = this.track[this.currentChainIndex];
        if (currentTrack) {
            let pos = currentTrack.calcPathPoint(this.indexPosInChain, this.pathIndex);

            this.setPosition(pos.x, this.getAlt(), pos.z);
            this.setRotation(0, pos.rotation + Math.PI + (this.forwardInTrack ? 0 : Math.PI), 0);
        }
    }

    swithToNextTrack() {
        let currentTrack = this.track[this.currentChainIndex];

        let nextIndex = currentTrack.getNearestTrackItem(this.pathIndex, this.forwardInTrack);

        if (nextIndex > -1) {
            let nextTrack = this.track[nextIndex];
            let path = nextTrack.getConnectPath(currentTrack.getCellPosition());
            if (path) {
                this.currentChainIndex  = nextIndex;
                this.pathIndex          = path.pathIndex;
                this.forwardInTrack     = path.forward;
                this.indexPosInChain    = path.forward ? -1 : 1;
                return;
            }

            tracer.error(`Incorrect connection in index: {nextIndex}`);
        }
        this.stop();
    }
    
    update(dt) {
        this.updateWheels(dt);
        this.updateEyes(dt);
        this.updateLamp(dt);
        this.updateSmoke(dt);
        if (this.isMoving) {

            this.updatePosition();
            this.indexPosInChain += this.speed * dt * (this.forwardInTrack ? 1 : -1);

            if ((this.indexPosInChain > 1) || (this.indexPosInChain < -1)) {
                this.swithToNextTrack();
            }
        }
    }
    
    stop() {
        this.isMoving = false;
        this.wheelRotationSpeed = 0;
    }
    
    start(forward = true) {
        this.speed = GAME_SETTINGS.TRAIN_SPEED * (forward ? 1 : -1);
        this.wheelRotationSpeed = this.speed * 2;
        this.isMoving = true;
    }

    toggle() {
        if (this.isMoving) this.stop();
        else this.start();
    }
}