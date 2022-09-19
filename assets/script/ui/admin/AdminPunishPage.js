import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import DataBase from "../../../Main/Script/DataBase";
import { App } from "../hall/data/App";
const GAME_TYPE = {
    PDK: 'PDK_SOLO',
    LDZP: 'LDZP_SOLO',
    XHZD: 'XHZD',
    HZMJ: 'HZMJ_SOLO'
}
const { ccclass, property } = cc._decorator
@ccclass
export default class AdminPunishPage extends cc.Component {

    @property(cc.Label)
    punishId = null;

    @property(cc.Label)
    lblPunish = null;

    @property([cc.Label])
    playerArr = [];
    @property([cc.Label])
    wallerArr = [];
    @property([cc.EditBox])
    inputArr = [];

    reportID = null;
    replayID = null;
    playerData = null;

    renderUI(replayID, reportID) {
        this.reportID = reportID;
        this.replayID = replayID;
        Connector.request(GameConfig.ServerEventName.ProxyPunishDetail, { replayID }, (res) => {
            let reportIndex = res.players.findIndex((e) => e.id == reportID);
            try {
                this.punishId.string = '被举报人: ' + GameUtils.getStringByLength(res.players[reportIndex].name, 5) + 'ID:' + res.players[reportIndex].id + ' 该局输赢: ' + GameUtils.formatGold(res.players[reportIndex].game);

            } catch (error) {
                this.punishId.string = '被举报人: ' + res.players[reportIndex].id + ' 该局输赢: ' + GameUtils.formatGold(res.players[reportIndex].game);

            }
            this.lblPunish.string = '冻结金额: ' + GameUtils.formatGold(Math.abs(res.players[reportIndex].freeze + res.players[reportIndex].unfreeze)) + ' 该局已罚款: ' + GameUtils.formatGold(Math.abs(res.players[reportIndex].fine))
            let otherData = res.players.splice(reportIndex, 1);
            this.playerData = res.players.concat();
            res.players.forEach((e, i) => {
                this.playerArr[i].node.active = true;
                try {
                    this.playerArr[i].string = '玩家:' + GameUtils.getStringByLength(e.name, 5) + 'ID:' + e.id + ' 该局输赢: ' + GameUtils.formatGold(e.game) + ' 已补偿: ' + GameUtils.formatGold(e.rewardLose) + ' 该局已罚款: ' + GameUtils.formatGold(Math.abs(e.fine));

                } catch (error) {
                    this.playerArr[i].string = '玩家:' + e.id + ' 该局输赢: ' + GameUtils.formatGold(e.game) + ' 已补偿: ' + GameUtils.formatGold(e.rewardLose) + ' 该局已罚款: ' + GameUtils.formatGold(Math.abs(e.fine));

                }
            })

        })

    }



    onClickConfirm() {
        let confirmData = {};
        console.log('playerData', this.playerData);
        this.playerData.forEach((e, i) => {
            confirmData[e.id] = (parseInt(this.inputArr[i].string) || 0) * 100;
        })
        console.log('confirmData', confirmData);

        Connector.request(GameConfig.ServerEventName.ProxyPunish, { id: this.reportID, replayID: this.replayID, players: confirmData }, (res) => {
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PUNISH_CHANGE_STATUS);
            this.onClickClose();
        })
    }

    updateData() {
        this.renderUI(this.replayID, this.reportID)
    }

    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


