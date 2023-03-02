const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import Avatar from "../../../ui/common/Avatar";

@ccclass
export default class DiamondStatisticsItem extends cc.Component {
    @property(Avatar)
    Avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblTurn = null
    @property(cc.Label)
    lblPerson = null
    @property(cc.Label)
    lblDiamond = null

    init(data) {
        // {
        //     "userID": 84799100,
        //     "diamond": "2",
        //     "name": "妩媚萝莉",
        //     "turn": 0,
        //     "person": 0
        // }
        // {
        //     "config": {
        //         "mode": 0,
        //         "tableDisplay": 20,
        //         "roomPermission": 0,
        //         "disbandPermission": 0
        //     },
        //     "leagueConfig": {
        //         "date": [
        //             "2023-02-26",
        //             "2023-02-26"
        //         ],
        //         "hour": [
        //             "00:00",
        //             "23:59"
        //         ],
        //         "payMode": 0
        //     },
        //     "cluster": [
        //         881423,
        //         766977
        //     ],
        //     "managers": [],
        //     "id": 766977,
        //     "userID": 37834966,
        //     "name": "玩家4",
        //     "notice": "",
        //     "contact": "",
        //     "reward": 0,
        //     "score": 0,
        //     "power": "0,0,0,0,0,0,0,0",
        //     "level": 0,
        //     "parent": 881423,
        //     "leagueID": 881423,
        //     "createdAt": "2023-02-25T19:45:47.000Z",
        //     "updatedAt": "2023-02-25T19:46:23.000Z",
        //     "user": {
        //         "name": "心灵美枕头",
        //         "head": "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eo67Jv2AHns1y7zOILKo466RrHpib8KbgFn9rgx71zXkFJ2szY4qx108iaWpbhP3m4Licq2RgdsptibxA/132"
        //     },
        //     "statistics": {
        //         "diamond": "4",
        //         "turn": 2,
        //         "person": 2
        //     }
        // }
        // let { bigWinnerCount = 0, turn = 0, user: { name = '', head = '' }, userID, winnerCount = 0, index } = data;
        this.lblDiamond.string = data.statistics.diamond;
        this.lblTurn.string = data.statistics.turn;
        this.lblName.string = data.user.name;
        this.Avatar.avatarUrl = data.user.head; 
        this.lblID.string = '茶馆ID: '+data.id;
        this.lblPerson.string = data.statistics.person;
    }
  
}