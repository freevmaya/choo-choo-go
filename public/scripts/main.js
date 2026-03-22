class RailGame extends BaseGame {
  initScene() {
    this.scene = new THREE.Scene();
    this.rendererManager = new RendererManager(this.container);
    this.rendererManager.init();
    this.cameraController = new CameraController(this);
    this.levelLoader = new LevelLoader(this);
    this.lights = [];
    this.createLights();
  }

  clearLights() {
    // Очищаем старые источники света
    this.lights.forEach(light => {
      if (light.parent) {
        this.scene.remove(light);
      }
    });
    this.lights = [];
  }
  
  createLights() {

    this.clearLights();
    let env = GAME_PARAMS[this.paramsIndex].ENV;

    this.scene.background = new THREE.Color(env.BACKGROUND_COLOR);
    let distance = 20;
    this.scene.fog = new THREE.Fog(env.BACKGROUND_COLOR, distance, distance * 2);
    
    const ambient = new THREE.AmbientLight(env.AMBIENT_LIGHT_COLOR, env.AMBIENT_LIGHT_INTENSITY);
    this.scene.add(ambient);
    this.lights.push(ambient);
    
    const keyLight = new THREE.DirectionalLight(env.KEY_LIGHT_COLOR, env.KEY_LIGHT_INTENSITY);
    keyLight.position.set(20, 20, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 1000;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = 0;
    this.scene.add(keyLight);
    this.lights.push(keyLight);
    
    const fillLight = new THREE.DirectionalLight(env.FILL_LIGHT_COLOR, env.FILL_LIGHT_INTENSITY);
    fillLight.position.set(-3, 2, 3);
    this.scene.add(fillLight);
    this.lights.push(fillLight);
    
    const rimLight = new THREE.PointLight(env.RIM_LIGHT_COLOR, env.RIM_LIGHT_INTENSITY, RIM_LIGHT_DISTANCE);
    rimLight.position.set(-2, -1, 4);
    this.scene.add(rimLight);
    this.lights.push(rimLight);
  }

  createGameObjects() {
    let env = GAME_PARAMS[this.paramsIndex].ENV;

    super.createGameObjects();
    this.cameraController.reset();
    this.ground = (new Ground(null, env.GROUND_IMAGE_PATH)).init(this.scene);

    this.levelLoader.Load({
      trails: [{
        type: StraightTrack,
        location: [0, 0, 1]
      },{
        type: StraightTrack,
        location: [1, 0, 1]
      },{
        type: CurvedTrack,
        location: [2, 0, 1]
      },{
        type: StraightTrack,
        location: [2, 1, 0]
      },{
        type: CurvedTrack,
        location: [2, 2, 0]
      },{
        type: StraightTrack,
        location: [1, 2, 1]
      }]
    });
  }

  clearGameObject() {

    if (this.ground) {
      this.ground.dispose();
      this.ground = null;
    }
  }
  
  onResize() {
    this.rendererManager.resize();
    this.cameraController.resize(this.rendererManager.getAspectRatio());
  }

  update(dt) {
    super.update(dt);
    this.cameraController.update(dt);
    this.ground.update(dt);
    this.rendererManager.render(this.scene, this.cameraController.getCamera());
  }
}


// Запуск игры
onAllImagesLoaded(() => {
  window.game = new RailGame();
});