
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";

@ccclass
export default class FeeDetailPop extends cc.Component {
    @property(cc.Node)
    lbl = []

    init(data) {
        let { fee: { win: { score, winFee } } } = data;
        score.forEach((s, i) => {
            let lblStart = this.lbl[i].getChildByName('lblStart').getComponent(cc.Label);
            let lblEnd = this.lbl[i].getChildByName('lblEnd').getComponent(cc.Label);
            let lblFee = this.lbl[i].getChildByName('lblFee').getComponent(cc.Label);
            if (i == 0) {
                lblStart.string = 0;
            } else {
                lblStart.string = Number(score[i - 1]) + 1;

            }
            lblEnd.string = s;
            lblFee.string = winFee[i];
        })
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
  
}


