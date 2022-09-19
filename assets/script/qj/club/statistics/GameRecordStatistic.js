const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from '../../other/moment';
@ccclass
export default class GameRecordStatistics extends cc.Component {
    @property(cc.Node)
    nodeOption = null

    @property(cc.Label)
    lblGameType = null

    @property(cc.Label)
    lblStartDate = null

    @property(cc.Label)
    lblEndDate = null

    @property(cc.Node)
    item = null

    @property(cc.Node)
    content = null

    _color = ['#db5950', '#2EA63C']

    data = {
        gameType: null,
        low: null,
        date: [],
        condition: null
    }

    init() {
        this.lblStartDate.string = moment().hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm');
        this.lblEndDate.string =  moment().format('YYYY-MM-DD HH:mm');
        this.onClickSearch();
    }

    onClickGameType(event) {
        let gameType = event.target._name.toUpperCase();
        this.onClickOption();
        if (gameType == 0) {
            this.data.gameType = null;
            this.lblGameType.string = '全部游戏';
        } else {
            this.data.gameType = gameType;
            this.lblGameType.string = GameConfig.GameName[gameType];
        }
    }

    onClickOption() {
        this.nodeOption.active = !this.nodeOption.active;
    }

    onClickSearch() {
        this.data.date = [this.lblStartDate.string, this.lblEndDate.string];
        this.data.clubID = App.Club.id;
        this.data.userID = App.Player.id;
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.GameRecordStatistic, this.data, ({ record }) => {
            let node = cc.instantiate(this.item);
            this.initItem(node, record);
            node.parent= this.content;
            node.active = true;
        })
    }

    initItem(node, data) {
        let lblTurn = node.getChildByName('lblTurn').getComponent(cc.Label);
        let lblScore = node.getChildByName('lblScore').getComponent(cc.Label);
        let lblBigWinnerCount = node.getChildByName('lblBigWinnerCount').getComponent(cc.Label);
        lblTurn.string = data.turn || 0;
        lblScore.string = App.transformScore(data.score) || 0;
        lblScore.node.color = new cc.Color().fromHEX(this._color[data.score >= 0 ? 1 : 0])
        lblBigWinnerCount.string = data.winnerCount || 0;
    }

    onClickDate(_, idx) {
        let lbl = idx == 0 ? this.lblStartDate : this.lblEndDate;
        App.pop(GameConfig.pop.DayHourMinutePop, [lbl.string, (date) => {
            lbl.string = date;
        }]);
    }
}