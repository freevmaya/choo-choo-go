class VKUser {
	constructor(game) {
		this.game = game;
		this.isOk = this.checkOk();

		this.game.accountAddScore = (requireScore) => {
          return new Promise((resolve, reject) => {
          	let countStr = strEnum(requireScore);

          	let buttons = [
              {
                caption: this.isOk ? "Оки" : "Голоса",
                callback: ()=>{
                	vkBridge.send('VKWebAppShowOrderBox', 
						{ 
							type: 'item',
							item: '1',
						})
						.then( (data) => {
						  	this.game.toast.hide();
							this.game.userScore(this.game.userScore() + requireScore);
							resolve(true);
						}) 
						.catch( (e) => {
							this.game.toast.hide();
							resolve(false);
							console.log('Ошибка!', e);
						});
                }
              }
            ]

          	if (requireScore <= 100) {
          		buttons.push({
	                caption: "Реклама",
	                callback: ()=>{
	                	vkBridge.send('VKWebAppShowNativeAds', {
						  ad_format: 'reward'
						  })
						  .then( (data) => {
						  	this.game.toast.hide();
						    if (data.result) {
						    	this.game.userScore(this.game.userScore() + requireScore);
						    	resolve(true);
						    } else {
              					resolve(false);
						    }
						  })
						  .catch((error) => { 
						  	this.game.toast.hide();
              				resolve(false);
						  	console.log(error); 
						  });
	                }
	              });
          	}

            this.game.showTip(`Требуется добавить для<br>покупки ${countStr}.<br>Выберите способ.`, 0, null, null, buttons);
          });
        }
	}

	checkOk() {
	    const urlParams = new URLSearchParams(window.location.search);
	    return urlParams.get('vk_client') == 'ok';
	}
}