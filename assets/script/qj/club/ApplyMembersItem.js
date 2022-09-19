
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class ApplyMembersItem extends cc.Component {

    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblRemark = null
    @property(Avatar)
    avatar = null
    data = null

    init(data) {
        this._data = data;
        let { user: {  name, head }, userID, remark = '' } = data;
        this.lblName.string = name;
        this.lblID.string = `ID: ${userID}`;
        this.lblRemark.string = remark;
        this.avatar.avatarUrl = head;
    }

    onClick(_, data) {
        let message;
        let operation;
        switch(data) {
            /** 忽略 */
            case '0':
                message = `确定忽略【${this._data.user.name}】的加入申请吗?`
                operation = 0;
                break;
            /** 拒绝 */
            case '1':
                message = `确定拒绝【${this._data.user.name}】的加入申请吗?`
                operation = 1;
                break;
            /** 同意 */
            case '2':
                message = `确定同意【${this._data.user.name}】的加入申请吗?`
                operation = 2;
                break;
        }
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            {
                message,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.HandleApply, { clubID: App.Club.id, userID: this._data.userID, operation }, this.successCallback.bind(this), true)
                }
            }
        );
    }

    successCallback() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_MEMBERS_LIST, {})
    }
}


