// scripts/models/SimpleTree.js

class Snow extends BaseCellObject {
  
  createModel() {
    let group = new THREE.Group();

    let count = 4;

    let _material = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.7,
      metalness: 0.05
    });

    let half = GAME_SETTINGS.CELL_SIZE / 2;
    for (var i = 0; i < count; i++) {
      let radius = half * (0.3 + Math.random() * 0.7);
      let snow = this.createSphere(radius, 16, _material);

      let setRadius = half;
      snow.position.set((0.5 - Math.random()) * setRadius, -radius * 0.8, (0.5 - Math.random()) * setRadius);
      group.add(snow);
    }
    
    return group;
  }
}

registerClass(Snow);