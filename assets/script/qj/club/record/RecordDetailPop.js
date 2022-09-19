import { GameConfig } from "../../../../GameBase/GameConfig"
import GameUtils from "../../../common/GameUtils"
import RecordHead from "./RecordHead"
const { ccclass, property } = cc._decorator
@ccclass
export default class RecordItem extends cc.Component {
    @property(RecordHead)
    recordHead = []

    @property(cc.Prefab)
    recordDetailItem = null

    @property(cc.Node)
    layerItem = null

    init(data) {
        let { data: { details, players }, fileID, strDate } = data;
        players.forEach((p, i) => {
            this.recordHead[i].init(p);
        })
        this.layerItem.removeAllChildren();
        details.forEach(d => {
            d.fileID = fileID;
            d.strDate = strDate;
            GameUtils.instancePrefab(this.recordDetailItem, d, this.layerItem)
        })
        
    }   

    onClickCheck() {
        
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }



}


