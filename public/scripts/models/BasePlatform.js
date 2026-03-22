class BasePlatform {
    constructor(position = null, rotation = 0) {

    	if (Array.isArray(position))
    		position = {x: position[0], y: position[1]};

    	position = {...this.defaultPosition(), ...position};

        this.id = `track_${position.x}_${position.y}`;
        this.position = position;
        this.rotation = rotation;
    }

    init(scene) {    	
        this.model = this.createModel();
        this.scene = scene;
        this.loadModel(scene);
        return this;
    }

    absPosition() {
    	return new THREE.Vector3(this.position.x * GAME_SETTINGS.CELL_SIZE, 0, this.position.y * GAME_SETTINGS.CELL_SIZE);
    }

    defaultPosition() {
    	return {x: 0, y: 0};
    }

    /**
     * Обновляет внешний вид в зависимости от состояния
     */
    updateAppearance() {
        if (!this.model) return;
    }

    /**
     * Загружает модель в сцену
     */
    loadModel(scene) {
        let center = GAME_SETTINGS.CELL_SIZE / 2;
        this.model = this.createModel();
        const x = this.position.x * GAME_SETTINGS.CELL_SIZE - center;
        const z = this.position.y * GAME_SETTINGS.CELL_SIZE - center;
        this.model.position.set(x, 0, z);
        this.model.rotation.y = this.rotation * Math.PI / 2;
        scene.add(this.model);
        this.updateAppearance();
        return this.model;
    }

    getConnections() {
        return [];
    }

    createModel() {
    	return null;
    }
	
}