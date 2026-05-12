const TITLE_MISSION_IDS = {
	Novice: 0,
	Warrior: 3,
	Knight: 4,
	Lord: 5,
	Legend: 6
};


class VKUser {
	constructor(game, options = {}) {

		this.options = {...this.defaultOptions(), ...options};
		this.game = game;
		this.isOk = this.checkOk();
		this.goods = [];
		this.user_id = getParam('vk_ok_user_id') || getParam('vk_user_id');
		this.leaderBlock = $('#leader-block');
		this.leaderBlock.hide();

		PRICES.UNLOCK_LEVEL = 100;

		this.last_show_adv = performance.now();

		loadJSON('data/vk-prices.json')
			.then((data)=> {
				this.goods = data;
				this.initPayments();
			});
		//this.initBrowser();

		this.game.accountAddScore = (requireScore, text=null) => {
          return new Promise((resolve, reject) => {
          	let countStr = strEnum(requireScore);
          	let buttons = [];

          	if (this.goods) {

          		let g_item = this.goods.find(g => g.count >= requireScore);

          		if (g_item) {
	          		buttons.push({
		                caption: this.isOk ? "Оки" : "Голоса",
		                callback: ()=>{
							this.game.beforeExternal();
		                	vkBridge.send('VKWebAppShowOrderBox', 
								{ 
									type: 'item',
									item: String(g_item.item_id),
								})
								.then( (data) => {
								  	this.game.toast.hide();
									this.game.userScore(this.game.userScore() + requireScore);
									this.game.afterExternal();
									resolve(true);
								}) 
								.catch( (e) => {
									console.log('Ошибка!', e);
									this.game.afterExternal();
								});
		                }
					});
	          	}
	        }

          	if (requireScore <= 100) {
          		buttons.push({
	                caption: "Реклама",
	                callback: ()=>{
						this.game.beforeExternal();
	                	vkBridge.send('VKWebAppShowNativeAds', {
							ad_format: 'reward'
							})
							.then( (data) => {
								this.game.afterExternal();
								if (data.result) {
										this.game.toast.hide();
									this.game.userScore(this.game.userScore() + requireScore);
									resolve(true);
								}
							})
							.catch((error) => { 
								this.game.afterExternal();
								console.log(error); 
							});
	                }
	              });

          		buttons.push({
	                caption: "За друга",
	                callback: ()=>{

	                	this.inviteFrends((result)=>{
	                		if (result) {
								this.game.userScore(this.game.userScore() + requireScore);
							}
	                	});
	                }
          		});
          	}

            this.game.showTip(text != null ? text : lang.get('title-require-payment', [countStr]), 0, null, null, buttons);
          });
        }

		vkBridge.send('VKWebAppCheckNativeAds', {
				ad_format: 'reward' /* Тип рекламы */ 
			})
			.then((data) => { 
				if (this.haveAdv = data.result)
					this.showAd();
		  	})
		  	.catch((error) => { 
		  		tracer.log(error);
		  	});

		setTimeout(()=>{

			vkBridge.send('VKWebAppShowBannerAd', {
					banner_location: 'bottom'
				})
				.then((data) => { 
					this.haveBanner = data.result;
				})
				.catch((error) => {
					tracer.log(error);
				});

		}, 5000);

		if (this.options.useServer)
			vkBridge.send('VKWebAppGetUserInfo', {})
				.then(((user) => { 
					if (user) {
						Ajax({
							action: 'initUser',
							data: {
								source_id: this.user_id,
								source: this.isOk ? 'ok' : 'vk',
								user_data:  user
							}
						}).then((data)=>{

							this.initialized_on_server = true;
							if (data) {
								if (data.redirect)
									document.location.href = data.redirect;

								if (data.leader) {
									this.leaderBlock.show();
									this.leaderBlock.find('#leader-button')
										.css('background-image', `url(${data.leader[0]['avatar']})`);
								}
							} else this.options.useServer = false;
						});
					}
				}).bind(this));

	  	this.initListeners();
	}

	inviteFrends(callback) {
		this.game.beforeExternal();
    	vkBridge.send('VKWebAppShowInviteBox')
		  .then((data) => {  
			this.game.afterExternal();
		  	callback(data.success);
		  })
		  .catch((error) => {  
			this.game.afterExternal();
		    callback(false);
		  });
	}

	defaultOptions() {
		return {
			useServer: true
		}
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

		    this.game.lidersModalElement.find('[data-lang="invite"]').click(()=>{
		    	this.inviteFrends((result)=>{
            		if (result) {
						this.game.userScore(this.game.userScore() + 50);
					}
            	});
		    });
		});


    	eventBus.on('new_level', this.onNewLevel.bind(this));
    	//eventBus.on('new_score', this.onNewScore.bind(this));
    	eventBus.on('set_user_title', this.onNewTitle.bind(this));
	}

	initPayments() {
		let d = this.game.initDialog(`
			<div class="actor-icon">
				<div class="frame padding actor-1">
				</div>
			</div>
			<div class="status with-actor" data-lang="app_name"></div>
			<p style="padding-top: 20px;"><span data-lang="select-payment"></span>
			</p>
			<div class="list">
				<div class="list-content">
				</div>
			</div>
			<div class="text-center">
				<button type="button" data-bs-dismiss="modal" class="btn" data-lang="close"></button>
			</div>
	    `, 'payment-dialog');
	    this.payment = d;

	    let elem = this.payment.dialog.find('.list-content');
	    this.goods.forEach(g => {
	    	let pitem = $(`<div class="item" style="background-image: url(${g.photo_url})">${g.title}</div>`);
	    	pitem.click(()=>{
	    		this.game.accountAddScore(g.count, lang.get('title-payment', [g.count]))
	    			.then((result)=>{
	    				if (result)
	    					this.payment.modal.hide();
	    			})
	    	});
	    	elem.append(pitem);
	    });

	    this.game.stateView.score.click(()=>{
    		this.payment.modal.show();
	    	//this.game.accountAddScore(price - totalScore);
	    });
	}

	onNewLevel(level) {
		if (level > 1)
			vkBridge.send('VKWebAppAddToFavorites');
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
		if (TITLE_MISSION_IDS[key] && !this.isOk) {
			Ajax({
				action: 'vk_apiCall',
				data: {
					method: 'secure.addAppEvent',
					user_id: this.user_id,
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

			let proccesed = false;

			let doResolve = (result) => {
				if (!proccesed) {
					proccesed = true;
					this.game.afterExternal();
					resolve(result);
				}
			}

			if (this.haveAdv) { 

				setTimeout(()=>{
					if (!proccesed)
						doResolve(false);
				}, 15000);

				this.game.beforeExternal();
				vkBridge.send('VKWebAppShowNativeAds', {
					ad_format: 'interstitial' /* Тип рекламы */
				})
				.then((data) => { 
					doResolve(data.result);
				})
				.catch((error) => { 
					doResolve(false);
				});
			} else resolve(false);
		});
	}

	getLeaders() {
		return new Promise((resolve, reject) => {
		    Ajax({
		      action: 'getLeaders',
		      source: this.isOk ? 'ok' : 'vk'
		    }, (data)=>{
		      resolve(data);
		    });
		});
	}
}