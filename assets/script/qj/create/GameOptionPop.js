const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";

@ccclass
export default class GameOptionPop extends cc.Component {

    @property(cc.EditBox)
    editBoxName = null
    @property(cc.ToggleContainer)
    toggleContainer = null
    color = 0
    request = {}
    /**
     * 
     * @param {object} option 
     * @param {number} option.person
     * @param {object} option.room
     */
    init({ base, person, isLeague, room, auto, rules, fee, gameType, index }) {
        /** 修改 */
        if (room) {
            let { color, name } = room;
            this.color = color;
            this.toggleContainer.toggleItems[color].check();
            this.editBoxName.string = name;
        } else {
            /** 新建 */
            this.editBoxName.string = GameConfig.GameName[gameType];
        }
        this.request = {
            base,
            person,
            isLeague,
            auto,
            rules,
            fee,
            gameType,
            index,
            clubID: App.Club.id,
            roomID: room ? room.roomID : null
        }
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickConfirm() {
        Connector.request(
            GameConfig.ServerEventName.GameRoom, 
            { ...this.request, color: this.color, name: this.editBoxName.string },
            this.successCallback.bind(this)
        );
    }

    successCallback(data) {
        let { rooms } = data;
        App.Club.rooms = rooms;
        GameUtils.alertTips('修改成功');
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_CREATE);
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_ROOMS);
        this.onClickClose();
    }

    /** 选择桌布 */
    onClickToggle(toggle) {
        this.color = toggle.node._name;
    }
}