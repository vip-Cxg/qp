
let connector = require("../NetWork/Connector");
let db = require("../Script/DataBase");
let cache = require('Cache');
 var { GameConfig } = require("../../GameBase/GameConfig");
const Native = require("../Script/native-extend");
const utils = require("../Script/utils");
const _social = Native.Social
cc.Class({
    extends: cc.Component,

    properties: {

        lblTime: cc.Label,
        gameType: cc.Label,
        roomId: cc.Label,
        bet: cc.Label,
        lblScore: cc.Label,
        copyBtn: cc.Node,
        copyBtn1:cc.Node,
        btnCheck: cc.Node,
        serialID: ''
    },

    // init: function (data,i,logFlag,tableId,person) {
    init: function (data) {
        this.lblTime.string = new Date(data.createdAt).format("yyyy-MM-dd hh:mm:ss");
        this.lblScore.string = data.userScore >= 0 ? "+" + utils.formatGold(data.userScore) : "" + utils.formatGold(data.userScore);
        this.gameType.string = GameConfig.GameName[data.gameType];

        let gameid = "";
        switch (data.gameType) {
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
            case "HZMJ":
            case "HZMJ_SOLO":
                gameid = "16";
                break;
            case "LGMJ":
            case "HNMJ":
                gameid = "19";
                break;
            default:
                this.gameType.string = "";
                gameid = "";
                break;
        };
        this.bet.string = "底分:" + utils.formatGold(data.base);
        this.roomId.string = "" + data.serialID;
        this.serialID = "" + data.serialID;
        //复制房间号到粘贴板
        this.copyBtn.on("touchend", () => {
            cache.alertTip("复制成功");
            let str = data.logFlag + "/" + data.gameType + "/" + data.serialID;
            _social.setCopy(str);
        })
        this.copyBtn1.on("touchend", () => {
            cache.alertTip("复制成功");
            let str = data.logFlag + "/" + data.gameType + "/" + data.serialID;
            _social.setCopy(str);
        })
        
        // 点击回放
        this.btnCheck.on('touchend', () => {
            
            GameConfig.CurrentReplayData = data.logFlag + "/" + data.gameType + "/" + data.serialID;
            console.log(`${GameConfig.GameInfo.replayURL}/${data.logFlag}/${data.gameType}_${data.serialID}.json`)
            // connector.get(`http://xh.exd7.com/records/20211018/XHZD_o3J-h7YG.json`, "getJson", (resData) => {

            connector.get(`${GameConfig.GameInfo.replayURL}/${data.logFlag}/${data.gameType}_${data.serialID}.json`, "getJson", (resData) => {
                db.gameDate = this.lblTime.string;
                cache.replayTime = this.lblTime.string;
                cache.turn = data.serialID;
                cache.replayData = resData;
                console.log('回放数据: ',resData)
                if (resData == null) {
                    cache.alertTip("暂无回放");
                    return;
                }
                if (gameid == "") {
                    cache.alertTip("暂时无法播放");
                    return
                }
                cc.loader.loadRes(`Main/Prefab/replay${gameid}`, (err, prefab) => {
                    if (!err) {
                        let nodeReplay = cc.instantiate(prefab);
                        nodeReplay.parent = cc.find('Canvas');
                        if (gameid == "08")
                            nodeReplay.getComponent("ModuleReplay" + gameid).initData(data.gameType);
                    } else {
                        cc.log('error to load replay');
                    }
                });
            });
        });
    },
});