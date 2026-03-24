class StraightTrack extends BaseTrack {

    createModel() {
        const group = new THREE.Group();
        
        // Материалы
        const railMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xccccdd, 
            metalness: 0.8, 
            roughness: 0.3
        });
        const sleeperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B5A2B, 
            roughness: 0.9
        });
        
        // Регистрируем материалы для последующего освобождения
        this._registerMaterial(railMaterial);
        this._registerMaterial(sleeperMaterial);
        
        const trackLength = GAME_SETTINGS.CELL_SIZE;
        const railSpacing = GAME_SETTINGS.RAIL_SPACE;
        
        const railWidth = GAME_SETTINGS.RAIL_WIDTH;
        const railHeight = GAME_SETTINGS.RAIL_HEIGHT;
        const railY = GAME_SETTINGS.RAIL_HEIGHT / 2 + GAME_SETTINGS.SLEEPER_HEIGHT / 2;
        
        // Левая рельса
        const leftRail = new THREE.Mesh(
            new THREE.BoxGeometry(railWidth, railHeight, trackLength),
            railMaterial
        );
        leftRail.position.set(-railSpacing / 2, railY, 0);
        leftRail.castShadow = true;
        leftRail.receiveShadow = true;
        this._registerGeometry(leftRail.geometry);
        group.add(leftRail);
        
        // Правая рельса
        const rightRail = new THREE.Mesh(
            new THREE.BoxGeometry(railWidth, railHeight, trackLength),
            railMaterial
        );
        rightRail.position.set(railSpacing / 2, railY, 0);
        rightRail.castShadow = true;
        rightRail.receiveShadow = true;
        this._registerGeometry(rightRail.geometry);
        group.add(rightRail);
        
        // Шпалы
        const step = GAME_SETTINGS.SLEEPER_STEP;
        const sleeperCount = Math.ceil(GAME_SETTINGS.CELL_SIZE / step);
        
        for (let i = 0; i < sleeperCount; i++) {
            const t = i / sleeperCount;
            const pos = (t - 0.5) * trackLength + step / 2;
            
            const sleeper = new THREE.Mesh(
                new THREE.BoxGeometry(GAME_SETTINGS.SLEEPER_SIZE, GAME_SETTINGS.SLEEPER_HEIGHT, GAME_SETTINGS.SLEEPER_LENGTH),
                sleeperMaterial
            );
            sleeper.position.set(0, GAME_SETTINGS.SLEEPER_HEIGHT / 2, pos);
            sleeper.rotation.y = PI_HALF;
            sleeper.castShadow = true;
            sleeper.receiveShadow = true;
            this._registerGeometry(sleeper.geometry);
            group.add(sleeper);
        }
        
        return group;
    }

    /* relPathPos от -1 до 1 */
    calcPathPoint(relPathPos, path = 0) {

        let pos = this.getPosition();
        let rotation = this.rotation * PI_HALF;

        let offset = new THREE.Vector3(0, 0, relPathPos / 2 * GAME_SETTINGS.CELL_SIZE);
        const euler = new THREE.Euler(0, rotation, 0);
        offset.applyEuler(euler);
        
        return {...pos.add(offset), ...{rotation: rotation} };
    }

    getPath(index) {
        return [3, 1];
    }
}