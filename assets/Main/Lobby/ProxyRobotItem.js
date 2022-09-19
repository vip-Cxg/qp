// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../GameBase/GameConfig");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        lblName: cc.Label,
        countBox: cc.EditBox,
        itemKey: null,
        itemData: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    refreshUI(data, key) {
        this.itemData = data;
        this.itemKey = key;
        this.lblName.string = "" + data.name;
        this.countBox.string = "" + data.cnt;
    },

    editedProfit(e) {


        if (utils.isNullOrEmpty(this.itemData) || utils.isNullOrEmpty(this.itemKey)) {

            return;
        }
        let count = parseInt(e.string)
        let value = utils.isNullOrEmpty(count) ? "0" : "" + count;

        utils.dispatchAllEvent(this.node, GameConfig.GameEventNames.PROXY_CHANGE_ROBOT, { value: value, key: this.itemKey })
    },
    // update (dt) {},
});
