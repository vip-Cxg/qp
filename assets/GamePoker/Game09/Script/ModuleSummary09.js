let TableInfo = require("../../../Main/Script/TableInfo");
let connector = require('../../../Main/NetWork/Connector');
let cache = require("../../../Main/Script/Cache");
const utils = require("../../../Main/Script/utils");
 var { GameConfig } = require("../../../GameBase/GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        summaryContent: cc.Node,
        summaryItem: cc.Prefab,
        continueBtn: cc.Node,
        goBackBtn: cc.Node,
        loseBg: cc.Node,
        winBg: cc.Node,
        infoContent: cc.Node,
        bgMask: cc.Node,
        cutCard: cc.Toggle,
        descCut: cc.Label,
        adComponent: require('../../../script/ui/ad/AdComponent'),
        isReplay: false
    },
    onLoad() {
        if (!utils.isNullOrEmpty(GameConfig.AdData) && !utils.isNullOrEmpty(GameConfig.AdData.XHZDSummaryAd)) {
            this.adComponent.showAd();
            this.adComponent.initAd(GameConfig.AdData.XHZDSummaryAd);
        } else {
            this.adComponent.hideAd();
        }
    },
    /**初始化结算数据 */
    initData(data, replay = false) {
        this.isReplay = replay;
        if (replay) {
            this.continueBtn.active = false;
            this.cutCard.node.active = false;
        }else{
            this.goBackBtn.active=data.status==GameConfig.GameStatus.WAIT;
        }
        if (!utils.isNullOrEmpty(TableInfo.options) && !utils.isNullOrEmpty(TableInfo.options.shuffle) && TableInfo.options.shuffle > 0) {
            this.cutCard.node.active = true;
            this.descCut.string = "每次" + utils.formatGold(TableInfo.options.shuffle);
        } else {
            this.cutCard.node.active = false;
        }

        //当前胜利组 data.winner
        if (data.winner == GameConfig.ZDCurrentGroup) {
            //当前玩家获胜
            this.winBg.active = true;
            this.loseBg.active = false;

        } else {
            //其他玩家获胜
            this.winBg.active = false;
            this.loseBg.active = true;
        }
        data.players.sort(utils.compare("rank"));

        data.players.forEach((player, i) => {
            let summaryItem = cc.instantiate(this.summaryItem);
            this.summaryContent.addChild(summaryItem);
            summaryItem.getComponent("ModuleSummaryItem09").initData(player, data.winner,i);
        });

    },

    /**继续游戏 */
    onContinueGame(e, v) {
        
        utils.dispatchAllEvent(this.node, GameConfig.GameEventNames.ZD_CONTINUE_GAME, { cut: this.cutCard.isChecked });
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

    /**返回大厅 */
    onBackHall() {
        
        utils.dispatchAllEvent(this.node, GameConfig.GameEventNames.ZD_BACK_HALL);
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    /**显示结算 */
    onShowSummary() {
        
        this.infoContent.active = true;
        this.bgMask.active = true;
    },
    /**显示桌面 */
    onShowTable() {
        

        this.infoContent.active = false;
        this.bgMask.active = false;
    },

    // update (dt) {},
});
