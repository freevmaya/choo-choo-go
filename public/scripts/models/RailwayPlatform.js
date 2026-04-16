// scripts/models/RailwayPlatform.js

class RailwayPlatform extends BaseCellObject {
  constructor(data = null) {
    super(data);
    
    this.platformGroup = null;
    
    // Параметры платформы
    this.platformLength = GAME_SETTINGS.CELL_SIZE * 3;
    this.platformWidth = GAME_SETTINGS.CELL_SIZE;
    this.platformHeight = 0.3;
    
    // Параметры лестницы
    this.stepCount = 4;
    this.stepHeight = 0.12;
    this.stepWidth = 0.6;
    this.stepDepth = 0.6;
    this.stairsHeight = this.stepCount * this.stepHeight;
    this.platformMainLength = this.platformLength - this.stepDepth;
    this.people = [];
    this.parked = null;
    this.queue = null;
    
    // Высота платформы
    this.platformY = 0.2;
    
    // Параметры бортиков
    this.edgeHeight = 0.07;
    this.edgeWidth = 0.1;
    
    // Цвета
    this.colors = {
      platform: 0x8B7355,
      edge: 0xA0522D,
      pillar: 0x6B4E2E,
      lamp: 0xFFD700,
      glass: 0x88CCFF,
      stair: 0x9B7B55,
      plank: 0x9B7B55
    };
    
    // Материалы
    this.materials = {};
  }

  getPeopleCount() {
    return this.people.length;
  }

  disposePeople(human) {
    let idx = this.people.indexOf(human);
    if (idx > -1) {
      this.people.splice(idx, 1);
      human.dispose();
    }
  }

  toSaveData() {
      let cellPos = this.getCellPosition();
      return {...this.data, ...{
          type: this.constructor.name,
          location: [cellPos.x, cellPos.y, this.getCellRotation()],
          peopleCount: this.people.length
      }};
  }

  init(game) {
    super.init(game);
    this.injectPeople(this.data.peopleCount);

    eventBus.on('runOver', this._onRunOver = this.onRunOver.bind(this));
    eventBus.on('change_mashine_state', this._onChangeTrainState = this.onChangeTrainState.bind(this));
    return this;
  }

  clearPeople() {
    this.people.forEach(p=> p.dispose());
    this.people.length = 0;
  }

  onRunOver(data) {
    let cellOver = data.track.getCellPosition();
    let cell = this.getNearestCell(3);

    if (cellOver.equals(cell)) {

      let cart = data.positionCart.cart;

      if (cart instanceof PassengerWagon) {
        let train = cart.headTrain();
        if (train && ['run', 'braking'].includes(train.State())) {

          if (this.data.taskName && !this.game.isCompletedTask(this.data.taskName)) { 
            // Тормозим если есть имя задания и оно еще не выполнено
            this.parked = cart;
            train.State('braking');
          }
        }
      }
      console.log(cell);
    }
  }

  /*
  onClick(e) {
    if (this.game.isPlaying()) {
      this.clearPeople();
    }
  }*/

  finishQueue(queue) {
    if (this.queue) {
      this.clearPeople();
      this.queue.dispose();
      this.queue = null;

      let train = this.parked.headTrain();
      this.parked = null;
      
      train.State('run');

      if (this.data.taskName)
        this.game.completedTask(this.data.taskName, this);
    }
  }

  onChangeTrainState(data) {
    let train = data instanceof Train ? data : null;

    if (train && this.parked &&

      (train.State() == 'stop') && 
      (this.parked.headTrain() == train)) {

      if (this.getPeopleCount() > 0) { // Если забираем людей

        this.parked.headTrain().State('boarding');
        this.queue = new Queue(this.game, this);

        let center = this.parked.getWorldPosition().add(this.getWorldPosition()).multiplyScalar(0.5);

        this.queue.setWorldPosition(center);
        this.parked.setCargoCount(this.getPeopleCount());

        setTimeout(()=>{
          this.finishQueue();
        }, 10000);
      } else if (this.parked.cargoCount > 0) {

        this.injectPeople(this.parked.cargoCount);
        this.parked.setCargoCount(0);
        setTimeout(()=>{
          this.finishUnloading(train);
        }, 1000);

      }
    }
  }

  finishUnloading(train) {
    if (this.data.taskName)
      this.game.completedTask(this.data.taskName, this);
  }

  injectPeople(count) {
    if (count > 0) {
      const l2 = this.platformMainLength / 2;
      const w2 = this.platformWidth / 2;

      for (let i=0; i<count; i++) {
        let human = new Human(game, this);

        human.model.position.set(
          (0.5 - Math.random()) * l2 * 2, 
          this.platformHeight / 2 + this.platformY, 
          (0.5 - Math.random()) * w2 * 2);

        this.model.add(human.model);
        this.people.push(human);
      }
    }
  }
  
  // ========== ПРИВАТНЫЕ МЕТОДЫ СОЗДАНИЯ МАТЕРИАЛОВ ==========
  _createMaterials() {
    this.materials.platform = new THREE.MeshStandardMaterial({
      color: this.colors.platform,
      roughness: 0.7,
      metalness: 0.1
    });
    
    this.materials.edge = new THREE.MeshStandardMaterial({
      color: this.colors.edge,
      roughness: 0.5,
      metalness: 0.05
    });
    
    this.materials.pillar = new THREE.MeshStandardMaterial({
      color: this.colors.pillar,
      roughness: 0.6,
      metalness: 0.1
    });
    
    this.materials.lamp = new THREE.MeshStandardMaterial({
      color: this.colors.lamp,
      emissive: 0xFF6600,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.8
    });
    
    this.materials.glass = new THREE.MeshStandardMaterial({
      color: this.colors.glass,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.5
    });
    
    this.materials.stair = new THREE.MeshStandardMaterial({
      color: this.colors.stair,
      roughness: 0.7,
      metalness: 0.05
    });
    
    this.materials.plank = new THREE.MeshStandardMaterial({
      color: this.colors.plank,
      roughness: 0.8,
      metalness: 0.05
    });
    
    // Регистрация материалов
    Object.values(this.materials).forEach(material => {
      this._registerMaterial(material);
    });
  }
  
  // ========== ОСНОВНАЯ ПЛАТФОРМА ==========
  
  _createBasePlatform() {
    const l2 = this.platformMainLength / 2;
    const platform = this.createBox(this.platformMainLength, this.platformHeight, this.platformWidth, this.materials.platform);
    platform.position.y = this.platformY;
    platform.castShadow = true;
    platform.receiveShadow = true;
    this.platformGroup.add(platform);
  }
  
  // ========== БОРТИКИ ==========
  
  _createFrontEdge() {
    const l2 = this.platformMainLength / 2;
    const w2 = this.platformWidth / 2;
    
    const frontEdge = this.createBox(this.platformMainLength + this.edgeWidth, this.edgeHeight, this.edgeWidth, this.materials.edge);
    frontEdge.position.set(0, this.platformY + this.platformHeight / 2 + this.edgeHeight / 2, w2);
    frontEdge.castShadow = true;
    this.platformGroup.add(frontEdge);
  }
  
  _createLeftEdge() {
    const l2 = this.platformMainLength / 2;
    const w2 = this.platformWidth / 2;
    
    const leftEdge = this.createBox(this.edgeWidth, this.edgeHeight, this.platformWidth + this.edgeWidth, this.materials.edge);
    leftEdge.position.set(-l2, this.platformY + this.platformHeight / 2 + this.edgeHeight / 2, 0);
    leftEdge.castShadow = true;
    this.platformGroup.add(leftEdge);
  }
  
  _createRightEdge() {
    const l2 = this.platformMainLength / 2;
    const w2 = this.platformWidth / 2;
    
    const rightEdge = this.createBox(this.edgeWidth, this.edgeHeight, this.platformWidth + this.edgeWidth, this.materials.edge);
    rightEdge.position.set(l2, this.platformY + this.platformHeight / 2 + this.edgeHeight / 2, 0);
    rightEdge.castShadow = true;
    this.platformGroup.add(rightEdge);
  }
  
  // Задний край (со стороны рельсов) - отсутствует, открытая сторона
  
  // ========== ОПОРЫ ==========
  
  _createPillars() {
    const l2 = this.platformMainLength / 2;
    const w2 = this.platformWidth / 2;
    const pillarHeight = this.platformY;
    const pillarRadius = 0.1;
    
    const pillarPositions = [
      { x: -l2 + 0.4, z: -w2 + 0.3 },
      { x: -l2 + 0.4, z: w2 - 0.3 },
      { x: l2 - 0.4, z: -w2 + 0.3 },
      { x: l2 - 0.4, z: w2 - 0.3 },
      { x: 0, z: -w2 + 0.3 },
      { x: 0, z: w2 - 0.3 }
    ];
    
    pillarPositions.forEach(pos => {
      const pillar = this.createCylinder(pillarRadius, pillarRadius, pillarHeight, 8, this.materials.pillar);
      pillar.position.set(pos.x, pillarHeight / 2, pos.z);
      pillar.castShadow = true;
      this.platformGroup.add(pillar);
    });
  }
  
  // ========== ЛЕСТНИЦА ==========
  
  _createStairs() {
    const l2 = this.platformMainLength / 2;
    const stairsX = l2 + this.stepDepth / 2;
    
    for (let i = 0; i < this.stepCount; i++) {
      const stepY = this.platformY - (i + 0.5) * this.stepHeight;
      const stepX = stairsX + i * this.stepDepth / 2;
      
      const step = this.createBox(this.stepWidth, this.stepHeight, this.stepDepth, this.materials.stair);
      step.position.set(stepX, stepY, 0);
      step.castShadow = true;
      step.receiveShadow = true;
      this.platformGroup.add(step);
    }
  }
  
  // ========== ПЕРИЛА ДЛЯ ЛЕСТНИЦЫ ==========
  
  _createStairRailings() {
    const l2 = this.platformMainLength / 2;
    const sd2 = this.stepDepth / 2;
    const stairsX = l2 + sd2;
    const railingHeight = 0.5;
    const railingRadius = 0.02;
    const railingOffset = sd2;
    const stairsHeight = this.stepCount * this.stepHeight;
    
    // Вертикальные столбики
    for (let i = 0; i <= this.stepCount; i++) {
      const stepX = stairsX + i * sd2 - sd2 / 2;
      const stepY = this.platformY - i * this.stepHeight;
      
      const leftRailPillar = this.createCylinder(railingRadius, railingRadius, railingHeight, 4, this.materials.pillar);
      leftRailPillar.position.set(stepX, stepY + railingHeight / 2, -railingOffset);
      leftRailPillar.castShadow = true;
      this.platformGroup.add(leftRailPillar);
      
      const rightRailPillar = this.createCylinder(railingRadius, railingRadius, railingHeight, 4, this.materials.pillar);
      rightRailPillar.position.set(stepX, stepY + railingHeight / 2, railingOffset);
      rightRailPillar.castShadow = true;
      this.platformGroup.add(rightRailPillar);
    }
    
    // Горизонтальные поручни
    const handrailLength = sd2 * this.stepCount;
    const tan = stairsHeight / handrailLength;
    const halha = Math.atan(tan);
    const handrailY = this.platformY + railingHeight - tan * stairsHeight - 0.05;
    
    const leftHandrail = this.createBox(handrailLength, 0.05, 0.05, this.materials.pillar);
    leftHandrail.position.set(stairsX + handrailLength / 2 - 0.1, handrailY, -railingOffset);
    leftHandrail.rotation.z = -halha;
    leftHandrail.castShadow = true;
    this.platformGroup.add(leftHandrail);
    
    const rightHandrail = this.createBox(handrailLength, 0.05, 0.05, this.materials.pillar);
    rightHandrail.position.set(stairsX + handrailLength / 2 - 0.1, handrailY, railingOffset);
    rightHandrail.rotation.z = -halha;
    rightHandrail.castShadow = true;
    this.platformGroup.add(rightHandrail);
  }
  
  // ========== ФОНАРИ ==========
  
  _createSingleLamp(x, z, rotation) {
    const lampGroup = new THREE.Group();
    const lampPillarHeight = 2;
    const lampPillarRadius = 0.06;
    const platformY = this.platformY + this.platformHeight;
    
    // Столб
    const pillar = this.createCylinder(lampPillarRadius, lampPillarRadius, lampPillarHeight, 6, this.materials.pillar);
    pillar.position.y = lampPillarHeight / 2;
    pillar.castShadow = true;
    lampGroup.add(pillar);
    
    // Перекладина
    const crossbar = this.createBox(0.4, 0.06, 0.06, this.materials.lamp);
    crossbar.position.set(0, lampPillarHeight - 0.05, 0.15);
    crossbar.castShadow = true;
    lampGroup.add(crossbar);
    
    // Фонарь
    const lamp = this.createSphere(0.12, 16, this.materials.lamp);
    lamp.position.set(0, lampPillarHeight - 0.02, 0.25);
    lamp.castShadow = true;
    lampGroup.add(lamp);
    
    // Стекло
    const glass = this.createSphere(0.1, 12, this.materials.glass);
    glass.position.set(0, lampPillarHeight - 0.02, 0.25);
    glass.castShadow = true;
    lampGroup.add(glass);
    
    lampGroup.position.set(x, -platformY, z);
    lampGroup.rotation.y = rotation;
    this.platformGroup.add(lampGroup);
    
    return lampGroup;
  }
  
  _createLamps() {
    const l2 = this.platformMainLength / 2;
    const w2 = this.platformWidth / 2;
    
    const lampPositions = [
      { x: -l2 + 0.3, z: w2 + 0.15, rot: 0 },
      { x: l2 - 0.3, z: w2 + 0.15, rot: 0 },
      { x: -l2 + 0.3, z: -w2 - 0.15, rot: Math.PI },
      { x: l2 - 0.3, z: -w2 - 0.15, rot: Math.PI }
    ];
    
    lampPositions.forEach(pos => {
      this._createSingleLamp(pos.x, pos.z, pos.rot);
    });
  }
  
  // ========== ДЕКОРАТИВНЫЕ ДОСКИ ==========
  
  _createPlanks() {
    const w2 = this.platformWidth / 2;
    
    for (let i = -2; i <= 2; i++) {
      const plank = this.createBox(0.15, 0.05, 0.6, this.materials.plank);
      plank.position.set(i * 0.5, this.platformY + this.platformHeight / 2 + 0.04, 0);
      plank.rotation.z = (i % 2 === 0 ? 0 : 0.1);
      plank.castShadow = true;
      this.platformGroup.add(plank);
    }
  }
  
  // ========== КОЛЛИЗИЯ ==========
  
  _createCollider() {
    const collider = this.createColliderBox(this.platformMainLength, this.platformHeight + 0.2, this.platformWidth + 0.2);
    collider.position.set(0, this.platformY + this.platformHeight / 2, 0);
    this._registerClickable(collider);
    return collider;
  }
  
  // ========== ОСНОВНОЙ МЕТОД СОЗДАНИЯ МОДЕЛИ ==========
  
  createModel() {
    this.platformGroup = new THREE.Group();
    
    // Создаем материалы
    this._createMaterials();
    
    // Собираем платформу
    this._createBasePlatform();
    this._createFrontEdge();
    this._createLeftEdge();
    this._createRightEdge();
    
    //this._createPillars();
    this._createStairs();
    this._createStairRailings();
    this._createLamps();
    this._createPlanks();
    
    // Коллизия
    const collider = this._createCollider();
    
    // Финальная группа
    const group = new THREE.Group();
    group.add(this.platformGroup);
    group.add(collider);
    
    return group;
  }

  swapDirect(pos, direct) {

  }

  checkNewPos(newPos, direct, object) {

    if (this.queue) 
      return this.queue.checkNewPos(newPos, direct, object);
    else {
      if (Math.random() > 0.96)
        object.rndDirect();

      let xlimit = (this.platformMainLength - this.edgeWidth * 2) / 2;
      let zlimit = (this.platformWidth - this.edgeWidth * 2) / 2;

      if (newPos.x < -xlimit) {
        newPos.x = -xlimit + (Math.abs(newPos.x) - xlimit);
        if (direct.x < 0) direct.x = -direct.x;
      } else if (newPos.x > xlimit) {
        newPos.x = xlimit - (newPos.x - xlimit);
        if (direct.x > 0) direct.x = -direct.x;
      }

      if (newPos.z < -zlimit) {
        newPos.z = -zlimit + (Math.abs(newPos.z) - zlimit);
        if (direct.z < 0) direct.z = -direct.z;
      } else if (newPos.z > zlimit) {
        newPos.z = zlimit - (newPos.z - zlimit);
        if (direct.z > 0) direct.z = -direct.z;
      }

      this.people.forEach(p => {
        if (p != object) {
          let distance = p.getPosition().sub(object.getPosition());
          if (distance.length() < HUMAN_HEIGHT) {

            distance.multiplyScalar(direct.length() * 1.2);
            newPos.add(distance.negate());
            //direct.negate();
            //newPos.add(direct);

            /*
            let lastState = object.state;
            object.setState('wait');
            setTimeout(()=>{
              object.setState(lastState);
            }, 1000);*/
          }
        }
      });

      return {
        newPos: newPos,
        direct: direct
      }
    }
  }
  
  // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========
  
  getAlt() {
    return this.platformY + this.platformHeight;
  }
  
  update(dt) {
    // Анимация мерцания фонарей
    if (this.platformGroup) {
      this.platformGroup.children.forEach(child => {
        if (child.isGroup) {
          child.children.forEach(part => {
            if (part.material && part.material.emissiveIntensity !== undefined) {
              const flicker = 0.3 + Math.sin(Date.now() * 0.005) * 0.15;
              part.material.emissiveIntensity = flicker;
            }
          });
        }
      });
    }
  }
  
  dispose() {
    this.clearPeople();
    if (this.queue) {
      this.queue.dispose();
      this.queue = null;
    }
    super.dispose();
    this.platformGroup = null;
    this.materials = {};

    eventBus.off('runOver', this._onRunOver);
    eventBus.off('change_mashine_state', this._onChangeTrainState);
  }
}

registerClass(RailwayPlatform);