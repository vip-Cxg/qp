
let { GameConfig } = require("../../../GameBase/GameConfig");
const Cache = require("../../Script/Cache");
const utils = require("../../Script/utils");
const DataBase = require('../../Script/DataBase');
const Connector = require('../../NetWork/Connector');
cc.Class({
    extends: cc.Component,

    properties: {
        pwdInput: cc.EditBox,
        ensurePwdInput: cc.EditBox,
        codeInput: cc.EditBox,
        codeTime: cc.Label,
        getCodeBtn: cc.Node,
        codeCoolDown: true
    },

    // use this for initialization
    onLoad() {
        this.node.zIndex = 3;
    },

    sendCode() {
        if (!this.codeCoolDown) return;
        Connector.request(GameConfig.ServerEventName.OTCUserPwdCode, { phone: DataBase.player.phone }, (data) => {
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

    confirm() {
        
        if (utils.isNullOrEmpty(this.pwdInput.string)) {
            Cache.alertTip("请输入新交易密码");
            return;
        }
        if (this.pwdInput.string != this.ensurePwdInput.string) {
            Cache.alertTip("两次密码不一致");
            return;
        }
        if (utils.isNullOrEmpty(this.codeInput.string)) {
            Cache.alertTip("请输入验证码");
            return;
        }
        let encryptPwd = utils.encryptToken(this.pwdInput.string);
        Connector.request(GameConfig.ServerEventName.OTCSecurity, { password: encryptPwd, code: this.codeInput.string }, (data) => {
            Cache.alertTip("修改成功");
            if (this.node){
                this.node.removeFromParent();
                this.node.destroy();
            }
        })

    },

    cancel() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },



});
