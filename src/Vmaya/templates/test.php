
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Чух чух поехали!</title>
  
  <!-- Bootstrap CSS -->
  <link href="https://game-dev.local/styles/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="./styles/bootstrap-icons.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="https://game-dev.local/styles/main.css?v=37">

  <!-- JQUERY -->
  <script src="https://game-dev.local/scripts/jquery-4.0.0.min.js"></script>
  <script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

  <script>
    var DEV = true;
  </script>
  <script src="scripts/error-tracker.js?v=37"></script>
<script type="text/javascript">
  ErrorTracker.init({
    version: 37,
    user_id: 0,
    excludeDomains: [
      'generate-phrases',
      'yandex',
          'google',
          'example.org',
          'generate-audio',
          'check-audio'
      ]
  });
</script></head>
<body>
        <div class="loader">
      <div class="spinner-border" role="status">
      </div>
  </div>

  <!-- Основной контейнер игры -->
  <div id="game-container" class="start-blocking">

    <div class="game-ui">
      <div class="game-top">
        <div id="game-title" class="status"></div>
      </div>
      <div class="game-bottom">
        <div class="left">
        </div>
        <div>
          <div class="s-view" id="state-score">
            <div class="status" data-lang="score_label">Счет</div>
            <div class="value">123</div>
          </div>
          <div class="s-view" id="state-vin">
            <div class="status" data-lang="wins_label">Поб.</div>
            <div class="value">123</div>
          </div>
          <div class="s-view" id="state-title">
            <div class="status" data-lang="title_label">Зван.</div>
            <div class="value">Рекрут</div>
          </div>
        </div>
        <div class="right">
        </div>
      </div>

      <div id="tools" class="tools-panel border-block">
        <div class="frame padding-2">
          <span id="pause-btn">
            <i class="bi bi-pause-fill"></i>
          </span>
          <span id="music" class="on">
            <i class="bi bi-music-note-beamed"></i>
          </span>
          <span id="volume" class="on">
            <i class="bi bi-volume-down"></i>
          </span>
        </div>
      </div>

      <div class="tools-block">
        <div id="time" class="tools-panel border-block">
          <div class="frame padding">
            <span data-lang="leave-time">Осталось: </span><span class="time"></span>
          </div>
        </div>

        <!-- Индикатор очков -->
        <div class="tools-panel score-indicator border-block" id="score-indicator">
          <div class="frame padding">
            <i class="bi bi-database-fill"></i> <span data-lang="score_indicator">Счет:</span> <span class="current-score">0</span>
          </div>
        </div>

        <div id="levels" class="tools-panel border-block">
          <div class="frame padding">
             <span onclick="window.game.showLevelsModal()" data-lang="levels">Уровни</span>
          </div>
        </div>

        <div class="tools-panel border-block">
          <div class="frame padding">
             <span onclick="window.game.showShop()" data-lang="shop">Магазин</span>
          </div>
        </div>

        <div id="inventory" class="tools-panel border-block hide">
          <div class="frame padding">
             <span onclick="" data-lang="inventory">Инвентарь</span>
          </div>
        </div>
      </div>
    </div>
    
    <div id="game-canvas-container">
      <div id="canvas-container"></div>
    </div>
  </div>

  <div class="modal fade template" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="dialog-1 modal-content">
        <div class="background">
        </div>
        <div class="wrapper">
          <div class="top">
          </div>
          <div class="middle">
            <div class="dialog-content">
            </div>
          </div>
          <div class="bottom">            
          </div>
        </div>
      </div>
    </div>
  </div>  

  <!-- Подключаем Bootstrap JS глобально -->
  <script src="https://game-dev.local/scripts/bootstrap.bundle.min.js"></script>
  <script src="https://game-dev.local/scripts/three.min.js"></script>

    <script src="https://game-dev.local/scripts/utils/Utils.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/ClassRegistry.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/Vector2Int.js?v=37"></script>
    <script src="https://game-dev.local/scripts/languages/Lang.js?v=37"></script>
    <script src="https://game-dev.local/scripts/constants.js?v=37"></script>
    <script src="https://game-dev.local/scripts/levels.js?v=37"></script>
    <script src="https://game-dev.local/scripts/GameState.js?v=37"></script>
    <script src="https://game-dev.local/scripts/core/PositionCart.js?v=37"></script>
    <script src="https://game-dev.local/scripts/core/BaseGame.js?v=37"></script>
    <script src="https://game-dev.local/scripts/core/Cells.js?v=37"></script>
    <script src="https://game-dev.local/scripts/core/RendererManager.js?v=37"></script>
    <script src="https://game-dev.local/scripts/core/LevelLoader.js?v=37"></script>
    <script src="https://game-dev.local/scripts/core/state-manager.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/BaseStateMashine.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/BaseGameObject.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/BaseCellObject.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/BaseTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/StraightTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/CrossTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/BaseCurveTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/CurvedTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/ForkTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/ForkRStTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/ForkLStTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/PointTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/EndTrack.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/Ground.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/Queue.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/BaseCart.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/Train.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/Wagon.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/PassengerWagon.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/ChristmasTree.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/SimpleTree.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/DeciduousTree.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/Snow.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/RailwayPlatform.js?v=37"></script>
    <script src="https://game-dev.local/scripts/models/Human.js?v=37"></script>
    <script src="https://game-dev.local/scripts/controls/RaycasterManager.js?v=37"></script>
    <script src="https://game-dev.local/scripts/controls/BaseCameraController.js?v=37"></script>
    <script src="https://game-dev.local/scripts/controls/CameraController.js?v=37"></script>
    <script src="https://game-dev.local/scripts/controls/DropGameCamera.js?v=37"></script>
    <script src="https://game-dev.local/scripts/controls/HandTouch.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/EventEmitter.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/TextureLoader.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/MathUtils.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/crypto-js.min.js?v=37"></script>
    <script src="https://game-dev.local/scripts/effects/SparkEffect.js?v=37"></script>
    <script src="https://game-dev.local/scripts/effects/ParticleSystem.js?v=37"></script>
    <script src="https://game-dev.local/scripts/audio/SoundManager.js?v=37"></script>
    <script src="https://game-dev.local/scripts/audio/GSoundManager.js?v=37"></script>
    <script src="https://game-dev.local/scripts/UI/Swipeable.js?v=37"></script>
    <script src="https://game-dev.local/scripts/UI/RailwaySpawner.js?v=37"></script>
    <script src="https://game-dev.local/scripts/UI/Library.js?v=37"></script>
    <script src="https://game-dev.local/scripts/UI/Shop.js?v=37"></script>
    <script src="https://game-dev.local/scripts/UI/ToastMessage.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/BaseModeModule.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/Play.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/Editor.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/Delete.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/PlayAndEdit.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/DropGame.js?v=37"></script>
    <script src="https://game-dev.local/scripts/modes/GenCycle.js?v=37"></script>
    <script src="https://game-dev.local/scripts/main.js?v=37"></script>
    <script src="https://game-dev.local/scripts/utils/DevTools.js?v=37"></script>
    <script src="https://game-dev.local/scripts/UI/RGBColorControl.js?v=37"></script>
  
  <!--<script src="https://game-dev.local/scripts/language-switcher.js?v=37"></script>-->

  <div class="modal fade show" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-modal="true" role="dialog" style="display: block;">
    <div class="modal-dialog modal-dialog-centered">
      <div class="dialog-1 modal-content">
        <div class="background">
        </div>
        <div class="wrapper">
          <div class="top">
          </div>
          <div class="middle">
            <div class="dialog-content">
            <p class="status" data-lang="levels">Уровни</p>
      <div class="list">
        <div class="list-content"><div class="item" data-key="START"><span class="num">0</span><span class="name">START</span></div><div class="item" data-key="LEVEL-2"><span class="num">1</span><span class="name">LEVEL-2</span></div><div class="item" data-key="TEST"><span class="num">2</span><span class="name">TEST</span></div><div class="item" data-key="THREE_WAGONS"><span class="num">3</span><span class="name">THREE_WAGONS</span></div><div class="item" data-key="PICKUP-BASE"><span class="num">4</span><span class="name">PICKUP-BASE</span></div><div class="item" data-key="PATH"><span class="num">5</span><span class="name">PATH</span></div><div class="item" data-key="PICKUP-PASSENGERS"><span class="num">6</span><span class="name">PICKUP-PASSENGERS</span></div><div class="item" data-key="DROP-GAME-1"><span class="num">7</span><span class="name">DROP-GAME-1</span></div><div class="item" data-key="DROP-AND-WAGON"><span class="num">8</span><span class="name">DROP-AND-WAGON</span></div><div class="item" data-key="SORTING"><span class="num">9</span><span class="name">SORTING</span></div><div class="item" data-key="MIN_GEN"><span class="num">10</span><span class="name">MIN_GEN</span></div></div>
      </div>
      <div class="text-center">
        <button type="button" class="btn" data-bs-dismiss="modal" data-lang="pause_resume">Продолжить</button>
      </div></div>
          </div>
          <div class="bottom">            
          </div>
        </div>
      </div>
    </div>
  </div>

      <script src="https://game-dev.local/scripts/test-unit.js?v=37"></script>
    <!-- Eruda is console for mobile browsers-->
    <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init();</script>

    <script type="text/javascript">
      $(window).ready(()=>{
        $('body').addClass('page-loaded');
      })
    </script>
  </body>
</html>