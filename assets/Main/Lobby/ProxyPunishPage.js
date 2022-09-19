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
    extends: require('../Script/PopBase'),

    properties: {
        usersContainer: cc.Node,
        usersItem: cc.Prefab,
        selectName: cc.Label,
        selectId: cc.Label,
        selectPhone: cc.Label,
        selectReason: cc.Label,
        selectReplayID: cc.Label,
        selectReportName: cc.Label,
        selectReportId: cc.Label,
        selectReportPhone: cc.Label,
        historyContainer: cc.Node,
        historyItem: cc.Prefab,
        historyNodata: cc.Node,
        userNodata: cc.Node,
        otherPage: cc.Prefab,
        repalay07: cc.Prefab,
        repalay08: cc.Prefab,
        repalay09: cc.Prefab,
        userData: []
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
        this.downloadListData();
    },
    addEvents() {
        cc.find("Canvas").on(GameConfig.GameEventNames.ADMIN_SELECT_USER, this.refreshSelectInfo, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.PUNISH_CHANGE_STATUS, this.changeStatus, this);
    },
    removeEvents() {
        cc.find("Canvas").off(GameConfig.GameEventNames.ADMIN_SELECT_USER, this.refreshSelectInfo, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.PUNISH_CHANGE_STATUS, this.changeStatus, this);

    },

    selectListType(e, v) {
        
        let data = v == "wait" ? v : null;
        this.downloadListData(data);
    },

    /**下载黑名单 */
    downloadListData(status = null) {

        let reqData = utils.isNullOrEmpty(status) ? {} : { status };
        Connector.request(GameConfig.ServerEventName.ProxyList, reqData, (data) => {
            this.usersContainer.removeAllChildren();
            if (utils.isNullOrEmpty(data.reports)) {
                this.userNodata.active = true;
                return;
            }
            this.userNodata.active = false;

            data.reports.forEach(element => {
                let usersItem = cc.instantiate(this.usersItem);
                usersItem.getComponent("ModulePunishUserItem").initData(element);
                this.usersContainer.addChild(usersItem);
            });

            this.refreshSelectInfo({ detail: data.reports[0] });

        })

        // this.userData = data.concat();

    },


    refreshSelectInfo(e, v) {

        // createdAt: "2021-01-10T08:09:54.000Z"
        // id: 1000
        // reason: "测试举报"
        // replayID: "20210107/XHZD/qgQyTHaV"
        // reportID: 100019
        // reporter: { id: 100019, name: "", phone: "1608393405992" }
        // status: "wait"
        // updatedAt: "2021-01-10T08:09:54.000Z"
        // user: null
        // userID: 100277

        this.selectUserInfo = e.detail;
        let data = e.detail;
        this.selectName.string = utils.isNullOrEmpty(data.user) ? "未知玩家昵称" : "" + utils.getStringByLength(data.user.name, 6);
        this.selectId.string = utils.isNullOrEmpty(data.user) ? "未知玩家ID" : "" + data.user.id;
        this.selectPhone.string = utils.isNullOrEmpty(data.user) ? "未知玩家手机" : "" + data.user.phone;
        this.selectReason.string = "" + utils.getStringByLength(data.reason, 70);
        this.selectReportName.string = utils.isNullOrEmpty(data.reporter) ? "未知玩家昵称" : "" + utils.getStringByLength(data.reporter.name, 6);
        this.selectReportId.string = utils.isNullOrEmpty(data.reporter) ? "未知玩家ID" : "" + data.reporter.id;
        this.selectReportPhone.string = utils.isNullOrEmpty(data.reporter) ? "未知玩家手机" : "" + data.reporter.phone;
        this.selectReplayID.string = "" + data.replayID;

        this.downloadHistoryData()
    },
    copyReplayID() {
        
        if (!utils.isNullOrEmpty(this.selectUserInfo.replayID)) {
            Cache.alertTip("复制成功");
            _social.setCopy(this.selectUserInfo.replayID);
            this.enterReplay(this.selectUserInfo.replayID)
        }
    },

    enterReplay(replayID) {
        let strArr = replayID.split("/")
        if (strArr.length < 3) {
            Cache.alertTip("信息格式不对");
            return;
        }

        let gameid = "";
        switch (strArr[1]) {
            case "PDK":
            case "PDK_SOLO":
            case "PDK_SOLO_CLAN":
                gameid = "07";
                break;
            case "XHZP":
            case "XHZP_SOLO":
            case "XHZP_SOLO_CLAN":
                gameid = "08";
                break;
            case "LDZP":
            case "LDZP_SOLO":
            case "LDZP_SOLO_CLAN":
                gameid = "08";
                break;
            case "XHZD":
            case "XHZD_CLAN":
                gameid = "09";
                break;
            default:
                gameid = "";
                break;
        };
        GameConfig.CurrentReplayData = replayID;
        // Connector.get(`http://xh.itapian.com/records/20210918/PDK_SOLO_LZpCVU51.json`, "getJson", (resData) => {
        // Connector.get(`http://xh.itapian.com/records/20211011/XHZD_xFa44gej.json`, "getJson", (resData) => {
        Connector.get(`${GameConfig.GameInfo.replayURL}/${strArr[0]}/${strArr[1]}_${strArr[2]}.json`, "getJson", (resData) => {
            Cache.replayTime = "";
            Cache.turn = "";
            Cache.replayData = resData;
            if (resData == null) {
                Cache.alertTip("暂无回放");
                return;
            }
            if (gameid == "") {
                Cache.alertTip("信息错误，无法播放");
                return
            }
            let nodeReplay = cc.instantiate(this["repalay" + gameid]);
            nodeReplay.parent = cc.find('Canvas');
            // if (gameid == "08"){
            nodeReplay.getComponent("AdminReplay" + gameid).initData(strArr[1], this.selectUserInfo.replayID, this.selectUserInfo.userID);


            // cc.loader.loadRes(`Main/Prefab/replay${gameid}`, (err, prefab) => {
            //     if (!err) {
            //         let nodeReplay = cc.instantiate(prefab);
            //         nodeReplay.parent = cc.find('Canvas');
            //         if (gameid == "08")˝
            //             nodeReplay.getComponent("ModuleReplay" + gameid).initData(strArr[1]);
            //     } else {
            //         cc.log('error to load replay');
            //     }
            // });

        });
    },

    /**下载历史记录 */
    downloadHistoryData() {
        this.historyContainer.removeAllChildren();
        if (utils.isNullOrEmpty(this.selectUserInfo)) {
            return;
        }
        if (utils.isNullOrEmpty(this.selectUserInfo.user)) {
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyList, { id: this.selectUserInfo.user.id }, (data) => {
            if (this.historyContainer) {
                this.historyNodata.active = data.reports.length == 0;
                data.reports.forEach(element => {
                    let historyItem = cc.instantiate(this.historyItem);
                    let time = utils.timestampToTime(new Date(element.updatedAt).getTime());
                    let str = "";
                    switch (element.status) {
                        case "wait":
                            str = "未处理";
                            break;
                        case "warn":
                            str = "警告";
                            break;
                        case "punishment":
                            str = "处罚";
                            break;
                        case "frozen":
                            str = "冻结";
                            break;
                        case "end":
                            str = "已处理";
                            break;
                        case "malicious":
                            str = "恶意举报";
                            break;
                        default:
                            str = "未知状态";
                            break;
                    }
                    historyItem.getChildByName("status").getComponent(cc.Label).string = "处理状态: " + str;
                    historyItem.getChildByName("time").getComponent(cc.Label).string = "" + time;
                    historyItem.getChildByName("reason").getComponent(cc.Label).string = utils.isNullOrEmpty(element.reason) ? "举报理由:" : "举报理由: " + element.reason;
                    this.historyContainer.addChild(historyItem);
                });
            }
        }, null, () => {
            this.historyNodata.active = true;
        })
    },
    changeStatus() {
        if (utils.isNullOrEmpty(this.selectUserInfo))
            return;
        if (utils.isNullOrEmpty(this.selectUserInfo.user))
            return;

        Connector.request(GameConfig.ServerEventName.ProxyListUpdate, { status: 'punishment', id: this.selectUserInfo.id }, (data) => {
            Cache.alertTip("修改成功");
            this.downloadListData();
        }, null, (err) => {
            Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "修改失败" : err.message);
        })
    },
    updateUserStatus(e, v) {
        
        if (utils.isNullOrEmpty(this.selectUserInfo))
            return;
        if (utils.isNullOrEmpty(this.selectUserInfo.user))
            return;

        let str = ""
        switch (v) {
            case "end":
                str = "已处理";
                break;
            case "warn":
                str = "警告";
                break;
            case "punishment":
                str = "处罚";
                break;
            case "frozen":
                str = "冻结";
                break;
            case "malicious":
                str = "恶意举报";
                break;
            default:
                str = "未知状态";
                break;
        }

        Cache.showConfirm("是否将状态修改为" + str, () => {
            Connector.request(GameConfig.ServerEventName.ProxyListUpdate, { status: v, id: this.selectUserInfo.id }, (data) => {
                Cache.alertTip("修改成功");
                this.downloadListData();
            }, null, (err) => {
                Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "修改失败" : err.message);
            })
        })

    },

    onOpenOther() {
        
        let otherPage = cc.instantiate(this.otherPage);
        this.node.addChild(otherPage);
        otherPage.setPosition(cc.v2(0, 0))
        console.log("---", otherPage)
    },

    openPunish() {
        utils.pop(GameConfig.pop.AdminPunishPage, (node) => {
            node.getComponent('AdminPunishPage').renderUI(this.selectUserInfo.replayID, this.selectUserInfo.userID);
        });
    },
    // handlePunish(){
    //     Connector.request(GameConfig.ServerEventName.ProxyPunish, { status: v, id: this.selectUserInfo.id }, (data) => {
    //         Cache.alertTip("修改成功");
    //         this.downloadListData();
    //     }, null, (err) => {
    //         Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "修改失败" : err.message);
    //     })


    // },

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
