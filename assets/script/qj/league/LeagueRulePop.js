
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector, { connect } from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
import moment from "../other/moment";
@ccclass
export default class LeagueRulePop extends cc.Component {
    @property(cc.Node)
    item = null

    @property(cc.Node)
    content = null

    @property(cc.Node)
    btnAdd = null

    @property(cc.Label)
    lblStartDay = null

    @property(cc.Label)
    lblEndDay = null

    @property(cc.Label)
    lblDate = null

    @property(cc.Prefab)
    selectDay = null

    @property(cc.ToggleContainer)
    togglePay = null

    @property(cc.Node)
    bgTop = null


    onLoad() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_ROOMS, this.init, this);
    }

    init() {
        let isLeague = App.Club.isLeague;
        let rooms = App.Club.rooms;
        console.log("房间信息All", rooms)
        rooms = rooms.filter(r => r.isLeague == isLeague);
        this.content._children.filter(node => node._name != 'btnAdd').forEach(node => node.removeFromParent());
        rooms.forEach((r, i) => {
            App.instancePrefab(this.item, { ...r, index: i }, this.content);
        });
        this.btnAdd.zIndex = 100;
        this.bgTop.active = isLeague;
        let leagueConfig = App.Club.leagueConfig;
        // cc.log()
        this.lblStartDay.string = leagueConfig.date[0];
        this.lblEndDay.string = leagueConfig.date[1];
        this.lblDate.string = leagueConfig.hour.join(' - ');
        let payMode = leagueConfig.payMode;


        // this.togglePay.node.children.forEach((item) => {
        //     item.getComponent(cc.Toggle).interactable = rooms.length == 0;
        // })

        this.togglePay.toggleItems.find(t => t.node._name == payMode).check();


    }

    onClickToggleContainer() {

     
        let color = ['#73978B', '#D15A0A'];
        this.togglePay.toggleItems.forEach(toggle => {
            let isChecked = toggle.isChecked;
            let label = toggle.node.getChildByName('label');
            label.color = new cc.Color().fromHEX(color[Number(isChecked)]);
        })
    }

    onClickModify() {
        if( App.Club.rooms.length>0){
            Cache.alertTip('必须删除其他房型才可修改')
            return;
        }

        let payMode = this.togglePay.toggleItems.find(toggle => toggle.isChecked).node._name;
        payMode = Number(payMode);
        let startDay = this.lblStartDay.string;
        let endDay = this.lblEndDay.string;
        let hour = this.lblDate.string;
        hour = hour.split(' - ');
        if (startDay > endDay) {
            App.alertTips('日期错误');
            return;
        }
        if (moment(`2022-04-01 ${hour[0]}`) > moment(`2022-04-01 ${hour[1]}`)) {
            App.alertTips('时间错误');
            return;
        }
        let date = [startDay, endDay];
        let clubID = App.Club.id;
        let data = { payMode, date, hour, clubID };
        if (payMode != App.Club.payMode) {
            App.confirmPop('切换支付方式,重新保存模版才能生效', () => {
                this.request(data);
            })
            return;
        }
        this.request(data);
    }

    request(data) {
        Connector.request(GameConfig.ServerEventName.UpdateLeagueConfig, data, ({ leagueConfig }) => {
            App.alertTips('修改成功');
            App.Club.leagueConfig = leagueConfig;
            this.init();
        })
    }

    onClickPopCreate() {
        let pop = GameConfig.pop.CreatePop;
        App.pop(pop, 'LEAGUE');
    }

    onClickDay(_, eventData) {
        let label;
        switch (eventData) {
            case '0':
                label = this.lblStartDay;
                break;
            case '1':
                label = this.lblEndDay;
                break;
        }
        let node = cc.instantiate(this.selectDay);
        this.node.addChild(node);
        let date = moment(label.string);
        let datePicker = node.getComponent("UIDatePicker");
        datePicker.setDate(date.year(), date.month(), date.date());
        datePicker.setPickDateCallback((year, month, day) => {
            month = (month + 1) > 9 ? (month + 1) : '0' + (month + 1);
            day = day.toString().length == 1 ? `0${day}` : day;
            label.string = moment(`${year}${month}${day}`).format('YYYY-MM-DD');
        });
    }

    onClickDate() {
        let dates = this.lblDate.string.split(' - ');
        dates = dates.map(d => `${moment().format('YYYY-MM-DD')} ${d}`)
        App.pop(GameConfig.pop.HourPop, [dates, this.updateDate.bind(this)], 'DatePop');
    }

    updateDate(dates) {
        dates = dates.slice().map(d => moment(d).format('HH:mm'));
        this.lblDate.string = dates.join(' - ');
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_ROOMS, this.init, this);
    }



}


