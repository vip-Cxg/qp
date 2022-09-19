const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
@ccclass
export default class LimitPop extends cc.Component {
    @property(cc.Node)
    nodeEditBox = null

    _limitID = null;

    init(players = [], id = 0) {
        this._limitId = id;
        players.forEach((p, i) => {
            this.nodeEditBox._children[i].getComponent('cc.EditBox').string = p;
        })
    }

    /** 限制同座 */
    onClickConfirm() {
        let players = this.nodeEditBox._children.map(e => e.getComponent('cc.EditBox')).
        map(e => e.string).filter(e=> !GameUtils.isNullOrEmpty(e)).map(e => Number(e));
        Connector.request(
            GameConfig.ServerEventName.Limit, 
            { 
                clubID: App.Club.clubInfo.id, 
                id: this._limitID, 
                players  
            }, 
            this.success.bind(this), 
            true
        );
    }

    success() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_CLUB_LIMIT_LIST);
        this.onClickClose();
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}