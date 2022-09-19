import TableInfo from "../../Main/Script/TableInfo";
import PokerSelfCard from "./PokerSelfCard";

const { ccclass, property } = cc._decorator
@ccclass
export default class PokerPlayCard extends cc.Component {

    @property(cc.Prefab)
    preCards = null;
    @property(cc.Node)
    nodeFirst = null;
    @property(cc.Node)
    nodeDan = null;

    /**出牌动作 */
    action(card, i) {
        if (card)
            card.opacity = 0;
        card.scale = 1.4;
        card.runAction(cc.spawn(
            cc.scaleTo(0.05, 1),
            cc.fadeIn(0.05)
        ));
    }

    // use this for initialization
    init(data) {
        console.log("出牌--", data)
        let newCards = data.cards;// logic.sortPlayedCard(data);
        newCards.forEach((c, i) => {
            let nodePlayCards = cc.instantiate(this.preCards);
            nodePlayCards.scale = 0.6;
            nodePlayCards.getComponent(PokerSelfCard).init(c);
            nodePlayCards.parent = this.nodeFirst;
        })
        return;
    }

    /**
     * 
     * @param {object[]} data    
     */
    initRemainCard(data) {
        data.forEach(card => {
            let nodePlayCards = cc.instantiate(this.preCards);
            nodePlayCards.scale = 0.6;
            nodePlayCards.getComponent(PokerSelfCard).init(card);
            nodePlayCards.parent = this.nodeFirst;
        });
        // this.nodeFirst.getComponent(cc.Layout).spacingX = -45 - data.length * 3;
    }

    showCardAnim() {

    }
}


