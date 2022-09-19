let tbInfo = require("TableInfo");
 var { GameConfig } = require("../../../GameBase/GameConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        // sprNumber: cc.Sprite,
        // sprType: cc.Sprite,
        // sprFramNumberBlack: [cc.SpriteFrame],
        // sprFramNumberRed: [cc.SpriteFrame],
        // sprFramSize: [cc.SpriteFrame],
        bgCardMask: cc.Node,
        back: cc.SpriteFrame
        // _value: 0,
        // _card: 0
    },

    init (cardSpr) {
        if (cardSpr == -1) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.back;
            return;
        }
        this.node.getComponent(cc.Sprite).spriteFrame = cc.gameConfig.PorketAtlas.getSpriteFrame("" + cardSpr);// cardSpr;
        this.bgCardMask.active = false;
        // let type = parseInt((data) / 100);
        // let number = data % 100;
        // this.sprType.spriteFrame = this.sprFramSize[type];
        // this.sprNumber.spriteFrame = (type == 1 || type == 3) ? this.sprFramNumberBlack[number] : this.sprFramNumberRed[number];
    }
});
