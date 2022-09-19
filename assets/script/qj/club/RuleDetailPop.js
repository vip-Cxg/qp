const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";

@ccclass
export default class RuleDetailPop extends cc.Component {
    @property(cc.Label)
    lblRule = null
    @property(cc.Label)
    lblTurn = null
    @property(cc.Label)
    lblBase = null
    @property(cc.Label)
    lblFee = null
    @property(cc.Label)
    lblRuleDetail = null
    @property(cc.Node)
    nodeTips = null
    @property(cc.Node)
    btnObserve = null
    @property(cc.Node)
    btnJoin = null
    data = null
    init(data) {
        let { rules, gameType, fee: { isAA, aaFee, win, payMode, limit }, status } = data;
        this.data = data;
        let { base, turn } = rules;
        let [ruleTitle, rulesArray] = GameUtils.getChineseRule(rules, gameType);
        this.lblRule.string = ruleTitle;
        this.lblBase.string = base;
        this.lblTurn.string = turn;
        this.nodeTips.active = !isAA;
        this.lblFee.string = isAA ? `AA支付(${aaFee})` : '大赢家支付';
        let isLeague = App.Club.isLeague;
        if (isLeague) {
            let attach = [];
            let pay = payMode ? '合伙人AA支付':'馆主支付';
            attach.push(`元宝支付:${pay}`);
            attach.push(`参赛限制:${limit}`);
            rulesArray = [...attach, ...rulesArray]
        } else {
            this.lblFee.string = '馆主支付';
            this.nodeTips.active = false;
        }
        this.lblRuleDetail.string = rulesArray.join('   ');
        this.btnJoin.active = status == 'WAIT';
        this.btnObserve.active = status != 'WAIT';
    }

    onClickTips() {
        App.pop(GameConfig.pop.FeeDetailPop, this.data);
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickJoin() {
        let { tableID, isLeague, roomID, gameType, clubID } = this.data;
        Connector.request(GameConfig.ServerEventName.JoinClubGame, { club: { clubID, isLeague, roomID: roomID }, gameType, tableID });
    }
  
}