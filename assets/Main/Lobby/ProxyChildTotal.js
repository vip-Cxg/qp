
 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        // totalItem: cc.Prefab,
        // itemContainer: cc.Node,
        lblCount:cc.Label,
        lblUserCount:cc.Label,
        lblProxyCount:cc.Label,
        lblWallet:cc.Label,
        lblUserWallet:cc.Label,
        lblProxyWallet:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // this.node.width = this.node.parent.width;
        // this.node.height = this.node.parent.height;
        // this.node.postion=cc.v2(this.node.parent.width/2+this.node.width/2,0);
        this.node.setPosition(cc.v2(this.node.parent.width / 2 + this.node.width / 2, 0))
        // this.enterPop();
    },
    enterPop() {

        let ap = cc.moveTo(0.3, cc.v2(0, 0));
        this.node.runAction(ap);
    },

    initData(data) {

        Connector.request(GameConfig.ServerEventName.ProxyDetail,{id:data,isLeague:GameConfig.ProxyIsLeague},(res)=>{
            this.lblCount.string=""+res.count;
            this.lblUserCount.string=""+res.userCount;
            this.lblProxyCount.string=""+res.proxyCount;
            this.lblWallet.string=""+utils.formatGold(res.wallet);
            this.lblUserWallet.string=""+utils.formatGold(res.userWallet);
            this.lblProxyWallet.string=""+utils.formatGold(res.proxyWallet);
        })
    },


    onClickClose() {
        // let ap = cc.moveTo(0.3, cc.v2(this.node.parent.width / 2 + this.node.width / 2, 0))
        // let bp = cc.sequence(ap, cc.callFunc(() => {
        //     this.node.removeFromParent();
        // }))
        // this.node.runAction(bp)
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
    // update (dt) {},
});
