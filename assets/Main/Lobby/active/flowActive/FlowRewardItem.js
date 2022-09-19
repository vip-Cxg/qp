// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../../GameBase/GameConfig");
const { App } = require("../../../../script/ui/hall/data/App");
const Connector = require("../../../NetWork/Connector");
const Cache = require("../../../Script/Cache");
const utils=require('../../../Script/utils');
cc.Class({
    extends: cc.Component,

    properties: {
        lblID: cc.Label,
        lblFlow: cc.Label,
        lblName: cc.Label,
        
        // rewardLevel: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    renderUI(data) {
        this.lblFlow.string=''+data.userScore/100;
        this.lblID.string='ID: '+data.userID;
        this.lblName.string='玩家'+utils.getStringByLength(data.name,5);
        
        // this.rewardLevel = data.id;
        // this.lblReward.string = (data.reward / 100) + "元";
        // this.lblDesc.string = "玩家"+utils.getStringByLength(data.sourceName,6) + "完成任务";
        // this.sprReward.spriteFrame = data.status==0 ? this.sfClose : this.sfOpen;
        // if (process >= data.activity && !data.status){
        //     let animTime = 0.05;
        //     let ap = cc.rotateBy(animTime, 10);
        //     let bp = cc.rotateBy(animTime * 2, -20);
        //     let cp = cc.rotateBy(animTime * 2, 20);
        //     let dp = cc.rotateBy(animTime, -10);
        //     let ep = cc.sequence(bp, cp).repeat(3);
        //     let fp = cc.sequence(ap, ep, dp, cc.callFunc(() => {
        //         this.sprReward.node.angle=0;
        //     }), cc.delayTime(1)).repeatForever();
        //     this.sprReward.node.runAction(fp);
        // }

            // this.node.on(cc.Node.EventType.TOUCH_END, this.onGetReward, this);
    },
    // onGetReward() {
    //     
    //     if(utils.isNullOrEmpty(this.tid)){
    //         Cache.alertTip("请先完成自己的流水任务再领取");
    //         return;
    //     }
    //     Connector.request(GameConfig.ServerEventName.TaskReceive, { tid: this.rewardLevel }, (res) => {
    //         App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_ACTIVE_PROCESS);
    //         Cache.alertTip("领取成功")
    //     })
    // }


    // update (dt) {},
});
