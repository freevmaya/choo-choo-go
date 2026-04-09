class Library {
	constructor(game, parent, dropZone, classes) {
		this.game = game;
		this.elem = $(`<div class="library-block">
	        <div class="container">
	          <div class="title"><?=Lang('Library')?></div>
	          <div class="container-items">
	            <div id="library" class="items">
	            </div>
	          </div>
	        </div>
	      </div>`);

		parent.append(this.elem);
		this.dropZone = dropZone;
		this.dropZoneOver = false;
		this.loadClasses(classes);

		this.dropZone.droppable({
			tolerance: 'intersect',

		    drop: (event, ui) => {
		    	if (this.item && this.access && this.dropZoneOver) {
		    		this.doDrop(this.game.ground.getCurrentCell());
		    	}
		    }
		});
	}

	loadClasses(list) {
		this.classes = list;
		list.forEach(this.createItem.bind(this));
	}

	isDroppable() {

	}

	createItem(item) {

		let path = `images/library/${item.type.name}.png`;
		let itemCtrl = $(`<div class="item draggable"><img src="${path}"></img></div>`);
		let _this = this;

		itemCtrl.data('item', item);

		itemCtrl.draggable({
			helper: function() {
		        let clone = $(this).clone();
		        clone.css({
		            'position': 'absolute',
		            'z-index': 10000
		        });
		        $('body').append(clone);
		        return clone;
		    },
			cursor: 'grabbing',
            opacity: 0.7,
            zIndex: 1000,
            revert: function() {
		        return !_this.access;
		    },
            start: function(e, ui) {

                $(this).data('original', $(this));
                ui.helper.addClass('ui-draggable-dragging');
            	_this.item = item;
            },
            stop: function(e, ui) {

		        if (ui.helper)
		            ui.helper.remove();
            },
            drag: (e, ui) => {
            	let clientX = e.clientX;
			    let clientY = e.clientY;
			    
			    // Получаем элемент под курсором
			    const elementAtCursor = document.elementFromPoint(clientX, clientY);
			    
			    // Проверяем, является ли элемент или его родитель dropZone
			    let isOver = false;
			    let currentElement = elementAtCursor;
			    
			    while (currentElement) {
			        if (currentElement === this.dropZone[0]) {
			            isOver = true;
			            break;
			        }
			        currentElement = currentElement.parentElement;
			    }
			    
			    // Обновляем состояние
			    if (isOver !== this.dropZoneOver)
			        this.dropZoneOver = isOver;

			    console.log('drag');

			    this.access = this.checkDrop(this.game.ground.getCurrentCell());
			    this.game.ground.hoverShow(true, this.access);
            }
        });

		this.elem.find('#library').append(itemCtrl);
	}

	checkDrop(cell) {
		if (cell) {

	        let index = this.game.items.find(cell);
	        if (index == -1) {

	          if (this.game.items.findObject(cell) > -1) {
	            return false;
	          }

	          if (isSubClass(this.item.type, BaseCart))
	          	return false;
	        } else
	        	if (isSubClass(this.item.type, BaseCellObject))
	          		return false;
	    }
	    return true;
	}

	doDrop(cell) {
		if (cell && this.access) {

	      	if (isSubClass(this.item.type, BaseTrack)) {
		        let dropItem = this.game.items.addTrackItem({
		          type: this.item.type,
		          location: [cell.x, cell.y, 0]
		        });
		        dropItem.connectToNearest();
		    } else if (isSubClass(this.item.type, BaseCellObject)) {
		    	let dropItem = this.game.items.addObject({
		          type: this.item.type,
		          location: [cell.x, cell.y, 0]
		        });
		    } else if (isSubClass(this.item.type, BaseCart)) {
		    	let dropItem = this.game.items.addCart({
		          type: this.item.type,
		          location: [cell.x, cell.y, 0]
		        });
		    }
		}
	}

	dispose() {
		this.elem.remove();
	}
}
