function VictoryTest() {

	setTimeout(()=>{
		window.game.gameState.start();
	}, 1000);

	setTimeout(()=>{
		window.game.currentScore = 1000;
		window.game.gameState.victory();
	}, 3000);
}

function sparkTest() {
	$(document).on('click', (e) => {

		const rect = $('body')[0].getBoundingClientRect();
		new SparkEffect({
			/*
			x: e.clientX,
			y: e.clientY,
			*/
			x: rect.width / 2,
			y: rect.height / 2,
			count: 5,
			colors: ['#F8F', '#F66', '#6F6', '#66F'],
			sizes: [5, 50],
			speeds: [0, 0.2],
			velocity: [0, 0],
			gravity: 0,
			baseRadius: 100,
			lifetime: 4000,
			loop: true,
			shape: 'star',
			emissionTime: 3000,
			/*className: 'star',*/
			emissionType: 'random',
			rectWidth : rect.width,
			rectHeight: rect.height,
			rotation: {
		        enabled: true,
		        speed: [0, 60],
		        direction: 'random',
		        easing: false
			}
		});
	});
}

function NextLevelSupport() {
	$(document).on('keydown', (event) => {
	  if (event.key === 'n' || event.key === 'N') {
	    
	    window.game.NextLevel();
	  }
	});
}

function DevKeySupport() {
	$(document).on('keydown', (event) => {
	  if (event.key === 'f' || event.key === 'F') {
	  	
	    window.game.gameState.set(GAME_STATE.GAME_OVER);

	  } else if (event.key === 'v' || event.key === 'V') {
	  	
	    window.game.gameState.set(GAME_STATE.VICTORY);

	  } else if (event.key === 't' || event.key === 'T') {
	  	
	    window.game.showVictoryModal(0, 100, 'Warrior');

	  } else if (event.key === 'c' || event.key === 'C') {
	    
	    window.game.clearUserData();

	  } else if (MathUtils.isNumeric(event.key)) {

	  	let keys = Object.keys(window.game.levels);
	  	let level = (event.key - 1) % keys.length;
	  	window.game.GoToLevel(keys[level]);

	  }
	});
}

//VictoryTest();
//sparkTest();

//MoreKiller();

NextLevelSupport();
DevKeySupport();
/*
setTimeout(()=>{
	eventBus.on('gameObject:click', (e)=>{
		window.game.achiveGa(e.intersects[0].object.userData.gameObject);
	});
}, 500)
*/