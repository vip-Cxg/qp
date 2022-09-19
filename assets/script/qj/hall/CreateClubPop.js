
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class createClubPop extends cc.Component {

    @property(cc.Label)
    lblClubName = null;

    @property(Avatar)
    avatar = null

    onLoad() {
        this.node.active = true;
        this.avatar.avatarUrl = App.Player.head;
    }

    onClickCreate() {
        let clubName = this.lblClubName.string;
        clubName = clubName.replace(/\s*/g,"");
        /** 验证长度,特殊字符 */
        let { verify, message } = GameUtils.verifyString(clubName, 6);
        message = message.replace(/\$/, "茶馆名称");
        if (!verify) {
            GameUtils.alertTips(message);
            return;
        }
        Connector.request(GameConfig.ServerEventName.CreateClub, { clubName }, this.createCallback.bind(this), true)
    }

    createCallback() {
        this.onClickClose();
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_CLUB_LIST, {})
    }
 
    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }





}


