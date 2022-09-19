import { GameConfig } from "../../GameBase/GameConfig";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import Avatar from "../../script/ui/common/Avatar";

const { ccclass, property } = cc._decorator
@ccclass
export default class MJSummaryItem extends cc.Component {
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
    lblHuCount = null;
    @property(cc.Label)
    winScore = null;
    @property(cc.Label)
    loseScore = null;


    renderUI(data, summary = -1) {

        this.winIcon.active = summary == 1;
        this.loseIcon.active = summary == 0;

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
            this.lblName.string = TableInfo.players[data.idx].prop.name;
            this.lblId.string = TableInfo.players[data.idx].prop.pid;
        } catch (error) {
            this.lblName.string = '玩家已离开'
            this.lblId.string = ''
        }

        this.avatar.avatarUrl = TableInfo.players[data.idx].prop.head;
        this.lblHuCount.string = '胡牌次数: ' + data.hu;
    }

}


