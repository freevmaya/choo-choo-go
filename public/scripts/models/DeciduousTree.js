// scripts/models/DeciduousTree.js

class DeciduousTree extends BaseCellObject {
  constructor(data = null) {
    super(data);
    
    this.treeGroup = null;
    this.animationTime = 0;
    
    // Параметры лиственного дерева
    this.trunkHeight = 1.2;
    this.trunkRadius = 0.1;
    this.crownRadius = 0.8;
    this.crownHeight = 1.0 + Math.random();
  }
  
  createModel() {
    this.treeGroup = new THREE.Group();
    
    // Материал для ствола
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B5A2B,
      roughness: 0.7,
      metalness: 0.1
    });
    
    this._registerMaterial(trunkMaterial);
    
    // Материалы для листвы (разные оттенки зеленого)
    const leafDarkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A7A2E,
      roughness: 0.5,
      metalness: 0.05
    });
    
    const leafMidMaterial = new THREE.MeshStandardMaterial({
      color: 0x5C9E3E,
      roughness: 0.5,
      metalness: 0.05
    });
    
    const leafLightMaterial = new THREE.MeshStandardMaterial({
      color: 0x6BB84E,
      roughness: 0.5,
      metalness: 0.05
    });
    
    const leafWarmMaterial = new THREE.MeshStandardMaterial({
      color: 0x7CB342,
      roughness: 0.5,
      metalness: 0.05
    });
    
    this._registerMaterial(leafDarkMaterial);
    this._registerMaterial(leafMidMaterial);
    this._registerMaterial(leafLightMaterial);
    this._registerMaterial(leafWarmMaterial);
    
    const materials = [leafDarkMaterial, leafMidMaterial, leafLightMaterial, leafWarmMaterial];
    
    // СТВОЛ (прямой, без сужения)
    const trunk = this.createCylinder(
      this.trunkRadius, 
      this.trunkRadius * 1.1, 
      this.trunkHeight, 
      8,
      trunkMaterial
    );
    trunk.position.y = this.trunkHeight / 2;
    this.treeGroup.add(trunk);
    
    // КРОНА - раскидистая, широкая, не конусовидная
    
    // Центральная часть кроны (самая большая)
    const centerGeometry = new THREE.SphereGeometry(this.crownRadius * 0.9, 24, 24);
    const centerCrown = new THREE.Mesh(centerGeometry, leafMidMaterial);
    centerCrown.position.y = this.trunkHeight + this.crownHeight * 0.5;
    centerCrown.castShadow = true;
    centerCrown.receiveShadow = true;
    
    this._registerGeometry(centerGeometry);
    this.treeGroup.add(centerCrown);
    
    // Верхняя часть кроны
    const topGeometry = new THREE.SphereGeometry(this.crownRadius * 0.7, 20, 20);
    const topCrown = new THREE.Mesh(topGeometry, leafLightMaterial);
    topCrown.position.y = this.trunkHeight + this.crownHeight * 0.85;
    topCrown.castShadow = true;
    
    this._registerGeometry(topGeometry);
    this.treeGroup.add(topCrown);
    
    // Боковые "шапки" кроны (слева и справа)
    const sideOffset = this.crownRadius * 0.7;
    const sideY = this.trunkHeight + this.crownHeight * 0.45;
    
    const leftGeometry = new THREE.SphereGeometry(this.crownRadius * 0.65, 20, 20);
    const leftCrown = new THREE.Mesh(leftGeometry, leafDarkMaterial);
    leftCrown.position.set(-sideOffset, sideY, 0);
    leftCrown.castShadow = true;
    
    this._registerGeometry(leftGeometry);
    this.treeGroup.add(leftCrown);
    
    const rightGeometry = new THREE.SphereGeometry(this.crownRadius * 0.65, 20, 20);
    const rightCrown = new THREE.Mesh(rightGeometry, leafWarmMaterial);
    rightCrown.position.set(sideOffset, sideY, 0);
    rightCrown.castShadow = true;
    
    this._registerGeometry(rightGeometry);
    this.treeGroup.add(rightCrown);
    
    // Передняя и задняя части кроны
    const frontGeometry = new THREE.SphereGeometry(this.crownRadius * 0.6, 20, 20);
    const frontCrown = new THREE.Mesh(frontGeometry, leafLightMaterial);
    frontCrown.position.set(0, sideY, sideOffset);
    frontCrown.castShadow = true;
    
    this._registerGeometry(frontGeometry);
    this.treeGroup.add(frontCrown);
    
    const backGeometry = new THREE.SphereGeometry(this.crownRadius * 0.6, 20, 20);
    const backCrown = new THREE.Mesh(backGeometry, leafDarkMaterial);
    backCrown.position.set(0, sideY, -sideOffset);
    backCrown.castShadow = true;
    
    this._registerGeometry(backGeometry);
    this.treeGroup.add(backCrown);
    
    // Дополнительные маленькие сферы для объема (случайное расположение)
    const extraCount = 18;
    for (let i = 0; i < extraCount; i++) {
      const angle1 = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const radius = this.crownRadius * (0.4 + Math.random() * 0.5);
      const yOffset = (Math.random() - 0.5) * this.crownHeight * 0.7;
      
      const x = Math.cos(angle1) * Math.sin(angle2) * radius;
      const z = Math.sin(angle1) * Math.sin(angle2) * radius;
      const y = this.trunkHeight + this.crownHeight * 0.5 + yOffset;
      
      const smallGeometry = new THREE.SphereGeometry(0.25 + Math.random() * 0.15, 12, 12);
      const material = materials[Math.floor(Math.random() * materials.length)];
      const smallCrown = new THREE.Mesh(smallGeometry, material);
      smallCrown.position.set(x, y, z);
      smallCrown.castShadow = true;
      
      this._registerGeometry(smallGeometry);
      this.treeGroup.add(smallCrown);
    }
    
    // ВЕТКИ (отходящие от ствола в стороны)
    const branchCount = 8;
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const yPos = 0.6 + Math.random() * 1.2;
      const branchLength = 0.7 + Math.random() * 0.5;
      
      const branchGroup = new THREE.Group();
      
      // Ветка
      const branchGeometry = new THREE.CylinderGeometry(this.trunkRadius * 0.4, this.trunkRadius * 0.2, branchLength, 4);
      const branch = new THREE.Mesh(branchGeometry, trunkMaterial);
      branch.rotation.z = Math.PI / 2.5;
      branch.position.x = branchLength / 2;
      branch.castShadow = true;
      
      this._registerGeometry(branchGeometry);
      branchGroup.add(branch);
      
      // Листья на конце ветки
      const leafClusterGeometry = new THREE.SphereGeometry(0.28, 10, 10);
      const leafCluster = new THREE.Mesh(leafClusterGeometry, leafLightMaterial);
      leafCluster.position.set(branchLength - 0.1, 0.05, 0);
      leafCluster.castShadow = true;
      
      this._registerGeometry(leafClusterGeometry);
      branchGroup.add(leafCluster);
      
      branchGroup.position.set(
        Math.cos(angle) * (this.trunkRadius * 0.7),
        yPos,
        Math.sin(angle) * (this.trunkRadius * 0.7)
      );
      branchGroup.rotation.y = angle;
      
      this.treeGroup.add(branchGroup);
    }

    // КОРНИ у основания
    const rootCount = 5;
    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * Math.PI * 2;
      const rootGeometry = new THREE.CylinderGeometry(this.trunkRadius * 0.5, this.trunkRadius * 0.6, this.trunkRadius * 0.8, 4);
      const root = new THREE.Mesh(rootGeometry, trunkMaterial);
      root.position.set(Math.cos(angle) * 0.5, 0.15, Math.sin(angle) * 0.5);
      root.rotation.z = angle * 0.5;
      root.castShadow = true;
      
      this._registerGeometry(rootGeometry);
      this.treeGroup.add(root);
    }    
    
    // ТЕКСТУРА КОРЫ (добавляем небольшие выступы на стволе)
    const barkDetailCount = 12;
    for (let i = 0; i < barkDetailCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const yPos = Math.random() * this.trunkHeight;
      const detailGeometry = new THREE.BoxGeometry(this.trunkRadius * 0.5, this.trunkRadius * 0.8, this.trunkRadius * 0.3);
      const detail = new THREE.Mesh(detailGeometry, trunkMaterial);
      detail.position.set(
        Math.cos(angle) * (this.trunkRadius + 0.05),
        yPos,
        Math.sin(angle) * (this.trunkRadius + 0.05)
      );
      detail.castShadow = true;
      
      this._registerGeometry(detailGeometry);
      this.treeGroup.add(detail);
    }

    let size = this.crownHeight + this.trunkHeight;
    let collider = this.createColliderBox(this.crownRadius * 2, size, this.crownRadius * 2);

    collider.position.y = size / 2;
    this._registerClickable(collider);
    
    let group = new THREE.Group();
    group.add(this.treeGroup);
    group.add(collider);
    
    return group;
  }
  
  update(dt) {
    this.animationTime += dt;
    
    // Легкое покачивание дерева
    if (this.treeGroup) {
      const sway = Math.sin(this.animationTime * 0.4) * 0.006;
      const swayX = Math.sin(this.animationTime * 0.35) * 0.004;
      this.treeGroup.rotation.z = sway;
      this.treeGroup.rotation.x = swayX;
    }
  }
  
  dispose() {
    super.dispose();
    this.treeGroup = null;
  }
}

registerClass(DeciduousTree);