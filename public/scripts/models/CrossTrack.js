class CrossTrack extends StraightTrack {

    createModel() {
        const group = new THREE.Group();
        this.createStRail(group);
        const c_group = new THREE.Group();
        this.createStRail(c_group);
        c_group.rotation.set(0, Math.PI / 2, 0);
        group.add(c_group);
        return group;
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {

        let pos = this.getPosition();
        let rotation = this.rotation * PI_HALF - PI_HALF * path;

        let offset = new THREE.Vector3(0, 0, relPathPos / 2 * GAME_SETTINGS.CELL_SIZE);
        const euler = new THREE.Euler(0, rotation, 0);
        offset.applyEuler(euler);
        
        pos.add(offset);
        pos.rotation = rotation;
        
        return pos;
    }

    getPathCount() {
        return 2;
    }

    getPath(index) {
        return [
            [3, 1],
            [2, 0]
        ][index];
    }
}
registerClass(CrossTrack);