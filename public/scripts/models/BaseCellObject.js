class BaseCellObject extends BaseGameObject {
	
    constructor(sellPosition = null, rotation = 0) {

    	super();
    	if (Array.isArray(sellPosition))
    		sellPosition = new Vector2Int(sellPosition[0], sellPosition[1]);
    	else sellPosition = {...sellPosition};

        this.id             = `object_${sellPosition.x}_${sellPosition.y}`;
        this.cellPosition   = sellPosition;
        this.rotation       = rotation;
    }

    setCellRotation(value) {
        if (value != this.rotation) {
            this.rotation = value;
            this.updateAppearance();
        }
    }

    getCellRotation() {
        return this.rotation;
    }

    getCellPosition() {
        return this.cellPosition.clone();
    }

    toCell(cellX, cellY, rotateY) {
        this.cellPosition = new Vector2Int(cellX, cellY);
        this.rotation = rotateY;
        super.toCell(cellX, cellY, rotateY);
    }

    updateAppearance() {
        this.toCell(this.cellPosition.x, this.cellPosition.y, this.rotation);
    }
    
    loadModel(scene) {
    	super.loadModel(scene);
        this.updateAppearance();
        return this.model;
    }

    getPosition() {
    	return calcCellPosition(this.cellPosition);
    }

    defaultPosition() {
    	return {x: 0, y: 0};
    }

    showMagicEffect(options = {}) {
        // Удаляем старый эффект, если есть
        if (this._activeEffect) {
            this._activeEffect.dispose();
            this._activeEffect = null;
        }
        
        // Создаем и запускаем новый эффект
        this._activeEffect = new MagicSwirlEffect(this.game, this, {
            duration: options.duration || 2000,
            colors: options.colors || ['#FFD700', '#FFA500', '#FF6B6B', '#FFE55C'],
            scale: options.scale || 1.2,
            ...options
        });
        
        this._activeEffect.play();
        
        // Автоматически очищаем после завершения
        if (options.autoDispose !== false) {
            setTimeout(() => {
                if (this._activeEffect && !this._activeEffect.isActive) {
                    this._activeEffect.dispose();
                    this._activeEffect = null;
                }
            }, options.duration || 2000);
        }
    }
  
  /**
   * Скрывает текущий эффект
   */
  hideMagicEffect() {
    if (this._activeEffect) {
        this._activeEffect.stop();
        this._activeEffect.dispose();
        this._activeEffect = null;
    }
  }
}

function calcCellPosition(cell) {
    let center = GAME_SETTINGS.CELL_SIZE / 2;
    return new THREE.Vector3(cell.x * GAME_SETTINGS.CELL_SIZE + center, 0, 
                cell.y * GAME_SETTINGS.CELL_SIZE + center);
}