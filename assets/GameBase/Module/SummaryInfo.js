
const TableInfo = require("../../Main/Script/TableInfo");
const utils = require("../../Main/Script/utils");
var { GameConfig } = require("../GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        roomId: cc.Label,
        time: cc.Label,
        version: cc.Label,
        lblOther: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (this.time)
            this.time.string = utils.timestampToTime(new Date().getTime());
        if (TableInfo.options && TableInfo.options.tableID)
            this.roomId.string = "房号: " + TableInfo.options?.tableID
        if (TableInfo.options)
            this.version.string = "玩法: " + TableInfo.ruleDesc[0] + ' 底分: ' + TableInfo.options?.rules.base + ' 局数: ' + TableInfo.round + '/' + TableInfo.options?.rules.turn;
        if (this.lblOther)
            this.lblOther.string = "其他: " + TableInfo.ruleDesc[1].join(' || ');
    },




    // update (dt) {},
});
