
class VKStateManager extends StateManager {

	constructor(config, defaultStage = {}) {
		super(config, defaultStage);
		this.config.useServerState = true;

		this.try_saveStateToServer = debounce(()=>{
            if (this.config.useServerState && window.user.user_id) {
				Ajax({
		            action: 'setUserState',
		            source_id: window.user.user_id,
		            data: this.state
		        })
		        .catch((e)=>{
		        	this.config.useServerState = false;
		        })
			}
        }, 2000);
	}

    saveStateLocale() {

    	let value = JSON.stringify(this.state);
        vkBridge.send('VKWebAppStorageSet', {
		   key: this.STORAGE_KEY,
		   value: value
		  })
		  .then((data) => { 
		    if (data.result) 
		      console.log(`State saved! Length data: ${value.length}`);
		  })
		  .catch((error) => {
		  	super.saveStateLocale();
		    console.log(error);
		  });

		this.try_saveStateToServer();

        this.lastHash = this.getHash();
    }
    
    loadState() {
        return new Promise((resolve, reject)=>{


            let returnDefault = ()=>{

                let saved = localStorage.getItem(this.STORAGE_KEY);
                if (saved)
                    saved = JSON.parse(saved);

                this.state = { ...this.DEFAULT_STATE, ...saved };

                resolve(this.state);
            }

        	vkBridge.send('VKWebAppStorageGet', {
			  keys: [this.STORAGE_KEY]})
			  .then((data) => {
			  	let saved = {};
			    if (data.keys) {
			    	let values = {};
			    	data.keys.forEach(i => values[i.key] = i.value );

			    	let savedStr = values[this.STORAGE_KEY];
			      	saved = JSON.parse(savedStr);
		      		console.log(`State loaded! Length data: ${savedStr.length}`);
			    }

			  	this.state = { ...this.DEFAULT_STATE, ...saved };
			  	resolve(this.state);
			  })
			  .catch((error) => {
			    console.error(error);
			    returnDefault();
			  });
        });
    }
    
    resetToDefault() {
        this.state = { ...this.DEFAULT_STATE };
        this.saveStateLocale();
    }
}