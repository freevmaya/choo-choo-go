class ForkTrack extends BaseCurveTrack {
    
    createModel() {
        const group = new THREE.Group();
        
        this.createRailPair(group, true);
        this.createRailPair(group, false);

        this.createSleepers(group, true, 3);
        this.createSleepers(group, false, 3);

        this.createLever(group);
        
        return group;
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {

        const rotationY = this.rotation * PI_HALF;
        const direction = path == 0 ? 1 : -1;

        const angle = (relPathPos + 1) / 2 * PI_HALF * direction + rotationY;
        const center = GAME_SETTINGS.CELL_SIZE / 2;

        let pos = (new THREE.Vector3(0, 0, center)).applyEuler(new THREE.Euler(0, angle, 0));

        pos.add((new THREE.Vector3(-center * direction, 0, -center)).applyEuler(new THREE.Euler(0, rotationY, 0)));
        pos.add(this.getPosition());
        pos.rotation = angle + PI_HALF + (direction < 0 ? Math.PI : 0);
        
        return pos;
    }

    createLever(group) {

    	let center = GAME_SETTINGS.CELL_SIZE / 2;
    	let baseSize = 0.15;

        this.boxMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            roughness: 0.9
        });

        this.leverMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xEE5500, 
            roughness: 0.9
        });

        this._registerMaterial(this.leverMaterial);
        this._registerMaterial(this.boxMaterial);

    	let box = this.createBox(baseSize, baseSize, baseSize, this.boxMaterial);
    	box.position.set(0, baseSize / 2, center - baseSize);
    	group.add(box);

    	this.handleGroup = new THREE.Group();

        let collider = this.createColliderBox(baseSize * 3, baseSize * 6, baseSize * 3);
        collider.position.set(0, baseSize * 3, center - baseSize);
        this.handleGroup.add(collider);

    	let handleSize = baseSize * 0.5;
    	let handle = this.createBox(handleSize, baseSize * 5, handleSize, this.railMaterial);
    	handle.position.set(0, baseSize / 2 + baseSize * 2, center - baseSize);

    	this.handleGroup.add(handle);
    	
    	let leverSize = baseSize * 1.5;
    	let lever = this.createBox(leverSize, leverSize, leverSize, this.leverMaterial);
    	lever.position.set(0, baseSize / 2 + baseSize * 4, center - baseSize);

    	this.handleGroup.add(lever);

    	this._registerClickable(collider);

    	group.add(this.handleGroup);
	    this._updateHandle();
    }

    onClick(hit, eventData) {
        if ((this.game.editorState() == 'play') || (this.game.editorState() == 'playAndEdit')) {
            if (this.currenCart() == null)
                this.setCurrentPath((this._currentPath + 1) % this.getPathCount());
            else this.doBusy();
        }
    }

    doBusy() {
        
    }

    _updateHandle() {
	    this.handleGroup.rotation.z = Math.PI * 0.2 * (0.5 - this._currentPath);
    }

    getCurrentPath() {
    	return this._currentPath;
    }

    getPathCount() {
    	return 2;
    }

    getPath(index) {
        let paths = [
        	[0, 3], 
        	[2, 3]
        ];
        return paths[index];
    }

    _afterSetCurrentPath() {
        this._updateHandle();
    }

    isAwailableRotate() {
        return this.game.editorState() == 'edit';
    }
}
registerClass(ForkTrack);