// scripts/controls/RailwaySpawner.js

class RailwaySpawner {
  constructor(params=null) {

    this.parent = $('#game-container');
    this.dropZone = $('#canvas-container');
    
    // Список доступных элементов
    this.itemsList = [
      { type: StraightTrack },
      { type: CurvedTrack },
      { type: ForkTrack }
    ];
    
    this.init();
  }
  
  init() {
    this.createSpawnerUI();
    this.setupDropZone();
    this.setupEventListeners();
  }
  
  /**
   * Создает UI элемент спавнера
   */
  createSpawnerUI() {
    this.spawnerElement = $(`
      <div class="railway-spawner">
        <div class="container">
          <div class="spawner-item">
            <div class="item-preview"></div>
          </div>
        </div>
      </div>
    `);
    
    this.parent.append(this.spawnerElement);
  }
  
  /**
   * Выбирает случайный элемент из списка
   */
  selectRandomItem() {
    const randomIndex = Math.floor(Math.random() * this.itemsList.length);
    this.currentItem = this.itemsList[randomIndex];
    this.updatePreview();
  }
  
  /**
   * Обновляет превью текущего элемента
   */
  updatePreview() {
    if (!this.currentItem) return;
    
    const typeName = this.currentItem.type.name;
    const imagePath = `images/library/${typeName}.png`;
    
    this.spawnerElement.find('.item-preview').css('background-image', `url(${imagePath})`);
    this.spawnerElement.find('.item-preview').attr('title', typeName);
  }

  setupDropZone() {

  }

  setupEventListeners() {
    // Обработчик клика по спавнеру (для ручного обновления)
    this.spawnerElement.on('click', () => {
      this.selectRandomItem();
    });
  }
  
  /**
   * Обновляет подсветку спавнера
   */
  updateSpawnerHighlight(isOver) {
    if (isOver) {
      this.spawnerElement.find('.container').css('box-shadow', '0 0 15px gold');
    } else {
      this.spawnerElement.find('.container').css('box-shadow', '-2px 2px 6px black');
    }
  }
  
  /**
   * Обновляет цвет подсветки в зависимости от доступности размещения
   */
  updateHighlightColor(access) {
    const color = access ? '#00ff00' : '#ff0000';
    this.spawnerElement.find('.container').css('border', `2px solid ${color}`);
    
    setTimeout(() => {
      if (!this.dropZoneOver) {
        this.spawnerElement.find('.container').css('border', 'none');
      }
    }, 300);
  }

  spawnItem() {
    if (!this.currentItem || !this.access || !this.cell) {
      console.warn('RailwaySpawner: Нельзя разместить элемент');
      return;
    }
    
    // Создаем данные для размещения
    const data = {
      type: this.currentItem.type,
      location: [this.cell.x, this.cell.y, 0]
    };
    
    // Добавляем элемент через Cells
    if (window.game && window.game.items) {
      window.game.items.addTrackItem(data);
      window.game.items.doAfterChange();
      
      // Генерируем случайный элемент для следующего раза
      this.selectRandomItem();
      
      // Сбрасываем состояние
      this.access = false;
      this.cell = null;
      this.dropZoneOver = false;
      this.updateSpawnerHighlight(false);
      
      // Визуальный эффект размещения
      this.showSpawnEffect();
    }
  }
  
  /**
   * Показывает эффект при размещении элемента
   */
  showSpawnEffect() {
    const rect = this.dropZone[0].getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создаем визуальный эффект (опционально)
    if (typeof SparkEffect !== 'undefined') {
      new SparkEffect({
        x: centerX,
        y: centerY,
        count: 15,
        colors: ['#FFD700', '#FFA500', '#00FF00'],
        sizes: [3, 6],
        speeds: [1, 4],
        gravity: 0.03,
        baseRadius: 30
      });
    }
  }

  getCurrentItem() {
    return this.currentItem;
  }

  setItemsList(itemsList) {
    this.itemsList = itemsList;
    this.selectRandomItem();
  }
  
  /**
   * Очищает ресурсы
   */
  dispose() {
    if (this.spawnerElement) {
      this.spawnerElement.remove();
    }
    this.dropZone = null;
    this.currentItem = null;
  }
}

registerClass(RailwaySpawner);