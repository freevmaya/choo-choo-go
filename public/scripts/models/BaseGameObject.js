class BaseGameObject extends BaseStateMashine {
    constructor(game) {
        
        super();
        // Для хранения ресурсов, которые нужно освободить
        this._resourcesToDispose = {
            geometries: new Set(),
            materials: new Set(),
            textures: new Set(),
            clickable: new Set()
        };

        this.model = null;
        this._worldPosition = new THREE.Vector3();
        
        if (game)
          this.init(game);
    }

    toSaveData() {
        let cellPos = this.getCellPosition();
        let data = {...this.data, ...{
            type: this.constructor.name,
            location: [cellPos.x, cellPos.y, this.getCellRotation()]
        }};
        return data;
    }

    init(game) {
    	this.game = game;
    	if (!this.game.gameObjects.includes(this))
    		this.game.gameObjects.push(this);

        let options = DEV ? {
        } : {
          transparent: true,
          opacity: 0
        }

        this._colliderMaterial = new THREE.MeshBasicMaterial(options);

        //this.model = this.createModel();
        this.loadModel(this.game.scene);

        if (DEV)
            console.log(`Init object '${this.constructor.name}'`);
        return this;
    }

    getConst(name, defaultValue=null) {
        return this.game.getConst(name, defaultValue);
    }

    getRotation() {
        return this.model ? this.model.rotation.clone() : null;
    }

    setRotation(x, y, z) {
        if (this.model)
            this.model.rotation.set(x, y, z);
    }

    getCellPosition() {
        let pos = this.model ? this.model.position : new THREE.Vector3();
        return new Vector2Int(Math.round(pos.x / GAME_SETTINGS.CELL_SIZE), Math.round(pos.z / GAME_SETTINGS.CELL_SIZE));
    }

    getCellRotation() {
        return this.model ? Math.round(this.model.rotation.y / PI_HALF) : 0;
    }

    getWorldPosition() {
        if (this.model) {
            let pos = new THREE.Vector3();
            this.model.getWorldPosition(pos);
            return pos;
        }
        return this._worldPosition.clone();
    }

    setWorldPosition(pos) {
        if (this.model) 
            this.model.setWorldPosition(pos);
        this._worldPosition = pos.clone();
    }

    getPosition() {
        return this.model ? this.model.position.clone() : null;
    }

    setPosition(x, y, z) {
        if (this.model)
            this.model.position.set(x, y, z);
    }

    getAlt() {
        return 0;
    }

    calcAbsPosition(sellX, sellY) {
        let center = GAME_SETTINGS.CELL_SIZE / 2;
        return new THREE.Vector3(sellX * GAME_SETTINGS.CELL_SIZE + center, this.getAlt(), sellY * GAME_SETTINGS.CELL_SIZE + center);
    }

    toCell(cellX, cellY, rotateY) {
        let absPos = this.calcAbsPosition(cellX, cellY);
        this.setPosition(absPos.x, absPos.y, absPos.z);
        this.setRotation(0, rotateY * PI_HALF, 0);
    }

    update(dt) {

    }

    /**
     * Обновляет внешний вид в зависимости от состояния
     */
    updateAppearance() {
        if (!this.model) return;
    }

    /**
     * Загружает модель в сцену
     */
    loadModel(scene) {
        if (this.model = this.createModel())
            scene.add(this.model);
        
        return this.model;
    }

    getHandle(userActionEvent='') {
        return this.model;
    }

    getUserActionEvent(index) {
        return this.data.user_action_event && this.data.user_action_event[index] ? this.data.user_action_event[index] : '';
    }

    /**
     * Регистрирует ресурс для последующего освобождения
     * @param {THREE.Geometry|THREE.BufferGeometry} geometry - геометрия для освобождения
     */
    _registerGeometry(geometry) {
        if (geometry && geometry.dispose) {
            this._resourcesToDispose.geometries.add(geometry);
        }
    }

    /**
     * Регистрирует материал для последующего освобождения
     * @param {THREE.Material} material - материал для освобождения
     */
    _registerMaterial(material) {
        if (material && material.dispose) {
            this._resourcesToDispose.materials.add(material);
            
            // Если у материала есть текстуры, регистрируем их
            if (material.map && material.map.dispose) {
                this._resourcesToDispose.textures.add(material.map);
            }
            if (material.alphaMap && material.alphaMap.dispose) {
                this._resourcesToDispose.textures.add(material.alphaMap);
            }
            if (material.envMap && material.envMap.dispose) {
                this._resourcesToDispose.textures.add(material.envMap);
            }
        }
    }

    /**
     * Регистрирует текстуру для последующего освобождения
     * @param {THREE.Texture} texture - текстура для освобождения
     */
    _registerTexture(texture) {
        if (texture && texture.dispose)
            this._resourcesToDispose.textures.add(texture);
    }

    _registerClickable(mesh, onClick = null) {
        if (mesh) {

            When(() => this.game && this.game.raycasterManager)
                .then(() => {
                    this.game.registerClickableObject(mesh, this, onClick);
                    this._resourcesToDispose.clickable.add(mesh);
                });
        }
    }

    /**
     * Рекурсивно собирает ресурсы из объекта и его детей
     * @param {THREE.Object3D} object - объект для сбора ресурсов
     */
    _collectResourcesFromObject(object) {
        if (!object) return;
        
        // Собираем геометрию
        if (object.geometry) {
            this._registerGeometry(object.geometry);
        }
        
        // Собираем материалы
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(m => this._registerMaterial(m));
            } else {
                this._registerMaterial(object.material);
            }
        }
        
        // Рекурсивно обходим детей
        if (object.children && object.children.length) {
            object.children.forEach(child => this._collectResourcesFromObject(child));
        }
    }

    createModel() {
    	return null;
    }

    dispose() {

        this.game.removeGameObject(this);
        if (this.model) {
            // Собираем все ресурсы из модели и её детей
            this._collectResourcesFromObject(this.model);
            
            if (this.model.parent)
                this.model.parent.remove(this.model);
            
            // Удаляем модель из сцены
            this.game.scene.remove(this.model);
            
            // Очищаем геометрии
            this._resourcesToDispose.geometries.forEach(geometry => {
                if (geometry && geometry.dispose) {
                    try {
                        geometry.dispose();
                    } catch (e) {
                        console.warn('Error disposing geometry:', e);
                    }

                    this.game.raycasterManager.removeClickableObject(geometry);
                }
            });
            
            // Очищаем материалы
            this._resourcesToDispose.materials.forEach(material => {
                if (material && material.dispose) {
                    try {
                        material.dispose();
                    } catch (e) {
                        console.warn('Error disposing material:', e);
                    }
                }
            });
            
            // Очищаем текстуры
            this._resourcesToDispose.textures.forEach(texture => {
                if (texture && texture.dispose) {
                    try {
                        texture.dispose();
                    } catch (e) {
                        console.warn('Error disposing texture:', e);
                    }
                }
            });
            
            // Очищаем кликабельные меши
            this._resourcesToDispose.clickable.forEach(mesh => {
                this.game.unregisterClickableObject(mesh);
            });
            
            // Очищаем модель (обнуляем ссылки для GC)
            if (this.model.geometry) {
                this.model.geometry = null;
            }
            if (this.model.material) {
                this.model.material = null;
            }
            this.model = null;
        }
        
        // Очищаем коллекции ресурсов
        this._resourcesToDispose.geometries.clear();
        this._resourcesToDispose.materials.clear();
        this._resourcesToDispose.textures.clear();
        eventBus.emit('disposed', this);
    }
  
    _createMaterial(color, options = {}, texturePath = null) {
        const materialOptions = {
            color: color,
            roughness: options.roughness !== undefined ? options.roughness : 0.4,
            metalness: options.metalness !== undefined ? options.metalness : 0.05,
            ...options
        };

        let material;

        if (texturePath && texturePath !== '') {
            // Создаем материал с текстурой
            material = new THREE.MeshStandardMaterial(materialOptions);

            // Загружаем текстуру асинхронно
            textureLoader.loadTexture(
            texturePath,
                (texture) => {
                    material.map = texture;
                    material.needsUpdate = true;
                    this._registerTexture(texture);
                },
                (error) => {
                    console.warn(`Не удалось загрузить текстуру ${texturePath}:`, error);
                },
                {
                    repeat: { x: 1, y: 1 }
                }
            );
        } else {
            // Создаем материал без текстуры
            material = new THREE.MeshStandardMaterial(materialOptions);
        }

        this._registerMaterial(material);
        return material;
    }

    createText(text, color = '#FFFFFF', font="Bold 60px Arial") {
      
      let plane = createText(text, color, font);
      this._registerGeometry(plane);
      return plane;
    }

    createColliderBox(length, height, width, debug=false) {
        const boxGeo = new THREE.BoxGeometry(length, height, width);
        const collider = new THREE.Mesh(boxGeo, this._colliderMaterial);
        if (!debug)
            collider.layers.set(1);
        
        this._registerGeometry(boxGeo);
        return collider;
    }

    createBox(length, height, width, material) {
        const boxGeo = new THREE.BoxGeometry(length, height, width);
        const boxPlate = new THREE.Mesh(boxGeo, material);
        boxPlate.castShadow = true;
        boxPlate.receiveShadow = true;
        this._registerGeometry(boxGeo);
        return boxPlate;
    }

    createSphere(radius, segments, material) {

        const geo = new THREE.SphereGeometry(radius, segments, segments);
        const sphere = new THREE.Mesh(geo, material);
        sphere.castShadow = true;
        this._registerGeometry(geo);
        return sphere;
    }

    createCylinder(radiusTop, radiusBottom, length, segments, material) {
        const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, segments);
        const mesh = new THREE.Mesh(geo, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this._registerGeometry(mesh);
        return mesh;
    }

    /*
     * Управляет свечением всех мешей в модели
     */
    setEmission(intensity, customIntensity = null, color = null) {
        if (!this.model) return;
        
        this._origEmission = this._origEmission || new Map();
        
        const isEnabled = intensity > 0 || intensity === true;
        const newIntensity = customIntensity !== null ? customIntensity : (isEnabled ? 0.5 : 0);
        const emissionColor = color?.clone ? color.clone() : new THREE.Color(0xffffff);
        
        this.model.traverse(child => {
            if (!child.isMesh) return;
            
            const materials = [child.material].flat();
            
            for (const mat of materials) {
                if (!mat || mat.emissiveIntensity === undefined || mat.emissive === undefined) continue;
                
                if (!isEnabled) {
                    const orig = this._origEmission.get(mat.uuid);
                    if (orig) {
                        mat.emissiveIntensity = orig.intensity;
                        mat.emissive = orig.color?.clone() || new THREE.Color(0x000000);
                        this._origEmission.delete(mat.uuid);
                    } else if (mat.emissiveIntensity !== 0) {
                        mat.emissiveIntensity = 0;
                        mat.emissive = new THREE.Color(0x000000);
                    }
                    mat.needsUpdate = true;
                } 
                else {
                    if (!this._origEmission.has(mat.uuid)) {
                        this._origEmission.set(mat.uuid, {
                            intensity: mat.emissiveIntensity,
                            color: mat.emissive?.clone() || new THREE.Color(0x000000)
                        });
                    }

                    mat.emissiveIntensity = newIntensity;
                    mat.emissive = emissionColor;
                    mat.needsUpdate = true;
                }
            }
        });
    }

    // Простые методы-обертки
    enableEmission(intensity = 0.5) { this.setEmission(true, intensity); }
    disableEmission() { this.setEmission(false); }
    resetEmission() { 
        this._origEmission && this.setEmission(false);
        this._origEmission = null;
    }

    blink(sec, periods = 1, color = new THREE.Color(0xFFFFFF)) {
        this.animateEmission(sec, p => (1 - Math.cos(p * Math.PI * 2 * periods)) / 2, color);
    }

    /*
        Плавно меняет свечение. 
        duration - длительность (сек)
        curve - функция интенсивности от 0 до 1
    */
    animateEmission(duration, curve, color = null, onComplete = null) {
        if (this._animFrame) 
            this.stopEmissionAnimation();
        
        const startTime = performance.now();
        
        const animate = () => {
            if (!this.model) return;
            
            let progress = Math.min(1, (performance.now() - startTime) / duration / 1000);
            const intensity = curve(progress);

            this.setEmission(true, intensity, color);
            
            if (progress < 1) {
                this._animFrame = requestAnimationFrame(animate);
            } else {
                this.stopEmissionAnimation();
                onComplete?.();
            }
        };
        
        this._animFrame = requestAnimationFrame(animate);
        return { stop: () => this.stopEmissionAnimation() };
    }

    stopEmissionAnimation() {
        this.setEmission(false);
        if (this._animFrame) cancelAnimationFrame(this._animFrame);
        this._animFrame = null;
    }

    // Утилиты
    fadeIn(duration = 0.5, intensity = 0.5, color = null) {
        return this.animateEmission(duration, p => p * intensity, color);
    }

    fadeOut(duration = 0.5) {
        return this.animateEmission(duration, p => (1 - p) * 0.5);
    }

    pulse(duration = 0, min = 0.2, max = 0.8, speed = 2) {
        return this.animateEmission(duration || 999999, p => {
            return min + (max - min) * (0.5 + 0.5 * Math.sin(p * speed * Math.PI * 2));
        });
    }

    deformModel(params = {}) {
        if (!this.model) return;
        
        if (this._deformAnimFrame) {
            cancelAnimationFrame(this._deformAnimFrame);
            this._deformAnimFrame = null;
        }
        
        const {
            duration = 0.5,
            type = 'scale',
            amount = 0.5,
            axis = 'y',
            customFn = null,
            onComplete = null,
            loop = false
        } = params;
        
        // Сохраняем исходный scale
        if (!this._originalScale) {
            this._originalScale = this.model.scale.clone();
        }
        
        const startTime = performance.now();
        
        const animate = () => {
            if (!this.model) {
                this.stopDeformation();
                return;
            }
            
            let progress = Math.min(1, (performance.now() - startTime) / duration / 1000);
            const t = customFn ? customFn(progress) : loop ? Math.sin(progress * Math.PI) : progress;
            const value = t * amount;
            
            switch (type) {
                case 'scale':
                    this._applyScale(value, axis);
                    break;
                case 'stretch':
                    this._applyStretch(value, axis);
                    break;
                case 'custom':
                    if (customFn) customFn(this.model, value, t);
                    break;
            }
            
            if (progress >= 1 && !loop) {
                this.resetDeformation();
                onComplete?.();
                this._deformAnimFrame = null;
                return;
            }
            
            this._deformAnimFrame = requestAnimationFrame(animate);
        };
        
        this._deformAnimFrame = requestAnimationFrame(animate);
        return { stop: () => this.stopDeformation() };
    }

    _applyScale(value, axis) {
        const orig = this._originalScale;
        
        if (axis === 'x') this.model.scale.x = orig.x + value;
        if (axis === 'y') this.model.scale.y = orig.y + value;
        if (axis === 'z') this.model.scale.z = orig.z + value;
        if (axis === 'xy') {
            this.model.scale.x = orig.x + value;
            this.model.scale.y = orig.y + value;
        }
        if (axis === 'xz') {
            this.model.scale.x = orig.x + value;
            this.model.scale.z = orig.z + value;
        }
        if (axis === 'yz') {
            this.model.scale.y = orig.y + value;
            this.model.scale.z = orig.z + value;
        }
        if (axis === 'xyz') {
            this.model.scale.x = orig.x + value;
            this.model.scale.y = orig.y + value;
            this.model.scale.z = orig.z + value;
        }
    }

    _applyStretch(value, axis) {
        const orig = this._originalScale;
        
        if (axis === 'x') {
            this.model.scale.x = orig.x + value;
            this.model.scale.y = orig.y - value * 0.5;
            this.model.scale.z = orig.z - value * 0.5;
        }
        if (axis === 'y') {
            this.model.scale.y = orig.y + value;
            this.model.scale.x = orig.x - value * 0.5;
            this.model.scale.z = orig.z - value * 0.5;
        }
        if (axis === 'z') {
            this.model.scale.z = orig.z + value;
            this.model.scale.x = orig.x - value * 0.5;
            this.model.scale.y = orig.y - value * 0.5;
        }
    }

    stopDeformation() {
        if (this._deformAnimFrame) {
            cancelAnimationFrame(this._deformAnimFrame);
            this._deformAnimFrame = null;
        }
    }

    resetDeformation() {
        if (this._originalScale) {
            this.model.scale.copy(this._originalScale);
        }
    }

    // Простые методы
    pulseScale(duration = 0.5, amount = 0.3, axis = 'xyz') {
        return this.deformModel({ duration, type: 'scale', amount, axis, loop: true });
    }

    pulseStretch(duration = 0.5, amount = 0.3, axis = 'y') {
        return this.deformModel({ duration, type: 'stretch', amount, axis, loop: true });
    }

    bounce(amount = 0.3, duration = 0.4, inverse = false, onComplete=null) {
        

        this.deformModel({ 
            duration: duration, 
            type: 'stretch', 
            amount :amount, 
            customFn: (p) => {
                return Math.sin(p * Math.PI * 5) * (inverse ? p : (1 - p));
            }, 
            axis: 'y',
            onComplete: onComplete
        });
    }
}