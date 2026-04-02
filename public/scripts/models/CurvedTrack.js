class CurvedTrack extends BaseCurveTrack {
    
    createModel() {
        const group = new THREE.Group();
        
        this.createRailPair(group, true);
        this.createSleepers(group, true);
        
        return group;
    }

    getPath(index) {
        return [0, 3];
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {

        const rotationY = this.rotation * PI_HALF;

        const angle = (relPathPos + 1) / 2 * PI_HALF + rotationY;
        const center = GAME_SETTINGS.CELL_SIZE / 2;

        let pos = (new THREE.Vector3(0, 0, center)).applyEuler(new THREE.Euler(0, angle, 0));

        pos.add((new THREE.Vector3(-center, 0, -center)).applyEuler(new THREE.Euler(0, rotationY, 0)));
        pos.add(this.getPosition());
        pos.rotation = angle + PI_HALF;
        
        return pos;
    }
}

registerClass(CurvedTrack);