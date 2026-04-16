// scripts/audio/GSoundManager.js

class GSoundManager extends SoundManager {
  constructor(game) {

    super();
    this.game = game;
    this.masterVolume = 0.4;
    this.setupActivation();
  }

  init() {
    super.init();
    this.loadAllSounds();

    window.addEventListener('blur', () => {
      this.setMuted(true);
    });

    window.addEventListener('focus', () => {
      this.setMuted(this.userMuted);
    });
  }
  
  /**
   * Настройка активации по первому клику
   */
  setupActivation() {
    const activate = () => {
      if (!this.isActivated()) {
        console.log('SoundManager: Активирован пользователем');

        this.init();
        
        // Удаляем обработчики после активации
        $(document).off('click', activate);
        $(document).off('touchstart', activate);
        $(document).off('keydown', activate);
      }
    };
    
    $(document).on('click', activate);
    $(document).on('touchstart', activate);
    $(document).on('keydown', activate);
    
    // Подписываемся на события звуков
    this.setupEventListeners();
  }

  SetUserMusicMuted(value) {
    super.SetUserMusicMuted(value);
    this.updateMusicMuted();
  }

  updateMusicMuted() {
    if (this.userMusicMuted)
      this.stop('bg-music');
    else this.Play('bg-music', {volume: 0.5, loop: true, ignoreMuted: true});
  }

  setupEventListeners() {

    this.game.gameState.on(GAME_STATE.GAME_OVER, () => {
      this.stop('phuf');
      this.Play('fail-music');
    });

    eventBus.on('pre-victory', () => {
      this.Play('win-level', {volume: 0.4});
    });

    this.game.gameState.on(GAME_STATE.PAUSED, () => {
      this.pause('phuf');
      this.pause('train-start');
    });

    this.game.gameState.on(GAME_STATE.RESUME, () => {
      this.resumeAllSounds();
    });

    /*
    this.game.gameState.on(GAME_STATE.VICTORY, () => {
      this.Play('win-level');
    });
  */

    this.game.gameState.on(GAME_STATE.VICTORY, () => {
      this.stop('phuf');
      this.Play('win-music');
    });

    this.game.gameState.on(GAME_STATE.START, () => {
      this.updateMusicMuted();
    });

    eventBus.on('user-action', () => {
      this.Play('achiev');
    });

    eventBus.on('train-run', () => {
      if (Math.random() > 0.5)
        this.Play('train-start', {volume: 0.5});

      this.Play('phuf', {volume: 0.2, loop: true});
    });

    eventBus.on('train-braking', () => {
      this.stop('phuf');
    });

    eventBus.on('train-stop', () => {
      this.stop('phuf');
    });

    eventBus.on('train-wait', () => {
      this.stop('phuf');
    });

    eventBus.on('train-add-chain', () => {
      this.Play('train-add-chain', {volume: 0.4});
    });

    eventBus.on('train-remove-chain', () => {
      this.Play('train-add-chain', {volume: 0.4});
    });

    eventBus.on('fork-change', () => {
      this.Play('fork-change', {volume: 0.4});
    });

    eventBus.on('wrong', () => {
      this.Play('wrong');
    });
  }

  loadAllSounds() {

    const sounds = [
        { id: 'fail-music', url: 'sounds/fail-music.mp3' },
        { id: 'win-level', url: 'sounds/win-level.mp3' },
        { id: 'bg-music', url: 'sounds/track01.mp3' },
        { id: 'achiev', url: 'sounds/achiev.mp3' },
        { id: 'train-start', url: 'sounds/train-start.mp3' },
        { id: 'phuf', url: 'sounds/phuf.mp3' },
        { id: 'train-add-chain', url: 'sounds/train-add-chain.mp3' },
        { id: 'fork-change', url: 'sounds/fork-change.mp3' },
        { id: 'wrong', url: 'sounds/wrong.mp3' }
    ];
    const promises = sounds.map(sound => this.loadSound(sound.id, sound.url));
    return Promise.allSettled(promises);
  }
}