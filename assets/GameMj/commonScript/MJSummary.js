import { GameConfig } from "../../GameBase/GameConfig";
import Connector from "../../Main/NetWork/Connector";
import ROUTE from "../../Main/Script/ROUTE";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import Avatar from "../../script/ui/common/Avatar";
import { App } from "../../script/ui/hall/data/App";
const PositionIdx = ['bottom', 'right', 'top', 'left'];

const { ccclass, property } = cc._decorator
@ccclass
export default class MJSummary extends cc.Component {
    @property(cc.Node)
    winNode = null;
    @property(cc.Node)
    lostNode = null;
    @property(cc.Node)
    pingNode = null;
    @property(cc.Node)
    winPlayer = null;
    @property(cc.Node)
    losePlayer = null;


    renderUI(data) {
        // [
        //     {
        //         "total": 0,
        //         "hu": 0,
        //         "idx": 0
        //     },
        //     {
        //         "total": 0,
        //         "hu": 0,
        //         "idx": 1
        //     }
        // ]
        let winData = {};
        let loseData = {};

        if (data[0].total > data[1].total) {
            winData = data[0];
            loseData = data[1];
            this.winNode.active = true;
            this.lostNode.active = true;
            this.pingNode.active = false;

        } else if (data[0].total < data[1].total) {
            winData = data[1];
            loseData = data[0];

            this.winNode.active = true;
            this.lostNode.active = true;
            this.pingNode.active = false;
        } else {
            this.winNode.active = false;
            this.lostNode.active = false;
            this.pingNode.active = true;
            winData = data[0];
            loseData = data[1];
        }
        try {
            this.winPlayer.getChildByName('name').getComponent(cc.Label).string = TableInfo.players[winData.idx].prop.name;
            this.winPlayer.getChildByName('id').getComponent(cc.Label).string = TableInfo.players[winData.idx].prop.pid;
            this.winPlayer.getChildByName('mask').getChildByName('Avatar').getComponent(Avatar).avatarUrl = TableInfo.players[winData.idx].prop.head;

        } catch (error) {
            
            this.winPlayer.getChildByName('name').getComponent(cc.Label).string = '玩家已离开';
            this.winPlayer.getChildByName('id').getComponent(cc.Label).string = '';
        }


        try {

            this.losePlayer.getChildByName('name').getComponent(cc.Label).string = TableInfo.players[loseData.idx].prop.name;
            this.losePlayer.getChildByName('id').getComponent(cc.Label).string = TableInfo.players[loseData.idx].prop.pid;
            this.losePlayer.getChildByName('mask').getChildByName('Avatar').getComponent(Avatar).avatarUrl = TableInfo.players[loseData.idx].prop.head;

        } catch (error) {
            
            this.losePlayer.getChildByName('name').getComponent(cc.Label).string = '玩家已离开';
            this.losePlayer.getChildByName('id').getComponent(cc.Label).string = '';
        }
        // this.winPlayer.getChildByName('name').getComponent(cc.Label).string = TableInfo.players[winData.idx].prop.name;
        // this.winPlayer.getChildByName('id').getComponent(cc.Label).string = TableInfo.players[winData.idx].prop.pid;
        // this.winPlayer.getChildByName('mask').getChildByName('Avatar').getComponent(Avatar).avatarUrl = TableInfo.players[winData.idx].prop.head;
        // this.losePlayer.getChildByName('name').getComponent(cc.Label).string = TableInfo.players[loseData.idx].prop.name;
        // this.losePlayer.getChildByName('id').getComponent(cc.Label).string = TableInfo.players[loseData.idx].prop.pid;
        // this.losePlayer.getChildByName('mask').getChildByName('Avatar').getComponent(Avatar).avatarUrl = TableInfo.players[loseData.idx].prop.head;

        this.winPlayer.getChildByName('huCount').getComponent(cc.Label).string = '胡牌次数: ' + winData.hu;
        this.winPlayer.getChildByName('score').getComponent(cc.Label).string = winData.total > 0 ? '+' + GameUtils.formatGold(winData.total) : '' + GameUtils.formatGold(winData.total);
        this.losePlayer.getChildByName('huCount').getComponent(cc.Label).string = '胡牌次数: ' + loseData.hu;
        this.losePlayer.getChildByName('score').getComponent(cc.Label).string = '' + GameUtils.formatGold(loseData.total);
    }

    onClickNext() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.MJ_GAME_NEXT);
        this.node.destroy();
    }

    onClickBack() {
        Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
        this.node.destroy();
        // cc.director.loadScene("Lobby");
    }


}


