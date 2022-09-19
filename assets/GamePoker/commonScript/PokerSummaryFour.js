import { GameConfig } from "../../GameBase/GameConfig";
import Connector from "../../Main/NetWork/Connector";
import ROUTE from "../../Main/Script/ROUTE";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import { App } from "../../script/ui/hall/data/App";
import PokerSummaryItem from "./PokerSummaryItem";

const { ccclass, property } = cc._decorator
@ccclass
export default class PokerSummaryFour extends cc.Component {
    @property(cc.Node)
    itemContent = null;
    @property(cc.Prefab)
    summaryItem = null;

    isReplay = false;
    renderUI(data, replay = false) {
        this.isReplay = replay;
        let maxTotal = Math.max.apply(Math, data.map(item => { return item.total }))
        let maxIndex = data.findIndex(item => { return item.total == maxTotal });
        let minTotal = Math.min.apply(Math, data.map(item => { return item.total }))
        let minIndex = data.findIndex(item => { return item.total == minTotal });
        this.itemContent.removeAllChildren();
        data.forEach((element, i) => {
            let summary = -1;
            if (i == maxIndex)
                summary = 1;
            if (i == minIndex)
                summary = 0;
            if (element.total == maxTotal && TableInfo.options?.gameType == GameConfig.GameType.WSK)
                summary = 1;
            if (element.total == minTotal && TableInfo.options?.gameType == GameConfig.GameType.WSK)
                summary = 0;

            element.idx = i;
            let summaryItem = cc.instantiate(this.summaryItem);
            summaryItem.getComponent(PokerSummaryItem).renderUI(element, summary);
            this.itemContent.addChild(summaryItem);
        });


    }

    onClickNext() {

        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PDK_CONTINUE_GAME);
        this.node.destroy();
    }

    onClickBack() {

        if (this.isReplay) {
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PDK_CONTINUE_GAME);
            this.node.destroy();
            return;
        }
        Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
        this.node.destroy();
    }

}


