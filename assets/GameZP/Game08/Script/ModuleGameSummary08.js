//const POS_PART = [cc.v2(-53,18),cc.v2(318,18),cc.v2(686,18)];
let cache = require('Cache');
let Native = require('native-extend');
let _social = Native.Social;
const utils = require('../../../Main/Script/utils');
const TableInfo = require('../../../Main/Script/TableInfo');
 var { GameConfig } = require('../../../GameBase/GameConfig');
const Connector = require('../../../Main/NetWork/Connector');
const ROUTE = require('../../../Main/Script/ROUTE');
cc.Class({
    extends: cc.Component,

    properties: {
        // part: cc.Prefab,
        winBg: cc.Prefab,
        loseBg: cc.Prefab,
        bgContainer: cc.Node,
        playerContent: cc.Node,
        playerItem: cc.Prefab,
        birdContinueBtn: cc.Node,
        continueBtn: cc.Node,
        adComponent: require('../../../script/ui/ad/AdComponent'),
        changeTableBtn: cc.Node,
    },

    onLoad() {
        if (!utils.isNullOrEmpty(GameConfig.AdData) && !utils.isNullOrEmpty(GameConfig.AdData.LDZPGameSummaryAd)) {
            this.adComponent.showAd();
            this.adComponent.initAd(GameConfig.AdData.LDZPGameSummaryAd);
        } else {
            this.adComponent.hideAd();
        }
    },
    init(data, isReplay = false) {
        // [
        //     {
        //         "idx": 0,
        //         "scores": {
        //             "base": 44,
        //             "ti": 0,
        //             "pao": 0,
        //             "win": 1,
        //             "lose": 0,
        //             "plus": 0,
        //             "turn": 44,
        //             "total": 400,
        //             "wallet": 398,
        //             "shuffle": 0,
        //             "fee": 2
        //         },
        //         "wallet": 6962
        //     },
        //     {
        //         "idx": 1,
        //         "scores": {
        //             "base": 0,
        //             "ti": 0,
        //             "pao": 0,
        //             "win": 0,
        //             "lose": 0,
        //             "plus": 0,
        //             "turn": 0,
        //             "total": -400,
        //             "wallet": -400,
        //             "shuffle": 0
        //         },
        //         "wallet": 16935
        //     }
        // ]
        this.isReplay = isReplay;

        if (isReplay)
            this.hideBtn()

        data.forEach((item, index) => {
            if (item.idx == TableInfo.idx) {
                let bgNode = item.scores.total > 0 ? cc.instantiate(this.winBg) : cc.instantiate(this.loseBg);
                bgNode.parent = this.bgContainer;
            }
            let playerNode = cc.instantiate(this.playerItem)
            playerNode.getComponent("ModuleSummaryItem08").initData(item, 0);
            playerNode.parent = this.playerContent;
        });
    },

    backHall() {
        
        if (this.isReplay) {
            // this.node.removeFromParent();
            let nodeReplay = cc.find('Canvas/replay');
            if (nodeReplay != null)
                nodeReplay.getComponent('ModuleReplay08').quit();
            // utils.dispatchAllEvent(this.node, GameConfig.GameEventNames.REPLAY_BACK_HALL);
        } else {
            GameConfig.ShowTablePop = true;
            cache.showMask("正在返回大厅...请稍后");
            Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
        }
    },

    sendReady(e, v) {
        // let nodeReplay = cc.find('Canvas/replay');
        // if (nodeReplay != null)
        //     nodeReplay.getComponent('ModuleReplay08').quit();
        // if (GameConfig.GameCurrentScore < TableInfo.options.lower) {
        //     cache.showTipsMsg("积分不足", () => {
        //         this.backHall();
        //     })
        //     return;
        // }

        Connector.gameMessage(ROUTE.CS_GAME_READY, { plus: parseInt(v)!=-1 });
        this.remove();

    },


    remove() {
        if (this.node) {
            this.node.destroy();
        }
    },

    hideBtn() {
        this.birdContinueBtn.active = false;
        this.continueBtn.active = false;
        this.changeTableBtn.active = false;

    }

    // share  () {
    //     cache.showShare(this.node);
    //     // utils.screenShoot((file, thumbWidth, thumbHeight) => {
    //     //     _social.shareImageToFriendWithWX(file, thumbWidth, thumbHeight);
    //     // });
    // },
});
