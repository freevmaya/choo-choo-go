class BaseStateMashine {
	constructor() {
        this.states = this.getStates();
        this.stateIndex = 0;
	}

    getStates() {
        return ['default'];
    }

    getName() {
        return this.name ? this.name : this.constructor.name;
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
            
            tracer.log(`State ${this.getName()} changed: ${this.State()}`);

            eventBus.emit('change_cart_state', this);
        }
    }

    afterSetState() {
        
    }
}