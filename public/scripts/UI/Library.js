class Library {
	constructor(elem, dropZone, classes) {
		this.elem = elem;
		this.dropZone = dropZone;
		this.dropZoneOver = false;
		this.loadClasses(classes);

		this.dropZone.droppable({
			tolerance: 'intersect',

		    drop: (event, ui) => {
		    	if (this.item && this.access && this.dropZoneOver)
		        	eventBus.emit('item-drop', this);
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
		let cell = null;
		let _this = this;

		itemCtrl.data('item', item);

		itemCtrl.draggable({
			helper: 'clone',
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
			    
	            e.item = item;

            	if (this.dropZoneOver) {
	            	e.callback = (access, a_cell) => {
	            		this.cell = a_cell;
	            		this.access = access;
	            	};

	            	eventBus.emit('item-drag', e);
	            } else eventBus.emit('item-drag', e);
            }
        });

		this.elem.append(itemCtrl);
	}
}
