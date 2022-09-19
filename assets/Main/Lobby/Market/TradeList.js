
 var { GameConfig } = require("../../../GameBase/GameConfig");
const { App } = require("../../../script/ui/hall/data/App");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const DataBase = require('../../Script/DataBase');
const utils = require('../../Script/utils');
cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        listItem: cc.Prefab,
        noData: cc.Node,
        isBuy: true,
        renderType: 'player'
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad() {
        this.addEvents();
    },
    addEvents() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshList, this);
    },
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.SHOW_TRADE_TIPS, this.refreshList, this);
    },
    refreshList() {
        this.downloadList(this.isBuy, this.renderType);
    },
    downloadList(isBuy, renderType = 'player') {
        this.isBuy = isBuy;
        this.renderType = renderType;
        App.unlockScene();
        this.container.removeAllChildren();

        let method = renderType == 'player' ? GameConfig.ServerEventName.OTCTrades : GameConfig.ServerEventName.POTCTrades;

        Connector.request(method, { buy: this.isBuy }, (data) => {
            App.unlockScene();
            if (data.trades.length > 0 ) {
                this.noData.active = false;
                data.trades.forEach((e, i) => {
                    let listItem = cc.instantiate(this.listItem);
                    let tradeData = utils.getValue("" + GameConfig.StorageKey.TradeWaitting + DataBase.player.id, []);
                    listItem.getComponent("TradeListItem").initData(e, tradeData, renderType);
                    this.container.addChild(listItem);
                })
            } else {
                if (this.noData)
                    this.noData.active = true;

            }
        }, true, (err) => {
            this.noData.active = true;
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
