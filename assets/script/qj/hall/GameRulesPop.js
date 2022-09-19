
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class GameRulesPop extends cc.Component {
    @property(cc.Node)
    content = null

    init() {
        
    }

    onClickToggle(toggle) {
        this.content._children.forEach(node => {
            node.active = node._name == toggle.node._name;
        })
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


