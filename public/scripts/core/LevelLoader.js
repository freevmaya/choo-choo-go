class LevelLoader {
	constructor(game) {
		this.game = game;
	}

	Load(data) {

		let items = new Cells();
	    data.track.forEach((trackItem)=>{
			items.add(trackItem);
	    });

	    return items;
	}
}