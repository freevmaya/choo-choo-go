class Queue extends BaseStateMashine {
	constructor(game, peopleSpace) {
		super(game);
		this.peopleSpace = peopleSpace;
	}

	checkNewPos(newPos, direct, object) {

		direct = this.getWorldPosition().sub(object.getWorldPosition());
		direct.y = 0;

		direct = object.model.worldToLocalDirection(direct);
		if (direct.length() < 0.1) {

			direct.set(0, 0, 0);

			setTimeout(()=>{
				this.peopleSpace.disposePeople(object);				
			}, 0);

			if (this.peopleSpace.getPeopleCount() == 0)
				this.peopleSpace.finishQueue(this);
		}

		return {
			newPos: newPos,
			direct: direct
		}
	}
}