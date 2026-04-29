// scripts/UI/ToastMessage.js

class ToastMessage extends Swipeable {
  constructor(game) {
    const element = $(
      `<div class="toast-message border-block hide">
        <div class="actor-icon">
          <div class="frame padding actor-1">
          </div>
        </div>
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

    this.visible = false;
    this.stack = [];
  }
  
  _setVisible(visible) {
    this.setOverModal(this.game.currentModal !== null);
    this.element.removeClass(['show', 'hide']);
    this.element.addClass(visible ? 'show' : 'hide');
    this.visible = visible;
  }

  setOverModal(value) {
    this.element.toggleClass('over-modal', value);
  }
  
  _show(text, title = "", onClose = null, buttons = []) {
    this.element.find('.content').html(text);
    this._setVisible(true);
    
    let titleCtrl = this.element.find('.title');
    titleCtrl.empty();
    if (title)
      titleCtrl.html(title);

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
  }
  
  show(text, title = "", onClose = null, buttons = []) {
    if (this.visible) {
      this.hide();
      this.stack.push({
        text,
        title,
        onClose,
        buttons
      });
      setTimeout(()=>{
        if (this.stack.length > 0) {
          let first = this.stack.shift();
          this.show(first.text, first.title, first.onClose, first.buttons);
        }
      }, 600);
    } else this._show(text, title, onClose, buttons);
  }
  
  hide() {
    this._setVisible(false);
    if (this._onClose) {
      this._onClose();
      this._onClose = null;
    }
    eventBus.emit('hide-toast');
  }
  
  dispose() {
    this.destroy();
    this.element.remove();
  }
}

registerClass(ToastMessage);