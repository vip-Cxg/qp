import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import { length } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class BettingPreList extends cc.Component {

    @property(cc.Prefab)
    cellItem = null;


    renderUI(data,current=false) {
        let PLength=4;
        this.node.removeAllChildren();
        data.forEach((e, i) => {
            let cellItem = cc.instantiate(this.cellItem);
            cellItem.getChildByName('odd').active = parseInt(e) == 1;
            cellItem.getChildByName('even').active =  parseInt(e) == 0;

            cellItem.x = i > 6 ? (cellItem.width+PLength) * (i - 6) : 0;
            cellItem.y = 0 - ((cellItem.height+PLength) / 2 + (Math.min(i, 6)) * (cellItem.height+PLength));

            if(current&&i==(data.length-1))
                cellItem.getChildByName('cur').active = true;

            this.node.addChild(cellItem);

        })
    }





}


