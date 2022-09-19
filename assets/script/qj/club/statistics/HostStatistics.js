const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from '../../other/moment';
@ccclass
export default class HostStatistics extends cc.Component {
    @property(cc.Node)
    nodeOptions = []

    @property(cc.Label)
    lblGameType = null

    @property(cc.Label)
    lblPayType = null

    @property(cc.Label)
    lblStartDate = null

    @property(cc.Label)
    lblEndDate = null

    @property(cc.Prefab)
    item = null

    @property(cc.Node)
    content = null

    data = {
        gameType: null,
        date: [],
        pay: null
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

    onClickPayType(event) {
        let pay = Number(event.target._name);
        this.onClickOption('', 1);
        let PAY = ['全部分配', '平均分配', '大赢家分配'];
        if (pay == 0) {
            this.data.pay = null;
            this.lblPayType.string = '全部分配';
        } else {
            this.data.pay = pay;
            this.lblPayType.string = PAY[pay];
        }
    }

    onClickDay(_, day) {
        if (day == 1) {
            this.lblStartDate.string = moment().add(-1, 'days').format('YYYY-MM-DD 00:00');
            this.lblEndDate.string = moment().add(-1, 'days').format('YYYY-MM-DD 23:59');
        }
        if (day == 3) {
            this.lblStartDate.string = moment().add(-3, 'days').format('YYYY-MM-DD HH:mm');
            this.lblEndDate.string = moment().format('YYYY-MM-DD HH:mm');
        }
        if (day == 7) {
            this.lblStartDate.string = moment().add(-7, 'days').format('YYYY-MM-DD HH:mm');
            this.lblEndDate.string = moment().format('YYYY-MM-DD HH:mm');
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
        this.data.date = [this.lblStartDate.string, this.lblEndDate.string];
        this.data.clubID = App.Club.id;
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.HostStatistics, this.data, ({ list }) => {
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