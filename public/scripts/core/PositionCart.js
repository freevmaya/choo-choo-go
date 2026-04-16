class PositionCart {
    constructor(cart, trackIndex = 0, pathIndex = 0, indexPosInChain = 0, forwardInTrack = true) {
        this.game = cart.game;
        this.cart = cart;
        this.setCurrentChain(trackIndex, pathIndex, indexPosInChain, forwardInTrack);
    }

    toSaveData() {
        return {
            pathIndex: this.pathIndex,
            indexPosInChain: this.indexPosInChain,
            forwardInTrack: this.forwardInTrack
        };
    }

    setCurrentChain(trackIndex, pathIndex, indexPosInChain, forwardInTrack = true) {
        
        this.pathIndex = pathIndex;
        this.indexPosInChain = indexPosInChain;
        this.forwardInTrack  = forwardInTrack;

        if (this.trackIndex != trackIndex) {
            if (this.currentTrack)
                this.currentTrack.runOut(this);

            this.trackIndex = trackIndex;
            this.currentTrack = this.game.items.get(this.trackIndex);
            this.currentTrack.runOver(this);
        }
    }

    clone() {
        return new PositionCart(this.cart, this.trackIndex, 
                this.pathIndex, this.indexPosInChain, 
                this.forwardInTrack);
    }

    copy(other) {
        return this.setCurrentChain(other.trackIndex, 
                other.pathIndex, other.indexPosInChain, 
                other.forwardInTrack);
    }

    getPathSector() {
        return this.currentTrack.getPathSector(this.pathIndex, this.forwardInTrack);
    }

    swithToNextTrack() {

        let nextIndex = this.currentTrack.getNearestTrackItem(this.pathIndex, this.forwardInTrack);

        if (nextIndex > -1) {
            let nextTrack = this.game.items.get(nextIndex);
            let paths = nextTrack.getConnectPaths(this.currentTrack.getCellPosition());
            if (paths.length > 0) {
                let index = 0;

                //Если входов несколько, переходим какой влючен
                if (paths.length > 1) {
                    index = paths.findIndex(path => path.pathIndex == nextTrack.getCurrentPath());
                    if (index == -1) index = 0;
                }

                let enterSector = nextTrack.getPath(index)[paths[index].forward ? 0 : 1];
                /*
                console.log(paths.map(path => path.pathIndex).join(', ') + 
                    ', EnterSector = ' + enterSector);*/

                let path = paths[index];

                let indexPosInChain = 2 - Math.abs(this.indexPosInChain);
                indexPosInChain = path.forward ? -indexPosInChain : indexPosInChain

                let edge = nextTrack.checkEdge(this.cart, indexPosInChain);
                if (edge)
                    return false;

                this.setCurrentChain(nextIndex, path.pathIndex, indexPosInChain, path.forward);
                return true;
            }
        } 

        //this.forwardInTrack     = !this.forwardInTrack;
        //this.indexPosInChain    = this.indexPosInChain < 0 ? -1 : 1;

        console.log('Reached edge railway');

        return false;
        //this.stop();
    }

    toggleDirect() {
        this.forwardInTrack     = !this.forwardInTrack;
        //this.indexPosInChain    = this.indexPosInChain < 0 ? -1 : 1;
    }

    applyVelocity(velocity, cart, dt = 1, chain = []) {

        this.indexPosInChain += velocity * dt * (this.forwardInTrack ? 1 : -1);

        let limits = [-1, 1];

        if (this.currentTrack && this.cart) {
            let edge = this.currentTrack.checkEdge(this.cart, this.indexPosInChain);
            if (edge) return edge;
        }

        if ((this.indexPosInChain > limits[1]) || (this.indexPosInChain < limits[0]))
            if (!this.swithToNextTrack())
                return {
                    edgeTrack: true
                };

        return this.checkCollistion(cart, chain);
    }

    calcLocation() {

        let pos = this.currentTrack.calcPathPoint(this.indexPosInChain, this.pathIndex);

        pos.angle = pos.rotation + Math.PI + (this.forwardInTrack ? 0 : Math.PI);

        return pos;
    }

    distanceBroken(other) {
        let pos1 = this.calcLocation();
        let pos2 = other.calcLocation();
        
        // Получаем направления моделей (нормализованные векторы)
        let d1 = this.cart.model.worldDirection();
        let d2 = other.cart.model.worldDirection();
        
        // Игнорируем разницу по высоте
        pos1.y = pos2.y = 0;
        d1.y = d2.y = 0;
        d1.normalize();
        d2.normalize();
        
        // Вектор между объектами
        const delta = pos2.clone().sub(pos1);
        
        // Проекции расстояния на направления
        const distAlongD1 = delta.dot(d1);      // Проекция на направление первого объекта
        const distAlongD2 = delta.dot(d2);      // Проекция на направление второго объекта
        
        // Ломаное расстояние: путь от pos1 по направлению d1, 
        // затем разворот и подход к pos2 по направлению d2
        let totalDistance = 0;
        
        if (distAlongD1 > 0 && distAlongD2 < 0) {
            // Объекты смотрят друг на друга
            totalDistance = Math.abs(distAlongD1) + Math.abs(distAlongD2);
        } else if (distAlongD1 > 0 && distAlongD2 > 0) {
            // Оба смотрят в одну сторону
            totalDistance = Math.abs(distAlongD1) + delta.length() + Math.abs(distAlongD2);
        } else if (distAlongD1 < 0 && distAlongD2 < 0) {
            // Оба смотрят от друг друга
            totalDistance = delta.length();
        } else {
            // Один смотрит на другой, другой отворачивается
            totalDistance = Math.abs(distAlongD1) + Math.abs(distAlongD2);
        }
        
        return totalDistance;
    }

    distance(other) {

        let pos1 = this.calcLocation();
        let pos2 = other.calcLocation();

        pos1.y = pos2.y = 0;

        return pos2.clone().sub(pos1);
    }

    penetration(other, checkDistance = true) {

        let minDistance = this.cart.sizeRadius() + other.cart.sizeRadius();
        let distance = this.distance(other);

        let depth = minDistance - distance.length();
        if (depth > 0) {

            //let bdist = this.distanceBroken(other) / 2;
            //depth = minDistance - bdist;

            if ((depth > 0) || !checkDistance) 
                return {
                    distance: distance,
                    depth: depth,
                    minDistance: minDistance
                }
        }

        return null;
    }

    checkCollistionWith(other, minDistance) {

        let pen = this.penetration(other);

        if (pen) {

            //let otherDirect = other.currentTrack.calcDirect(other.pathIndex);
            let otherDirect = other.cart.model.worldDirection();

            let dot = otherDirect.dot(pen.distance);
            
            tracer.log(`Dot ${dot} (${otherDirect.x}, ${otherDirect.z} / ${pen.distance.x}, ${pen.distance.z})`);
            return {
                depth: pen.depth,
                dot: dot
            }
        }

        return false;
    }

    checkCollistion(a_cart, chain = []) {
        let result = null;
        this.game.items.carts.forEach((cart)=>{
            if ((a_cart != cart) && 
                !chain.includes(cart)) {
                let collision = this.checkCollistionWith(cart.trackPos, a_cart.sizeRadius() + cart.sizeRadius());
                if (collision) {
                    result = {
                        cart: cart,
                        depth: collision.depth,
                        dot: collision.dot
                    };
                }
            }
        });
        return result;
    }
}