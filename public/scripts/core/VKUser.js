const TITLE_MISSION_IDS = {

};

class VKUser {
	constructor(game) {
		this.game = game;
		this.isOk = this.checkOk();
		this.goods = [];

		PRICES.UNLOCK_LEVEL = 100;

		this.last_show_adv = performance.now();

		loadJSON('data/vk-prices.json')
			.then((data)=> {
				this.goods = data;
			});
		//this.initBrowser();

		this.game.accountAddScore = (requireScore) => {
          return new Promise((resolve, reject) => {
          	let countStr = strEnum(requireScore);
          	let buttons = [];

          	if (this.goods) {

          		let g_item = this.goods.find(g => g.count >= requireScore);

          		if (g_item) {
	          		buttons.push({
		                caption: this.isOk ? "Оки" : "Голоса",
		                callback: ()=>{
		                	vkBridge.send('VKWebAppShowOrderBox', 
								{ 
									type: 'item',
									item: g_item.item_id,
								})
								.then( (data) => {
								  	this.game.toast.hide();
									this.game.userScore(this.game.userScore() + requireScore);
									resolve(true);
								}) 
								.catch( (e) => {
									console.log('Ошибка!', e);
								});
		                }
					});
	          	}
	        }

          	if (requireScore <= 100) {
          		buttons.push({
	                caption: "Реклама",
	                callback: ()=>{
	                	vkBridge.send('VKWebAppShowNativeAds', {
						  ad_format: 'reward'
						  })
						  .then( (data) => {
						    if (data.result) {
						  		this.game.toast.hide();
						    	this.game.userScore(this.game.userScore() + requireScore);
						    	resolve(true);
						    }
						  })
						  .catch((error) => { 
						  	console.log(error); 
						  });
	                }
	              });

          		buttons.push({
	                caption: "За друга",
	                callback: ()=>{
	                	vkBridge.send('VKWebAppGetFriends')
						  .then((data) => { 
						    if (data && (data.users.length > 0)) {
						  		this.game.toast.hide();

						      	let overCount = data.users.length - 1;
								this.game.userScore(this.game.userScore() + requireScore + (overCount * 100));
								resolve(true);
						    }
						  })
						  .catch((error) => { 
						    console.log(error);
						  });
	                }
          		});
          	}

            this.game.showTip(`Требуется добавить для<br>покупки ${countStr}.<br>Выберите способ.`, 0, null, null, buttons);
          });
        }

		vkBridge.send('VKWebAppCheckNativeAds', {
				ad_format: 'reward' /* Тип рекламы */ 
			})
			.then((data) => { 
				this.haveAdv = data.result;
				//this.showAd(); на время модерации
		  	})
		  	.catch((error) => { 
		  		tracer.log(error);
		  	});

		vkBridge.send('VKWebAppShowBannerAd', {
				banner_location: 'bottom'
			})
			.then((data) => { 
				this.haveBanner = data.result;
			})
			.catch((error) => {
				tracer.log(error);
			});

	  	this.initListeners();
	}

	initListeners() {
		When(()=>{
			return window.game;
		})
		.then(()=>{
			window.game.advProvider = () => {
				return new Promise((resolve, reject)=>{
					let current = performance.now();
					let dt = (current - this.last_show_adv) / 1000;
					if (dt > 30) {
						this.last_show_adv = current;
						this.showAd()
							.then((result) => {
								setTimeout(()=>{
									resolve(result);
								}, 200);
							});
					} else resolve(true);
		      });
		    }
		});


    	eventBus.on('new_level', this.onNewLevel.bind(this));
    	eventBus.on('new_score', this.onNewScore.bind(this));
    	eventBus.on('set_user_title', this.onNewTitle.bind(this));
	}

	onNewLevel(level) {
		Ajax({
			action: 'vk_apiCall',
			data: {
				method: 'secure.addAppEvent',
				activity_id: 1,
				value: level
			}
		}, (data)=>{
			tracer.log(data);
		});
	}

	onNewScore(value) {
		Ajax({
			action: 'vk_apiCall',
			data: {
				method: 'secure.addAppEvent',
				activity_id: 2,
				value: value
			}
		}, (data)=>{
			tracer.log(data);
		});
	}

	onNewTitle(key) {
		if (TITLE_MISSION_IDS[key]) {
			Ajax({
				action: 'vk_apiCall',
				data: {
					method: 'secure.addAppEvent',
					activity_id: TITLE_MISSION_IDS[key]
				}
			}, (data)=>{
				tracer.log(data);
			});
		}
	}

	shareApp(message) {
		return new Promise((resolve, reject)=>{
			vkBridge.send('VKWebAppShare', {
				text: message
			})
			.then((data)=>{
				let items = data.result || data.items;
				if (items && items.length)
					resolve(items);
				else {
					tracer.error(data);
					reject(data);
				}
			})
			.catch((e)=>{
				tracer.error(e);
				reject(e);
			});
		});
	}

	initBrowser() {
		let platform = getParam('vk_platform');
		let isDesk = platform.includes('desktop');
		if (!isDesk) 
			$('.tools-block').css('margin-top', 45);
	}

	checkOk() {
	    const urlParams = new URLSearchParams(window.location.search);
	    return urlParams.get('vk_client') == 'ok';
	}

	showAd() {
		return new Promise((resolve, reject) => {
			if (this.haveAdv) { 
				vkBridge.send('VKWebAppShowNativeAds', {
					ad_format: 'interstitial' /* Тип рекламы */
				})
				.then((data) => { 
					// Реклама была показана
					resolve(data.result)
				})
				.catch((error) => { 
					tracer.log(error);
					resolve(false);
				});
			} else resolve(false);
		});
	}
}