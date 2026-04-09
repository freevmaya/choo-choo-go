class HandTouch {
	constructor(game) {
		this.game = game;
		this.element = $(`<div class="hand-touch hide"><div class="img"></div></div>`);
		this.game.game_container.append(this.element);
		this.focus = null;
		this.initListeners();
	}

	initListeners() {
		eventBus.on('complete-task', this._onTask = this.onTask.bind(this));
	}

	onTask(task) {
		this.focus = this.game.items.findAsTask(task, 'expect');
		if (this.focus) {
			this.show(this.focus.getCellPosition());
		}
	}

	show(a_class='pushAnim') {
		this.element.removeClass(['show', 'hide', 'pushAnim', 'rightMoveAnim']);
		this.element.addClass(['show', a_class]);
	}

	hide(cell, task, direct='') {
		this.element.addClass('hide');
	}

	update(dt) {
		if (this.focus) {
			let pos = this.game.cameraManager.getScreenPosition(this.focus);
			this.element.css({left: pos.x, top: pos.y});
		}
	}

	dispose() {
		if (this.element) {
			this.element.remove();
			this.element = null;
		}

		eventBus.off('complete-task', this._onTask);
	}
}