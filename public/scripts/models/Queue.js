class Queue extends BaseGameObject {
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
				if (this.peopleSpace.getPeopleCount() == 0)
					this.peopleSpace.finishQueue(this);			
			}, 0);
		}

		return {
			newPos: newPos,
			direct: direct
		}
	}
}