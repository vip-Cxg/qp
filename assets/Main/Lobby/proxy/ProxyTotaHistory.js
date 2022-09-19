
 var { GameConfig } = require("../../../GameBase/GameConfig");
const Connector = require("../../NetWork/Connector");
const Cache = require("../../Script/Cache");
const utils = require("../../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        totalItem: cc.Prefab,
        itemContainer: cc.Node,
        pageContainer: cc.Node,
        lblPage: cc.Label,
        noData: cc.Node,
        page: 1,
        totalPage: 0,
        renderData: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.renderData = {
            page: [],
            rows: {}
        }
        // this.node.width = this.node.parent.width;
        // this.node.height = this.node.parent.height;
        // this.node.setPosition(cc.v2(this.node.parent.width / 2 + this.node.width / 2, 0))
        this.downloadRechargeData(1);

        // this.enterPop();
    },
    downloadRechargeData(page) {
        this.noData.active = false;
        if (this.renderData.page.indexOf(page) != -1) {
            this.page = page;
            this.itemContainer.removeAllChildren();
            this.lblPage.string = this.page + '/' + this.totalPage;

            this.renderData.rows['' + page].forEach(e => {
                let totalItem = cc.instantiate(this.totalItem);
                let timeDate = new Date(e.createdAt);
                let year = timeDate.getFullYear();
                let month = (timeDate.getMonth() + 1) >= 10 ? (timeDate.getMonth() + 1) : '0' + (timeDate.getMonth() + 1);
                let day = timeDate.getDate() >= 10 ? timeDate.getDate() : '0' + timeDate.getDate();
                let hour = timeDate.getHours() >= 10 ? timeDate.getHours() : '0' + timeDate.getHours();
                let minute = timeDate.getMinutes() >= 10 ? timeDate.getMinutes() : '0' + timeDate.getMinutes();

                totalItem.getChildByName("content").getChildByName("time").getComponent(cc.Label).string = '' + year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
                totalItem.getChildByName("content").getChildByName("count").getComponent(cc.Label).string = '' + e.remarks;
                this.itemContainer.addChild(totalItem);
            });
            return;
        }

        let nowTime = new Date().getTime();
        let endDate = new Date().format('yyyyMMdd')
        let startDate = new Date(nowTime - 7 * 24 * 60 * 60 * 1000).format('yyyyMMdd');

        Connector.request(GameConfig.ServerEventName.ProxyWalletHistory, { proxyID: GameConfig.ProxyData.id, page: page, limit: 10, endDate: endDate, startDate: startDate, isLeague: GameConfig.ProxyIsLeague }, (res) => {
            this.itemContainer.removeAllChildren();
            if (res.history && !utils.isNullOrEmpty(res.history.rows)) {
                this.renderData.page.push(res.history.page);
                this.renderData.rows['' + res.history.page] = res.history.rows;
                this.pageContainer.active = true;
                this.page = res.history.page;
                this.totalPage = Math.ceil(res.history.count / 10);
                this.lblPage.string = res.history.page + '/' + Math.ceil(res.history.count / 10);
                this.itemContainer.removeAllChildren();
                res.history.rows.forEach(e => {
                    let totalItem = cc.instantiate(this.totalItem);
                    let timeDate = new Date(e.createdAt);
                    let year = timeDate.getFullYear();
                    let month = (timeDate.getMonth() + 1) >= 10 ? (timeDate.getMonth() + 1) : '0' + (timeDate.getMonth() + 1);
                    let day = timeDate.getDate() >= 10 ? timeDate.getDate() : '0' + timeDate.getDate();
                    let hour = timeDate.getHours() >= 10 ? timeDate.getHours() : '0' + timeDate.getHours();
                    let minute = timeDate.getMinutes() >= 10 ? timeDate.getMinutes() : '0' + timeDate.getMinutes();
                    totalItem.getChildByName("content").getChildByName("time").getComponent(cc.Label).string = '' + year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
                    totalItem.getChildByName("content").getChildByName("count").getComponent(cc.Label).string = "" + e.remarks;
                    this.itemContainer.addChild(totalItem);
                });
            } else {
                this.noData.active = true;
                this.pageContainer.active = false;
            }
        });




    },
    addPage() {
        
        if (this.page >= this.totalPage) {
            Cache.alertTip('已经是最后一页');
            return;
        }
        let a = this.page + 1;
        this.downloadRechargeData(a);
    },
    reducePage() {
        
        if (this.page == 1) {
            Cache.alertTip('已经是第一页');
            return;
        }
        let a = this.page - 1;

        this.downloadRechargeData(a);
    },

    // update (dt) {},
});
