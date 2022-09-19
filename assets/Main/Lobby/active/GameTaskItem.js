// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const { App } = require("../../../script/ui/hall/data/App");
const Connector = require("../../NetWork/Connector");

cc.Class({
    extends: cc.Component,

    properties: {
        lblDesc: cc.Label,
        taskList: cc.Prefab,
        lblStatus: cc.Label,
        selfContainer: cc.Node,
        progressData: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        let parentNode = this.node.parent;
        this.node.position = cc.v2(parentNode.width / 2 - this.node.width / 2, parentNode.height / 2 - this.node.height / 2)

    },

    start() {
    },

    handleData() {
        // let taskIndex = GameConfig.TaskList.findIndex(e => e.status == false)
        // if (taskIndex == -1) {
        //     //全完成
        //     this.selfContainer.active = false;
        // } else {
        //     this.node.on(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);
        //     this.renderData(GameConfig.TaskList[taskIndex])
        // }
        if (this.node.getChildByName("taskList")) {
            this.node.getChildByName("taskList").removeFromParent();
        }
        Connector.request(GameConfig.ServerEventName.TaskProgress, {}, (res) => {
            if (res.data) {
                let progressData = res.data;
                this.progressData = progressData.task;
                this.renderTask(progressData.task);

            }
        })
    },

    renderTask(data) {
        // for (let key in data.process) {
        //     let activity = data.process[key];
        //     if ()
        // }


        for (let i = 0; i < GameConfig.TaskList.length; i++) {
            let e = GameConfig.TaskList[i];
            let progress = data.process[e.class];
            if (progress < e.threshold && e.class != "TRADE" && e.class != 'CHILD_CONTRIBUTE' && e.class != 'INVITE') {

                this.node.on(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);
                if (this.selfContainer)
                    this.selfContainer.active = true;

                let descStr = GameConfig.TaskDesc[e.class];
                let progressStr = e.class == "FLOW" ? progress / 100 + '/' + e.threshold / 100 : progress + '/' + e.threshold;
                this.lblDesc.string = descStr.replace('$', progressStr);
                return;
            }
        }
    },


    renderData(data, progress) {
        console.log("123123", data);


        let descStr = GameConfig.TaskDesc[data.class];
        let progressStr = data.class == "FLOW" ? progress / 100 + '/' + data.threshold / 100 : progress + '/' + data.threshold;
        this.lblDesc.string = descStr.replace('$', progressStr);
        this.lblStatus.string = progress >= data.threshold ? "已完成" : "未完成";
    },
    onClickSelf() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClickSelf, this);

        let taskList = cc.instantiate(this.taskList);
        taskList.getComponent("GameTaskList").renderUI(this.progressData);
        this.node.addChild(taskList, 2, "taskList");
        this.selfContainer.active = false;
    },
    // update (dt) {},
});
