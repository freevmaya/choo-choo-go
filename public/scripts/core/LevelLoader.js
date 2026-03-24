class LevelLoader {
	constructor(game) {
		this.game = game;
	}

	Load(data) {

		let items = [];
	    data.track.forEach((trackItem)=>{
			items.push((new trackItem.type(items, trackItem.location, trackItem.location[2])).init(this.game));
	    });

	    return items;
	}
}