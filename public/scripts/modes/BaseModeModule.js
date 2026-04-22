class BaseModeModule extends BaseStateMashine {
	constructor(game) {
		super();
		this.game = game;
	    if (this.game.isPlaying())
	    	this.start();
		else this.game.gameState.on(GAME_STATE.PLAYING, this._start = ()=>{
			this.start();
		});
	}

	start(showToast = true) {
		if (this._start)
	    	this.game.gameState.off(GAME_STATE.PLAYING, this._start);

	    let description = this.game.getConst('DESCRIPTION');
	    if (showToast && description) {
	    	this.toast = this.game.toast.show(lang.get(description));
	    } else if (this.toast) {
			this.toast.dispose();
			this.toast = null;
		}
	}

	dispose() {

		if (this.toast) {
			this.toast.dispose();
			this.toast = null;
		}
		
		if (this._start)
	    	this.game.gameState.off(GAME_STATE.PLAYING, this._start);
	}

	addPurchased(items) {

	}
}