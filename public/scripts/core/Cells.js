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

	delete(ga) {
		if (ga) {
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
		}
	}

	checkTaskRectord(taskName, value) {
        if (!value) return false;
        if (Array.isArray(value)) 
        	return value.some(v => this.checkTaskRectord(taskName, v));

        let s = value.split(':');
        return s[0] === taskName;
    };

	findAsTask(taskName, field = 'taskName') {
	    
	    let ga = this.carts.find(c => this.checkTaskRectord(taskName, c.data[field]));
	    if (!ga) ga = this.objects.find(o => this.checkTaskRectord(taskName, o.data[field]));
	    if (!ga) ga = this.items.find(i => this.checkTaskRectord(taskName, i.data[field]));
	    
	    return ga;
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

	init(railway, carts, objects) {

		if (railway)
		    railway.forEach((trackItem)=>{
		      this.addTrackItem({...trackItem});
		    });

	    if (carts)
		    carts.forEach((item)=>{
		      this.addCart({...item});
		    });

	    if (objects)
		    objects.forEach((item)=>{
		      this.addObject({...item});
		    });
	}

	getObjectsCell(cell) {
		let result = [];
		this.items.forEach(tk => {
			if (tk.getCellPosition().equals(cell))
				result.push(tk);
		});

		this.carts.forEach(cart => {
			if (cart.getCellPosition().equals(cell))
				result.push(cart);
		});

		this.objects.forEach(obj => {
			if (obj.getCellPosition().equals(cell))
				result.push(obj);
		});

		return result;
	}

	addCart(data) {
    	let item = createObject(data.type, data).init(this.game, data);
		this.carts.push(item);

		this.doAfterChange();
	}

	addTrackItem(data) {
		let item = createObject(data.type, data).init(this.game);
		this.items.push(item);

		this.doAfterChange();
		return item;
	}

	addObject(data) {
		let item = createObject(data.type, data).init(this.game);
		this.objects.push(item);

		this.doAfterChange();
		return item;
	}

	get(idx) {
		return this.items[idx];
	}

	findObject(cellX, cellY) {
		let cell = typeof cellX == 'object' ? cellX.clone() : new Vector2Int(cellX, cellY);

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

	findTrains() {
		return this.carts.filter(c => c instanceof Train);
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

	findNearest(cell, allPath) {
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
        		let path = track.getConnectPath(cell, allPath);
        		if (path) result.push(index);
        	}
        });

        return result;
	}

	/**
	 * Находит все пути от начального трека до конечного
	 */
	findPathsTo(startTrack, endTrack, possible = true) {
	    const paths = [];
	    const visited = new Set();
	    
	    const dfs = (current, path) => {
	        if (current === endTrack) {
	            paths.push([...path]);
	            return;
	        }
	        
	        const connections = current.findConnections(possible);
	        for (const idx of connections) {
	            const next = this.items[idx];
	            if (!visited.has(next)) {
	                visited.add(next);
	                dfs(next, [...path, next]);
	                visited.delete(next);
	            }
	        }
	    };
	    
	    dfs(startTrack, [startTrack]);
	    return paths;
	}

	/**
	 * Находит кратчайший путь от начального трека до конечного (BFS)
	 */
	findShortestPath(startTrack, endTrack, possible = true) {
	    if (startTrack === endTrack) return [startTrack];
	    
	    const queue = [[startTrack]];
	    const visited = new Set([startTrack]);
	    
	    while (queue.length > 0) {
	        const path = queue.shift();
	        const current = path[path.length - 1];
	        
	        const connections = current.findConnections(possible);
	        for (const idx of connections) {
	            const next = this.items[idx];
	            if (!visited.has(next)) {
	                if (next === endTrack) {
	                    return [...path, next];
	                }
	                visited.add(next);
	                queue.push([...path, next]);
	            }
	        }
	    }
	    
	    return null;
	}

	/**
	 * Получает всю цепочку треков от стартовой точки до конечной (один путь)
	 */
	getTrackChain(startTrack, endTrack) {
	    return this.findShortestPath(startTrack, endTrack);
	}

	/**
	 * Проверяет, существует ли путь между треками
	 */
	isConnected(trackA, trackB) {
	    return this.findShortestPath(trackA, trackB) !== null;
	}

	//Получает все треки, достижимые от заданного
	getReachableTracks(startTrack, possible = true) {
	    const reachable = [];
	    const visited = new Set();
	    const queue = [startTrack];
	    visited.add(startTrack);
	    
	    while (queue.length > 0) {
	        const current = queue.shift();
	        reachable.push(current);
	        
	        const connections = current.findConnections(possible);
	        for (const idx of connections) {
	            const next = this.items[idx];
	            if (!visited.has(next)) {
	                visited.add(next);
	                queue.push(next);
	            }
	        }
	    }
	    
	    return reachable;
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
	}
}