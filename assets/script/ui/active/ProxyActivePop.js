import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class ProxyActivePop extends cc.Component {

    @property(cc.Label)
    lblReward = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Button)
    btnReward = null;

    // use this for initialization
    onLoad() {
        this.renderUI();
    }

    renderUI() {
        Connector.request(GameConfig.ServerEventName.ProxyActivity, {}, (data) => {
            this.lblTurn.string = '今日炸弹局数: ' + data.turnToday + '/' + data.turn + '局';
            this.lblReward.string = '当前可领取奖励: ' + (data.activityReward/100).toFixed(2) + '元';
            this.btnReward.interactable = data.activityReward != 0;

        })
    }


    onConfirmBet() {
        
        Connector.request(GameConfig.ServerEventName.ProxyActivityReward, {}, (data) => {
            Cache.alertTip('领取成功');
            this.renderUI();
        }, true, (err) => {
            Cache.alertTip(err.message || '领取失败');

        })
    }

    onClickClose() {
        
        this.node.destroy();
    }

}


