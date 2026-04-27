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
		eventBus.on('game-mode-change', this._onModeChange = this.onModeChange.bind(this));
		eventBus.onBroadcast(this._onBroadcast = this.onBroadcast.bind(this));
        eventBus.on('disposed', this._onDisposed = this.onDisposed.bind(this));
	    window.addEventListener('mouseup', this._onMouseUp = this.onMouseUp.bind(this));
	    window.addEventListener('touchend', this._onTouchEnd = this.onTouchEnd.bind(this));
	}

	onMouseUp(e) {
		this.onRequireCloseWait();
	}

	onTouchEnd(e) {
		this.onRequireCloseWait();
	}

	onRequireCloseWait() {
		if (!this._justSetFocus && this.game.gameState.state != GAME_STATE.IDLE) {
			this.closeWaitAction();
		}
	}

	onDisposed(obj) {
		if (this.focus == obj)
			this.closeWaitAction();
	}

	onModeChange(mode) {
		if (this.focus)
			if (this.game.isPlaying() && this.animClass) {
				this.show(this.animClass);
			}
			else this.hide();
	}

	onTask(task) {
		if (this.game.isPlaying()) {

			if ((task instanceof BaseGameObject) && task.data.taskName)
				task = task.data.taskName;
			
			let focus = this.game.items.findAsTask(task, 'expect');
			if (focus)
				this.setFocus(focus, task);
		}
	}

	setFocus(focus, expect) {
		if (focus) {

			if (focus == this.focus)
				return;

			if (this.focus) {
				this.closeWaitAction();
			}

			if (this.focus = focus) {

				if (focus instanceof $) {

					let rect = focus[0].getBoundingClientRect();
					this.element.css({left: rect.left + rect.width / 2, top: rect.top + rect.height / 2});

					this.show(this.animClass = expect.animClass);
					if (expect.caption)
						this.game.showTip(lang.get(expect.caption));

				} else {

					let expectData = typeof(expect) == 'string' ? parseUserAction(focus.data.expect, expect) : expect;

					if (this.userActionEvent = focus.getUserActionEvent(expectData.index)) {

						eventBus.on(this.userActionEvent, this._onUserActionEvent = this.onUserActionEvent.bind(this));
						this.game.items.findTrains().forEach(t=>t.State('braking'));
						this.show(this.animClass = expectData.animClass);
						if (expectData.caption)
							this.game.showTip(lang.get(expectData.caption));
					}
				}

				this._justSetFocus = setTimeout(()=>{
					this._justSetFocus = null;
				}, 500);
				return;
			}
		}
		this.closeWaitAction();
	}

	onBroadcast(event, data) {

		let setFocus = (elem, exp) => {
			setTimeout(()=>{
				this.setFocus(elem, exp);
			}, exp.delay || 0);
		}

		if (this.game.items) {
			let focus = this.game.items.findAsTask(event, 'expect');
			if (focus)
				setFocus(focus, event);
		}

		let expect = this.game.getConst('expect');
		if (expect) {

			let exp = expect.find(exp => exp.event == event);
			if (exp) {
				if (exp.element) {
					let elem = $(exp.element);
					if (elem.length > 0) setFocus(elem, exp);
				} else
					if (data) setFocus(data, exp);
			}
		}
	}

	onUserActionEvent(data) {
		let pos = this.focus.getHandle(this.userActionEvent).getWorldPosition(new THREE.Vector3());
		this.closeWaitAction();
		eventBus.emit('user-action', {
			position: pos
		});
	}

	closeWaitAction() {
		if (this.focus) {
			this.focus = null;
			eventBus.off(this.userActionEvent, this._onUserActionEvent);
			this.userActionEvent = null;
			this.animClass = null;
			this.hide();
		}
	}

	_setClass(a_classes) {
		this.element.removeClass(['show', 'hide', 'pushAnim', 'rightMoveAnim', 'rightUpMoveAnim', 
									'leftMoveAnim', 'leftUpMoveAnim', 'pushAnimUp']);
		this.element.addClass(a_classes);
	}

	show(a_class='') {
		this._setClass(['show', a_class || 'pushAnim']);
	}

	hide() {
		this._setClass('hide');
	}

	update(dt) {
		if (this.focus && (this.focus.getHandle)) {
			let pos = this.game.cameraController.getScreenPosition(this.focus.getHandle(this.userActionEvent));
			this.element.css({left: pos.x, top: pos.y});
		}
	}

	dispose() {
		if (this.element) {
			this.element.remove();
			this.element = null;
		}

		eventBus.off('complete-task', this._onTask);
		eventBus.offBroadcast(this._onBroadcast);
	    window.removeEventListener('mouseup', this._onMouseUp);
	    window.removeEventListener('touchend', this._onTouchEnd);
	}
}

function parseUserAction(input, expect) {
    // Если пришёл массив — ищем элемент, который содержит expect
    let str = input;
    
    if (Array.isArray(input)) {
        str = input.find(item => item?.startsWith(expect));
        if (!str) {
            return { index: 0, animClass: '' };
        }
    }

    const match = str.split(':');
    
    return {
        index: match.length > 1 ? parseInt(match[1], 10) : 0,
        animClass: match.length > 2 ? match[2] : null,
        caption: match.length > 3 ? match[3] : null
    };
}