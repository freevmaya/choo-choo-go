class RailGame extends BaseGame {

  initScene() {
    this.scene = new THREE.Scene();
    this.rendererManager = new RendererManager(this.container);
    this.rendererManager.init();


    this.camera = new THREE.PerspectiveCamera(40, this.rendererManager.getAspectRatio(), 0.1, 100);
    this.cameraController = new CameraController(this);
    this.levelLoader = new LevelLoader(this);
    this.lights = [];
    this.gameUI = [];

    this._resetTask();

    eventBus.on('change-cells', this.onChangeCells.bind(this));
    eventBus.on('user-action', this.onUserAction.bind(this));

    this.gameModes = ['Play', 'Editor', 'Delete', 'PlayAndEdit', 'DropGame'];
    this.gameMode('Play');
  }

  onUserAction(data) {
    this.showAchievEffect(data.position);
  }

  onChangeCells(cells) {
  }

  createSoundManager() {
    return new GSoundManager(this);
  }

  preVictory(object) {
    let pos = object.getPosition();
    this.showMagicSwirl(pos.x, pos.y, pos.z);

    eventBus.emit('pre-victory');

    setTimeout(()=>{
        this.gameState.set(GAME_STATE.VICTORY);
    }, 2000);
  }

  initUI() {

    super.initUI();

    this.toast = new ToastMessage(this);
    this.handTouch = new HandTouch(this);

    if (DEV)
      this.initDevTools();
  }

  getConst(name, defaultValue = null) {
      return this.getEnv()[name] ? this.getEnv()[name] : 
            (typeof GAME_SETTINGS[name] != 'undefined' ? GAME_SETTINGS[name] : defaultValue);
  }

  isPlaying() {
    return this.gameState.isPlaying() && !['Editor', 'Delete'].includes(this.gameMode());
  }

  resetGame() {
    super.resetGame();
    this._resetGameModeModule();
  }

  gameMode(state = null) {

    let index = 0;

    if (state == null) {
      if (typeof this.gameModeIndex == 'undefined')
        return this.gameMode(index);

      return this.gameModes[this.gameModeIndex];
    }

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
      this._resetGameModeModule();

      console.log(`Change gameMode: ${this.gameMode()}`);
      eventBus.emit('game-mode-change', this.gameMode());
    }

    return this.gameModes[this.gameModeIndex];
  }

  setGameIndex(value) {
    let result = super.setGameIndex(value);
    this._resetTask();
    return result;
  }

  _resetTask() {
    let env = this.getEnv();

    this.task = env.task ? env.task : ['finish'];
    this.taskCompleted = [];
  }

  _resetGameModeModule() {
    if (this.modeModule) {
      this.modeModule.dispose();
      this.modeModule = null;
    }

    this.modeModule = createObject(this.gameModes[this.gameModeIndex], this);
  }

  isCompletedTask(task) {
      return this.taskCompleted.includes(task);
  }

  completedTask(task) {

    if (!this.isCompletedTask(task)) {
      this.taskCompleted.push(task);
      console.log('Tasks completed: ' + JSON.stringify(this.taskCompleted));
      eventBus.emit('complete-task', task);
    }

    if (this.task) {
      let count = this.task.length;
      this.taskCompleted.forEach(t=>{
          if (this.task.includes(t))
              count--;
      })
      if (count <= 0) {
          this.preVictory(this.items.findAsTask(task));
      }
    }
  }

  deCompletedTask(task) {
    let idx = this.taskCompleted.indexOf(task);
    if (idx > -1)
      this.taskCompleted.splice(idx, 1);
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

  showAchievEffect(x, y, z) {
    let effect = new TaskAchievParticles(this);
    effect.setPosition(x, y, z);
    effect.play();
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
      ui.dispose();
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
    return GAME_PARAMS[this.paramsIndex] ? GAME_PARAMS[this.paramsIndex].ENV : DEFAULT_LEVEL.ENV;
  }

  createGameObjects() {
    let env = this.getEnv();

    this.gameMode(env.GAME_MODE || 'Play');

    this.createLights();
    this.createGameUI();
    super.createGameObjects();
    if (this.cameraController)
      this.cameraController.reset();
    this.ground = (new Ground(env.GROUND_IMAGE_PATH, env.GROUND_COLOR)).init(this);

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

    this.doAfterFrame(()=>{
      eventBus.emit('created-game-objects', this);
    });

    this.cameraController.setLookCell(this.getConst("START_CELL", GAME_SETTINGS.START_CELL));
  }

  createNewLevel() {
    let keys = Object.keys(GAME_PARAMS);

    let newName = START_GAME + '-' + keys.length;
    GAME_PARAMS[newName] = $.extend({}, DEFAULT_LEVEL);
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

    eventBus.emit('cleared-game-objects', this);
  }
  
  onResize() {
    this.rendererManager.resize();
    if (this.cameraController)
      this.cameraController.resize(this.rendererManager.getAspectRatio());
  }

  update(dt) {
    if (this.isPlaying())
      super.update(dt);

    if (this.handTouch)
      this.handTouch.update(dt);

    if (this.cameraController)
      this.cameraController.update(dt);
    this.rendererManager.render(this.scene, this.camera);
  }
}


// Запуск игры
onAllImagesLoaded(() => {
  window.game = new RailGame();
});