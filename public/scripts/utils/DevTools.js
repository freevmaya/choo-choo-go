class DevTools {
	constructor(game) {
		this.game = game;

		this.toolsPanel = $(`<div class="dev-block">
	        <div class="container">
	          <button id="newBtn">New</button>
	          <button id="clearBtn">Clear</button>
	          <button id="resetBtn">Reset</button>
	          <button id="saveBtn">Save</button>
	          <button id="editorStateBtn">Editor state</button>
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

	    this.ebtn = this.toolsPanel.find('#editorStateBtn');

	    this.ebtn.click(() => {
	      this.game.setEditorState((this.game.editorStateIndex + 1) % this.game.editorStates.length);
	    });
	    this.ebtn.text(this.game.editorState());

	   	//eventBus.on('gameObject:click', this._handleObjectClick = this.handleObjectClick.bind(this));
	   	eventBus.on('editor-state-change', this._onEditorState = ()=>{
	      this.ebtn.text(this.game.editorState());
	   	});
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
	   	eventBus.off('editor-state-change', this._onEditorState);
	}
}