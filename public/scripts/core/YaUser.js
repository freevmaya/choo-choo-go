var ysdk;
async function initSDK() {
  ysdk = await YaGames.init();
  if (ysdk) {

    $(window).ready(()=>{
      if (window.lang)
        window.lang.setLanguage(ysdk.environment.i18n.lang);
      else console.error('Language not available');

      ysdk.adv.showFullscreenAdv({
          callbacks: {
              onClose: (wasShown) => {
                new YaUser(ysdk, window.game = new RailGame(YaStateManager));
              },
              onError: (error) => {
                new YaUser(ysdk, window.game = new RailGame(YaStateManager));
              }
          }
      });
    });
  }
}

class YaUser {

  constructor(ysdk, game) {

    this.game = game;
    this.ysdk = ysdk;
    this.goods = [];

    PRICES.UNLOCK_LEVEL = 100;
    this.last_show_adv = performance.now();

    loadJSON('data/ya-prices.json')
      .then((data)=> {
        this.goods = data;
        this.initPayments();
        this.initPaymentDialog();
      });

    this.game.advProvider = () => {
        return new Promise((resolve, reject)=>{
          if (!this.showAdv) {
            this.showAdv = true;
            this.game.soundManager.setMuted(true);

            let finishAdv = () => {
              this.game.soundManager.setMuted(this.game.soundManager.userMuted);
              this.showAdv = false;
              resolve(true)
            }

            ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onOpen: () => console.log('Реклама открыта.'),
                    onClose: (wasShown) => {
                      finishAdv();
                    },
                    onError: (error) => {
                      finishAdv();
                    },
                }
            });
          }
        });
      }

    this.initListener();
    this.ysdk.features.LoadingAPI?.ready();
    this.processPurchases();
  }

  initListener() {

    this.game.gameState.on(GAME_STATE.GAME_OVER, () => {
      this.ysdk.features.GameplayAPI?.stop()
    });
    
    this.game.gameState.on(GAME_STATE.VICTORY, () => {
      this.ysdk.features.GameplayAPI?.stop()
    });
    
    this.game.gameState.on(GAME_STATE.PLAYING, () => {
      this.ysdk.features.GameplayAPI?.start()
    });
    
    this.game.gameState.on(GAME_STATE.PAUSED, () => {
      this.ysdk.features.GameplayAPI?.stop()
    });
    
    this.game.gameState.on(GAME_STATE.RESUME, () => {
    });

    this.ysdk.on('game_api_pause', this.handlePause.bind(this));
    this.ysdk.on('game_api_resume', this.handleResume.bind(this));

  }

  async handlePurchase(purchase, count=null) {
    let g_item = this.goods.find(g => g.item_id == purchase.productID);
    if (g_item) {
        this.game.userScore(this.game.userScore() + (count == null) ? g_item.count : count);
        await ysdk.payments.consumePurchase(purchase.purchaseToken);
    }
  }

  async processPurchases() {
    const purchases = await this.ysdk.payments.getPurchases();

    for (let purchase of purchases) {
        await handlePurchase(purchase);
    }
  }

  initPaymentDialog() {
    this.game.accountAddScore = (requireScore, text=null) => {
      return new Promise((resolve, reject) => {
        let countStr = strEnum(requireScore);
        let buttons = [];

        if (this.goods) {

          let g_item = this.goods.find(g => g.count >= requireScore);

          if (g_item) {
            buttons.push({
              caption: window.lang.get("yan"),
              callback: ()=>{
                tracer.log(this.game.preparePurchases);
                let g_item = this.goods.find(g => g.count >= requireScore);
                ysdk.payments.purchase({ id: String(g_item.item_id) })
                  .then((data)=>{
                    tracer.log(data);
                    this.game.toast.hide();
                    this.handlePurchase(data, requireScore);
                    resolve(true);
                  });
              }
            });
          }
        }

        if (requireScore <= 100) {
          buttons.push({
            caption: window.lang.get("adv"),
            callback: ()=>{
              this.ysdk.adv.showRewardedVideo({
                  callbacks: {
                      onRewarded: () => {
                        this.game.toast.hide();
                        this.game.userScore(this.game.userScore() + requireScore);
                        resolve(true);
                      }
                  }
              });
            }
          });
          /*
          buttons.push({
              caption: "За друга",
              callback: ()=>{}
          });
          */
        }

        this.game.showTip(text != null ? text : lang.get('title-require-payment', [countStr]), 0, null, null, buttons);
      });
    }
  }

  handlePause() {
    this.game.gameState.pause();
  }

  handleResume() {
    this.game.gameState.resume();
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
      });
  }
}