const Connector = require("../Main/NetWork/Connector");
const Cache = require("../Main/Script/Cache");
const utils = require("../Main/Script/utils");
 var { GameConfig } = require("./GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        reasonBox: cc.EditBox,
        userName: cc.Label,
        userID: cc.Label,
        userData: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initData(data) {
        this.userData = data;
        this.userName.string = "" + utils.getStringByLength(data.prop.name, 6);
        this.userID.string = "" + data.prop.pid;
    },

    onClickReport() {
        


        Connector.request(GameConfig.ServerEventName.PreReportUser, { replayID: GameConfig.CurrentReplayData}, (data) => {
            if (utils.isNullOrEmpty(data.freeze)) {
                this.onConfirmReport();
            } else {
                Cache.showConfirm(data.freeze, () => {
                    this.onConfirmReport();
                })
            }

        },true,(err)=>{
            Cache.alertTip(err.message||'举报失败')
        })

    },

    onConfirmReport() {
        Connector.request(GameConfig.ServerEventName.ReportUser, { userID: this.userData.prop.pid, replayID: GameConfig.CurrentReplayData, reason: this.reasonBox.string }, (data) => {
            Cache.alertTip("举报成功")
            if (this.node) {
                this.node.removeFromParent();
                this.node.destroy();
            }
        })
    },

    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }

    }
    // update (dt) {},
});
