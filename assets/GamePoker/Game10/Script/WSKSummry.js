import { GameConfig } from "../../../GameBase/GameConfig";
import { App } from "../../../script/ui/hall/data/App";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../../script/common/GameUtils";
import WSKSummaryItem from "./WSKSummaryItem";
import Cache from "../../../Main/Script/Cache";

const { ccclass, property } = cc._decorator
@ccclass
export default class WSKSummary extends cc.Component {

    @property(cc.Node)
    summaryContent = null;
    @property(cc.Prefab)
    summaryItem = null;
    @property(cc.Prefab)
    pokerSummary = null;
    @property(cc.Prefab)
    pokerSummaryFour = null;

    @property(cc.Node)
    loseBg = null;
    @property(cc.Node)
    winBg = null;
    @property(cc.Node)
    pingBg = null;

    @property(cc.Node)
    btnNext = null;
    @property(cc.Node)
    btnSummary = null;

    isReplay = false;
    summaryData = null


    /**初始化结算数据 */
    initData(data, replay = false) {
        this.isReplay = replay;
        // if (replay) {
        //     // this.cutCard.node.active = false;

        // // this.btnNext.active=GameUtils.isNullOrEmpty(data.ach);
        // // this.btnSummary.active=GameUtils.isNullOrEmpty(data.ach);
        // } 
        if (!GameUtils.isNullOrEmpty(data.ach))
            this.summaryData = data.ach;
        this.btnNext.active = GameUtils.isNullOrEmpty(data.ach);
        this.btnSummary.active = !GameUtils.isNullOrEmpty(data.ach);
        if (TableInfo.idx < 0) {
            this.btnNext.active = false;
        }
        // if (!GameUtils.isNullOrEmpty(TableInfo.options) && !GameUtils.isNullOrEmpty(TableInfo.options.shuffle) && TableInfo.options.shuffle > 0) {
        //     this.cutCard.node.active = true;
        //     this.descCut.string = "每次" + GameUtils.formatGold(TableInfo.options.shuffle);

        // } else {
        //     this.cutCard.node.active = false;

        // }
        this.summaryContent.removeAllChildren();
        data.players.sort((a, b) => a.rank - b.rank);

        let myIdx = data.players.findIndex((v) => { return v.idx == TableInfo.idx });
        if (myIdx < 0) {
            myIdx = 0;
        }

        if(data.players[myIdx].scores.turn > 0){
            Cache.playSound('win');

        }else if(data.players[myIdx].scores.turn == 0){
            Cache.playSound('ping');

        }else{
            Cache.playSound('lose');

        }
        data.players.forEach((player, i) => {
            if (player.idx == TableInfo.idx) {


                this.winBg.active = player.scores.turn > 0;
                this.pingBg.active = player.scores.turn == 0;
                this.loseBg.active = player.scores.turn < 0;


            }
            let summaryItem = cc.instantiate(this.summaryItem);
            summaryItem.getComponent(WSKSummaryItem).renderUI(player);
            this.summaryContent.addChild(summaryItem);
        });
        return this;
    }

    /**继续游戏 */
    continueGame() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PDK_CONTINUE_GAME);
        this.remove();
    }
    /**换桌 */
    showTotalSummary() {
        // if (TableInfo.options.rules.person == 2) {

        //     let node = cc.instantiate(this.pokerSummary);
        //     node.getComponent('PokerSummary').renderUI(this.summaryData);
        //     cc.find('Canvas').addChild(node);
        // } else {
        if(this.isReplay){
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PDK_CONTINUE_GAME);
            this.remove();
            return;
        }

        let node = cc.instantiate(this.pokerSummaryFour);
        node.getComponent('PokerSummaryFour').renderUI(this.summaryData);
        cc.find('Canvas').addChild(node);
        // }
        this.remove()
    }
    remove() {
        if (this.node) {
            this.node.destroy();
        }

    }

}


