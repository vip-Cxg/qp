import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../../script/common/GameUtils";
import PokerSelfCard from "../../commonScript/PokerSelfCard";

const { ccclass, property } = cc._decorator
@ccclass
export default class WSKTeamHands extends cc.Component {

    @property(cc.Prefab)
    cardItem = null;

    type = 'teamMateHands';

    idx = -1;

    _handsCard = [];

    /**手牌 */
    get handsCard() {
        return this._handsCard;
    }

    set handsCard(v) {
        this._handsCard = v;
        this.renderHandCards();
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.sortCard, this);
    }

    renderHandCards() {
        this.node.removeAllChildren();
        console.log("对家手牌=-",this._handsCard)
        if (GameUtils.isNullOrEmpty(this._handsCard)) return;
        switch (this.sortType) {
            case 0: //从大到小排序
                this._handsCard.sort((a, b) => b % 100 - a % 100 || b - a);
                break;
            case 1:
                let scoreArr = this._handsCard.filter(v => { return v % 100 == 5 || v % 100 == 10 || v % 100 == 13 });
                let normalArr = this._handsCard.filter(v => { return v % 100 != 5 && v % 100 != 10 && v % 100 != 13 });
                scoreArr.sort((a, b) => b % 100 - a % 100 || b - a);
                normalArr.sort((a, b) => b % 100 - a % 100 || b - a);
                this._handsCard = scoreArr.concat(normalArr);
                break;
            case 2:
                this._handsCard.sort((a, b) => b % 100 - a % 100 || b - a);
                let otherArr = this._handsCard.filter(v => { return v % 100 != 5 && v % 100 != 10 && v % 100 != 13 })
                let bombCount = new Array(19);
                otherArr.forEach((c, i) => {
                    if (!bombCount[c % 100])
                        bombCount[c % 100] = [];
                    bombCount[c % 100].push(c);
                })
                bombCount.reverse();
                bombCount.sort((a, b) => b.length - a.length);
                let bombArr = [];
                let otherCard = [];
                for (let i = 0; i < 19; i++) {
                    if (GameUtils.isNullOrEmpty(bombCount[i]))
                        continue;
                    if (bombCount[i].length >= 4) {
                        bombArr = bombArr.concat(bombCount[i])
                    } else if (bombCount[i].length > 0) {
                        otherCard = otherCard.concat(bombCount[i])
                    }
                }
                otherCard.sort((a, b) => b % 100 - a % 100 || b - a);
                let wArr = new Array(5).fill(0);
                let sArr = new Array(5).fill(0);
                let kArr = new Array(5).fill(0);
                this._handsCard.forEach((card) => {
                    if (card % 100 == 5)
                        wArr[Math.floor(card / 100)] += 1;
                    if (card % 100 == 10)
                        sArr[Math.floor(card / 100)] += 1;
                    if (card % 100 == 13)
                        kArr[Math.floor(card / 100)] += 1;
                })
                let wArr1 = this._handsCard.filter(v => { return v % 100 == 5 }).sort((a, b) => b - a);
                let sArr1 = this._handsCard.filter(v => { return v % 100 == 10 }).sort((a, b) => b - a);
                let kArr1 = this._handsCard.filter(v => { return v % 100 == 13 }).sort((a, b) => b - a);
                let zWsk = [];
                for (let i = 0; i < 5; i++) {
                    if (wArr[i] > 0 && sArr[i] > 0 && kArr[i] > 0) {
                        let cards = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                        zWsk = zWsk.concat(cards);
                        wArr[i] -= 1;
                        sArr[i] -= 1;
                        kArr[i] -= 1;
                        wArr1.splice(wArr1.findIndex(v => v == (i * 100 + 5)), 1);
                        sArr1.splice(sArr1.findIndex(v => v == (i * 100 + 10)), 1);
                        kArr1.splice(kArr1.findIndex(v => v == (i * 100 + 13)), 1);
                        i--;
                    }
                }
                let count = Math.min(wArr1.length, sArr1.length, kArr1.length);
                let wskArr = [];
                for (let i = 0; i < count; i++) {
                    let wsk = [wArr1[i], sArr1[i], kArr1[i]];
                    wskArr = wskArr.concat(wsk);
                    wArr1[i] = null;
                    sArr1[i] = null;
                    kArr1[i] = null;
                }
                otherCard = otherCard.concat(kArr1.filter(v => { return v != null }));
                otherCard = otherCard.concat(sArr1.filter(v => { return v != null }));
                otherCard = otherCard.concat(wArr1.filter(v => { return v != null }));

                otherArr.sort((a, b) => b % 100 - a % 100 || b - a)

                this._handsCard = zWsk.concat(wskArr.concat(bombArr.concat(otherCard)))
                break;
        }
        this._handsCard.forEach((card, x) => {
            let nodeCard = cc.instantiate(this.cardItem);
            nodeCard.getComponent(PokerSelfCard).init(card);
            nodeCard.scale = 0.5;
            // if (this.idx == 1 && this.type == 'summaryHands') {
            //     cc.log(this.idx, this.type);
            // nodeCard.zIndex = this._handsCard.length - Number(x);
            // cc.log(nodeCard.zIndex);
            // nodeCard.setSiblingIndex(this._handsCard.length - Number(x))
            // }
            this.node.addChild(nodeCard);
        });
    }

    reset() {
        this.node.removeAllChildren();
    }

    sortType = 0;
    sortCard() {

        console.log("点击排序")
        if (this._handsCard.length == 0 || !TableInfo.options.rules.teammateHandsVisible) return;
        this.sortType = (this.sortType + 1) % 3;
        this.renderHandCards();
    }

}


