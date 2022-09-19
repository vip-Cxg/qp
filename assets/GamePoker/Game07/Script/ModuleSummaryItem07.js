let connector = require("Connector");
let ROUTE = require("ROUTE");
let TableInfo = require("../../../Main/Script/TableInfo");
let utils = require("../../../Main/Script/utils");
cc.Class({
    extends: cc.Component,

    properties: {


        //名字
        lblName: cc.Label,
        //剩余牌数
        cardContent: cc.Node,
        cardItem: cc.Prefab,
        //炸弹
        lblBomb: cc.Label,
        //春天
        lblSpr: cc.Label,
        //分数
        lblScore: cc.Label,
        //分数
        zhongniao: cc.Node,

    },

    initData(data, winner) {
        if (data.idx == TableInfo.idx) {
            this.lblName.node.color = cc.color(255, 217, 0, 255);
            this.lblSpr.node.color = cc.color(255, 217, 0, 255);
            this.lblScore.node.color = cc.color(255, 217, 0, 255);
            this.lblBomb.node.color = cc.color(255, 217, 0, 255);
        }



        //显示赢家
        // this.winIcon.active = data.idx == winner;


        this.lblBomb.string = "" + Math.max(data.scores.bomb, 0);
        try {
            //名字
            this.lblName.string = utils.getStringByLength(TableInfo.players[data.idx].prop.name, 5);
        } catch (error) {
            //名字
            this.lblName.string = "玩家已离开";
        }


        let isHaveTen = false;

        this.cardContent.removeAllChildren();
        data.origin.forEach(element => {
            let cardItem = cc.instantiate(this.cardItem);
            cardItem.getComponent('ModuleCards07').init(element);
            cardItem.scale = 0.38;
            if (element == 210)
                isHaveTen = true
            if (data.hands.indexOf(element) == -1)
                cardItem.color = cc.color(99, 99, 99, 255);
            this.cardContent.addChild(cardItem);
        });

        this.zhongniao.active=isHaveTen&&TableInfo.options?.rules.heartsTenHasBird;

        //是否春天
        this.lblSpr.string = data.scores.spring;


        this.lblScore.string = '' + utils.formatGold(data.scores.turn);

    },

});
