const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";

@ccclass
export default class QuickCreateItem extends cc.Component {
    @property(cc.Label)
    lblTitle = null
    @property(cc.Label)
    lblBase = null
    @property(cc.Label)
    lblRules = null
    @property(cc.Label)
    lblGameType = null

    data = null

    init(data) {
        this.data = data;
        this.node.active = true;
        this._roomID = data.roomID;
        this.node.active = true;
        let payMode = '馆主支付';
        console.log("房间信息--",data)
        let { rules, base, fee, gameType } = data;
        if (Object.keys(fee).length > 0) {
            if (fee.isAA) payMode = `AA支付(${fee.aaFee})`;
            if (!fee.isAA) payMode = '大赢家分档支付';
        }
        let { turn, person } = rules;
        this.lblGameType.string = GameConfig.GameName[gameType];
        let [ruleTitle, rulesArray] = GameUtils.getChineseRule(rules, gameType);
        this.lblRules.string = rulesArray.join('｜');
        this.lblTitle.string = `${ruleTitle}｜${payMode}`;
        let baseCreditStr=rules.baseCredit?`｜底子:${rules.baseCredit}`:'';
        this.lblBase.string = `底分:${rules.base}`+baseCreditStr+`｜局数:${turn} | 人数:${person}`;
    }

    onClickQuickCreate() {
        // cc.log(this.data);
        cc.sys.localStorage.setItem(`QUICK:CREATE`, this.data.roomID);
        let { clubID, isLeague, roomID, tableID = 0, gameType } = this.data;
        let questData = {
            club: {
                clubID,
                isLeague,
                roomID,
                oglClubID: App.Club.oglID
            },
            tableID,
            type:0,
            gameType
        }
        console.log("123123",questData)
        Connector.request(GameConfig.ServerEventName.JoinClubGame, questData, () => {
            App.unlockScene();
        }, 1, () => {
            App.unlockScene();
        })
    }

    onClickCreate() {
        // cc.log(this.data);
        cc.sys.localStorage.setItem(`QUICK:CREATE`, this.data.roomID);
        let { clubID, isLeague, roomID, tableID = 0, gameType } = this.data;
        let questData = {
            club: {
                clubID,
                isLeague,
                roomID,
                oglClubID: App.Club.oglID
            },
            tableID,
            type:1,
            gameType
        }
        console.log("123123",questData)
        Connector.request(GameConfig.ServerEventName.JoinClubGame, questData, () => {
            App.unlockScene();
        }, 1, () => {
            App.unlockScene();
        })
    }


}