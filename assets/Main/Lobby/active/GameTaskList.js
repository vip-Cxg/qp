// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const utils = require('../../Script/utils');
cc.Class({
    extends: cc.Component,

    properties: {
        taskItem: cc.Prefab,
        taskContainer: cc.Node,
        lblProcess: cc.Label,
        btnClose: cc.Node,
        lblFlow: cc.Label,
        progressData: null,
        interval: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {
        // this.lblProcess.node.active=false;
        // this.lblFlow.node.active=false;
        // let parentNode = this.node.parent;

        // let startPos = cc.v2(0, parentNode.height / 2 + this.node.height / 2);
        // let endPos = cc.v2(0, parentNode.height / 2 - this.node.height / 2);

        // let ap = cc.place(startPos);
        // let bp = cc.moveTo(0.3, endPos);
        // let cp = cc.callFunc(() => {
        //     this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        // });
        // let dp = cc.sequence(ap, bp, cp);
        // this.node.runAction(dp);
        
        
        this.updateData();
    },

    updateData() {
        
        // let nowTime = utils.getTimeStamp();
        // let startTime = utils.getTimeStamp(GameConfig.TaskStartTime);
        // let endTime = utils.getTimeStamp(GameConfig.TaskEndTime);
        // if(nowTime<startTime||nowTime>endTime) return;

        // Connector.request(GameConfig.ServerEventName.TaskProgress, {}, (res) => {
        //     console.log("任务进程 : ", res);
        //     if (res.data) {
        //         let totalFlow=0;
        //         res.data.forEach(e => {
        //             totalFlow+=e.userScore;
        //         });
        //         this.lblFlow.string = "当前总流水: " + (totalFlow/100);
        //     }
        // },null,(err)=>{
        //     Cache.alertTip("读取活动进程数据失败")
        // })
    },

    renderUI(progressData) {
        // this.progressData = progressData;
        // // this.lblProcess.string = "当前活跃值: " + progressData.activity;
        // this.taskContainer.removeAllChildren();
        // console.log(GameConfig.TaskList)
        // GameConfig.TaskList.forEach((e, i) => {
        //     if (e.type == "cyclable") return;
        //     if (progressData.process[e.class] >= e.threshold) return;
        //     let taskItem = cc.instantiate(this.taskItem);
        //     taskItem.getComponent('GameTaskItem').renderData(e, progressData.process[e.class]);
        //     this.taskContainer.addChild(taskItem);
        // })
    },

    onClickClose() {
        // this.node.stopAllActions()
        // let parentNode = this.node.parent;
        // let endPos = cc.v2(0, parentNode.height / 2 + this.node.height / 2);
        // // let ap=cc.place(startPos);
        // let bp = cc.moveTo(0.3, endPos);
        // let cp = cc.callFunc(() => {
        //     parentNode.getComponent("GameTaskItem").renderTask(this.progressData);
        //     this.node.removeFromParent();
        //     this.node.destroy();
        // });
        // let dp = cc.sequence(bp, cp);
        // this.node.runAction(dp);
    },
    // update(dt) {
        // this.interval++;
        // if (this.interval % 60 == 0) {
        //     this.interval = 0;
        //     let nowTime = utils.getTimeStamp();
        //     let startTime = utils.getTimeStamp(GameConfig.TaskStartTime);
        //     let endTime = utils.getTimeStamp(GameConfig.TaskEndTime);
        //     if (nowTime > endTime && nowTime <= endTime + 60 * 1000) {
        //         this.lblProcess.string = "今日活动结束 ";
        //         return
        //     }
        //     if (nowTime > endTime + 60 * 1000||nowTime<startTime) {
        //         this.lblProcess.node.active = false;
        //         this.lblFlow.node.active = false;
        //         return
        //     }
        //     if (nowTime <= endTime && nowTime >= startTime) {
        //         let durTime = Math.floor((endTime - nowTime) / 1000);
        //         this.lblProcess.node.active = true;
        //         this.lblFlow.node.active = true;
        //         this.lblProcess.string = '活动结束倒计时: ' + utils.timeToString(durTime);
        //         return
        //     }
        // }

    // },
});