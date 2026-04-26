class RailGame extends BaseGame {

  initScene() {
    this.scene = new THREE.Scene();
    this.rendererManager = new RendererManager(this.container);
    this.rendererManager.init();

    this.camera = new THREE.PerspectiveCamera(40, this.rendererManager.getAspectRatio(), 0.1, 100);
    this.cameraController = new CameraController(this);
    this.lights = [];
    this.gameUI = [];

    this._resetTask();

    eventBus.on('change-cells', this.onChangeCells.bind(this));
    eventBus.on('user-action', this.onUserAction.bind(this));
    eventBus.on('wrong', this.onWrong.bind(this));

    this.gameModes = ['Play', 'Editor', 'Delete', 'PlayAndEdit', 'DropGame', 'GenCycle'];
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

    if (this.timerId)
      clearInterval(this.timerId);

    eventBus.emit('pre-victory');

    setTimeout(()=>{
        this.gameState.set(GAME_STATE.VICTORY);
    }, 2000);
  }

  init() {
    super.init();
    this.refreshInventory();
  }

  initUI() {

    super.initUI();
    this.handTouch = new HandTouch(this);
    this.timerElem = $('#time');
    this.btnInventory = $('#inventory');
    this.btnInventory.click(this.onClickInventory.bind(this));

    if (DEV)
      this.initDevTools();
  }

  saveCustom() {
    let data = {
      items: this.items.items.map(item => (item.toSaveData())),
      objects: this.items.objects.map(item => (item.toSaveData()))
    }

    data.paramsIndex = this.paramsIndex;
    this.stateManager.set('saved-level', data);
  }

  resetLevelCustom() {
    let custom = this.stateManager.get('saved-level');
    if (custom && (custom.paramsIndex == this.paramsIndex)) {
      let level = this.levels[this.paramsIndex];
      level.items = custom.items;
      //level.carts = custom.carts;
      level.objects = custom.objects;
    }
  }

  onClickInventory() {
    if (this.gameMode() == 'Editor')
      this.gameMode(this.getConst('GAME_MODE'));
    else {
      let inventory = this.stateManager.get('inventory', null);
      if (inventory) {
        this.gameMode('Editor');
        this.modeModule.library.loadClasses(inventory);
        this.modeModule.library.setCloseButton(()=>{
          this.gameMode(this.getConst('GAME_MODE'));
          this.saveCustom();
        });

        this.showTip(lang.get("close-library-to-continue"), 5000);
      }
    }
  }

  refreshInventory() {
    let inventory = this.stateManager.get('inventory', null);
    let have = inventory !== null;

    this.btnInventory.toggleClass('show', have);
    this.btnInventory.toggleClass('hide', !have);

    eventBus.emit('refreshInventory', inventory);
  }

  isPlaying() {
    return this.gameState.isPlaying() && !['Editor', 'Delete'].includes(this.gameMode());
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

  _resetTimer() {
    let amountTime = this.getConst('AMOUNT_TIME');
    this.timerElem.css('display', amountTime ? 'flex' : 'none');

    if (this.timerId)
      clearInterval(this.timerId);

    this.alarmTime = false;
    this.timerElem.removeClass('warning');

    if (amountTime) {
      this.timerId = setInterval(()=>{
        if (this.isPlaying()) {
          amountTime -= 1;

          if (!this.alarmTime && (amountTime < 10))
            this.timerElem.addClass('warning');

          if (amountTime > 0) {
            this.timerElem.find('.time').text(formatTime(amountTime));
          } else this.gameState.set(GAME_STATE.GAME_OVER);
        }
      }, 1000);
    }
  }

  calcBonuse() {
    return this.items ? this.items.calcBonuse() : 0;
  }

  isCompletedTask(task) {
      return this.taskCompleted.includes(task);
  }

  achiveGa(ga) {

    let addScore = ga && ga.data?.score ? ga.data.score : this.getConst("DEFAULT_TASK_SCORE");
    this.addCurrentScore(addScore);

    if (ga) {
      this.showAchievEffect(ga.getWorldPosition());
      this.showAddScoreEffect(ga, addScore);
    }
    eventBus.emit('add-score', addScore);
  }

  completedTask(task, ga) {

    if (!this.isCompletedTask(task)) {
      this.taskCompleted.push(task);
      tracer.log('Tasks completed: ' + JSON.stringify(this.taskCompleted));
      this.achiveGa(ga);

      eventBus.emit('complete-task', ga);
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
          this.levels[this.paramsIndex][k] = data[k];
        });

        //this.stateManager.set('levels', this.levels);
        console.log(this.levels);
      } else {
        this.stateManager.set('cells', data);
      }

      eventBus.emit('project-saved');
      console.log('Saved');
    } catch (e) {
      console.error(e);
    }
  }

  showTargetEffect(start, target) {
    let effect = new ShowTargetEffect(this, {
      position: start,
      target: target
    });

    effect.play();
  }

  showAppearEffect(pos) {
    let effect = new AppearParticles(this, {
      position: pos
    });
    effect.play();
  }

  showAddScoreEffect(ga, addScore) {
    
    let pos = ga.getWorldPosition();
    let rect = this.currentScoreElem[0].getBoundingClientRect();
    pos.y = 2;
    let mid = addScore / 10;
    let effect = new AddScoreParticles(this, {
      position: pos,
      text: () => {
        return '+' + Math.round(mid + (Math.random() - 0.5) * mid);
      },
      target: this.cameraController.screenToWorldPoint({x: rect.left + rect.width / 2, y: rect.top + rect.height / 2})
    });
    effect.play();
  }

  showAchievEffect(x, y = 0, z = 0) {
    if (typeof x == 'object') {
      y = x.y;
      z = x.z;
      x = x.x;
    }
    let effect = new TaskAchievParticles(this, {
      position: new THREE.Vector3(x, y, z)
    });
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

    let ui = this.levels[this.paramsIndex].UI;
    if (ui)
      Object.keys(ui).forEach(key => {
        let obj = createObject(key, ui[key]);
        if (obj)
          this.gameUI.push(obj);
      });
  }
  
  createLights() {

    this.clearLights();
    let env = this.levels[this.paramsIndex].ENV;

    this.scene.background = toThreeColor(env.BACKGROUND_COLOR);
    let distance = CAMERA_HEIGHT_OFFSET * 1.5;
    this.scene.fog = new THREE.Fog(this.scene.background, distance, distance * 1.2);
    
    const ambient = new THREE.AmbientLight(toThreeColor(env.AMBIENT_LIGHT_COLOR), env.AMBIENT_LIGHT_INTENSITY);
    this.scene.add(ambient);
    this.lights.push(ambient);
    
    const keyLight = new THREE.PointLight(
        toThreeColor(this.getConst('KEY_LIGHT_COLOR')), 
        this.getConst('KEY_LIGHT_INTENSITY')
    );
    keyLight.position.set(0, 10, 0);
    keyLight.distance = 15;      // На расстоянии интенсивность станет 0
    keyLight.decay = 1.5;        // Плавность затухания

    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -20;
    keyLight.shadow.camera.right = 20;
    keyLight.shadow.camera.top = 20;
    keyLight.shadow.camera.bottom = -20;
    keyLight.shadow.bias = 0;

    this.scene.add(keyLight);
    this.lights.push(keyLight);
    /*
    const fillLight = new THREE.DirectionalLight(toThreeColor(env.FILL_LIGHT_COLOR), env.FILL_LIGHT_INTENSITY);
    fillLight.position.set(-3, 2, 3);
    this.scene.add(fillLight);
    this.lights.push(fillLight);
    
    const rimLight = new THREE.PointLight(toThreeColor(env.RIM_LIGHT_COLOR), env.RIM_LIGHT_INTENSITY, RIM_LIGHT_DISTANCE);
    rimLight.position.set(-2, -1, 4);
    this.scene.add(rimLight);
    this.lights.push(rimLight);
    */
  }

  shopItems() {
    let list = [
        {
            type: StraightTrack,
            k: 0.1
        },{
            type: EndTrack,
            k: 0.3
        },{
            type: CurvedTrack,
            k: 0.1
        },{
            type: ForkTrack,
            k: 0.15
        },{
            type: ForkRStTrack,
            k: 0.15
        },{
            type: ForkLStTrack,
            k: 0.15
        },{
            type: CrossTrack,
            k: 0.15
        },{
            type: PointTrack,
            k: 0.15
        },{
            type: Train,
            k: 0.7
        },{
            type: SimpleTree,
            k: 0.1
        },{
            type: DeciduousTree,
            k: 0.1
        },{
            type: Snow,
            k: 0.1
        },{
            type: RailwayPlatform,
            k: 0.9
        }
    ];

    let totalScore = Math.max(this.stateManager.get('score', this.currentScore), 200);
    list.forEach((t, i) => {
      list[i].price = Math.round(list[i].k * totalScore)
    })
    return list;
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

  createGameObjects() {
    let env = this.getEnv();

    this.gameMode(env.GAME_MODE || 'Play');

    this.resetLevelCustom();

    this._resetTimer();
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
          this.levels[k] = levels[k];
        });
      }*/
    }

    if (this.paramsIndex) {
      this.loadCells(this.levels[this.paramsIndex]);
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
    let keys = Object.keys(this.levels);

    let newName = START_GAME + '-' + keys.length;
    this.levels[newName] = $.extend({}, DEFAULT_LEVEL);
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

  userScore(value = null) {
    if (value !== null)
      this.setState('score', value);
    else
      value = this.stateManager.get('score', 0);

    return value;
  }

  addPurchased(items, spendScore = 0) {

    let inventory = this.stateManager.get('inventory', null);
    if (inventory) {
      Object.keys(items).forEach((k, i)=>{
        if (inventory[k])
          inventory[k] += items[k];
        else inventory[k] = items[k];
      });
    } else inventory = items;

    if (spendScore > 0) {
      let spendCurrentScore = Math.min(this.currentScore, spendScore);
      let spendTotalScore = spendScore - spendCurrentScore;

      this.addCurrentScore(-spendCurrentScore);
      this.userScore(this.stateManager.get('score', 0) - spendTotalScore);
    }

    this.stateManager.set('inventory', inventory);
    this.refreshInventory();

    eventBus.emit('add-purchased', inventory);
  }
}

// Запуск игры
onAllImagesLoaded(() => {
  window.game = new RailGame();
});

class SmoothRainbowBackground {
  constructor(element, options = {}) {
    this.element = element || document.body;
    this.hue = options.hue || 0;
    this.speed = options.speed || 2;           // градусов за шаг
    this.saturation = options.saturation || 70;
    this.lightness = options.lightness || 50;
    this.alpha = options.alpha !== undefined ? options.alpha : 1;
    
    this.interval = setInterval(() => {
      this.hue = (this.hue + this.speed) % 360;
      this.element.style.backgroundColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
    }, 50);
  }
  
  stop() {
    clearInterval(this.interval);
  }
}

document.addEventListener('show.bs.modal', function (event) {
    if (event.target) {
      /*
      const rainbow = new SmoothRainbowBackground(event.target, {
        hue: Math.random() * 360,
        speed: 0.5, 
        saturation: 80, 
        lightness: 30,
        alpha: 0.3
      });

      let _onHide = () =>{
        rainbow.stop();
        document.removeEventListener('hide.bs.modal', _onHide);
      }
      document.addEventListener('hide.bs.modal', _onHide);
      */
    }
});