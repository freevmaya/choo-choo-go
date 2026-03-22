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
        const segments = 3;
        const startAngle = 0;
        const endAngle = Math.PI / 2;
        const railHeight = 0.12;
        const railWidth = 0.08;
        
        // Сохраняем точки для внешней и внутренней рельсы
        const pointsOuter = [];
        const pointsInner = [];
        const y = 0.1;
        
        for (let i = 0; i <= segments; i++) {
            const angle = startAngle + (i / segments) * endAngle;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            pointsOuter.push(new THREE.Vector3(x - center, y, z - center));
            pointsInner.push(new THREE.Vector3(
                Math.sin(angle) * (radius - railSpacing) - center, 
                y, 
                Math.cos(angle) * (radius - railSpacing) - center
            ));
        }
        
        // Создаём внешнюю рельсу из прямоугольных сегментов
        this.createRailFromPoints(pointsOuter, railMaterial, railWidth, railHeight, group);
        
        // Создаём внутреннюю рельсу из прямоугольных сегментов
        this.createRailFromPoints(pointsInner, railMaterial, railWidth, railHeight, group);
        
        // Шпалы на кривой
        const sleeperCount = 5;
        const sleeperWidth = GAME_SETTINGS.CELL_SIZE * 0.7;
        
        for (let i = 0; i <= sleeperCount; i++) {
            const t = i / sleeperCount;
            const angle = startAngle + t * endAngle;
            const midRadius = radius - railSpacing / 2;
            const x = Math.sin(angle) * midRadius;
            const z = Math.cos(angle) * midRadius;
            
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

    /**
     * Создаёт рельсу из прямоугольных сегментов по заданным точкам
     * @param {THREE.Vector3[]} points - массив точек кривой
     * @param {THREE.Material} material - материал рельсы
     * @param {number} railWidth - ширина рельсы
     * @param {number} railHeight - высота рельсы
     * @param {THREE.Group} group - группа для добавления
     */
    createRailFromPoints(points, material, railWidth, railHeight, group) {

        const sin_dangle = Math.sin((Math.PI * 0.5) / points.length);

        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            
            // Вычисляем направление сегмента
            const direction = new THREE.Vector3().subVectors(p2, p1);
            const length = direction.length() + railWidth * sin_dangle;
            
            if (length < 0.001) continue;
            
            // Нормализуем направление
            direction.normalize();
            
            // Вычисляем угол поворота для сегмента
            const angle = Math.atan2(direction.x, direction.z);
            
            // Создаём прямоугольный параллелепипед для сегмента рельсы
            const railSegment = new THREE.Mesh(
                new THREE.BoxGeometry(railWidth, railHeight, length),
                material
            );
            
            // Позиционируем сегмент по центру между точками
            const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            railSegment.position.copy(midPoint);
            
            // Поворачиваем сегмент вдоль направления
            railSegment.rotation.y = angle;
            railSegment.castShadow = true;
            railSegment.receiveShadow = true;
            
            group.add(railSegment);
        }
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