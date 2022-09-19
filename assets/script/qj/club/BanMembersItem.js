import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
const { ccclass, property } = cc._decorator
import Avatar from "../../ui/common/Avatar";
import { App  } from "../../ui/hall/data/App";
@ccclass
export default class BanMembersItem extends cc.Component {
    @property(Avatar)
    Avatar = null
    @property(cc.Label)
    lblDate = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblName = null
    @property(cc.Sprite)
    sprOffice = null
    _data = null
    _office = [GameConfig.ROLE.OWNER, GameConfig.ROLE.MANAGER, GameConfig.ROLE.PROXY, GameConfig.ROLE.USER]

    init(data) {
        this._data = data;
        let { role, lastDate, user: {  name, head }, userID, remark = '', black = false  } = data;
        this.lblName.string = name + (remark && GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role) ? `(${remark})` : '');
        this.lblDate.string = lastDate;
        // this.lblID.string = userID;
        if (GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role)) {
            this.lblID.string = `ID:${userID}`;
        } else {
            let reg = /^(\d{2})\d{4}(\d{2})$/;
            this.lblID.string = 'ID:' + (userID + '').replace(reg, '$1****$2');
        }
        this.Avatar.avatarUrl = head;
    }

    /** 踢出 */
    onClickCancelBan() {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: `确定要解除【${this._data.user.name}】的入座限制吗?`,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.SettingStatus, { clubID: App.Club.id, userID: this._data.userID, status: 'normal' }, this.successCallback.bind(this), true)
                }
            }
        );
    }

  

    successCallback() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_MEMBERS_LIST, {})
    }
}


