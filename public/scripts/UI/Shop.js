class Shop {
	constructor(game, items) {
		this.game = game;
		this.items = items;
		let d = this.game.initDialog(`
	      <div class="shop">
	        <div class="status" data-lang="shop">Магазин</div>

	        <div class="info">
		        <div class="score">
					<span data-lang="score"></span>: 
					<span data-lang="value" class="value"></span>
		        </div>
		        <div class="spend">
					<span data-lang="spend"></span>: 
					<span data-lang="value" class="value"></span>
		        </div>
			</div>

	        <div class="list shop">
	          <div class="list-content">
	          </div>
	        </div>
	      </div>

	      <div class="basket">
	        <div class="status" data-lang="basket">Корзина</div>
	        <div class="list basket">
	          <div class="list-content">
	          </div>
	        </div>
	      </div>

	      <div class="text-center">
	        <button type="button" class="btn pay" disabled="on" data-lang="pay">Купить</button>
	        <button type="button" class="btn" data-bs-dismiss="modal" data-lang="cancel">Закрать</button>
	      </div>`);
	    this.elem = d.dialog;
	    this.modal = d.modal;

	    this.elem.find('.pay').click(this.onPayClick.bind(this));
	}

	show() {

		this.itemsElem = this.elem.find('.shop .list-content');
		this.itemsElem.empty();
		this.items.forEach((k, i) => {
			let itm = this.items[i];

			let path = `images/library/${itm.type.name}.png`;
			let item = $(`<div class="item" style="background-image: url(${path})">
				<div class="price"><span data-lang="price"></span>: ${itm.price}</div>
			</div>`);
			item.click(()=>{
				this.toBasket(itm);
			});
			this.itemsElem.append(item);
		});

		lang.applyToDOM(this.itemsElem);

		this.basket = this.elem.find('.basket .list-content');
		this.basket.empty();
		this.totalScore = this.game.currentScore + this.game.stateManager.get('score', 0);
		this.spend = {};

		this.refreshScore();

		this.modal.show();
	}

	onPayClick() {
		let spend = this.calcSpend();
		if (spend > this.totalScore) {
			this.game.accountAddScore(spend - this.totalScore)
				.then((result)=>{
					if (result)
						this.purchase();
				});
		} else this.purchase();
	}

	purchase() {
		this.game.addPurchased(this.spend);
		this.modal.hide();
	}

	itemCount(item, count = null) {
		let counter = item.find('.counter');
		let result = 1;
		if (count !== null) {
			if (count <= 0) {
				item.remove();
			} else {
				if (counter.length == 0) {
					item.append(counter = $(`<div class="counter"><span data-lang="count"></span>: <span class="value"></span></div>`));
					lang.applyToDOM(counter);
				}
				counter.find('.value').text(count);
			}
		} else
			count = counter.length == 0 ? 1 : Number(counter.find('.value').text());


		let type = item.data('type');
		this.spend[type] = count;

		this.refreshScore();

		let btnCancel = this.elem.find('.pay')[0];
		btnCancel.disabled = count <= 0;

		return count;
	}

	calcSpend() {

		let spend = 0;
		Object.keys(this.spend).forEach((k, i)=>{
			let itm = this.items.find(i => i.type.name == k);
			spend += itm.price * this.spend[k];
		});
		return spend;
	}

	refreshScore() {
		let score = this.totalScore;
		let spend = this.calcSpend();

		this.elem.find('.score .value').text(Math.round(score - spend));
		this.elem.find('.spend .value').text(Math.round(spend));
	}

	toBasket(itm) {
		let type = itm.type.name;
		let item = this.basket.find(`[data-type="${type}"]`);
		if (item.length > 0) {
			this.itemCount(item, this.itemCount(item) + 1);
		} else {
			let path = `images/library/${type}.png`;
			let item = $(`<div class="item" style="background-image: url(${path})" data-type="${type}"></div>`);
	        this.basket.append(item);
	        item.click(()=>{
	        	this.itemCount(item, this.itemCount(item) - 1);
	        });
			this.itemCount(item, 1);
	    }
	}
}