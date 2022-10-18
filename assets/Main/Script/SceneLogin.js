let Cache = require("../Script/Cache"); // require("Cache");
const Connector = require("../NetWork/Connector"); //require("Connector");
let db = require("../Script/DataBase") //require("DataBase");
// let utils = require("utils");
const utils = require('../Script/utils');

//let calc = require("ModuleCalc27");
let audioCtrl = require("audio-ctrl");
const TABLE_TYPE = ["Game00", "Game01", "Game02", 'Game03', 'Game04', 'Game05', 'Game06', 'Game07', 'Game08', 'Game09', 'Game10', 'Game11', 'Game12', 'Game13', 'Game14', '', 'Game16', 'Game17', '', 'Game19', 'Game20', 'Game21', 'Game22', 'Game23', 'Game24', 'Game25', 'Game26', 'Game27', 'Game28', 'Game29'];
let TableInfo = require('TableInfo');
let { GameConfig } = require("../../GameBase/GameConfig");
let Native = require("../Script/native-extend"); // require('native-extend');
let _social = Native.Social;
let logic = require("Logic07");
const ROUTE = require("./ROUTE");
const { SelectLink } = require("./SelectLink");
const { App } = require("../../script/ui/hall/data/App");

//0,2,4,8,9,22,22,29,29,29,7
let loginSuccessCallback = function (data) {
    if (utils.isNullOrEmpty(data.token)) {
        Cache.alertTip("登录失败")
        return;
    }
    db.player = data.player;
    db.connectInfo = data.connectInfo;
    if ((utils.isNullOrEmpty(data.version) || utils.versionCompareHandle(data.version, '1.0.0') <= 0) && data.connectInfo) {
        Connector.connect(data, () => {
            GameConfig.CurrentGameType = data.connectInfo.gameType;
            db.setGameType(db.GAME_TYPE[data.connectInfo.gameType]);
            cc.director.loadScene(db.TABLE_TYPE[data.connectInfo.gameType]);
        });
        return;
    }
    if ((utils.isNullOrEmpty(data.version) || utils.versionCompareHandle(data.version, '1.0.0') <= 0) && data.matchInfo) {
        utils.pop(GameConfig.pop.MatchPop, (node) => {
            node.getComponent("ModuleMatchPop").resumeMatch(data);
        });
        return;
    }
};


module.exports = {
    loginSuccessCallback
}

cc.Class({
    extends: cc.Component,

    properties: {
        lblVersion: cc.Label,
        winTips: cc.Prefab,
    },

    onLoad() {
        utils.fitScreen();
        GameConfig.DeviceID =  "" + _social.getUUID();
        GameConfig.DeviceIDFA = "" + _social.getIDFA();

        this.loadPrefab(); // 加载游戏中的tips弹窗
        this.init();
        this.audioInit(); //ssssssss 初始化游戏音乐
        this.initGameType();
        cc.director.preloadScene('Lobby');
        cc.find("lblSchedule").getComponent(cc.Label).unscheduleAllCallbacks();
        let inviterStr = _social.getInviter();
        GameConfig.InviteCode = utils.decodeInviter(inviterStr)
        GameConfig.ShowTablePop=false;

        new SelectLink(() => {
                Connector.request(GameConfig.ServerEventName.GetPublicKey, {}, (data) => {
                    utils.saveValue(GameConfig.StorageKey.TokenPKey, data.key);
                },false,()=>{});
           
        });
        App.Club.clear();
        App.PushManager.disconnect();

    },
    compareVersion(versionA, versionB) {
        if ('' == versionA)
            return -1;
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        } else {
            return 0;
        }
    },

    initGameType: function () {
        cc.game.addPersistRootNode(cc.find('winMask'));
        cc.game.addPersistRootNode(cc.find('lblSchedule'));
    },

    init() {
        if (cc.gameVersion == null)
            cc.gameVersion = GameConfig.DefaultVersion;

        this.lblVersion.string = "版本号: " + cc.gameVersion;


    },


    loadPrefab() {
        let preTips = cc.instantiate(this.winTips);
        Cache.winTips = preTips.getComponent('ModuleWinTips');
    },

    audioInit: function () {
        // let bgmVolume = utils.getValue(GameConfig.StorageKey.MusicVolume, 1)
        // let SFXVolume = utils.getValue(GameConfig.StorageKey.SoundVolume, 1)
        // audioCtrl.getInstance().setBGMVolume(bgmVolume);
        // audioCtrl.getInstance().setSFXVolume(SFXVolume);
    },

    /**登录 */
    showLogin() {
        
        utils.pop(GameConfig.pop.LoginPop)
    },
    /**游客登录 */
    otherLogin() {
        // 
        // let self = this;
        // let encryptDevices = utils.encryptToken(GameConfig.DeviceID);
        // Connector.request(GameConfig.ServerEventName.UserLogin, { publicKey: GameConfig.Encrtyptor.getPublicKey(), deviceID: encryptDevices, install: GameConfig.InviteCode }, (data) => {
        //     if (data.success && data.token) {
        //         utils.saveValue(GameConfig.StorageKey.UserLoginTime, parseInt(new Date().getTime() / 1000));
        //         cc.director.loadScene("Lobby");

        //     }
        // }, null, (err) => {
        //     if (err.status.code == 502) {
        //         Cache.inputInviterPop("邀请码错误", (data) => {
        //             GameConfig.InviteCode = {
        //                 inviter: "" + data
        //             }
        //             self.wechatLogin();
        //         })
        //     } else {
        //         Cache.showTipsMsg(err.message);
        //     }
        // })
    },
    /**微信登录 */
    wechatLogin() {
        
        let self = this;
        _social.wechatAuth();
        _social.wxLoginCallBack = (code) => {
            let encryptDevices = utils.encryptToken(GameConfig.DeviceID);
            // let encryptIdfa = utils.encryptToken(GameConfig.DeviceIDFA);
            Connector.request(GameConfig.ServerEventName.UserLogin, { publicKey: GameConfig.Encrtyptor.getPublicKey(), deviceID: encryptDevices, wechatCode:code }, (data) => {
                if (data.success && data.token) {
                    utils.saveValue(GameConfig.StorageKey.UserLoginTime, parseInt(new Date().getTime() / 1000));
                    let decryptToken = GameConfig.Encrtyptor.decrypt(data.token);//data.token//
                    utils.saveValue(GameConfig.StorageKey.UserToken, decryptToken);
                    cc.director.loadScene("Lobby");
                }
            }, true, (err) => {
                App.confirmPop(err.message||'登录失败');
            })
        }
      
        // _social.wxLoginCallBack = (res) => {
        //     let encryptDevices = utils.encryptToken(GameConfig.DeviceID);
        //     let encryptIdfa = utils.encryptToken(GameConfig.DeviceIDFA);
        //     Connector.request(GameConfig.ServerEventName.UserLogin, { publicKey: GameConfig.Encrtyptor.getPublicKey(), idfa: encryptIdfa, deviceID: encryptDevices, info: res }, (data) => {
        //         if (data.success && data.token) {
        //             utils.saveValue(GameConfig.StorageKey.UserLoginTime, parseInt(new Date().getTime() / 1000));
        //             cc.director.loadScene("Lobby");
        //         }
        //     }, null, (err) => {
        //         Cache.showTipsMsg(err.message||'登录失败');
        //     })
        // }
    },

    ontestLogin(e, v) {
        let encryptDevices = utils.encryptToken('test'+v);
        Connector.request(GameConfig.ServerEventName.UserLogin, { deviceID: encryptDevices, publicKey: GameConfig.Encrtyptor.getPublicKey() }, (data) => {
            if (data.success && data.token) {

                if (!utils.isNullOrEmpty(data.token)) {
                    let decryptToken = GameConfig.Encrtyptor.decrypt(data.token);//data.token//
                    utils.saveValue(GameConfig.StorageKey.UserToken, decryptToken);
                }
                utils.saveValue(GameConfig.StorageKey.UserLoginTime, parseInt(new Date().getTime() / 1000));
                cc.director.loadScene("Lobby");
            }
        }, true, (err) => {
            App.confirmPop(err.message || '登录失败');
        })
    },
    /**本机登录 */
    devicesLogin(){
        
      let encryptDevices = utils.encryptToken(GameConfig.DeviceID);
        Connector.request(GameConfig.ServerEventName.UserLogin, { publicKey: GameConfig.Encrtyptor.getPublicKey(), deviceID: encryptDevices }, (data) => {
            if (data.success && data.token) {
                utils.saveValue(GameConfig.StorageKey.UserLoginTime, parseInt(new Date().getTime() / 1000));
                    let decryptToken = GameConfig.Encrtyptor.decrypt(data.token);//data.token//
                    utils.saveValue(GameConfig.StorageKey.UserToken, decryptToken);
                cc.director.loadScene("Lobby");
            }
        }, true, (err) => {
            App.confirmPop(err.message || '登录失败');
        })
    },

    /**清除本地存储数据 */
    onClearStorage() {
        
        cc.sys.localStorage.clear();

        Connector.request(GameConfig.ServerEventName.GetPublicKey, {}, (data) => {
            Cache.alertTip("清除成功");
            utils.saveValue(GameConfig.StorageKey.TokenPKey, data.key);
        });
        // cc.game.restart();
    },
    onTestLocal(){
        // Cache.alertTip('地址换为 http://192.168.1.100:8000/')
        Connector.logicUrl = 'http://127.0.0.1:8000/';
        let a='https://chatlink-new.meiqia.cn/widget/standalone.html?eid=9feccffbe0ea723a7ab49215e59a6c75'
        _social.openUrl(`${a}&metadata={"tel":"${DataBase.player.phone}","name":"${DataBase.player.name}","qq":"${DataBase.player.id}","addr":"xyqp"}`)
    },
    onTestOnline(){
        Cache.alertTip('地址换为 http://120.77.220.32:8000/')
        Connector.logicUrl = 'http://120.77.220.32:8000/';
    },

});


// testCardDecode() {

//     // let current = {
//     //     auto: false,
//     //     card: 5,
//     //     cards: [404, 104, 104, 105, 105],
//     //     hands: 12,
//     //     idx: 1,
//     //     type: "SAN",
//     // }
//     // auto: false
//     // card: 5
//     // cards: (4)[106, 406, 105, 405]
//     // count: 2
//     // hands: 10
//     // idx: 1
//     // type: "LIANDUI"

//     // auto: false
//     // card: 7
//     // cards: [407]
//     // hands: 14
//     // idx: 1
//     // type: "DAN"

//     // auto: false
//     // card: 10
//     // cards: (5)[110, 310, 410, 104, 303]
//     // count: 1
//     // hands: 5
//     // idx: 1
//     // type: "SAN"
//     // let current = {
//     //     auto: false,
//     //     card: 4,
//     //     cards: [304, 404],
//     //     hands: 3,
//     //     idx: 1,
//     //     type: "DUI"
//     // } 
//     let current = null;

//     let config = {
//         ext: false,
//         show: true,
//         black: false,
//         bird: true,
//         rand: true,
//         four: true,
//         aaa: false,
//         limit: true,
//         person: 3,
//         clan: true,
//         turn: 10
//     }
//     let currentHandsLength = 15
//     //  4445556666 77788833300jj5
//     let playCards = [206, 206, 206, 206, 204, 204, 204, 305, 305, 305];
//     this.testShowCard(playCards, this.testCard1);

//     let cardList = logic.checkCard(playCards, currentHandsLength, config, current);
//     // cardList:
//     // card: 7
//     // cards: (5) [107, 107, 107, 304, 203]
//     // count: 1
//     // type: "SAN"
//     // __proto__: Object
//     // otherCard: (7) [208, 408, 205, 205, 205, 205, 403]
//     // __proto__: Object
//     this.testShowCard(cardList.cardList.cards, this.testCard2);
// },
// testShowCard(data, node) {
//     data.forEach(element => {
//         let nodeCard = cc.instantiate(this.testCard);
//         nodeCard.getComponent("ModuleCards07").init(element);
//         nodeCard.parent = node;

//     });
// },