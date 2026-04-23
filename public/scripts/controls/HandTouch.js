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

			this.focus = focus;

			let expectData = parseUserAction(this.focus.data.expect, expect);

			if (this.userActionEvent = this.focus.getUserActionEvent(expectData.index)) {

				eventBus.on(this.userActionEvent, this._onUserActionEvent = this.onUserActionEvent.bind(this));
				this.game.items.findTrains().forEach(t=>t.State('braking'));
				this.show(this.animClass = expectData.animClass);
				return;
			}
		}
		this.closeWaitAction();
	}

	onBroadcast(event, data) {
		if (this.game.isPlaying() && this.game.items) {
			let focus = this.game.items.findAsTask(event, 'expect');
			if (focus)
				this.setFocus(focus, event);
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
									'leftMoveAnim', 'leftUpMoveAnim']);
		this.element.addClass(a_classes);
	}

	show(a_class='') {
		this._setClass(['show', a_class || 'pushAnim']);
	}

	hide() {
		this._setClass('hide');
	}

	update(dt) {
		if (this.focus) {
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
    
    const match = str?.match(/^[^:]+:(\d+):(.+)$/);
    
    if (!match) {
        return { index: 0, animClass: '' };
    }
    
    return {
        index: parseInt(match[1], 10),
        animClass: match[2]
    };
}