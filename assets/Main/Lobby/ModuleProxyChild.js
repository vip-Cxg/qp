const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils")
 var { GameConfig } = require("../../GameBase/GameConfig");
let http = require("SceneLogin");
const Native = require("../Script/native-extend");
const { App } = require("../../script/ui/hall/data/App");
const _social = Native.Social
cc.Class({
    extends: cc.Component,

    properties: {
        childContainer: cc.Node,
        childItem: cc.Prefab,
        selectName: cc.Label,
        selectId: cc.Label,
        selectPhone: cc.Label,
        selectWallet: cc.Label,
        normalNode: cc.Node,
        adminNode: cc.Node,
        count: cc.EditBox,
        searchBox: cc.EditBox,
        historyItem: cc.Prefab,
        historyContainer: cc.Node,
        addPage: cc.Node,
        newName: cc.EditBox,
        newPhone: cc.EditBox,
        profitPage: cc.Prefab,
        totalPage: cc.Prefab,
        walletNode: cc.Node,
        walletInput: cc.EditBox,

        nodata: cc.Node,
        historyNodata: cc.Node,
        userNodata: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //TODO
        this.walletNode.active = !utils.isNullOrEmpty(GameConfig.ProxyData.credit) && GameConfig.ProxyData.credit > 0;

        this.addEvents();
        this.refreshChildrenData()
    },
    addEvents() {
        try {

            App.EventManager.addEventListener(GameConfig.GameEventNames.EXCHANGE_LEAGUE_UPDATEDATA, this.refreshChildrenData, this);

            cc.find("Canvas").on(GameConfig.GameEventNames.PROXY_SELECT_USER, this.refreshSelectInfo, this);
            App.EventManager.addEventListener(GameConfig.GameEventNames.PROXY_PROFIT_DATA, this.saveProxyProfit, this);
        } catch (error) {

        }
    },
    removeEvents() {
        try {

            App.EventManager.removeEventListener(GameConfig.GameEventNames.EXCHANGE_LEAGUE_UPDATEDATA, this.refreshChildrenData, this);
            cc.find("Canvas").off(GameConfig.GameEventNames.PROXY_SELECT_USER, this.refreshSelectInfo, this);
            App.EventManager.removeEventListener(GameConfig.GameEventNames.PROXY_PROFIT_DATA, this.saveProxyProfit, this);
        } catch (error) {

        }

    },
    /**???????????????????????? */
    refreshChildrenData() {
        Connector.request(GameConfig.ServerEventName.ProxyChildren, { isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (data.proxies) {
                this.proxyChildData = data.proxies.concat();
                this.initData(this.proxyChildData);
            }
        })
    },

    /**?????????????????? */
    refreshChildrenItemData(data) {
        GameConfig.ProxyData = data.proxy;
        this.proxyChildData.forEach((element, index) => {
            if (element.id == data.dest.id) {
                this.proxyChildData[index] = data.dest;
            }
        });
        this.initData(this.proxyChildData);


    },
    /**????????? */
    initData(data) {
        this.addPage.active = false;

        this.childContainer.removeAllChildren();
        if (utils.isNullOrEmpty(data)) {
            this.nodata.active = true;
            this.userNodata.active = true;
            return;
        }

        this.nodata.active = false;
        this.userNodata.active = false;
        data.forEach(element => {
            let childItem = cc.instantiate(this.childItem);
            childItem.getComponent("ModuleProxyChildItem").initData(element);
            this.childContainer.addChild(childItem);
        });
        this.refreshSelectInfo({ detail: data[0] });
    },


    refreshSelectInfo(e, v) {
        this.addPage.active = false;
        this.selectUserInfo = e.detail;
        this.selectName.string = "" + utils.getStringByLength(e.detail.name, 6);
        this.selectId.string = "(" + e.detail.id + ")";
        this.selectPhone.string = "" + e.detail.phone;
        this.selectWallet.string = "" + utils.formatGold(e.detail.wallet);

        this.normalNode.active = !GameConfig.ProxyIsLeague && (GameConfig.ProxyData.role == "admin" || GameConfig.ProxyData.role == "manager") ? false : true;
        this.adminNode.active = !GameConfig.ProxyIsLeague && (GameConfig.ProxyData.role == "admin" || GameConfig.ProxyData.role == "manager")
        this.downloadHistoryData()
    },

    addWellet() {
        

        if (utils.isNullOrEmpty(this.selectUserInfo)) {
            Cache.alertTip("???????????????")
            return;
        }
        let reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(this.count.string)) {
            Cache.alertTip("?????????????????????")
            return;
        }
        Cache.showConfirm("?????????????????????" + this.count.string, () => {
            Connector.request(GameConfig.ServerEventName.ProxyChangeWallet, { id: this.selectUserInfo.id, wallet: parseFloat(this.count.string) * 100, isLeague: GameConfig.ProxyIsLeague }, (data) => {
                Cache.alertTip("????????????");
                this.refreshChildrenItemData(data);
            })

        })
    },
    reduceWellet() {
        
        if (utils.isNullOrEmpty(this.selectUserInfo)) {
            Cache.alertTip("???????????????")
            return;
        }
        let reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(this.count.string)) {
            Cache.alertTip("?????????????????????")
            return;
        }
        Cache.showConfirm("?????????????????????" + this.count.string, () => {
            Connector.request(GameConfig.ServerEventName.ProxyChangeWallet, { id: this.selectUserInfo.id, wallet: parseFloat("-" + this.count.string) * 100, isLeague: GameConfig.ProxyIsLeague }, (data) => {
                Cache.alertTip("????????????");
                this.refreshChildrenItemData(data);

            })
        })
    },

    onOpenClub() {
        
        Cache.showConfirm("???????????????" + this.selectUserInfo.id + '????????????????', () => {
            Connector.request(GameConfig.ServerEventName.ProxyOpenClub, { proxyID: this.selectUserInfo.id }, (data) => {
                Cache.alertTip("????????????");
                console.log("????????????: ", data)
                // this.refreshChildrenItemData(data);
            })
        })
    },
    onClickCreate() {
        
        this.addPage.active = true;
    },
    onCloseAddPage() {

        
        this.addPage.active = false;
    },


    /**?????????????????? */
    setProxyProfit() {
        
        let profitPage = cc.instantiate(this.profitPage);
        profitPage.getComponent("ModuleProxyProfit").downloadProfitData();
        cc.find("Canvas").addChild(profitPage);
    },
    /**?????????????????? */
    changeProxyProfit() {
        
        if (utils.isNullOrEmpty(this.selectUserInfo)) {
            Cache.alertTip("???????????????")
            return;
        }

        let profitPage = cc.instantiate(this.profitPage);
        profitPage.getComponent("ModuleProxyProfit").downloadChildData(this.selectUserInfo.id);
        cc.find("Canvas").addChild(profitPage);
    },

    /**?????????????????? */
    saveProxyProfit(res) {
        console.log('????????????----', res)
        this.proxyProfitData = res.data.concat();
        this.proxyProfitData.forEach((e) => {
            e.profit = e.childProfit;
        })

    },
    onConfirmProxy() {
        



        if (utils.isNullOrEmpty(this.proxyProfitData)) {
            Cache.alertTip("?????????????????????");
            return;
        }
        if (utils.isNullOrEmpty(this.newName.string)) {
            Cache.alertTip("?????????????????????");
            return;
        }
        //TODO
        if (utils.isNullOrEmpty(this.newPhone.string)) {
            Cache.alertTip("??????????????????");
            return;
        }
        let proxyData = {
            phone: this.newPhone.string,
            name: this.newName.string,
        }
        let confirmData = { profits: this.proxyProfitData, proxy: proxyData, isLeague: GameConfig.ProxyIsLeague }

        if (!utils.isNullOrEmpty(GameConfig.ProxyData.credit) && GameConfig.ProxyData.credit != 0) {
            if (utils.isNullOrEmpty(this.walletInput.string)) {
                Cache.alertTip("?????????????????????");
                return;
            }


            let reg = /^[0-9]*[1-9][0-9]*$/;
            if (!reg.test(this.walletInput.string)) {
                Cache.alertTip("?????????????????????")
                return;
            }
            if (parseInt(this.walletInput.string) < 100) {
                Cache.alertTip("????????????????????????100???")
                return;
            }
            confirmData.wallet = parseInt(this.walletInput.string) * 100;
        }



        Connector.request(GameConfig.ServerEventName.ProxyAdd, confirmData, (data) => {
            Cache.alertTip("????????????");
            this.refreshChildrenData()
            this.addPage.active = false;

        })
    },

    /**?????????????????? */
    downloadHistoryData() {

        if (utils.isNullOrEmpty(this.selectUserInfo)) {
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyHistory, { id: this.selectUserInfo.id, logType: "proxies", isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (this.historyContainer) {
                this.historyContainer.removeAllChildren();
                this.historyNodata.active = data.logs.length == 0;
                data.logs.forEach(element => {
                    let historyItem = cc.instantiate(this.historyItem);
                    let time = utils.timestampToTime(new Date(element.createdAt).getTime());
                    historyItem.getChildByName("time").getComponent(cc.Label).string = "" + time;
                    historyItem.getChildByName("desc").getComponent(cc.Label).string = element.remarks;

                    this.historyContainer.addChild(historyItem);
                });
            }
        })
    },

    /**???????????? */
    onClickSearch() {
        
        let self = this;
        Connector.request(GameConfig.ServerEventName.ProxyChildren, { keywords: this.searchBox.string, isLeague: GameConfig.ProxyIsLeague }, (data) => {
            if (data.proxies) {
                let proxyChildData = data.proxies.concat();
                self.initData(proxyChildData)
            }
        })
    },
    /**???????????? */
    resetSearch() {
        
        this.refreshChildrenData();

    },

    /**??????????????? */
    onShowQrcode() {
        
        if (utils.isNullOrEmpty(this.selectUserInfo)) {
            return;
        }
        utils.pop(GameConfig.pop.SharePop, (node) => {
            node.getComponent("ModuleSharePop").refresChildUI(this.selectUserInfo.inviter);
        })
    },

    /** ????????????????????????*/
    onShowChildTotal() {
        
        // utils.pop()
        // totalPage
        let totalItem = cc.instantiate(this.totalPage);
        totalItem.getComponent("ProxyChildTotal").initData(this.selectUserInfo.id);
        cc.find("Canvas").addChild(totalItem);
        console.log('??????----')
    },

    /**???????????? */
    onClickClose() {
        
        this.removeEvents();
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

    onDestroy() {
        this.removeEvents();
    }
});
