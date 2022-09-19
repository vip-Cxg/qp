let { GameConfig } = require("../../../GameBase/GameConfig");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const utils = require("../../Script/utils");
let DataBase = require("../../Script/DataBase")

const Native = require("../../Script/native-extend");
const _social = Native.Social
cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,

        wechatNode: cc.Node,

        nameBox: cc.EditBox,
        accountBox: cc.EditBox,
        addressBox: cc.EditBox,
        bankBox: cc.EditBox,
        bankNode: cc.Node,
        qrcodeNode: cc.Node,
        sprQrCode: cc.Sprite,
        defaultSpr: cc.SpriteFrame,

        openNode: cc.Node,
        offNode: cc.Node,

        codePre: cc.Prefab,

        payActive: true,

        wechatQrcode: "",
        alipayQrcode: "",
        payType: "alipay",
        renderType: 'player'
    },


    onLoad() {
        this.addEvents();
        GameConfig.isUpdateReceipt = false;

        _social.wechatQrCodeCallBack = (data) => {
            console.log("二维码地址: ", data)
            if (this.payType == "alipay") {
                this.alipayQrcode = data;
            } else {
                this.wechatQrcode = data;
            }
            utils.setHead(this.sprQrCode, GameConfig.GameInfo.resourceURL + data);

        }
    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },

    renderData(renderType) {
        this.renderType = renderType;
        if (renderType == 'player')
            this.wechatNode.active = true;
        this.refreshUI();
    },


    /**更新UI */
    refreshUI() {
        this.bankNode.active = this.payType == "bank";
        this.qrcodeNode.active = this.payType != "bank";
        switch (this.payType) {
            case "alipay":
                let alipayData = this.renderType == 'player' ? DataBase.player.alipay : GameConfig.ProxyData.alipay;
                if (!utils.isNullOrEmpty(alipayData)) {
                    let msg = JSON.parse(alipayData);
                    this.nameBox.string = "" + utils.getStringByLength(msg.name, 5);
                    this.accountBox.string = "" + msg.account;

                    this.payActive = utils.isNullOrEmpty(msg.active) ? true : msg.active;
                    this.openNode.active = utils.isNullOrEmpty(msg.active) ? true : msg.active;
                    this.offNode.active = utils.isNullOrEmpty(msg.active) ? false : !msg.active;


                    if (utils.isNullOrEmpty(msg.address) && utils.isNullOrEmpty(this.alipayQrcode)) {
                        this.sprQrCode.spriteFrame = this.defaultSpr;
                    } else {
                        let qrcodeUrl = utils.isNullOrEmpty(this.alipayQrcode) ? msg.address : this.alipayQrcode;
                        utils.setHead(this.sprQrCode, GameConfig.GameInfo.resourceURL + qrcodeUrl);
                    }
                } else {
                    this.nameBox.string = "";
                    this.accountBox.string = "";
                    if (utils.isNullOrEmpty(this.alipayQrcode)) {
                        this.sprQrCode.spriteFrame = this.defaultSpr;
                    } else {
                        utils.setHead(this.sprQrCode, GameConfig.GameInfo.resourceURL + this.alipayQrcode);
                    }

                    this.payActive = true;
                    this.openNode.active = true;
                    this.offNode.active = false;
                }

                break;
            case "wechat":
                let wechatData = this.renderType == 'player' ? DataBase.player.wechat : GameConfig.ProxyData.wechat;
                if (!utils.isNullOrEmpty(wechatData)) {
                    let msg = JSON.parse(wechatData);
                    this.nameBox.string = "" + utils.getStringByLength(msg.name, 5);
                    this.accountBox.string = "" + msg.account;
                    if (utils.isNullOrEmpty(msg.address) && utils.isNullOrEmpty(this.wechatQrcode)) {
                        this.sprQrCode.spriteFrame = this.defaultSpr;
                    } else {
                        let qrcodeUrl = utils.isNullOrEmpty(this.wechatQrcode) ? msg.address : this.wechatQrcode;
                        utils.setHead(this.sprQrCode, GameConfig.GameInfo.resourceURL + qrcodeUrl);
                    }


                    this.payActive = utils.isNullOrEmpty(msg.active) ? true : msg.active;
                    this.openNode.active = utils.isNullOrEmpty(msg.active) ? true : msg.active;
                    this.offNode.active = utils.isNullOrEmpty(msg.active) ? false : !msg.active;

                } else {
                    this.nameBox.string = "";
                    this.accountBox.string = "";
                    if (utils.isNullOrEmpty(this.wechatQrcode)) {
                        this.sprQrCode.spriteFrame = this.defaultSpr;
                    } else {
                        utils.setHead(this.sprQrCode, GameConfig.GameInfo.resourceURL + this.wechatQrcode);
                    }

                    this.payActive = true;
                    this.openNode.active = true;
                    this.offNode.active = false;
                }

                break;
            case "bank":
                let bankData = this.renderType == 'player' ? DataBase.player.bank : GameConfig.ProxyData.bank;

                if (!utils.isNullOrEmpty(bankData)) {
                    let msg = JSON.parse(bankData);
                    this.nameBox.string = "" + utils.getStringByLength(msg.name, 5);
                    this.accountBox.string = "" + msg.account;
                    this.bankBox.string = "" + msg.bank;
                    this.addressBox.string = "" + msg.address;

                    this.payActive = utils.isNullOrEmpty(msg.active) ? true : msg.active;
                    this.openNode.active = utils.isNullOrEmpty(msg.active) ? true : msg.active;
                    this.offNode.active = utils.isNullOrEmpty(msg.active) ? false : !msg.active;
                } else {
                    this.nameBox.string = "";
                    this.accountBox.string = "";
                    this.bankBox.string = "";
                    this.addressBox.string = "";

                    this.payActive = true;
                    this.openNode.active = true;
                    this.offNode.active = false;
                }
                break;
        }

    },

    /**提交二维码 */
    onConfirmQrcode() {
        
        _social.selectQRCode();

        // let url=this.payType=="alipay"?GameConfig.ServerEventName.AlipayQrCode:GameConfig.ServerEventName.WeChatQrCode;
        // Connector.request(url,{})
    },

    /**---------------------------------------------创建新的收款信息--------------------------------------------- */
    selectOpenOff() {

        


        let codePre = cc.instantiate(this.codePre);
        codePre.getComponent("MarketAccountCode").initData(this.payActive ? "是否禁用该收款信息" : "是否启用该收款信息", (codeStr) => {
            this.payActive = !this.payActive;
            this.openNode.active = this.payActive;
            this.offNode.active = !this.payActive;
            let payInfo = this.confirmInfo();
            let method = this.renderType == 'player' ? GameConfig.ServerEventName.OTCUpdate : GameConfig.ServerEventName.POTCUpdate;
            Connector.request(method, { payInfo: payInfo, code: codeStr }, (data) => {
                Cache.alertTip("提交成功");
                if (utils.isNullOrEmpty(data.player)) return;
                if (this.renderType == 'player') {
                    DataBase.player = data.player

                } else {
                    GameConfig.ProxyData = data.player
                }
                this.refreshUI()
            }, true, (err) => {
                Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "提交失败" : err.message, () => {
                    this.refreshUI()
                })
            })
        }, null, this.renderType=='player'?'player':'proxyCode')

    },

    selectPayType(e, v) {
        
        if (this.payType == v) return;
        this.payType = v;
        this.refreshUI();
    },

    /**提交账号信息 */
    confirmAccountInfo() {
        
        if (!this.checkInfo()) return;
        let payInfo = this.confirmInfo();

        let codePre = cc.instantiate(this.codePre);
        codePre.getComponent("MarketAccountCode").initData("确保所填信息为真实有效信息 因收款信息造成未收到付款,后果一律自己承担", (codeStr) => {
            let method = this.renderType == 'player' ? GameConfig.ServerEventName.OTCUpdate : GameConfig.ServerEventName.POTCUpdate;
            Connector.request(method, { payInfo: payInfo, code: codeStr }, (data) => {
                Cache.alertTip("提交成功");
                if (utils.isNullOrEmpty(data.player)) return;
                if (this.renderType == 'player') {
                    DataBase.player = data.player

                } else {
                    GameConfig.ProxyData = data.player
                }
                this.refreshUI()
            }, true, (err) => {
                Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "提交失败" : err.message, () => {
                    this.refreshUI()
                })
            })
        }, null, this.renderType=='player'?'player':'proxyCode');


    },

    checkInfo() {
        if (utils.isNullOrEmpty(this.payType)) {
            Cache.alertTip("请选择收款方式");
            return false;
        }
        if (utils.isNullOrEmpty(this.nameBox.string)) {
            Cache.alertTip("请输入收款人姓名");
            return false;
        }
        if (utils.isNullOrEmpty(this.accountBox.string)) {
            Cache.alertTip("请输入收款账号");
            return false;
        }
        if (this.payType == "bank" && utils.isNullOrEmpty(this.addressBox.string)) {
            Cache.alertTip("请输入开户行");
            return false;
        }
        if (this.payType == "bank" && utils.isNullOrEmpty(this.bankBox.string)) {
            Cache.alertTip("请输入银行名称");
            return false;
        }

        return true;
    },

    confirmInfo() {

        let payInfo = {};
        switch (this.payType) {
            case "alipay":
                let alipayData = this.renderType == 'player' ? DataBase.player.alipay : GameConfig.ProxyData.alipay;

                payInfo = {
                    payType: this.payType,//alipay wechat
                    name: this.nameBox.string,
                    account: this.accountBox.string,
                    address: utils.isNullOrEmpty(this.alipayQrcode) ? utils.isNullOrEmpty(alipayData) ? "" : (JSON.parse(alipayData).address) : this.alipayQrcode,
                    active: this.payActive
                }

                break;
            case "wechat":

                let wechatData = this.renderType == 'player' ? DataBase.player.wechat : GameConfig.ProxyData.wechat;

                payInfo = {
                    payType: this.payType,//alipay wechat
                    name: this.nameBox.string,
                    account: this.accountBox.string,
                    address: utils.isNullOrEmpty(this.wechatQrcode) ? (utils.isNullOrEmpty(wechatData) ? "" : JSON.parse(wechatData).address) : this.wechatQrcode,
                    active: this.payActive
                }
                break;
            case "bank":
                payInfo = {
                    payType: this.payType,//alipay wechat
                    name: this.nameBox.string,
                    account: this.accountBox.string,
                    address: this.addressBox.string,
                    bank: this.bankBox.string,
                    active: this.payActive
                }
                break;
        }

        return payInfo;
    },

    /**打开创建 */
    openCreatePage() {
        
        this.createPage.active = true;
        this.refreshCreatePage()
    },
    /**关闭创建 */
    closeCreatePage() {
        
        this.createPage.active = false;
    },

    /**关闭弹窗 */
    onClickClose() {
        
        _social.wechatQrCodeCallBack = null;
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    onDestroy() {
        _social.wechatQrCodeCallBack = null;
        this.removeEvents();
    }

});
