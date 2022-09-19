const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import Avatar from "../../../ui/common/Avatar";

@ccclass
export default class MembersRankItem extends cc.Component {
    @property(Avatar)
    Avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblIdx = null
    @property(cc.Label)
    lblTurn = null
    @property(cc.Label)
    lblWinnerCount = null
    @property(cc.Label)
    lblBigWinnerCount = null

    init(data) {
        let { bigWinnerCount = 0, turn = 0, user: { name = '', head = '' }, userID, winnerCount = 0, index } = data;
        this.lblBigWinnerCount.string = bigWinnerCount;
        this.lblTurn.string = turn;
        this.lblName.string = name;
        this.Avatar.avatarUrl = head;
        this.lblID.string = userID;
        this.lblWinnerCount.string = winnerCount;
        this.lblIdx.string = index
    }
  
}