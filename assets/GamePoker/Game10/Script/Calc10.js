const Utils = require('../../common/utils');
let CARD_TYPE = {
    DAN: 'DAN',
    DUI: 'DUI',
    SAN: 'SAN',
    BOMB: 'BOMB',
    WSK: 'WSK',
    ZWSK: 'ZWSK',
    LTWSK: 'LTWSK',
    KING: 'KING',
};

let WEIGHT = {
    DAN: 0,
    DUI: 0,
    SAN: 0,
    WSK: 100,
    ZWSK: 200,
    BOMB: 300,
    KING: 400,
    LTWSK: 500
};

class Cards {
    constructor(cards = [1], type = null) {
        this.type = type;
        this.cards = cards.slice().sort((a, b) => a % 100 - b % 100 || a - b);
        let len = this.cards.length;
        this.card = this.cards[0] % 100;
        /** 总共几坎 */
        this.count = 1;
        /** 几张一样的为一坎 */
        this.chain = 1;
        /** 两手牌类型不一样时 判断大小的依据(限五十K及以上)*/
        this.weight = 0;
        switch(type) {
            case CARD_TYPE.DAN:
                this.count = 1;
                this.chain = 1;
                this.weight = 0;
                break;
            case CARD_TYPE.DUI:
                this.count = len / 2;
                this.chain = 2;
                this.weight = 0;
                break;
            case CARD_TYPE.SAN:
                this.count = len / 3;
                this.chain = 3;
                this.weight = 0;
                break;
            case CARD_TYPE.WSK:
                this.count = 3;
                this.chain = 1;
                this.weight = WEIGHT[type] * 10;
                break;
            /** 分花色 */
            case CARD_TYPE.ZWSK:
            case CARD_TYPE.LTWSK:    
                this.count = 3;
                this.chain = 1;
                this.weight = WEIGHT[type] * 10 + this.cards[0];
                break;
            case CARD_TYPE.KING:
                this.count = 2;
                this.chain = 2;
                this.weight = WEIGHT[type] * 10;
                break;
            case CARD_TYPE.BOMB:
                this.count = 1;
                this.chain = this.cards.length;
                this.weight = WEIGHT[type] * 10 + this.chain * 100 + this.card;
                break;
        }
    }
}

class Calc {
    constructor(rules, gameType = 'WSKBD') {
        this._rules = rules;
        this.gameType = gameType;
    }

    set rules(rules) {
        this._rules = rules;
    }

    get rules() {
        return this._rules;
    }

    static get CARD_TYPE() {
        return CARD_TYPE;
    }

    static get WEIGHT() {
        return WEIGHT;
    }

    /**
     * 是否为两连对或三连对
     * @param {Object[]} tmpCards  - new Array(19).fill(0)
     * @param {number} chain       -几张牌为一坎
     * @returns {boolean}
     */
    isKan(tmpCards, chain) {
        /** 有 2 或 鬼 牌 返回 false */
        if (tmpCards.slice(16, 19).find(c => c > 0)) return false;
        /** 取 3 -> A */
        let cards = tmpCards.slice(0, 16);
        /** 牌总数应为chain的倍数 */
        if (cards.reduce((p, c) => p += c, 0) % chain != 0) return false;
        /** 单种牌数量为count */
        if (cards.find(c => c != 0 && c != chain)) return false;
        let start = Math.max(cards.findIndex(c => c > 0), 0);
        let end = cards.length - Math.max(cards.slice().reverse().findIndex(c => c > 0), 0);
        return cards.slice(start, end).reduce((p, c) => p += c, 0) == (end - start) * chain;
    }

    /**
     * 
     * @param {Object[]} cards 
     * @returns {Cards}
     */
    decode(cards) {
        cards = cards.slice().sort((a, b) => a % 100 - b % 100 || a - b);
        let tmpCards = new Array(19).fill(0);
        cards.forEach(card => {
            tmpCards[card % 100]++; 
        });
        let bombIndex = tmpCards.findIndex(count => count >= 4);
        /** 炸弹 */
        if (bombIndex >= 0 && tmpCards[bombIndex] == cards.length) {
            return new Cards(cards, Calc.CARD_TYPE.BOMB);
        }
        /** 单牌 */
        if (cards.length == 1) {
            return new Cards(cards, Calc.CARD_TYPE.DAN);
        }
        /** 对子 */
        if (cards.length == 2 && cards[0] % 100 == cards[1] % 100) {
            return new Cards(cards, Calc.CARD_TYPE.DUI);
        }    
        /** 三张 */
        if (cards.length == 3 && cards[0] % 100 == cards[1] % 100 && cards[1] % 100 == cards[2] % 100) {
            return new Cards(cards, Calc.CARD_TYPE.SAN);
        }    
        if (this.gameType == 'WSK') {
            /** 两张的连对 */
            if (this.isKan(tmpCards.slice(), 2)) {
                return new Cards(cards, CARD_TYPE.DUI);
            }
            /** 三张的连对 */
            if (this.isKan(tmpCards.slice(), 3)) {
                return new Cards(cards, CARD_TYPE.SAN);
            }
        }
     
        /** 五十K **/
        if (cards.length == 3 && cards[0] % 100 == 5 && cards[1] % 100 == 10 && cards[2] % 100 == 13) {
            let hasSameColor = cards.filter(c => Math.floor(c / 100) == Math.floor(cards[0] / 100)).length == 3;
            if (hasSameColor) {
                let cardsIns = new Cards(cards, Calc.CARD_TYPE.ZWSK);
                /** 真五十k大过四炸 */
                if (this.rules.zwsk) {
                    cardsIns.weight = Calc.WEIGHT.BOMB * 10 + 420 + Math.floor(cards[0] / 100);
                }
                return cardsIns;
            }
            return new Cards(cards, Calc.CARD_TYPE.WSK);
        }
        /** 立体五十k */
        if (cards.length == 6 && tmpCards[5] == 2 && tmpCards[10] == 2 && tmpCards[13] == 2) {
            let hasSameColor = cards.filter(c => Math.floor(c / 100) == Math.floor(cards[0] / 100)).length == 6;
            if (hasSameColor) {
                return new Cards(cards, Calc.CARD_TYPE.LTWSK);
            }
        }
        /** 四大天王 */
        if (cards.length == 4 && tmpCards[17] == 2 && tmpCards[18] == 2) {
            return new Cards(cards, Calc.CARD_TYPE.KING);
        }
        return null;
    }

    /**
     * 比较大小
     * @param {Cards} group0  
     * @param {Cards} group1  
     * @returns {boolean}     - group1 > group 0
     */
    compare(group0, group1) {
        if (group0 == null)
            return true;
        /** 五十K以下的同类型比牌 */
        if (group0.weight == 0 && group1.weight == 0 && group1.type == group0.type) {
            if (group1.type == Calc.CARD_TYPE.DUI && group1.count == group0.count && group1.count == 2 && group1.chain == 2) {
                return group1.card == group0.card + 1;
            }
            return group1.card > group0.card && group1.count == group0.count;
        }
        return group1.weight > group0.weight;
    }

    /**
     * 寻找坎
     * @param {Object[]} hands  -手牌 二维数组 下标为card  
     * @param {Cards} current   -Cards对象
     * @param {number} chain    -几张一样的为一坎
     * @param {number} start    -两连对只能顺着接  3344 < 4455
     */
    findKan(hands, current, chain, start = 0) {
        let { count, card } = current;
        /** 去掉炸弹 */
        let tempHands = hands.map(c => {
            if (c.length >= 4) {
                return [];
            }
            return c;
        });
        /** 连对只能到A */
        if (count > 1) {
            tempHands = tempHands.slice(0, 15);
        }
        let result = [];
        for (let i = card + 1; i < tempHands.length; i ++) {
            if (tempHands[i].length < chain) continue;
            if (start > 0 && i != start) break;
            let cards = tempHands.slice(i, i + count).map(c => c.slice(0, chain));
            if (cards.reduce((p, c) => p += c.length , 0) == chain * count) {
                result.push(cards.reduce((p, c) => p = p.concat(c), []));
            }
        }
        return result;
    }

    findSameCard(hands, current) {
        let dui = [], san = [], dan = [];
        if (current.type == Calc.CARD_TYPE.DUI || current.type == null) {
            let start = 0;
            if (current.chain == 2 && current.count == 2) {
                start = current.card + 1;
            }
            dui = this.findKan(hands, current, 2, start);
        }
        if (current.type == Calc.CARD_TYPE.SAN || current.type == null) {
            san = this.findKan(hands, current, 3);
        }
        if (current.type == CARD_TYPE.DAN || current.type == null) {
            dan = this.findKan(hands,current, 1);
        }
        return dan.concat(dui).concat(san);
    }

    /**
     * 
     * @param {*} hands 
     * @returns 
     */
    findWsk(hands, current) {
        if (current.weight >= Calc.WEIGHT.WSK * 10) {
            return [];
        }
        let { type } = current;
        if (type == Calc.CARD_TYPE.WSK) {
            return [];
        }
        if (hands[5].length > 0 && hands[10].length > 0 && hands[13].length > 0) {
            return [hands[5].slice(0, 1).concat(hands[10].slice(0, 1)).concat(hands[13].slice(0, 1))];
        }
        return [];
    }

    findZWSK(hands, current, count) {
        let type = count == 1 ? Calc.CARD_TYPE.ZWSK : Calc.CARD_TYPE.LTWSK;
        let weight = current.weight;
        /** 真五十K大过四炸 */
        if (count == 1 && this.rules.zwsk && current.type == Calc.CARD_TYPE.BOMB && current.chain == 4) {
            weight = 0;
        }
        if (Math.floor(weight / 1000) * 100 > Calc.WEIGHT[type] && current.type != Calc.CARD_TYPE.ZWSK) {
            return [];
        }
        let start = current.type == Calc.CARD_TYPE.ZWSK ? Math.floor(current.cards[0] / 100) : 0;
        /** 方 梅 红 黑 */
        let five = [0,0,0,0,0];
        let ten = [0,0,0,0,0];
        let k = [0,0,0,0,0];
        hands[5].forEach(c => five[Math.floor(c / 100)] += 1);
        hands[10].forEach(c => ten[Math.floor(c / 100)] += 1);
        hands[13].forEach(c => k[Math.floor(c / 100)] += 1);
        let result = [];
        for (let i = start + 1; i <= 4; i ++ ) {
            if (five[i] >= count && ten[i] >= count && k[i] >= count) {
                let cards = [i * 100 + 5, i * 100 + 10, i * 100 + 13];
                let tmp = [];
                for (let i = 0; i < count; i ++) {
                    tmp = tmp.concat(cards);
                }
                if (count == 1) {
                    let min = Math.min(five[i], ten[i], k[i] >= count);
                    for (let m = 0; m < min; m ++) {
                        result.push(tmp.sort((a, b) => a % 100 - b % 100 || a - b));
                    } 
                } else {
                    result.push(tmp.sort((a, b) => a % 100 - b % 100 || a - b));
                }
            }
        }
        if (count == 1) {
            result.forEach(cards => {
                cards.forEach(c => {
                    hands[c % 100].splice(hands[c % 100].findIndex(card => card == c % 100), 1);
                });
            });
        }
        return [...new Set(result.map(a => JSON.stringify(a)))].map(a => JSON.parse(a));
    }

    findBomb(hands, current) {
        if (current.weight >= (Calc.WEIGHT.BOMB + 100) * 10) return [];
        let chain = 4;
        let card = 0;
        /** 真五十K大于四炸 */
        if (this.rules.zwsk && current.type == Calc.CARD_TYPE.ZWSK) {
            chain = 5;
        }
        if (current.type == Calc.CARD_TYPE.BOMB) {
            chain = current.chain;
            card = current.card;
        }
        let result = [];
        for (let i in hands) {
            let c = hands[i];
            if (c.length > chain || (c.length == chain && i > card)) {
                result.push(c.slice(0, c.length));
            }
        }
        return result.sort((a,b) => a.length - b.length);
    }

    findKing(hands, current) {
        if (current.weight >= Calc.WEIGHT.KING * 10) return [];
        if (hands[17].length >= 2 && hands[18].length >= 2) {
            return [hands[17].slice(0, 2).concat(hands[18].slice(0, 2))];
        }
        return [];
    }

    findGrater(current, hands) {
        if (current == null) {
            current = new Cards();
        }
        let tempHands = new Array(19).fill(0).map(c => []);
        hands.forEach(c => tempHands[c % 100].push(c));
        let ltwsk = this.findZWSK(tempHands, current, 2);
        let king = this.findKing(tempHands, current);
        if (king.length > 0) {
            tempHands[17] = [];
            tempHands[18] = [];
        }
        let bomb = this.findBomb(tempHands, current);
        let zwsk = this.findZWSK(tempHands, current, 1);
        let wsk = this.findWsk(tempHands, current);
        tempHands.forEach((cards, i) => {
            if (cards.length >= 4) {
                tempHands[i] = [];
            }
        });
        let other = this.findSameCard(tempHands, current);
        let result = other.concat(wsk).concat(zwsk).concat(bomb).concat(king).concat(ltwsk);
        return result;
    }
}
module.exports = Calc;
