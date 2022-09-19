const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from '../../other/moment';

@ccclass
export default class DailyOverViewItem extends cc.Component {
    @property(cc.Label)
    lblDate = null
    @property(cc.Label)
    lblPerson = null
    @property(cc.Label)
    lblNewPerson = null
    @property(cc.Label)
    lblQuitPerson = null
    @property(cc.Label)
    lblActivePerson = null
    @property(cc.Label)
    lblTable = null
    @property(cc.Label)
    lblPay = null

    init(data) {
        let { strDate, person, newPerson, quitPerson, activePerson, table, pay } = data;
        this.lblDate.string = moment(strDate).format('MM/DD');
        this.lblPerson.string = person;
        this.lblNewPerson.string = newPerson;
        this.lblQuitPerson.string = quitPerson;
        this.lblActivePerson.string = activePerson;
        this.lblTable.string = table;
        this.lblPay.string = pay;
    }
  
}