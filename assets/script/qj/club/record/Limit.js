const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
@ccclass
export default class Limit extends cc.Component {
    @property(cc.Node)
    content = null

    onLoad() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_CLUB_LIMIT_LIST, this.init, this);
    }

    init() {
        Connector.request(GameConfig.ServerEventName.LimitList, { clubID: App.Club.clubInfo.id }, this.render.bind(this), true);
    }

    render(data) {
        let { list } = data;
        this.content.removeAllChildren();
        list.forEach(l => {
            GameUtils.instancePrefab(GameConfig.Item.LimitItem, l, this.content);
        });
    }

    /** 限制同座 */
    onClickLimit() {
        GameUtils.pop(GameConfig.pop.LimitPop, (node) => {
            node.getComponent(node._name).init([]);
        });
    }

    onDestroy() {
        cc.log('onDestroy');
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_CLUB_LIMIT_LIST, this.init, this);
    }
}