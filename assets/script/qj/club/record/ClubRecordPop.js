const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import GameRecord from "./GameRecord";
import MyRecord from "./MyRecord";
import Limit from "./Limit";
import Log from "./ClubLog";
import GameRecordLeague from '../../league/GameRecordLeague';
import DiamondRecord from '../../league/DiamondRecord';
import ScoreLog from '../../league/ScoreLog';
import SelfLog from "./SelfLog";
@ccclass
export default class ClubStatisticPop extends cc.Component {
    @property(GameRecord)
    gameRecord = null
    @property(MyRecord)
    MyRecord = null
    @property(Limit)
    Limit = null
    @property(Log)
    Log = null
    @property(GameRecordLeague)
    GameRecordLeague = null
    @property(DiamondRecord)
    DiamondRecord = null
    @property(ScoreLog)
    ScoreLog = null
    @property(SelfLog)
    SelfLog = null
    @property(cc.Toggle)
    toggleLeft = []


    onLoad() {
        this._groups = [
            this.gameRecord,
            this.MyRecord,
            this.Limit,
            this.Log,
            this.GameRecordLeague,
            this.DiamondRecord,
            this.ScoreLog,
            this.SelfLog
        ];
    }

    init() {

        this.toggleLeft[0].isChecked = true;


        let isLeague = App.Club.isLeague;
        console.log("isLeague", isLeague);
        if (!GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role) && !isLeague) {
            /** 普通成员 合伙人 只显示我的战绩 */
            this.toggleLeft.forEach((toggle, i) => {
                toggle.node.active = i == 1;
                if (this._groups[i])
                    this._groups[i].node.active = i == 1;
            })
            this.toggleLeft[1].check();
            return;
        }
        if (isLeague) {
            let show = [];//App.Club.role == GameConfig.ROLE.USER ? [1, 5, 7] : (App.Club.role == GameConfig.ROLE.LEAGUE_OWNER ? [4, 1, 5, 6, 7] : [1, 5, 6, 7]);

            switch (App.Club.role) {
                case GameConfig.ROLE.USER:
                    show = [1, 5, 7];
                    break;
                case GameConfig.ROLE.LEAGUE_OWNER:
                    show = [4, 1, 5, 6, 7]
                    break;
                case GameConfig.ROLE.OWNER: //比赛场
                    show = [4, 1, 5, 6, 7]
                    break;
                default:
                    show = [1, 5, 6, 7]
                    break;

            }


            this.toggleLeft.forEach((toggle, i) => {
                toggle.node.active = show.includes(Number(i));
            })
            if (App.Club.role == GameConfig.ROLE.LEAGUE_OWNER) {
                this.toggleLeft[4].check();
            } else {
                this.toggleLeft[1].check();
            }

            return;
        }
    }

    onClickLeftToggle(toggle) {
        let index = toggle.node._name;
        this._groups.forEach((g, i) => {
            g.node.active = i == index;
            if (i == index) {
                g.init();
            }
        })
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

}