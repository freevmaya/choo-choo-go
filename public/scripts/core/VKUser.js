class VKUser {
	constructor(game) {
		this.game = game;

		this.game.accountAddScore = (requireScore) => {
          return new Promise((resolve, reject) => {
          	let countStr = strEnum(requireScore);
            this.game.showTip(`Требуется добавить для<br>покупки ${countStr}.<br>Выберите способ.`, 0, null, ()=>{
              //this.userScore(this.userScore() + requireScore);
              resolve(false);
            }, [
              {
                caption: "Реклама",
                callback: ()=>{

                }
              },
              {
                caption: "Голоса",
                callback: ()=>{

                }
              }
            ])
          });
        }
	}
}