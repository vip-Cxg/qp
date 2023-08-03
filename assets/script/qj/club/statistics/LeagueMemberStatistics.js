const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from '../../other/moment';
@ccclass
export default class LeagueMemberStatistics extends cc.Component {
    @property(cc.Node)
    nodeOptions = []

    @property(cc.Label)
    lblGameType = null

    @property(cc.Label)
    lblStartDate = null

    @property(cc.Label)
    lblEndDate = null

    @property(cc.EditBox)
    editBoxCondition = null

    @property(cc.Prefab)
    item = null

    @property(cc.Node)
    content = null

    data = {
        gameType: null,
        low: null,
        date: [],
        condition: null
    }

    init() {
        this.lblStartDate.string = moment().hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm');
        this.lblEndDate.string =  moment().format('YYYY-MM-DD HH:mm');
    }

    onClickGameType(event) {
        let gameType = event.target._name.toUpperCase();
        this.onClickOption('', 0);
        if (gameType == 0) {
            this.data.gameType = null;
            this.lblGameType.string = '全部游戏';
        } else {
            this.data.gameType = gameType;
            this.lblGameType.string = GameConfig.GameName[gameType];
        }
    }

    onClickOption(_, param) {
        this.nodeOptions.forEach((n, i) => {
            if (i == param) {
                n.active = !n.active;
            } else {
                n.active = false;
            }
        })
    }

    onClickSearch() {
        console.log("dadada",this.data)
        this.data.condition = this.editBoxCondition.string;
        this.data.date = [this.lblStartDate.string, this.lblEndDate.string];
        this.data.clubID = App.Club.id;
        if (this.data.low?.length == 0) {
            App.alertTips('请输入最低分');
            return;
        }
        if (this.data.condition.length == 0) {
            App.alertTips('请输入查询条件');
            return;
        }
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.MemberStatistic, this.data, ({ list }) => {
            list.forEach(l => {
                App.instancePrefab(this.item, l, this.content);
            })
        })
    }

    onClickDate(_, idx) {
        let lbl = idx == 0 ? this.lblStartDate : this.lblEndDate;
        App.pop(GameConfig.pop.DayHourMinutePop, [lbl.string, (date) => {
            lbl.string = date;
        }]);
    }
  
}