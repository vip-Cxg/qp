const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";

@ccclass
export default class DailyOverView extends cc.Component {
    @property(cc.Node)
    content = null
    
    @property(cc.Node)
    dailyOverViewItem = null

    init() {
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.DailyOverView, { clubID: App.Club.id }, ({ overView }) => {
            overView.forEach(data => {
                App.instancePrefab(this.dailyOverViewItem, data, this.content);
            });
        });
    }
}