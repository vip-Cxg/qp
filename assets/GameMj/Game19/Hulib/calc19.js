
let calc = module.exports;

// load tbl
// const eyeTable = require('./tbl_eye.json');
// const table = require('./tbl.json');

let eyeTable = {}
cc.loader.loadRes("hnmj/tbl_eye", (err, res) => {
    // console.log("海南麻将加载-1-", res.json)
    eyeTable = res.json;
})
let table = {}
cc.loader.loadRes("hnmj/tbl", (err, res) => {
    // console.log("海南麻将加载-2-", res.json)
    table = res.json;
})



calc.array2vect = function (arr) {
    let cards = new Array(40).fill(0);
    arr.forEach(card => {
        cards[card] += 1;
    });
    return cards;
}
calc.isSingle = function (hands, cards) {
    if (hands.length != 14) {
        return false;
    }
    for (let card of SINGLE_CARDS) {
        if (cards[card] < 1) {
            return false;
        }
    }
    return cards.indexOf(2) >= 0;
}
calc.sum = function (arr) {
    return arr.reduce((p, a) => p += a);
}
calc.encodeKey = function (colorID, cards) {
    let key = 0;
    for (let card = 1; card < 10; card++) {
        key = key * 10 + cards[colorID * 10 + card]
    }
    return key;
}
const SINGLE_CARDS = [1, 9, 11, 19, 21, 29, 31, 32, 33, 34, 35, 36, 37];
calc.checkHu = function (hands) {
    let cards = calc.array2vect(hands);
    // cards[currentCard] += 1;
    if (calc.isSingle(hands, cards)) {
        return true;
    }
    let count = [calc.sum(cards.slice(1, 10)), calc.sum(cards.slice(11, 20)), calc.sum(cards.slice(21, 30)), calc.sum(cards.slice(31, 38))];
    let pair = 0, triplet = [];
    // ================预处理开始================
    cards.forEach((cnt, card) => {
        switch (cnt) {
            case 2:
                pair += 1;
                break;
            case 3:
                triplet.push(card);
                break;
            case 4:
                pair += 2;
                break;
        }
    });

    if ((triplet.length * 3 + 2 == hands.length && pair == 1) || pair == 7) {
        return true;
    }
    let eyeIDX = count.findIndex(cnt => cnt % 3 == 2);
    for (let card = 31; card < 38; card++) {
        let key = cards[card] % 3;
        switch (key) {
            case 1:
                return false;
            case 2:
                if (eyeIDX != 3) {
                    return false;
                }
                break;
        }
        if (key == 1) { //Honor not complet
            return false;
        } else if (key == 2 && eyeIDX != 3) {
            return false;
        }
    }
    for (let colorID = 0; colorID < 3; colorID++) {
        if (colorID == eyeIDX) {
            if (count[colorID] % 3 != 2) {
                return false;
            }
            let key = calc.encodeKey(colorID, cards);
            if (key > 0 && eyeTable[`${key}`] == null) {
                return false;
            }
        } else if (count[colorID] % 3 != 0) {
            return false;
        } else {
            let key = calc.encodeKey(colorID, cards);
            if (key > 0 && table[`${key}`] == null) {
                return false;
            }
        }
    }
    return true;
}
// console.log('------1111----',calc.checkHu([12, 12, 12, 13, 13, 18, 19, 13]))