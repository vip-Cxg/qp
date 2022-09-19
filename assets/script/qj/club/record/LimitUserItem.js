const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import Avatar from "../../../ui/common/Avatar";
@ccclass
export default class Limit extends cc.Component {
    @property(cc.Label)
    lblName = null
    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblID = null

    _limitID = null
    _userID = null
    _players = null
    init(data) {
        let { limitID, name, id, head, players } = data;
        this._limitID = limitID;
        this._userID = id;
        this.lblName.string = name;
        this.lblID.string = `ID:${id}`;
        this.avatar.avatarUrl = head;
        this._players = players;
    }

    onClickDelete() {

        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            {
                message: `是否要移除${this._userID}`,
                callback1: () => {
                    Connector.request(
                        GameConfig.ServerEventName.Limit, 
                        { 
                            clubID: App.Club.clubInfo.id, 
                            id: this._limitID, 
                            players: this._players.filter(p => p != this._userID)
                        }, 
                        this.success.bind(this), 
                        true
                    );
                }
            }
        );
     
    }

    success() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_CLUB_LIMIT_LIST);
    }
}