// scripts/UI/ToastMessage.js

class ToastMessage extends Swipeable {
  constructor(game) {
    const element = $(
      `<div class="toast-message border-block hide">
        <div class="frame padding">
          <div class="head">
            <div class="title"></div>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
          <div class="content"></div>
          <div class="footer"></div>
        </div>
      </div>`
    );
    
    game.game_container.append(element);
    
    super(element, {
      threshold: 50,
      direction: 'right',
      onComplete: () => this.hide()
    });
    
    this.game = game;
    this._onClose = null;
    
    this.element.find('.btn-close').click(() => this.hide());
  }
  
  _setVisible(visible) {
    this.element.removeClass(['show', 'hide']);
    this.element.addClass(visible ? 'show' : 'hide');
  }
  
  show(text, title = "", onClose = null, buttons = []) {
    this.element.find('.content').html(text);
    this._setVisible(true);
    
    if (title) {
      this.element.find('.title').text(title);
    }

    let footer = this.element.find('.footer');
    footer.empty();

    if (buttons) {
      buttons.forEach((b)=>{
        let btn = $(`<button class="btn">${b.caption}</button>`);
        btn.click(b.callback);
        footer.append(btn);
      });
    }
    
    this._onClose = onClose;
    this.reset();
    
    return {
      dispose: () => {
        this._onClose = null;
        this._setVisible(false);
      }
    };
  }
  
  hide() {
    this._setVisible(false);
    if (this._onClose) {
      this._onClose();
      this._onClose = null;
    }
  }
  
  dispose() {
    this.destroy();
    this.element.remove();
  }
}

registerClass(ToastMessage);