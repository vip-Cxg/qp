const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";

@ccclass
export default class CheckGroupItem extends cc.Component {
    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Node)
    nodeStar = null

    user = null
    sourceID = null

    init(data, sourceID) {
        this.sourceID = sourceID;
        this.user = data;
        let { user: { name, head }, userID, star = false } = data;
        this.lblName.string = name;
        this.lblID.string = `ID:${userID}`;
        this.avatar.avatarUrl = head;
        this.nodeStar.active = star;
    }

    onClick() {
        Connector.request(
            GameConfig.ServerEventName.UpdateGroup, 
                { 
                    userID: this.sourceID,
                    clubID: App.Club.id,
                    targetID: this.user.userID  
                }, 
                () => {
                    App.alertTips('分组成功');
                    App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_MEMBERS_LIST);
                    
                }
            );
    }
}