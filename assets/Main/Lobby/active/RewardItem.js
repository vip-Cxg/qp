// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const { App } = require("../../../script/ui/hall/data/App");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");

cc.Class({
    extends: cc.Component,

    properties: {
        sprReward: cc.Sprite,
        sfReward1: cc.SpriteFrame,
        sfReward2: cc.SpriteFrame,
        processIcon: cc.Sprite,
        processYellow: cc.SpriteFrame,
        processBlue: cc.SpriteFrame,
        lblReward: cc.Label,
        lblActivity: cc.Label,
        rewardLevel: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    renderUI(data, level, process) {
        this.rewardLevel = level;
        this.lblReward.string = data.reward / 100 + "元";
        this.lblActivity.string = data.activity + "";
        this.processIcon.spriteFrame = process < data.activity ? this.processBlue : this.processYellow;

        this.sprReward.spriteFrame = data.status ? this.sfReward2 : this.sfReward1;
        if (process >= data.activity && !data.status){
            let animTime = 0.05;
            let ap = cc.rotateBy(animTime, 10);
            let bp = cc.rotateBy(animTime * 2, -20);
            let cp = cc.rotateBy(animTime * 2, 20);
            let dp = cc.rotateBy(animTime, -10);
            let ep = cc.sequence(bp, cp).repeat(3);
            let fp = cc.sequence(ap, ep, dp, cc.callFunc(() => {
                this.sprReward.node.angle=0;
            }), cc.delayTime(1)).repeatForever();
            this.sprReward.node.runAction(fp);
        }


            this.node.on(cc.Node.EventType.TOUCH_END, this.onGetReward, this);
    },
    onGetReward() {
        
        Connector.request(GameConfig.ServerEventName.TaskReceive, { level: this.rewardLevel }, (res) => {
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_ACTIVE_PROCESS);
            Cache.alertTip("领取成功")
        })
    }


    // update (dt) {},
});
