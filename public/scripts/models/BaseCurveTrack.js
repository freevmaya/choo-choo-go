class BaseCurveTrack extends StraightTrack {

    /**
     * Создаёт рельсу из прямоугольных сегментов по заданным точкам
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
            const railSegment = this.createBox(railWidth, railHeight, length, material);
            
            // Позиционируем сегмент по центру между точками
            const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            railSegment.position.copy(midPoint);
            
            // Поворачиваем сегмент вдоль направления
            railSegment.rotation.y = angle;
            railSegment.castShadow = true;
            railSegment.receiveShadow = true;
            
            group.add(railSegment);

            //this._registerClickable(railSegment);
        }
    }

    createRailPair(group, toLeft = true) {
        
        const radius = GAME_SETTINGS.CELL_SIZE - (GAME_SETTINGS.CELL_SIZE - GAME_SETTINGS.RAIL_SPACE) / 2;
        const center = GAME_SETTINGS.CELL_SIZE / 2;
        const segments = 8;
        
        // Сохраняем точки для внешней и внутренней рельсы
        const pointsOuter = this.calcPoints(segments, radius, toLeft);
        const pointsInner = this.calcPoints(segments, radius - GAME_SETTINGS.RAIL_SPACE, toLeft);
        
        // Создаём внешнюю рельсу из прямоугольных сегментов
        this.createRailFromPoints(pointsOuter, this.railMaterial, GAME_SETTINGS.RAIL_WIDTH, GAME_SETTINGS.RAIL_HEIGHT, group);
        // Создаём внутреннюю рельсу из прямоугольных сегментов
        this.createRailFromPoints(pointsInner, this.railMaterial, GAME_SETTINGS.RAIL_WIDTH, GAME_SETTINGS.RAIL_HEIGHT, group);

    }

    createSleepers(group, toLeft = true, sleeperCount = 5) {
        
        const radius = GAME_SETTINGS.CELL_SIZE - (GAME_SETTINGS.CELL_SIZE - GAME_SETTINGS.RAIL_SPACE) / 2;
        const center = GAME_SETTINGS.CELL_SIZE / 2;        
        
        // Шпалы на кривой
        const slp_startAngle = Math.PI / 4 / sleeperCount;
        const direction = toLeft ? 1 : -1;
        
        for (let i = 0; i < sleeperCount; i++) {
            const t = i / sleeperCount;
            const angle = (slp_startAngle + t * PI_HALF) * direction;
            const midRadius = radius - GAME_SETTINGS.RAIL_SPACE / 2;
            const x = Math.sin(angle) * midRadius;
            const z = Math.cos(angle) * midRadius;
            
            const sleeper = this.createBox(GAME_SETTINGS.SLEEPER_SIZE, 
                GAME_SETTINGS.SLEEPER_HEIGHT, GAME_SETTINGS.SLEEPER_LENGTH, this.sleeperMaterial);

            sleeper.position.set(x - center * direction, GAME_SETTINGS.SLEEPER_HEIGHT / 2, z - center);
            sleeper.rotation.y = angle;
            group.add(sleeper);

            //this._registerClickable(sleeper);
        }
    }

    calcPoints(segments, radius, toLeft = true) {

        const railY = GAME_SETTINGS.RAIL_HEIGHT / 2 + GAME_SETTINGS.SLEEPER_HEIGHT / 2;
        const center = GAME_SETTINGS.CELL_SIZE / 2;
        let result = [];
        const direction = toLeft ? 1 : -1;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * PI_HALF * direction;
            
            const x = Math.sin(angle) * radius - center * direction;
            const z = Math.cos(angle) * radius - center;
            
            result.push(new THREE.Vector3(x, railY, z));
        }
        
        return result;
    }
}