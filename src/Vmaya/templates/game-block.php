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