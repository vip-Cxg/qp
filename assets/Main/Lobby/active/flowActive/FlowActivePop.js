// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../../GameBase/GameConfig");
const Connector = require("../../../NetWork/Connector");
const Cache = require("../../../Script/Cache");
const utils = require("../../../Script/utils");
let DataBase = require("../../../Script/DataBase");
const { App } = require("../../../../script/ui/hall/data/App");
cc.Class({
    extends: cc.Component,

    properties: {
        lblSelfFlow: cc.Label,
        lblSelfDesc: cc.Label,

        tips: cc.Label,
        rankAvatar: [require('../../../../script/ui/common/Avatar')],
        rankNode: [cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (!utils.isNullOrEmpty(GameConfig.TaskData))
            this.tips.string = GameConfig.TaskData.word
        this.downloadRank();

    },

    downloadRank() {
        Connector.request(GameConfig.ServerEventName.ActiveFlowRank, {}, (res) => {
            if (!utils.isNullOrEmpty(res.rank)) {
                res.rank.forEach((e, i) => {
                    if (e.user.head)
                        this.rankAvatar[i].avatarUrl = e.user.head;
                    this.rankNode[i].getChildByName("name").getComponent(cc.Label).string = '' + utils.getStringByLength(e.user.name, 4)
                    this.rankNode[i].getChildByName("score").getComponent(cc.Label).string = '' + ((parseInt(e.flow) / 100) || 0) + "元";
                });

                if (!utils.isNullOrEmpty(res.selfResult)) {
                    this.lblSelfFlow.string = '当前流水:' + ((res.selfResult.flow / 100) || 0) + '元';
                    this.lblSelfDesc.string = '与第一名相差' + (((parseInt(res.rank[0].flow) - parseInt(res.selfResult.flow)) / 100) || 0) + '元';

                }
            }
        })
    },
    openLastRank() {
        
        utils.pop(GameConfig.pop.ProxyRankPop)
    },

    onClickClose() {
        // utils.saveValue(GameConfig.StorageKey.ActiveDayTips, !this.notips.isChecked)
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

});




