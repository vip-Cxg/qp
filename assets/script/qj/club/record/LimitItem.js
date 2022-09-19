const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
@ccclass
export default class Limit extends cc.Component {
    _limitID = null
    _players = []
    @property(cc.Node)
    btnAdd = null

    @property(cc.Node)
    btnLift = null

    @property(cc.Node)
    content = null

    init(data) {
        let { id, players } = data;
        this._limitID = id;
        this._players = players;
        this.content.removeAllChildren();
        players.forEach(p => {
            GameUtils.instancePrefab(GameConfig.Item.LimitUserItem, { limitID: id, ...p, players: players.map(p => p.id) }, this.content);
        })
        this.btnAdd.parent = this.content;
        this.btnAdd.active = true;
        this.btnAdd.zIndex = 1;
        this.btnLift.parent = this.content;
        this.btnLift.active = true;
        this.btnLift.zIndex = 1;
    }

    onClickAdd() {
        GameUtils.pop(GameConfig.pop.LimitPop, (node) => {
            node.getComponent(node._name).init(this._players.map(p => p.id));
        });
    }

    onClickLift() {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            {
                message: `是否要解除${this._players.map(p => p.name).join()}的同座的限制`,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.Limit, { clubID: App.Club.id, id: this._limitID }, this.successLift.bind(this), true)
                }
            }
        );
    }

    successLift() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_CLUB_LIMIT_LIST);
    }
}