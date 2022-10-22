class MessageBox {
  constructor({ text, img, onComplete, width }) {
    this.text = text
    this.img = img
    this.onComplete = onComplete
    this.element = null
    this.width = width || 300
  }

  createElement() {
    this.element = document.createElement('div')
    this.element.classList.add('MessageBox')

    this.element.innerHTML = `
      <p class="TextMessage_p">${this.text}</p>  
      <img class="MessageBox_img" src=${this.img} width="${this.width}" alt="一張圖片">
      <button class="InputTextMessage_button cancel">Close</button>
    `

    this.element.querySelector('.cancel').addEventListener('click', () => {
      this.done()
    })
    this.actionListener = new KeyPressListener('Enter', () => {
      this.done()
    })
  }
  done() {
    this.element.remove()
    this.actionListener.unbind()
    this.onComplete()
  }
  init(container) {
    this.createElement()
    container.appendChild(this.element)
  }
}