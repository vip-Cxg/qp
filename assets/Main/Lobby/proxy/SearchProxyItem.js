// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const { App } = require("../../../script/ui/hall/data/App");

cc.Class({
    extends: cc.Component,

    properties: {
        lblName: cc.Label,
        lblId: cc.Label,
        lblPhone: cc.Label,
        lblWallet: cc.Label,
        lblParent: cc.Label,
        lblStatus: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    renderUI(e) {
        this.lblName.string = utils.getStringByLength(e.name);
        this.lblId.string = '' + e.id;
        this.lblPhone.string = '' + e.phone;
        this.lblParent.string = '' + e.parent;
        this.lblWallet.string = '' + (e.wallet / 100) + '元';
        this.lblStatus.string = e.status == 'normal' ? '正常' : '封禁';
        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            // App.EventManager.dispatchEventWith(GameConfig.)
        },this)
    }

    // update (dt) {},
});
