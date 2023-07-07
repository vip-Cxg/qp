import { GameConfig } from "../../GameBase/GameConfig";
import Connector from "../../Main/NetWork/Connector";
import ROUTE from "../../Main/Script/ROUTE";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import { App } from "../../script/ui/hall/data/App";
import MJSummaryItem from "./MJSummaryItem";

const { ccclass, property } = cc._decorator
@ccclass
export default class MJSummaryFour extends cc.Component {
    @property(cc.Node)
    itemContent = null;
    @property(cc.Prefab)
    summaryItem = null;
    @property(cc.Node)
    noCard = null;
    @property(cc.Node)
    maxCard = null;
    @property(cc.Prefab)
    cardItem = null;


    renderUI(data) {

        try {
            agora && agora.leaveChannel();
        } catch (error) {

        }

        let maxTotal = Math.max.apply(Math, data.map(item => { return item.total }))
        let maxIndex = data.findIndex(item => { return item.total == maxTotal });
        let minTotal = Math.min.apply(Math, data.map(item => { return item.total }))
        let minIndex = data.findIndex(item => { return item.total == minTotal });
        this.maxCard.removeAllChildren();
        this.itemContent.removeAllChildren();
        data.forEach((element, i) => {
            let summary = -1;
            if (i == maxIndex)
                summary = 1;
            if (i == minIndex)
                summary = 0;
            let summaryItem = cc.instantiate(this.summaryItem);
            summaryItem.getComponent(MJSummaryItem).renderUI(element, summary);
            this.itemContent.addChild(summaryItem);
        });

        if (GameUtils.isNullOrEmpty(data.maxCard)) {
            this.noCard.active = true;
        } else {
            this.noCard.active = false;

            data.maxCard.forEach((card) => {
                let cardItem = cc.instantiate(this.cardItem);
                cardItem.scale = 0.8;
                cardItem.getComponent('ModuleSelfCardsMJ').init(card);
                this.maxCard.addChild(summaryItem);

            })
        }
    }

    onClickNext() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.MJ_GAME_NEXT);
        this.node.destroy();
    }

    onClickBack() {
        Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
        this.node.destroy();
    }

}


