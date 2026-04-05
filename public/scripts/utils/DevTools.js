class DevTools {
	constructor(game) {
		this.game = game;

		this.toolsPanel = $(`<div class="dev-block">
	        <div class="container">
	          <button id="newBtn">New</button>
	          <button id="clearBtn">Clear</button>
	          <button id="resetBtn">Reset</button>
	          <button id="saveBtn">Save</button>
	          <button id="gameModeBtn">Editor state</button>
	        </div>
	      </div>`);

		$('.game-ui').append(this.toolsPanel);

	    this.toolsPanel.find('#saveBtn').click(() => {
	      this.game.saveProject();
	    });

	    this.toolsPanel.find('#resetBtn').click(() => {
	      this.game.resetGame();
	    });

	    this.toolsPanel.find('#clearBtn').click(()=>{
	      this.game.clearItems();
	    });

	    this.toolsPanel.find('#newBtn').click(()=>{
	      this.game.createNewLevel();
	    })

	    this.ebtn = this.toolsPanel.find('#gameModeBtn');

	    this.ebtn.click(() => {
	      this.game.gameMode((this.game.gameModeIndex + 1) % this.game.gameModes.length);
	    });
	    this.ebtn.text(this.game.gameMode());

	   	//eventBus.on('gameObject:click', this._handleObjectClick = this.handleObjectClick.bind(this));
	   	eventBus.on('game-mode-change', this._onEditorState = ()=>{
	      this.ebtn.text(this.game.gameMode());
	   	});
    	
    	/*
	    this.rgbControl = new RGBColorControl({
	      position: { top: 80, right: 10 },
	      initialColor: { r: 100, g: 200, b: 100 }
	    });

	    eventBus.on('rgb-color-change', (color) => {
	      console.log('Цвет изменен:', color.hex, color.rgb);
	      if (this.ground) {
	      }
	    });*/

	    new Library($('#game-container'), $('#canvas-container'), [
	      {
	        type: StraightTrack
	      },{
	        type: CurvedTrack
	      },{
	        type: ForkTrack
	      },{
	        type: PointTrack
	      },{
	        type: FinishTrack
	      },{
	        type: Train
	      },{
	        type: Wagon
	      },{
	        type: PassengerWagon
	      },{
	        type: SimpleTree
	      },{
	        type: DeciduousTree
	      },{
	        type: Snow
	      },{
	        type: RailwayPlatform
	      }
	    ]);
	}

	handleObjectClick(data) {
	    
	    if (data.intersects && data.intersects[0]) {
	      	let hit = data.intersects[0];

	      	const object = hit.object;
   			let ga = object.userData?.gameObject;

   			if (ga) {
   			}
   		}
	}

	dispose() {
	   	//eventBus.off('gameObject:click', this._handleObjectClick);
	   	eventBus.off('game-mode-change', this._onEditorState);
	}
}