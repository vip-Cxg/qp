// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../GameBase/GameConfig");
const Cache = require("../Script/Cache");

cc.Class({
    extends: cc.Component,

    properties: {
        webNode: cc.WebView,
        lblNotice: cc.Label,
    },

    start() {
        this.webNode.url = GameConfig.ConfigUrl + "info/proxy_gonggao.html";
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
    // update (dt) {},

    // <div class="bt-q">
    //     <p>【交易所最新活动】</p>
    // </div>
    // <div class="lr-w">
    //     <p>条件一：代理名下玩家需要在交易所成功购买2次金币</p>
    //     <p>条件二：在购买成功后进行100小局对局(或20局放炮罚)</p>
    //    <p>玩家满足两个条件代理即可获得100金币奖励(每名玩家限一次),请联系客服核实发放奖励。</p>
    // </div>
});
