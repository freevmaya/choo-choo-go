class BaseStateMashine extends BaseGameObject {
	constructor(game) {
		super(game);
        this.states = this.getStates();
        this.stateIndex = 0;
	}

    getStates() {
        return ['default'];
    }

    State(value = null) {
        if (value) {
            let index = this.states.indexOf(value);
            if (index > -1) {
                this._setState(index);
            }
            else console.error(`State ${value} not found`);
        }
        return this.states[this.stateIndex];
    }

    _setState(index) {
        if (index != this.stateIndex) {
            this.stateIndex = index;
            this.afterSetState();

            eventBus.emit('change_cart_state', this);
        }
    }

    afterSetState() {
        
    }
}