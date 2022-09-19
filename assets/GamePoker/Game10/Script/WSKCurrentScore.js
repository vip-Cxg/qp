import TableInfo from "../../../Main/Script/TableInfo"
import PokerSelfCard from "../../commonScript/PokerSelfCard";
import WSKSmallCard from "./WSKSmallCard";

const { ccclass, property } = cc._decorator
@ccclass
export default class WSKCurrentScore extends cc.Component {

    @property(cc.Label)
    lblCurrentScore = null;
    @property(cc.Node)
    bigCardContent = null;
    @property(cc.Node)
    smallCardContent = null;
    @property(cc.Prefab)
    bigCard = null;
    @property(cc.Prefab)
    smallCard = null;

    renderUI(creditPool = []) {
        let currentScore = 0;
        this.bigCardContent.removeAllChildren();
        this.smallCardContent.removeAllChildren();
        creditPool.forEach((card, i) => {
            if (card % 100 == 10 || card % 100 == 13)
                currentScore += 10;
            if (card % 100 == 5)
                currentScore += 5;
            if (creditPool.length > 7) {//小牌
                let cardItem = cc.instantiate(this.smallCard);
                cardItem.getComponent(WSKSmallCard).init(card);
                this.smallCardContent.addChild(cardItem);
            } else {//大牌
                let cardItem = cc.instantiate(this.bigCard);
                cardItem.scale = 0.4
                cardItem.getComponent(PokerSelfCard).init(card);
                this.bigCardContent.addChild(cardItem);
            }
        })
        this.lblCurrentScore.string = '' + currentScore;
    }


    reset() {
        // TableInfo.creditCards=[];
        this.lblCurrentScore.string = '0';
        this.bigCardContent.removeAllChildren();
        this.smallCardContent.removeAllChildren();
    }

}




