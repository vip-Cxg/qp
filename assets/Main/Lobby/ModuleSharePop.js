const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils");
 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        qrCode: cc.Graphics,
        inviter: cc.Label,
        inputProxy: cc.EditBox,
        btnChange: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
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
        utils.QRCreate(this.qrCode, GameConfig.GameInfo.download)
        console.log("二维码地址: ", GameConfig.GameInfo.download)

        this.inviter.string = "推广码:" + dataBase.player.inviter;
    },
    /**代理 */
    refreshProxyUI() {
        //TODO
        utils.QRCreate(this.qrCode, GameConfig.GameInfo.shareURL + "inviter=" + GameConfig.ProxyData.inviter)
        this.inviter.string = "推广码:" + GameConfig.ProxyData.inviter;
    },


    /**下级代理 */
    refresChildUI(data) {
        utils.QRCreate(this.qrCode, GameConfig.GameInfo.shareURL + "inviter=" + data)
        this.inviter.string = "推广码:" + data;
    },

    onChangeProxy() {
        // if(utils.isNullOrEmpty(this.inputProxy.string)){
        //     Cache.alertTip("请输入代理推广码");
        //     return;
        // }   
        // let a=this.inputProxy.string.toUpperCase();
        // console.log(a)
        // return;
        // Connector.request(GameConfig.ServerEventName,{inviter:a},(data)=>{

        // })
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