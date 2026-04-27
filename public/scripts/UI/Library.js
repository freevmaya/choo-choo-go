class Library {
	constructor(game, parent, dropZone, classes) {
		this.game = game;
		this.elem = $(`
		<div class="library-block">
	        <div class="container">
				<div class="frame">
					<div class="container-items">
						<div class="items">
						</div>
					</div>
				</div>
	        </div>
		</div>`);

		parent.append(this.elem);
		this.libraryLayer = this.elem.find('.items');
		this.dropZone = dropZone;
		this.dropZoneOver = false;
		this.draggableItems = [];
		this.currentItem = null;
		this.access = false;
		this.deleteMode = false;
		this.loadClasses(classes);
		
		// Подписываемся на события отпускания для обработки drop
		this._setupDropListeners();
		this.originLevel = this.game.originLevelsCopy()[this.game.paramsIndex];

		eventBus.emit("created-library", this);
	}

	_setupDropListeners() {
		// Слушаем завершение перетаскивания через eventBus
		eventBus.on('draggable:end', this._onDragEnd.bind(this));
		
		// Также слушаем mouseup/touchend на document для fallback
		$(document).on('mouseup', this._onDocumentMouseUp.bind(this));
		$(document).on('touchend', this._onDocumentTouchEnd.bind(this));
	}

	_onDragEnd(data) {
		if (data && data.item === this.currentItem) {
			this._tryDrop();
		}
	}

	_onDocumentMouseUp(e) {
		if (this.currentItem && this.dropZoneOver) {
			this._tryDrop();
		}
	}

	_onDocumentTouchEnd(e) {
		if (this.currentItem && this.dropZoneOver) {
			this._tryDrop();
			e.preventDefault();
		}
	}

	_tryDrop() {
		const cell = this.game.ground.getCurrentCell();
		if (cell && this.access && this.dropZoneOver) {
			this.doDrop(cell);
		}
		this._cleanupDragState();
	}

	_cleanupDragState() {
		this.dropZoneOver = false;
		this.dropZone.removeClass('drag-over');
		this.game.ground.hoverShow(false);
	}

	setCloseButton(onClick) {
		let btn = $('<button type="button" class="btn-close" aria-label="Close"></button>');
		this.elem.find('.frame').prepend(btn);
		btn.click(onClick);
	}

	loadClasses(list) {
		this.classes = list;
		this.libraryLayer.empty();
		this.draggableItems.forEach(item => item.destroy());
		this.draggableItems = [];
		
		if (Array.isArray(list)) 
			list.forEach(this.createItem.bind(this));
		else {
			this._refreshUserItems();
			this._initUserEditor();
		}
	}

	_refreshUserItems() {
		this.libraryLayer.empty();
		Object.keys(this.classes).forEach((k, i)=>{
			if (this.classes[k] > 0)
				this.createItem({
					type: getClass(k),
					count: this.classes[k]
				});
		});
	}

	_initUserEditor() {


			eventBus.on('disposed', this._onDisposed = this.onDisposed.bind(this));

			this.deleteBtn = $(`<div class="eraser"><i class="bi bi-eraser"></i></div>`);
			this.elem.find('.frame').append(this.deleteBtn);
			this.deleteBtn.click(this.onDeleteClick.bind(this));
	   	eventBus.on('gameObject:click', this._onObjectClick = this.onObjectClick.bind(this));
	   	eventBus.on('refreshInventory', this._onRefreshInventory = this.onRefreshInventory.bind(this))
	}

	onRefreshInventory(inventory) {
		this.classes = inventory;
		this._refreshUserItems();
	}

	isAvailableTrack(ga) {
		if (ga instanceof BaseTrack) {
			if (ga.isBusy())
				return false;

			let cell = ga.getCellPosition();
			return !this.originLevel.items.find(t => (t.location[0] == cell.x) && (t.location[1] == cell.y));
		}

		return ga != null;
	}

	onObjectClick(data) {
	    
		if (data.intersects && data.intersects[0]) {
		  let ga = data.intersects[0].object.userData?.gameObject;
			if (ga) {
				if (this.deleteMode) {

					if (ga instanceof Ground) {
						let cell = ga.hitPointToCell(data.intersects[0].point);

						let index = this.game.items.find(cell);
						ga = index > -1 ? this.game.items.items[index] : null;
					} else {
						ga = ga instanceof BaseTrack ? ga : null;
					}

					if (this.isAvailableTrack(ga)) 
						this.game.items.delete(ga);
				}
			}
		}
	}

	onDeleteClick(e) {
		this.deleteMode = !this.deleteMode;
		this.deleteBtn.toggleClass("push", this.deleteMode);
	}

	createItem(item) {
		let path = `images/library/${item.type.name}.png`;
		let itemCtrl = $(`<div class="item draggable" style="background-image: url(${path})" data-type="${item.type.name}"></div>`);
		let _this = this;

		if (item.count) {
			let countCtl = $(`<div class="counter"><span data-lang="count">Кол-во</span>: <span class="value">${item.count}</span></div>`);
			itemCtrl.append(countCtl);
		}

		itemCtrl.data('item', item);

		const draggable = new MobileDraggable(itemCtrl, {
			helper: function() {
		        let clone = $(this).clone();
		        clone.css({
		            'position': 'fixed',
		            'z-index': 10000,
		            'width': itemCtrl.outerWidth() + 'px',
		            'height': itemCtrl.outerHeight() + 'px'
		        });
		        $('body').append(clone);
		        return clone;
		    },
			cursor: 'grabbing',
            opacity: 0.7,
            zIndex: 10000,
            revert: function() {
		        return !_this.access;
		    },
            start: (e, ui) => {
                ui.helper.addClass('ui-draggable-dragging');
            	_this.currentItem = item;
            },
            stop: (e, ui) => {
		        if (ui.helper)
		            ui.helper.remove();
		        
		        // Оповещаем о завершении перетаскивания
		        eventBus.emit('draggable:end', { item: _this.currentItem });
            },
            drag: (e, ui) => {
            	let clientX = ui.clientX;
			    let clientY = ui.clientY;
			    
			    // Получаем элемент под курсором
			    const elementAtCursor = document.elementFromPoint(clientX, clientY);
			    
			    // Проверяем, является ли элемент или его родитель dropZone
			    let isOver = false;
			    let currentElement = elementAtCursor;
			    
			    while (currentElement) {
			        if (currentElement === _this.dropZone[0]) {
			            isOver = true;
			            break;
			        }
			        currentElement = currentElement.parentElement;
			    }
			    
			    // Обновляем состояние
			    if (isOver !== _this.dropZoneOver) {
			        _this.dropZoneOver = isOver;
			        if (isOver) {
			            _this.dropZone.addClass('drag-over');
			        } else {
			            _this.dropZone.removeClass('drag-over');
			        }
			    }

			    _this.game.ground.updateHoverPlane(clientX, clientY);
			    _this.access = _this.checkDrop(_this.game.ground.getCurrentCell());
			    _this.game.ground.hoverShowE(true, _this.access);
            }
        });
        
        this.draggableItems.push(draggable);
		this.libraryLayer.append(itemCtrl);
	}

	checkDrop(cell) {
		if (cell && this.currentItem) {
	        let index = this.game.items.find(cell);
	        if (index == -1) {
	          if (this.game.items.findObject(cell) > -1) {
	            return false;
	          }
	          if (isSubClass(this.currentItem.type, BaseCart))
	          	return false;
	        } else {
	        	if (isSubClass(this.currentItem.type, BaseCellObject))
	          		return false;
	        }
	    }
	    return true;
	}

	doDrop(cell) {
		if (cell && this.access && this.currentItem) {
			let dropItem = null;
	      	if (isSubClass(this.currentItem.type, BaseTrack)) {
		        dropItem = this.game.items.addTrackItem({
		          type: this.currentItem.type,
		          location: [cell.x, cell.y, 0]
		        });
		        if (dropItem) dropItem.connectToNearest();
		    } else if (isSubClass(this.currentItem.type, BaseCellObject)) {
		    	dropItem = this.game.items.addObject({
		          type: this.currentItem.type,
		          location: [cell.x, cell.y, 0]
		        });
		    } else if (isSubClass(this.currentItem.type, BaseCart)) {
		    	dropItem = this.game.items.addCart({
		          type: this.currentItem.type,
		          location: [cell.x, cell.y, 0]
		        });
		    }

		    if (dropItem) {
			    if (!Array.isArray(this.classes)) {
			    	this.changeCount(this.currentItem.type.name, -1);
			    }

			    if (this.deleteMode)
			    	this.onDeleteClick();

			    eventBus.emit(`drop-elem.${this.currentItem.type.name}`, dropItem);
		    }
		}
		this.dropZone.removeClass('drag-over');
	}

	changeCount(type, add_value) {
		Object.keys(this.classes).forEach(k => {
			if (k == type) {
				this.classes[k] += add_value;
				let item = this.libraryLayer.find(`[data-type="${k}"]`);
				if (this.classes[k] <= 0) {
					item.addClass('hide');
				} else {
					item.removeClass('hide');
					item.find('.counter .value').text(this.classes[k]);
				}
			}
		});
	}

	onDisposed(ga) {
		if (this.isAvailableTrack(ga))
			this.changeCount(ga.constructor.name, 1);
	}

	dispose() {
		this.draggableItems.forEach(draggable => {
			draggable.destroy();
		});
		this.draggableItems = [];
		
		eventBus.off('disposed', this._onDisposed);
		eventBus.off('draggable:end', this._onDragEnd);
		eventBus.off('gameObject:click', this._onObjectClick);
	  eventBus.off('refreshInventory', this._onRefreshInventory);
		$(document).off('mouseup', this._onDocumentMouseUp);
		$(document).off('touchend', this._onDocumentTouchEnd);
		
		this.elem.remove();
	}
}

// scripts/UI/MobileDraggable.js

class MobileDraggable {
  constructor(element, options = {}) {
    this.element = $(element);
    this.options = {
      helper: 'clone',        // 'clone', 'original', или функция
      cursor: 'grabbing',
      opacity: 0.7,
      zIndex: 10000,
      revert: false,
      start: null,
      drag: null,
      stop: null,
      ...options
    };
    
    this.isDragging = false;
    this.dragClone = null;
    this.startPoint = null;
    this.startOffset = null;
    this.originalPosition = null;
    this.originalParent = null;
    this.revertTimer = null;
    
    this._init();
  }
  
  _init() {
    const el = this.element[0];
    
    // Обработчики для мыши
    el.addEventListener('mousedown', this._onMouseDown.bind(this));
    
    // Обработчики для касаний
    el.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    el.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    el.addEventListener('touchend', this._onTouchEnd.bind(this));
    el.addEventListener('touchcancel', this._onTouchEnd.bind(this));
    
    // Стили для предотвращения выделения
    this.element.css({
      'user-select': 'none',
      '-webkit-user-select': 'none'
    });
  }
  
  // ========== ОБРАБОТЧИКИ МЫШИ ==========
  
  _onMouseDown(e) {
    // Предотвращаем конфликт, если устройство поддерживает touch
    if (this._isTouchDevice() && e.pointerType === 'mouse') {
      // На touch-устройствах используем только touch-события
      return;
    }
    
    e.preventDefault();
    
    this._startDrag(e.clientX, e.clientY);
    
    // Глобальные обработчики для мыши
    window.addEventListener('mousemove', this._onMouseMove.bind(this));
    window.addEventListener('mouseup', this._onMouseUp.bind(this));
  }
  
  _onMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this._drag(e.clientX, e.clientY);
  }
  
  _onMouseUp(e) {
    if (!this.isDragging) return;
    this._endDrag();
    
    window.removeEventListener('mousemove', this._onMouseMove.bind(this));
    window.removeEventListener('mouseup', this._onMouseUp.bind(this));
  }
  
  // ========== ОБРАБОТЧИКИ КАСАНИЙ ==========
  
  _onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this._startDrag(touch.clientX, touch.clientY);
  }
  
  _onTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    this._drag(touch.clientX, touch.clientY);
  }
  
  _onTouchEnd(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this._endDrag();
  }
  
  // ========== ОСНОВНАЯ ЛОГИКА ==========
  
  _startDrag(clientX, clientY) {
    this.isDragging = true;
    this.startPoint = { x: clientX, y: clientY };
    
    // Сохраняем оригинальную позицию
    const rect = this.element[0].getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    this.originalPosition = {
      left: rect.left + scrollLeft,
      top: rect.top + scrollTop,
      width: rect.width,
      height: rect.height
    };
    
    // Создаем клон
    this._createClone(clientX, clientY);
    
    // Вычисляем смещение от центра клона до курсора
    if (this.dragClone) {
      const cloneRect = this.dragClone.getBoundingClientRect();
      this.startOffset = {
        x: clientX - (cloneRect.left + cloneRect.width / 2),
        y: clientY - (cloneRect.top + cloneRect.height / 2)
      };
    }
    
    // Меняем курсор
    document.body.style.cursor = this.options.cursor;
    
    // Добавляем класс для body
    document.body.classList.add('mobile-dragging');
    
    // Callback start
    if (this.options.start) {
      this.options.start.call(this.element[0], null, { 
        helper: $(this.dragClone),
        position: { left: clientX, top: clientY }
      });
    }
  }
  
  _createClone(clientX, clientY) {
    let cloneElement;
    
    if (typeof this.options.helper === 'function') {
      cloneElement = this.options.helper.call(this.element[0]);
      if (cloneElement && cloneElement.jquery) {
        cloneElement = cloneElement[0];
      }
    } else if (this.options.helper === 'clone') {
      cloneElement = this.element[0].cloneNode(true);
    } else {
      cloneElement = this.element[0];
    }
    
    if (!cloneElement) return;
    
    this.dragClone = cloneElement;
    
    // Стили для клона
    this.dragClone.style.position = 'fixed';
    this.dragClone.style.zIndex = this.options.zIndex;
    this.dragClone.style.opacity = this.options.opacity;
    this.dragClone.style.pointerEvents = 'none';
    this.dragClone.style.margin = '0';
    
    // Сохраняем оригинальные размеры
    const rect = this.element[0].getBoundingClientRect();
    this.dragClone.style.width = rect.width + 'px';
    this.dragClone.style.height = rect.height + 'px';
    
    // Позиционируем по центру под курсором
    this.dragClone.style.left = (clientX - rect.width / 2) + 'px';
    this.dragClone.style.top = (clientY - rect.height / 2) + 'px';
    
    // Добавляем класс для стилизации
    this.dragClone.classList.add('mobile-draggable-clone');
    
    document.body.appendChild(this.dragClone);
  }
  
  _drag(clientX, clientY) {
    if (!this.dragClone) return;
    
    // Вычисляем позицию с учетом смещения
    let left = clientX - (this.startOffset ? this.startOffset.x : 0);
    let top = clientY - (this.startOffset ? this.startOffset.y : 0);
    
    // Если нет смещения, центрируем по курсору
      const rect = this.dragClone.getBoundingClientRect();
      left = clientX - rect.width / 2;
      top = clientY - rect.height / 2;
    
    this.dragClone.style.left = left + 'px';
    this.dragClone.style.top = top + 'px';
    
    // Callback drag
    if (this.options.drag) {
      this.options.drag.call(this.element[0], null, {
        helper: $(this.dragClone),
        clientX: clientX,
        clientY: clientY,
        offset: {
          left: left,
          top: top
        }
      });
    }
  }
  
  _endDrag() {
    if (!this.isDragging) return;
    
    const shouldRevert = this._shouldRevert();
    
    if (shouldRevert && this.originalPosition) {
      // Анимация возврата
      if (this.dragClone) {
        this.dragClone.style.transition = 'all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        this.dragClone.style.left = this.originalPosition.left + 'px';
        this.dragClone.style.top = this.originalPosition.top + 'px';
        
        this.revertTimer = setTimeout(() => {
          this._cleanup();
          if (this.options.stop) {
            this.options.stop.call(this.element[0], null, { helper: $(this.dragClone) });
          }
        }, 250);
      } else {
        this._cleanup();
        if (this.options.stop) {
          this.options.stop.call(this.element[0]);
        }
      }
    } else {
      this._cleanup();
      if (this.options.stop) {
        this.options.stop.call(this.element[0], null, { helper: $(this.dragClone) });
      }
    }
    
    this.isDragging = false;
    document.body.style.cursor = '';
    document.body.classList.remove('mobile-dragging');
  }
  
  _shouldRevert() {
    if (typeof this.options.revert === 'function') {
      return this.options.revert.call(this.element[0]);
    }
    return this.options.revert === true;
  }
  
  _cleanup() {
    if (this.revertTimer) {
      clearTimeout(this.revertTimer);
      this.revertTimer = null;
    }
    
    if (this.dragClone && this.dragClone.parentNode) {
      this.dragClone.parentNode.removeChild(this.dragClone);
    }
    this.dragClone = null;
  }
  
  _isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========
  
  destroy() {
    const el = this.element[0];
    
    el.removeEventListener('mousedown', this._onMouseDown);
    el.removeEventListener('touchstart', this._onTouchStart);
    el.removeEventListener('touchmove', this._onTouchMove);
    el.removeEventListener('touchend', this._onTouchEnd);
    el.removeEventListener('touchcancel', this._onTouchEnd);
    
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    
    this.element.css({
      'user-select': '',
      '-webkit-user-select': ''
    });
    
    this._cleanup();
  }
  
  enable() {
    this.element.css('pointer-events', 'auto');
  }
  
  disable() {
    this.element.css('pointer-events', 'none');
  }
}
