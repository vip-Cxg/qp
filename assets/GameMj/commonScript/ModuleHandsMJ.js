
import { GameConfig } from "../../GameBase/GameConfig";
import Connector from "../../Main/NetWork/Connector";
import AudioCtrl from "../../Main/Script/audio-ctrl";
import Cache from "../../Main/Script/Cache";
import ROUTE from "../../Main/Script/ROUTE";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import { App } from "../../script/ui/hall/data/App";

const { ccclass, property } = cc._decorator
@ccclass
export default class ModuleHandsMJ extends cc.Component {

    @property(cc.Prefab)
    selfCard = null;

    @property(cc.Node)
    nodeObserverHands = null;

    _hands = [];
    checkedCard = null;
    touchTime = 0;
    lastCard = null;



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.checkTing = false;
        this.node.on("touchstart", (event) => {
            this.touchstart(event);
        });
        this.node.on("touchmove", (event) => {
            this.touchmove(event);
        });
        this.node.on("touchend", (event) => {
            this.touchend(event);
        });
        this.node.on("touchcancel", (event) => {
            this.touchend(event);
        });
    }
    showTing() {
        this._hands.forEach(node => {
            if (node)
                node.getChildByName('ting').active = node.ting;
        })
    }
    hideTing() {
        this._hands.forEach(node => {
            if (node) {
                node.ting = false;
                node.getChildByName('ting').active = node.ting;
            }

        })
    }
    /**重制 */
    reset() {
        this._hands = [];
        this.node.destroyAllChildren();
        this.nodeObserverHands.active = false;
    }

    /**出牌 */
    outCard(card) {
        if (!cc.playCard) return;
        if (card > 40) { //不能出花牌
            Cache.alertTip('不能出花牌');
            this.touchcancel();
            return;
        }
        this.resetSameCard();
        cc.playCard = false;
        Connector.gameMessage(ROUTE.CS_OUT_CARD, { card: card, serialID: TableInfo.serialID });
        this._hands[this.current._pos] = null;
        this.current.destroy();
        this.current = null;
        this._hands.forEach(node => {
            if (node) {
                node.getCard = false;
            }
        });
        this.checkedCard = null;
        this.sortCards();
        this._hands.forEach(card => card.ting = false);
        this.showTing();
    }
    /**自动出牌 */
    autoSortCard(card) {
        this.resetSameCard();
        cc.playCard = false;
        console.log("当前打出牌---,", card, this.current)
        if (this.current) {

            this._hands[this.current._pos] = null;
            this.current.destroy();
        } else {
            let i = this._hands.findIndex(e => e._card == card);
            if (i != -1) {
                this._hands[i].destroy();
                this._hands[i] = null;
            }
        }


        this.current = null;
        this._hands.forEach(node => {
            if (node) {
                node.getCard = false;

            }
        });
        this.checkedCard = null;
        this.sortCards();
        this._hands.forEach(card => card.ting = false);
        this.showTing();
    }

    /**移除手牌
     * @param card 牌
     * @param count 数量
     */
    removeCard(card, count = 1, hands = 0) {
        if (TableInfo.idx < 0) {
            this.initObserverhands(hands);
            return;
        }
        console.log('移除手牌', card, count);
        let num = 0;
        for (let y = 0; y < this._hands.length; y++) {
            if (num >= count)
                return;
            if (card == this._hands[y]._card) {
                this._hands[y].destroy();
                this._hands.splice(y, 1);
                y--;
                num++;
            }
        }
    }
    showSameCard() {
        if (this.current == null)
            return;
        //TODO 发送事件代替
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HNMJ_SHOW_SAME_CARD, this.current._card)
        // cc.find('Canvas/nodeTable').getComponent('SceneTable16').ground.forEach((g, i) => {
        //     if (i < TableInfo.config.person) {
        //         g.showSameCard(this.current._card);
        //     }
        // })
    }

    resetSameCard() {
        //TODO 发送事件代替 
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HNMJ_RESET_SAME_CARD)
        // cc.find('Canvas/nodeTable').getComponent('SceneTable16').ground.forEach((g, i) => {
        //     if (i < TableInfo.config.person) {
        //         g.resetSameCard();
        //     }
        // })
    }

    touchstart(event) {
        this.moveTime = 0;
        // if (this.current != null || !cc.playCard)
        //     return;
        this.checkTing = true;
        // this._hands.forEach((cards, i) => {
        for (let card of this._hands) {
            let sprCard = card;
            let rect = card.getBoundingBox();
            let nodePosition = event.target.convertToNodeSpaceAR(event.getLocation());
            if (rect.contains(nodePosition)) {
                // sprCard.touch
                // if (this.current) this.current.y = 0;
                this.current = sprCard;
                if (this.checkedCard == this.current) {
                    // if (new Date().getTime() - this.touchTime < 300 && this.lastCard == this.current) {
                    this.touchTime = 0;
                    //出牌
                    this.outCard(this.current._card);
                    this.sortCards();
                    event.stopPropagation();
                    return;
                }
                // this.lastCard = this.current;
                this.touchTime = new Date().getTime();
                this.checkedCard = this.current;
                //this.calcTing();
                Cache.playSound('dianpai');
                this.showSameCard();
                return;
            }
        }
    }

    /** 把选中的牌放下去 */
    resetHandsPos() {
        this.checkedCard = null;
        this.sortCards();
    }

    touchmove(event) {
        if (!cc.playCard) {
            return;
        }
        if (this.current == null || new Date().getTime() - this.touchTime <= 100)
            return;
        let loc = event.target.convertToNodeSpaceAR(event.getLocation());
        let loc1 = event.target.convertToWorldSpaceAR(event.getLocation());
        // new cc.Node().convertToWorldSpaceAR //convertToNodeSpaceAR
        this.current.position = loc;
        // cc.find('Canvas/nodeTable/playCardMask').active = loc.y < 120;
        this.current.zIndex = 100;
        this.moveTime++;
        // cc.log(this.current.y);
        // if(this.moveTime > 5)
        //     this.calcTing(this.current);
        if (this.checkTing) {
            let data = this.current == null ? null : this.current._card;
            //TODO 发送事件代替
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HNMJ_CHECK_HU, { card: data, showTing: true });
            // cc.find('Canvas/nodeTable').getComponent('SceneTable16').checkHu(data, true);
        }
        // this.calcTing();
        this.checkTing = false;
    }

    touchend(event) {
        // if (!cc.playCard)
        //     return;
        if (this.checkedCard == null)
            this.resetSameCard();
        if (this.current == null)
            return;
        if (this.checkTing)
            this.calcTing();
        if (this.current.y > 200) {
            this.outCard(this.current._card);
            this.sortCards();
            return;
        }
        this.sortCards(false, false);
        this.moveTime = 0;
    }

    touchcancel(event) {
        this.moveTime = 0;
        this.resetSameCard();
        this.sortCards();
        if (this.checkTing)
            this.calcTing();
    }

    /** 初始化或刷新观察者第一视角手牌 */
    /**
     * 
     * @param {Number} hands -手牌数量
     */
    initObserverhands(hands) {
        let offset = Math.abs(hands - 14) * 35;
        this.nodeObserverHands.x = 0;
        this.nodeObserverHands.x += offset;
        this.nodeObserverHands.active = true;
        let back = this.nodeObserverHands.getChildByName('back');
        let container = this.nodeObserverHands.getChildByName('container');
        container.destroyAllChildren();
        for (let i = 0; i < hands - Number(hands % 3 == 2); i++) {
            let node = cc.instantiate(back);
            node.parent = container;
            node.active = true;
        }
        back.active = hands % 3 == 2;
    }


    init(data, anim = false) {
        this._hands = [];
        if (TableInfo.idx < 0) {
            this.initObserverhands(data.hands);
            return;
        };
        this.node.destroyAllChildren();
        // console.log("手牌", data.hands);
        let hands = data.hands;
        hands.forEach((card, i) => {
            let nodeCard = this.newCard(card, this.node);
            nodeCard.active = !anim;
            if (anim)
                setTimeout(() => {
                    if (i % 4 == 0) {
                        Cache.playSound('shangpai');
                    }
                    nodeCard.active = true;
                }, 300 * Math.floor(i / 4))
            this._hands.push(nodeCard);
        });
        if (this._hands.length % 3 == 2) {
            this._hands[this._hands.length - 1].getCard = true;
        }
        this.sortCards();
    }

    newCard(value, parent) {
        let nodeCard = cc.instantiate(this.selfCard);
        nodeCard._card = value;
        nodeCard.ting = false;
        nodeCard.getCard = false;
        nodeCard.isLai = value == TableInfo.special?.lai;
        nodeCard.uid = GameUtils.randomNumber(8);
        // nodeCard.getComponent('ModuleSelfCardsMJ').init(value, 0.9, true);
        nodeCard.getComponent('ModuleSelfCardsMJ').init(value, GameConfig.FitScreen == 0 ? 0.9 : 0.9, true);
        this.node.addChild(nodeCard);

        return nodeCard;
    }

    calcTing() {
        let data = this.current == null ? null : this.current._card;
        //TODO 发送事件代替
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HNMJ_CHECK_HU, { card: data, showTing: true });
        // cc.find('Canvas/nodeTable').getComponent('SceneTable16').checkHu(data);
    }

    sortCards(get, laipos = true) {
        if (this.moveTime > 5) {
            this.checkedCard = null;
            //TODO 发送事件代替
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HNMJ_HIDE_TING);
            // cc.find('Canvas/nodeTable').getComponent('SceneTable16').bgTing.active = false;
            this.resetSameCard();
        }
        this.current = null;
        this._hands = this._hands.filter(c => c != null);
        this._hands.sort((a, b) => {
            if (a.getCard || b.getCard) return Number(a.getCard) - Number(b.getCard);
            if (a.isLai || b.isLai) return Number(b.isLai) - Number(a.isLai) || a.uid - b.uid;
            return a._card - b._card;
        });

        // this.node.width=this._hands[0].width*14.5;
        // this.node.x=0;
        let cardCount = this._hands.filter(c => !c.getCard).length;
        this._hands.forEach((nodeCard, i) => {
            nodeCard._pos = i;
            nodeCard.zIndex = 1;
            let totalWidth = this._hands[0].width * 14.5;//this.node.width;//cc.winSize.width;
            if (nodeCard.getCard) {
                nodeCard.setPosition(cc.v2(totalWidth / 2 + nodeCard.width, (nodeCard == this.checkedCard && this.moveTime < 5) ? -this.node.height / 2 + nodeCard.height / 2 + 20 : -this.node.height / 2 + nodeCard.height / 2));
            } else {
                nodeCard.setPosition(cc.v2(GameConfig.FitScreen > 0 ? totalWidth / 2 + nodeCard.width / 2 - (nodeCard.width) * (cardCount - i) : totalWidth / 2 - nodeCard.width / 2 - (nodeCard.width) * (cardCount - i), (nodeCard == this.checkedCard && this.moveTime < 5) ? -this.node.height / 2 + nodeCard.height / 2 + 20 : -this.node.height / 2 + nodeCard.height / 2));
            }
            // cc.log('+++++++++++++');
            // cc.log(GameConfig.FitScreen);

            nodeCard.x -= (cc.view.getFrameSize().width / 1334 * 40) + GameConfig.FitScreen;
            if (nodeCard.getCard && !nodeCard.allGet && get) {
                nodeCard.allGet = true;
            }
        })
    }

    getCard({ card, hands, cards }) {
        // cc.log('getCard', data);
        if (TableInfo.idx < 0) {
            this.initObserverhands(hands);
            return;
        }
        if (card) {
            this.checkedCard = null;
            let node = this.newCard(card, this.node);
            node.getCard = true;
            node.allGet = false;
            this._hands.push(node);
            this.sortCards(true);
        } else {
            cards.forEach((e, i) => {
                this.checkedCard = null;
                let node = this.newCard(e, this.node);
                node.getCard = i == (cards.length - 1);
                node.allGet = false;
                this._hands.push(node);
            })
            this.sortCards(true);
        }
    }
}

