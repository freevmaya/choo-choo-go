class BaseTrack extends BaseGameObject {
	
    constructor(trackItems, sellPosition = null, rotation = 0) {

    	super();
    	if (Array.isArray(sellPosition))
    		sellPosition = {x: sellPosition[0], y: sellPosition[1]};
    	else sellPosition = {...sellPosition};

        this.id             = `track_${sellPosition.x}_${sellPosition.y}`;
        this.cellPosition   = sellPosition;
        this.rotation       = rotation;
        this.trackItems     = trackItems;
    }

    getCellPosition() {
        return this.cellPosition.clone();
    }

    getPath(index) {
        return [0, 2];
    }

    getPathCount() {
        return 1;
    }

    getNearestTrackItem(pathIndex, forward) {

        let nextPos = this.getNearestCell(pathIndex, forward);
        tracer.log(nextPos);

        let nextIndex = -1;

        this.trackItems.forEach((item, i)=>{
            if ((item.cellPosition.x == nextPos.x) &&
                (item.cellPosition.y == nextPos.y)) {
                    nextIndex = i;
                }
        });

        return nextIndex;
    }

    getNearestCell(pathIndex, forward) {
        let edge = (this.rotation + this.getPath(pathIndex)[forward ? 1 : 0]) % 4;
        let offsets = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
        ]
        let connectCell = this.getCellPosition();
        connectCell.x += offsets[edge][0];
        connectCell.y += offsets[edge][1];
        return connectCell;
    }

    getConnectPath(check_cell) {
        const count = this.getPathCount();
        for (let i=0; i<count; i++) {
            for (let f=0; f<2; f++) {
                let cell = this.getNearestCell(i, f == 0);
                if (check_cell.equals(cell))
                    return {
                        pathIndex: i,
                        forward: f != 0
                    }
            }
        }

        return null;
    }

    toCell(cellX, cellY, rotateY) {
        this.cellPosition = new Vector2Int(cellX, cellY);
        this.rotation = rotateY;
        super.toCell(cellX, cellY, rotateY);
    }

    /**
     * Загружает модель в сцену
     */
    loadModel(scene) {
    	super.loadModel(scene);
    	this.toCell(this.cellPosition.x, this.cellPosition.y, this.rotation);
        this.updateAppearance();
        return this.model;
    }

    getConnections() {
        return [];
    }

    getPosition() {
    	let center = GAME_SETTINGS.CELL_SIZE / 2;
    	return new THREE.Vector3(this.cellPosition.x * GAME_SETTINGS.CELL_SIZE + center, 0, 
    				this.cellPosition.y * GAME_SETTINGS.CELL_SIZE + center);
    }

    defaultPosition() {
    	return {x: 0, y: 0};
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {
    	let result = getPosition();
    	result.rotation = 0;
    	return result;
    }
}