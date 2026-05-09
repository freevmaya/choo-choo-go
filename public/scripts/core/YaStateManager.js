
class YaStateManager extends StateManager {

	constructor(config, defaultStage = {}) {

  		super(config, defaultStage);
	    ysdk.getPlayer().then(_player => {
	        this.player = _player;
	    });
	}

    saveStateLocale() {
        this.lastHash = this.getHash();
        this.player.setData(this.state);
    }
    
    loadState() {
        return new Promise((resolve, reject)=>{
        	When(()=>{
        		return this.player;
        	}).then(()=>{
        		this.player.getData()
        			.then((data)=>{
        				resolve(this.state = data);
        			})
        			.catch((e)=>{
        				reject(e);
        			});
        	})
        });
    }
    
    resetToDefault() {
        this.state = { ...this.DEFAULT_STATE };
        this.saveStateLocale();
    }
}