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
	  new SparkEffect({
	    x: e.clientX,
	    y: e.clientY,
	    count: 10,
	    colors: ['#F0F', '#F00', '#0F0', '#00F'],
	    sizes: [4, 8],
	    speeds: [0, 1],
	    gravity: 0.04,
	    baseRadius: 50,
	    lifetime: 1000,
	    className: 'star'
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