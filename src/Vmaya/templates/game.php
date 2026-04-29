<?php
    $v = SCRIPTS_VERSION;
    $is_developer = Page::isDev();
    $scripts =  [
      'utils/Utils',
      'utils/ClassRegistry',
      'utils/Vector2Int',
      'languages/Lang',
      'constants',
      'levels',
      'GameState',
      'core/PositionCart',
      'core/BaseGame',
      'core/Cells',
      'core/RendererManager',
      'core/LevelLoader',
      'core/state-manager',
      'models/BaseStateMashine',
      'models/BaseGameObject',
      'models/BaseCellObject',
      'models/BaseTrack',
      'models/StraightTrack',
      'models/CrossTrack',
      'models/BaseCurveTrack',
      'models/CurvedTrack',
      'models/ForkTrack',
      'models/ForkRStTrack',
      'models/ForkLStTrack',
      'models/PointTrack',
      'models/EndTrack',
      'models/Ground',
      'models/Queue',

      'models/BaseCart',
      'models/Train',
      'models/Wagon',
      'models/PassengerWagon',

      'models/ChristmasTree',
      'models/SimpleTree',
      'models/DeciduousTree',
      'models/Snow',
      'models/RailwayPlatform',
      'models/Human',

      'controls/RaycasterManager',
      'controls/BaseCameraController',
      'controls/CameraController',
      'controls/DropGameCamera',
      'controls/HandTouch',
      'utils/EventEmitter',
      'utils/TextureLoader',
      'utils/MathUtils',
      'utils/crypto-js.min',
      'effects/SparkEffect',
      'effects/ParticleSystem',
      'audio/SoundManager',
      'audio/GSoundManager',
      'UI/Swipeable',
      'UI/RailwaySpawner',
      'UI/Library',
      'UI/Shop',
      'UI/ToastMessage',
      'modes/BaseModeModule',
      'modes/Play',
      'modes/Editor',
      'modes/Delete',
      'modes/PlayAndEdit',
      'modes/DropGame',
      'modes/GenCycle',
      'main'
    ];

    if ($is_developer) {
      $scripts[] = 'utils/DevTools';
      $scripts[] = 'UI/RGBColorControl';
    }
?>
  <?include('game-block.php')?>
  

  <!-- Подключаем Bootstrap JS глобально -->
  <script src="<?=SCRIPTURL?>bootstrap.bundle.min.js"></script>
  <script src="<?=SCRIPTURL?>three.min.js"></script>

  <?foreach ($scripts as $script) {?>
  <script src="<?=SCRIPTURL . $script?>.js?v=<?=$v?>"></script>
  <?}?>

  <!--<script src="<?=SCRIPTURL?>language-switcher.js?v=<?=$v?>"></script>-->

  <?if ($is_developer) {?>
    <script src="<?=BASEURL?>/scripts/test-unit.js?v=<?=$v?>"></script>
    <!-- Eruda is console for mobile browsers-->
    <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init();</script>
  <?}?>

  <script>
    // Запуск игры
    window.game = new RailGame(StateManager);
  </script>