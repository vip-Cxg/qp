// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        lblDesc: cc.Label,
        lblProgress: cc.Label,
        lblReward: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    renderUI(data, progress) {
        let threshold = data.class == "FLOW" ? data.threshold / 100 : data.threshold;
        progress = data.class == "FLOW" ? progress / 100 : progress;

        if (this.lblDesc) {
            let descStr = GameConfig.TaskDesc[data.class];
            this.lblDesc.string = descStr.replace('$', threshold);
        }
        if (progress >= threshold) {
            this.lblProgress.string = data.class == "INVITE" || data.class == "CHILD_CONTRIBUTE" ? '完成次数: ' + Math.floor(progress / threshold) + '次' : "已完成";
        } else {
            this.lblProgress.string = data.class == "INVITE" || data.class == "CHILD_CONTRIBUTE" ? '完成次数: ' + Math.floor(progress / threshold) + '次' : '当前进度: ' + progress + '/' + threshold;
        }

        if (this.lblReward)
            this.lblReward.string = '活跃值 +' + data.activity;
    }
    // update (dt) {},
});
