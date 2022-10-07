
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";

@ccclass
export default class LeagueRuleItem extends cc.Component {
    @property(cc.Label)
    lblTitle = null

    @property(cc.Label)
    lblBase = null

    @property(cc.Label)
    lblPerson = null

    @property(cc.Label)
    lblTurn = null

    @property(cc.Label)
    lblLimit = null

    @property(cc.Label)
    lblFree = null

    @property(cc.Label)
    lblRules = null

    @property(cc.Label)
    lblAA = null

    @property(cc.Label)
    lblWin = null


    clickTime=0;

    init(data) {
        this._room = data;
        console.log('房间---',data)
        let { rules: { base, person, turn }, fee: { limit, isAA, aaFee, win: { free } }, index, gameType } = data;
        this.lblBase.string = `底分:${base}`;
        this.lblPerson.string = `人数:${person}`;
        this.lblTurn.string = `局数${turn}`;
        let [ruleTitle, rulesArray] = GameUtils.getChineseRule(data.rules, gameType);
        this.lblTitle.string = `玩法${index + 1}[${ruleTitle}]`;
        this.lblRules.string = rulesArray.join(' ');
        this.lblLimit.string = limit;
        this.lblAA.node.parent.active = isAA;
        this.lblAA.string = aaFee;
        this.lblWin.node.active = !isAA;
        this.lblFree.node.parent.active = !isAA;
        this.lblFree.string = free;
    }

    onClickModify() {
        let pop = GameConfig.pop.CreatePop;
        let { roomID } = this._room;
        App.pop(pop, ['LEAGUE', roomID]);
    }   

    successCallback(data) {
        App.Club.rooms = data.rooms;
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_ROOMS);
    }

    onClickTips() {
        App.pop(GameConfig.pop.FeeDetailPop, this._room);
    }

    onclickBan() {
        
        let nowTime=new Date().getTime();
        if(nowTime-this.clickTime<=2000){
            return;
        }
        this.clickTime=nowTime;
        let { roomID, isLeague, clubID } = this._room;
        Connector.request(
            GameConfig.ServerEventName.GameRoom, 
            { roomID, isLeague, isEnabled: 0, clubID },
            this.successCallback.bind(this)
        );
    }
}


