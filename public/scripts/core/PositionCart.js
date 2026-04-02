class PositionCart {
    constructor(game, trackIndex = 0, pathIndex = 0, indexPosInChain = 0, forwardInTrack = true) {
        this.game = game;
        this.setCurrentChain(trackIndex, pathIndex, indexPosInChain, forwardInTrack);
    }

    toSaveData() {
        return {
            pathIndex: this.pathIndex,
            indexPosInChain: this.indexPosInChain,
            forwardInTrack: this.forwardInTrack
        }
    }

    setCurrentChain(trackIndex, pathIndex, indexPosInChain, forwardInTrack = true) {
        this.trackIndex = trackIndex;
        this.pathIndex = pathIndex;
        this.indexPosInChain = indexPosInChain;
        this.forwardInTrack  = forwardInTrack;
        this.currentTrack = this.game.items.get(this.trackIndex);
        this.currentTrack.runOver(this);
    }

    clone() {
        return new PositionCart(this.game, this.trackIndex, 
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
                console.log(paths.map(path => path.pathIndex).join(', ') + 
                    ', EnterSector = ' + enterSector);

                let path = paths[index];

                let indexPosInChain = 2 - Math.abs(this.indexPosInChain);
                this.setCurrentChain(nextIndex, path.pathIndex, 
                    path.forward ? -indexPosInChain : indexPosInChain, path.forward);
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

        if ((this.indexPosInChain > 1) || (this.indexPosInChain < -1))
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

    checkCollistionWith(other, minDistance) {
        let depth = 0;
        let pos1 = this.calcLocation();
        let pos2 = other.calcLocation();

        pos1.y = pos2.y = 0;

        let direction = pos2.clone().sub(pos1);
        let len = direction.length();

        if (len < minDistance) {

            depth = minDistance - len;

            let trackDirect = other.currentTrack.calcDirect(other.pathIndex);

            let dot = trackDirect.dot(direction);
            
            console.log(`Dot ${dot} (${trackDirect.x}, ${trackDirect.z} / ${direction.x}, ${direction.z})`);
            return {
                depth: depth,
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