const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";

@ccclass
export default class ClubOperateMemberPop extends cc.Component {
    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblGroup = null
    @property(cc.Node)
    btnDelMember = null
    @property(cc.Node)
    btnModifyRemark = null
    @property(cc.Node)
    btnUpgradeProxy = null
    @property(cc.Node)
    btnCheckGroup = null

    user = null

    init(data, mode = 0) {
        this.user = data;
        let { user: { head, name }, userID, score, remark = '', role, pageIndex } = data;
        this.avatar.avatarUrl = head;
        this.lblName.string = name;
        if (remark.length > 0) {
            this.lblName.string = `${name}(${remark})`;
        }
        this.lblID.string = `ID:${userID}`;
        if (score > 0) {
            this.btnDelMember.active = false;
        }
        // this.btnUpgradeProxy.active = role == GameConfig.ROLE.USER;
        this.lblGroup.string = `当前分组:${App.Player.name}(ID:${App.Player.id})`;
        // if (pageIndex == 0)
         this.btnCheckGroup.active = false;
        if (pageIndex == 0) this.btnUpgradeProxy.active = false;

        App.EventManager.addEventListener(GameConfig.GameEventNames.INIT_MEMBERS_LIST, this.onClickClose, this);
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.INIT_MEMBERS_LIST, this.onClickClose, this);
    }

    onClickModifyRemark() {
        App.pop(GameConfig.pop.ChangeRemarkPop, this.user);
    }

    onClickDelMemebr() {
        App.confirmPop(`确定删除成员【${this.user.user.name}】吗?`, () => {
            Connector.request(
                GameConfig.ServerEventName.Kick, 
                { clubID: App.Club.id, userID: this.user.userID }, 
                () => {
                    this.user.node.destroy();
                    this.onClickClose();
                }
            )
        })
    }

    onClickCheckGroup() {
        App.pop(GameConfig.pop.CheckGroupPop, this.user);
    }

    onClickUpgradeProxy() {
        App.pop(GameConfig.pop.UpgradeProxyPop, this.user);
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}