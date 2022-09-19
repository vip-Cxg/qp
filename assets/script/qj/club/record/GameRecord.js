const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from '../../other/moment'
@ccclass
export default class GameRecord extends cc.Component {
    _condition = {
        payer: 0,
        person: 0,
    }
    @property(cc.Label)
    lblDate = null
    @property(cc.Label)
    lblPay = null
    @property(cc.Label)
    lblGame = null
    @property(cc.Label)
    lblTotal = null
    @property(cc.Label)
    lblPerson = null
    @property(cc.Node)
    nodeTopSelect = []
    @property(cc.Node)
    layerContent = null


    get stringDate() {
        let start = this._condition.date[0];
        let end = this._condition.date[1];
        let days = ['前天', '昨天', '今天'];
        cc.log(start, end);
        let startOffset = moment(start).diff(moment().hour(0).minute(0).second(0), 'days') + 2;
        let endOffset = moment(end.slice(0,10)).diff(moment().hour(0).minute(0).second(0), 'days') + 2;
        return `${days[startOffset]}${moment(start).format('HH:mm')}-${days[endOffset]}${moment(end).format('HH:mm')}`;
    }

    updateDate(dates) {
        this._condition.date = dates;
        this.lblDate.string = this.stringDate;
    }

    init() {
        this.layerContent.removeAllChildren();
        let date = moment().add(-1, 'days').hour(0).minute(0).second(0);
        let now = moment();
        this._condition.date = [
            date.format('YYYY-MM-DD HH:mm:ss'),
            now.format('YYYY-MM-DD HH:mm:ss') 
        ];
        this.lblDate.string = this.stringDate;
        this.request();
    }

    request() {
        Connector.request(GameConfig.ServerEventName.GameLogs, { page: 1, pageSize: 50, clubID: App.Club.clubInfo.id, condition: JSON.parse(JSON.stringify(this._condition))}, this.render.bind(this), true);
    }

    render(data) {
        this.layerContent.removeAllChildren();
        let { logs: { rows, count } } = data;
        this.lblTotal.string = `总条数:${count}`;
        rows.forEach(r => {
            GameUtils.instancePrefab(GameConfig.Item.RecordItem, r, this.layerContent);
        })
    }

    /** 牌局记录上方按钮点击事件 0 支付 1 玩法 2 人数 3时间  */
    onClickTopButton(event, data) {
        data = Number(data);
        this.nodeTopSelect[data].active = !this.nodeTopSelect[data].active;
    }

    onClickPay(event) {
        let data = event.target._name;
        let lbl = ['全部', '馆主支付'];
        data = Number(data);
        this._condition.payer = data;
        this.lblPay.string = lbl[data];
        this.nodeTopSelect.forEach(node => node.active = false);
    }

    onClickGame(event) {
        let data = event.target._name.toUpperCase();
        let lbl = ['全部', '潜江晃晃', '红中麻将', '五十K', '五十K必打', '跑得快'];
        let gameType = ['ALL', 'QJHH', 'QJHZMJ', 'WSK', 'WSKBD', 'PDK']
        let index = gameType.findIndex(g => g == data);
        this._condition.gameType = gameType[index] == 'ALL' ? undefined : gameType[index];
        this.lblGame.string = lbl[index];
        this.nodeTopSelect.forEach(node => node.active = false);
    }

    onClickPerson(event) {
        let data = event.target._name;
        let lbl = ['全部', ,'2人', '3人', '4人'];
        data = Number(data);
        this._condition.person = data;
        this.lblPerson.string = lbl[data];
        this.nodeTopSelect.forEach(node => node.active = false);
    }

    onClickDate() {
        App.pop(GameConfig.pop.DatePop, [this._condition.date, this.updateDate.bind(this)]);
    }

    onClickSearch() {
        this.request();
    }
}