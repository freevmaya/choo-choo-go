// scripts/models/PassengerWagon.js

class PassengerWagon extends Wagon {

    size() {
        let size = super.size();
        size.wallHeight = 0.4;
        size.wallWidth = 0.05;
        size.windowHeight = 0.4;
        size.roofHeight = 0.15;
        return size;
    }
    
    createModel() {
        let group = super.createModel();
        let size = this.size();
        let l2 = this.baseLength / 2;
        let windowY = size.wallY + (size.wallHeight + size.windowHeight) / 2;
        
        this.roofMaterial = new THREE.MeshStandardMaterial({ 
            color: this.roofColor, 
            roughness: 0.8, 
            metalness: 0.05 
        });
        
        this.windowFrameMaterial = new THREE.MeshStandardMaterial({ 
            color: this.windowFrameColor, 
            roughness: 0.6, 
            metalness: 0.1 
        });
        
        // Прозрачный материал для стекол
        this.glassMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x88CCFF, 
            roughness: 0.2, 
            metalness: 0.9,
            transparent: true,
            opacity: 0.4,
            emissive: 0x2266AA,
            emissiveIntensity: 0.15
        });
        this._registerMaterial(this.roofMaterial);
        this._registerMaterial(this.windowFrameMaterial);
        this._registerMaterial(this.glassMaterial);

        const leftWall = this.createBox(size.wallWidth, size.windowHeight, size.wagonWidth + size.wallWidth, this.wallMaterial);
        leftWall.position.set(-l2, windowY, 0);
        
        // Правая стена
        const rightWall = this.createBox(size.wallWidth, size.windowHeight, size.wagonWidth + size.wallWidth, this.wallMaterial);
        rightWall.position.set(l2, windowY, 0);

        let windowCount = 3;

        const wstep = this.baseLength / windowCount;

        for (let i=0; i<windowCount; i++) {

            const lstay = this.createBox(size.wallWidth, size.windowHeight, size.wallWidth, this.wallMaterial);
            lstay.position.set(i * wstep - l2, windowY, size.wagonWidth / 2);

            const rstay = this.createBox(size.wallWidth, size.windowHeight, size.wallWidth, this.wallMaterial);
            rstay.position.set(i * wstep - l2, windowY, -size.wagonWidth / 2);

            const lwindow = this.createBox(wstep - size.wallWidth, size.windowHeight, size.wallWidth, this.glassMaterial);
            lwindow.position.set(i * wstep - l2 + wstep / 2, windowY, size.wagonWidth / 2);

            const rwindow = this.createBox(wstep - size.wallWidth, size.windowHeight, size.wallWidth, this.glassMaterial);
            rwindow.position.set(i * wstep - l2 + wstep / 2, windowY, -size.wagonWidth / 2);

            const roof = this.createBox(this.baseLength + size.wallWidth * 2, size.wallWidth, size.wagonWidth + size.wallWidth * 2, this.roofMaterial);
            roof.position.set(0, windowY + size.windowHeight / 2 + size.wallWidth, 0);
        }
        
        return group;
    }
}

registerClass(PassengerWagon);