// scripts/models/SimpleTree.js

class SimpleTree extends BaseCellObject {
  constructor(data = null) {
    super(data);
    
    this.treeGroup = null;
    this.animationTime = 0;
    
    // Параметры ёлки
    this.treeHeight = 5;
    this.baseRadius = 1.2;
    this.topRadius = 0.05;
    this.segments = 12;
    this.tierCount = 4;
  }
  
  createModel() {
    this.treeGroup = new THREE.Group();
    
    // Материал для ёлки (зеленый)
    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c9e3e,
      roughness: 0.7,
      metalness: 0.05
    });
    
    this._registerMaterial(greenMaterial);
    
    // Материал для ствола
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.8
    });
    
    this._registerMaterial(trunkMaterial);
    
    // Создаем слои ёлки
    const tierHeights = [1.2, 1.1, 1.0, 0.9];
    const tierRadii = [1.2, 0.95, 0.7, 0.45];
    let yOffset = 0;
    
    for (let i = 0; i < this.tierCount; i++) {
      const height = tierHeights[i];
      const radiusBottom = tierRadii[i];
      const radiusTop = i === this.tierCount - 1 ? this.topRadius : tierRadii[i + 1] * 0.7;
      
      const coneGeometry = new THREE.ConeGeometry(radiusBottom, height, this.segments);
      const cone = new THREE.Mesh(coneGeometry, greenMaterial);
      cone.position.y = yOffset + height / 2;
      cone.castShadow = true;
      cone.receiveShadow = true;
      
      this._registerGeometry(coneGeometry);
      this.treeGroup.add(cone);

      this._registerClickable(cone);
      
      yOffset += height - 0.1;
    }
    
    // Ствол
    const trunkGeometry = new THREE.CylinderGeometry(0.45, 0.55, 0.5, 6);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -0.3;
    trunk.castShadow = true;
    
    this._registerGeometry(trunkGeometry);
    this.treeGroup.add(trunk);
    this.treeGroup.position.y = -0.5;

    let group = new THREE.Group();
    group.add(this.treeGroup);
    
    return group;
  }
  
  update(dt) {
    this.animationTime += dt;
    
    // Легкое покачивание ёлки
    if (this.treeGroup) {
      const sway = Math.sin(this.animationTime * 0.5) * 0.01;
      this.treeGroup.rotation.z = sway;
      this.treeGroup.rotation.x = sway * 0.5;
    }
  }
  
  dispose() {
    super.dispose();
    this.treeGroup = null;
  }
}

registerClass(SimpleTree);