// scripts/core/CameraController.js

class CameraController {

  constructor(game) {

    this.game = game;
    this.targetFocus = this.calcTargetFocus();
    this.camera = new THREE.PerspectiveCamera(this.targetFocus, this.game.rendererManager.getAspectRatio(), 0.1, 100);
    this.targetY = 0;
    this.followSpeed = CAMERA_FOLLOW_SPEED;
    this.heightOffset = CAMERA_HEIGHT_OFFSET;
    this.lookPoint = [0, 0];
    this.setLookPoint([1, 1]);
  }

  calcTargetFocus() {
    return this.game.rendererManager.renderer.domElement.clientWidth < 500 ? 40 : 40;
  }

  setLookPoint(value) {
    this.targetPoint = [1, 1];
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

    this.lookPoint[0] = this.lookPoint[0] + (this.targetPoint[0] - this.lookPoint[0]) * this.followSpeed * dt;
    this.lookPoint[1] = this.lookPoint[1] + (this.targetPoint[1] - this.lookPoint[1]) * this.followSpeed * dt;

    let lookAt = {
      x: this.lookPoint[0] * GAME_SETTINGS.CELL_SIZE,
      y: 0,
      z: this.lookPoint[1] * GAME_SETTINGS.CELL_SIZE
    };

    this.camera.position.set(lookAt.x + this.heightOffset, lookAt.y + this.heightOffset, lookAt.z + this.heightOffset);
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