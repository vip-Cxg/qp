const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import Avatar from "../../../ui/common/Avatar";

@ccclass
export default class WinnerCountDetailPop extends cc.Component {
    @property(cc.Label)
    lblOne = null

    @property(cc.Label)
    lblTwo = null

    @property(cc.Label)
    lblThree = null

    @property(cc.Label)
    lblFour = null

    init() {
        
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }


  
}