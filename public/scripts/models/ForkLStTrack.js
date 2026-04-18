class ForkLStTrack extends ForkTrack {
    
    createModel() {
        const group = new THREE.Group();
        
        this.createRailPair(group, false);
        this.createSleepers(group, false, 3);
        this.createStRail(group);

        this.createLever(group);
        
        return group;
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {

        if (path == 0)
            return StraightTrack.prototype.calcPathPoint.call(this, relPathPos, path);

        const rotationY = this.rotation * PI_HALF;
        const direction = -1;

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

        let pos = center - baseSize;

    	let box = this.createBox(baseSize, baseSize, baseSize, this.boxMaterial);
    	box.position.set(pos, baseSize / 2, pos);
    	group.add(box);

    	this.handleGroup = new THREE.Group();
        this.handleGroup.position.set(pos, 0, 0);

        this.collider = this.createColliderBox(baseSize * 3, baseSize * 6, baseSize * 3);
        this.collider.position.set(0, baseSize * 3, pos);
        this.handleGroup.add(this.collider);

    	let handleSize = baseSize * 0.5;
    	let handle = this.createBox(handleSize, baseSize * 5, handleSize, this.railMaterial);
    	handle.position.set(0, baseSize / 2 + baseSize * 2, pos);

    	this.handleGroup.add(handle);
    	
    	let leverSize = baseSize * 1.5;
    	let lever = this.createBox(leverSize, leverSize, leverSize, this.leverMaterial);
    	lever.position.set(0, baseSize / 2 + baseSize * 4, pos);

    	this.handleGroup.add(lever);

    	this._registerClickable(this.collider, this.onHandleClick.bind(this));

    	group.add(this.handleGroup);
	    this._updateHandle();
    }

    getPath(index) {
        let paths = [
        	[3, 1],
            [2, 3]
        ];
        return paths[index];
    }
}

registerClass(ForkLStTrack);