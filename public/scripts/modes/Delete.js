class Delete {
	constructor(game) {
		this.game = game;
	    this.initListeners();
	}

	initListeners() {
	    eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	   	eventBus.on('gameObject:click', this._handleObjectClick = this.handleObjectClick.bind(this));
	}

	onGroundClick(cell) {
	    this.game.items.getObjectsCell(cell)
	    	.forEach(ga => this.game.items.delete(ga));
	}

	handleObjectClick(data) {
	    let hit = null;
	    
	    if (data.intersects && data.intersects[0]) {
	      	hit = data.intersects[0];

	      	const object = hit.object;
	      	this.game.items.delete(object.userData?.gameObject);
	    }
	}

	dispose() {
	    eventBus.off('ground-click', this._onGroundClick);
	   	eventBus.off('gameObject:click', this._handleObjectClick);
	}
}

registerClass(Delete);