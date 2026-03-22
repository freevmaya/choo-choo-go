class CurvedTrack extends BasePlatform {
    
    createModel() {
        const group = new THREE.Group();
        
        const railMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xccccdd, 
            metalness: 0.8, 
            roughness: 0.3
        });
        const sleeperMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B5A2B, 
            roughness: 0.9
        });
        
        const radius = GAME_SETTINGS.CELL_SIZE - (GAME_SETTINGS.CELL_SIZE - GAME_SETTINGS.RAIL_SPACE) / 2;
        const center = GAME_SETTINGS.CELL_SIZE / 2;
        const railSpacing = GAME_SETTINGS.RAIL_SPACE;
        const segments = 24;
        const startAngle = 0;
        const endAngle = Math.PI / 2;
        const railHeight = 0.12;
        
        // Точки для внешней и внутренней рельсы
        const pointsOuter = [];
        const pointsInner = [];
        
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i / segments) * endAngle;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            pointsOuter.push(new THREE.Vector3(x - center, railHeight / 2, z - center));
            pointsInner.push(new THREE.Vector3(
                Math.sin(angle) * (radius - railSpacing) - center, railHeight / 2, Math.cos(angle) * (radius - railSpacing) - center
            ));
        }
        
        // Внешняя рельса
        const outerCurve = new THREE.CatmullRomCurve3(pointsOuter);
        const outerTubeGeo = new THREE.TubeGeometry(outerCurve, segments * 2, 0.08, 6, false);
        const outerRail = new THREE.Mesh(outerTubeGeo, railMaterial);
        outerRail.castShadow = true;
        group.add(outerRail);
        
        // Внутренняя рельса
        const innerCurve = new THREE.CatmullRomCurve3(pointsInner);
        const innerTubeGeo = new THREE.TubeGeometry(innerCurve, segments * 2, 0.08, 6, false);
        const innerRail = new THREE.Mesh(innerTubeGeo, railMaterial);
        innerRail.castShadow = true;
        group.add(innerRail);
        
        // Шпалы на кривой
        const sleeperCount = 3;
        const sleeperWidth = GAME_SETTINGS.CELL_SIZE * 0.8;
        const offsetAngle = Math.PI / 4 / sleeperCount;

        for (let i = 0; i < sleeperCount; i++) {
            const t = i / sleeperCount;
            const angle = startAngle + t * endAngle + offsetAngle;
            const x = Math.sin(angle) * (radius - railSpacing / 2);
            const z = Math.cos(angle) * (radius - railSpacing / 2);
            
            const sleeper = new THREE.Mesh(
                new THREE.BoxGeometry(GAME_SETTINGS.SLEEPER_SIZE, GAME_SETTINGS.SLEEPER_HEIGHT, sleeperWidth),
                sleeperMaterial
            );
            sleeper.position.set(x - center, 0, z - center);
            sleeper.rotation.y = angle;
            sleeper.castShadow = true;
            group.add(sleeper);
        }
        
        return group;
    }

    getConnections() {
        // Поворот соединяется по двум направлениям
        if (this.direction === 'left') {
            return [
                { x: this.position.x, y: this.position.y + 1 },
                { x: this.position.x - 1, y: this.position.y }
            ];
        } else {
            return [
                { x: this.position.x, y: this.position.y + 1 },
                { x: this.position.x + 1, y: this.position.y }
            ];
        }
    }
}