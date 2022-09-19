const { ccclass, property } = cc._decorator;
import { App } from '../../ui/hall/data/App';
import TimeSelect from './TimeSelect';
import { GameConfig } from "../../../GameBase/GameConfig";
import moment from './moment';
@ccclass
export default class DatePop extends cc.Component {
    @property(TimeSelect)
    timeSelect = []
    @property(cc.Label)
    lblDate = []
    @property(cc.Button)
    btnConfirm = null
    mode = null
    cb = null

    setLblDate(date, idx) {
        let d = moment(date);
        let str = this.mode == 'day' ? d.format('HH:mm') : d.format('MM月DD日 HH:mm');
        this.lblDate[idx].string = `(${str})`;
    }

    get isDateVarify() {
        let date = [this.timeSelect[0].date, this.timeSelect[1].date];
        return date[1] > date[0];
    }

    init(dates, cb, mode = 'month') {
        // cc.log('++++');
        // cc.log(dates);
        if (cb) this.cb = cb;
        this.mode = mode;
        this.timeSelect[0].init(dates[0], 0);
        this.timeSelect[1].init(dates[1], 1);
        this.setLblDate(dates[0], 0);
        this.setLblDate(dates[1], 1);
        this.node.on('intouch', () => {
            this.btnConfirm.interactable = false;
        })
        this.node.on('overtouch', (event) => {
            let { date, idx } = event.detail;
            this.setLblDate(date, idx);
            this.btnConfirm.interactable = this.isDateVarify;
        })
    }

    onClickConfirm() {
        if (this.cb) this.cb([this.timeSelect[0].date, this.timeSelect[1].date]);
        // App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_CLUB_RECORD_DATE, [this.timeSelect[0].date, this.timeSelect[1].date])
        this.onClickClose();
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }


}