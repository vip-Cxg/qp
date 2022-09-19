 var { GameConfig } = require("../../../GameBase/GameConfig");
const Cache = require("../../Script/Cache");
const utils = require("../../Script/utils");
const dataBase = require("../../Script/DataBase");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        qrCode: cc.Graphics,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
        this.refreshUI();
    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },
    /**更新UI */
    refreshUI() {
        //TODO
        utils.QRCreate(this.qrCode, GameConfig.DownloadUrl)
        console.log("二维码地址: ", GameConfig.DownloadUrl)

    },


    /**关闭弹窗 */
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    onDestroy() {
        this.removeEvents();
    }
});