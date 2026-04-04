// scripts/models/Human.js

class Human extends BaseGameObject {

  constructor(game, walkLimit) {
    super(game);
    this.walkLimit = walkLimit;
    this.state = 'walk';
  }

  init(game) {

    this.walkCycle = 0;
    this.armAplitude = 0.5;
    this.footAplitude = 0.02;
    this.walkSpeed = 0.2 + Math.random() * 0.4;
    this.rndDirect();
    
    // Пути к текстурам (могут быть переопределены)
    this.texturePaths = {
      body: null,
      arms: null,
      feet: null
    };
    super.init(game);
    this.lastPos = this.model.position;
    this.lengthPath = 0;
    return this;
  }

  _createBody(material) {
    const bodyHeight = HUMAN_HEIGHT * 0.45;
    const bodyRadius = HUMAN_HEIGHT * 0.15;
    
    const body = this.createCylinder(bodyRadius * 0.5, bodyRadius, bodyHeight, 8, material);
    body.position.y = bodyHeight / 2 + 0.025;
    body.castShadow = true;
    return body;
  }

  _createHead(material) {
    const headRadius = HUMAN_HEIGHT * 0.12;
    
    const head = this.createSphere(headRadius, 16, material);
    head.position.y = HUMAN_HEIGHT * 0.5 + headRadius;
    head.castShadow = true;
    return head;
  }

  _createArms(material) {
    const armGroup = new THREE.Group();
    
    const armLength = HUMAN_HEIGHT * 0.25;
    const armWidth  = HUMAN_HEIGHT * 0.08;
    const armHeight = HUMAN_HEIGHT * 0.08;
    
    const shoulderY = HUMAN_HEIGHT * 0.45;
    const shoulderX = HUMAN_HEIGHT * 0.18;
    
    // Левая рука
    let l_arm = this.createBox(armWidth, armLength, armHeight, material);
    l_arm.position.set(0, -armLength / 2, 0);
    let r_arm = this.createBox(armWidth, armLength, armHeight, material);
    r_arm.position.set(0, -armLength / 2, 0);

    this.leftArm = new THREE.Group();
    this.leftArm.add(l_arm);
    this.leftArm.position.set(-shoulderX, shoulderY, 0);
    armGroup.add(this.leftArm);
    
    // Правая рука

    this.rightArm = new THREE.Group();
    this.rightArm.add(r_arm);
    this.rightArm.position.set(shoulderX, shoulderY, 0);
    armGroup.add(this.rightArm);
    
    return armGroup;
  }

  _createFeet(material) {
    const footGroup = new THREE.Group();
    
    this.footLength = HUMAN_HEIGHT * 0.15;
    const footWidth = HUMAN_HEIGHT * 0.08;
    const footHeight = HUMAN_HEIGHT * 0.06;
    
    const footY = HUMAN_HEIGHT * 0.05;
    const footX = HUMAN_HEIGHT * 0.1;
    
    // Левая стопа
    this.leftFoot = this.createBox(footWidth, footHeight, this.footLength, material);
    this.leftFoot.position.set(-footX, footY, this.footLength / 2);
    this.leftFoot.castShadow = true;
    footGroup.add(this.leftFoot);
    
    // Правая стопа
    this.rightFoot = this.createBox(footWidth, footHeight, this.footLength, material);
    this.rightFoot.position.set(footX, footY, this.footLength / 2);
    this.rightFoot.castShadow = true;
    footGroup.add(this.rightFoot);
    
    return footGroup;
  }
  
  createModel() {
    const group = new THREE.Group();
    
    // Создаем материалы с возможностью загрузки текстур
    // Тело - темное
    this.bodyMaterial = this._createMaterial(
      getRandomColorWithIntensity(0.8, 0.3),
      { roughness: 0.5, metalness: 0.05 },
      this.texturePaths.body // путь к текстуре тела (может быть null)
    );
    
    // Руки - телесные
    this.armsMaterial = this._createMaterial(
      0xFFFFFF, // Телесный/светло-коричневый цвет
      { roughness: 0.4, metalness: 0.02 },
      this.texturePaths.arms // путь к текстуре рук (может быть null)
    );
    
    // Стопы - черные
    this.feetMaterial = this._createMaterial(
      getRandomColorWithIntensity(0.8, 0.1),
      { roughness: 0.6, metalness: 0.1 },
      this.texturePaths.feet // путь к текстуре стоп (может быть null)
    );
    
    // Материал для головы (можно использовать телесный, как у рук)
    const headMaterial = this._createMaterial(
      0xDEB887, // Телесный цвет
      { roughness: 0.3, metalness: 0.02 },
      this.texturePaths.arms // используем ту же текстуру, что и для рук
    );
    
    // Материал для глаз
    const eyeMaterial = this._createMaterial(
      0x000000, // Черный цвет
      { roughness: 0.1, metalness: 0.0 },
      null // без текстуры
    );
    
    // Тело (цилиндр) - темное
    const body = this._createBody(this.bodyMaterial);
    group.add(body);
    
    // Голова - телесная
    const head = this._createHead(headMaterial);
    group.add(head);
    
    // Глаза (маленькие сферы)
    const eyeRadius = HUMAN_HEIGHT * 0.04;
    const eyeY = HUMAN_HEIGHT * 0.62;
    const eyeX = HUMAN_HEIGHT * 0.06;
    
    const leftEye = this.createSphere(eyeRadius, 8, eyeMaterial);
    leftEye.position.set(-eyeX, eyeY, HUMAN_HEIGHT * 0.1);
    leftEye.castShadow = true;
    group.add(leftEye);
    
    const rightEye = this.createSphere(eyeRadius, 8, eyeMaterial);
    rightEye.position.set(eyeX, eyeY, HUMAN_HEIGHT * 0.1);
    rightEye.castShadow = true;
    group.add(rightEye);
    
    // Руки - телесные
    const arms = this._createArms(this.armsMaterial);
    group.add(arms);
    
    // Стопы - черные
    const feet = this._createFeet(this.feetMaterial);
    group.add(feet);
    
    // Коллайдер
    const colliderHeight = HUMAN_HEIGHT;
    const colliderRadius = HUMAN_HEIGHT * 0.2;
    const collider = this.createColliderBox(colliderRadius * 2, colliderHeight, colliderRadius * 2);
    collider.position.y = colliderHeight / 2;
    this._registerClickable(collider);
    group.add(collider);
    
    return group;
  }

  setTexturePaths(texturePaths) {
    if (texturePaths.body !== undefined) this.texturePaths.body = texturePaths.body;
    if (texturePaths.arms !== undefined) this.texturePaths.arms = texturePaths.arms;
    if (texturePaths.feet !== undefined) this.texturePaths.feet = texturePaths.feet;
  }

  rndDirect() {

    if (this.direct) {
      const euler = new THREE.Euler(0, (0.5 - Math.random()) * Math.PI * 0.2, 0);
      this.direct.applyEuler(euler);
    } else {
      this.direct = new THREE.Vector3(1, 0, 0);
      const euler = new THREE.Euler(0, Math.random() * Math.PI * 2, 0);
      this.direct.applyEuler(euler);
    }

    this.direct.normalize();
  }

  setState(state) {
    if (this.state != state) {
      this.state = state;
    }
  }
  
  update(dt) {
    if ((this.state == 'walk') && this.model) {

      let direct = this.direct.clone().multiplyScalar(dt * this.walkSpeed);
      let newPos = this.model.position.clone().add(direct);
      let checkResult = this.walkLimit.checkNewPos(newPos, direct, this);

      this.direct = checkResult.direct.normalize();
      const lenPath = this.model.position.clone().sub(checkResult.newPos).length();

      this.model.position.set(checkResult.newPos.x, checkResult.newPos.y, checkResult.newPos.z);
      this.lengthPath += lenPath;

      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.direct);
      this.model.quaternion.copy(quaternion);

      this.walkCycle = Math.sin(this.lengthPath * Math.PI * 6);

      // Анимация рук (маятник)
      const armSwing = this.walkCycle * this.armAplitude;
      this.leftArm.rotation.x = armSwing;
      this.rightArm.rotation.x = -armSwing;

      this.leftFoot.position.z = this.footLength / 2 + this.walkCycle * this.footAplitude;
      this.rightFoot.position.z = this.footLength / 2 - this.walkCycle * this.footAplitude;
    }
  }
  
  getAlt() {
    return HUMAN_HEIGHT / 2;
  }
  
  dispose() {
    super.dispose();
    this.animatedParts = null;
    
    // Освобождаем материалы
    if (this.bodyMaterial) this.bodyMaterial.dispose();
    if (this.armsMaterial) this.armsMaterial.dispose();
    if (this.feetMaterial) this.feetMaterial.dispose();
  }
}

registerClass(Human);