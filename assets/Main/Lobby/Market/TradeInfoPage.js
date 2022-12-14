// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const utils = require("../../Script/utils");
let DataBase = require("../../Script/DataBase");
const Native = require("../../Script/native-extend");
const { GoEasyConfig } = require("../../GoEasy/GoEasyConfig");
const { App } = require("../../../script/ui/hall/data/App");
const _social = Native.Social
cc.Class({
    extends: cc.Component,

    properties: {
        lblDownTime: cc.Label,
        lblBuyerIDDesc: cc.Label,
        lblBuyerID: cc.Label,
        lblNameDesc: cc.Label,
        lblName: cc.Label,
        lblAccountDesc: cc.Label,
        lblAccount: cc.Label,
        lblBank: cc.Label,
        lblBankAddress: cc.Label,
        lblPhoneDesc: cc.Label,
        lblPhone: cc.Label,
        lblCreateAt: cc.Label,
        lblUpdateAt: cc.Label,


        qrcodeNode: cc.Sprite,
        qrcodeDesc: cc.Label,
        defaultSf: cc.SpriteFrame,

        qrcodeSpr: cc.Sprite,
        qrcodeMask: cc.Node,

        judgeBtn: cc.Node,
        serviceBtn: cc.Node,
        submitDataBtn: cc.Node,
        copyServiceBtn:cc.Node,
        copyTips:cc.Node,
        processBtn: cc.Node,
        confirmBtn: cc.Node,
        cancelBtn: cc.Node,

        plsProcessBtn: cc.Node,
        plsCancelBtn: cc.Node,
        judgeProcessBtn: cc.Node,
        judgeCancelBtn: cc.Node,


        agreeProcessBtn: cc.Node,
        agreeCancelBtn: cc.Node,

        refuseProcessBtn: cc.Node,
        refuseCancelBtn: cc.Node,


        tradeInfo: cc.Node,
        btnContainer: cc.Node,
        tradeNoData: cc.Node,

        // chatContainer: cc.Node,
        chatRoom: cc.Node,
        // chatBtn: cc.Node,

        // chatForSell: cc.SpriteFrame,
        // chatForBuy: cc.SpriteFrame,

        statusSpr: cc.Sprite,
        statusTips: cc.Label,
        tipsContainer: cc.Node,

        cancelSf: cc.SpriteFrame,
        doneSf: cc.SpriteFrame,



        allData: [],
        unfinishData: [],
        finishData: [],
        tradeType: "all",

        payTypeContainer: cc.Node,
        payType: "",
        isInitRoom: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
    },
    addEvents() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshTrade, this);
    },
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshTrade, this);

    },

    refreshTrade() {
        if (this.selectInfo)
            this.downloadTrades(this.selectInfo.id)
    },


    downloadTrades(tradeID) {

        this.tradeInfo.active = true;
        this.btnContainer.active = true;
        this.tradeNoData.active = false;
        this.lblDownTime.node.active = false;
        this.qrcodeNode.node.active = false;
        Connector.request(GameConfig.ServerEventName.OTCTrade, { tradeID }, (data) => {

            this.selectTrades({ detail: data.trade })
        });

    },

    // selectPayType(e, v) {
    //     
    //     if (this.payType == v) return;
    //     if (utils.isNullOrEmpty(this.selectInfo)) return;
    //     this.payType = v;
    //     this.refreshSelectInfo();

    // },
    selectTrades(e) {
        this.selectInfo = e.detail;
        //???????????????
        this.enjoinChatRoom()
        this.deleteTradeDone(this.selectInfo.id)

        let tradeType = e.detail.buyer.id == DataBase.player.id ? "buy" : "sell";

        this.payTypeContainer.active = tradeType == "buy" && e.detail.status != "cancel" && e.detail.status != "done";
        this.payType = e.detail.payType;

        this.payTypeContainer.getChildByName("alipay").active = !utils.isNullOrEmpty(this.selectInfo.seller.alipay)
        this.payTypeContainer.getChildByName("wechat").active = !utils.isNullOrEmpty(this.selectInfo.seller.wechat)
        this.payTypeContainer.getChildByName("bank").active = !utils.isNullOrEmpty(this.selectInfo.seller.bank)
        this.payTypeContainer.getChildByName("" + this.payType).getComponent(cc.Toggle).check();

        this.refreshSelectInfo();

        this.judgeBtn.active = tradeType == "sell" && e.detail.status == "process";//  false;//e.detail.status == "process" || e.detail.status == "done";

        //?????????????????????
        this.statusSpr.node.active = false;
        if (e.detail.status == "cancel" || e.detail.status == "done") {

            this.statusSpr.node.active = true;
            this.statusSpr.node.stopAllActions();
            this.statusSpr.spriteFrame = e.detail.status == "cancel" ? this.cancelSf : this.doneSf;
            this.statusSpr.node.opacity = 0;
            this.statusSpr.node.scale = 3;
            let ap = cc.scaleTo(0.1, 1);
            let bp = cc.fadeIn(0.1);
            let cp = cc.spawn(ap, bp);
            this.statusSpr.node.runAction(cp);
        }

        let showAnim = false;
        this.statusTips.node.active = false;
        this.statusTips.string = "";
        this.tipsContainer.active = false;

        //????????????
        switch (e.detail.status) {
            case "wait"://?????????  ????????????
                if (tradeType == "buy") {
                    this.statusTips.node.active = true;
                    this.tipsContainer.active = true;
                    this.statusTips.string = "????????????????????????????????????????????????????????????????????????????????????";
                    showAnim = true;
                }
                break;
            case "process":
                if (tradeType == "sell") {
                    this.tipsContainer.active = true;
                    this.statusTips.node.active = true;
                    this.statusTips.string = "????????????" + GameConfig.ChannelName[this.selectInfo.payType] + "????????????????????????,????????????????????????????????????????????????";
                    showAnim = true;
                }
                break;
            case "judge":

                this.tipsContainer.active = true;
                this.statusTips.node.active = true;
                this.statusTips.string = "????????????????????????????????????????????????????????????";
                showAnim = true;
                break;
            case "release":
                if (tradeType == "buy") {
                    this.tipsContainer.active = true;
                    this.statusTips.node.active = true;
                    this.statusTips.string = "??????????????????????????????";
                    showAnim = true;
                }

                break;
            case "confirm":
                if (tradeType == "sell") {
                    this.tipsContainer.active = true;
                    this.statusTips.node.active = true;
                    this.statusTips.string = "??????????????????????????????";
                    showAnim = true;
                }
                break;
            case 'service':

                this.tipsContainer.active = true;
                this.statusTips.node.active = true;
                this.statusTips.string = tradeType == "sell" ? "???????????????,??????????????????????????????,?????????????????????????????????????????????" : "???????????????,??????????????????????????????,?????????????????????????????????????????????";
                showAnim = true;

                break;
        }

        if (showAnim) {
            this.statusTips.node.opacity = 0;
            this.statusTips.node.scale = 3;
            let ag = cc.scaleTo(0.2, 1);
            let bg = cc.fadeIn(0.2);
            let cg = cc.spawn(ag, bg);
            this.statusTips.node.runAction(cg);
        }


        //????????????????????????
        this.confirmBtn.active = tradeType == "buy" && e.detail.status == "wait" && (new Date().getTime() + GameConfig.ServerTimeDiff - new Date(e.detail.updatedAt).getTime()) < GameConfig.GameInfo.otcConfig.BUY_TIMEOUT;//?????????
        this.cancelBtn.active = tradeType == "buy" && e.detail.status == "wait" && (new Date().getTime() + GameConfig.ServerTimeDiff - new Date(e.detail.updatedAt).getTime()) < GameConfig.GameInfo.otcConfig.BUY_TIMEOUT;//????????????
        //??????
        this.processBtn.active = tradeType == "sell" && e.detail.status == "process";



        //?????????????????????
        this.plsProcessBtn.active = tradeType == "buy" && e.detail.status == "judge";
        this.judgeCancelBtn.active = tradeType == "buy" && e.detail.status == "judge";
        this.plsCancelBtn.active = tradeType == "sell" && e.detail.status == "judge";
        this.judgeProcessBtn.active = tradeType == "sell" && e.detail.status == "judge";

        // ???????????????????????????
        this.agreeProcessBtn.active = tradeType == "sell" && e.detail.status == "confirm";
        this.agreeCancelBtn.active = tradeType == "buy" && e.detail.status == "release";


        // ???????????????????????????
        this.refuseProcessBtn.active = tradeType == "sell" && e.detail.status == "confirm";
        this.refuseCancelBtn.active = tradeType == "buy" && e.detail.status == "release";


        //????????????????????????
        this.serviceBtn.active = e.detail.status == "judge";
        //?????????????????????
        this.submitDataBtn.active = e.detail.status == "service";
        this.copyServiceBtn.active = e.detail.status == "service";
        this.copyTips.active = e.detail.status == "service";

        if (e.detail.status == "process" || e.detail.status == "wait" || e.detail.status == "trans") {
            this.tipsContainer.active = true;
            this.lblDownTime.node.active = true;
            this.lblDownTime.unscheduleAllCallbacks();
            let totalTime = 0;
            switch (e.detail.status) {
                case "wait":
                    totalTime = GameConfig.GameInfo.otcConfig.BUY_TIMEOUT;
                    break;
                case "process":
                    totalTime = e.detail.tradeType == "slow" ? GameConfig.GameInfo.otcConfig.SLOW_SELL_CONFIRM_TIMEOUT : GameConfig.GameInfo.otcConfig.FAST_SELL_CONFIRM_TIMEOUT;
                    break;
                case "trans":
                    totalTime = GameConfig.GameInfo.otcConfig.SLOW_BUY_TRANS_TIME;
                    break;
            }
            this.lblDownTime.schedule(() => {
                let leftTime = totalTime - (new Date().getTime() + GameConfig.ServerTimeDiff - new Date(e.detail.updatedAt).getTime());
                if (leftTime <= 0) {
                    this.lblDownTime.string = "00:00";
                    this.lblDownTime.unscheduleAllCallbacks();
                    return;
                }
                let hour = Math.floor(leftTime / 1000 / 60 / 60);
                if (hour > 0) {
                    this.lblDownTime.string = "???" + hour + "??????";
                    return
                }
                let min = Math.floor((leftTime / 1000) / 60);
                let sec = Math.floor((leftTime / 1000) % 60)
                let m = min < 10 ? "0" + min : "" + min;
                let s = sec < 10 ? "0" + sec : "" + sec;
                this.lblDownTime.string = m + ":" + s;
            }, 1)
        } else {
            this.lblDownTime.node.active = false;
        }
    },
    refreshSelectInfo() {
        console.log("----selectInfo----", this.selectInfo)

        let tradeType = this.selectInfo.buyer.id == DataBase.player.id ? "buy" : "sell";
        //??????ID  ??????????????????
        this.lblBuyerIDDesc.node.active = tradeType == "sell";
        this.lblBuyerID.node.active = tradeType == "sell";
        this.lblBuyerID.string = "" + this.selectInfo.buyer.id;

        this.lblNameDesc.string = tradeType == "buy" ? "?????????" : "?????????";
        this.lblName.string = tradeType == "buy" ? JSON.parse(this.selectInfo.seller[this.payType]).name : this.selectInfo.buyer.name;

        this.lblAccountDesc.node.active = tradeType == "buy";
        this.lblAccount.node.active = tradeType == "buy";
        this.lblAccount.string = JSON.parse(this.selectInfo.seller[this.payType]).account + "";
        if (this.payType == "bank" && tradeType == "buy") {
            this.lblBank.node.active = true;
            this.lblBankAddress.node.active = true;
            this.lblBank.node.parent.active = true;
            this.lblBankAddress.node.parent.active = true;
            this.lblBank.string = "" + JSON.parse(this.selectInfo.seller[this.payType]).bank;
            this.lblBankAddress.string = "" + JSON.parse(this.selectInfo.seller[this.payType]).address;
        } else {
            this.lblBank.node.active = false;
            this.lblBankAddress.node.active = false;
            this.lblBank.node.parent.active = false;
            this.lblBankAddress.node.parent.active = false;
        }

        //??????????????????????????????
        this.lblPhoneDesc.node.active = this.selectInfo.status != "cancel" || this.selectInfo.status != "done"//this.selectInfo.status == "judge" || this.selectInfo.status == "process" || this.selectInfo.status == "wait";
        this.lblPhone.node.active = this.selectInfo.status != "cancel" || this.selectInfo.status != "done"// this.selectInfo.status == "judge" || this.selectInfo.status == "process" || this.selectInfo.status == "wait";
        this.lblPhoneDesc.string = tradeType == "buy" ? "???????????????" : "???????????????";
        this.lblPhone.string = tradeType == "buy" ? this.selectInfo.seller.phone : this.selectInfo.buyer.phone;

        //????????????
        this.lblCreateAt.string = utils.timestampToTime(new Date(this.selectInfo.createdAt)) + "";
        //????????????
        this.lblUpdateAt.string = utils.timestampToTime(new Date(this.selectInfo.updatedAt)) + "";
        this.qrcodeNode.node.active = (tradeType == "buy" && this.payType != "bank" && this.selectInfo.status != "cancel" && this.selectInfo.status != "done") || (tradeType == "sell" && this.selectInfo.status != "wait");
        this.qrcodeDesc.string = tradeType == "buy" ? "?????????????????????" : "????????????????????????";

        if ((tradeType == "buy" && this.payType != "bank") || (tradeType == "sell" && this.selectInfo.status != "wait")) {

            let qrcodeUrl = tradeType == "buy" ? JSON.parse(this.selectInfo.seller[this.payType]).address : this.selectInfo.receipt;
            if (utils.isNullOrEmpty(qrcodeUrl)) {
                this.qrcodeNode.spriteFrame = this.defaultSf
            } else {
                utils.setHead(this.qrcodeNode, GameConfig.GameInfo.resourceURL + qrcodeUrl);
            }

        }
    },





    showQrCode() {

        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        let qrcodeUrl = this.selectInfo.buyer.id == DataBase.player.id ? JSON.parse(this.selectInfo.seller[this.selectInfo.payType]).address : this.selectInfo.receipt;
        if (utils.isNullOrEmpty(qrcodeUrl)) {
            Cache.alertTip(this.selectInfo.buyer.id == DataBase.player.id ? "???????????????" : "???????????????????????????");
            return;
        }
        this.qrcodeMask.active = true;
        utils.setHead(this.qrcodeSpr, GameConfig.GameInfo.resourceURL + qrcodeUrl);
        App.lockScene();
        this.qrcodeSpr.node.scale = 0;
        setTimeout(() => {
            if (this.qrcodeSpr.node.height > 500) {
                let w = 500 * this.qrcodeSpr.node.width / this.qrcodeSpr.node.height;
                let h = 500;
                this.qrcodeSpr.node.width = w;
                this.qrcodeSpr.node.height = h
            }

            this.qrcodeSpr.node.runAction(cc.scaleTo(0.2, 1));
            App.unlockScene();
        }, 300)
    },

    hideQrCode() {
        
        this.qrcodeSpr.node.stopAllActions();
        this.qrcodeSpr.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                this.qrcodeMask.active = false;
            })
        ));
    },

    saveQrCode() {
        
        let qrcodeUrl = JSON.parse(this.selectInfo.seller[this.selectInfo.payType]).address;
        utils.SaveToLocal(GameConfig.GameInfo.resourceURL + qrcodeUrl, (filepath) => {
            if (filepath == "error ") {
                Cache.alertTip("????????????,???????????????")
            } else {
                _social.saveImage(filepath);
            }
        })

    },

    copyStr(e) {
        
        Cache.alertTip("????????????")
        _social.setCopy(e.currentTarget.getComponent(cc.Label).string);
    },

    /**???????????? */
    onClickCancel() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("??????????????????????\n\n?????????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.OTCCancelTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("????????????");
                this.downloadTrades(this.selectInfo.id);
            })
        })
    },

    /**????????? */
    onClickConfirm() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        var self = this;
        utils.pop(GameConfig.pop.ConfirmReceiptPop, (node) => {
            node.getComponent("ConfirmReceiptPop").show("showConfirm", "?????????????????????", (receiptUrl) => {
                Connector.request(GameConfig.ServerEventName.OTCConfirmTrade, { tradeID: self.selectInfo.id, receipt: receiptUrl }, (data) => {
                    Cache.alertTip("??????????????????");
                    Cache.showConfirm("????????????????????????????????????", () => {
                        _social.makeCall("" + this.selectInfo.seller.phone)
                        self.downloadTrades(this.selectInfo.id);
                    }, () => {
                        self.downloadTrades(this.selectInfo.id);
                    })
                })
            })
        })


    },
    /**?????? */
    onClickProcess() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        var self = this;
        utils.pop(GameConfig.pop.CheckTradePwd, (node) => {
            node.getComponent("CheckTradePwd").show("showConfirm", "????????????" + GameConfig.ChannelName[this.selectInfo.payType] + "????????????????????????" + utils.formatGold(this.selectInfo.amount) + "???,?????????????????????????????????????????????????????????", (tradePwd) => {
                let encryptPwd = utils.encryptToken(tradePwd);
                Connector.request(GameConfig.ServerEventName.OTCProcessTrade, { tradeID: this.selectInfo.id, password: encryptPwd }, (data) => {
                    Cache.alertTip("????????????");
                    this.downloadTrades(this.selectInfo.id);
                })
            })
        })
    },

    /**?????? */
    onClickJudge() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("?????????????????????? ?????????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.OTCReportTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("????????????????????????");
                this.downloadTrades(this.selectInfo.id);

            })
        })
    },

    /**???????????? */
    onPleaseProcess() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("????????????,??????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.OTCPleaseProcess, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("??????????????????");
                this.downloadTrades(this.selectInfo.id);
            })
        })
    },
    /**???????????? */
    onPleaseCancel() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("????????????,????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.OTCPleaseCancel, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("??????????????????");
                this.downloadTrades(this.selectInfo.id);
            })
        })
    },
    /**???????????????????????? */
    onServiceTrade() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("?????????????????????,?????????????????????????????????,?????????????????????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.OTCServiceTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip(this.selectInfo.buyer.id == DataBase.player.id ? "??????????????????????????????" : "??????????????????????????????");
                this.downloadTrades(this.selectInfo.id);
            })
        })
    },

    /**?????????????????? */
    enjoinChatRoom() {
        if (this.isInitRoom) return;
        this.isInitRoom = true;
        let id = this.selectInfo.seller.id == DataBase.player.id ? this.selectInfo.buyer.id : this.selectInfo.seller.id;

        this.chatRoom.getComponent("GoEasyChat").initData(id, this.selectInfo, GoEasyConfig.ChatType.PRIVATE);

    },
    onSumbitData() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        _social.openUrl(`${GameConfig.GameInfo.customeService}&metadata={"tel":"${DataBase.player.phone}","name":"${DataBase.player.name}","qq":"${DataBase.player.id}","addr":"xyqp","tradeID":"${this.selectInfo.id}","sellerID":"${this.selectInfo.seller.id}","buyerID":"${this.selectInfo.buyer.id}"}`)
    },
    onCopyService() {
        
        if (utils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        let str = `${GameConfig.GameInfo.customeService}&metadata={"tel":"${DataBase.player.phone}","name":"${DataBase.player.name}","qq":"${DataBase.player.id}","addr":"xyqp","tradeID":"${this.selectInfo.id}","sellerID":"${this.selectInfo.seller.id}","buyerID":"${this.selectInfo.buyer.id}"}`
        _social.setCopy(str);

    },


    /**???????????????????????? */
    deleteTradeDone(id) {
        let data = utils.getValue("" + GameConfig.StorageKey.TradeWaitting + DataBase.player.id, []);
        // if (data.length == 0) return;
        let newData = data.filter(e => { return e.tradeID != id })
        utils.saveValue("" + GameConfig.StorageKey.TradeWaitting + DataBase.player.id, newData);
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HIDE_TRADE_TIPS);
    },

    onClickPhone(e) {
        
        _social.setCopy(e.currentTarget.getComponent(cc.Label).string);
        _social.makeCall(e.currentTarget.getComponent(cc.Label).string);
    },

    onClickService() {
        
        _social.openUrl(`${GameConfig.GameInfo.customeService}&metadata={"tel":"${DataBase.player.phone}","name":"${DataBase.player.name}","qq":"${DataBase.player.id}","addr":"xyqp","tradeID":"${this.selectInfo.id}","sellerID":"${this.selectInfo.seller.id}","buyerID":"${this.selectInfo.buyer.id}"}`)

    },

    /**???????????? */
    onClickClose() {
        
        this.removeEvents()
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    // update (dt) {},
});
