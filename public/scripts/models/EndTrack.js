class EndTrack extends StraightTrack {
    checkEdge(cart, posTrain) {
        const width = this.getConst('SLEEPER_SIZE');
    	if (posTrain > 0) {
    		let hl = (cart.baseLength + width * 2) / this.getConst('CELL_SIZE');
    		if (posTrain > 1 - hl) {
    			return {
    				edgeTrack: true,
    				reflect: true
    			}
    		}
    	}
        return null;
    }

	createModel() {
		let group = super.createModel();

        this.gadeMaterial = new THREE.MeshStandardMaterial({ 
            color: this.data.color ? this.data.color : 0x8B5A2B, 
            roughness: 0.9
        });
        
        this._registerMaterial(this.gadeMaterial);

		let trackLength = this.getConst('CELL_SIZE');
		let height = trackLength * 0.5;
        const railSpacing = this.getConst('RAIL_SPACE');
        const width = this.getConst('SLEEPER_SIZE');
        const center = trackLength / 2;
        const h2 = height / 2;
        
        const leftStay = this.createBox(width, height, width, this.gadeMaterial);
        leftStay.position.set(-railSpacing / 2, h2, center);
        group.add(leftStay);
        
        const rightStay = this.createBox(width, height, width, this.gadeMaterial);
        rightStay.position.set(railSpacing / 2, h2, center);
        group.add(rightStay);
        
        const box = this.createBox(this.getConst('SLEEPER_LENGTH'), width, width, this.gadeMaterial);
        box.position.set(0, height, center);
        group.add(box);

        return group;
	}
}
registerClass(EndTrack);