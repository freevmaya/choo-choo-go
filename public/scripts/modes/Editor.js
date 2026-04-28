class Editor extends BaseModeModule {

	constructor(game, inventory=null) {
		super(game);

		if (inventory === null) {
			inventory = [
		      {
		        type: StraightTrack
		      },{
		        type: EndTrack
		      },{
		        type: CurvedTrack
		      },{
		        type: ForkTrack
		      },{
		        type: ForkRStTrack
		      },{
		        type: ForkLStTrack
		      },{
		        type: CrossTrack
		      },{
		        type: PointTrack
		      },{
		        type: Train
		      },{
		        type: Wagon
		      },{
		        type: PassengerWagon
		      },{
		        type: SimpleTree
		      },{
		        type: DeciduousTree
		      },{
		        type: Snow
		      },{
		        type: RailwayPlatform
		      }
		    ]
		}

	    this.library = new Library(game, $('#game-container'), $('#canvas-container'), inventory);
	    this.initListeners();
	}

	initListeners() {
	    eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	   	eventBus.on('gameObject:click', this._handleObjectClick = this.handleObjectClick.bind(this));
	   	document.addEventListener('keydown', this._onKeyDown = this.onKeyDown.bind(this));
	   	document.addEventListener('keyup', this._onKeyUp = this.onKeyUp.bind(this));
	}

	onKeyUp(event) {
		this.key = null;
	}

	onKeyDown(event) {
		this.key = event.key;
	}

	showOrientation(cell) {
		let trackIndex = this.game.items.find(cell);
	    if (trackIndex > -1) {
	        let track = this.game.items.get(trackIndex);
	        track.showOrientation();
	    }
	}

	onGroundClick(cell) {

		if (!this.library.deleteMode) {
			if (this.key == 'Shift')
				this.deleteOnCell(cell);
			else this.doRotateTrack(cell);
		}
	}

	isAwailableDelete(ga) {
		if (ga instanceof BaseTrack)
			return !ga.isBusy();
		return ga != null;
	}

	deleteOnCell(cell) {
		this.game.items.getObjectsCell(cell).forEach((ga)=>{
			if (this.isAwailableDelete(ga)) 
				this.game.items.delete(ga);
		});
	}

	doRotateTrack(cell) {
		let trackIndex = this.game.items.find(cell);
		if (trackIndex > -1) 
	        this.game.items.get(trackIndex).nextRotation();
	}

	handleObjectClick(data) {
	    let hit = null;
	    
	    if (!this.library.deleteMode && data.intersects && data.intersects[0]) {
	      	hit = data.intersects[0];

	      	const object = hit.object;
   			let ga = object.userData?.gameObject;

   			if (ga && !(ga instanceof Ground)) {

   				if (this.key == 'Shift') {
					this.game.items.delete(ga);
   				} else if (ga instanceof BaseCart) {
	   				ga.trackPos.forwardInTrack = !ga.trackPos.forwardInTrack;
	   				ga.updatePosition();
		   		} else if (ga instanceof BaseCellObject) {
			    	this.doRotateTrack(ga.getCellPosition());
			    }
   			}
	    }
	}

	dispose() {
		if (this.library)
			this.library.dispose();
	    eventBus.off('ground-click', this._onGroundClick);
	   	eventBus.off('gameObject:click', this._handleObjectClick);
	   	document.removeEventListener('keydown', this._onKeyDown);
	   	document.removeEventListener('keyup', this._onKeyUp);

	   	this.game.refreshInventory();

		super.dispose();
	}
}

registerClass(Editor);