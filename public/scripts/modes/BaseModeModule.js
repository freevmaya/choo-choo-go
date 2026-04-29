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
	    	let bonuse = this.game.calcBonuse();
	    	this.game.showTip(lang.get(description), this.game.getConst("DESCRIPTION_TIME"), bonuse ? (sprintf(lang.get('price-title'), strEnum(bonuse, lang.get('bonuse-enum'))) + 
	    			' <i class="bi bi-trophy-fill"></i>') : null);
	    }
	}

	dispose() {
		
		if (this._start)
	    	this.game.gameState.off(GAME_STATE.PLAYING, this._start);
	}

	addPurchased(items) {

	}
}