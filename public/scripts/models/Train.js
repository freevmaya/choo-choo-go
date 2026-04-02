// scripts/models/Train.js

class Train extends BaseCart {
    constructor() {
        super();

        this.eyeBlinkTimer = 0;
        this.eyeBlinkInterval = 3;
        this.isBlinking = false;
        this.blinkProgress = 0;
        this.smokeTimer = 0;
        this.smokeInterval = 0.5;
        this.whistleTimer = 0;
        this.whistleInterval = 8;

        this.force = GAME_SETTINGS.TRAIN_POWER;
        this.brack = this.force * 2;

        this.states = ['run', 'stop', 'braking'];
        this.stateIndex = 1;
        this.chain = [];
    }

    addChain(cart) {
        if (!this.chain.includes(cart))
            this.chain.push(cart);
    }

    removeChain(cart) {
        let idx = this.chain.indexOf(cart);
        if (idx > -1)
            this.chain.splice(idx, 1);
    }

    hasInChain(cart) {
        return this.chain.indexOf(cart) > -1;
    }

    toSaveData() {
        let data = super.toSaveData();
        data.chain = [];
        this.chain.forEach((cart)=>{
            let idx = cart.index();
            if (idx > -1)
                data.chain.push(idx);
        });
        return data;
    }

    _resetChain(chain) {        
        this.chain = [];
        chain.forEach((idx)=>{
            this.chain.push(this.game.items.carts[idx]);
        });
    }

    init(game, data) {
        super.init(game, data);

        if (data.chain)
            setTimeout(()=>{
                this._resetChain(data.chain);
            }, 100);

        this.initListeners();
        return this;
    }

    initListeners() {
        eventBus.on('gameObject:down', (data)=>{

            if ((data.intersects.length > 0) && (data.intersects[0].object.userData.gameObject == this)) 
                this.beginDrag(data.pos);
        });

        eventBus.on('gameObject:up', (data)=>{
            if (this.isDrag) 
                this.endDrag(data.pos);
        });

        this.game.container.on('mouseleave', (data)=>{
            if (this.isDrag) 
                this.endDrag(data.pos);
        });

        $(window).on('blur', (data)=>{
            if (this.isDrag) 
                this.endDrag(data.pos);
        });
    }

    beginDrag(pos) {
        this.game.cameraController.setEnable(false);
        this.startDragPoint = this.game.raycasterManager.getIntersectionWithPlane(pos.x, pos.y, this.getPosition());
        this.isDrag = true;
        this.State('braking'); 
    }

    endDrag(pos) {
        if (this.isDrag) {
            this.game.cameraController.setEnable(true);
            this.isDrag = false;
            let endDragPoint = this.game.raycasterManager.getIntersectionWithPlane(pos.x, pos.y, this.getPosition());
            let direct = endDragPoint.clone().sub(this.startDragPoint);
            console.log(direct);

            let forward = new THREE.Vector3();
            this.model.getWorldDirection(forward);

            this.setForward(direct.dot(forward) < 0);
            this.State('run'); 
        }
    }

    headTrain() {
        return this;
    }

    State(value = null) {
        if (value) {
            let index = this.states.indexOf(value);
            if (index > -1) 
                this.setState(index);
        }
        return this.states[this.stateIndex];
    }

    updatePS() {
        if (this.particles) {
             if (this.State() == 'run') {
                this.particles.psList[0].options.lifetime = 1.5;
                this.particles.psList[0].options.opacity = 1;
            } else {
                this.particles.psList[0].options.lifetime = 0.5;
                this.particles.psList[0].options.opacity = 0.4;
            }
        }
    }

    setState(index) {
        if (index != this.stateIndex) {
            this.stateIndex = index;
            if (this.State() == 'stop')
                this.velocity = 0;

            this.updatePS();
        }
    }

    defaultWeight() {
        return GAME_SETTINGS.TRAIN_WEIGHT;
    }

    size() {
        let size = super.size();
        size.height = 1.5;
        return size;
    }

    getWheelPositions() {

        let size = this.size();
        let fc = size.width / 2 + size.wheel.width / 2;
        let d = this.baseLength / 3;
        return [
            { x: -d, z: -fc, radius: size.wheel.radius },
            { x: -d, z: fc, radius: size.wheel.radius },
            { x: 0.0, z: -fc, radius: size.wheel.radius },
            { x: 0.0, z: fc, radius: size.wheel.radius },
            { x: d, z: -fc, radius: size.wheel.radius },
            { x: d, z: fc, radius: size.wheel.radius }
        ]
    }

    createEye(x, y, z, eyeMaterial, pupilMaterial) {
        let eyeGroup = new THREE.Group();
        const eye = this.createSphere(0.22, 32, eyeMaterial);
        eyeGroup.add(eye);
        eyeGroup.Eye = eye;

        const pupil = this.createSphere(0.12, 32, pupilMaterial);
        pupil.position.set(0.2, 0, 0);        
        eyeGroup.add(pupil);
        eyeGroup.Pupil = pupil;

        eyeGroup.position.set(x, y, z);
        this.base.add(eyeGroup);
        return eyeGroup;
    }
    
    createModel() {

        let group = super.createModel();
        let wweight = 0.14;

        let size = this.size();
        let width = size.width;
        let length = size.baseLength;
        let width2 = width / 2;
        
        // Цвета
        const darkColor = 0xCC3333;
        const eyeColor = 0xFFFFFF;
        const pupilColor = 0x000000;
        const pipeColor = 0x666666;
        
        // Материалы
        const darkMaterial = new THREE.MeshStandardMaterial({ color: darkColor, roughness: 0.5, metalness: 0.2 });
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: eyeColor, roughness: 0.2, metalness: 0.1 });
        const pupilMaterial = new THREE.MeshStandardMaterial({ color: pupilColor, roughness: 0.1, metalness: 0.0 });
        const pipeMaterial = new THREE.MeshStandardMaterial({ color: pipeColor, roughness: 0.3, metalness: 0.6 });
        const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 0.5 });
        
        this._registerMaterial(darkMaterial);
        this._registerMaterial(eyeMaterial);
        this._registerMaterial(pupilMaterial);
        this._registerMaterial(pipeMaterial);
        this._registerMaterial(highlightMaterial);
        
        // Основной корпус (цилиндр, расположенный горизонтально)
        const bodyGeo = new THREE.CylinderGeometry(width2, width2, length * 0.8, 16);
        const body = new THREE.Mesh(bodyGeo, this.mainMaterial);
        body.rotation.z = PI_HALF;
        body.position.set((length - length * 0.7) / 2, GAME_SETTINGS.TRAIN_WHEEL_RADIUS + 0.55, 0);
        body.castShadow = true;
        this._registerGeometry(bodyGeo);
        this.base.add(body);

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

        this.base.add(cab_group);
        
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

        pipe_group.position.set(length / 2 - 0.1, GAME_SETTINGS.TRAIN_WHEEL_RADIUS + 1.15);

        this.base.add(pipe_group);
        
        // ========== БОЛЬШИЕ ГЛАЗА ==========

        let leftEyeGroup = this.createEye(length / 2, 1, 0.4, eyeMaterial, pupilMaterial);
        let rightEyeGroup = this.createEye(length / 2, 1, -0.4, eyeMaterial, pupilMaterial);
        
        // ========== ДЕКОРАТИВНЫЕ ПОЛОСКИ ==========
        const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFFDD88, metalness: 0.5 });
        this._registerMaterial(stripeMat);
        
        const stripeGeo = new THREE.BoxGeometry(length, 0.06, 0.08);
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(0, 0.78, width2);
        stripe.castShadow = true;
        this._registerGeometry(stripeGeo);
        this.base.add(stripe);
        
        const stripe2 = new THREE.Mesh(stripeGeo, stripeMat);
        stripe2.position.set(0.2, 0.78, -width2);
        stripe2.castShadow = true;
        this.base.add(stripe2);
        
        // Сохраняем ссылки на анимируемые элементы
        this.animatedParts = {
            eyes: [leftEyeGroup, rightEyeGroup],
            wheels: this.wheels,
            pipeTop: pipeTop
        };
        
        // Создаем систему дыма
        this.createSmokeSystem(this.base);

        let collider = this.createColliderBox((size.width + size.wheel.width * 2) * 1.2, size.height * 1.2, size.length * 1.2);
        collider.position.y = size.height / 2 + size.wheel.radius;
        group.add(collider)
        this._registerClickable(collider);

        return group;
    }

    onClick(hit, eventData) {
        if (this.game.isPlaying())
            this.toggle();

        super.onClick(hit, eventData);
    }
    
    createSmokeSystem(parentGroup) {
        this.particles = new SmokeParticles();
        this.particles.init(this.game);
        this.particles.play();
        this.updatePS();
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

    updateSmoke() {
        if (this.particles) {
            let p = new THREE.Vector3();
            this.animatedParts.pipeTop.getWorldPosition(p);
            p.y += 0.8;
            this.particles.setPosition(p.x, p.y, p.z);
        }
    }
    
    updateLamp(deltaTime) {
        if (!this.animatedParts.lamp) return;
        const intensity = this.isMoving ? 0.6 + Math.sin(Date.now() * 0.02) * 0.3 : 0.3;
        this.animatedParts.lamp.material.emissiveIntensity = intensity;
    }

    checkOverScreen(currentTrack) {
        if (this.game.ground) {
            let offset = this.game.ground.getCameraOffsetForCell(currentTrack.getCellPosition());
            if (offset) {

                let lookCell = this.game.cameraController.getLookCell();
                lookCell.x += offset.x < 0 ? -1 : (offset.x > 0 ? 1: 0);
                lookCell.y += offset.y < 0 ? -1 : (offset.y > 0 ? 1: 0);

                this.game.cameraController.setLookCell(lookCell);
            }
        }
    }

    totalWeight() {
        let weight = this.weight;
        this.chain.forEach((cart)=>{ weight += cart.weight; });
        return weight;
    }

    totalResistance() {
        let resistance = this.trackPos.currentTrack.getPhysicMaterial().resistance;
        this.chain.forEach((cart)=>{ resistance += cart.trackPos.currentTrack.getPhysicMaterial().resistance; });
        return resistance;
    }

    applyVelocity(newVelocity, dt) {
        let allChain = [...[this], ...this.chain];
        let newPos = [];
        let collisions = [];

        let max_velocity = this.game.getEnv().MAX_VELOCITY ? this.game.getEnv().MAX_VELOCITY : GAME_SETTINGS.MAX_VELOCITY;

        let vel = Math.min(newVelocity, max_velocity);

        newVelocity = newVelocity > 0 ? vel : -vel;

        allChain.forEach((cart)=>{
            let pos = cart.trackPos.clone();
            let collision = pos.applyVelocity(newVelocity, cart, dt, allChain);
            if (collision)
                collisions.push(collision);
            newPos.push(pos);
        });

        if (collisions.length > 0) {
            if (collisions.find(collision => collision.edgeTrack)) {
                allChain.forEach((cart, i)=>{
                    cart.forwardTrain = !cart.forwardTrain;
                    cart.trackPos.toggleDirect();
                    cart.velocity = newVelocity;
                });
            } else {
                let collistion = collisions[0];

                let sameDirect = collistion.dot > 0;
                console.log(`sameDirect: ${sameDirect}`);

                collistion.cart.setForward(sameDirect ? collistion.cart.trackPos.forwardInTrack : !collistion.cart.trackPos.forwardInTrack);

                this.addChain(collistion.cart);
                this.State('braking');
            }
        } else {
            allChain.forEach((cart, i)=>{
                cart.trackPos.copy(newPos[i]);
                cart.velocity = newVelocity;
            });
        }
    }
    
    update(dt) {

        if ((this.State() != 'stop') && this.trackPos.currentTrack) {

            let resistance = this.totalResistance();

            let weight = this.totalWeight();

            let acceleration = 0;

            if (this.State() == 'braking')
                resistance += this.brack;
            else acceleration = this.force / weight;

            const resistanceAcc = (resistance * this.velocity) / weight;
            
            // Итоговое ускорение
            const totalAcc = acceleration - resistanceAcc;
            
            // Обновление скорости
            let newVelocity = this.velocity + totalAcc * dt;

            if ((Math.abs(newVelocity) < 0.02) && (this.State() == 'braking'))
                this.State('stop');

            this.applyVelocity(newVelocity, dt);
        }
        super.update(dt);
        this.updateEyes(dt);
        this.updateLamp(dt);
        this.updateSmoke();
    }

    toggle() {
        if (this.State() == 'run')
            this.State('braking');
        else this.State('run');
    }

    _afterChangeForward() {
        super._afterChangeForward();
        this.chain.forEach((cart)=>{
            if (cart != this) 
                cart.setForward(!cart.forwardTrain);
        });
    }

    dispose() {
        super.dispose();
        if (this.particles) {
            this.particles.dispose();
            this.particles = null;
        }
    }
}

registerClass(Train);