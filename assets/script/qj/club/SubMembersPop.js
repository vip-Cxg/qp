const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import moment from "../other/moment"
import Avatar from "../../ui/common/Avatar";
@ccclass
export default class SubMembersPop extends cc.Component {
    @property(cc.Node)
    content = null

    @property(cc.Node)
    subMembersItem = null
    data = null

    init(data) {
        this.data = data;
        Connector.request(GameConfig.ServerEventName.SubMembers, { clubID: App.Club.id, oglClubID: data.oglClubID }, this.rander.bind(this));
    }

    rander({ userList }) {

        let { rows, count } = userList;
        this.content.removeAllChildren();
        rows.forEach((user, i) => {
            if (user.userID == this.data.userID) return;
            let node = cc.instantiate(this.subMembersItem);
            node.getComponent(node._name).init({ ...user, index: i, memberCount: count }, this);
            node.parent = this.content;
            node.active = true;
        })
    }


    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

}