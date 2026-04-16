class StraightTrack extends BaseTrack {

    createModel() {
        const group = new THREE.Group();
        
        this.createStRail(group);
        return group;
    }

    createStRail(group) {

        
        const trackLength = GAME_SETTINGS.CELL_SIZE;
        const railSpacing = GAME_SETTINGS.RAIL_SPACE;
        
        const railWidth = GAME_SETTINGS.RAIL_WIDTH;
        const railHeight = GAME_SETTINGS.RAIL_HEIGHT;
        this.railY = this.getConst('RAIL_HEIGHT') / 2 + this.getConst('SLEEPER_HEIGHT') / 2;
        
        const leftRail = this.createBox(railWidth, railHeight, trackLength, this.railMaterial);
        leftRail.position.set(-railSpacing / 2, this.railY, 0);
        group.add(leftRail);
        
        // Правая рельса
        const rightRail = this.createBox(railWidth, railHeight, trackLength, this.railMaterial);
        rightRail.position.set(railSpacing / 2, this.railY, 0);
        group.add(rightRail);
        
        // Шпалы
        const step = GAME_SETTINGS.SLEEPER_STEP;
        const sleeperCount = Math.ceil(GAME_SETTINGS.CELL_SIZE / step);
        
        for (let i = 0; i < sleeperCount; i++) {
            const t = i / sleeperCount;
            const pos = (t - 0.5) * trackLength + step / 2;
            
            const sleeper = this.createBox(GAME_SETTINGS.SLEEPER_SIZE, GAME_SETTINGS.SLEEPER_HEIGHT, 
                GAME_SETTINGS.SLEEPER_LENGTH, this.sleeperMaterial);

            sleeper.position.set(0, GAME_SETTINGS.SLEEPER_HEIGHT / 2, pos);
            sleeper.rotation.y = PI_HALF;
            group.add(sleeper);
        }
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {

        let pos = this.getPosition();
        let rotation = this.rotation * PI_HALF;

        let offset = new THREE.Vector3(0, 0, relPathPos / 2 * GAME_SETTINGS.CELL_SIZE);
        const euler = new THREE.Euler(0, rotation, 0);
        offset.applyEuler(euler);
        
        pos.add(offset);
        pos.rotation = rotation;
        
        return pos;
    }

    getPath(index) {
        return [3, 1];
    }
}
registerClass(StraightTrack);