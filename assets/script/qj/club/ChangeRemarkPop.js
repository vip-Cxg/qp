import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Avatar from "../../ui/common/Avatar";
const { ccclass, property } = cc._decorator
@ccclass
export default class ChangeRemarkPop extends cc.Component {

    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.EditBox)
    editBoxRemark = null
    _data = null
    init(data) {
        let { userID, user: { name, head }, remark = '' } = data;
        this._data = data;
        this.lblName.string = name;
        this.lblID.string = `ID:${userID}`;
        this.avatar.avatarUrl = head;
        this.editBoxRemark.string = remark;
    }

    onClickLeftToggle(toggle) {
        let index = toggle.node._name;
        this._pageIndex = index;
        this.scrollViews.forEach((scroll, i) => {
            scroll.node.parent.active = i == index;
            scroll.content.removeAllChildren();
            if (i == index) this.render(scroll);
        })
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickCommit() {
        let remark = this.editBoxRemark.string;
        remark = remark.replace(/\s*/g,"") || " ";
        /** 验证长度,特殊字符 */
        let { verify, message } = GameUtils.verifyString(remark, 6);
        message = message.replace(/\$/, "备注");
        if (!verify) {
            GameUtils.alertTips(message);
            return;
        }
        Connector.request(GameConfig.ServerEventName.ChangeRemark, { clubID: App.Club.id, remark, userID: this._data.userID }, this.successCallback.bind(this), true)
    }

    successCallback(data) {
        let { remark } = data;
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID: this._data.userID, remark });
        App.alertTips('修改成功');
        this.onClickClose();
    }

}


