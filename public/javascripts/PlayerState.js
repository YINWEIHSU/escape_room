class PlayerState {
  constructor() {
    this.storyFlags = {
      "firstOpened": false,
      "secondOpened": false,
      "thirdOpened": false,
      "fourthOpened": false
    }
  }

}
window.playerState = new PlayerState()