class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    // this.upperImage = new Image();
    // this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false
  }
  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0)
  }

  // drawUpperImage(ctx) {
  //   ctx.drawImage(this.upperImage, 0, 0)
  // }

  checkForActionCutscene(event, rect, bodyRect) {
    const match = Object.values(this.gameObjects).find(object => {
      const x = event.layerX + 1
      const y = event.layerY - 95
      const xMaxIndex = object.x.length - 1
      const yMaxIndex = object.y.length - 1
      // console.log(rect.left, rect.top, bodyRect.left, bodyRect.top, event.layerX, event.layerY)
      if (x > object.x[0] && x < object.x[xMaxIndex] + 32 && y > object.y[0] && y < object.y[yMaxIndex] + 32) {
        return true
      }

    })
    if (!this.isCutscenePlaying && match && match.touching.length) {
      const relevantScenario = match.touching.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf]
        })
      })
      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true

    // Start a loop async events
    // await each one
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      })
      const result = await eventHandler.init()
      if (result === "UNSOLVED") {
        break
      }
    }

    this.isCutscenePlaying = false
  }
}

window.OverworldMaps = {
  firstScene: {
    id: "firstScene",
    lowerSrc: "/images/maps/firstScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'fourthScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'secondScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(10)],
        y: [utils.withGrid(6), utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            events: [
              { type: 'messageBox', text: "是一組數字鎖電子鎖，為什麼會是鎖裡面的人", img: "/images/maps/lockAll.png", width: 200 },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1730', answerImage: "/images/maps/lockAll.png" }
            ]
          }
        ]
      }),
      desktop: new GameObject({
        x: [utils.withGrid(4), utils.withGrid(5)],
        y: [utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["firstOpened"],
            events: [
              { type: 'messageBox', text: "真是特別的桌布", img: "/images/maps/desktop(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "裡面應該有什麼秘密，該怎麼登入呢？我記得密碼好像都是英文", img: "/images/maps/desktop.png" },
              { type: 'inputTextMessage', text: '請輸入登入密碼:', answer: 'BLUE', answerImage: "/images/maps/desktop(open).png" },
              { type: "textMessage", text: "(登入音效)" },
              { type: "addStoryFlag", flag: "firstOpened" },
              { type: 'messageBox', text: "看起來沒什麼東西，但桌布好特別啊", img: "/images/maps/desktop(open).png" }
            ]
          }
        ]
      }),
      keyboard: new GameObject({
        x: [utils.withGrid(4), utils.withGrid(5)],
        y: [utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["firstOpened"],
            events: [
              { type: 'messageBox', text: "真是特別的桌布", img: "/images/maps/desktop(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "是筆電的鍵盤", img: "/images/maps/keyboard.png" }
            ]
          }
        ]
      }),
      draw: new GameObject({
        x: [utils.withGrid(16), utils.withGrid(18)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["finalOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "一幅畫，看起來很名貴", img: "/images/maps/draw.png" }
            ]
          }
        ]
      }),
    }
  },
  secondScene: {
    id: "secondScene",
    lowerSrc: "/images/maps/secondScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'firstScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'thirdScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(16)],
        y: [utils.withGrid(3)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/treasureBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "好復古的藏寶箱，不知道裡面有什麼？", img: "/images/maps/treasureBox(close).png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: 'WEI', answerImage: "/images/maps/lockAll.png" },
              { type: "textMessage", text: "喀擦！" },
              { type: "addStoryFlag", flag: "secondOpened" },
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/treasureBox(open).png" }
            ]
          }
        ]
      }),
      refrig1: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(17)],
        y: [utils.withGrid(4), utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "[冰箱上層]沒什麼東西，肚子好餓", img: "/images/maps/refrig-up.png" }
            ]
          }
        ]
      }),
      refrig2: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(17)],
        y: [utils.withGrid(7), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "[冰箱下層]喝罐啤酒感覺也不錯", img: "/images/maps/refrig-down.png" }
            ]
          }
        ]
      }),
      dinner: new GameObject({
        x: [utils.withGrid(5), utils.withGrid(12)],
        y: [utils.withGrid(5), utils.withGrid(6)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "越看越餓啊..." }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "看起來是準備到一半的食材，不知道會做成什麼料理" }
            ]
          }
        ]
      }),
      cabinet1: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(13)],
        y: [utils.withGrid(0), utils.withGrid(3)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "還是別開了" }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "打不開，但裡面應該也沒什麼東西" }
            ]
          }
        ]
      }),
      cabinet2: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(13)],
        y: [utils.withGrid(7), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "還是別開了" }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "打不開，但裡面應該也沒什麼東西" }
            ]
          }
        ]
      }),
      box: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(15)],
        y: [utils.withGrid(2), utils.withGrid(3)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["secondOpened"],
            events: [
              { type: "textMessage", text: "只是普通的箱子" }
            ]
          },
          {
            events: [
              { type: "textMessage", text: "只是普通的箱子" }
            ]
          }
        ]
      })
      
    }
  },
  thirdScene: {
    id: "thirdScene",
    lowerSrc: "/images/maps/thirdScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'secondScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'fourthScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(13), utils.withGrid(18)],
        y: [utils.withGrid(2), utils.withGrid(4)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: [
              { type: 'messageBox', text: "是一顆扭蛋", img: "/images/maps/map(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "這地圖顯示怎麼感覺怪怪的，是壞掉了嗎？", img: "/images/maps/map.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '0692', answerImage: "/images/maps/map.png" },
              { type: "textMessage", text: "(馬達運轉聲)" },
              { type: "addStoryFlag", flag: "thirdOpened" },
              { type: 'messageBox', text: "是一顆扭蛋", img: "/images/maps/map(open).png" }
            ]
          }
        ]
      }),
      photo1: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(2)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "是一張普通的大合照，裡面的人看起來好年輕", img: "/images/maps/photo1.png", width: 200 }
            ]
          }
        ]
      }),
      photo2: new GameObject({
        x: [utils.withGrid(4), utils.withGrid(7)],
        y: [utils.withGrid(4), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "看起來是一群朋友們出去玩的照片", img: "/images/maps/photo2.png", width: 300 }
            ]
          }
        ]
      }),
      photo3: new GameObject({
        x: [utils.withGrid(9), utils.withGrid(10)],
        y: [utils.withGrid(3), utils.withGrid(5)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "這是水族館嗎？", img: "/images/maps/photo3.png", width: 120 }
            ]
          }
        ]
      }),
      photo4: new GameObject({
        x: [utils.withGrid(1), utils.withGrid(7)],
        y: [utils.withGrid(1), utils.withGrid(2)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["thirdOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "一張普悠瑪的照片，主人是鐵道迷嗎？", img: "/images/maps/photo4.png", width: 310 }
            ]
          }
        ]
      })
    }
  },
  fourthScene: {
    id: "fourthScene",
    lowerSrc: "/images/maps/fourthScene.png",
    gameObjects: {
      leftButton: new GameObject({
        x: [utils.withGrid(0)],
        y: [utils.withGrid(4)],
        src: "/images/characters/leftButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'thirdScene' }] }
        ]
      }),
      rightButton: new GameObject({
        x: [utils.withGrid(19)],
        y: [utils.withGrid(4)],
        src: "/images/characters/rightButton.png",
        touching: [
          { events: [{ type: 'changeMap', map: 'firstScene' }] }
        ]
      }),
      lock1: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(15)],
        y: [utils.withGrid(1), utils.withGrid(2)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: [
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          },
          {
            events: [
              { type: 'messageBox', text: "是個好明顯的保險箱", img: "/images/maps/lockBox.png" },
              { type: 'inputTextMessage', text: '請輸入密碼:', answer: '1203', answerImage: "/images/maps/lockAll.png" },
              { type: "textMessage", text: "喀擦！" },
              { type: "addStoryFlag", flag: "fourthOpened" },
              { type: 'messageBox', text: "有顆扭蛋裡面有張紙條", img: "/images/maps/lockBox(open).png" }
            ]
          }
        ]
      }),
      tv1: new GameObject({
        x: [utils.withGrid(7), utils.withGrid(11)],
        y: [utils.withGrid(4), utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: []
          },
          {
            events: [
              { type: 'messageBox', text: "怎麼會有彩色的亂碼，電視壞掉了嗎，我還寧願看黑白的", img: "/images/maps/television.png" }
            ]
          }
        ]
      }),
      switch: new GameObject({
        x: [utils.withGrid(12), utils.withGrid(13)],
        y: [utils.withGrid(7)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: []
          },
          {
            events: [
              { type: 'textMessage', text: "現在不是打電動的時候！"}
            ]
          }
        ]
      }),
      recycle: new GameObject({
        x: [utils.withGrid(14), utils.withGrid(15)],
        y: [utils.withGrid(8), utils.withGrid(9)],
        src: "/images/maps/empty.png",
        touching: [
          {
            required: ["fourthOpened"],
            events: []
          },
          {
            events: [
              { type: 'textMessage', text: "一堆資源回收的東西" }
            ]
          }
        ]
      })

    }
  }
}