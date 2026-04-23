class GenCycle extends BaseModeModule {
	constructor(game) {
		super(game);

		this.lastTaskCart = null;

		eventBus.on('runOver', this._onRunOver = this.onRunOver.bind(this));
		eventBus.on('runOut', this._onRunOut = this.onRunOut.bind(this));
		eventBus.on('train-remove-chain', this._onRemoveChain = this.onRemoveChain.bind(this));

		//eventBus.on('ground-click', this._onGroundClick = this.onGroundClick.bind(this));
	}

	start(showToast = true) {
		super.start(showToast);
		this.game.setTimeout(()=>{this.initFreeTracks()}, 1000);
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

	initFreeTracks() {
		this.game.items.items.forEach(t => {
			if (t.data.spawner && !t.isBusy())
				this.startWaitGenerate(t);
		});
	}

	onRunOut(data) {
		let cart = data.positionCart.cart;
		let track = data.track;
		if (track.data.spawner && cart) {
			if (track.data.spawner == cart.data.name)
				this.startWaitGenerate(track, cart.toSaveData());
			else this.startWaitGenerate(track);
		}
	}

	onRunOver(data) {

		let cart = data.positionCart.cart;
		if (cart.data.name && (data.track.data.cart_name == cart.data.name)) {
			let train = cart.headTrain();
			
			if (train && (train.State() == 'run')) {
				train.State('braking');
				eventBus.once('change_mashine_state', (data)=>{
                    this.lastTaskCart = cart;
                });
			} else this.lastTaskCart = cart;
		}
		else this.lastTaskCart = null;
	}

	onRemoveChain(cart) {
		if (this.lastTaskCart == cart) {

	        cart.bounce(0.4, 0.5, true, ()=>{

	  			this.game.achiveGa(cart);
				cart.dispose();
	        });
			this.lastTaskCart = null;
		}
	}

	startWaitGenerate(track, template = null) {
		if (template == null) {
			template = this.game.getLevel()['templates']?.find(t => t.name == track.data.spawner);
		}

		if (template)
			this.game.setTimeout(()=>{
				this.Spawn(track, template);
			}, (track.data.period ? track.data.period : 5) * 1000);
	}

	Spawn(track, template) {
		if (!track.isBusy()) {

			let pos = track.getWorldPosition();
			pos.y += 1;
			this.game.showAppearEffect(pos);

			this.game.setTimeout(()=>{

				let cell = track.getCellPosition();
				if (!template.location)
					template.location = [cell.x, cell.y, 0];
				else {
					template.location[0] = cell.x;
					template.location[1] = cell.y;
				}
				delete(template.trackPos);
				let cart = this.game.items.addCart(template);

				cart.bounce(0.4, 0.5);

				eventBus.emit('spawn', cart);

			}, 300);

		} else this.startWaitGenerate(track, template);
	}

	dispose() {
		eventBus.off('runOver', this._onRunOver);
		eventBus.off('runOut', this._onRunOut);
		eventBus.off('train-remove-chain', this._onRemoveChain);
	}
}

registerClass(GenCycle);