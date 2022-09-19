
 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        totalItem: cc.Prefab,
        itemContainer: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // this.node.width = this.node.parent.width;
        // this.node.height = this.node.parent.height;
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
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        //     { date: "2020-12-17", count: 1 },
        // ]

        Connector.request(GameConfig.ServerEventName.ProxyTotalUser, { isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (data.users.length > 0) {
                this.refreshUI(data.users);
            }
        });




    },

    refreshUI(data) {
        this.itemContainer.removeAllChildren();
        data.forEach((e) => {
            let item = cc.instantiate(this.totalItem);
            item.getChildByName("time").getComponent(cc.Label).string = "" + e.date;
            item.getChildByName("count").getComponent(cc.Label).string = "" + e.count;
            this.itemContainer.addChild(item);
        })
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
