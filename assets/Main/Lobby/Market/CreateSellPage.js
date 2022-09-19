 var { GameConfig } = require('../../../GameBase/GameConfig');
const Connector = require('../../NetWork/Connector');
const Cache = require('../../Script/Cache');
const utils = require('../../Script/utils');
let DataBase = require("../../Script/DataBase");
const { App } = require('../../../script/ui/hall/data/App');
cc.Class({
    extends: cc.Component,

    properties: {
        btnConfirm: cc.Node,
        btnCancel: cc.Node,
        amountSlider: cc.Slider,
        amountProgress: cc.ProgressBar,
        amountFrozen: cc.Sprite,
        handNode: cc.Node,

        lastAmount: cc.Node,
        lblAmount: cc.Label,
        lblMax: cc.Label,
        lblMin: cc.Label,
        lblRemain: cc.Label,
        lblFrozen: cc.Label,
        amount: 0,
        // tradeType: "",
        marketData: null,
        maxAmount: 0
    },

    // use this for initialization
    onLoad: function () {
        this.amountSlider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveEnd, this);
        this.amountSlider.node.on(cc.Node.EventType.TOUCH_END, this.onMoveEnd, this);
        this.handNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveEnd, this);
        this.handNode.on(cc.Node.EventType.TOUCH_END, this.onMoveEnd, this);
        this.refreshUI();
    },
    refreshUI() {
        Connector.request(GameConfig.ServerEventName.OTCInfo, {}, (data) => {
            if (data.market) {
                if(data.market.status=='frozen')
                    Cache.showTipsMsg('该店铺已封禁,解封时间为'+new Date(parseInt(data.marketRight)).format('yyyy-MM-dd hh:mm:ss'));
                this.marketData = data.market;
                this.maxAmount = Math.min(GameConfig.GameInfo.otcConfig.SELL_MAX, Math.floor((this.marketData.frozen + DataBase.player.wallet + this.marketData.remain) / GameConfig.GameInfo.otcConfig.SELL_UNIT) * GameConfig.GameInfo.otcConfig.SELL_UNIT);
                this.lblMax.string = utils.formatGold(this.maxAmount) + "元";
                this.lblMin.string = utils.formatGold(0) + "元";
                this.lblAmount.string = "当前售卖的金额: " + utils.formatGold(this.marketData.frozen + this.marketData.remain) + "元";

                this.amount = this.marketData.frozen + this.marketData.remain
                this.lblFrozen.string = "冻结的金额：" + utils.formatGold(this.marketData.frozen) + "元";
                this.lblRemain.string = "剩余可售金额：" + utils.formatGold(this.maxAmount - this.marketData.frozen - this.marketData.remain) + "元";

                this.amountFrozen.fillRange = this.marketData.frozen / this.maxAmount;
                this.amountSlider.progress = (this.marketData.frozen + this.marketData.remain) / this.maxAmount;
                this.amountProgress.progress = (this.marketData.frozen + this.marketData.remain) / this.maxAmount;
                if (this.marketData.remain != 0 || this.marketData.frozen != 0) {
                    this.lastAmount.active = true;
                    this.lastAmount.position = cc.v2(-this.amountSlider.node.width / 2 + this.amountSlider.node.width * this.amountProgress.progress, 0)
                } else {
                    this.lastAmount.active = false;
                }
            }
        })
    },




    confirm() {
        
        let storageKey = "sellFastTips"
        let msg = "需要在对方付款后" + Math.floor(GameConfig.GameInfo.otcConfig.FAST_SELL_CONFIRM_TIMEOUT / 1000 / 60) + "分钟内放行"; //this.tradeType == "slow" ? "普通寄卖需要在对方付款后" + Math.floor(GameConfig.GameInfo.otcConfig.SLOW_SELL_CONFIRM_TIMEOUT / 1000 / 60 / 60) + "小时内放行" : "快速寄卖需要在对方付款后" + Math.floor(GameConfig.GameInfo.otcConfig.FAST_SELL_CONFIRM_TIMEOUT / 1000 / 60) + "分钟内放行";

        let isShow = utils.getValue(storageKey, false);
        if (isShow) {
            if (this.callback1 != null && this.marketData != null)
                this.callback1(this.amount);
            if (this.node)
                this.node.destroy();
            return;
        }
        Cache.showConfirm(msg, () => {
            if (this.callback1 != null && this.marketData != null)
                this.callback1(this.amount);
            if (this.node)
                this.node.destroy();
        }, () => {
        }, storageKey);



    },
    selectAmount(e) {
        this.amountProgress.progress = e.progress;
        let amount = e.progress * this.maxAmount;
        amount = Math.ceil((amount) / GameConfig.GameInfo.otcConfig.SELL_UNIT) * GameConfig.GameInfo.otcConfig.SELL_UNIT;
        this.amount = amount / 100;
        this.lblAmount.string = "当前售卖的金额: " + utils.formatGold(amount) + "元";
        this.lblRemain.string = "剩余可售金额：" + utils.formatGold(this.maxAmount - amount) + "元";
    },

    onMoveEnd() {
        if (this.amountSlider.progress < this.amountFrozen.fillRange)
            this.amountSlider.progress = this.amountFrozen.fillRange;
        let amount = this.amountSlider.progress * this.maxAmount;
        amount = Math.ceil((amount) / GameConfig.GameInfo.otcConfig.SELL_UNIT) * GameConfig.GameInfo.otcConfig.SELL_UNIT;
        this.amount = amount / 100;
        this.lblAmount.string = "当前售卖的金额: " + utils.formatGold(amount) + "元";
        this.lblRemain.string = "剩余可售金额：" + utils.formatGold(this.maxAmount - amount) + "元";
        this.amountProgress.progress = this.amountSlider.progress;
    },


    openMarketRule() {
        
        utils.pop(GameConfig.pop.MarketRulePop);
    },

    /**上架金币 */
    onClickEnsure() {
        
        var self = this;
        utils.pop(GameConfig.pop.CheckTradePwd, (node) => {
            node.getComponent("CheckTradePwd").show("showConfirm", "请输入交易密码,确保为本人操作", (tradePwd) => {
                let encryptPwd = utils.encryptToken(tradePwd);
                Connector.request(GameConfig.ServerEventName.OTCMarket, { total: self.amount * 100, tradeType: "fast", password: encryptPwd }, (data) => {
                    Cache.alertTip("寄售成功")
                    self.refreshUI();
                    DataBase.player.wallet = data.wallet;
                    App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_WALLET)
                });
            })
        })
    },
    /**下架金币 */
    onClickCancel() {
        
        var self = this;
        utils.pop(GameConfig.pop.CheckTradePwd, (node) => {
            node.getComponent("CheckTradePwd").show("showConfirm", "请输入交易密码,确保为本人操作", (tradePwd) => {
                let encryptPwd = utils.encryptToken(tradePwd);
                Connector.request(GameConfig.ServerEventName.OTCMarket, { total: 0 + (this.marketData.frozen || 0), tradeType: "fast", password: encryptPwd }, (data) => {
                    Cache.alertTip("下架成功")
                    this.refreshUI();
                    DataBase.player.wallet = data.wallet;
                    App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_WALLET)
                });
            })
        })


    }
});
