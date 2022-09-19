 var { GameConfig } = require("../../../GameBase/GameConfig");
const { App } = require("../../../script/ui/hall/data/App");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
let DataBase = require("../../Script/DataBase");
const utils = require("../../Script/utils");
const payType = ["alipay", "weChat", "bank"];
cc.Class({
    extends: cc.Component,

    properties: {
        bgMask: cc.Sprite,
        payTypeToggle: [cc.Toggle],
        updateBtn: cc.Node,
        payTypeContainer: cc.Node,

        buyListScroll: cc.Node,
        buyListContent: cc.Node,
        noTrade: cc.Node,

        buyTradeItem: cc.Prefab,
        pageContainer: cc.Node,
        marketAccountInfo: cc.Prefab,
        selectAmountContainer: cc.Node,
        amountInput: cc.EditBox,
        btnBuy: cc.Toggle,

        layerContent: cc.Node,
        buyTradeList: cc.Prefab,
        createTradePage: cc.Prefab,
        rewardTradeItem: cc.Prefab,
        rewardContent: cc.Node,
        rewardTradeBtn: cc.Node,
        rewardDesc: cc.Node
    },

    start() {
        this.addEvents();
        this.handleTrade();
        if (utils.isNullOrEmpty(GameConfig.RewardConfig)) {
            this.rewardTradeBtn.active = false;
            this.selectPayType();
        } else {
            this.rewardTradeBtn.active = true;
            this.showRewardPage();
        }
    },

    addEvents() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.handleTrade, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.HIDE_TRADE_TIPS, this.hideTradeTips, this);
    },
    removeEvent() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.handleTrade, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HIDE_TRADE_TIPS, this.hideTradeTips, this);
    },

    selectPayType() {
        
        if (!this.payTypeToggle[0].isChecked && !this.payTypeToggle[1].isChecked && !this.payTypeToggle[2].isChecked) {
            Cache.alertTip("至少选择一种支付方式");
            this.payTypeToggle[1].isChecked = true;

            return;
        }

        App.lockScene();
        this.payTypeContainer.active = true;
        let reqData = [];
        payType.forEach((e, i) => {
            if (this.payTypeToggle[i].isChecked) {
                let obj = {};
                obj[e] = true;
                reqData.push(obj);
            }
        })

        this.downloadBuyMarkets(reqData);
    },

    addAmount() {
        
        let amount = parseInt(this.amountInput.string) || 0;

        amount += 100;

        this.amountInput.string = "" + amount;

    },
    reduceAmount() {
        
        let amount = parseInt(this.amountInput.string) || 0;
        amount -= 100;
        if (amount <= 0)
            amount = 0;
        this.amountInput.string = "" + amount;
    },

    /**下载购买订单列表 */
    downloadBuyMarkets(payType) {
        this.layerTopActive(true);
        this.removeContentChildren();

        let amount = parseInt(this.amountInput.string) || 100;
        //amount 下限
        Connector.request(GameConfig.ServerEventName.OTCMarkets, { payType, amount: amount * 100 }, (data) => {
            App.unlockScene();
            if (data.markets) {
                this.noTrade.active = false;
                data.markets.forEach((e, i) => {
                    let buyItem = cc.instantiate(this.buyTradeItem);
                    buyItem.getComponent("BuyTradeItem").initData(e);
                    this.buyListContent.addChild(buyItem);
                })
            }
        }, true, (err) => {
            App.unlockScene();
            this.noTrade.active = true;

        })
    },


    openAccountInfo() {
        
        let marketAccountInfo = cc.instantiate(this.marketAccountInfo);
        marketAccountInfo.getComponent('ModuleMarketAccount').renderData('player');
        this.pageContainer.addChild(marketAccountInfo);
    },


    /**购买订单列表 */
    showBuyList() {
        
        this.layerTopActive(false);
        this.removeContentChildren();

        let buyList = cc.instantiate(this.buyTradeList);
        buyList.getComponent("TradeList").downloadList(true);
        this.layerContent.addChild(buyList);
    },
    /**购买订单列表 */
    showSellList() {
        
        this.layerTopActive(false);
        this.removeContentChildren();

        let buyList = cc.instantiate(this.buyTradeList);
        buyList.getComponent("TradeList").downloadList(false);
        this.layerContent.addChild(buyList);
    },


    showSellPage() {
        
        if (utils.isNullOrEmpty(DataBase.player.alipay) && utils.isNullOrEmpty(DataBase.player.bank) && utils.isNullOrEmpty(DataBase.player.wechat)) {
            this.btnBuy.check();
            Cache.showConfirm("至少填写一种收款信息", () => {
                let marketAccountInfo = cc.instantiate(this.marketAccountInfo);
                marketAccountInfo.getComponent('ModuleMarketAccount').renderData('player');
                this.pageContainer.addChild(marketAccountInfo);
            })
            return;
        }
        this.layerTopActive(false);
        this.removeContentChildren();
        let buyList = cc.instantiate(this.createTradePage);
        this.layerContent.addChild(buyList);
    },

    layerTopActive(bool) {
        this.rewardDesc.active = !bool && !utils.isNullOrEmpty(GameConfig.RewardConfig);
        this.buyListScroll.active = bool;
        this.updateBtn.active = bool;
        this.payTypeContainer.active = bool;
        this.selectAmountContainer.active = bool;
    },

    removeContentChildren() {

        this.buyListContent.removeAllChildren();
        this.layerContent.removeAllChildren();
        this.rewardContent.removeAllChildren();
    },

    showRewardPage() {
        
        this.layerTopActive(false);
        this.removeContentChildren();
        GameConfig.RewardConfig.forEach((e, i) => {
            let rewardItem = cc.instantiate(this.rewardTradeItem);
            rewardItem.getComponent("RewardTradeItem").initData(e);
            this.rewardContent.addChild(rewardItem);
        })
    },

    /**有需要操作的交易 */
    handleTrade() {
        // let tradeData = utils.getValue("" + GameConfig.StorageKey.TradeWaitting + DataBase.player.id, []);
        // if (tradeData.length == 0) return;
        // //红点闪烁提示
        // this.tradeRed.active = true;
        // this.tradeBtn.stopAllActions();
        // let ap = cc.scaleTo(0.3, 1.2);
        // let bp = cc.scaleTo(0.3, 1);
        // let ag = cc.sequence(ap, bp).repeatForever();
        // this.tradeBtn.runAction(ag);
    },

    hideTradeTips() {
        // let tradeData = utils.getValue("" + GameConfig.StorageKey.TradeWaitting + DataBase.player.id, []);
        // if (tradeData.length > 0) return;
        // this.tradeRed.active = false;
        // this.tradeBtn.stopAllActions();
        // this.tradeBtn.scale = 1;
        // this.tradeBtn.rotation = 0;

    },

    /**关闭弹窗 */
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    onDestroy() {
        this.removeEvent();
    }

    // update (dt) {},
});
