// scripts/core/BaseGame.js

class BaseGame {
  constructor() {

    this.levels = this.originLevelsCopy();
    this.timers = [];
    this.mouseControl = null;
    this.lastTime = performance.now();
    this.frame_num = 0; 
    this.gameStarted = false; // Флаг, что игра была запущена
    this.testResult = this.quickGPUTest();
    this.stateManager = new StateManager();
    this.allow_playing = true;
    this.paramsIndex = START_GAME;
    this.gameObjects = [];
    this.raycasterManager = null;
    this.afterFrame = [];

    this.accountAddScore = (requireScore) => {
      return new Promise((resolve, reject) => {
        this.showTip(`Здесь типа проходит<br>платеж на ${requireScore}!<br>Жми закрыть.`, 0, null, ()=>{
          this.userScore(this.userScore() + requireScore);
          resolve(true);
        })
      });
    }

    this.advProvider = () => {
      return new Promise((resolve, reject)=>{
        resolve(true);
      });
    }
    
    // Создаем gameState
    this.gameState = new GameState();

    this.game_container = $('#game-container');
    this.container      = $('#canvas-container');

    this.container.on('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });

    this.initScene();
    this.initUI();

    if (hasParam('clear-state')) {
      this.stateManager.clear();
      this.init();
    }
    else this.stateManager.loadState()
      .then(()=>{
        this.setGameIndex(this.stateManager.get('paramsIndex', START_GAME))
          .then(()=>{
            this.init();
          });
      });
  }

  originLevelsCopy() {
    return structuredClone(GAME_PARAMS);
  }

  calcBonuse() {
    return 0;
  }

  setTimeout(afterFunc, time) {
    this.timers.push({
      count: 0,
      time: time,
      after: afterFunc
    });
  }

  getConst(name, defaultValue = null) {
      return this.getEnv()[name] ? this.getEnv()[name] : 
            (typeof GAME_SETTINGS[name] != 'undefined' ? GAME_SETTINGS[name] : defaultValue);
  }

  getEnv() {
    return this.getLevel()?.ENV || DEFAULT_LEVEL.ENV;
  }

  getLevel() {
    return this.levels[this.paramsIndex];
  }

  doAfterFrame(call) {
    this.afterFrame.push(call);
  }

  initScene() {

  }

  initRaycaster() {
    When(()=>this.cameraController && this.scene)
      .then(()=>{
        this.raycasterManager = new RaycasterManager(this);
        eventBus.on('gameObject:click', this.handleObjectClick.bind(this));
      })
  }

  handleObjectClick(data) {
    // Проверяем структуру данных
    let hit = null;
    
    if (data.intersects && data.intersects[0]) {
      hit = data.intersects[0];
    } else {
      console.warn('handleObjectClick: Invalid data format', data);
      return;
    }
    
    if (!hit) return;
    
    const object = hit.object;
    // Находим корневой игровой объект
    let gameObject = object.userData?.gameObject;
    if (!gameObject) {
      // Ищем в родителях
      let current = object;
      while (current && !gameObject) {
        gameObject = current.userData?.gameObject;
        current = current.parent;
      }
    }
    
    if (gameObject && typeof gameObject.onClick === 'function') {
      gameObject.onClick(hit, data);
    }
  }

  registerClickableObject(object, gameObject = null, onClick = null) {
    if (this.raycasterManager) {
      this.raycasterManager.addClickableObject(object);
      if (gameObject) {
        object.userData = object.userData || {};
        object.userData.gameObject = gameObject;
        if (onClick)
          object.userData.onClick = onClick;
      }
    }
  }

  onWrong(data) {
    this.showTip(data);
  }

  showTip(data, readTimeSec = 5, title = "", onClose = null, buttons = []) {
    if (typeof data == 'string') {
      this.toast.show(data, title, onClose, buttons);
      this.toast.setOverModal(this.currentModal !== null);
    }
  }

  unregisterClickableObject(object) {
    if (this.raycasterManager) {
      this.raycasterManager.removeClickableObject(object);
    }
  }

  addCurrentScore(score) {
    this.currentScore += score;
    this.updateScoreIndicator();
  }

  initUI() {
    this.stateView = {
      score: $('#state-score'),
      vin: $('#state-vin'),
      title: $('#state-title')
    };

    this.currentScoreElem = $('#score-indicator');

    $('#reboot-btn').click(()=>{
      this.resetGame();
    });

    this.pauseBtn = $('#pause-btn');
    this.pauseBtn.click(()=>{
      this.showPauseModal();
    });

    this.toast = new ToastMessage(this);

    this.initModals();    
    this.initAudio();

    if ((typeof DEV == 'undefined') || !DEV) {
      $(window).on('blur', () => {
        this.gameState.pause();
      });

      $(window).on('focus', () => {
        this.gameState.resume();
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

  createSoundManager() {
    return null;
  }
  
  async initAudio() {
    this.soundManager = this.createSoundManager();
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
    this.initLevelsModal();
    this.initShopModal();
    
    // Настройка обработчика нажатия клавиш
    $(window).on('keydown', (e) => {
      // Перезапуск по клавише R (в любом состоянии, кроме IDLE)
      if ((e.key === 'r' || e.key === 'R') && !this.gameState.isIdle()) {
        this.resetGame();
      }
      
      // Пауза по ESC (только если игра активна и не на паузе)
      if (e.key === 'Escape') {

        if (this.gameState.isPlaying()) {
          this.showPauseModal();
        } else if (this.gameState.isPaused()) {
          if (this.currentModal) {
            this.currentModal.hide();
            this.currentModal = null;
          }
          this.doResume();
        }
      }
      
      // Клавиша M для отключения звука
      if (e.key === 'm' || e.key === 'M') {
        this.soundManager.ToggleUserMuted();
        console.log(`Звук ${this.soundManager.userMuted ? 'выключен' : 'включен'}`);
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
      //this.showPauseModal();
      this.disableControls();
    });
    
    this.gameState.on(GAME_STATE.RESUME, () => {
      console.log("Resume callback вызван");
      //this.hidePauseModal();
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
      console.log("Start callback вызван", this.game_container);
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
    this.gameState.set(GAME_STATE.IDLE);
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
    this.stateManager.clear();

    this.paramsIndex = Object.keys(this.levels)[0];

    this.updateStateView();
    this.updateScoreIndicator();
  }

  Victory() {

    this.stateManager.set('pass-level', this.paramsIndex);
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
    let keys = Object.keys(this.levels);
    return this.setGameIndex(keys[(keys.indexOf(this.paramsIndex) + 1) % keys.length]);
  }

  prevGameIndex() {
    let keys = Object.keys(this.levels);
    return this.setGameIndex(keys[Math.max(keys.indexOf(this.paramsIndex) - 1, 0)]);
  }

  setGameIndex(value) {
    let keys = Object.keys(this.levels);
    this.paramsIndex = this.levels[value] ? value : keys[0];
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
      let textures = collectPaths(this.levels[this.paramsIndex]);
      if (textures.length > 0) {
        this.visibleLoader(true);
        textureLoader.loadTexturesParallel(textures, (result)=>{
          this.visibleLoader(false);
          if (result)
            resolve(result);
          else reject();
        });
      } else resolve(true);
    })
  }

  visibleLoader(visible = true) {
    $('body').toggleClass('page-loaded', !visible);
  }
  
  initStartModal() {
    // Получаем элемент модального окна Start
    let d = this.initDialog(`
      <div class="actor-icon">
        <div class="frame padding actor-1">
        </div>
      </div>
      <div class="status" data-lang="app_name"></div>
      <p style="padding-top: 20px;"><span data-lang="start_info_1"></span>
      </p>
      <p><span data-lang="start_info_2"></span>
      </p>
      <p style="display:none" class="devBlock">
        <span data-lang="gpu_speed">GPU speed:</span> <span class="testResult"></span>. 
        <span data-lang="version">Version:</span> <span><?=APP_VERSION?></span>
      </p>
      <div class="text-center buttons">
        <button type="button" class="btn" id="startGameButton" data-lang="start_button">Начать</button>
      </div>
    `);

    this.startModalElement = d.dialog;
    this.startModal = d.modal;

    if (DEV) {
      this.startModalElement.find('.devBlock').css('display', 'block');
      this.startModalElement.find('.testResult').text(Math.round(this.testResult));
    }
    
    // Обработчик для кнопки старта
    btnOnClick(this.startModalElement.find('.btn'), this.gameState.start.bind(this.gameState));
  }
  
  initGameOverModal() {
    // Получаем элемент модального окна Game Over

    let d = this.initDialog(`
    <div class="actor-icon">
      <div class="frame padding actor-4">
      </div>
    </div>
    <p class="status" data-lang="game_over_title">Неудача!</p>
      <div class="stats-container">
        <div data-lang="loss-game">
        </div>
      </div>
      <div class="text-center">
        <button type="button" class="btn" data-lang="game_over_button">Продолжить</button>
      </div>      
    `);
    this.gameOverModalElement = d.dialog;
    this.gameOverModal = d.modal;

    this.gameOverModalElement.attr('id', 'loss-game');
      
    // Обработчик для кнопки рестарта в Game Over
    btnOnClick(this.gameOverModalElement.find('.btn'), ()=>{
      this.doAfterGameOver();
    });
    
    // Обработчик для закрытия модального окна
    this.gameOverModalElement.on('hidden.bs.modal', () => {
      if (this.gameState.isGameOver()) {
        this.resetGame();
      }
    });
  }

  initDialog(content) {
    let template = $('.modal.template');
    let dialog = template.clone();
    dialog.removeClass('template');

    dialog.find('.dialog-content').append(content);
    lang.applyToDOM(dialog);
    $('body').append(dialog);

    let modal = new bootstrap.Modal(dialog, {
      backdrop: 'static',
      keyboard: false
    });
    return {dialog, modal};
  }
  
  initVictoryModal() {
    // Получаем элемент модального окна Victory

    let d = this.initDialog(`
      <div class="actor-icon">
        <div class="frame padding actor-2">
        </div>
      </div>
      <p class="modal-subtitle status" data-lang="victory_title"></p>
      <div class="stars"></div>
      <p class="new-title status" data-lang="new_rank"></p>
      <div class="stats-container victory-stats shine">
        <div>
          <div class="stat-value" id="victoryScore">0</div>
          <div class="stat-label" data-lang="victory_score"></div>
        </div>
      </div>

      <div class="text-center">
        <button type="button" class="btn victoryRestartButton" data-lang="victory_button"></button>
      </div>`);
    
    this.victoryModalElement = d.dialog;
    this.victoryModal = d.modal;

    this.victoryModalElement.attr('id', 'victory');
      
    // Обработчик для кнопки рестарта в Victory
    btnOnClick(this.victoryModalElement.find('.btn'), this.doNextLevel.bind(this));
    
    // Обработчик для закрытия модального окна
    this.victoryModalElement.on('hidden.bs.modal', () => {
      if (this.gameState.isVictory()) {
        this.resetGame();
      }
    });
  }
  
  initPauseModal() {
    // Получаем элемент модального окна Pause
    let d = this.initDialog(`<p class="status" data-lang="pause_title">Игра приостановлена</p>
      <p><span data-lang="current_rank">Ваше текущее звание:</span> <span class="title"></span></p>
      <div class="title-image"></div>
      <div class="text-center">
        <button type="button" class="btn" data-bs-dismiss="modal" data-lang="pause_resume">Продолжить</button>
        <button type="button" class="btn pauseRestartButton" data-lang="pause_restart">Новая игра</button>
      </div>`);
    this.pauseModalElement = d.dialog;
    this.pauseModal = d.modal;

    btnOnClick(this.pauseModalElement.find('.pauseRestartButton'), () => {
      this.hidePauseModal();
      this.resetGame();
    });
  }
  
  initLevelsModal() {

    let d = this.initDialog(`<p class="status" data-lang="levels">Уровни</p>
      <div class="list">
        <div class="list-content">
          
        </div>
      </div>
      <div class="text-center">
        <button type="button" class="btn" data-bs-dismiss="modal" data-lang="pause_resume">Продолжить</button>
      </div>`);
    this.levelsModalElement = d.dialog;
    this.levelsModal = d.modal;
    this.levelsModalElement.attr('id', 'levels');
  }
  
  initShopModal() {

    this.shop = new Shop(this, this.shopItems());
  }

  shopItems() {
    return [];
  }

  Purchase(item) {

  }

  showShop() {
    if (this.shop) {
      this.shop.show();
    }
  }

  offerPaid(text, price) {
    return new Promise((resolve, reject)=>{

      this.showTip(text, 15, null, null, [
        {
          caption: lang.get('ok'),
          callback: ()=>{

            this.toast.hide();
            this.spendScoreEndPay(price)
              .then(resolve)
              .catch(reject);
          }
        }
      ]);
    });
  }

  spendScoreEndPay(price) {
    const totalScore = this.currentScore + this.userScore();

    return new Promise((resolve, reject)=>{

        let spendCurrentScore = Math.min(this.currentScore, price);
        let spendTotalScore = price - spendCurrentScore;

        if (price > totalScore) {
          this.accountAddScore(price - totalScore)
              .then((result)=>{
                if (result) {
                  this.addCurrentScore(-spendCurrentScore);
                  this.userScore(this.userScore() - spendTotalScore);
                }
                resolve(result);
              })
              .catch(reject);
        } else {
          this.addCurrentScore(-spendCurrentScore);
          this.userScore(this.userScore() - spendTotalScore);
          resolve(true);
        }
      });
  }

  showLevelsModal() {
    if (this.levelsModal) {

      let content = this.levelsModalElement.find('.list-content');
      content.empty();

      let passLevel = this.paid('levels') ? null : this.stateManager.get('pass-level', START_GAME);
      let lock = false;
      Object.keys(this.levels).forEach((k, i) => {

        let pay_key = 'level-' + k;
        let item = $(`<div class="item" data-key="${k}"><div>${i + 1}</div><div>${lang.get(k)}</div><i class="bi bi-lock-fill"></i></div>`);
        
        item.lock = lock && !this.paid(pay_key);
        item.toggleClass('lock', item.lock);

        if (this.paramsIndex == k)
          item.addClass('current');
        else {

          item.click(()=>{
            if (item.lock)
              this.offerPaid(sprintf(lang.get('level-lock-description'), PRICES.UNLOCK_LEVEL), PRICES.UNLOCK_LEVEL)
                .then(()=>{
                  this.paid(pay_key, true);
                  this.levelsModal.hide();
                  this.GoToLevel(k);
                });
            else {
              this.levelsModal.hide();
              this.GoToLevel(k);
            }
          });
        }
        content.append(item);
        
        if (k == passLevel)
          lock = true;
      });

      this.levelsModal.show();
    }
  }

  paid(service, value = null) {
    let paid = this.stateManager.get('paid', {});
    if (value !== null) {
      paid[service] = value;
      this.stateManager.set('paid', paid);
    }
    return paid[service]
  }
  
  showStartModal() {
    if (this.startModal) {
      this.startModal.show();
    }
  }
  
  hideStartModal() {
    if (this.startModal) {
      this.startModal.hide();
      this.resetGame();
    }
  }

  waitBtn(btn, sec=3) {

    btn[0].disabled = true;
    setTimeout(()=>{
      btn[0].disabled = false;
    }, sec * 1000);
  }
  
  showGameOverModal() {
    this.waitBtn(this.gameOverModalElement.find('.btn'), 2);
    this.gameOverModal.show();
  }

  hideVictoryModal() {
    this.victoryModal.hide();
  }
  
  showVictoryModal(lastScore, newScore, newTitle) {
    // Обновляем статистику в модальном окне победы
    const victoryScoreElement = this.victoryModalElement.find('#victoryScore');

    this.waitBtn(this.victoryModalElement.find('.victoryRestartButton'), 3);    

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

      let coord = this.victoryModalElement.find('.victory-stats')[0].getBoundingClientRect();
      new SparkEffect({
        x: coord.x + coord.width / 2,
        y: coord.y + coord.height / 2,
        count: this.testResult > 30 ? 40 : 20,
        colors: ['#FFF', '#F8F', '#FF8', '#8FF'],
        sizes: [4, 8],
        speeds: [1, 3],
        gravity: 0.04,
        baseRadius: coord.width * 0.4,
        className: 'star'
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
    $('#game-title').text(lang.get(this.paramsIndex));
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
    let valueElem = this.currentScoreElem.find('.current-score');
    let prevValue = Number(valueElem.text());

    let diff = this.currentScore - prevValue;
    this.currentScoreElem.toggleClass('hide', this.currentScore == 0);
    this.currentScoreElem.removeClass('pulse');

    if (diff > 0) {
      enumerateTo(prevValue, this.currentScore, 1000, (score)=>{
        valueElem.text(Math.round(score));
      }, ()=>{

        let coord = this.currentScoreElem[0].getBoundingClientRect();
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

        this.currentScoreElem.addClass('pulse');

      });
    } else valueElem.text(0);
  }
  
  calculateScore() {
    this.updateScoreIndicator();
  }
  
  init() {    
    this.initRaycaster();
    this.animate();

    this.showStartModal();
    this.updateStateView();
    this.visibleLoader(false);

    this.soundControl();
    
    $(window).on('resize', this.onResize.bind(this));
    $(window).trigger('game-ready');
    document.addEventListener('show.bs.modal', this.onShowModal.bind(this));
    document.addEventListener('hide.bs.modal', this.onHideModal.bind(this));

    /*
    if (DEV) 
      setTimeout(this.gameState.start.bind(this.gameState), 1000);
      */
  }

  onShowModal(event) {
    if (this.gameState.isPlaying())
      this.gameState.set(GAME_STATE.PAUSED);

    const modal = bootstrap.Modal.getInstance(event.target);
    if (modal)
      this.currentModal = modal;
  }

  onHideModal(event) {
    if (this.gameState.isPaused())
      this.gameState.set(GAME_STATE.RESUME);

    this.currentModal = null;
  }

  soundControl() {

    this.volume = $('#volume');
    this.volume.toggleClass('on', this.stateManager.get('sound_on', true));

    this.music = $('#music');
    this.music.toggleClass('on', this.stateManager.get('music_on', true));

    this.updateSoundControl();

    this.volume.click(()=>{
      this.volume.toggleClass('on');
      this.updateSoundControl();
    });

    this.music.click(()=>{
      this.music.toggleClass('on');
      this.updateSoundControl();
    });
  }

  updateSoundControl() {
    let on = this.volume.hasClass('on');
    this.stateManager.set('sound_on', on);
    this.soundManager.SetUserMuted(!on);

    on = this.music.hasClass('on');
    this.stateManager.set('music_on', on);
    this.soundManager.SetUserMusicMuted(!on);
  }
  
  createGameObjects() {
    
    // Сброс счета
    this.currentScore = 0;
    this.updateScoreIndicator();
  }

  removeGameObject(ga) {
    let idx = this.gameObjects.indexOf(ga);
    if (idx > -1)
      this.gameObjects.splice(idx, 1);
  }

  clearGameObjects() {

    // Очищаем кликабельные объекты
    if (this.raycasterManager) {
      this.raycasterManager.clearClickableObjects();
    }

    let copy = [...this.gameObjects];

    copy.forEach((ga) => {
      ga.dispose();
    });

    this.gameObjects = [];
  }
  
  resetGame() {
    console.log("Сброс игры...");
    this.clearGameObjects();
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

    this.gameObjects.forEach((ga)=>{
      ga.update(dt);
    });

    this.afterFrame.forEach(c=>c());
    this.afterFrame.length = 0;
    //eventBus.emit('after-frame', dt);

    this.timers.forEach((t, i) => {
      t.count += dt * 1000;
      if (t.count >= t.time) {
        this.timers.splice(i, 1);
        t.after();
      }
    })
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    if (this.allowUpdate()) 
      this.update(this.updateDeltaTime());
  }
}

const bootstrap = window.bootstrap;