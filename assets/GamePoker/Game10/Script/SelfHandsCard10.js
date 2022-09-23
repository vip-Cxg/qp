import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import AudioCtrl from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import ROUTE from "../../../Main/Script/ROUTE";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../../script/common/GameUtils";
import PokerSelfCard from "../../commonScript/PokerSelfCard";
const CardScale = 1
const { ccclass, property } = cc._decorator
@ccclass
export default class SelfHandsCard10 extends cc.Component {
    @property(cc.Prefab)
    preCard = null;

    @property(cc.Node)
    btnPlayCard = null;
    @property(cc.Node)
    btnTips = null;

    nodeCards = [];
    nodeLbl = [];
    logic = null;


    _handsCard = [];
    _tipsTime = 0;
    /**手牌 */
    get handsCard() {
        return this._handsCard;
    }
    set handsCard(v) {
        this._handsCard = v;
        this.renderHandCards();
    }
    cutCards(hands, anim) {
        this._handsCard = hands;
        this.renderHandCards(anim);
    }
    onLoad() {
        this.touchEvent()
    }

    refreshObserverHands() {

    }

    renderHandCards(anim = false) {
        this.node.destroyAllChildren();
        this.nodeCards = [];
        this.nodeLbl = [];
        this._tipsTime = 0;
        if (this._handsCard.length == 0) return;
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
                let otherArr = this._handsCard.filter(v => v % 100 != 5 && v % 100 != 10 && v % 100 != 13 );
                let bombCount = new Array(19);
                otherArr.forEach((c, i) => {
                    if (!bombCount[c % 100])
                        bombCount[c % 100] = [];
                    bombCount[c % 100].push(c);
                })
                bombCount.reverse();
                bombCount.sort((a, b) =>  b.length - a.length);
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
                otherCard.sort((a, b) => b % 100 - a % 100 || b - a);

                this._handsCard = zWsk.concat(wskArr.concat(bombArr.concat(otherCard)))
                break;
        }





        // let middle = Math.ceil(this._handsCard.length / 2);

        this._handsCard.forEach((card, x) => {
            let nodeCard = cc.instantiate(this.preCard);
            let objCard = nodeCard.getComponent(PokerSelfCard);
            objCard.init(card);
            nodeCard.width = nodeCard.width * CardScale;
            nodeCard.height = nodeCard.height * CardScale;
            nodeCard.parent = this.node;
            nodeCard.name = card + "";
            nodeCard._prior = false;
            nodeCard._before = false;
            nodeCard.active = !anim;
            nodeCard._value = card;
            nodeCard.isZhankai = false;
            // nodeCard.setPosition(-(this._handsCard.length / 2) * 70 - 30 + (x + 1) * 70, -this.node.height / 2 + nodeCard.height / 2);
            nodeCard.pos0 = cc.v2(nodeCard.x, nodeCard.y);
            nodeCard.pos1 = cc.v2(nodeCard.x, nodeCard.y + 15);
            nodeCard.zIndex = x;
            if (anim) {
                nodeCard.active = true;
                if (nodeCard)
                    nodeCard.opacity = 0;
                nodeCard.runAction(cc.sequence(cc.delayTime(x / this._handsCard.length), cc.fadeIn(0.2)));
            }
            this.nodeCards.push(nodeCard);
        });
    }

    /**移除手中该牌组 */
    removeHandsCard(hands = []) {
        if (hands.length == 0) return;
        let oldHands = this.handsCard.concat();
        hands.forEach(card => {
            for (let x = 0; x < oldHands.length; x++) {
                let idx = oldHands.findIndex(c => card == c);
                if (idx >= 0) {
                    oldHands.splice(idx, 1);
                    return;
                }
            }
        });
        this.handsCard = oldHands;

    }
    touchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.onTouchBegan(event, "touchstart");
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            this.onTouchBegan(event, "touchmove");
        });

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (TableInfo.idx < 0) return;
            this.nodeCards.forEach(card => {
                let cardMask = card.getChildByName("bgCardMask");
                cardMask.active = false;
            });
            this.checkCurrent();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            if (TableInfo.idx < 0) return;
            this.nodeCards.forEach(card => {
                let cardMask = card.getChildByName("bgCardMask");
                cardMask.active = false;
            });
            this.checkCurrent();
        });
    }

    onTouchBegan(event, touchType) {
        if (TableInfo.idx < 0) { 
            return;
        }
        TableInfo.isWai = true;
        let nodePosition = event.target.convertToNodeSpaceAR(event.getLocation());
        if (this.nodeCards.length != 0) {
            for (let x = 0; x < this.nodeCards.length; x++) {
                let sprCard = this.nodeCards[x];
                let rect = this.nodeCards[x].getBoundingBox();
                if (x != this.nodeCards.length - 1) {
                    rect.width = this.nodeCards[x + 1].x - this.nodeCards[x].x;
                }
                let contain = rect.contains(nodePosition);
                if (contain) {
                    TableInfo.isWai = false;
                    this.checkStatus(sprCard, touchType);
                }

            }
        }
    }

    checkStatus(node, touchType) {
        let bgCardMask = node.getChildByName("bgCardMask");
        let url = cc.url.raw(`resources/Audio/Common/cardEffect.mp3`);
        if (touchType == "touchmove" && node._prior == this.firstCheck) {
            bgCardMask.active = true;
            return;
        }
        if (touchType == "touchstart") {
            this.firstCheck = !node._prior;
            bgCardMask.active = true;
        }
        node._prior = !node._prior;
        node.position = node._prior ? node.pos1 : node.pos0;
        AudioCtrl.getInstance().playSFX(url);

    }

    get hasGrater() {
        return this.logic.findGrater(TableInfo.current, this.handsCard.slice()).length > 0;
    }


    checkCurrent() {
        if (TableInfo.idx < 0) return;
        TableInfo.select = null;
        let playCards = [];
        let selectNodeCard = []
        this.nodeCards.forEach(c => {
            if (c._prior) {
                playCards.push(c._value);
                selectNodeCard.push(c);
            }
        });
        let btnPlay = this.btnPlayCard.getComponent(cc.Button);
        let decodeResult = this.logic.decode(playCards);
        if (!decodeResult) {
            btnPlay.interactable = false;
            return;
        }
        let cardList = decodeResult;
        btnPlay.interactable = this.logic.compare(TableInfo.current, cardList);
        TableInfo.select = cardList;
        let idxNext = (TableInfo.currentPlayer + 1) % TableInfo.options.rules.person;
        console.log('TableInfo.currentPlayer',TableInfo.currentPlayer)
        console.log('TableInfo.idx',TableInfo.idx)
        console.log('TableInfo.baodan[idxNext',TableInfo.baodan[idxNext],TableInfo.baodan)
        console.log('TableInfo.currentPlayer',TableInfo.currentPlayer)
        console.log('TableInfo.currentPlayer',TableInfo.currentPlayer)
        console.log('TableInfo.currentPlayer',TableInfo.currentPlayer)
        if (
            TableInfo.currentPlayer == TableInfo.idx && 
            TableInfo.baodan[idxNext] &&
            
            TableInfo.options.gameType == GameConfig.GameType.WSKBD &&
            cardList.type == 'DAN' &&
            this.handsCard.slice().sort((a, b) => b % 100 - a % 100)[0] % 100 != cardList.card % 100
        ) {
            btnPlay.interactable = false;
            Cache.alertTip("下家已报单,出单牌必须出手中最大的");
        }
    }

    /**提示 */
    tipsStart(autoplay) {
        let newHands = [];
        let newCurrent;
        this.handsCard.forEach(card => {
            newHands.push(card);
        });
        let results = this.logic.findGrater(TableInfo.current, newHands);
        if (results == null)
            return;
        let result = results[this._tipsTime % results.length]
        if (result == null || result.length == 0) {
            return;
        }
        TableInfo.tipResult = [];
        TableInfo.tipResult = result;
        this._tipsTime++;
        this.nodeCards.forEach(card => {
            let bgCardMask = card.getChildByName("bgCardMask");
            bgCardMask.active = false;
            card._prior = false;
            card.setPosition(card.pos0);
        });

        result.forEach(c => {
            for (let x = 0; x < this.nodeCards.length; x++) {
                let card = this.nodeCards[x];
                if (card._value == c && !card._prior) {
                    card._prior = true;
                    card.position = card.pos1;
                    return;
                }
            }
        });
        this.checkCurrent();
    }

    /** 放下所有选中的牌 */
    resetHands() {
        this.nodeCards.forEach(card => {
            card._prior = false;
            card.position = card.pos0;
        })
        this.checkCurrent();
    }


    /**出牌 */
    acChupai() {   //出牌按钮
        if (this.btnPlayCard._last == null)
            this.btnPlayCard._last = 0;
        if (new Date().getTime() - this.btnPlayCard._last < 1000)
            return;
        this.btnPlayCard._last = new Date().getTime();
        let emp = JSON.parse(JSON.stringify(TableInfo.select));
        Connector.gameMessage(ROUTE.CS_PLAY_CARD, emp.cards, true);
    }

    changeBtn(boolean) {
        this.btnPlayCard.active = boolean;
        this.btnTips.active = boolean;
    }

    playCard() {
        this.changeBtn(true);
        this._tipsTime = 0;
        this.btnTips.getComponent(cc.Button).interactable = TableInfo.current != null;
        this.tipsStart();
    }

    reset() {
        this.node.removeAllChildren();
        this.nodeCards = [];
    }


    sortType = 0;
    sortCard() {
        if (this._handsCard.length == 0 || TableInfo.idx < 0) return;
        this.sortType = (this.sortType + 1) % 3;
        this.renderHandCards();

    }

}
