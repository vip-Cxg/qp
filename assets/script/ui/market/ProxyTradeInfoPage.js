import { GameConfig } from "../../../GameBase/GameConfig";
import { GoEasyConfig } from "../../../Main/GoEasy/GoEasyConfig";
import Connector from "../../../Main/NetWork/Connector";
import { prototype } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import { Social } from "../../../Main/Script/native-extend";
import GameUtils from "../../common/GameUtils";
import { App } from "../hall/data/App";

const { ccclass, property } = cc._decorator
@ccclass
export default class ProxyTradeInfoPage extends cc.Component {


    @property(cc.Label)
    lblDownTime = null;
    @property(cc.Label)
    lblBuyerIDDesc = null;
    @property(cc.Label)
    lblBuyerID = null;
    @property(cc.Label)
    lblNameDesc = null;
    @property(cc.Label)
    lblName = null;
    @property(cc.Label)
    lblAccountDesc = null;
    @property(cc.Label)
    lblAccount = null;
    @property(cc.Label)
    lblBank = null;
    @property(cc.Label)
    lblBankAddress = null;
    @property(cc.Label)
    lblPhoneDesc = null;
    @property(cc.Label)
    lblPhone = null;
    @property(cc.Label)
    lblCreateAt = null;
    @property(cc.Label)
    lblUpdateAt = null;

    @property(cc.Node)
    chatRoom = null;


    @property(cc.Sprite)
    qrcodeNode = null;
    @property(cc.Label)
    qrcodeDesc = null;
    @property(cc.SpriteFrame)
    defaultSf = null;

    @property(cc.Sprite)
    qrcodeSpr = null;
    @property(cc.Node)
    qrcodeMask = null;


    @property(cc.Node)
    judgeBtn = null;
    @property(cc.Node)
    serviceBtn = null;
    @property(cc.Node)
    submitDataBtn = null;
    @property(cc.Node)
    copyServiceBtn = null;
    @property(cc.Node)
    copyTips = null;
    @property(cc.Node)
    processBtn = null;
    @property(cc.Node)
    confirmBtn = null;
    @property(cc.Node)
    cancelBtn = null;


    @property(cc.Node)
    plsProcessBtn = null;
    @property(cc.Node)
    plsCancelBtn = null;
    @property(cc.Node)
    judgeProcessBtn = null;
    @property(cc.Node)
    judgeCancelBtn = null;

    @property(cc.Node)
    agreeProcessBtn = null;
    @property(cc.Node)
    agreeCancelBtn = null;

    @property(cc.Node)
    refuseProcessBtn = null;
    @property(cc.Node)
    refuseCancelBtn = null;

    @property(cc.Node)
    tradeInfo = null;
    @property(cc.Node)
    btnContainer = null;
    @property(cc.Node)
    tradeNoData = null;

    @property(cc.Node)
    payTypeContainer = null;
    @property(cc.Sprite)
    statusSpr = null;
    @property(cc.Label)
    statusTips = null;
    @property(cc.Node)
    tipsContainer = null;
    @property(cc.SpriteFrame)
    cancelSf = null;
    @property(cc.SpriteFrame)
    doneSf = null;
    @property(cc.Prefab)
    codePre = null;



    allData = [];
    unfinishData = [];
    finishData = [];
    tradeType = 'all';


    payType = "";
    isInitRoom = false;
    tradeId = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
    }
    addEvents() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshTrade, this);
    }
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshTrade, this);

    }

    refreshTrade() {
        if (this.selectInfo)
            this.downloadTrades()
    }

    initData(data) {
        this.tradeId = data
        this.downloadTrades();
    }



    downloadTrades() {



        this.tradeInfo.active = true;
        this.btnContainer.active = true;
        this.tradeNoData.active = false;
        this.lblDownTime.node.active = false;
        this.qrcodeNode.node.active = false;
        Connector.request(GameConfig.ServerEventName.POTCTrade, { tradeID: this.tradeId }, (data) => {

            this.selectTrades({ detail: data.trade })


        });

    }

    // selectPayType(e, v) {
    //     
    //     if (this.payType == v) return;
    //     if (GameUtils.isNullOrEmpty(this.selectInfo)) return;
    //     this.payType = v;
    //     this.refreshSelectInfo();

    // },
    selectTrades(e) {
        this.selectInfo = e.detail;
        //???????????????
        this.enjoinChatRoom()
        this.deleteTradeDone(this.selectInfo.id)

        let tradeType = e.detail.buyer.id == GameConfig.ProxyData.id ? "buy" : "sell";

        this.payTypeContainer.active = tradeType == "buy" && e.detail.status != "cancel" && e.detail.status != "done";
        this.payType = e.detail.payType;

        this.payTypeContainer.getChildByName("alipay").active = !GameUtils.isNullOrEmpty(this.selectInfo.seller.alipay)
        this.payTypeContainer.getChildByName("wechat").active = !GameUtils.isNullOrEmpty(this.selectInfo.seller.wechat)
        this.payTypeContainer.getChildByName("bank").active = !GameUtils.isNullOrEmpty(this.selectInfo.seller.bank)
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
                console.log("----???????????????----", this.lblDownTime.node.active)

            }, 1);


        } else {
            console.log("----???????????????----")

            this.lblDownTime.node.active = false;
        }
    }
    refreshSelectInfo() {
        console.log("----selectInfo----", this.selectInfo)

        let tradeType = this.selectInfo.buyer.id == GameConfig.ProxyData.id ? "buy" : "sell";
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
        this.lblCreateAt.string = GameUtils.timestampToTime(new Date(this.selectInfo.createdAt)) + "";
        //????????????
        this.lblUpdateAt.string = GameUtils.timestampToTime(new Date(this.selectInfo.updatedAt)) + "";
        this.qrcodeNode.node.active = (tradeType == "buy" && this.payType != "bank" && this.selectInfo.status != "cancel" && this.selectInfo.status != "done") || (tradeType == "sell" && this.selectInfo.status != "wait");
        this.qrcodeDesc.string = tradeType == "buy" ? "?????????????????????" : "????????????????????????";

        if ((tradeType == "buy" && this.payType != "bank") || (tradeType == "sell" && this.selectInfo.status != "wait")) {

            let qrcodeUrl = tradeType == "buy" ? JSON.parse(this.selectInfo.seller[this.payType]).address : this.selectInfo.receipt;
            if (GameUtils.isNullOrEmpty(qrcodeUrl)) {
                this.qrcodeNode.spriteFrame = this.defaultSf
            } else {
                GameUtils.loadImg(GameConfig.GameInfo.resourceURL + qrcodeUrl).then((tex) => {
                    this.qrcodeNode.spriteFrame = tex;
                });

            }

        }
    }

    showQrCode() {

        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        let qrcodeUrl = this.selectInfo.buyer.id == GameConfig.ProxyData.id ? JSON.parse(this.selectInfo.seller[this.selectInfo.payType]).address : this.selectInfo.receipt;
        if (GameUtils.isNullOrEmpty(qrcodeUrl)) {
            Cache.alertTip(this.selectInfo.buyer.id == GameConfig.ProxyData.id ? "???????????????" : "???????????????????????????");
            return;
        }
        this.qrcodeMask.active = true;
        GameUtils.loadImg(GameConfig.GameInfo.resourceURL + qrcodeUrl).then((tex) => {
            this.qrcodeSpr.spriteFrame = tex;
        });
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
    }

    hideQrCode() {
        
        this.qrcodeSpr.node.stopAllActions();
        this.qrcodeSpr.node.runAction(cc.sequence(
            cc.scaleTo(0.2, 0),
            cc.callFunc(() => {
                this.qrcodeMask.active = false;
            })
        ));
    }

    saveQrCode() {
        
        let qrcodeUrl = JSON.parse(this.selectInfo.seller[this.selectInfo.payType]).address;
        GameUtils.SaveToLocal(GameConfig.GameInfo.resourceURL + qrcodeUrl, (filepath) => {
            if (filepath == "error ") {
                Cache.alertTip("????????????,???????????????")
            } else {
                Social.saveImage(filepath);
            }
        })

    }

    copyStr(e) {
        
        Cache.alertTip("????????????")
        Social.setCopy(e.currentTarget.getComponent(cc.Label).string);
    }

    /**???????????? */
    onClickCancel() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("??????????????????????\n\n?????????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.POTCCancelTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("????????????");
                this.downloadTrades();
            })
        })
    }

    /**????????? */
    onClickConfirm() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        var self = this;



        GameUtils.pop(GameConfig.pop.ConfirmReceiptPop, (node) => {
            node.getComponent("ConfirmReceiptPop").show("showConfirm", "?????????????????????", (receiptUrl) => {
                Connector.request(GameConfig.ServerEventName.POTCConfirmTrade, { tradeID: self.selectInfo.id, receipt: receiptUrl }, (data) => {
                    Cache.alertTip("??????????????????");
                    Cache.showConfirm("????????????????????????????????????", () => {
                        Social.makeCall("" + this.selectInfo.seller.phone)
                        self.downloadTrades();
                    }, () => {
                        self.downloadTrades();
                    })
                })
            })
        })
    }
    /**?????? */
    onClickProcess() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        var self = this;
        Cache.showConfirm("????????????" + GameConfig.ChannelName[this.selectInfo.payType] + "????????????????????????" + GameUtils.formatGold(this.selectInfo.amount) + "???,?????????????????????????????????????????????????????????",()=>{
            Connector.request(GameConfig.ServerEventName.POTCProcessTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("????????????");
                this.downloadTrades();
            })
        })
      
        // let codePre = cc.instantiate(this.codePre);
        // codePre.getComponent("MarketAccountCode").initData("????????????" + GameConfig.ChannelName[this.selectInfo.payType] + "????????????????????????" + GameUtils.formatGold(this.selectInfo.amount) + "???,?????????????????????????????????????????????????????????", (codeStr) => {
        //     Connector.request(GameConfig.ServerEventName.POTCProcessTrade, { tradeID: this.selectInfo.id, code: codeStr }, (data) => {
        //         Cache.alertTip("????????????");
        //         this.downloadTrades();
        //     })
        // }, null, 'proxyFinishtrade');


        // GameUtils.pop(GameConfig.pop.CheckTradePwd, (node) => {
        //     node.getComponent("CheckTradePwd").show("showConfirm", "????????????" + GameConfig.ChannelName[this.selectInfo.payType] + "????????????????????????" + GameUtils.formatGold(this.selectInfo.amount) + "???,?????????????????????????????????????????????????????????", (tradePwd) => {
        //         let encryptPwd = GameUtils.encryptToken(tradePwd);
        //         Connector.request(GameConfig.ServerEventName.POTCProcessTrade, { tradeID: this.selectInfo.id, password: encryptPwd }, (data) => {
        //             Cache.alertTip("????????????");
        //             this.downloadTrades(this.selectInfo.id);
        //         })
        //     })
        // })
    }

    /**?????? */
    onClickJudge() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("?????????????????????? ?????????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.POTCReportTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("????????????????????????");
                this.downloadTrades();

            })
        })
    }

    /**???????????? */
    onPleaseProcess() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("????????????,??????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.POTCPleaseProcess, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("??????????????????");
                this.downloadTrades();
            })
        })
    }
    /**???????????? */
    onPleaseCancel() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("????????????,????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.POTCPleaseCancel, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip("??????????????????");
                this.downloadTrades();
            })
        })
    }


    /**?????????????????? */
    enjoinChatRoom() {
        if (this.isInitRoom) return;
        this.isInitRoom = true;
        let id = this.selectInfo.seller.id == GameConfig.ProxyData.id ? this.selectInfo.buyer.id : this.selectInfo.seller.id;

        this.chatRoom.getComponent("GoEasyChat").initData(id, this.selectInfo, GoEasyConfig.ChatType.PRIVATE);

    }
    onSumbitData() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Social.openUrl(`${GameConfig.GameInfo.customeService}&metadata={"tel":"${GameConfig.ProxyData.phone}","name":"${GameConfig.ProxyData.name}","??????ID":"${GameConfig.ProxyData.id}","addr":"xyqp","tradeID":"${this.selectInfo.id}","sellerID":"${this.selectInfo.seller.id}","buyerID":"${this.selectInfo.buyer.id}"}`)
    }


    onCopyService() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        let str = `${GameConfig.GameInfo.customeService}&metadata={"tel":"${GameConfig.ProxyData.phone}","name":"${GameConfig.ProxyData.name}","??????ID":"${GameConfig.ProxyData.id}","addr":"xyqp","tradeID":"${this.selectInfo.id}","sellerID":"${this.selectInfo.seller.id}","buyerID":"${this.selectInfo.buyer.id}"}`
        Social.setCopy(str);

    }
    /**???????????????????????? */
    onServiceTrade() {
        
        if (GameUtils.isNullOrEmpty(this.selectInfo)) {
            Cache.alertTip("???????????????");
            return;
        }
        Cache.showConfirm("?????????????????????,?????????????????????????????????,?????????????????????????????????????????????", () => {
            Connector.request(GameConfig.ServerEventName.POTCServiceTrade, { tradeID: this.selectInfo.id }, (data) => {
                Cache.alertTip(this.selectInfo.buyer.id == GameConfig.ProxyData.id ? "??????????????????????????????" : "??????????????????????????????");
                this.downloadTrades();
            })
        })
    }
    /**???????????????????????? */
    deleteTradeDone(id) {
        let data = GameUtils.getValue("" + GameConfig.StorageKey.TradeWaitting + GameConfig.ProxyData.id, []);
        // if (data.length == 0) return;
        let newData = data.filter(e => { return e.tradeID != id })
        GameUtils.saveValue("" + GameConfig.StorageKey.TradeWaitting + GameConfig.ProxyData.id, newData);
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HIDE_TRADE_TIPS);
    }

    onClickPhone(e) {
        
        Social.setCopy(e.currentTarget.getComponent(cc.Label).string);
        Social.makeCall(e.currentTarget.getComponent(cc.Label).string);
    }

    onClickService() {
        
        Social.openUrl(`${GameConfig.GameInfo.customeService}&metadata={"tel":"${GameConfig.ProxyData.phone}","name":"${GameConfig.ProxyData.name}","qq":"${GameConfig.ProxyData.id}","addr":"xyqp","tradeID":"${this.selectInfo.id}","sellerID":"${this.selectInfo.seller.id}","buyerID":"${this.selectInfo.buyer.id}"}`)

    }

    onClickClose() {
        
        this.removeEvents()

        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


