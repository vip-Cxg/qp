let Cache = require("../../../Main/Script/Cache");
var { GameConfig } = require("../../../GameBase/GameConfig");
const utils = require("../../../Main/Script/utils");
const TableInfo = require("../../../Main/Script/TableInfo");
const { App } = require('../../../script/ui/hall/data/App');

cc.Class({
    extends: cc.Component,

    properties: {
        summaryContent: cc.Node,
        summaryItem: cc.Prefab,
        pokerSummary: cc.Prefab,
        pokerSummaryThree: cc.Prefab,
        loseBg: cc.Node,
        winBg: cc.Node,
        pingBg: cc.Node,

        btnNext: cc.Node,
        btnSummary: cc.Node,

        adComponent: require('../../../script/ui/ad/AdComponent'),
        isReplay: false,
        summaryData: null
    },
    onLoad() {
        if (!utils.isNullOrEmpty(GameConfig.AdData) && !utils.isNullOrEmpty(GameConfig.AdData.PDKSummaryAd)) {
            this.adComponent.showAd();
            this.adComponent.initAd(GameConfig.AdData.PDKSummaryAd);
        } else {
            this.adComponent.hideAd();
        }


    },

    /**初始化结算数据 */
    initData(data, replay = false) {


        this.isReplay = replay;
        // if (replay) {
        //     // this.cutCard.node.active = false;

        // // this.btnNext.active=utils.isNullOrEmpty(data.ach);
        // // this.btnSummary.active=utils.isNullOrEmpty(data.ach);
        // } 
        if (!utils.isNullOrEmpty(data.ach))
            this.summaryData = data.ach;
        this.btnNext.active = utils.isNullOrEmpty(data.ach) && TableInfo.idx >= 0;
        this.btnSummary.active = !utils.isNullOrEmpty(data.ach);
        // if (!utils.isNullOrEmpty(TableInfo.options) && !utils.isNullOrEmpty(TableInfo.options.shuffle) && TableInfo.options.shuffle > 0) {
        //     this.cutCard.node.active = true;
        //     this.descCut.string = "每次" + utils.formatGold(TableInfo.options.shuffle);

        // } else {
        //     this.cutCard.node.active = false;

        // }




        let MaxIdx = -1;

        let scores = 1;
        data.players.forEach((player, i) => {

            if (player.scores.turn > scores) {
                MaxIdx = player.idx;
                scores = player.scores.turn;
            }
            let summaryItem = cc.instantiate(this.summaryItem);
            summaryItem.getComponent("ModuleSummaryItem07").initData(player, data.winner);
            this.summaryContent.addChild(summaryItem);
        });

        if (MaxIdx == TableInfo.idx) {
            this.winBg.active = true;
            this.loseBg.active = false;
            this.pingBg.active = false;
            Cache.playSound('win');
        } else if (MaxIdx == -1) {
            this.winBg.active = false;
            this.loseBg.active = false;
            this.pingBg.active = true;
            Cache.playSound('ping');
        } else {
            this.winBg.active = false;
            this.loseBg.active = true;
            this.pingBg.active = false;
            Cache.playSound('lose');

        }

        return this;
    },

    /**继续游戏 */
    continueGame() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PDK_CONTINUE_GAME);
        this.remove();
    },
    /**换桌 */
    showTotalSummary() {

        if(this.isReplay){
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.PDK_CONTINUE_GAME);
            this.remove();
            return;
        }

        if (TableInfo.options?.rules.person == 2) {
            let node = cc.instantiate(this.pokerSummary);
            node.getComponent('PokerSummary').renderUI(this.summaryData);
            cc.find('Canvas').addChild(node);
        } else {
            let node = cc.instantiate(this.pokerSummaryThree);
            node.getComponent('PokerSummaryFour').renderUI(this.summaryData);
            cc.find('Canvas').addChild(node);
        }
        this.remove()
    },
    remove() {
        if (this.node) {
            this.node.destroy();
        }

    }

    // update (dt) {},
});
