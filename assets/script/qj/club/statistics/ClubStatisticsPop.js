const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";

import MembersRank from "./MembersRank";
import DailyOverView from "./DailyOverView";
import MemberStatistics from "./MemberStatistics";
import TurnStatistics from "./TurnStatistics";
import MonthTurn from "./MonthTurn";
import GameRecordStatistic from "./GameRecordStatistic"
import HostStatistics from "./HostStatistics";
import LeagueMemberStatistics from "./LeagueMemberStatistics";
import WasteStatistics from "./WasteStatistics"
import DiamondStatistics from "./DiamondStatistics";
import RewardStatistics from "./RewardStatistics";

@ccclass
export default class ClubStatisticPop extends cc.Component {

    @property(cc.ToggleContainer)
    toggleLeft = null
    @property(MembersRank)
    MembersRank = null
    @property(DailyOverView)
    DailyOverView = null
    @property(MemberStatistics)
    MemberStatistics = null
    @property(TurnStatistics)
    TurnStatistics = null
    @property(MonthTurn)
    MonthTurn = null
    @property(GameRecordStatistic)
    GameRecordStatistic = null
    @property(HostStatistics)
    HostStatistics = null
    @property(LeagueMemberStatistics)
    LeagueMemberStatistics = null
    @property(WasteStatistics)
    WasteStatistics = null
    @property(DiamondStatistics)
    DiamondStatistics = null
    @property(RewardStatistics)
    rewardStatistics = null

    onLoad() {
        this._groups = [
            this.MembersRank,
            this.DailyOverView,
            this.MemberStatistics,
            this.TurnStatistics,
            this.TurnStatistics,
            this.GameRecordStatistic,
            this.HostStatistics,
            this.LeagueMemberStatistics,
            this.WasteStatistics,
            this.DiamondStatistics,
            this.rewardStatistics
        ];
    }

    init() {
        let show = [];
        if (!App.Club.isLeague) {
            if (GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role)) {
                show = [0, 1, 2, 3, 4];
            } else {
                show = [5];
            }
        } else {
            show = [6, 7, 9, 10];

        }
        this.toggleLeft.toggleItems.forEach(toggle => {
            toggle.node.active = show.includes(Number(toggle.node._name));
        })
        this.toggleLeft.toggleItems.find(toggle => toggle.node.active)?.check();
    }

    onClickLeftToggle(toggle) {
        let index = toggle.node._name;
        this._groups.forEach((g, i) => {
            g.node.active = i == index;
            if (i == index) {
                g.init(i == 4 ? 'month' : undefined);
            }
        })
        if (index == 3) {
            this._groups[4].node.active = true;
        }
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}