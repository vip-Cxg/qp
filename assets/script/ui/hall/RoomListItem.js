import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../common/GameUtils";
import { App } from "./data/App";

const { ccclass, property } = cc._decorator
@ccclass
export default class RoomListItem extends cc.Component {

    @property(cc.Label)
    lblGameName = null;
    @property(cc.Label)
    lblRoomName = null;
    @property(cc.Label)
    lblPerson = null;
    @property(cc.Label)
    lblBase = null;
    @property(cc.Label)
    lblFee = null;
    @property(cc.Label)
    lblLower = null;

    roomID = null;
    onLoad() {
        // this.addEvents();
        // this.renderUI();
    }

    initData(data) {

        // {
        //             "roomID": 100000,
        //             "name": "10元",
        //             "gameType": "XHZD",
        //             "base": 100,
        //             "fee": 10,
        //             "lower": 2000,
        //             "person": 4
        //         }
        this.roomID = data.roomID;
        this.lblGameName.string = GameConfig.GameName[data.gameType];
        this.lblRoomName.string = data.name;
        this.lblPerson.string = data.person + '人场';
        this.lblBase.string = GameUtils.formatGold(data.base);
        this.lblFee.string = GameUtils.formatGold(data.fee);
        this.lblLower.string = GameUtils.formatGold(data.lower);

    }

    onDeleteRoom() {
        
        console.log('删除房型--', this.roomID);
        Connector.request(GameConfig.ServerEventName.DeleteRoom, { clubID: App.Club.CurrentClubID, roomID: this.roomID }, (data) => {
            Cache.alertTip('成功删除');
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.CLUB_ROOM_CHANGE);
            this.node.destroy();
        }, true, (err) => {
            Cache.alertTip(err.message || '删除失败');

        })

    }

}


