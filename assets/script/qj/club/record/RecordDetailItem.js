import { GameConfig } from "../../../../GameBase/GameConfig"
import GameUtils from "../../../common/GameUtils"
import { App } from "../../../ui/hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class RecordDetailItem extends cc.Component {
    @property(cc.Label)
    lblIdx = null;

    @property(cc.Label)
    lblScores = [];

    @property(cc.Label)
    lblFileID = null;

    _color = ['#db5950', '#2EA63C']

    data = null
    init(data) {
        this.data = data;
        let { round, scores, fileID, strDate } = data;
        this.lblIdx.string = round;
        this.lblFileID.string = fileID + round;
        this.lblScores.forEach((lbl, i) => {
            if (i > scores.length - 1) {
                lbl.node.active = false;
            } else {
                lbl.string = (scores[i] >= 0 ? '+' : '') +  App.transformScore(scores[i]);
                lbl.node.color = new cc.Color().fromHEX(this._color[scores[i] >= 0 ? 0 : 1])
            }
        })
    }   

    onClickShare() {
        cc.log('onClickShare', this.data)
    }

    onClickCopy() {
        cc.log('onClickCopy', this.data)
    }

    onClickPlay() {
        cc.log('onClickPlay', this.data)
    }


}


