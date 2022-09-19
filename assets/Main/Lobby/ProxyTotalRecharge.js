
 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        totalItem: cc.Prefab,
        itemContainer: cc.Node,
        tagType: "USER_RECHARGE",
        userData: [],
        proxyData: []
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
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "456324" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "123", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "1", walletOut: "0" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "2", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "12" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "23" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "23", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "34600", walletOut: "123" },
        //     { strDate: "20201216", reason: "USER_RECHARGE", walletIn: "123", walletOut: "0" },
        //     { strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0" },
        // ]

        // {strDate: "20201216", reason: "PROXY_RECHARGE", walletIn: "34600", walletOut: "0"}
        Connector.request(GameConfig.ServerEventName.ProxyTotalRecharge, { isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (data.list.length > 0) {
                data.list.forEach((e) => {
                    switch (e.reason) {
                        case "USER_RECHARGE":
                            this.userData.push(e);
                            break;
                        case "PROXY_RECHARGE":
                            this.proxyData.push(e);
                            break;
                    }
                })

                this.refreshUI();
            }
        });



    },

    refreshUI() {
        let data = this.tagType == "USER_RECHARGE" ? this.userData : this.proxyData;
        this.itemContainer.removeAllChildren();
        data.forEach((e) => {
            let item = cc.instantiate(this.totalItem);
            item.getChildByName("time").getComponent(cc.Label).string = "" + e.strDate;
            item.getChildByName("in").getComponent(cc.Label).string = "" + utils.formatGold(e.walletIn);
            item.getChildByName("out").getComponent(cc.Label).string = "" + utils.formatGold(e.walletOut);
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
