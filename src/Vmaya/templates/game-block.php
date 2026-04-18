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
            <i class="bi bi-trophy-fill"></i> <span data-lang="score_indicator">Счет:</span> <span class="current-score">0</span>
          </div>
        </div>

        <div id="levels" class="tools-panel border-block">
          <div class="frame padding">
             <a href="#" onclick="window.game.showLevelsModal()">Уровни</a>
          </div>
        </div>
      </div>
    </div>
    
    <div id="game-canvas-container">
      <div id="canvas-container"></div>
    </div>
  </div>

  <!-- Bootstrap модальное окно для Start Game -->
  <div class="modal fade" id="startModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="dialog-1 modal-content">
        <div class="background">
        </div>
        <div class="wrapper">
          <div class="top">
            
          </div>
          <div class="middle">
            <div class="dialog-content">
              <p>
                <i class="bi bi-info-circle"></i> <span data-lang="start_info_1"></span>
              </p>
              <p>
                <i class="bi bi-exclamation-triangle-fill"></i> <span data-lang="start_info_2"></span>
              </p>
              <p style="display:none" class="devBlock">
                <span data-lang="gpu_speed">GPU speed:</span> <span class="testResult"></span>. 
                <span data-lang="version">Version:</span> <span><?=APP_VERSION?></span>
              </p>
              <div class="text-center buttons">
                <button type="button" class="btn" id="startGameButton" data-lang="start_button">Начать</button>
              </div>
            </div>
          </div>
          <div class="bottom">
            
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap модальное окно для Game Over -->
  <div class="modal fade" id="gameOverModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="dialog-1 modal-content">
        <div class="background">
        </div>
        <div class="wrapper">
          <div class="top">
            
          </div>
          <div class="middle">
            <div class="dialog-content">
              <p class="status" data-lang="game_over_title">Неудача!</p>
              <div class="stats-container">
                <div class="row">
                  <div class="col-12">
                    <div class="stat-value"></div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <button type="button" class="btn" id="restartButton" data-lang="game_over_button">Продолжить</button>
              </div>
            </div>
          </div>
          <div class="bottom">
            
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap модальное окно для Victory (Победа) -->
  <div class="modal fade" id="victoryModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="dialog-1 modal-content">
        <div class="background">
        </div>
        <div class="wrapper">
          <div class="top">
            
          </div>
          <div class="middle">
            <div class="dialog-content">
              <p class="modal-subtitle status" data-lang="victory_title">Вы достигли вершины дерева!</p>
              <p class="new-title status" data-lang="new_rank"></p>
              <!-- Статистика игры -->
              <div class="stats-container victory-stats" id="victoryState">
                <div class="row">
                  <div class="stat-value" id="victoryScore">0</div>
                  <div class="stat-label" data-lang="victory_score">Очки</div>
                </div>
              </div>

              <div class="text-center">
                <button type="button" class="btn" id="victoryRestartButton" data-lang="victory_button">Продолжить</button>
              </div>
            </div>
          </div>
          <div class="bottom">
            
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap модальное окно для Pause (Пауза) -->
  <div class="modal fade" id="pauseModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="dialog-1 modal-content">
        <div class="background">
        </div>
        <div class="wrapper">
          <div class="top">
            
          </div>
          <div class="middle">
            <div class="dialog-content">
              <p class="status" data-lang="pause_title">Игра приостановлена</p>
              <p><span data-lang="current_rank">Ваше текущее звание:</span> <span class="title"></span></p>
              <div class="title-image"></div>
              <div class="text-center">
                <button type="button" class="btn" data-bs-dismiss="modal" data-lang="pause_resume">Продолжить</button>
                <button type="button" class="btn" id="pauseRestartButton" data-lang="pause_restart">Новая игра</button>
              </div>
            </div>
          </div>
          <div class="bottom">
            
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap модальное окно для Levels -->
  <div class="modal fade" id="levelsModal" tabindex="-1" role="dialog" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
                <div class="list-content">
                  
                </div>
              </div>
              <div class="text-center">
                <button type="button" class="btn" data-bs-dismiss="modal" data-lang="pause_resume">Продолжить</button>
              </div>
            </div>
          </div>
          <div class="bottom">
            
          </div>
        </div>
      </div>
    </div>
  </div>