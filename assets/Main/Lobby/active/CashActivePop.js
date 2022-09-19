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
const utils = require("../../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        curAct: cc.Label,
        actProgress: cc.ProgressBar,
        taskContainer: cc.Node,
        rewardContainer: cc.Node,
        taskItem: cc.Prefab,
        rewardItem: cc.Prefab,
        notips: cc.Toggle

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // let taskData = [
        //     { desc: "交易所完成1次交易", count: 0, total: 1, reward: 10, status: false },
        //     { desc: "完成10局游戏", count: 0, total: 10, reward: 10, status: false },
        //     { desc: "完成80局游戏", count: 0, total: 80, reward: 20, status: false },
        //     { desc: "与5个玩家完成对局", count: 0, total: 5, reward: 10, status: false },
        //     { desc: "当日流水500元", count: 0, total: 500, reward: 10, status: false },
        //     { desc: "当日流水3000元", count: 0, total: 3000, reward: 20, status: false },
        //     { desc: "邀请1个新玩家", count: 0, total: 1, reward: 30, status: false },
        //     { desc: "邀请的新玩家完成1个任务", count: 0, total: 1, reward: 5, status: false }
        // ];
        this.notips.isChecked = !utils.getValue(GameConfig.StorageKey.ActiveDayTips, true)

        Connector.request(GameConfig.ServerEventName.TaskProgress, {}, (res) => {
            if (res.data) {
                let progressData = res.data;
                this.renderProgress(progressData);
                this.renderTask(progressData.task);
            }
        })

        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_ACTIVE_PROCESS, this.updateProcess, this)
    },

    updateProcess() {
        Connector.request(GameConfig.ServerEventName.TaskProgress, {}, (res) => {
            if (res.data) {
                let progressData = res.data;
                this.renderProgress(progressData);
                this.renderTask(progressData.task);
            }
        })
    },

    renderTask(data) {
        this.taskContainer.removeAllChildren();

        GameConfig.TaskList.forEach((e) => {
            let taskItem = cc.instantiate(this.taskItem);
            let progress = data.process[e.class];
            taskItem.getComponent("ActiveTaskItem").renderUI(e, progress);
            this.taskContainer.addChild(taskItem);
        })


    },

    renderProgress(data) {
        let maxProgress = data.rewardStatus[data.rewardStatus.length - 1].activity;
        let currentProgress = data.activity;
        this.curAct.string = "" + currentProgress;
        this.actProgress.progress = currentProgress / maxProgress;
        let parentWidth = this.actProgress.node.width;
        this.rewardContainer.removeAllChildren();
        //添加奖品
        data.rewardStatus.forEach((e, i) => {
            let rewardItem = cc.instantiate(this.rewardItem);
            rewardItem.getComponent("RewardItem").renderUI(e, i, currentProgress)
            let prop = e.activity / maxProgress;

            rewardItem.position = cc.v2((parentWidth * prop) - parentWidth / 2, 0);
            this.rewardContainer.addChild(rewardItem);
        })
    },


    onClickClose() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_ACTIVE_PROCESS, this.updateProcess, this)
        utils.saveValue(GameConfig.StorageKey.ActiveDayTips, !this.notips.isChecked)

        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
    // update (dt) {},
});
