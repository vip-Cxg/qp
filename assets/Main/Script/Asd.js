import MJDeck from "../../GameMj/commonScript/MJDeck";
import TableInfo from "../../Main/Script/TableInfo";

const PositionIdx = ['bottom', 'right', 'top', 'left'];
const asd = {
    "idx": 1,
    "hands": [
        28,
        28,
        28,
        28,
        11,
        12,
        13,
        19,
        21,
        22,
        23,
        24,
        25,
        26
    ],
    "drops": [
        27
    ],
    "grounds": [],
    "clock": 1649774169837,
    "options": {
        "club": {
            "clubID": 0,
            "isLeague": -1,
            "roomID": -1,
            "fee": {},
            "ownerID": {}
        },
        "tableID": "368700",
        "gameID": "5DK5DGGF",
        "rules": {
            "person": 2,
            "an": 4,
            "hard": false,
            "turn": 8,
            "xi": 10,
            "qing": false,
            "mo": false,
            "chong": true,
            "auto": -1,
            "cheat": false,
            "base": 5,
            "autoDisband": false
        },
        "gameType": "QJHH",
        "shuffle": 500
    },
    "turn": 2,
    "round": 1,
    "status": "PLAY",
    "players": [
        {
            "prop": {
                "pid": 23224056,
                "name": "无辜白昼",
                "sex": "male",
                "head": "http://wx.qlogo.cn/mmopen/vi_32/SNCp4vGEh73WKf2wIVll4qTQNavtOKkuiau1iaxVj43v9teSheDZcSm0xkOx3N7HmjKXrvNpEfT43NvsqiavIyyGA/0",
                "cluster": []
            },
            "wallet": 0,
            "location": {
                "lat": 0,
                "long": 0
            },
            "ip": "103.161.159.140",
            "idx": 0,
            "auto": false,
            "clock": 1649774163010,
            "offline": true,
            "ready": {
                "plus": false,
                "shuffle": false
            },
            "_wallet": 0,
            "_total": 0,
            "_fee": 0,
            "drops": [],
            "grounds": [],
            "hands": 13,
            "scores": {
                "gangWin": 0,
                "gangLose": 0,
                "chong": 0,
                "shuffle": 0,
                "hu": 0
            },
            "lai": []
        },
        {
            "prop": {
                "pid": 11572025,
                "name": "沉默小熊猫",
                "sex": "male",
                "head": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKbSWJKicMgibZsKmH4eefUpPaWoHke0gOF6ibdP6kpzqHeJg7b658NPwGJ8dsBe5UcXr2YANSP5Aiamg/132",
                "cluster": []
            },
            "wallet": 0,
            "location": {
                "lat": 0,
                "long": 0
            },
            "ip": "103.161.159.140",
            "idx": 1,
            "auto": false,
            "clock": 1649774169837,
            "offline": true,
            "ready": {
                "plus": false,
                "shuffle": false
            },
            "_wallet": 0,
            "_total": 0,
            "_fee": 0,
            "drops": [
                27
            ],
            "grounds": [],
            "hands": 14,
            "scores": {
                "gangWin": 0,
                "gangLose": 0,
                "chong": 0,
                "shuffle": 0,
                "hu": 0
            },
            "lai": []
        }
    ],
    "disband": {
        "idx": -1,
        "last": 0,
        "clock": 0,
        "status": "EMPTY",
        "data": [
            "wait",
            "wait"
        ]
    },
    "gameID": "5DK5DGGF",
    "tableID": "368700",
    "banker": 1,
    "rule": {
        "person": 2,
        "an": 4,
        "hard": false,
        "turn": 8,
        "xi": 10,
        "qing": false,
        "mo": false,
        "chong": true,
        "auto": -1,
        "cheat": false,
        "base": 5,
        "autoDisband": false
    },
    "observers": [],
    "decks": 45,
    "currentCard": null,
    "currentIDX": 1,
    "special": {
        "chao": 27,
        "lai": 28
    },
    "dice": [
        6,
        6
    ],
    "pos": 0
}

const TOTAL_CARD = {
    'HZMJ2': 84,
    'HZMJ3': 84,
    'HZMJ4': 120,
    'QJHH2': 72,
    'QJHH3': 72,
    'QJHH4': 108,
}

const { ccclass, property } = cc._decorator
@ccclass
export default class Asd extends cc.Component {
    @property(MJDeck)
    nodeDeck = null;


    onLoad(){
        this.test1();
    }
    test1() {
       
        TableInfo.options = asd.options;
        TableInfo.zhuang = asd.banker;

        this.realIdx = [0, 0];
        this.realIdx[asd.idx] = 0;
        this.realIdx[(asd.idx + 1) % 2] = 2;
        TableInfo.realIdx = this.realIdx;

    }

    test2(){
        this.nodeDeck.initData(asd,true);
    }
    test5(){
        this.nodeDeck.getCardAnim(12,3,26);
    }
    test3(){
        this.nodeDeck.normalRemoveCard();
    }
    test4(){
        this.nodeDeck.specialRemoveCard();
    }

}