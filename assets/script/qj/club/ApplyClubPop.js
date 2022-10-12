
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class ApplyClubPop extends cc.Component {

    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblHost = null
    @property(cc.EditBox)
    editBoxMessage = null
    @property(Avatar)
    avatar = null
    _club = null;
    init(data) {
        console.log("申请俱乐部---",data)

        this._club = data;
        let { club: { name, id }, owner } = data;
        this.lblName.string = name;
        this.lblID.string = `茶馆ID: ${id}`;
        this.lblHost.string = `茶馆馆主:${owner.name}`;
        this.avatar.avatarUrl=owner.head;
    }

    onClickApply() {
        let information = this.editBoxMessage.string;
        information = information.replace(/\s*/g,"") || " ";
        /** 验证长度,特殊字符 */
        let { verify, message } = GameUtils.verifyString(message, 10, null, null, false);
        message = message.replace(/\$/, "验证信息");
        if (!verify) {
            GameUtils.alertTips(message);
            return;
        }
        Connector.request(GameConfig.ServerEventName.ApplyJoinClub, { clubID: this._club.club.id, information }, this.successApply.bind(this), true)
    }

    successApply() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_CLUB_LIST, {})
        this.onClickClose();
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }





}


