import { GameConfig } from "../../GameBase/GameConfig";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";

const { ccclass, property } = cc._decorator
@ccclass
export default class ModuleFlowerMJ extends cc.Component {

    @property(cc.Prefab)
    card = null;

    cardCount = {};
    /**初始化花牌区 */
    initFlower(data, realIdx) {
        if (GameUtils.isNullOrEmpty(data))
            return;
        this.resetFlower();
        data.forEach((card, i) => {
            this.addFlower({ card }, realIdx);
        })
    }

    /**重置花牌区 */
    resetFlower() {
        this.cardCount = {};
        this.node.removeAllChildren();
    }

    /**添加一个花牌 */
    addFlower(data, realIdx) {
        let node = cc.instantiate(this.card);
        node._card = data.card;
        node.getComponent('ModuleGroundCardsMJ').init(data.card, realIdx);
        let cardIndex = this.node.childrenCount;
        if (TableInfo.options.gameType == GameConfig.GameType.QJHZMJ) {
            if (GameUtils.isNullOrEmpty(this.cardCount[data.card]))
                this.cardCount[data.card] = { x: Object.keys(this.cardCount).length, y: 0 };
            this.cardCount[data.card].y += 1;
            switch (realIdx) {
                case 0:
                    node.x = -(node.width - 2) / 2 - (node.width - 2) * this.cardCount[data.card].x;
                    node.y = 16 * this.cardCount[data.card].y;
                    break;
                case 1:
                    node.zIndex = this.cardCount[data.card].x;
                    node.x = this.cardCount[data.card].x * 6 + this.cardCount[data.card].y * 4;
                    node.y = - 30 * this.cardCount[data.card].x + this.cardCount[data.card].y * 15;
                    break;
                case 2:
                    node.x = (node.width - 2) / 2 + (node.width - 2) * this.cardCount[data.card].x;
                    node.y = 16 * this.cardCount[data.card].y;
                    break;
                case 3:
                    node.zIndex = 13 - this.cardCount[data.card].x;
                    node.x = this.cardCount[data.card].x * 6 - this.cardCount[data.card].y * 4;;
                    node.y = 30 * this.cardCount[data.card].x + this.cardCount[data.card].y * 15;
                    break;
            }
        } else {
            switch (realIdx) {
                case 0:
                    node.x = -(node.width - 2) / 2 - (node.width - 2) * cardIndex;
                    node.y = 0
                    break;
                case 1:
                    node.x = cardIndex * 6;
                    node.y = - 28 * cardIndex;
                    break;
                case 2:
                    node.x = (node.width - 2)/ 2 + (node.width - 2) * cardIndex;
                    node.y = 0
                    break;
                case 3:
                    node.zIndex = 13 - cardIndex;
                    node.x = cardIndex * 6;
                    node.y = 30 * cardIndex;
                    break;
            }
        }


        node.active = true;
        this.node.addChild(node);

        return node;
    }




    // update (dt) {},
}
