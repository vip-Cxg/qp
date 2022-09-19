// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const { App } = require("../../../script/ui/hall/data/App");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const DataBase = require("../../Script/DataBase");
const utils = require("../../Script/utils");
cc.Class({
    extends: cc.Component,

    properties: {
        buyToggle: cc.Toggle,

        buyListScroll: cc.Node,
        sellListScroll: cc.Node,

        buyListContainer: cc.Node,
        sellListContainer: cc.Node,
        listItem: cc.Prefab,

        isBuy: true
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.addEvents();
        this.downloadBuyList()
    },
    addEvents() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshList, this);
    },
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshList, this);
    },
    downloadBuyList(e) {
        
        App.lockScene();
        this.isBuy = this.buyToggle.isChecked
        this.refreshList();
    },

    refreshList() {
        this.buyListScroll.active = this.isBuy;
        this.sellListScroll.active = !this.isBuy;
        this.buyListContainer.removeAllChildren();
        this.sellListContainer.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.OTCTrades, { buy: this.isBuy }, (data) => {
            App.unlockScene();
            if (data.trades.length > 0) {
                data.trades.forEach((e, i) => {
                    let listItem = cc.instantiate(this.listItem);

                    let tradeData = utils.getValue("" + GameConfig.StorageKey.TradeWaitting + DataBase.player.id, []);
                    listItem.getComponent("TradeListItem").initData(e,tradeData);
                    if (this.isBuy) {
                        this.buyListContainer.addChild(listItem);
                    } else {
                        this.sellListContainer.addChild(listItem);

                    }
                })
            }
        }, null, (err) => {
            Cache.showTipsMsg(err.message || "获取数据失败")
            App.unlockScene();

        })
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
    // update (dt) {},
});
