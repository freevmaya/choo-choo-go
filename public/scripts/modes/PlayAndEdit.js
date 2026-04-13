class PlayAndEdit extends BaseModeModule {
	constructor(game) {
		super(game);
	    this.initListeners();
	}

	initListeners() {
	    eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	   	eventBus.on('gameObject:click', this._handleObjectClick = this.handleObjectClick.bind(this));
	}

	onGroundClick(cell) {
		this.doRotateTrack(cell);
	}

	doRotateTrack(cell) {
		let trackIndex = this.game.items.find(cell);
		if (trackIndex > -1) {
			let track = this.game.items.get(trackIndex);

			if (!track.isBusy()) {
				if (!track.data.fixed)
	        		track.nextRotation();
			}
	        else eventBus.emit('track-busy');
		}
	}

	handleObjectClick(data) {
	    // Проверяем структуру данных
	    let hit = null;
	    
	    if (data.intersects && data.intersects[0]) {
	      	hit = data.intersects[0];

	      	const object = hit.object;

	      	console.log(object.userData);
   			let ga = object.userData?.gameObject;

   			if (ga instanceof BaseCellObject) {
			    this.doRotateTrack(ga.getCellPosition());
   			}
	    }
	}

	dispose() {
	    eventBus.off('ground-click', this._onGroundClick);
	   	eventBus.off('gameObject:click', this._handleObjectClick);
	}
}

registerClass(PlayAndEdit);