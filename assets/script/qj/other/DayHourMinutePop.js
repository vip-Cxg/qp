/** 
 * 日期组件
 */
 const { ccclass, property } = cc._decorator;
 import { App } from "../../../ui/hall/data/App";
 import Connector from "../../../../Main/NetWork/Connector";
 import { GameConfig } from "../../../../GameBase/GameConfig";
 import GameUtils from "../../../common/GameUtils";
 import moment from './moment';
 import TimeSelect from "./TimeSelect";
 @ccclass
 export default class DayHourMinutePop extends cc.Component {
    @property(cc.Label)
    lblDate = null
    @property(cc.Node)
    ndDays = null
    @property(cc.Node)
    dateDetail = null
    @property(TimeSelect)
    TimeSelect = null

    @property(cc.Button)
    btnConfirm = null

    days = []

    calendar = null

    /** 月日 */
    _monthDay = null
    /** 时分 */
    _hourMinute = null

    onLoad () {
        // this.init(moment().format('YYYY-MM-DD HH:mm'));
        this.node.on('intouch', () => {
           this.btnConfirm.interactable = false;
        })

        this.node.on('overtouch', ({ detail }) => {
            let { date } = detail;
            this.hourMinute = moment(date).format('HH:mm');
            cc.log(date);
            this.btnConfirm.interactable = true;
        })
    }

    get date() {
        return this.monthDay + ' ' + this.hourMinute;
    }

    get monthDay() {
        return this._monthDay;
    }

    set monthDay(value) {
        this._monthDay = value;
        this.lblDate.string = this.date;
    }

    get hourMinute() {
        return this._hourMinute;
    }

    set hourMinute(value) {
        this._hourMinute = value;
        this.lblDate.string = this.date;
    }

    init(date = moment().format('YYYY-MM-DD HH:mm'), cb) {
        if (cb) this.cb = cb;
        this.monthDay = moment(date).format('YYYY-MM-DD');
        this.hourMinute = moment(date).format('HH:mm');
        this.calendar = this.monthDay;
        /** 月日 */
        this.initData();
        this.updateDate();
        /** 时分 */
        this.TimeSelect.init(date, 0);
    }

    initData() {
        this.days = [];
        for (let i = 0; i < 31; ++i) {
            let node = cc.instantiate(this.dateDetail);
            node.parent = this.ndDays;
            node.active = true;
            this.days.push(node.getComponent(node._name));
        }
    }

    updateDate() {
        let date = this.calendar;
        let totalDays = moment(date).endOf('month').date();
        let fromWeek = moment(date).startOf('month').day();
        for (let i = 0; i < this.days.length; ++i) {
            let day = this.days[i];
            let node = day.node;
            if (i < totalDays) {
                node.active = true;
                let index = fromWeek + i;
                let row = Math.floor(index / 7);
                let col = index % 7;
                let x = -(this.ndDays.width - node.width) * 0.5 + col * node.width;
                let y = (this.ndDays.height - node.height) * 0.5 - row * node.height;
                node.setPosition(x, y);
                let isUnEnabled = moment(date).date(i + 1) > moment() || Math.abs(moment(date).date(i + 1).diff(moment(), 'days')) > 30;
                if (isUnEnabled) {
                    node.opacity = 70;
                    node.getComponent(cc.Button).interactable = false;
                } else {
                    node.opacity = 255;
                    node.getComponent(cc.Button).interactable = true;
                }
                day.setDay(i, i + 1, moment(this.date).date() == i + 1 && !isUnEnabled, (selIndex, selDay, d) => {
                    this.monthDay = d;
                    this.updateDate();
                }, moment(date).date(i + 1).format('YYYY-MM-DD'));
            } else {
                node.active = false;
            }
        }
    }

    onClickLeft () {
        this.calendar = moment(this.calendar).add(-1, 'month').format('YYYY-MM-DD');
        // this.monthDay = moment(this.date).add(-1, 'month').format('YYYY-MM-DD');
        this.updateDate();
    }

    onClickRight() {
        this.calendar = moment(this.calendar).add(1, 'month').format('YYYY-MM-DD');
        this.updateDate();
    }

    // 设置选中日期之后的回调
    setPickDateCallback(cb) {
        this.cb = cb;
    }

    onClickClose () {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickConfirm() {
        if (this.cb) {
            this.cb(this.date);
        }
        this.onClickClose();
    }
 }
