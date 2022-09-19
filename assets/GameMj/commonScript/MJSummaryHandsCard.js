import Cache from "../../Main/Script/Cache";
import TableInfo from "../../Main/Script/TableInfo";
const PositionIdx = ['bottom', 'right', 'top', 'left'];

const { ccclass, property } = cc._decorator
@ccclass
export default class MJSummaryHandsCard extends cc.Component {
    @property(cc.Node)
    handsCard = null;
    @property(cc.Node)
    huCard = null;



    _handsCard = [];
    realIdx = 0;
    renderUI(data) {
        this._handsCard = data.cards.concat();
        this.realIdx = data.realIdx;
        data.cards.forEach((card, i) => {
            if (i >= 13) return;
            this.handsCard.children[i].active = true;
            this.handsCard.children[i].getComponent('ModuleGroundCardsMJ').init(card, data.realIdx, data.hu != -1);
        });
        if (data.hu != -1) {
            Cache.playSound('hulight');
            this.huCard.active = data.hu != -1;
            this.huCard.getChildByName('card').getComponent('ModuleGroundCardsMJ').init(data.hu, data.realIdx)
            let lightAnim = this.huCard.getChildByName('ring').getComponent(sp.Skeleton);
            lightAnim.defaultSkin = 'default';
            lightAnim.node.active = true;
            lightAnim.setAnimation(1, 'idle', false);
            // new sp.Skeleton().setCompleteListener
            lightAnim.setCompleteListener(() => {
                lightAnim.node.active = false;
            })
        }

    }

    reset() {
        this.huCard.active = false;
        this.handsCard.children.forEach(element => {
            element.active = false;
        });
    }

    /**回放抓牌 */
    getCard(card, realIdx) {
        this._handsCard.push(card);
        this.huCard.active = true
        this.huCard.getChildByName('card').getComponent('ModuleGroundCardsMJ').init(card, realIdx)
    }

    removeCard(card, count = 1) {
        console.log('移除手牌', card, count, this._handsCard);
        let num = 0;
        for (let y = 0; y < this._handsCard.length; y++) {
            if (num >= count)
                return;
            if (card == this._handsCard[y]) {
                this._handsCard.splice(y, 1);
                console.log('移除手牌1', y);

                y--;
                num++;
            }
        }
        console.log('移除手牌2', this._handsCard);

        this.huCard.active = false;
        this.handsCard.children.forEach(element => {
            element.active = false;
        });

        let handsData = {
            cards: this._handsCard,
            realIdx: this.realIdx,//==1&&TableInfo.options.rules.person==2?2:idx,
            hu: -1
        };
        this.renderUI(handsData)

    }


}


