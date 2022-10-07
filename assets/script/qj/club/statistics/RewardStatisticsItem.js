const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import Avatar from "../../../ui/common/Avatar";
import Number from "../../../ui/common/Number";
import moment from "../../other/moment";

@ccclass
export default class RewardStatisticsItem extends cc.Component {
    
    @property(cc.Label)
    lblDate = null
    @property(cc.Label)
    lblDesc = null

    init(data) {
        // {
        //     "userID": 84799100,
        //     "diamond": "2",
        //     "name": "妩媚萝莉",
        //     "turn": 0,
        //     "person": 0
        // }

        // let { bigWinnerCount = 0, turn = 0, user: { name = '', head = '' }, userID, winnerCount = 0, index } = data;

        this.lblDate.string = moment(data.strDate).format('YYYY-MM-DD');
        this.lblDesc.string = App.transformScore(data.score);
    }
  
}