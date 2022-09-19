
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Avatar from "../../ui/common/Avatar";

@ccclass
export default class SharePop extends cc.Component {
    init() {

    }
    
    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


