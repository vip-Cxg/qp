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

        // let { bigWinnerCount = 0, turn = 0, user: { name = '', head = '' }, userID, winnerCount = 0, index } = data;
        this.lblDiamond.string = data.diamond;
        this.lblTurn.string = data.turn;
        this.lblName.string = data.name;
        // this.Avatar.avatarUrl = head;
        this.lblID.string = data.userID;
        this.lblPerson.string = data.person;
    }
  
}