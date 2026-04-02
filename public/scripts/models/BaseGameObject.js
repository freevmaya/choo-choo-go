class BaseGameObject {
    constructor(game) {
        
        // Для хранения ресурсов, которые нужно освободить
        this._resourcesToDispose = {
            geometries: new Set(),
            materials: new Set(),
            textures: new Set(),
            clickable: new Set()
        };
        
        if (game)
          this.init(game);
    }

    toSaveData() {
        let cellPos = this.getCellPosition();
        return {
            type: this.constructor.name,
            location: [cellPos.x, cellPos.y, this.getCellRotation()]
        }
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

    _registerClickable(mesh) {
        if (mesh) {

            When(() => this.game && this.game.raycasterManager)
                .then(() => {
                    this.game.registerClickableObject(mesh, this);
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
    }

    createText(text, color = '#FFFFFF', font="Bold 60px Arial") {
      // Создаем canvas элемент
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 512;

      // Рисуем текст на canvas
      context.font = font;
      context.fillStyle = color;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      // Создаем текстуру из canvas
      const texture = new THREE.CanvasTexture(canvas);

      // Создаем материал с текстурой
      const text_material = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
      });

      // Создаем плоскость и накладываем текст
      const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(3, 3),
          text_material
      );
      //this.game.scene.add(plane);
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
}