class BaseGameObject {
    constructor() {
        
        // Для хранения ресурсов, которые нужно освободить
        this._resourcesToDispose = {
            geometries: new Set(),
            materials: new Set(),
            textures: new Set()
        };
    }

    init(game) {
    	this.game = game;
    	if (!this.game.gameObjects.includes(this))
    		this.game.gameObjects.push(this);

        this.model = this.createModel();
        this.loadModel(this.game.scene);
        return this;
    }

    getRotation() {
        return this.model ? this.model.rotation.clone() : null;
    }

    setRotation(x, y, z) {
        if (this.model)
            this.model.rotation.set(x, y, z);
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
        this.model = this.createModel();
        scene.add(this.model);
        return this.model;
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
        if (this.model) {
            // Собираем все ресурсы из модели и её детей
            this._collectResourcesFromObject(this.model);
            
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
    }
}