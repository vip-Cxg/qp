
let TableInfo = require('TableInfo');
var { GameConfig } = require('../../GameBase/GameConfig');
const utils = require('../../Main/Script/utils');
cc.Class({
    extends: cc.Component,

    properties: {
        // content: cc.Sprite,
    },
    init(card, realIdx, summary = false) {
        //弃牌
        if (card == 0) //红中 
            card = 35;
        if (this.node.getChildByName('count')) {
            if (card == 35)
                console.log("pai--", cc.gameConfig.MJCard.getSpriteFrame(realIdx + "_" + card))
            this.node.getChildByName('count').getComponent(cc.Sprite).spriteFrame = cc.gameConfig.MJCard.getSpriteFrame(realIdx + "_" + card);
        }

        if (this.node.getChildByName("lai") && !utils.isNullOrEmpty(TableInfo.special)) {
            this.node.color = TableInfo.special?.lai == card ? new cc.color('#F6E33B') : new cc.color('#ffffff');
            this.node.getChildByName("lai").active = TableInfo.special?.lai == card;
            // this.node.getChildByName("blue").active = true;
        }

        if (this.node.getChildByName("chao") && !utils.isNullOrEmpty(TableInfo.special)) {
            // console.log("acaas",card)
            this.node.getChildByName("chao").active = TableInfo.special?.chao == card;
        }
        if (this.node.getChildByName("light") && summary) {
            let lightAnim = this.node.getChildByName("light").getComponent(sp.Skeleton);
            lightAnim.defaultSkin = 'default';
            lightAnim.node.active = true;
            lightAnim.setAnimation(1, 'idle', false);
            // new sp.Skeleton().setCompleteListener
            lightAnim.setCompleteListener(() => {
                lightAnim.node.active = false;
            })
        }

    }


    // update (dt) {},
});
