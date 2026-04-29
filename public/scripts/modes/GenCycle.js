class GenCycle extends BaseModeModule {
	constructor(game) {
		super(game);

		//eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	}
	/* Для разработки, генерирует вагон при клике
	onGroundClick(cell) {
	    let trackIndex = this.game.items.find(cell);
		if (trackIndex > -1) {
   			let track = this.game.items.get(trackIndex);

   			if (track) {
   				this.Spawn(track, {
	                "type": "Wagon",
	                "location": [
	                    0,
	                    -2,
	                    true
	                ],
	                "name": "wagon"
	            });
   			}
	    }
	}*/
}

registerClass(GenCycle);