// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const utils = require('../../Script/utils');

cc.Class({
    extends: cc.Component,

    properties: {
        lblRank: cc.Label,
        lblName: cc.Label,
        lblID: cc.Label,
        nodeOther: cc.Node,
        lblAmount: cc.Label,
        lblTurn: cc.Label,

        nodeSelf: cc.Node,
        sprIcon: cc.Sprite,
        sfAdd: cc.SpriteFrame,
        sfReduce: cc.SpriteFrame,
        lblRankChange: cc.Label
    },

    refreshUI(data) {
        this.lblRank.string = "" + data.rank;
        this.lblName.string = "" + utils.getStringByLength(data.name, 5);
        this.lblID.string = "ID:" + data.proxyID;
        this.nodeOther.active = !data.isSelf;
        this.nodeSelf.active = data.isSelf;
        if (data.isSelf) {
            this.lblRankChange.string = data.trend ? "" + Math.abs(data.trend) : "-";
            this.sprIcon.spriteFrame = data.trend >= 0 ? this.sfAdd : this.sfReduce;
            this.lblRankChange.node.color = data.trend >= 0 ? new cc.color("#FF422A") : new cc.color("#52C41B");

            this.lblRank.node.color = new cc.color("#FC8952");
            this.lblName.node.color = new cc.color("#FC8952");
            this.lblID.node.color = new cc.color("#FC8952");
        } else {
            this.lblTurn.string = data.turn < 0 ? "约" + Math.abs(data.turn) + "局超越你" : "约" + Math.max(data.turn, 1) + "局可超越他";
            this.lblAmount.string = "相差" + Math.abs(data.amount) + "元";
        }
    }

});
