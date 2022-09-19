import BanMembersItem from "./BanMembersItem";
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import { App  } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
@ccclass
export default class BlackMembersItem extends BanMembersItem {
    init(data) {
        super.init(data);
    }

    onClickCancelBlack() {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: `确定要取消对【${this._data.user.name}】的拉黑吗?`,
                callback1: () => {
                    Connector.request(GameConfig.ServerEventName.SettingBlack, { clubID: App.Club.id, userID: this._data.userID, black: false }, this.successCallback.bind(this), true)
                }
            }
        );
    }
}