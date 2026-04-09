class DropGameCamera extends CameraController {
	constructor(modeModule, options = null) {
		super(modeModule.game, options);

		this.modeModule = modeModule;

		eventBus.on('drop-track', this._onDropTrack = this.onDropTrack.bind(this));
	}

	onDropTrack(track) {
		this.setLookCell(track.getCellPosition());
	}

	dispose() {
		eventBus.off('drop-track', this._onDropTrack);
		super.dispose();
	}

	update(dt) {
		super.update(dt);
		if (this.modeModule.spawner)
			this.modeModule.spawner.update(dt);
	}
}