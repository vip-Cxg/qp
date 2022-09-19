import { GameConfig } from "../../GameBase/GameConfig";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import Avatar from "../../script/ui/common/Avatar";

const { ccclass, property } = cc._decorator
@ccclass
export default class PokerSummaryItem extends cc.Component {
    @property(Avatar)
    avatar = null;
    @property(cc.Label)
    lblName = null;
    @property(cc.Label)
    lblId = null;
    @property(cc.Node)
    winIcon = null;
    @property(cc.Node)
    loseIcon = null;
    @property(cc.Label)
    lblBombCount = null;
    @property(cc.Label)
    lblSprCount = null;
    @property(cc.Label)
    lblWinCount = null;
    @property(cc.Label)
    winScore = null;
    @property(cc.Label)
    loseScore = null;


    renderUI(data, summary = -1) {

        this.winIcon.active = summary == 1 && data.total != 0;
        this.loseIcon.active = summary == 0 && data.total != 0;

        if (data.total > 0) {

            this.winScore.node.active = true;
            this.loseScore.node.active = false;
            this.winScore.string = "+" + GameUtils.formatGold(data.total);

        } else {
            this.loseScore.node.active = true;
            this.winScore.node.active = false;
            this.loseScore.string = '' + GameUtils.formatGold(data.total);
        }

        try {
            //名字

            this.avatar.avatarUrl = TableInfo.players[data.idx].prop.head;
            this.lblName.string = TableInfo.players[data.idx].prop.name;
        } catch (error) {
            //名字
            this.lblName.string = "玩家已离开";
            this.lblId.string = '';

        }
        if (TableInfo.options.gameType == GameConfig.GameType.PDK) {

            this.lblBombCount.string = '炸弹次数: ' + data.bomb;
            this.lblSprCount.string = '春天次数: ' + data.spring;
            this.lblWinCount.string = '胜利次数: ' + data.win;
        } else {
            this.lblBombCount.string = '头游次数: ' + data.first;
            this.lblSprCount.string = '尾游次数: ' + data.tail;
            this.lblWinCount.string = '胜利次数: ' + data.win;
        }
    }

}


