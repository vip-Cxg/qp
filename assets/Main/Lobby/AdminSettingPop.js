const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils");
const http = require("SceneLogin");
 var { GameConfig } = require("../../GameBase/GameConfig");
const AudioCtrl = require("../Script/audio-ctrl");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        changePage: cc.Prefab,
        punishPage: cc.Prefab,
        otherPage: cc.Prefab,
        searchPage: cc.Prefab,
        resetPage: cc.Prefab,
        proxyPage: cc.Prefab,
        tradePage: cc.Prefab,
        creditPage: cc.Prefab,
        pageContainer: cc.Node,
        tradeBtn: cc.Node,
        profitPage:cc.Prefab,
        roomsData: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tradeBtn.active = GameConfig.ProxyData.id == 3;
        this.addEvents();
    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },

    onChangeData(e) {
        this.roomsData[e.detail.key] = e.detail.value;
    },

    // /**打开机器人设置 */
    // openRobotSetting() {
    //     
    //     this.pageContainer.removeAllChildren();
    //     let robotPage = cc.instantiate(this.robotPage);
    //     this.pageContainer.addChild(robotPage);

    // },

    /**切换代理 */
    openChangeProxy() {

        
        this.pageContainer.removeAllChildren();
        let changePage = cc.instantiate(this.changePage);
        this.pageContainer.addChild(changePage);
    },

    /**惩罚 */
    openPunishUser() {
        
        this.pageContainer.removeAllChildren();
        let punishPage = cc.instantiate(this.punishPage);
        this.pageContainer.addChild(punishPage);
    },
    /**惩罚 */
    openOtherPage() {
        
        this.pageContainer.removeAllChildren();
        let otherPage = cc.instantiate(this.otherPage);
        this.pageContainer.addChild(otherPage);
    },
    openSearchPage() {
        
        this.pageContainer.removeAllChildren();
        let searchPage = cc.instantiate(this.searchPage);
        this.pageContainer.addChild(searchPage);
    },
    openResetPage() {
        
        this.pageContainer.removeAllChildren();
        let resetPage = cc.instantiate(this.resetPage);
        this.pageContainer.addChild(resetPage);
    },

    openProxyPage() {
        
        this.pageContainer.removeAllChildren();
        let proxyPage = cc.instantiate(this.proxyPage);
        this.pageContainer.addChild(proxyPage);
    },

    openTradePage() {
        
        this.pageContainer.removeAllChildren();
        let tradePage = cc.instantiate(this.tradePage);
        this.node.addChild(tradePage);
    },

    openCreditPage() {
        
        this.pageContainer.removeAllChildren();
        let creditPage = cc.instantiate(this.creditPage);
        this.node.addChild(creditPage);
    },

    openHistoryPop() {
        
        utils.pop(GameConfig.pop.SettingHistoryPop)
    },
    onConfirmData() {
        Connector.request(GameConfig.ServerEventName.ProxyRobot, { rooms: this.roomsData }, (data) => {
            Cache.alertTip("提交成功")
            this.onClickClose()
        })
    },

    onChangeProfitPop(){
        
        this.pageContainer.removeAllChildren();
        let profitPage = cc.instantiate(this.profitPage);
        this.node.addChild(profitPage);
    },


    /**关闭弹窗 */
    onClickClose() {
        
        this.removeEvents();
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
});
