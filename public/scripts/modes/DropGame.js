class DropGame extends BaseModeModule {
	constructor(game) {
		super(game);

	    this.game.cameraController.dispose();
	    this.game.cameraController = new DropGameCamera(this);
	    this._firstDrop = false;
	    this.State('showLevel');
	}

	start(showToast = true) {
		super.start(showToast);

	    if (showToast && !this.toast) {
		    this.timerId1 = setTimeout(()=>{
		    	this.toast = this.game.toast.show(lang.get('drop-game-description'), null, ()=>{
		    		this.State('showFinish');
		    	}, [
		    		{
		    			caption: lang.get('got-it'),
		    			callback: ()=>{
		    				this.toast.dispose();
		    				this.toast = null;
		    				this.State('showFinish');
		    			}
		    		}
		    	]);
		    }, 500);
	    } else {
		    this.timerId1 = setTimeout(()=>{
		    	this.State('showFinish');
		    }, 3000);
		}
	}

    getStates() {
        return ['showLevel', 'showFinish', 'play'];
    }

    afterSetState() {
    	super.afterSetState();
    	if (this.State() == 'showFinish') this.showFinish();
    	else if (this.State() == 'play') this.goPlay();
    }

    _liftEndDelete(track) {

		this.types.push(track.data.type);

		let intervalId = setInterval(()=>{
			track.model.position.y += 0.5;
		}, 10);

		setTimeout(()=>{
			clearInterval(intervalId);
			this.game.items.delete(track);
			track.dispose();
		}, 1000);
    }

    _removeNext(queue) {
    	if (queue.length > 0) {
    		this._liftEndDelete(queue[0]);
			queue.splice(0, 1);
    		this.timerId2 = setTimeout(()=>{
    			this._removeNext(queue);
    		}, 100);
    	} else this.State('play');
    }

    showFinish() {
	    this.types = [];
    	let queue = this.game.items.items.filter(item => !item.data.fixed);
    	this._removeNext(queue);
    }

	goPlay() {
		this.spawner = new RailwaySpawner(game, this.types);
		this.game.items.carts.forEach(cart => cart.resetTrackPos());
	    this.initListeners();		
	}

	onDropTrack(track) {
		let trains = this.game.items.carts.filter(c => c instanceof Train);
		trains.forEach(t => {
			if (['wait', 'stop'].includes(t.State()))
				t.State('prepare');
		});
		if (this.toast) {
			this.toast.dispose();
			this.toast = null;
		}
	}

	initListeners() {
	    eventBus.on('drop-track', this._onDropTrack = this.onDropTrack.bind(this));
	    eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	}

	onGroundClick(cell) {
		this.doRotateTrack(cell);
	}

	doRotateTrack(cell) {
		let trackIndex = this.game.items.find(cell);
		if (trackIndex > -1) {
			let track = this.game.items.get(trackIndex);
			if (!track.isBusy())
	        	track.nextRotation();
	        else eventBus.emit('track-busy');
		}
	}

	dispose() {
		if (this.spawner)
			this.spawner.dispose();

		super.dispose();

		clearTimeout(this.timerId1);
		clearTimeout(this.timerId2);
		this.game.cameraController = new CameraController(this.game);
		eventBus.off('drop-track', this._onDropTrack);
	    eventBus.off('ground-click', this._onGroundClick);
	}
}

registerClass(DropGame);