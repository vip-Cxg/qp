import Connector from "../../../Main/NetWork/Connector";
import ROUTE from "../../../Main/Script/ROUTE";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
const DESC_VOTE = {
    'wait': 0,
    'allow': 1,
    'refuse': 2
}
const { ccclass, property } = cc._decorator
@ccclass
export default class GameVotePop extends cc.Component {

    @property([cc.Node])
    nodePlayer = [];

    @property(cc.Node)
    btnAgree = null;
    @property(cc.Node)
    btnRefuse = null;

    @property(cc.Node)
    waitTips = null;
    @property(cc.Node)
    voteTips = null;

    @property(cc.Label)
    lblTime = null;
    @property(cc.Label)
    lblTips = null;

    @property([cc.SpriteFrame])
    statusSf = [];

    lblName = [];
    sprStatus = [];
    sprHead = [];

    onLoad() {
        this.node.zIndex = 999;
        this.nodePlayer.forEach((player) => {
            this.sprHead.push(player.getChildByName("sprHead").getComponent(Avatar));
            this.sprStatus.push(player.getChildByName("status").getComponent(cc.Sprite));
            this.lblName.push(player.getChildByName("lblName").getComponent(cc.Label));
        })
    }

    init(data) {
        this.node.zIndex = 999;
        if (data.status == "REFUSE" || data.status == "EMPTY") { //拒绝状态
            this.node.destroy();
            return;
        }
        this.lblTips.string = "等待其他玩家同意";
        if (data.cancel != null) {
            cc.director.getScheduler().unscheduleAllForTarget(this);
            this.node.destroy();
            return;
        }

        cc.director.getScheduler().unscheduleAllForTarget(this);
        let time = Math.floor((data.clock - GameUtils.getTimeStamp()) / 1000);
        this.lblTime.string = Math.max(time, 0);;
        this.schedule(() => {
            time--
            this.lblTime.string = Math.max(time, 0);
            if (time <= -5) {
                this.node.destroy();
            }
        }, 1);
        this.waitTips.active = data.data[TableInfo.idx] != 'wait'
        this.voteTips.active = data.data[TableInfo.idx] == 'wait';
        this.btnRefuse.active = data.data[TableInfo.idx] == 'wait';
        this.btnAgree.active = data.data[TableInfo.idx] == 'wait';

        data.data.forEach((status, i) => {
            this.sprStatus[i].spriteFrame = this.statusSf[DESC_VOTE[status]];
        });
        TableInfo.players.forEach((player, i) => {
            if (!player) return;
            this.nodePlayer[i].active = true;
            this.lblName[i].node.stopAllActions();
            this.lblName[i].string = GameUtils.getStringByLength(TableInfo.players[i].prop.name, 5);
            // if (this.lblName[i].node.width > 86) {
            //     let width = this.lblName[i].node.width;
            //     this.lblName[i].node.runAction(cc.repeatForever(cc.sequence(
            //         cc.delayTime(1),
            //         cc.moveTo(4, (80 - width) / 2, -2),
            //         cc.delayTime(1),
            //         cc.moveTo(4, (width - 80) / 2, -2)
            //     )))
            // }
            this.sprHead[i].avatarUrl = TableInfo.players[i].prop.head;
        });
        /** 托管一局自动解散 */
        if (data.type == 'auto'&&data.idx>=0) {
            this.lblTips.string = `玩家[${TableInfo.players[data.idx].prop?.name}]已开启自动托管,游戏即将自动解散`;
            this.btnAgree.active = false;
            this.btnRefuse.active = false;
            this.voteTips.active = false;
        }
    }

    refuse() {
        Connector.gameMessage(ROUTE.CS_DISBAND, 'refuse');
    }

    agree() {
        Connector.gameMessage(ROUTE.CS_DISBAND, 'allow');
    }

}


