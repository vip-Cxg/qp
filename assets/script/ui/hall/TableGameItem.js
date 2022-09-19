// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const Cache = require("../../../Main/Script/Cache");
const { App } = require("./data/App");


cc.Class({
    extends: cc.Component,

    properties: {
        chooseNode: cc.Node,
        unChooseNode: cc.Node,
        gameType: ''
    },

    // LIFE-CYCLE CALLBACKS:


    addEvents() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickBtn, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.GAME_TYPE_CHANGE, this.changeUI, this)
    },
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.GAME_TYPE_CHANGE, this.changeUI, this)

    },
    initData(gametype) {
        this.addEvents();
        this.gameType = gametype;
        this.chooseNode.getChildByName('name').getComponent(cc.Label).string = GameConfig.GameName[gametype];
        this.unChooseNode.getChildByName('name').getComponent(cc.Label).string = GameConfig.GameName[gametype];

    },
    onClickBtn() {
        
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.GAME_TYPE_CHANGE, this.gameType);

    },
    changeUI(e) {
        this.chooseNode.active = e.data == this.gameType;
    },
    onDestroy() {
        this.removeEvents();
    }
    // update (dt) {},
});
