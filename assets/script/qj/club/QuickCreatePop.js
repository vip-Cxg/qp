const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";

@ccclass
export default class QuickCreatePop extends cc.Component {
    @property(cc.Node)
    content = null

    @property(cc.Node)
    selections = [];

    @property(cc.Node)
    selectionPay = null

    @property(cc.Label)
    lblSelections = []

    @property(cc.Node)
    scorllView = null;

    condition = {
        gameType: 'ALL',
        person: 0,
        pay: 0
    }

    find(node) {
        return cc.find(`Canvas/${this.node._name}/sprBg/${node}`)
    }
    
    onLoad() {
        this._item = this.find('QuickCreateItem');
        let bg = this.node.getChildByName('sprBg');
        bg.on('touchend', () => {
            this.selections.forEach(node => node.active = false);
        })
        this.scorllView.on('touchstart', () => {
            this.selections.forEach(node => node.active = false);
        })
        
    }
    start() {
    }

    init(data) {
        let rooms = App.Club.rooms
        let isLeague = App.Club.isLeague;
        if (isLeague > 0) {
            this.selectionPay.children.forEach(n => {
                if (n._name == 1) n.active = false;
                if (n._name > 1) n.active = true;
            })
        }
        let games = ['QJHH', 'QJHZMJ', 'WSKBD', 'WSK', 'PDK'];
        let lastRoomID =  cc.sys.localStorage.getItem(`QUICK:CREATE`);
        rooms = rooms.filter(r => r.isLeague == isLeague && r.isEnabled&&r.gameType==data.gameType).
        sort((a, b) => Number(b.roomID == lastRoomID) - Number(a.roomID == lastRoomID) || games.findIndex(g => a.gameType == g) - games.findIndex(g => b.gameType == g));
        
        // {
        //     "roomID": 57,
        //     "clubID": 670087,
        //     "gameType": "QJHH",
        //     "person": 2,
        //     "base": 5,
        //     "fee": {},
        //     "auto": 1,
        //     "isEnabled": 1,
        //     "isLeague": 0,
        //     "rules": {
        //         "an": 4,
        //         "mo": false,
        //         "xi": 10,
        //         "auto": -1,
        //         "base": 5,
        //         "hard": false,
        //         "qing": false,
        //         "turn": 8,
        //         "cheat": false,
        //         "chong": true,
        //         "person": 2,
        //         "autoDisband": false
        //     },
        //     "index": 0,
        //     "name": "潜江晃晃",
        //     "color": 0,
        //     "createdAt": "2022-05-28T15:42:51.000Z",
        //     "updatedAt": "2022-05-28T15:42:51.000Z",
        //     "deletedAt": null
        // }





        // rooms = rooms.filter(r => {
        //     let a = true;
        //     let b = true;
        //     let c = true;
        //     if (this.condition.gameType != 'ALL') {
        //         a = r.gameType == this.condition.gameType;
        //     }
        //     if (this.condition.person != 0) {
        //         b = r.person == this.condition.person;
        //     }
        //     if (this.condition.pay == 2) {
        //         c = r.fee.isAA;
        //     } else if (this.condition.pay == 3) {
        //         c = !r.fee.isAA;
        //     }
        //     return a && b && c;
        // });
       
        this.content.removeAllChildren();
        console.log('rooms',rooms)
        rooms.forEach(room => {
            GameUtils.instancePrefab(this._item, room, this.content);
        });

       
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickTopButton(_, data) {
        this.selections[data].active = !this.selections[data].active;
        this.selections.forEach((node, i) => {
            if (i != data) {
                node.active = false;
            }
        })
    }

    onclickPay(event) {
        let display = ['全部', '馆主支付', 'AA支付', '大赢家支付'];
        this.selections[0].active = false;
        this.lblSelections[0].string = display[event.target._name];
        this.condition.pay = Number(event.target._name);
        this.init();
    }

    onClickPerson(event) {
        let display = ['全部', '', '2人', '3人', '4人'];
        this.selections[2].active = false;
        this.lblSelections[2].string = display[event.target._name];
        this.condition.person = Number(event.target._name);
        this.init();
    }

    onclickGame(event) {
        this.selections[1].active = false;
        let gameType = event.target._name.toUpperCase();
        this.lblSelections[1].string = GameConfig.GameName[gameType];
        this.condition.gameType = gameType;
        this.init();
    }
  
}