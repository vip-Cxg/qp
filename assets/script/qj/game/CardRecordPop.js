import PokerSelfCard from "../../../GamePoker/commonScript/PokerSelfCard";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator
@ccclass
export default class CardRecordPop extends cc.Component {
    @property([cc.Node])
    idxContent = [];
    @property([cc.Node])
    passContent = [];
    @property(cc.Prefab)
    cardItem = null;

    init() {
        this.idxContent.forEach((e) => {
            e.removeAllChildren();
        })
        if (GameUtils.isNullOrEmpty(TableInfo.cardRecord)) return;
        TableInfo.cardRecord.forEach((e) => {
            let idx = TableInfo.realIdx[e.data.idx];

            if (e.event == 'PASS') {
                this.passContent[idx].active = true;
                return;
            }
            e.data.cards.forEach((card) => {
                let cardItem = cc.instantiate(this.cardItem);
                cardItem.scale *= 0.6;
                cardItem.getComponent(PokerSelfCard).init(card);
                this.idxContent[idx].addChild(cardItem);
            })
        });

    }

    onClickClose() {
        this.node.destroy();
    }



}


