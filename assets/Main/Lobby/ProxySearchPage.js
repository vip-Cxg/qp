const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils")
 var { GameConfig } = require("../../GameBase/GameConfig");
let http = require("SceneLogin");
const Native = require("../Script/native-extend");
const _social = Native.Social
cc.Class({
    extends: cc.Component,

    properties: {
        apiContainer: cc.Node,
        apiItem: cc.Prefab,
        infoContainer: cc.Node,
        infoItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.addEvents();
        this.downloadListData();
    },
    addEvents() {
        // cc.find("Canvas").on(GameConfig.GameEventNames.ADMIN_SELECT_USER, this.refreshSelectInfo, this);
    },
    removeEvents() {
        // cc.find("Canvas").off(GameConfig.GameEventNames.ADMIN_SELECT_USER, this.refreshSelectInfo, this);

    },



    /**下载api列表 */
    downloadListData() {

        Connector.request(GameConfig.ServerEventName.ProxyApi, {}, (data) => {
            this.apiContainer.removeAllChildren();
            if (utils.isNullOrEmpty(data.api)) {
                // this.userNodata.active = true;
                return;
            }
            // this.userNodata.active = false;

            data.api.forEach(element => {
                let apiItem = cc.instantiate(this.apiItem);
                apiItem.getChildByName("api").getComponent(cc.Label).string = element.name;
                apiItem.on(cc.Node.EventType.TOUCH_END, () => {
                    this.requestApi(element.route);
                })
                this.apiContainer.addChild(apiItem);
            });

            // this.refreshSelectInfo({ detail: data.reports[0] });

        })

        // this.userData = data.concat();

    },


    requestApi(route) {

        // columns: Array(4)
        // 0: { name: "剩余", key: "remains" }
        // 1: { name: "冻结", key: "frozens" }
        // 2: { name: "数量", key: "cnt" }
        // 3: { name: "交易", key: "tradeType" }
        // length: 4
        // __proto__: Array(0)
        // data: Array(1)
        // 0:
        // cnt: 1
        // frozens: "0"
        // remains: "110000"
        // tradeType: "slow"
        // __proto__: Object
        // length: 1
        // __proto__: Array(0)

        Connector.request(route, {}, (data) => {
            this.infoContainer.removeAllChildren();
            // if (utils.isNullOrEmpty(data.api)) {
            //     return;
            // }
            this.infoContainer.width=data.columns.length*250+60;
            let infoData = [];
            let keyData = []
            let infoItem = cc.instantiate(this.infoItem);
            data.columns.forEach((e, i) => {
                infoData[i] = e.name;
                keyData[i] = e.key;
            })
            infoItem.getComponent("AdminSearchInfoItem").initData(infoData);
            this.infoContainer.addChild(infoItem);
            data.data.forEach((e, i) => {
                let info = [];
                keyData.forEach((key, index) => {
                    info[index] = e[key];
                })
                let infoItem = cc.instantiate(this.infoItem);
                infoItem.getComponent("AdminSearchInfoItem").initData(info);
                this.infoContainer.addChild(infoItem);
            })
            // data.api.forEach(element => {
            //     let infoItem = cc.instantiate(this.infoItem);
            //     infoItem.getComponent("AdminSearchInfoItem").initData(element);
            //     this.infoContainer.addChild(infoItem);
            // });
        })
    },


    /**关闭弹窗 */
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
