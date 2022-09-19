const { ccclass, property } = cc._decorator
@ccclass
export default class PokerSelfCard extends cc.Component {

    @property(cc.SpriteFrame)
    back = null;

    init(cardSpr) {
        if (cardSpr == -1) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.back;
            return;
        }
        if (cardSpr % 100 == 17)
            cardSpr = 65
        if (cardSpr % 100 == 18)
            cardSpr = 66

        switch (Math.floor(cardSpr / 100)) {
            case 1:
                cardSpr = 400 + cardSpr % 100;
                break;
            case 2:
                cardSpr = 300 + cardSpr % 100;
                break;
            case 3:
                cardSpr = 200 + cardSpr % 100;
                break;
            case 4:
                cardSpr = 100 + cardSpr % 100;
                break;
        }

        if (this.node.getChildByName('scoreIcon'))
            this.node.getChildByName('scoreIcon').active = cardSpr % 100 == 5 || cardSpr % 100 == 10 || cardSpr % 100 == 13;
        this.node.getComponent(cc.Sprite).spriteFrame = cc.gameConfig.PorketAtlas.getSpriteFrame("" + cardSpr);// cardSpr;
        return cardSpr;
        // this.bgCardMask.active = false;
        // let type = parseInt((data) / 100);
        // let number = data % 100;
        // this.sprType.spriteFrame = this.sprFramSize[type];
        // this.sprNumber.spriteFrame = (type == 1 || type == 3) ? this.sprFramNumberBlack[number] : this.sprFramNumberRed[number];
    }

}


