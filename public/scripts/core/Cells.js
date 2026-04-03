class Cells {
	constructor(game) {
		this.game 		= game;
		this.items 		= [];
		this.objects 	= [];
		this.carts 		= [];

		this.initListeners();
	}

	toSaveData() {
		return {
			items: this.items.map(item => (item.toSaveData())),
			objects: this.objects.map(item => (item.toSaveData())),
			carts: this.carts.map(item => (item.toSaveData()))
		}
	}

	doAfterChange() {
		eventBus.emit('change-cells', this);
	}

	onAfterDrop(data) {
		if (data.access) {

	      	if (isSubClass(data.item.type, BaseTrack)) {
		        let dropItem = this.addTrackItem({
		          type: data.item.type,
		          location: [data.cell.x, data.cell.y, 0]
		        });
		        dropItem.connectToNearest();
		        this.doAfterChange();
		    } else if (isSubClass(data.item.type, BaseCellObject)) {
		    	let dropItem = this.addObject({
		          type: data.item.type,
		          location: [data.cell.x, data.cell.y, 0]
		        });
		        this.doAfterChange();
		    } else if (isSubClass(data.item.type, BaseCart)) {
		    	let dropItem = this.addCart({
		          type: data.item.type,
		          location: [data.cell.x, data.cell.y, 0]
		        });
		        this.doAfterChange();
		    }
		}
	}

	onCheckCell(data) {
	    if (data.cell) {

	        let index = this.find(data.cell);
	        if (index == -1) {

	          if (this.findObject(data.cell) > -1) {
	            data.callback(false);
	            return;
	          }

	          //let neares_list = this.findNearest(data.cell);
	          if (isSubClass(data.item.type, BaseCart))
	          	data.callback(false);
	          else data.callback(true);

	        } else {

	        	if (isSubClass(data.item.type, BaseCellObject))
	          		data.callback(false);
	          	else data.callback(true);
	        }
	    }
	}

	doRotateTrack(cell) {
		let trackIndex = this.find(cell);
		if (trackIndex > -1) {
	        let track = this.get(trackIndex);

	        if (this.game.editorState() == 'playAndEdit') {
	        	if (track.isAwailableRotate()) {
	        		track.nextRotation();
		        	this.doAfterChange();
	        		return true;
	        	}
	        } else if (!track.isRotationComplete()) {
	          	track.nextRotation();
	          	track.connectToNearest();
	          	let carts = this.carts.filter(cart => cart.getCellPosition().equals(cell));
	          	carts.forEach((cart)=>{
	          		cart.updatePosition();
	          	});
	        	this.doAfterChange();
	        	return true;
	        }
	    }
	    return false;
	}

	showOrientation(cell) {
		let trackIndex = this.find(cell);
	    if (trackIndex > -1) {
	        let track = this.get(trackIndex);
	        track.showOrientation();
	    }
	}

	onGroundClick(cell) {
		if (DEV && (this.key == 'Shift')) {
			this.showOrientation(cell);
			return;
		}
		if (this.game.editorState() == 'edit') {
			this.doRotateTrack(cell);
		} else {

		    let trackIndex = this.find(cell);
		    if (trackIndex > -1) {
		        let track = this.get(trackIndex);

		        if (this.game.editorState() == 'delete') {
		        	let idx = this.items.indexOf(track);
	   				if (idx > -1) {
	   					this.items.splice(idx, 1);
	   					track.dispose();
	   				}
		        }
		    }

		    if (this.game.editorState() == 'play') 
		    	this.runTrainToCell(cell);
		    else if (this.game.editorState() == 'playAndEdit')  {
				if (!this.doRotateTrack(cell))
		    		this.runTrainToCell(cell);
		    }
		    
		}
	}

	runTrainToCell(cell) {
		/*
		let trainRec = this.findNearestCart(cell, Train);
    	if (trainRec) {

    		let direct = trainRec.cart.trackPos.currentTrack.calcDirect();
    		let sameDirect = direct.dot(trainRec.direct) > 0

    		if (trainRec.cart.forwardTrain != trainRec.cart.trackPos.forwardInTrack)
    			sameDirect = !sameDirect;

    		console.log(`sameDirect: ${sameDirect}`);
    		if (trainRec.cart.State() != 'run') {
	    		trainRec.cart.setForward(
	    			sameDirect
	    		);
    			trainRec.cart.State('run');
    		}

    	}*/
	}

	findNearestCart(cell, classCart) {
		let list = [];
		this.carts.forEach((cart)=>{
			if (cart instanceof classCart) {
				list.push({
					cart: cart,
					direct: calcCellPosition(cell).sub(cart.getPosition())
				});
			}
		})

		list.sort((cart1, cart2)=>cart1.direct.length() - cart2.direct.length());
		return list.length > 0 ? list[0] : null;
	}

	initListeners() {

	    eventBus.on('check-cell', this._onCheckSell = this.onCheckCell.bind(this));
	    eventBus.on('item-drop', this._onItemDrop = this.onAfterDrop.bind(this));
	    eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	   	eventBus.on('gameObject:click', this._handleObjectClick = this.handleObjectClick.bind(this));

	   	$(window).on('keydown', (e)=>{
	   		this.key = e.key;
	   	});

	   	$(window).on('keyup', (e)=>{
	   		this.key = null;
	   	});

	   	$(window).on('blur', (e)=>{
	   		this.key = null;
	   	});
	}

	handleObjectClick(data) {
	    // Проверяем структуру данных
	    let hit = null;
	    
	    if (data.intersects && data.intersects[0]) {
	      	hit = data.intersects[0];

	      	const object = hit.object;
   			let ga = object.userData?.gameObject;

   			if (!ga) 
   				return;

   			if (this.game.editorState() == 'delete') {
	   			if (ga instanceof BaseCart) {
	   				let idx = this.carts.indexOf(ga);
	   				if (idx > -1) {
	   					this.carts.splice(idx, 1);
	   					ga.dispose();
	   				}
	   			} else if (ga instanceof BaseTrack) {
	   				let idx = this.items.indexOf(ga);
	   				if (idx > -1) {
	   					this.items.splice(idx, 1);
	   					ga.dispose();
	   				}
	   			} else {
	   				let idx = this.objects.indexOf(ga);
	   				if (idx > -1) {
	   					this.objects.splice(idx, 1);
	   					ga.dispose();
	   				}
	   			}
	   		} else if (this.game.editorState() == 'edit') {
	   			this.doRotateTrack(ga.getCellPosition());
	   			if (ga instanceof BaseCellObject) {
	   				ga.nextRotation();
	   			} else if (ga instanceof BaseCart) {
	   				ga.trackPos.forwardInTrack = !ga.trackPos.forwardInTrack;
	   				ga.updatePosition();
	   			}
	   		} else if (this.game.editorState() == 'playAndEdit') {
	   			if (ga instanceof BaseCellObject) {
		    		if (!this.doRotateTrack(ga.getCellPosition()))
		    			this.runTrainToCell(ga.getCellPosition());
	   			}
	   		}
	    }
	}

	init(railway, carts, objects) {

	    railway.forEach((trackItem)=>{
	      this.addTrackItem(trackItem);
	    });

	    carts.forEach((item)=>{
	      this.addCart(item);
	    });

	    objects.forEach((item)=>{
	      this.addObject(item);
	    });
	}

	addCart(data) {
    	let item = createObject(data.type, data).init(this.game, data);
		this.carts.push(item);
	}

	addTrackItem(data) {
		let item = createObject(data.type, data).init(this.game);
		this.items.push(item);
		return item;
	}

	addObject(data) {
		let item = createObject(data.type, data).init(this.game);
		this.objects.push(item);
		return item;
	}

	get(idx) {
		return this.items[idx];
	}

	findObject(cellX, cellY) {
		let cell = typeof cellX == 'object' ? cellX : new Vector2Int(cellX, cellY);

		let index = -1;
		for (let i=0; i<this.objects.length; i++) {
			let item = this.objects[i];
            if (item.isBusyCell(cell)) {
                    index = i;
                	break;
                }
        }
        return index;
	}

	findCart(cellX, cellY) {
		let cell = typeof cellX == 'object' ? cellX : new Vector2Int(cellX, cellY);

		let index = -1;
		for (let i=0; i<this.carts.length; i++) {
            if (this.carts[i].getCellPosition().equals(cell)) {
                    index = i;
                	break;
                }
        }
        return index;
	}

	find(cellX, cellY) {		
		let cell = typeof cellX == 'object' ? cellX : new Vector2Int(cellX, cellY);

		let index = -1;
		for (let i=0; i<this.items.length; i++) {
			let item = this.items[i];
            if (item.cellPosition.equals(cell)) {
                    index = i;
                	break;
                }
        }
        return index;
	}

	findNearest(cell) {
		let offsets = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
        ];

        let result = [];

        offsets.forEach((offset)=>{
        	let index = this.find(cell.x + offset[0], cell.y + offset[1]);
        	if (index > -1) {
        		let track = this.get(index);
        		let path = track.getConnectPath(cell);
        		if (path) result.push(index);
        	}
        });

        return result;
	}

	clear() {
		this.items.forEach(ga => ga.dispose());
		this.objects.forEach(ga => ga.dispose());
		this.carts.forEach(ga => ga.dispose());

		this.items.length = 0;
		this.objects.length = 0;
		this.carts.length = 0;
	}

	dispose() {
	    eventBus.off('check-cell', this._onCheckSell);
	    eventBus.off('item-drop', this._onItemDrop);
	    eventBus.off('ground-click', this._onGroundClick);
	   	eventBus.off('gameObject:click', this._handleObjectClick);
	}
}