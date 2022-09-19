
 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        totalItem: cc.Prefab,
        itemContainer: cc.Node,
        tagShuffle: cc.Node,
        tagSubsidy: cc.Node,
        gameType: "PDK_SOLO",
        userData: [],
        proxyData: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tagShuffle.active = GameConfig.ProxyData.shuffle != 0;
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
        this.itemContainer.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.ProxyTotalEarn, { gameType: this.gameType, isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (!utils.isNullOrEmpty(data.result)) {
                this.refreshUI(data.result);
            }

        });



    },

    refreshUI(data) {
        // let data = this.tagType == "USER_RECHARGE" ? this.userData : this.proxyData;
        this.itemContainer.removeAllChildren();
        data.forEach((e) => {
            let item = cc.instantiate(this.totalItem);
            if (GameConfig.ProxyData.shuffle == 0) {
                item.getChildByName("content").getChildByName("shuffle").active = false;
            } else {
                item.getChildByName("content").getChildByName("shuffle").getComponent(cc.Label).string = "" + ((e.shuffle / 100) || 0) + '元';
            }
            if(this.gameType == "LDZP_SOLO"){
                item.getChildByName("content").getChildByName("subsidy").active=true;
                item.getChildByName("content").getChildByName("subsidy").getComponent(cc.Label).string = "" + ((e.subsidy / 100) || 0) + '元';
            }

            item.getChildByName("content").getChildByName("time").getComponent(cc.Label).string = "" + e.strDate;
            item.getChildByName("content").getChildByName("user").getComponent(cc.Label).string = "" + (e.user / 100) + "元";
            item.getChildByName("content").getChildByName("proxy").getComponent(cc.Label).string = "" + (e.proxy / 100) + '元';
            this.itemContainer.addChild(item);
        })
    },

    selectType(e, v) {
        
        if (this.gameType == v) return;
        this.gameType = v;
        this.tagSubsidy.active = this.gameType == "LDZP_SOLO";
        this.downloadRechargeData();
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
