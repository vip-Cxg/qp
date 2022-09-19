const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
@ccclass
export default class MyRecord extends cc.Component {
    _gameType = GameConfig.GameType.PDK
    @property(cc.Node)
    layerContent = null
    @property(cc.Label)
    lblCount = null
    init() {
        this.layerContent.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.GameLogs, { page: 1, pageSize: 50, clubID: App.Club.clubInfo.id, condition: { gameType: this._gameType }, isLeague: App.Club.isLeague, userID: App.Player.id  }, this.render.bind(this), true);
    }

    render(data) {  
        this.layerContent.removeAllChildren();
        let { logs: { rows, count } } = data;
        this.lblCount.string = `总条数:${count}`;
        rows.forEach(r => {
            GameUtils.instancePrefab(GameConfig.Item.RecordItem, r, this.layerContent);
        })
    }

    onClickToggle(toggle) {
        this._gameType = toggle.node._name;
        this.init();
    }
}