import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import { length } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../hall/data/App";
const STATUS_DESC = {
    'wait': '未开奖',
    'done': '中奖',
    'draw': '未中奖',
}
const { ccclass, property } = cc._decorator
@ccclass
export default class BettingPre extends cc.Component {
    @property(cc.Node)
    listContent = null;
    @property(cc.Prefab)
    listItem = null;

    onLoad() {
        // this.renderUI(1)
    }

    renderUI(data) {
        // data = [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0,  1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1];
        // data = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1];
        // data = [0,0,0,0];
        let totalData = [];
        // [], [], [], [], [], [], [], [], [], []

        let lastE = -1;
        let totalIndex = -1;
        let maxIndex = 0;
        let maxLength = 0;
        let currentLength = 0;
        let over = 0;
        data.forEach(element => {
            if (lastE != element) {
                totalIndex++;
            }
            lastE = element;
            if (totalIndex == totalData.length)
                totalData.push([]);

            totalData[totalIndex].push(element);

            if (totalData[totalIndex].length >= maxLength) {
                maxLength = totalData[totalIndex].length;
                maxIndex = totalIndex;
            }

            over = Math.abs(Math.min(((totalData[totalIndex].length - 7) + totalIndex) - (totalData.length - 1), 0));
           
        });

        if ((maxLength - 7) + maxIndex <= (totalData.length - 1)) {
            over = totalData.length - 12;
        }
        let renderData = (totalData.length + over) > 12 ? totalData.slice(-(totalData.length - over)) : totalData;
        // console.log('--------renderData-----', renderData)
        // console.log('-------over------', over)
        // console.log('--------totalData-----', totalData)

        this.listContent.removeAllChildren();
        renderData.forEach((e, i) => {
            let listItem = cc.instantiate(this.listItem);
            listItem.getComponent('BettingPreList').renderUI(e, (renderData.length - 1) == i);
            this.listContent.addChild(listItem);
        })
    }

    onClickClose() {
        
        this.node.destroy();
    }



}


