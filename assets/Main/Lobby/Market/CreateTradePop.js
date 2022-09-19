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

cc.Class({
    extends: cc.Component,

    properties: {
        amountInput: cc.EditBox,
        amountLbl: cc.Label,
        alipayBtn: cc.Toggle,
        wechatBtn: cc.Toggle,
        bankBtn: cc.Toggle,
        tradeInfoPop: cc.Prefab,
        payType: "",
        tradeData: null,


    },

    initData(data) {
        // alipay: true
        // bank: true
        // createdAt: "2021-01-21T09:33:04.000Z"
        // frozen: 0
        // id: 100018
        // rank: 0
        // remain: 300000
        // tradeType: "fast"
        // updatedAt: "2021-02-04T08:40:37.000Z"
        // user: {dealInfo: {…}, id: 100018, name: "AA一帆风顺", phone: "16812345678", alipay: "{"name":"100018","account":"没有账号","address":"qrcod…0-3ac3-4e4f-be77-564745767f68.jpg","active":true}", …}
        // wechat: false
        this.tradeData = data;
        this.amountLbl.string = "当前订单可交易金额: " + Math.min(data.remain / 100, 2000);
        this.alipayBtn.node.active = data.alipay;
        this.wechatBtn.node.active = data.wechat;
        this.bankBtn.node.active = data.bank;
    },
    selectPayType(e, v) {
        
        this.payType = v;
    },

    addAmount() {
        
        let amount = parseInt(this.amountInput.string) || 0;

        amount += 100;

        if (amount > Math.min(this.tradeData.remain / 100, 2000))
            amount = Math.min(this.tradeData.remain / 100, 2000);
        this.amountInput.string = "" + amount;

    },
    reduceAmount() {
        
        let amount = parseInt(this.amountInput.string) || 0;
        amount -= 100;
        if (amount <= 0)
            amount = 0;
        this.amountInput.string = "" + amount;
    },

    onClickEnsure() {
        
        let amount = parseInt(this.amountInput.string) || 0;
        if (amount <= 0 || amount > 2000) {
            Cache.alertTip("请输入订单范围内金额100~2000")
            return;
        }

        if (this.payType == "") {
            Cache.alertTip("请选择支付方式")
            return;
        }

        Connector.request(GameConfig.ServerEventName.OTCCreateTrade, { marketID: this.tradeData.id, amount: amount * 100, payType: this.payType, tradeType: this.tradeData.tradeType }, (data) => {
            let isShow = utils.getValue(GameConfig.StorageKey.CreateTrade, false)
            if (!isShow) {
                Cache.showTipsMsg("仔细核对对方收款账户信息,避免转错账户,（请保留付款凭证,作为申诉依据）", () => {
                    let tradeInfoPop = cc.instantiate(this.tradeInfoPop);
                    tradeInfoPop.getComponent("TradeInfoPage").downloadTrades(data.trade.id);
                    cc.find("Canvas").addChild(tradeInfoPop);
                    if (this.node) {
                        this.node.removeFromParent();
                        this.node.destroy();
                    }
                }, GameConfig.StorageKey.CreateTrade)
            } else {
                let tradeInfoPop = cc.instantiate(this.tradeInfoPop);
                tradeInfoPop.getComponent("TradeInfoPage").downloadTrades(data.trade.id);
                cc.find("Canvas").addChild(tradeInfoPop);
                if (this.node) {
                    this.node.removeFromParent();
                    this.node.destroy();
                }
            }


        }, true, (err) => {
            Cache.showTipsMsg(err.message || "购买失败", () => {
                if (this.node) {
                    this.node.removeFromParent();
                    this.node.destroy();
                }
            })
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
