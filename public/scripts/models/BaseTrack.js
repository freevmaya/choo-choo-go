class BaseTrack extends BaseCellObject {
	
    constructor(data = null) {
    	super(data);
        this._currentPath = 0;
        this.carts = [];
        
        this.railMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xccccdd, 
            metalness: 0.8, 
            roughness: 0.3
        });
        this.sleeperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B5A2B, 
            roughness: 0.9
        });
        
        // Регистрируем материалы
        this._registerMaterial(this.railMaterial);
        this._registerMaterial(this.sleeperMaterial);

    }

    checkEdge(cart, posTrain) {
        return null;
    }

    _afterSetCurrentPath() {
    }

    runOut(positionCart) {
        this.runOutCar(positionCart.cart);
    }

    runOutCar(cart) {
        let idx = this.carts.indexOf(cart);
        if (idx > -1) {
            this.afterRunOut();
            this.carts.splice(idx, 1);
            eventBus.emit('runOut', {
                track: this,
                positionCart: cart.trackPos
            });
        }
    }

    getTrain() {
        return this.carts.find(c => c.headTrain())?.headTrain();
    }

    runOver(positionCart) {
        if (this.carts.indexOf(positionCart.cart) == -1) {

            this.game.items.items.forEach(t => {
                if (t.carts.includes(positionCart.cart))
                    t.runOutCar(positionCart.cart);
            });

            this.carts.push(positionCart.cart);
            this.setCurrentPath(positionCart.pathIndex);
            this.afterRunOver();
            eventBus.emit('runOver', {
                track: this,
                positionCart: positionCart
            });
        }
    }

    isBusy() {
        return this.carts.length > 0;
    }

    getTaskCart() {
        return this.carts.find(c => c.data.name == this.data.cart_name);
    }

    checkTaskComplete() {
        if (this.data.taskName) {
            if (this.data.cart_name)
                return this.getTaskCart() != null;
            else return true;
        }
        return false;
    }

    afterRunOver() {
        if (this.checkTaskComplete()) {
            let train = this.getTrain();

            var taskCart = this.getTaskCart();
            if (taskCart)
                taskCart.data.fixed = true;

            if (train && (train.State() == 'run')) {
                train.State('braking');
                eventBus.once('change_mashine_state', (data)=>{
                    this.game.completedTask(this.data.taskName, this);
                });
            } else this.game.completedTask(this.data.taskName, this);
        }
    }

    afterRunOut() {
        if (this.data.taskName) {
            this.game.deCompletedTask(this.data.taskName, this);
        }
    }

    getCurrentPath() {
        return this._currentPath;
    }

    setCurrentPath(pathIndex) {
        if (this._currentPath != pathIndex) {
            this._currentPath = pathIndex;
            this._afterSetCurrentPath();
        }
    }

    showOrientation() {

        if (!this.textGroup) {
            this.textGroup = new THREE.Group();

            for (let i=0; i<4; i++) {
                let plane = this.createText(i, 0, GAME_SETTINGS.CELL_SIZE / 2);

                let pos = this.calcGateSector(i);
                plane.position.set(pos.x, 0.1, pos.y);

                this.textGroup.add(plane);

            }

            this.model.add(this.textGroup);
        } else {
            this.model.remove(this.textGroup);
            this.textGroup = null;
        }
    }

    getPath(index) {
        return [0, 2];
    }

    calcGateSector(index) {
        return new THREE.Vector2(-Math.cos(index / 4 * Math.PI * 2) * GAME_SETTINGS.CELL_SIZE / 2, 
                                Math.sin(index / 4 * Math.PI * 2) * GAME_SETTINGS.CELL_SIZE / 2);
    }

    //direct <> 0
    getPathSector(index, direct = true) {
        let path = this.getPath(index);
        return (path[direct ? 0 : 1] + this.getCellRotation()) % 4; 
    }

    getPathCount() {
        return 1;
    }

    getPhysicMaterial() {
        return {
            resistance: 0.5
        };
    }

    getNearestTrackItem(pathIndex, forward) {
        let nextPos = this.getNearestCell(pathIndex, forward);
        return this.game.items.find(nextPos)
    }

    getNearestCell(pathIndex, forward) {
        let edge = (this.rotation + this.getPath(pathIndex)[forward ? 1 : 0]) % 4;
        let offsets = [
            [-1, 0],
            [0, 1],
            [1, 0],
            [0, -1],
        ];
        let connectCell = this.getCellPosition();
        connectCell.x += offsets[edge][0];
        connectCell.y += offsets[edge][1];
        return connectCell;
    }

    findConnections(allPath = true) {
        let result = [];
        let list = this.game.items.findNearest(this.cellPosition, allPath);
        list.forEach((index)=>{
            let path = this.getConnectPath(this.game.items.get(index).getCellPosition(), allPath);
            if (path)
                result.push(index);
        });
        return result;
    }

    connectToNearest() {
        for (let i=0; i<4; i++) {
            if (this.findConnections().length > 0)
                break;
            this.nextRotation();
        }
    }

    calcDirect(pathIndex = -1) {
        if (pathIndex == -1)
            pathIndex = this.pathIndex;

        return this.calcPathPoint(1, pathIndex).sub(this.calcPathPoint(-1, pathIndex));
    }

    getConnectPaths(check_cell) {
        let result = [];
        const count = this.getPathCount();
        for (let i=0; i<count; i++) {
            for (let f=0; f<2; f++) {
                let cell = this.getNearestCell(i, f == 0);
                if (check_cell.equals(cell))
                    result.push({
                        pathIndex: i,
                        forward: f != 0
                    });
            }
        }

        return result;
    }

    getConnectPath(check_cell, allPath = true) {

        if (allPath) {
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
        } else {
            for (let f=0; f<2; f++) {
                let cell = this.getNearestCell(this._currentPath, f == 0);
                if (check_cell.equals(cell))
                    return {
                        pathIndex: this._currentPath,
                        forward: f != 0
                    }
            }
        }

        return null;
    }

    calcPathPoint(relPathPos, path = 0) {
    	let result = this.getPosition();
    	result.rotation = 0;
    	return result;
    }

    isRotationComplete() {
        return this.findConnections().length > 1;
    }

    isAwailableRotate() {
        return this.carts.length == 0;
    }
}