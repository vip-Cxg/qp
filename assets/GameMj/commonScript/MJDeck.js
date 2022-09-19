import { GameConfig } from "../../GameBase/GameConfig";
import TableInfo from "../../Main/Script/TableInfo";
const PositionIdx = ['bottom', 'right', 'top', 'left'];


const TOTAL_CARD = {
    'QJHZMJ2': 84,
    'QJHZMJ3': 84,
    'QJHZMJ4': 120,
    'QJHH2': 72,
    'QJHH3': 72,
    'QJHH4': 108,
}
const POS_INDEX = {
    'bottom': 0,
    'right': 1,
    'top': 2,
    'left': 3
}

const { ccclass, property } = cc._decorator
@ccclass
export default class MJDeck extends cc.Component {
    @property(cc.Node)
    topContent = null;
    @property(cc.Prefab)
    topItem = null;
    @property(cc.Node)
    leftContent = null;
    @property(cc.Prefab)
    leftItem = null;
    @property(cc.Node)
    rightContent = null;
    @property(cc.Prefab)
    rightItem = null;
    @property(cc.Node)
    bottomContent = null;
    @property(cc.Prefab)
    bottomItem = null;

    startIndex = null;
    endIndex = null;
    realStartIdx = null;
    getCardCount = 0;
    minDiceCount = 0;
    totalCard = 0;

    allCardNode = [];
    firstCardIdx = 0;
    lastCardIdx = 0;


    initData(data, anim = false) {
        this.totalCard = TOTAL_CARD[TableInfo.options.gameType + '' + TableInfo.options.rules.person]; //总共的牌数
        console.log("总牌数", this.totalCard);

        let { decks, dice } = data;

        let pos = data.pos || 0;//牌尾摸牌数
        let idx = TableInfo.realIdx[TableInfo.zhuang]//庄家实际位置


        console.log("庄家实际位置", TableInfo.realIdx, TableInfo.zhuang, idx)
        let realIdx = [0, 0, 0, 0];

        realIdx[idx] = 0;
        realIdx[(idx + 1) % 4] = 1;
        realIdx[(idx + 2) % 4] = 2;
        realIdx[(idx + 3) % 4] = 3;



        dice.sort((a, b) => { return a - b });
        let diceCount = dice[0] + dice[1];
        this.minDiceCount = dice[0];//最小骰子数
        this.getCardCount = 0;

        let firstIdx = (diceCount % 4) - 1 == -1 ? 3 : (diceCount % 4) - 1;//骰子
        let idx1 = TableInfo.realIdx.findIndex(item => item == TableInfo.zhuang);
        // console.log("骰子方向-人",idx1,TableInfo.zhuang,TableInfo.realIdx,firstIdx)

        let realStartIdx = (idx + firstIdx) % 4;//realIdx[(idx+firstIdx)%4]


        // let realStartIdx = realIdx[firstIdx];
        this.realStartIdx = realStartIdx;
        this.startIndex = (realStartIdx + 3) % 4;
        this.endIndex = realStartIdx;

        // if (anim) {
        // let deckData = TableInfo.options.gameType == GameConfig.GameType.QJHZMJ ||( TableInfo.options.gameType == GameConfig.GameType.QJHH&&TableInfo.options.rules.person==4)? {
        let deckData = (this.totalCard / 4) % 2 == 1 ? {
            top: Math.floor(this.totalCard / 4) - 1,
            right: Math.ceil(this.totalCard / 4) - 1,
            bottom: Math.floor(this.totalCard / 4) + 1,
            left: Math.ceil(this.totalCard / 4) + 1
        } : {
            top: Math.floor(this.totalCard / 4),
            right: Math.ceil(this.totalCard / 4),
            bottom: Math.floor(this.totalCard / 4),
            left: Math.ceil(this.totalCard / 4)
        };
        console.log("deckData", deckData);
        this.allCardNode = [];
        for (let key in deckData) {
            this.renderUI(key, deckData[key]);
        }

        this.handldAllCard(this.minDiceCount * 2, this.endIndex, deckData)


        if (!anim)
            this.reconnectCardAnim(data);
    }

    /**重连时扣牌 */
    reconnectCardAnim(data) {

        //牌尾抓牌数
        let realEndCount = data.pos || 0;

        //正面抓牌数 总牌数-剩余牌-牌尾数
        let startCount = this.totalCard - data.decks - realEndCount;
        // console.log("正面抓牌数---", this.totalCard, startCount);
        // 0,1,2,3,4,5,6,7,8,9
        // 1,0,3,2,5,4,7,6,9,8

        let endCount = realEndCount % 2 == 1 ? realEndCount - 1 : realEndCount;

        for (let i = this.allCardNode.length - 1; i >= 0; i--) {

            if (i < startCount) {
                this.allCardNode[i].active = false;
                this.firstCardIdx += 1;
            }

            if (i < this.allCardNode.length - endCount) continue;
            this.allCardNode[i].active = false;
            this.lastCardIdx -= 1;
        }

        if (realEndCount % 2 == 1) {
            let lastIdx = (this.allCardNode.length - realEndCount) % 2 == 0 ? this.allCardNode.length - realEndCount : this.allCardNode.length - realEndCount - 1;
            this.allCardNode[lastIdx].active = false;
        }


    }
    /**外部调用 开始时抓牌 */
    startCardAnim() {

        let maxCount = TableInfo.options.rules.person * 13;



        this.allCardNode.forEach((e, i) => {

            if (i >= maxCount) return;

            //TODO 
            setTimeout(() => {
                this.firstCardIdx += 1;
                // let ap = cc.moveBy(0.3, cc.v2(0, 50));
                // let bp = cc.fadeOut(0.3);
                // let cp = cc.spawn(ap, bp);
                // let dp = cc.sequence(cp, cc.callFunc(() => {
                e.active = false;

                // }))
                // e.runAction(dp)
            }, 80 * Math.floor(i / TableInfo.options.rules.person))

        })


    }

    renderUI(position, count) {
        if (count <= 0) return;
        let parentNode = this[position + 'Content']
        parentNode.removeAllChildren();

        let durx = 150;
        for (let i = 0; i < count; i++) {
            let cardItem = cc.instantiate(this[position + 'Item']);
            switch (position) {
                case 'bottom':
                    cardItem.zIndex = count - Math.floor(i % 2);
                    cardItem.x = -40 * (Math.floor(i / 2)) + durx;
                    cardItem.y = 29 - (i % 2) * 21;// (i % 2) * 21 + 8;

                    break;
                case 'left':
                    cardItem.zIndex = count - Math.floor(i / 2) - Math.floor(i % 2);
                    cardItem.x = 10 + 4 * (i % 2) + 5 * Math.floor(i / 2) - 34;
                    cardItem.y = -30 + (56 / 2 * (Math.floor(i / 2) + 1)) - (i % 2) * 15 - 100;

                    break;
                case 'right':
                    cardItem.zIndex = 2 - Math.floor(i % 2); //20 + 4 - 30 + 4 * Math.floor(i / 2) - 4 * (i % 2);               //

                    cardItem.x = 20 - 4 * (i % 2) + 5 * Math.floor(i / 2) - 20;
                    cardItem.y = 40 - (56 / 2 * (Math.floor(i / 2) + 1)) - (i % 2) * 15 + 150;


                    break;
                case 'top':
                    cardItem.zIndex = count - Math.floor(i % 2);
                    cardItem.x = 31 * (Math.floor(i / 2) + 1) - durx;
                    cardItem.y = (1 - (i % 2)) * 18;
                    break;
            }
            cardItem.cardIndex = i;
            parentNode.addChild(cardItem);
            this.allCardNode.push(cardItem);
        }
    }

    normalRemoveCard() {
        for (let i = 0; i < this.allCardNode.length; i++) {
            if (!this.allCardNode[i].active) continue;
            this.allCardNode[i].active = false;
            break;
        }

    }

    specialRemoveCard() {

        for (let i = this.allCardNode.length - 1; i >= 0; i--) {
            if (!this.allCardNode[i].active) continue;
            console.log("尾抓牌", i);
            if (i % 2 == 0) {
                // this.allCardNode[i].runAction(cc.sequence(cp, cc.callFunc(() => {
                this.allCardNode[i].active = false
                // })))
                break;
            }
            if (this.allCardNode[i - 1].active) {
                // this.allCardNode[i - 1].runAction(cc.sequence(cp, cc.callFunc(() => {
                this.allCardNode[i - 1].active = false
                // })))
            } else {
                // this.allCardNode[i].runAction(cc.sequence(cp, cc.callFunc(() => {
                this.allCardNode[i].active = false
                // })))
            }
            break;
        }

    }


    reset() {
        this.allCardNode = [];
        this.topContent.removeAllChildren();
        this.leftContent.removeAllChildren();
        this.rightContent.removeAllChildren();
        this.bottomContent.removeAllChildren();
        this.startIndex = null;
    }



    handldAllCard(startIndex, posIndex) {
        //   posIndex = posIndex == 0 ? 3 : posIndex - 1;
        let position = PositionIdx[posIndex];
        let parentNode = this[position + 'Content'];
        let idx = this.allCardNode.findIndex(node => {
            return node.uuid == parentNode.children[startIndex].uuid
        })
        // parentNode[startIndex].d
        // deckData[position]


        for (let i = 0; i < this.totalCard; i++) {
            this.allCardNode[(idx + i) % this.allCardNode.length].zhuaIndex = i;
        }

        this.allCardNode.sort((a, b) => a.zhuaIndex - b.zhuaIndex)
        this.firstCardIdx = 0;
        this.lastCardIdx = this.allCardNode.length - 1;


    }
}