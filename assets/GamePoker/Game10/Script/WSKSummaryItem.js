import { GameConfig } from "../../../GameBase/GameConfig";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../../script/common/GameUtils";

const RankDesc = [
    '一游',
    '二游',
    '三游',
    '四游'
]

const { ccclass, property } = cc._decorator
@ccclass
export default class WSKSummaryItem extends cc.Component {

    @property(cc.Label)
    lblName = null;
    @property(cc.Label)
    lblRank = null;
    @property(cc.Label)
    lblZhua = null;
    @property(cc.Label)
    lblScore = null;


    renderUI(data) {
        let lblColor = cc.color(255, 255, 255, 255);
        if (TableInfo.options?.gameType == GameConfig.GameType.WSK && TableInfo.options?.rules.person == 4) {
            lblColor = data.idx % 2 == TableInfo.idx % 2 ? cc.color(255, 217, 0, 255) : cc.color(255, 255, 255, 255);
        } else {
            lblColor = data.idx == TableInfo.idx ? cc.color(255, 217, 0, 255) : cc.color(255, 255, 255, 255);
        }

        // if (data.idx == TableInfo.idx) {
        this.lblName.node.color = lblColor;
        this.lblRank.node.color = lblColor;
        this.lblScore.node.color = lblColor;
        this.lblZhua.node.color = lblColor;
        // }
        // {
        //     "userID": 23224056,
        //     "idx": 1,
        //     "rank": -1,
        //     "hands": [
        //         113,
        //         413
        //     ],
        //     "scores": {
        //         "credit": 80,
        //         "turn": -10000
        //     },
        //     "total": -10000
        // }

        this.lblName.string = TableInfo.players[data.idx].prop.name;
        data.rank = data.rank < 0 ? TableInfo.options?.rules.person - 1 : data.rank;
        this.lblRank.string = RankDesc[data.rank];
        this.lblZhua.string = data.scores.credit;
        this.lblScore.string = GameUtils.formatGold(data.scores.turn);

    }

}


