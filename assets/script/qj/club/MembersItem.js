import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
const { ccclass, property } = cc._decorator
import Avatar from "../../ui/common/Avatar";
import { App  } from "../../ui/hall/data/App";
import Cache from "../../../Main/Script/Cache";
@ccclass
export default class MembersItem extends cc.Component {

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
    @property(cc.SpriteFrame)
    sprFrameOffice = []
    @property(cc.Node)
    nodeBtn = []
    @property(cc.Button)
    btnTransfer = null
    @property(cc.Button)
    btnKick = null
    @property(cc.Layout)
    layoutBtn = null
    _data = null
    _office = [GameConfig.ROLE.OWNER, GameConfig.ROLE.MANAGER, GameConfig.ROLE.PROXY, GameConfig.ROLE.USER]

    init(data) {
        this._data = data;
        let { role, lastDate, status, user: {  name, head }, userID, remark = '', inBlack = false  } = data;
        this.Avatar.avatarUrl = head;
        if (GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role)) {
            this.lblID.string = `ID:${userID}`;
        } else {
            let reg = /^(\d{2})\d{4}(\d{2})$/;
            this.lblID.string = 'ID:' + (userID + '').replace(reg, '$1****$2');
        }
        this.lblName.string = name + (remark && GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role) ? `(${remark})` : '');
        this.lblDate.string = lastDate;
        this.sprOffice.spriteFrame = this.sprFrameOffice[this._office.indexOf(role)];
        let selfRole = App.Club.role;
        let selfID = App.Player.id;
        /** 自己 */
        if (userID == selfID) {
            cc.log(this.layoutBtn);
            this.layoutBtn.node.active = false;
            return;
        }
        /**踢人 */
        /** 只有馆主,副馆主可以踢人 && 只能踢普通成员 */
        if (
            GameConfig.CAN_OPERATE_ROLE.includes(selfRole) && 
            role == GameConfig.ROLE.USER
        ) {
            this.btnKick.node.active = true;
        }
        /** 只有馆主可以转让 && 只能转让给副馆主 */
        /** 只有馆主可以撤销副馆主 && 该成员是副馆主*/
        if (
            selfRole == GameConfig.ROLE.OWNER &&
            role == GameConfig.ROLE.MANAGER
        ) {
            this.nodeBtn[0].active = false;
            this.nodeBtn[1].active = true;
            this.btnTransfer.node.active = true;
        }
        /** 只有馆主可以设置副馆主 && 该成员不是副馆主*/
        if (
            selfRole == GameConfig.ROLE.OWNER &&
            role != GameConfig.ROLE.MANAGER
        ) {
            this.nodeBtn[0].active = true;
            this.nodeBtn[1].active = false;
        }
        /** 只有馆主和副馆主可以禁止入座 && 该成员处于正常状态 */
        if (
            [GameConfig.ROLE.OWNER, GameConfig.ROLE.MANAGER].includes(selfRole) && 
            status == GameConfig.USER_STATUS.NORMAL
        ) {
            this.nodeBtn[2].active = true;
            this.nodeBtn[3].active = false;
        }
        /** 只有馆主和副馆主可以解除禁止入座 && 该成员处于禁止状态 */
        if (
            [GameConfig.ROLE.OWNER, GameConfig.ROLE.MANAGER].includes(selfRole) && 
            status == GameConfig.USER_STATUS.BAN
        ) {
            this.nodeBtn[2].active = false;
            this.nodeBtn[3].active = true;
        }
        this.nodeBtn[4].active = !inBlack;
        this.nodeBtn[5].active = inBlack;
    }

    onClickHead() {
        if (App.Club.role != GameConfig.ROLE.OWNER) return;
        GameUtils.pop(GameConfig.pop.ChangeRemarkPop, this.pop.bind(this));
    }

    /** 踢出 */
    onClickKick() {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: `确定踢出成员【${this._data.user.name}】吗?`,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.Kick, { clubID: App.Club.id, userID: this._data.userID }, this.successCallback.bind(this), true)
                }
            }
        );
    }

    successCallback() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_MEMBERS_LIST, {})
    }


    /** 拉黑 */
    onClickBlack(_, black) {
        black = Boolean(Number(black));
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: `确定要拉黑【${this._data.user.name}】吗?拉黑后无法在同一个房间内游戏!满24小时后拉黑关系将自动解除!`,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.SettingBlack, { clubID: App.Club.id, userID: this._data.userID, black }, this.successCallback.bind(this), true)
                }
            }
        );
    }

    /** 禁止入座 */
    onClickBan(_, status) {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: `确定禁止【${this._data.user.name}】入座吗?`,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.SettingStatus, { clubID: App.Club.id, userID: this._data.userID, status }, this.successCallback.bind(this), true)
                }
            }
        );
    }

    /** 设为副馆主 */
    onClickManager(_, office) {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: `确定将【${this._data.user.name}】设为副馆主吗?`,
                callback1: () => {
                    console.log("office",office);
                    // return;
                    Connector.request(GameConfig.ServerEventName.SettingOffice, { clubID: App.Club.id, userID: this._data.userID, office:GameConfig.ROLE[office] }, this.successCallback.bind(this), true)
                }
            }
        );
    }

    /** 转让馆主 */
    onClickTransfer() {
        Cache.alertTip('暂未开放')
    }

    pop(node) {
        node.getComponent(node._name).init(this._data);
    }
}


