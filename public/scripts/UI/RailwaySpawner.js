class RailwaySpawner {
  constructor(game, types) {

    this.game = game;
    this.types = types;
    this.parent = $('#game-container');
    this.dropZone = $('#canvas-container');

    this._lastDrop = null;
    this.access = false;
    this.dropZoneOver = false;
    
    this.init();
  }
  
  init() {
    this.createSpawnerUI();
    this.setupDropZone();
    this.initListeners();
  }

  initListeners() {
    eventBus.on('change-ground-cell', this._onChangeGroundCell = this.onChangeGroundCell.bind(this));
    eventBus.on('ground-click', this._onGrountClick = this.onGrountClick.bind(this));
    eventBus.on('runOver', this._onRunOver = this.onRunOver.bind(this));
    eventBus.on('cell-rotate', this._onCellRotated = this.onCellRotated.bind(this));
  }

  checkFinish() {

    if (!this.getPathPosible()) {
      if (!this.failToast)
        this.failToast = this.game.toast.show(lang.get('fail-drop-game'), null, ()=>{
          this.failToast = null;
        }, [
          {
            caption: lang.get('give-up'),
            callback: ()=>{
              this.game.gameState.gameOver();
            }
          }
        ]);
    } else {
      if (this.failToast) {
        this.failToast.dispose();
        this.failToast = null;
      }
    }
  }

  getPathPosible() {
    let points = this.game.items.items.filter(item => item instanceof PointTrack);
    if (points.length > 1) {
      let path = this.game.items.findShortestPath(points[0], points[1]);
      return path
    }
    return null;
  }
  
  createSpawnerUI() {
    this.spawnerElement = $(`
      <div class="railway-spawner">
        <div class="container">
          <div class="spawner-item">
            <img class="item-preview"></img>
          </div>
        </div>
      </div>
    `);
    
    this.parent.append(this.rotateBlock = $('<div class="rotate-block"><i class="bi bi-arrow-counterclockwise"></i></div>'));
    this.parent.append(this.spawnerElement);

    this.rotateBlock.click(this.onRotateClick.bind(this));
    
    // Делаем элемент перетаскиваемым
    this.spawnerElement.find('.spawner-item').draggable({
      helper: function() {
        let clone = $(this).clone();
        clone.css({
          'position': 'absolute',
          'z-index': 10000,
        });
        $('body').append(clone);
        return clone;
      },
      cursor: 'grabbing',
      opacity: 0.7,
      zIndex: 1000,
      revert: function() {
        return !this.access;
      }.bind(this),
      start: (e, ui) => {
        ui.helper.addClass('ui-draggable-dragging');
      },
      stop: (e, ui) => {
        if (ui.helper) ui.helper.remove();
      },
      drag: (e, ui) => {
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        let elementAtCursor = document.elementFromPoint(clientX, clientY);
        let isOver = false;
        let currentElement = elementAtCursor;
        
        while (currentElement) {
          if (currentElement === this.dropZone[0]) {
            isOver = true;
            break;
          }
          currentElement = currentElement.parentElement;
        }
        
        if (isOver !== this.dropZoneOver)
          this.dropZoneOver = isOver;
        
        this.access = this.checkDrop(this.game.ground.getCurrentCell());
        this.game.ground.hoverShow(true, this.access);
        this.updateHighlightColor(this.access);
      }
    });
  }

  selectRandomItem() {
    if (this.types.length > 0) {
      const randomIndex = Math.round(Math.random() * (this.types.length - 1));
      this.currentItem = this.types[randomIndex];
      this.types.splice(randomIndex, 1);
    } else {
      this.currentItem = null;
      this.game.ground.hoverShow(false);

      setTimeout(()=>{
        this.checkFinish();
      }, 2000);
    }

    this.updatePreview();
    this.refreshAccess();
  }

  checkDrop(cell) {
    if (cell && this.currentItem) {
      let a_class = getClass(this.currentItem);
      let index = this.game.items.find(cell);
      if (index == -1) {
        if (this.game.items.findObject(cell) > -1) return false;
        if (isSubClass(a_class, BaseCart)) return false;
      } else if (isSubClass(a_class, BaseCellObject)) return false;
    }
    return true;
  }

  refreshAccess() {
    if (this.currentItem) {
      this.access = this.checkDrop(this.game.ground.getCurrentCell());
      this.game.ground.hoverShow(true, this.access, ['green', 'gray']);
      this.updateHighlightColor(this.access);
    } else this.game.ground.hoverShow(false, false);
  }
  
  updatePreview() {
    let preview = this.spawnerElement.find('.item-preview');
    if (this.currentItem) {
      preview.attr('src', `images/library/${this.currentItem}.png`);
      this.spawnerElement.css('display', 'block');
    } else {
      this.spawnerElement.css('display', 'none');
    }
  }

  setupDropZone() {
    this.dropZone.droppable({
      tolerance: 'intersect',
      drop: (event, ui) => {
        if (this.access && this.dropZoneOver) {
          this._drop(this.game.ground.clientToCell(event.clientX, event.clientY));
        }
      }
    });

    When(() => this.game.ground).then(() => {
      this.selectRandomItem();
    });
  }

  onChangeGroundCell(cell) {
    this.refreshAccess();
    let pos = this.game.ground.getScreenPosition();
    if (pos) this.spawnerElement.css('left', pos.x);
  }

  onGrountClick(cell) {
    if (this.checkDrop(cell)) this._drop(cell);
  }

  onRunOver(data) {
    if (this._lastDrop == data.track) {
      this.rotateBlock.css('display', 'none');
      if (this.types.length == 0) this.dispose();
    }
  }

  onCellRotated(item) {
    let trains = this.getTrains();
    if (trains.length > 0 && trains[0].State() != 'run') trains[0].Prepare();
  }

  _drop(cell) {
    if (cell && this.currentItem) {
      this._lastDrop = this.game.items.addTrackItem({
        type: this.currentItem,
        location: [cell.x, cell.y, 0]
      });

      setTimeout(() => this._lastDrop.connectToNearest(), 50);
      setTimeout(() => this.selectRandomItem(), 100);

      eventBus.emit('drop-track', this._lastDrop);
      this.rotateBlock.css('display', 'block');
    }
  }

  updateSpawnerHighlight(isOver) {
    let shadow = isOver ? '0 0 15px gold' : '-2px 2px 6px black';
    this.spawnerElement.find('.container').css('box-shadow', shadow);
  }

  updateHighlightColor(access, colors = ['#00ff00', '#ff0000']) {
    const color = access ? colors[0] : colors[1];
    this.spawnerElement.find('.container').css('border', `2px solid ${color}`);
  }

  getTrains() {
    return this.game.items.findTrains();
  }

  onRotateClick(e) {
    if (this._lastDrop) {
      if (!this._lastDrop.isBusy()) {
        this._lastDrop.nextRotation();
      } else eventBus.emit('track-busy');
    }
  }

  update(dt) {
    if (this._lastDrop) {
      let pos = this.game.ground.getScreenPosition(this._lastDrop.getCellPosition());
      this.rotateBlock.css({left: pos.x, top: pos.y});
    }
  }

  dispose() {

    if (this.failToast) {
      this.failToast.dispose();
      this.failToast = null;
    }

    this.spawnerElement.remove();
    this.rotateBlock.remove();

    this.dropZone = null;
    this.currentItem = null;
    this.game.ground.hoverShow(false);

    eventBus.off('change-ground-cell', this._onChangeGroundCell);
    eventBus.off('ground-click', this._onGrountClick);
    eventBus.off('runOver', this._onRunOver);
  }
}

registerClass(RailwaySpawner);