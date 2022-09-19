const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import CheckGroupItem from "./CheckGroupItem";
@ccclass
export default class CheckGroupPop extends cc.Component {
    @property(cc.Node)
    content = null
    @property(CheckGroupItem)
    checkGroupItem = null
    user = null

    init(data) {
        this.user = data;
        let { userID } = data;
        App.EventManager.addEventListener(GameConfig.GameEventNames.INIT_MEMBERS_LIST, this.onClickClose, this);
        Connector.request(GameConfig.ServerEventName.CheckGroup, { userID, clubID: App.Club.id }, this.rander.bind(this));
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.INIT_MEMBERS_LIST, this.onClickClose, this);
    }

    rander(data) {
        this.content.removeAllChildren();
        let { userList } = data;
        userList.forEach(user => {
            // this.checkGroupItem.init(user);
            let node = cc.instantiate(this.checkGroupItem.node);
            node._components[1].init(user, this.user.userID)
            node.parent = this.content;
            node.active = true;
        });
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}