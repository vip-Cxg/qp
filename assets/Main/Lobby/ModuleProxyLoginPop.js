const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils");
const http = require("SceneLogin");
 var { GameConfig } = require("../../GameBase/GameConfig");
const { App } = require("../../script/ui/hall/data/App");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        loginBtn: cc.Node,
        phoneInput: cc.EditBox,
        pwdInput: cc.EditBox,
        codeInput: cc.EditBox,
        btnCode:cc.Node,
        errorTips: cc.Label,
        codeTime:cc.Label,
        checkWeb: cc.WebView,
        codeCoolDown:true
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
        this.refreshUI();

        // this.checkWeb.url = GameConfig.ConfigUrl + "info/checkCodeWeb.html";
        // var scheme = "testkey";
        // let self=this;
        // function jsCallback(target, url) {
        //     // 这里的返回值是内部页面的 URL 数值，需要自行解析自己需要的数据。
        //     var str = url.replace(scheme + '://', ''); // str === 'a=1&b=2'
        //     // webview target
        //     console.log("jsCallback-------str-------", str);
        //     console.log("jsCallback-------target-------", target);
        //     console.log("jsCallback-------url-------", url);
           
        //     let strarr = str.split("&");
        //     let ticketData = { ticket: strarr[0], randstr: strarr[1] };
        //     self.closeWebView(ticketData);

        // }
        // this.checkWeb.setJavascriptInterfaceScheme(scheme);
        // this.checkWeb.setOnJSCallback(jsCallback);
    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.loginBtn.on(cc.Node.EventType.TOUCH_END, this.onClickLogin, this);
        this.btnCode.on(cc.Node.EventType.TOUCH_END, this.onClickGetCode, this);
        // window.addEventListener('message', this.closeCheckCode.bind(this));
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.loginBtn.off(cc.Node.EventType.TOUCH_END, this.onClickLogin, this);
        this.btnCode.off(cc.Node.EventType.TOUCH_END, this.onClickGetCode, this);
        // window.removeEventListener('message', this.closeCheckCode.bind(this));
    },



    /**刷新UI */
    refreshUI() {
        // let strPassWd = utils.getValue(GameConfig.StorageKey.ProxyPwd);
        // let phone = utils.getValue(GameConfig.StorageKey.ProxyAccount);
        // this.pwdInput.string = strPassWd;
        // this.phoneInput.string = phone;
    },
    /**获取验证码 */
    onClickGetCode() {

        let bool = utils.checkPhone(this.phoneInput.string);
        if (!bool) {
            this._showErrorHint('手机号码格式有误');
            return;
        }
        if (!this.codeCoolDown) return;
        Connector.request(GameConfig.ServerEventName.LoginProxyCode, { phone: this.phoneInput.string }, (data) => {
            if (data.success) {
                this.codeCoolDown = false;
                Cache.showTipsMsg("已发送验证码");
                this.btnCode.getComponent(cc.Button).interactable = false;
                let time = 30;
                this.codeTime.string = '(' + (time) + 's)';
                this.codeTime.schedule(() => {
                    this.codeTime.string = '(' + (--time) + 's)';
                    if (time == 0) {
                        this.codeTime.string = '验证码';
                        this.codeCoolDown = true;
                        this.codeTime.unscheduleAllCallbacks();
                        this.btnCode.getComponent(cc.Button).interactable = true;
                    }
                }, 1);
            }
        })
    },
    /**登陆 */
    onClickLogin() {
        let bool = utils.checkPhone(this.phoneInput.string);
        if (!bool) {
            this._showErrorHint('手机号码格式有误');
            return;
        }
        if (!this.codeInput.string || this.codeInput.string.length < 1) {
            this._showErrorHint('验证码不能为空');
            return;
        }
        // App.Proxy.codeLoginProxy(this.codeInput.string, this.phoneInput.string)
        // return
        this.startLogin();

    },
    startCheckCode() {
        this.checkWeb.node.active = true;
    },
    closeCheckCode(e) {
        console.log("webData: ", e.data)
        var str = e.data.replace('testkey://', ''); // str === 'a=1&b=2'
        console.log("jsCallback-------str-------", str);
        let strarr = str.split("&");
        let ticketData = { ticket: strarr[0], randstr: strarr[1] };
        this.startLogin(ticketData);
        // this.startLogin(e.data)
    },
    closeWebView(str) {
        this.checkWeb.node.active = false;
        this.startLogin(str)
    },
    /**开始登陆 */
    startLogin() {
            
        Connector.request(GameConfig.ServerEventName.ProxyLogin, { code: this.codeInput.string,  phone: this.phoneInput.string, publicKey: GameConfig.Encrtyptor.getPublicKey() }, (data) => {
            // data.token
            utils.saveValue(GameConfig.StorageKey.ProxyAccount, this.phoneInput.string);
            GameConfig.ProxyData = data.proxy;
            utils.pop(GameConfig.pop.ProxyManagePop);
            this.onClickClose();
        });
    },

    _showErrorHint(str) {
        this.errorTips.node.active = true;
        this.errorTips.string = str;
        // 设置计时器
        this.scheduleOnce(() => {
            this.errorTips.node.active = false;
        }, 2);
    },
    /**关闭弹窗 */
    onClickClose() {
        this.removeEvents();
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    onDestroy() {
        this.removeEvents();
    }
});
