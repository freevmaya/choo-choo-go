class LevelLoader {
	constructor(game) {
		this.game = game;
	}

	Load(data) {
	    data.trails.forEach((trail)=>{
	      (new trail.type(trail.location, trail.location[2])).init(this.game.scene);
	    });
	}
}