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
        this.chain = [];
    }

    init(game, data) {
        super.init(game, data);

        this.force = this.getConst('TRAIN_FORCE');
        this.brack = this.getConst('TRAIN_BRACK');

        if (data.chain)
            setTimeout(()=>{
                this._resetChain(data.chain);
            }, 100);

        this.initListeners();

        return this;
    }

    getStates() {
        return ['stop', 'run', 'braking', 'boarding', 'wait', 'prepare'];
    }

    addChain(cart, forward) {
        if (!this.hasInChain(cart)) {
            this.chain.push({
                cart: cart,
                forward: forward
            });
            cart.addedToChain(this);
        }
    }

    removeChain(cart) {
        let idx = this.chain.findIndex(c => c.cart == cart);
        if (idx > -1)
            this.chain.splice(idx, 1);
    }

    hasInChain(cart) {
        let result = this.chain.some(c => c.cart === cart);
        return result;
    }

    getLastCart(cart) {

        let cart_item = this.chain.find(item => item.cart == cart);
        if (cart_item) {
            let sameList = this.chain.filter(item => (item.forward == cart_item.forward) && (item.cart != cart));

            return sameList.length > 0 ? sameList[sameList.length - 1].cart : this;
        }
        return false;
    }

    toSaveData() {
        let data = super.toSaveData();
        data.chain = [];
        this.chain.forEach((item)=>{
            let idx = item.cart.index();
            if (idx > -1)
                data.chain.push([idx, item.forward]);
        });
        return data;
    }

    _resetChain(chain) {        
        this.chain = [];
        chain.forEach((item)=>{
            let cart = this.game.items.carts[item[0]];
            if (cart)
                this.addChain(cart, item[1]);
        });
    }

    onGaDown(data) {

        if (this.game.isPlaying()) {
            if (data.intersects.find((i)=>{
                return i.object.userData.gameObject == this;
            }))
                this.beginDrag(data.pos);
        }
    }

    onGaUp(data) {
        if (this.isDrag) 
            this.endDrag(data.pos);
    }

    onMouseLeave(data) {
        if (this.isDrag) 
            this.endDrag(data.pos);
    }

    onPreVictory(data) {
        this.State('braking');
    }

    initListeners() {

        if (!this.data.noDrag) {
            eventBus.on('gameObject:down', this._onGaDown = this.onGaDown.bind(this));
            eventBus.on('gameObject:up', this._onGaUp = this.onGaUp.bind(this));
            eventBus.on('pre-victory', this._onPreVictory = this.onPreVictory.bind(this));
            this.game.container.on('mouseleave', this._onMouseLeave = this.onMouseLeave.bind(this));
            $(window).on('blur', this._onMouseLeave);
        }
    }

    beginDrag(pos) {
        this.game.cameraController.setEnable(false);
        this.startDragPoint = this.game.raycasterManager.getIntersectionWithPlane(pos.x, pos.y, this.getPosition());
        this.isDrag = true;

        if (this.State() == 'run')
            this.State('braking'); 
    }

    endDrag(pos) {
        if (this.isDrag && pos) {
            this.game.cameraController.setEnable(true);
            this.isDrag = false;
            let endDragPoint = this.game.raycasterManager.getIntersectionWithPlane(pos.x, pos.y, this.getPosition());
            let direct = endDragPoint.clone().sub(this.startDragPoint);

            if (!['boarding'].includes(this.State())) {
                if (direct.length() > 0.2) {
                    let forward = new THREE.Vector3();
                    this.model.getWorldDirection(forward);

                    this.max_velocity = Math.max(this.game.getMaxVelocity() * Math.min(1, direct.length() / 2),this.getConst('MIN_VELOCITY'));

                    this.setForward(direct.dot(forward) < 0);
                    this.State('run');
                    eventBus.emit(this.getUserActionEvent(0), this);
                }
            } else eventBus.emit('toast', 'wrong_boarding');
        }
    }

    headTrain() {
        return this;
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

    afterSetState() {
        if (['stop', 'boarding'].includes(this.State()))
            this.velocity = 0;
        else if (this.State() == 'prepare')
            this.Prepare();
        this.updatePS();
    }

    Prepare() {

        if (this.State() == 'prepare') {
            if (this.prepareTimer)
                clearTimeout(this.prepareTimer);

            this.prepareTimer = setTimeout(()=>{
                this.prepareTimer = null;
                this.State('run');
            }, 2000);
        } else this.State('prepare');
    }

    defaultWeight() {
        return this.getConst('TRAIN_WEIGHT');
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
        this._registerClickable(eye);

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
        const darkColor = this.data.color ? this.data.color : 0xCC3333;
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
        const body = new THREE.Mesh(bodyGeo, darkMaterial);
        body.rotation.z = PI_HALF;
        body.position.set((length - length * 0.7) / 2, this.getConst('TRAIN_WHEEL_RADIUS') + 0.55, 0);
        body.castShadow = true;
        this._registerGeometry(bodyGeo);
        this.base.add(body);
        this._registerClickable(body);

        const cab_group = new THREE.Group();
        
        // Кабина машиниста (сзади)
        let cab = this.createBox(0.4, 0.7, 0.1, darkMaterial);
        cab.position.set(0.2, 0, 0.4);
        cab_group.add(cab);
        this._registerClickable(cab);

        cab = this.createBox(0.4, 0.7, 0.1, darkMaterial);
        cab.position.set(0.2, 0, -0.4);
        cab_group.add(cab);
        this._registerClickable(cab);

        cab = this.createBox(0.1, 0.3, 0.7, darkMaterial);
        cab.position.set(0.3, -0.2, 0);
        cab_group.add(cab);
        this._registerClickable(cab);
        
        // Крыша кабины
        const roofGeo = new THREE.BoxGeometry(0.85, 0.1, 0.95);
        this.roof = new THREE.Mesh(roofGeo, darkMaterial);
        this.roof.position.set(0, 0.4, 0);
        this.roof.castShadow = true;
        this._registerGeometry(roofGeo);
        cab_group.add(this.roof);
        this._registerClickable(this.roof);

        cab_group.position.set(-0.6, this.getConst('TRAIN_WHEEL_RADIUS') + 1, 0);

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
        this._registerClickable(pipe);
        
        const pipeTopGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.3, 12);
        const pipeTop = new THREE.Mesh(pipeTopGeo, pipeMaterial);
        pipeTop.position.set(0, 0.5, 0);
        pipeTop.castShadow = true;
        this._registerGeometry(pipeTopGeo);
        pipe_group.add(pipeTop);
        this._registerClickable(pipeTop);        

        pipe_group.position.set(length / 2 - 0.1, this.getConst('TRAIN_WHEEL_RADIUS') + 1.15);

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
        /*
        let collider = this.createColliderBox((size.width + size.wheel.width * 2), size.height, size.length, true);
        collider.position.y = size.height / 2 + size.wheel.radius;
        group.add(collider)
        this._registerClickable(collider);
        */

        return group;
    }

    onClick(hit, eventData) {
        if (this.game.isPlaying())
            this.toggle();

        if (this.State() == 'run')
            eventBus.emit(this.getUserActionEvent(1), this);
        else if (this.State() == 'braking')
            eventBus.emit(this.getUserActionEvent(2), this);
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
        const intensity = this.isMoving() ? 0.6 + Math.sin(Date.now() * 0.02) * 0.3 : 0.3;
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
        this.chain.forEach((item)=>{ weight += item.cart.weight; });
        return weight;
    }

    totalResistance() {
        let resistance = this.trackPos.currentTrack.getPhysicMaterial().resistance;
        this.chain.forEach((item)=>{ resistance += item.cart.trackPos.currentTrack.getPhysicMaterial().resistance; });
        return resistance;
    }

    applyVelocity(newVelocity, dt) {
        let allChain = [...[{cart: this, forward: true}], ...this.chain];
        let newPos = [];
        let collisions = [];

        let applyNewPos = ()=>{
            if (this.State() == 'wait')
                this.State('prepare');

            if (['run', 'braking'].includes(this.State())) {
                allChain.forEach((item, i)=>{
                    item.cart.trackPos.copy(newPos[i]);
                    item.cart.velocity = newVelocity;
                });
            }
        }

        let vel = Math.min(newVelocity, this.max_velocity);

        newVelocity = newVelocity > 0 ? vel : -vel;

        allChain.forEach((item)=>{
            let pos = item.cart.trackPos.clone();
            let collision = pos.applyVelocity(newVelocity, item.cart, dt, allChain);
            if (collision)
                collisions.push(collision);
            newPos.push(pos);
        });

        if (collisions.length > 0) {
            let edgeCollision = collisions.find(collision => collision.edgeTrack);
            if (edgeCollision) {
                if (this.State() != 'wait') {
                    if (this.data.wait)
                        this.State('wait');
                    else {

                        allChain.forEach((item, i)=>{
                            item.cart.forwardTrain = !item.cart.forwardTrain;
                            item.cart.trackPos.toggleDirect();
                            item.cart.velocity = newVelocity;
                        });
                        if (!edgeCollision.reflect)
                            this.State('braking');
                    }
                }
            } else {

                let collision = collisions[0];

                if (collision.cart.allowedToJoin(this)) {

                    if (collision.fromTheSide)
                        this.State('stop');
                    else {
                        console.log(`forward: ${collision.forward}`);

                        collision.cart.setForward(!collision.sameDirection);

                        let forward;
                        if (collision.meCart == this) forward = collision.forward;
                        else {
                            let chainItem = this.chain.find(c => c.cart == collision.meCart);

                            forward = chainItem.forward;
                        }

                        this.addChain(collision.cart, forward);
                        this.State('braking');

                        eventBus.emit('train-add-chain', collision.cart);
                    }
                } else {
                    this.State('stop');
                    eventBus.emit('wrong');
                }
            }
        } else applyNewPos();
    }

    allowedToJoin(train) {
        return false;
    }

    /*
    createCaptures() {

        let size = this.size();

        this.capture = [
            this.createBox(size.captureLenght, size.captureLenght / 2, size.captureLenght / 2, this.mainMaterial)
        ];

        this.capture[0].position.set(-(size.length - size.captureLenght) / 2, this.basePlate.position.y, 0);
    }*/
    
    update(dt) {

        if ((['run', 'braking'].includes(this.State())) && this.trackPos.currentTrack) {

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
        else if (this.State() == 'stop') 
            this.State('run');
    }

    State(value = null) {
        let result = super.State(value);
        if (value)
            eventBus.emit('train-' + super.State());
        return result;
    }

    _afterChangeForward() {
        super._afterChangeForward();
        this.chain.forEach(item=>{
            if (item.cart != this) 
                item.cart.setForward(!item.cart.forwardTrain);
        });
    }

    isMoving() {
        return super.isMoving() && (this.State() != 'wait');
    }

    getHandle(userActionEvent='') {
        if (['user-drag-train', 'user-run-train', 'user-brack-train'].includes(userActionEvent))
            return this.roof;

        return super.getHandle(userActionEvent);
    }

    getUserActionEvent(index) {
        return super.getUserActionEvent(index) || ['user-drag-train', 'user-run-train', 'user-brack-train'][index];
    }

    dispose() {
        super.dispose();

        if (!this.data.noDrag) {
            eventBus.off('gameObject:down', this._onGaDown);
            eventBus.off('gameObject:up', this._onGaUp);
            eventBus.off('pre-victory', this._onPreVictory);
            this.game.container.off('mouseleave', this._onMouseLeave);
            $(window).off('blur', this._onMouseLeave);
        }

        if (this.particles) {
            this.particles.dispose();
            this.particles = null;
        }
    }
}

registerClass(Train);