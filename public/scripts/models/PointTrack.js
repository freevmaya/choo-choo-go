class PointTrack extends StraightTrack {

	size() {
		return {
			width: GAME_SETTINGS.CELL_SIZE,
			pillarWeight: 0.1,
			pillarHeight: 3,
			boardHeight: 0.5
		}
	}

    getTitle() {
        return this.data.title ? this.data.title : 'start';
    }

    createModel() {
    	let group = super.createModel();
        
        const width = GAME_SETTINGS.CELL_SIZE;

    	let size = this.size();
        
        // Материалы
        this.pillarMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xAA5A2B, 
            metalness: 0.8, 
            roughness: 0.3
        });

        this.boardMaterial = new THREE.MeshStandardMaterial({ 
            color: this.data.color ? this.data.color : 0x0B3B2F, 
            metalness: 0.2,
            roughness: 0.3
        });

        this._registerMaterial(this.pillarMaterial);
        this._registerMaterial(this.boardMaterial);

        let x = (size.width - size.pillarWeight) / 2;

        let lpillar = this.createBox(size.pillarWeight, size.pillarHeight, size.pillarWeight, this.pillarMaterial);
        lpillar.position.set(x, size.pillarHeight / 2, 0);
        group.add(lpillar);

        let rpillar = this.createBox(size.pillarWeight, size.pillarHeight, size.pillarWeight, this.pillarMaterial);
        rpillar.position.set(-x, size.pillarHeight / 2, 0);
        group.add(rpillar);

        let board = this.createBox(size.width - size.pillarWeight * 2, size.boardHeight, size.pillarWeight, this.boardMaterial);
        board.position.set(0, size.pillarHeight - size.boardHeight / 2, 0);
        group.add(board);

        let ftext = this.createText(lang.get(this.getTitle()), '#B8860B');
        ftext.position.set(0, size.pillarHeight - size.boardHeight / 2, size.pillarWeight);
        group.add(ftext);

        let btext = this.createText(lang.get(this.getTitle()), '#B8860B');
        btext.rotation.y = Math.PI;
        btext.position.set(0, size.pillarHeight - size.boardHeight / 2, -size.pillarWeight);
        group.add(btext);

    	return group;
    }
	
}

registerClass(PointTrack);