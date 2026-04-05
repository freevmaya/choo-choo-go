class RailGame extends BaseGame {

  initScene() {
    this.scene = new THREE.Scene();
    this.rendererManager = new RendererManager(this.container);
    this.rendererManager.init();
    this.cameraController = new CameraController(this);
    this.levelLoader = new LevelLoader(this);
    this.lights = [];
    this.gameUI = [];

    eventBus.on('change-cells', this.onChangeCells.bind(this));

    this.gameModes = ['play', 'edit', 'delete', 'playAndEdit', 'dropGame'];
    this.gameModeIndex = 0;
  }

  onChangeCells(cells) {
  }

  preVictory(object) {
    let pos = object.getPosition();
    this.showMagicSwirl(pos.x, pos.y, pos.z);

    setTimeout(()=>{
        this.gameState.set(GAME_STATE.VICTORY);
    }, 2000);
  }

  initUI() {

    super.initUI();

    if (DEV)
      this.initDevTools();
  }

  isPlaying() {
    return this.gameState.isPlaying() && ((this.gameMode() == 'play') || (this.gameMode() == 'playAndEdit'))
  }

  gameMode(state = null) {

    if (state == null)
      return this.gameModes[this.gameModeIndex];

    let index = 0;
    if (typeof state == 'string') {
      index = this.gameModes.indexOf(state);
      if (index == -1) {
        console.error(`Game mode "${state}" not found`);
        return;
      }
    }
    else index = state;

    index = clamp(index, 0, this.gameModes.length - 1);
    if (this.gameModeIndex != index) {
      this.gameModeIndex = index;
      console.log(`Change gameMode: ${this.gameMode()}`);
      eventBus.emit('game-mode-change', this.gameMode());
    }
  }

  saveProject() {
    try {
      let data = this.items.toSaveData();

      if (DEV) {
        Object.keys(data).forEach(k=>{
          GAME_PARAMS[this.paramsIndex][k] = data[k];
        });

        this.stateManager.set('levels', GAME_PARAMS);
        console.log(GAME_PARAMS);
      } else {
        this.stateManager.set('cells', data);
      }

      eventBus.emit('project-saved');
      console.log('Saved');
    } catch (e) {
      console.error(e);
    }
  }

  showMagicSwirl(x, y, z) {
    let effect = new MagicSwirlParticles(this);
    effect.setPosition(x, y, z);
    effect.play();
  }

  initDevTools() {
    let devTools = new DevTools(this);
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

  clearGameUI() {
    this.gameUI.forEach(ui => {
      ui.remove();
    });
    this.gameUI = [];
  }

  createGameUI() {
    this.clearGameUI();

    let ui = GAME_PARAMS[this.paramsIndex].UI;
    if (ui)
      Object.keys(ui).forEach(key => {
        let obj = createObject(key, ui[key]);
        if (obj)
          this.gameUI.push(obj);
      });
  }
  
  createLights() {

    this.clearLights();
    let env = GAME_PARAMS[this.paramsIndex].ENV;

    this.scene.background = toThreeColor(env.BACKGROUND_COLOR);
    let distance = CAMERA_HEIGHT_OFFSET * 1.5;
    this.scene.fog = new THREE.Fog(this.scene.background, distance, distance * 1.2);
    
    const ambient = new THREE.AmbientLight(toThreeColor(env.AMBIENT_LIGHT_COLOR), env.AMBIENT_LIGHT_INTENSITY);
    this.scene.add(ambient);
    this.lights.push(ambient);
    
    const keyLight = new THREE.DirectionalLight(toThreeColor(env.KEY_LIGHT_COLOR), env.KEY_LIGHT_INTENSITY);
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
    
    const fillLight = new THREE.DirectionalLight(toThreeColor(env.FILL_LIGHT_COLOR), env.FILL_LIGHT_INTENSITY);
    fillLight.position.set(-3, 2, 3);
    this.scene.add(fillLight);
    this.lights.push(fillLight);
    
    const rimLight = new THREE.PointLight(toThreeColor(env.RIM_LIGHT_COLOR), env.RIM_LIGHT_INTENSITY, RIM_LIGHT_DISTANCE);
    rimLight.position.set(-2, -1, 4);
    this.scene.add(rimLight);
    this.lights.push(rimLight);
  }

  loadCells(cells) {
    this.items = new Cells(this);
    this.items.init(cells.items, cells.carts, cells.objects);
  }

  createDefaultTrain() {

    let track = [
        {
          type: ForkTrack,
          location: [1, 0, 0]
        }
    ];

    let objects = [
      {
        type: SimpleTree,
        location: [0, 2, 0]
      },{
        type: SimpleTree,
        location: [2, 0, 0]
      },{
        type: SimpleTree,
        location: [-3, -1, 0]
      }
    ]

    let carts = [
    ]

    this.items = new Cells(this);
    this.items.init(track, carts, objects);
  }

  createForScreenshot() {
    let track = [
        {
          type: ForkTrack,
          location: [1, 1, 0]
        }
    ];

    let carts = []

    this.items = new Cells(this);
    this.items.init(track, carts, [{
      type: SimpleTree,
      location: [-2, -1]
    }]);
  }

  getEnv() {
    return GAME_PARAMS[this.paramsIndex].ENV;
  }

  createGameObjects() {
    let env = this.getEnv();

    this.gameMode(env.GAME_MODE || 'play');

    this.createLights();
    this.createGameUI();
    super.createGameObjects();
    this.cameraController.reset();
    this.ground = (new Ground(env.GROUND_IMAGE_PATH, env.GROUND_COLOR)).init(this); //

    if (DEV) {
      /*
      let levels = this.stateManager.get('levels');
      if (levels) {
        Object.keys(levels).forEach(k => {
          GAME_PARAMS[k] = levels[k];
        });
      }*/
    }

    if (this.paramsIndex) {
      this.loadCells(GAME_PARAMS[this.paramsIndex]);
    } else {
      let cells = this.stateManager.get('cells');
      if (cells)
        this.loadCells(cells);
      else this.createDefaultTrain();
    }
  }

  createNewLevel() {
    let keys = Object.keys(GAME_PARAMS);

    let newName = START_GAME + '-' + keys.length;
    GAME_PARAMS[newName] = $.extend({}, DEFAULT_LEVEL, {NAME: newName});
    this.GoToLevel(newName);
  }

  clearItems() {
    if (this.items)
      this.items.clear();
  }

  clearGameObjects() {
    super.clearGameObjects();
    if (this.items) {
      this.items.dispose();
      this.items = null;
    }
  }
  
  onResize() {
    this.rendererManager.resize();
    this.cameraController.resize(this.rendererManager.getAspectRatio());
  }

  update(dt) {
    if (this.isPlaying())
      super.update(dt);

    this.cameraController.update(dt);
    this.rendererManager.render(this.scene, this.cameraController.getCamera());
  }
}


// Запуск игры
onAllImagesLoaded(() => {
  window.game = new RailGame();
});