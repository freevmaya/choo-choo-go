class StraightTrack extends BasePlatform {

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
        
        const trackLength = GAME_SETTINGS.CELL_SIZE;
        const railSpacing = GAME_SETTINGS.RAIL_SPACE;
        
        const railWidth = 0.08;
        const railHeight = 0.12;
        
        // Левая рельса
        const leftRail = new THREE.Mesh(
            new THREE.BoxGeometry(railWidth, railHeight, trackLength),
            railMaterial
        );
        leftRail.position.set(-railSpacing / 2, railHeight / 2, 0);
        leftRail.castShadow = true;
        leftRail.receiveShadow = true;
        group.add(leftRail);
        
        // Правая рельса
        const rightRail = new THREE.Mesh(
            new THREE.BoxGeometry(railWidth, railHeight, trackLength),
            railMaterial
        );
        rightRail.position.set(railSpacing / 2, railHeight / 2, 0);
        rightRail.castShadow = true;
        rightRail.receiveShadow = true;
        group.add(rightRail);
        
        // Шпалы
        const step = GAME_SETTINGS.SLEEPER_SIZE * 2;
        const sleeperCount = Math.ceil(GAME_SETTINGS.CELL_SIZE / step);
        const sleeperWidth = GAME_SETTINGS.CELL_SIZE * 0.8;
        const sleeperHeight = GAME_SETTINGS.SLEEPER_HEIGHT;
        const sleeperDepth = GAME_SETTINGS.SLEEPER_SIZE;
        
        for (let i = 0; i < sleeperCount; i++) {
            const t = i / sleeperCount;
            const pos = (t - 0.5) * trackLength + step / 2;
            
            const sleeper = new THREE.Mesh(
                new THREE.BoxGeometry(sleeperWidth, sleeperHeight, sleeperDepth),
                sleeperMaterial
            );
            sleeper.position.set(0, 0, pos);
            sleeper.castShadow = true;
            sleeper.receiveShadow = true;
            group.add(sleeper);
        }
        
        return group;
    }

    getConnections() {
        // Прямой путь соединяется по горизонтали
        return [
            { x: this.position.x + 1, y: this.position.y },
            { x: this.position.x - 1, y: this.position.y }
        ];
    }
}