import GameUtils from "../../common/GameUtils";
import moment from "./moment";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TimeSelect extends cc.Component {
    @property(cc.ScrollView)
    scrollViewDay = null
    @property(cc.ScrollView)
    scrollViewHour = null
    @property(cc.ScrollView)
    scrollViewMinutes = null
    _scrollView = null
    _Y = [[], [], []]

    _day = null
    _hour = null
    _minute = null

    _idx = 0

    get date() {
        return moment().add((this._day || 0 ) - 2, 'days').hour(this._hour).minute(this._minute).format('YYYY-MM-DD HH:mm');
    }

    _colorLabel = [[165, 106, 54, 255], [220, 33, 0, 255]]

    init(date, idx) {
        this._idx = idx;
        let day = moment(date.slice(0, 10)).diff(moment().hour(0).minute(0).second(0), 'days') + 2;
        let hour = moment(date).hour();
        let minute = moment(date).minute();
        if (day || day == 0) {
            this.initDays(day);
        }
        this.initHours(hour);
        this.initMinutes(minute);
    }

    emitInTouch() {
        let event = new cc.Event.EventCustom('intouch', true);
        this.node.dispatchEvent(event);
    }

    emitOverTouch() {
        let event = new cc.Event.EventCustom('overtouch', true);
        event.detail = { date: this.date, idx: this._idx };
        cc.log(this._hour, this._minute, this.date);
        this.node.dispatchEvent(event);
    }

    initDays(day) {
        let mode = 0;
        this._Y[mode] = [-58, -2, 54];
        this.scrollViewDay.node.on('touchstart', () => {
            this.emitInTouch();
        });

        this.scrollViewDay.node.on('touchend', () => {
            this.fixPos(this.scrollViewDay, mode);
        });

        this.scrollViewDay.node.on('touchcancel', () => {
            this.fixPos(this.scrollViewDay, mode);
        });

        this.scrollViewDay.content.setPosition(0, this._Y[mode][day]);
        this.fixPos(this.scrollViewDay, mode);
        this.onScroll(this.scrollViewDay, null,  mode);
    }

    initMinutes(minute) {
        let Y = [];
        let startY = 0;
        let mode = 2;
        for (let i = 0; i < 62; i ++) {
            let stencil = this.node.getChildByName('0');
            let node = cc.instantiate(stencil);
            node.parent = this.scrollViewMinutes.content;
            node.active = true;
            let value = '';
            if (i < 60) {
                Y.push(startY);
                startY += node.height;
                value = GameUtils.fixTime(i);
                node._name = i;
            } else {
                node._name = '-1';
            }
            node.getChildByName('lbl').getComponent(cc.Label).string = value;
        }
        this._Y[mode] = Y;

        this.scrollViewMinutes.node.on('touchstart', () => {
            this.emitInTouch();
        });
        this.scrollViewMinutes.node.on('touchend', () => {
            this.fixPos(this.scrollViewMinutes, mode);
        });

        this.scrollViewMinutes.node.on('touchcancel', () => {
            this.fixPos(this.scrollViewMinutes, mode);
        });
        this.scrollViewMinutes.content.setPosition(0, this._Y[mode][minute]);
        this.fixPos(this.scrollViewMinutes, mode);
        this.onScroll(this.scrollViewMinutes, null, mode);
    }

    initHours(hour) {
        let Y = [];
        let startY = 0;
        let mode = 1;
        for (let i = 0; i < 26; i ++) {
            let stencil = this.node.getChildByName('0');
            let node = cc.instantiate(stencil);
            node.parent = this.scrollViewHour.content;
            node.active = true;
            let value = '';
            if (i < 24) {
                Y.push(startY);
                startY += node.height;
                value = GameUtils.fixTime(i);
                node._name = i;
            } else {
                node._name = '-1';
            }
            node.getChildByName('lbl').getComponent(cc.Label).string = value;
        }
        this._Y[mode] = Y;


        this.scrollViewHour.node.on('touchstart', () => {
            this.emitInTouch();
        });
        this.scrollViewHour.node.on('touchend', () => {
            this.fixPos(this.scrollViewHour, mode);
        });

        this.scrollViewHour.node.on('touchcancel', () => {
            this.fixPos(this.scrollViewHour, mode);
        });
        this.scrollViewHour.content.setPosition(0, this._Y[mode][hour]);
        this.fixPos(this.scrollViewHour, mode);
        this.onScroll(this.scrollViewHour, null, mode);
    }

    fixPos(scrollView, mode) {
        let y = Math.floor(scrollView.content.position.y);
        let idx = this.minIdx(y, mode);
        switch(mode) {
            case 0:
                this._day = idx;
                break;
            case 1:
                this._hour = idx;
                break
            case 2:
                this._minute = idx;
                break;
        }
        scrollView.content.stopAllActions();
        scrollView.content.runAction(cc.moveTo(0.2, scrollView.content.position.x, this._Y[mode][idx]));
        if (!GameUtils.isNullOrEmpty(this._day) && !GameUtils.isNullOrEmpty(this._hour) && !GameUtils.isNullOrEmpty(this._minute)) {
            this.emitOverTouch();
        }
    }

    minIdx(posY, mode) {
        let difference = [] 
        this._Y[mode].forEach(y => {
            difference.push(y - posY);
        });
        difference = difference.map(d => Math.abs(d));
        let minY = Math.min(...difference);
        return difference.indexOf(minY);
    }

    /**
     * 
     * @param {*} event 
     * @param {String} mode  0日期  1小时  2分钟
     */
    onScroll(event, _, mode) {
        mode = Number(mode);
        let idx = this.minIdx(event.content.position.y, mode);
        event.content._children.filter(c => c._name != '-1').forEach((node, i) => {
            if (i == idx) {
                if (mode == 0) {
                    node.scaleX = 0.7;
                    node.scaleY = 0.7;
                    node.color = new cc.color(...this._colorLabel[1])
                } else {
                    let lbl = node.getChildByName('lbl');
                    lbl.scaleX = 0.7;
                    lbl.scaleY = 0.7;
                    node.getChildByName('lbl').color = new cc.color(...this._colorLabel[1])
                }
            } else {
                if (mode == 0) {
                    node.scaleX = 0.5;
                    node.scaleY = 0.5;
                    node.color = new cc.color(...this._colorLabel[0])
                } else {
                    let lbl = node.getChildByName('lbl');
                    lbl.scaleX = 0.5;
                    lbl.scaleY = 0.5;
                    node.getChildByName('lbl').color = new cc.color(...this._colorLabel[0])
                }
            }
        })
    }   
}