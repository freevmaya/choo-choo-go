class FinishTrack extends PointTrack {

    getTitle() {
        return 'finish';
    }

    checkFinished() {
        let cart = this.currenCart();
        if (cart) {
            return cart.headTrain() != null
        }

        return false;
    }

    runOver(positionCart) {
        super.runOver(positionCart);

        if (!this.finished && this.checkFinished()) {

            this.finished = true;

            this.currenCart().headTrain().State('braking');

            let pos = this.getPosition();
            this.game.showMagicSwirl(pos.x, pos.y, pos.z);

            setTimeout(()=>{
                this.game.gameState.set(GAME_STATE.VICTORY);
            }, 2000);
        }
    }
}

registerClass(FinishTrack);