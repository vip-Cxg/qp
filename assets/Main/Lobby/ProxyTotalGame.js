
 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        totalItem: cc.Prefab,
        itemContainer: cc.Node,
        tagType: "PDK_SOLO",
        PDKData: [],
        LDZPData: [],
        XHZDData: [],
        HZMJData: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // this.node.width = this.node.parent.width;
        // this.node.height = this.node.parent.height;
        // // this.node.postion=cc.v2(this.node.parent.width/2+this.node.width/2,0);
        // this.node.setPosition(cc.v2(this.node.parent.width / 2 + this.node.width / 2, 0))
        this.downloadRechargeData();
        // this.enterPop();
    },
    enterPop() {
        // setTimeout(() => {

        let ap = cc.moveTo(0.3, cc.v2(0, 0));
        this.node.runAction(ap);
        // }, 2000);
    },

    downloadRechargeData() {
        // let testData = [
        //     { proxyID: 1001, gameType: "LDZP_SOLO", count: 12 },
        //     { proxyID: 1001, gameType: "PDK_SOLO", count: 188 },
        //     { proxyID: 1001, gameType: "XHZD", count: 30 },
        //     { proxyID: 1002, gameType: "PDK_SOLO", count: 24 },
        //     { proxyID: 1006, gameType: "LDZP_SOLO", count: 1 },
        //     { proxyID: 1006, gameType: "XHZD", count: 10 },
        //     { proxyID: 1013, gameType: "LDZP_SOLO", count: 1 },

        // ]

        // {strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0"}
        Connector.request(GameConfig.ServerEventName.ProxyTotalGame, { isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (data.list.length > 0) {
                data.list.forEach((e) => {
                    switch (e.gameType) {
                        case GameConfig.GameType.PDK_SOLO:
                            this.PDKData.push(e);
                            break;
                        case GameConfig.GameType.LDZP_SOLO:
                            this.LDZPData.push(e);
                            break;
                        case GameConfig.GameType.XHZD:
                            this.XHZDData.push(e);
                            break;
                        case GameConfig.GameType.HZMJ_SOLO:
                            this.HZMJData.push(e);
                            break;
                    }
                })

                this.refreshUI();
            }
        });



    },

    refreshUI() {
        let data = [];
        switch (this.tagType) {
            case GameConfig.GameType.PDK_SOLO:
                data = this.PDKData;
                break;
            case GameConfig.GameType.LDZP_SOLO:
                data = this.LDZPData;
                break;
            case GameConfig.GameType.XHZD:
                data = this.XHZDData;
                break;
            case GameConfig.GameType.HZMJ_SOLO:
                data = this.HZMJData;
                break;
        }
        this.itemContainer.removeAllChildren();
        data.forEach((e) => {
            let item = cc.instantiate(this.totalItem);
            item.getChildByName("time").getComponent(cc.Label).string = "" + e.logFlag;
            // pdk  "房卡 177 （小局 1772）";
            // ldzp  "房卡: 177 ";
            // xhzd  "房卡 177 （小局 1772）";

            item.getChildByName("count").getComponent(cc.Label).string = this.tagType == GameConfig.GameType.LDZP_SOLO ? "房卡:" + Math.floor(e.count / 10) : "房卡:" + Math.floor(e.count / 10) + "（小局 " + e.count + "）";
            this.itemContainer.addChild(item);
        })
    },

    selectType(e, v) {
        
        if (this.tagType == v) return;
        this.tagType = v;
        this.refreshUI();
    },

    onClickClose() {
        let ap = cc.moveTo(0.3, cc.v2(this.node.parent.width / 2 + this.node.width / 2, 0))
        let bp = cc.sequence(ap, cc.callFunc(() => {
            if (this.node) {
                this.node.removeFromParent();
                this.node.destroy();
            }
        }))
        this.node.runAction(bp)
    }
    // update (dt) {},
});
