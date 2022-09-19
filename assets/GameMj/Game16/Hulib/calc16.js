// const table = {};
// const table = require('../Hulib/lib/');
let table = {}
cc.loader.loadRes("hnmj/tbl_16", (err, res) => {
    // console.log("海南麻将加载-2-", res.json)
    table = res.json;
})
class Calc {
    static sum(arr) {
        return arr.reduce((p, a) => p += a);
    }
    static find(allCards, wild, color, eye) {
        if (color >= 3) {
            return eye;
        }
        let cards = allCards[color];

        for (let i = 0; i <= wild; i++) {
            cards[0] = i;
            const key = cards.join('');
            // if (table.includes(key)) {
            if (table['' + key]) {
                let hasEye = Calc.sum(cards) % 3 == 2;
                if (eye && hasEye) {
                    continue;
                }
                if (Calc.find(allCards, wild - i, color + 1, eye || hasEye)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     *
     * @param {*} hands
     * @param {*} ground
     */
    static checkHu(hands, lai = 0) {
        let allCards = [];
        let wild = 0;
        for (let color = 0; color < 3; color++) {
            allCards.push(Array(10).fill(0));
        }
        if (hands.some(c => Math.floor(c / 10) == 3 || c < 0)) {
            return;
        }
        hands.forEach(card => {
            if (card == lai) {
                wild += 1;
                return;
            }
            allCards[Math.floor(card / 10)][card % 10] += 1;
        });
        // if (wild >= 4) {
        //     return true;
        // }
        return Calc.find(allCards, wild, 0, false);
    }

    static array2vect(hands) {
        let cards = Array(30).fill(0);
        hands.forEach(card => {
            if (card > 0)
                cards[card] += 1;
        });
        return cards;
    }
}

const CONSTANT = {
    EVENT: {
        INIT: 'INIT',
        PASS: 'PASS',
        PLAY: 'PLAY',
        CHOW: 'CHOW',
        PONG: 'PONG',
        GANG: 'GANG',
        BU: 'BU',
        ZHI: 'ZHI',
        FLOWER: 'FLOWER',
        HU: 'HU'
    }
};

module.exports = {
    Calc, CONSTANT
};
