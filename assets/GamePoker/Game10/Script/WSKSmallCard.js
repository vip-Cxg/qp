import TableInfo from "../../../Main/Script/TableInfo"

const { ccclass, property } = cc._decorator
@ccclass
export default class WSKSmallCard extends cc.Component {


    @property(cc.SpriteAtlas)
    cardAtlas = null;

    init(card) {
        if (card % 100 >= 14)
            card = card % 100;

        switch (Math.floor(card / 100)) {
            case 1:
                card = 400 + card % 100;
                break;
            case 2:
                card = 300 + card % 100;
                break;
            case 3:
                card = 200 + card % 100;
                break;
            case 4:
                card = 100 + card % 100;
                break;
        }

        this.node.getComponent(cc.Sprite).spriteFrame = this.cardAtlas.getSpriteFrame('card_' + card);

    }

}


