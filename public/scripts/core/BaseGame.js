class BaseGame {
  constructor() {
    this.mouseControl = null;
    this.lastTime = performance.now();
    this.frame_num = 0; 
    this.gameStarted = false; // Флаг, что игра была запущена
    this.testResult = this.quickGPUTest();
    this.stateManager = new StateManager();
    this.allow_playing = true;
    this.paramsIndex = START_GAME;
    this.advProvider = () => {
      return new Promise((resolve, reject)=>{
        resolve(true);
      });
    }
    
    // Создаем gameState
    this.gameState = new GameState();

    this.game_container = $('#game-container');
    this.container      = $('#canvas-container');

    this.initScene();
    this.initUI();

    this.stateManager.loadState()
      .then(()=>{
        this.setGameIndex(this.stateManager.get('paramsIndex', START_GAME))
          .then(()=>{
            this.init();
          });
      });
  }

  initScene() {

  }

  initUI() {
    this.stateView = {
      score: $('#state-score'),
      vin: $('#state-vin'),
      title: $('#state-title')
    };

    this.pauseBtn = $('#pause-btn');
    this.pauseBtn.click(()=>{
      this.gameState.pause();
    });

    this.initModals();    
    this.initAudio();

    if ((typeof DEV == 'undefined') || !DEV) {
      $(window).on('blur', () => {
        this.gameState.pause();
      });
    }
  }

  setState(name, value) {
    this.stateManager.set(name, value);
    this.updateStateView();
  }

  updateStateView() {
    let keys = Object.keys(this.stateView);
    keys.forEach((name)=>{
      let val;
      if (name == 'title') {
        let key = this.stateManager.get(name, Object.keys(USER_TITLES)[0]);
        val = lang.get('title_' + key);
      }
      else val = this.stateManager.get(name, '-');

      this.stateView[name].find('.value').text(val);
    });
  }

  quickGPUTest() {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    
    const startTime = performance.now();
    
    // Рисуем 10000 прямоугольников
    for (let i = 0; i < 10000; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
      ctx.fillRect(
        Math.random() * 1000,
        Math.random() * 1000,
        50 + Math.random() * 50,
        50 + Math.random() * 50
      );
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`Canvas 2D тест: ${duration.toFixed(2)}ms`);
    return duration;
  }

  gameSounds() {
    return [];
  }
  
  async initAudio() {
    this.soundManager = new SoundManager(this.gameState);
    try {
      console.log('Загрузка звуков...');
      await this.soundManager.loadAllSounds(this.gameSounds());
      this.soundsLoaded = true;
      console.log('Звуки успешно загружены');
    } catch (error) {
      console.warn('Ошибка загрузки звуков:', error);
    }
  }

  doPlaying() {
    this.frame_num = 0;
    this.updateStateView();
    this.updateGameDisplay();
    this.enableControls();
    this.updateDeltaTime();
  }

  doAfterGameOver() {
    this.advProvider()
      .then((result)=>{
          this.gameOverModal.hide();
          this.resetGame();
      });
  }

  doNextLevel() {
    this.advProvider()
      .then((result)=>{
        this.nextGameIndex()
          .then(()=>{
            this.hideVictoryModal();
            this.resetGame();
          });
      });
  }

  doResume() {
    this.advProvider()
      .then((result)=>{
        this.gameState.resume();
      });
  }
  
  initModals() {
    this.initStartModal();
    this.initGameOverModal();
    this.initVictoryModal();
    this.initPauseModal();
    
    // Настройка обработчика нажатия клавиш
    $(window).on('keydown', (e) => {
      // Перезапуск по клавише R (в любом состоянии, кроме IDLE)
      if ((e.key === 'r' || e.key === 'R') && !this.gameState.isIdle()) {
        this.resetGame();
      }
      
      // Пауза по ESC (только если игра активна и не на паузе)
      if (e.key === 'Escape') {
        if (this.gameState.isPlaying()) {
          this.gameState.pause();
        } else if (this.gameState.isPaused()) {
          this.doResume();
        }
      }
      
      // Клавиша M для отключения звука
      if (e.key === 'm' || e.key === 'M') {
        this.soundManager.setMuted(!this.soundManager.muted);
        console.log(`Звук ${this.soundManager.muted ? 'выключен' : 'включен'}`);
      }
    });
    
    // Подписка на события состояния игры
    this.gameState.on(GAME_STATE.GAME_OVER, () => {
      console.log("Game Over callback вызван");
      this.showGameOverModal();
      this.disableControls();

      let gameOverCount = this.stateManager.get('game_over_count', 0) + 1;
      if (gameOverCount > 2) {
        gameOverCount = 0;
        this.prevGameIndex();
      }
      this.stateManager.set('game_over_count', gameOverCount);
    });
    
    this.gameState.on(GAME_STATE.VICTORY, () => {
      console.log("Victory callback вызван");
      this.Victory();
    });
    
    this.gameState.on(GAME_STATE.PLAYING, () => {
      console.log("PLAYING callback вызван");
      this.doPlaying();
    });
    
    this.gameState.on(GAME_STATE.PAUSED, () => {
      console.log("Pause callback вызван");
      this.showPauseModal();
      this.disableControls();
    });
    
    this.gameState.on(GAME_STATE.RESUME, () => {
      console.log("Resume callback вызван");
      this.hidePauseModal();
      this.gameState.set(GAME_STATE.PLAYING);
    });
    
    this.gameState.on(GAME_STATE.RESET, () => {
      console.log("Reset callback вызван");
      if (this.gameOverModal) {
        this.gameOverModal.hide();
      }
      if (this.victoryModal) {
        this.victoryModal.hide();
      }
      if (this.pauseModal) {
        this.pauseModal.hide();
      }
      this.updateGameDisplay();
    });

    // Подписка на старт игры
    this.gameState.on(GAME_STATE.START, () => {
      console.log("Start callback вызван");
      this.game_container.removeClass('start-blocking');
      this.hideStartModal();
      this.updateGameDisplay();
      this.gameStarted = true;
      this.gameState.set(GAME_STATE.PLAYING);
    });
  }

  NextLevel() {
      this.nextGameIndex()
          .then(()=>{
            this.resetGame();
          });
  }

  GoToLevel(levelKey) {
    this.setGameIndex(levelKey)
          .then(()=>{
            this.resetGame();
          });
  }

  setUserTitle(key) {
    this.setState('title', key);
    eventBus.emit('set_user_title', key);
  }

  getUserTitle(totalScore) {
    let accumulatedScore = 0;
    
    for (const [key, value] of Object.entries(USER_TITLES)) {
      if (totalScore < accumulatedScore + value.step)
        return key;
      accumulatedScore += value.step;
    }
    
    // Если достигнут максимум
    const lastKey = Object.keys(USER_TITLES).pop();
    return lastKey;
  }

  updateUserTitle() {

    let current = this.stateManager.get('title', Object.keys(USER_TITLES)[0]);
    let totalScore = this.stateManager.get('score', this.currentScore);

    let titleKey = this.getUserTitle(totalScore);
    if (titleKey != current) {
      this.setUserTitle(titleKey);
      return titleKey;
    }

    return false;
  }

  clearUserData() {
    this.currentScore = 0;
    this.stateManager.delete('score');
    this.stateManager.delete('vin');
    this.stateManager.delete('title');
    this.stateManager.delete('paramsIndex');

    this.paramsIndex = Object.keys(GAME_PARAMS)[0];

    this.updateStateView();
  }

  Victory() {
    this.calculateScore();

    let lastTotalScore = this.stateManager.get('score', 0);
    let newTotalScore = lastTotalScore + this.currentScore;

    this.setState('score', newTotalScore);
    this.setState('vin', this.stateManager.get('vin', 0) + 1);
    eventBus.emit('new_score', newTotalScore);

    this.showVictoryModal(lastTotalScore, newTotalScore, this.updateUserTitle());
    this.disableControls();
  }

  nextGameIndex() {
    let keys = Object.keys(GAME_PARAMS);
    return this.setGameIndex(keys[(keys.indexOf(this.paramsIndex) + 1) % keys.length]);
  }

  prevGameIndex() {
    let keys = Object.keys(GAME_PARAMS);
    return this.setGameIndex(keys[Math.max(keys.indexOf(this.paramsIndex) - 1, 0)]);
  }

  setGameIndex(value) {
    let keys = Object.keys(GAME_PARAMS);
    this.paramsIndex = GAME_PARAMS[value] ? value : keys[0];
    this.stateManager.set('paramsIndex', this.paramsIndex);

    let index = keys.indexOf(this.paramsIndex);

    this.updateGameDisplay();
    
    if (this.stateManager.get('level', 0) < index) {
      this.stateManager.set('level', index);
      eventBus.emit('new_level', index);
    }
    return this.loadLevelTextures();
  }

  loadLevelTextures() {
    return new Promise((resolve, reject)=>{
      let textures = collectPaths(GAME_PARAMS[this.paramsIndex]);
      this.visibleLoader(true);
      textureLoader.loadTexturesParallel(textures, (result)=>{
        this.visibleLoader(false);
        if (result)
          resolve(result);
        else reject();
      });
    })
  }

  visibleLoader(visible = true) {
    $('body').toggleClass('page-loaded', !visible);
  }
  
  initStartModal() {
    // Получаем элемент модального окна Start
    this.startModalElement = $('#startModal');

    $('#testResult').text(Math.round(this.testResult));
    
    if (this.startModalElement && bootstrap) {
      // Создаем экземпляр Bootstrap модального окна
      this.startModal = new bootstrap.Modal(this.startModalElement, {
        backdrop: 'static',
        keyboard: false
      });
      
      // Обработчик для кнопки старта
      btnOnClick('#startGameButton', this.gameState.start.bind(this.gameState));
    }
  }
  
  initGameOverModal() {
    // Получаем элемент модального окна Game Over
    this.gameOverModalElement = $('#gameOverModal');
    
    if (this.gameOverModalElement && bootstrap) {
      // Создаем экземпляр Bootstrap модального окна
      this.gameOverModal = new bootstrap.Modal(this.gameOverModalElement, {
        backdrop: 'static',
        keyboard: false
      });
      
      // Обработчик для кнопки рестарта в Game Over
      btnOnClick('#restartButton', ()=>{
        this.doAfterGameOver();
      });
      
      // Обработчик для закрытия модального окна
      this.gameOverModalElement.on('hidden.bs.modal', () => {
        if (this.gameState.isGameOver()) {
          this.resetGame();
        }
      });
    }
  }
  
  initVictoryModal() {
    // Получаем элемент модального окна Victory
    this.victoryModalElement = $('#victoryModal');
    
    if (this.victoryModalElement && bootstrap) {
      // Создаем экземпляр Bootstrap модального окна
      this.victoryModal = new bootstrap.Modal(this.victoryModalElement, {
        backdrop: 'static',
        keyboard: false
      });
      
      // Обработчик для кнопки рестарта в Victory
      btnOnClick('#victoryRestartButton', this.doNextLevel.bind(this));
      
      // Обработчик для закрытия модального окна
      this.victoryModalElement.on('hidden.bs.modal', () => {
        if (this.gameState.isVictory()) {
          this.resetGame();
        }
      });
    }
  }
  
  initPauseModal() {
    // Получаем элемент модального окна Pause
    this.pauseModalElement = $('#pauseModal');
    
    if (this.pauseModalElement && bootstrap) {
      // Создаем экземпляр Bootstrap модального окна
      this.pauseModal = new bootstrap.Modal(this.pauseModalElement, {
        backdrop: 'static',
        keyboard: false
      });
      
      // Обработчик для кнопки продолжения
      btnOnClick('#resumeButton', this.doResume.bind(this));
      
      // Обработчик для кнопки рестарта в паузе
      btnOnClick('#pauseRestartButton', () => {
        this.hidePauseModal();
        this.resetGame();
      });
    }
  }
  
  showStartModal() {
    if (this.startModal) {
      this.startModal.show();
    }
  }
  
  hideStartModal() {
    if (this.startModal) {
      this.startModal.hide();
    }
  }
  
  showGameOverModal() {
    // Обновляем статистику в модальном окне
    const finalBounceElement = $('#finalBounceCount');
    
    if (finalBounceElement && this.ball) {
      finalBounceElement.text(this.ball.getBounceCount());
    }
    
    // Показываем модальное окно

    let restartButton = $('#restartButton')[0];

    restartButton.disabled = true;
    setTimeout(()=>{
      restartButton.disabled = false;
    }, 3000);

    this.gameOverModal.show();
  }

  hideVictoryModal() {
    this.victoryModal.hide();
  }
  
  showVictoryModal(lastScore, newScore, newTitle) {
    // Обновляем статистику в модальном окне победы
    const victoryBounceElement = $('#victoryBounceCount');
    const victoryScoreElement = $('#victoryScore');
    
    if (victoryBounceElement && this.ball) {
      victoryBounceElement.text(this.ball.getBounceCount());
    }

    const victoryRestartBtn = $('#victoryRestartButton')[0];

    victoryRestartBtn.disabled = true;
    setTimeout(()=>{
      victoryRestartBtn.disabled = false;
    }, 4000);

    let newTitleElem = this.victoryModalElement.find('.new-title');
    if (newTitle) {
      let titleText = lang.get('new_rank') + ' ' + lang.get('title_' + newTitle) + '!';
      newTitleElem.html(titleText + '<div class="title-image ' + newTitle + '"></div>');
      newTitleElem.css('display', 'block');
    } else newTitleElem.css('display', 'none');
    
    // Показываем модальное окно
    this.victoryModal.show();

    victoryScoreElement.text(0);
    enumerateTo(lastScore, newScore, 2000, (score)=>{
      victoryScoreElement.text(Math.round(score));
    }, ()=>{

      let coord = $('#victoryState')[0].getBoundingClientRect();
      new SparkEffect({
        x: coord.x + coord.width / 2,
        y: coord.y + coord.height / 2,
        count: this.testResult > 30 ? 60 : 30,
        colors: ['#FFF', '#F8F', '#FF8', '#8FF'],
        sizes: [4, 8],
        speeds: [1, 3],
        gravity: 0.04,
        baseRadius: coord.width * 0.4
      });
    });
  }
  
  showPauseModal() {
    if (this.pauseModal) {
        let title = this.stateManager.get('title') || Object.keys(USER_TITLES)[0];
        this.pauseModalElement.find('.title-image').toggleClass(title, true);
        this.pauseModalElement.find('.title').text(lang.get('title_' + title));
        this.pauseModal.show();
    }
  }
  
  hidePauseModal() {
    this.pauseModal.hide();
  }
  
  showScoreIndicator() {
    this.scoreIndicatorElement.css('display', 'block');
  }
  
  hideScoreIndicator() {
    this.scoreIndicatorElement.css('display', 'none');
  }
  
  updateGameDisplay() {
    $('#game-title').text(lang.get(GAME_PARAMS[this.paramsIndex].NAME));
  }
  
  showKillerIndicator() {
    this.killerIndicatorElement.css('display', 'block');
  }
  
  hideKillerIndicator() {
    this.killerIndicatorElement.css('display', 'none');
  }
  
  disableControls() {
    if (this.mouseControl) {
      this.mouseControl.destroy();
      this.mouseControl = null;
    }
  }
  
  enableControls() {
    this.visibleLoader(false);
  }
  
  updateScoreIndicator() {
  }
  
  calculateScore() {
    if (!this.ball) return;
    
    const bounceCount = this.ball.getBounceCount();
    // Формула: чем меньше отскоков, тем больше очков
    // Максимум 1000 очков при 0 отскоков, минимум 100 при максимальном количестве
    const MAX_BOUNCES = 80; // Ожидаемое максимальное количество отскоков
    const MAX_SCORE = 500;
    const MIN_SCORE = 50;
    
    if (bounceCount >= MAX_BOUNCES) {
      this.currentScore = MIN_SCORE;
    } else {
      // Линейная интерполяция: больше отскоков = меньше очков
      this.currentScore = Math.floor(
        MAX_SCORE - (bounceCount / MAX_BOUNCES) * (MAX_SCORE - MIN_SCORE)
      );
    }
    
    this.updateScoreIndicator();
  }
  
  init() {
    
    // Создание игровых объектов (но не активируем физику)
    this.createGameObjects();
    // Запуск анимации
    this.animate();

    this.showStartModal();
    this.updateStateView();
    this.visibleLoader(false);

    this.soundControl();
    
    $(window).on('resize', this.onResize.bind(this));
    $(window).trigger('game-ready');
  }

  soundControl() {

    this.volume = $('#volume');
    this.volume.toggleClass('on', this.stateManager.get('sound_on', true));
    this.updateSoundControl();

    this.volume.click(()=>{
      this.volume.toggleClass('on');
      this.updateSoundControl();
    });
  }

  updateSoundControl() {
    let on = this.volume.hasClass('on');
    this.stateManager.set('sound_on', on);
    this.soundManager.setMuted(!on);
  }
  
  createGameObjects() {
    
    // Сброс счета
    this.currentScore = 0;
    this.updateScoreIndicator();
  }

  clearGameObject() {
  }
  
  resetGame() {
    console.log("Сброс игры...");
    this.clearGameObject();
    this.createGameObjects();

    this.newTitle = null;
    
    // Сброс счета
    this.currentScore = 0;
    this.updateScoreIndicator();
    
    // Сброс состояния игры (это вызовет onReset колбэки)
    this.gameState.reset();
  }
  
  onResize() {
  }

  checkGameOver() {
    return false;
  }
  
  doCheckGameOver() {
    if (!this.gameState.isPlaying() || !this.ball) return;
    
    if (this.checkGameOver())
      this.gameState.gameOver();
  }

  updateDeltaTime() {
    const time = performance.now();
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;
    return Math.min(dt, 0.1);
  }

  allowUpdate() {
    return this.allow_playing && this.gameState.isPlaying() && (textureLoader.loading <= 0);
  }

  update(dt) {
    this.frame_num++;
    // Проверка конца игры, только после 30 кадров игры
    if (this.frame_num > 30)
      this.doCheckGameOver();
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (this.allowUpdate()) 
      this.update(this.updateDeltaTime());
  }
}

const bootstrap = window.bootstrap;