// scripts/models/CargoWagon.js

@RegisterClass()
class CargoWagon extends BaseGameObject {
    constructor() {
        super();
        this.type = 'cargo-wagon';
        this.wagonGroup = null;
        
        // Параметры вагончика
        this.width = 1.3;          // Ширина
        this.height = 0.9;         // Высота кузова
        this.length = 1.3;         // Длина
        this.wheelRadius = 0.2;
        this.wheelOffset = 0.6;    // Расстояние между осями
        this.animationTime = 0;
        this.isMoving = false;
        this.wheelAngle = 0;
        
        // Цвета
        this.mainColor = 0x6B8E23;      // Оливковый
        this.secondaryColor = 0xCD853F; // Деревянный
        this.wheelColor = 0x4A4A4A;     // Темно-серый
        this.rimColor = 0xCCCC99;       // Светло-желтый
        this.roofColor = 0x8B4513;      // Коричневый
        this.stripeColor = 0xFFD700;    // Золотой
    }
    
    createModel() {
        this.wagonGroup = new THREE.Group();
        
        // Материалы
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: this.mainColor, 
            roughness: 0.5, 
            metalness: 0.1 
        });
        const woodMaterial = new THREE.MeshStandardMaterial({ 
            color: this.secondaryColor, 
            roughness: 0.8, 
            metalness: 0.05 
        });
        const wheelMaterial = new THREE.MeshStandardMaterial({ 
            color: this.wheelColor, 
            roughness: 0.4, 
            metalness: 0.7 
        });
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: this.rimColor, 
            roughness: 0.3, 
            metalness: 0.6 
        });
        const roofMaterial = new THREE.MeshStandardMaterial({ 
            color: this.roofColor, 
            roughness: 0.7, 
            metalness: 0.05 
        });
        const stripeMaterial = new THREE.MeshStandardMaterial({ 
            color: this.stripeColor, 
            metalness: 0.3,
            emissive: 0xFFD700,
            emissiveIntensity: 0.1
        });
        const w2 = this.width / 2;
        
        this._registerMaterial(bodyMaterial);
        this._registerMaterial(woodMaterial);
        this._registerMaterial(wheelMaterial);
        this._registerMaterial(rimMaterial);
        this._registerMaterial(roofMaterial);
        this._registerMaterial(stripeMaterial);
        
        // ========== ОСНОВНОЙ КУЗОВ ==========
        // Нижняя платформа
        const baseGeo = new THREE.BoxGeometry(this.length, 0.12, this.width);
        const base = new THREE.Mesh(baseGeo, woodMaterial);
        base.position.y = this.wheelRadius + 0.06;
        base.castShadow = true;
        this._registerGeometry(baseGeo);
        this.wagonGroup.add(base);
        
        // Кузов (прямоугольник)
        const bodyGeo = new THREE.BoxGeometry(this.length * 0.92, this.height, this.width * 0.9);
        const body = new THREE.Mesh(bodyGeo, bodyMaterial);
        body.position.y = this.wheelRadius + this.height / 2 + 0.08;
        body.castShadow = true;
        this._registerGeometry(bodyGeo);
        this.wagonGroup.add(body);
        
        // Деревянные планки по бокам
        const plankGeo = new THREE.BoxGeometry(this.length * 0.95, 0.08, 0.08);
        const plankMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887, roughness: 0.7 });
        this._registerMaterial(plankMaterial);
        
        const plankY = this.wheelRadius + this.height + 0.1;
        const plank1 = new THREE.Mesh(plankGeo, plankMaterial);
        plank1.position.set(0, plankY, w2 - 0.05);
        plank1.castShadow = true;
        this._registerGeometry(plankGeo);
        this.wagonGroup.add(plank1);
        
        const plank2 = new THREE.Mesh(plankGeo, plankMaterial);
        plank2.position.set(0, plankY, -w2 + 0.05);
        plank2.castShadow = true;
        this.wagonGroup.add(plank2);
        
        // ========== КРЫША ==========
        const roofGeo = new THREE.CylinderGeometry(w2 * 0.85, w2 * 0.85, this.length * 0.90, 12);
        const roof = new THREE.Mesh(roofGeo, roofMaterial);
        roof.rotation.z = Math.PI / 2;
        roof.position.y = this.wheelRadius + this.height + 0.2;
        roof.castShadow = true;
        this._registerGeometry(roofGeo);
        this.wagonGroup.add(roof);
        
        // Декоративная труба на крыше (мультяшная)
        const chimneyGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.35, 8);
        const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0xBD7A3A, metalness: 0.4 });
        this._registerMaterial(chimneyMaterial);
        const chimney = new THREE.Mesh(chimneyGeo, chimneyMaterial);
        chimney.position.set(this.length * 0.3, this.wheelRadius + this.height + w2 + 0.45, 0);
        chimney.castShadow = true;
        this._registerGeometry(chimneyGeo);
        this.wagonGroup.add(chimney);
        
        const chimneyCapGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.08, 8);
        const chimneyCap = new THREE.Mesh(chimneyCapGeo, chimneyMaterial);
        chimneyCap.position.set(this.length * 0.3, this.wheelRadius + this.height + w2 + 0.62, 0);
        chimneyCap.castShadow = true;
        this._registerGeometry(chimneyCapGeo);
        this.wagonGroup.add(chimneyCap);
        
        // ========== ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ ==========
        // Полоска по бокам
        const stripeGeo = new THREE.BoxGeometry(this.length * 0.8, 0.08, 0.05);
        const stripeLeft = new THREE.Mesh(stripeGeo, stripeMaterial);
        stripeLeft.position.set(0, this.wheelRadius + this.height * 0.6, w2 + 0.02);
        stripeLeft.castShadow = true;
        this._registerGeometry(stripeGeo);
        this.wagonGroup.add(stripeLeft);
        
        const stripeRight = new THREE.Mesh(stripeGeo, stripeMaterial);
        stripeRight.position.set(0, this.wheelRadius + this.height * 0.6, -w2 - 0.02);
        stripeRight.castShadow = true;
        this.wagonGroup.add(stripeRight);
        
        // Окошко (спереди)
        const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, emissive: 0x4682B4, emissiveIntensity: 0.2 });
        this._registerMaterial(windowMaterial);
        const windowGeo = new THREE.BoxGeometry(0.5, 0.4, 0.05);
        const windowMesh = new THREE.Mesh(windowGeo, windowMaterial);
        windowMesh.position.set(0.1, this.wheelRadius + this.height * 0.7, w2 + 0.02);
        windowMesh.castShadow = true;
        this._registerGeometry(windowGeo);
        this.wagonGroup.add(windowMesh);
        
        // Рама окошка
        const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 });
        this._registerMaterial(frameMaterial);
        const frameGeo = new THREE.BoxGeometry(0.55, 0.45, 0.03);
        const frame = new THREE.Mesh(frameGeo, frameMaterial);
        frame.position.set(0.1, this.wheelRadius + this.height * 0.7, w2 + 0.018);
        frame.castShadow = true;
        this._registerGeometry(frameGeo);
        this.wagonGroup.add(frame);
        
        // ========== КОЛЁСА ==========
        this.wheels = [];
        const wheelPositions = [
            { x: -this.wheelOffset, z: -w2 + 0.25 },
            { x: -this.wheelOffset, z: w2 - 0.25 },
            { x: this.wheelOffset, z: -w2 + 0.25 },
            { x: this.wheelOffset, z: w2 - 0.25 }
        ];
        
        wheelPositions.forEach((pos) => {
            const wheelGroup = new THREE.Group();
            
            // Основное колесо
            const wheelGeo = new THREE.CylinderGeometry(this.wheelRadius, this.wheelRadius, 0.12, 16);
            const wheel = new THREE.Mesh(wheelGeo, wheelMaterial);
            wheel.rotation.x = Math.PI / 2;
            wheel.castShadow = true;
            this._registerGeometry(wheelGeo);
            wheelGroup.add(wheel);
            
            // Ободок
            const rimGeo = new THREE.CylinderGeometry(this.wheelRadius - 0.05, this.wheelRadius - 0.05, 0.13, 16);
            const rim = new THREE.Mesh(rimGeo, rimMaterial);
            rim.rotation.x = Math.PI / 2;
            rim.castShadow = true;
            this._registerGeometry(rimGeo);
            wheelGroup.add(rim);
            
            // Спицы (крест)
            const spokeMat = new THREE.MeshStandardMaterial({ color: 0xCCCC99 });
            this._registerMaterial(spokeMat);
            
            const spokeGeo = new THREE.BoxGeometry(0.08, 0.08, this.wheelRadius * 1.3);
            const spoke = new THREE.Mesh(spokeGeo, spokeMat);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = Math.PI / 4;
            spoke.castShadow = true;
            this._registerGeometry(spokeGeo);
            wheelGroup.add(spoke);
            
            wheelGroup.position.set(pos.x, this.wheelRadius, pos.z);
            this.wagonGroup.add(wheelGroup);
            
            this.wheels.push({ mesh: wheel, rim: rim, spoke: spoke });
        });
        
        // ========== СЦЕПКА ==========
        const hookMaterial = new THREE.MeshStandardMaterial({ color: 0xBD7A3A, metalness: 0.5 });
        this._registerMaterial(hookMaterial);
        
        const hookGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 8);
        const hook = new THREE.Mesh(hookGeo, hookMaterial);
        hook.rotation.x = Math.PI / 2;
        hook.position.set(-this.length / 2 - 0.1, this.wheelRadius + 0.2, 0);
        hook.castShadow = true;
        this._registerGeometry(hookGeo);
        this.wagonGroup.add(hook);
        
        const hookRingGeo = new THREE.TorusGeometry(0.1, 0.04, 8, 20);
        const hookRing = new THREE.Mesh(hookRingGeo, hookMaterial);
        hookRing.rotation.x = Math.PI / 2;
        hookRing.position.set(-this.length / 2 - 0.22, this.wheelRadius + 0.2, 0);
        hookRing.castShadow = true;
        this._registerGeometry(hookRingGeo);
        this.wagonGroup.add(hookRing);
        
        // ========== ГРУЗ (МУЛЬТЯШНЫЙ) ==========
        // Добавляем ящики и мешки в кузов
        this.addCargo();
        
        return this.wagonGroup;
    }
    
    addCargo() {
        const cargoGroup = new THREE.Group();
        
        // Материалы для груза
        const sackMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.8 });
        const crateMaterial = new THREE.MeshStandardMaterial({ color: 0xCD853F, roughness: 0.7 });
        const hayMaterial = new THREE.MeshStandardMaterial({ color: 0xF4A460, roughness: 0.9 });
        
        this._registerMaterial(sackMaterial);
        this._registerMaterial(crateMaterial);
        this._registerMaterial(hayMaterial);
        
        // Мешок 1
        const sackGeo = new THREE.SphereGeometry(0.28, 12, 12);
        const sack = new THREE.Mesh(sackGeo, sackMaterial);
        sack.position.set(-0.35, this.wheelRadius + this.height * 0.4, 0.25);
        sack.scale.set(0.9, 0.7, 0.8);
        sack.castShadow = true;
        this._registerGeometry(sackGeo);
        cargoGroup.add(sack);
        
        // Мешок 2
        const sack2 = new THREE.Mesh(sackGeo, sackMaterial);
        sack2.position.set(0.2, this.wheelRadius + this.height * 0.35, -0.3);
        sack2.scale.set(0.8, 0.6, 0.9);
        sack2.castShadow = true;
        cargoGroup.add(sack2);
        
        // Ящик
        const crateGeo = new THREE.BoxGeometry(0.5, 0.35, 0.5);
        const crate = new THREE.Mesh(crateGeo, crateMaterial);
        crate.position.set(-0.1, this.wheelRadius + 0.25, 0.1);
        crate.castShadow = true;
        this._registerGeometry(crateGeo);
        cargoGroup.add(crate);
        
        // Сено (цилиндр)
        const hayGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.25, 6);
        const hay = new THREE.Mesh(hayGeo, hayMaterial);
        hay.position.set(0.45, this.wheelRadius + this.height * 0.3, -0.1);
        hay.castShadow = true;
        this._registerGeometry(hayGeo);
        cargoGroup.add(hay);
        
        // Бочонок
        const barrelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.4, 8);
        const barrelMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D });
        this._registerMaterial(barrelMaterial);
        const barrel = new THREE.Mesh(barrelGeo, barrelMaterial);
        barrel.position.set(-0.45, this.wheelRadius + 0.25, -0.35);
        barrel.castShadow = true;
        this._registerGeometry(barrelGeo);
        cargoGroup.add(barrel);
        
        cargoGroup.position.y = 0.05;
        this.wagonGroup.add(cargoGroup);
        this.cargoGroup = cargoGroup;
    }
    
    update(dt) {
        this.animationTime += dt;
        
        // Анимация колёс при движении
        if (this.isMoving) {
            this.wheelAngle += 8 * dt;
            this.wheels.forEach(wheel => {
                wheel.mesh.rotation.y = this.wheelAngle;
                wheel.rim.rotation.y = this.wheelAngle;
                if (wheel.spoke) wheel.spoke.rotation.y = this.wheelAngle;
            });
        }
        
        // Легкое покачивание груза
        if (this.cargoGroup && this.isMoving) {
            const sway = Math.sin(this.animationTime * 3) * 0.01;
            this.cargoGroup.position.x = sway;
        }
        
        // Мерцание окошка
        if (this.wagonGroup.children.some(c => c.material?.emissiveIntensity)) {
            const blink = 0.15 + Math.sin(this.animationTime * 5) * 0.08;
            const windowChild = this.wagonGroup.children.find(c => 
                c.material && c.material.emissiveIntensity !== undefined && c.position.z > 0.5
            );
            if (windowChild) windowChild.material.emissiveIntensity = blink;
        }
    }
    
    startMoving() {
        this.isMoving = true;
    }
    
    stopMoving() {
        this.isMoving = false;
    }
    
    dispose() {
        super.dispose();
        this.wagonGroup = null;
        this.wheels = [];
        this.cargoGroup = null;
    }
}