const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from "../../other/moment";

@ccclass
export default class TurnStatistics extends cc.Component {
    @property(cc.Node)
    content = null

    @property(cc.Node)
    turnStatisticsItem = null

    init(unit = 'day') {
        this.unit = unit;
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.TurnStatistics, { clubID: App.Club.id, unit }, ({ turns }) => {
            turns.forEach(t => {
                let node = cc.instantiate(this.turnStatisticsItem);
                node.parent = this.content;
                this.initItem(node, t);
                node.active = true;
            })
        })
    }

    initItem(node, data) {
        let { strDate, turn, completeTurn } = data
        let lblDate = node.getChildByName('lblDate').getComponent(cc.Label);
        let lblTurn = node.getChildByName('lblTurn').getComponent(cc.Label);
        let lblCompleteTurn = node.getChildByName('lblCompleteTurn').getComponent(cc.Label);
        // cc.log(moment(strDate).format('YYYY年MM月'), strDate, this.unit);
        let reg = /^(\d{4})(\d{2})$/
        lblDate.string = this.unit == 'day' ? moment(strDate).format('YYYY年MM月DD日') : strDate.replace(reg, '$1年$2月');
        lblTurn.string = turn;
        lblCompleteTurn.string = completeTurn;
    }
  
}