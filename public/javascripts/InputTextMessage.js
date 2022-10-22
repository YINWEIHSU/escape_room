class InputTextMessage {
  constructor({ text, answer, answerImage, onComplete }) {
    this.text = text
    this.answer = answer
    this.onComplete = onComplete
    this.element = null
    this.answerImage = answerImage
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('TextMessage')

    this.element.innerHTML = `
    <form class="form-inline">
    <label class="InputTextMessage_p" for="answer">${this.text}</label>
    <input class="TextInput" name="answer"></input>
    <button class="InputTextMessage_button cancel">Cancel</button>
    <button class="InputTextMessage_button send">Send</button>
    </form>

    `
    this.element.querySelector('.cancel').addEventListener('click', (e) => {
      e.preventDefault()
      this.done()
    })
    this.element.querySelector('.send').addEventListener('click', (e) => {
      let value = this.element.querySelector('.TextInput').value
      value = value.toUpperCase()
      console.log(value)
      e.preventDefault()
      if (value === this.answer) {
        // const box = new MessageBox({
        //   text: '答對了',
        //   img: this.answerImage,
        //   onComplete: () => {return}
        // })
        // box.init(document.querySelector('.game-container'))

        this.done(true)
      } else {
        const message = new TextMessage({
          text: '好像不太對',
          onComplete: () => {return}
        })
        message.init(document.querySelector('.game-container'))
        this.done(false)
      }
    })
    this.actionListener = new KeyPressListener('Enter', () => {
      this.done()
    })
  }
  done(solved) {
      this.element.remove()
      this.actionListener.unbind()
      this.onComplete(solved)
  }
  init(container) {
    this.createElement()
    container.appendChild(this.element)
  }
}