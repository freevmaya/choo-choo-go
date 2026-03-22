// scripts/core/CameraController.js

class CameraController {

  constructor(game) {

    this.game = game;
    this.targetFocus = this.calcTargetFocus();
    this.camera = new THREE.PerspectiveCamera(this.targetFocus, this.game.rendererManager.getAspectRatio(), 0.1, 100);
    this.targetY = 0;
    this.followSpeed = CAMERA_FOLLOW_SPEED;
    this.heightOffset = CAMERA_HEIGHT_OFFSET;
  }

  calcTargetFocus() {
    return this.game.rendererManager.renderer.domElement.clientWidth < 500 ? 40 : 40;
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
  
  update(dt, targetY) {
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);
    /*
    let diff = this.targetFocus - this.camera.fov;
    if (Math.abs(diff) > 0.1)
      this.setFocus(this.camera.fov + diff * dt);
      */
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