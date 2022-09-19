const Cache = require('../../Script/Cache');
const utils = require('../../Script/utils');
const DataBase = require('../../Script/DataBase');
const Connector = require('../../NetWork/Connector');
 var { GameConfig } = require('../../../GameBase/GameConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        btnConfirm: cc.Node,
        btnCancel: cc.Node,
        codeInput: cc.EditBox,
        getCodeBtn: cc.Node,
        codeTime: cc.Label,
        lblMessage: cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    cancel: function () {
        
        if (this.callback2 != null)
            this.callback2();
        try {

            if (this.node)
                this.node.destroy();
        } catch (error) {

        }
    },

    confirm: function () {
        
        if (utils.isNullOrEmpty(this.codeInput.string)) {
            Cache.alertTip("请输入验证码")
            return;
        }
        if (this.callback1 != null)
            this.callback1(this.codeInput.string);
        if (this.node)
            this.node.destroy();
    },
    sendCode() {
        
        if (!this.codeCoolDown) return;
        //TODO this.renderType  
        let method = GameConfig.ServerEventName.OTCUserCode;
        console.log("this.renderType-----", this.renderType)
        switch (this.renderType) {
            case 'player':
                console.log("this.method--1--")
                method = GameConfig.ServerEventName.OTCUserCode;
                break;
            case 'proxyCode':
                console.log("this.method--2--")
                method = GameConfig.ServerEventName.OTCProxyCode;
                break;
            case 'proxyFinishtrade':
                console.log("this.method--3--")
                method = GameConfig.ServerEventName.OTCProxyFinishtrade;
                break;
            case 'proxyMarket':
                console.log("this.method--4--")
                method = GameConfig.ServerEventName.OTCProxyMarket;
                break;
            default:
                console.log("this.method-----", method)

                break;
        }
        let phone = this.renderType == 'player' ? DataBase.player.phone : GameConfig.ProxyData.phone;
        Connector.request(method, { phone: phone }, (data) => {
            if (data.success) {
                this.codeCoolDown = false;
                Cache.alertTip("已发送验证码");
                this.getCodeBtn.getComponent(cc.Button).interactable = false;
                let time = 30;
                this.codeTime.string = '(' + (time) + 's)';
                this.codeTime.schedule(() => {
                    this.codeTime.string = '(' + (--time) + 's)';
                    if (time == 0) {
                        this.codeTime.string = '验证码';
                        this.codeCoolDown = true;
                        this.codeTime.unscheduleAllCallbacks();
                        this.getCodeBtn.getComponent(cc.Button).interactable = true;
                    }
                }, 1);
            }
        })
    },
    initData(message, callback1, callback2, renderType = 'player') {
        let canvas = cc.find("Canvas");
        this.codeCoolDown = true;
        this.renderType = renderType;
        this.callback1 = callback1;
        this.callback2 = callback2;
        this.lblMessage.string = "   " + message;
        this.node.parent = canvas;
        this.node.zIndex = 500;
        this.node.active = true;
        this.node.getChildByName("content").scale = 0;
        this.node.getChildByName("content").runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.callFunc(() => {

        })));
    }
});
