// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const utils = require("../../Script/utils")

cc.Class({
    extends: cc.Component,

    properties: {
        container: cc.Node,
        rankItem: cc.Prefab,
        noData: cc.Node,
        proxyNode: cc.Node,
        lblRank: cc.Label,
        lblReward: cc.Label,
        lblAmount: cc.Label,
        rankList_1: [],
        rankList_2: [],
        rankList: [],
        rankList_3: [],

        level: 1
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.renderUI();

    },
   
    handleList(index, list) {
        // this.noData.active = false;
        // this.lblRank.string = "" + list[index].rank;
        // this.lblReward.string = list[index].reward / 100 + "元";
        // this.lblAmount.string = list[index].amount + "元";

        // if (index < 5) {
        //     this.rankList = list.slice(0, 10);
        // }else if(list.length - 1 - index < 5){
        //     this.rankList = list.slice(list.length-11);

        // }else{
        //     this.rankList = list.slice(index-5, index+5);
        // }

        // let startIndex = index >= 5 ? index - 5 : 0;
        // let endIndex = list.length - 1 - index < 4 ? list.length - 1 : index + 4;

        // this.rankList = list.slice(startIndex, endIndex);

    },
    renderUI() {

        // if (!utils.isNullOrEmpty(GameConfig.TaskData)) {
        //     this.tips.string = GameConfig.TaskData.word
        //     if (!utils.isNullOrEmpty(GameConfig.TaskData.rank)) {
        //         GameConfig.TaskData.rank.forEach((e, i) => {
        //             if (e.user.head)
        //                 utils.setHead(this.rankAvatar[i], e.user.head);
        //             this.rankNode[i].getChildByName("name").getComponent(cc.Label).string = '' + utils.getStringByLength(e.user.name, 4)
        //             this.rankNode[i].getChildByName("score").getComponent(cc.Label).string = '' + e.reward / 100 + "元";
        //         });
        //     }

        // }

        this.container.removeAllChildren();
        if (utils.isNullOrEmpty(GameConfig.TaskData)||utils.isNullOrEmpty(GameConfig.TaskData.rank)) {
            this.noData.active = true;
            return;
        }
        this.noData.active = false;
     
        GameConfig.TaskData.rank.forEach((element,index) => {
            let rankItem = cc.instantiate(this.rankItem);
            let content = rankItem.getChildByName("content");
            content.getChildByName("rank").getComponent(cc.Label).string = ''+(index+1);
            content.getChildByName("name").getComponent(cc.Label).string = '' + utils.getStringByLength(element.user.name, 4)
            content.getChildByName("amount").getComponent(cc.Label).string = parseInt(element.sumScore)/100 + "元";
            content.getChildByName("reward").getComponent(cc.Label).string = element.reward / 100 + "元";

            this.container.addChild(rankItem);

        });
    },
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    // update (dt) {},
});
