// scripts/core/CameraController.js

class CameraController {

  constructor(game) {
    this.game = game;
    this.targetFocus = this.calcTargetFocus();
    this.camera = new THREE.PerspectiveCamera(this.targetFocus, this.game.rendererManager.getAspectRatio(), 0.1, 100);
    this.targetY = 0;
    this.followSpeed = CAMERA_FOLLOW_SPEED;
    this.heightOffset = CAMERA_HEIGHT_OFFSET;
    this.lookPoint = new Vector2Int();
    this.setLookPoint(new Vector2Int());
    this.angle = Math.PI / 4;

    $(window).on('keydown', (e) => {
      const key = e.key.toLowerCase();
      
      switch(key) {
          case 'w':
              // движение вперед
              break;
          case 'a':
              this.angle -= Math.PI * 0.05;
              break;
          case 's':
              // движение назад
              break;
          case 'd':
              this.angle += Math.PI * 0.05;
              break;
      }
    });
  }

  calcTargetFocus() {
    return this.game.rendererManager.renderer.domElement.clientWidth < 500 ? 40 : 40;
  }

  setLookPoint(value) {
    this.targetPoint = value;
    tracer.log(value);
  }

  setFocus(f) {
    this.camera.fov = f;
    this.camera.updateProjectionMatrix();
  }

  begin() {
    this.targetFocus = this.calcTargetFocus();
    this.camera.fov = this.targetFocus;// * 1.5;
  }

  reset() {
    this.camera.position.set(0, 0, 12);
    this.camera.lookAt(0, this.camera.position.y, 0);
  }

  getLookDirection() {
    let direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    return direction;
  }
  
  update(dt) {

    this.lookPoint.x = this.lookPoint.x + (this.targetPoint.x - this.lookPoint.x) * this.followSpeed * dt;
    this.lookPoint.y = this.lookPoint.y + (this.targetPoint.y - this.lookPoint.y) * this.followSpeed * dt;

    let center = GAME_SETTINGS.CELL_SIZE / 2;

    let lookAt = new THREE.Vector3(this.lookPoint.x * GAME_SETTINGS.CELL_SIZE + center, 0, 
        this.lookPoint.y * GAME_SETTINGS.CELL_SIZE + center);

    let camPos = new THREE.Vector3(-this.heightOffset, this.heightOffset, 0);
    const euler = new THREE.Euler(0, this.angle, 0);
    camPos.applyEuler(euler);

    this.camera.position.set(lookAt.x + camPos.x, lookAt.y + camPos.y, lookAt.z + camPos.z);
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }
  
  setPosition(x, y, z) {
    this.camera.position.set(x, y, z);
  }

  getPosition() {
    return this.camera.position.clone();
  }
  
  getCamera() {
    return this.camera;
  }
  
  resize(aspectRatio) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}