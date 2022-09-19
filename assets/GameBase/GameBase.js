let DataBase = require('DataBase');
let audioCtrl = require('audio-ctrl');
let utils = require("../Main/Script/utils");
 var { GameConfig } = require('./GameConfig');
const Cache = require('../Main/Script/Cache');
const { App } = require('../script/ui/hall/data/App');
cc.Class({
    extends: cc.Component,

    properties: {
        // voiceCtrlButton: cc.Node,
        lblPhoneTime: cc.Label,
        dtCount: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    playManageAudio  (msg) {

        let game = DataBase.gameType < 10 ? ("Game0" + DataBase.gameType) : ("Game" + DataBase.gameType);
        if (!cc.sys.isNative) {
            return;
        }
        let url = jsb.fileUtils.getWritablePath() + "remote-asset/Audio/" + game + "/" + msg;

        cc.loader.load(url, (err, data) => {
            if (!err) {
                let audioCtrl = require("audio-ctrl");
                audioCtrl.getInstance().playSFX(data);
            }
        });
    },

    initGameBase(hn = false) {
        utils.fitScreen();
        App.unlockScene();
        this.tableBgmInit(hn);
        this.voteStatus = false;
        //this.gps = null;
        this.chat = null;
        this.vote = null;
        this.set = null;
        this.playerInfo = null;
        this.lastClickChat = new Date().getTime();
        // this.initSet();
        // this.initShare();
        this.initChat();
        // this.initVote();
        // this.initVoice();
        // this.showPlayerInfo();
        // this.initPlayerInfo();
        // this.initAudioManage();
        //this.initGps();
        //TODO
        // this.handleTrade();
        this.addGoEasyEvents();
    },
    addGoEasyEvents() {
    },
    removeGoEasyEvents() {
    },
    tableBgmInit(hn = false) {

        let url = cc.url.raw('resources/Audio/Common/MJbgm.mp3');
        // if (hn)
        //     url = cc.url.raw(`resources/Audio/Common/hnbg.mp3`);
        audioCtrl.getInstance().playBGM(url);
        // audioCtrl.getInstance().playBGM(this.bgmClip);
    },
    removeDir  () {
        let game = DataBase.gameType < 10 ? ("Game0" + DataBase.gameType) : ("Game" + DataBase.gameType);
        if (jsb.fileUtils.isDirectoryExist(jsb.fileUtils.getWritablePath() + "remote-asset")) {
            jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "remote-asset");
            DataBase.setString(DataBase.STORAGE_KEY.AUDIO[DataBase.gameType], "");
        }
    },
    // initVoice() {
    //     cc.loader.loadRes("GameBase/preVoice", (err, prefab) => {
    //         if (!err) {
    //             this.winVoice = cc.instantiate(prefab).getComponent('ModuleVoice');
    //             this.winVoice.controlBtn = this.voiceCtrlButton;
    //             this.winVoice.node.parent = cc.find('Canvas');
    //             //this.winVoice.init();
    //         } else {
    //             //cc.log('initVoice error');
    //             //this.initVoice();
    //         }
    //     });
    // },

    showGps() {

    },
    gameReconnect(){
        //TODO
    },
    initShare  () {
        cc.loader.loadRes("GameBase/preShare", (err, prefab) => {
            if (!err) {
                this.share = cc.instantiate(prefab).getComponent('ModuleShare');
            } else {
                this.initShare();
            }
        });
    },
    showSet () {
        
        // utils.pop(GameConfig.pop.GameSetting);
        App.pop(GameConfig.pop.GameSettingPop)
    },

    initChat  () {
        cc.loader.loadRes("GameBase/preChat", (err, prefab) => {
            if (!err) {
                this.chat = cc.instantiate(prefab).getComponent('ModuleChat');
                let newEvent = new cc.Event.EventCustom('chatAlready', true);
                if (this.node)
                    this.node.dispatchEvent(newEvent);
            } else {
                this.initChat();
            }
        });
    },

    showChat  () {
        if (this.chat == null)
            return;


        
        let nowTime = new Date().getTime();
        if (nowTime - this.lastClickChat < 1000) {
            return;
        }
        this.lastClickChat = nowTime;

        this.chat.showChat();
        // }
    },

    restartGame  () {
        audioCtrl.getInstance().stopAll();
        cc.game.restart();
    },

    addEvents() { },
    removeEvents() { },
    update(dt) {
        this.dtCount++;
        if (this.dtCount % 60) {
            this.dtCount = 0;
            let date = new Date();
            let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';
            let m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
            if (this.lblPhoneTime)
                this.lblPhoneTime.string = h + m;
        }
    },
    onDestroy() {
        this.removeEvents();
        this.removeGoEasyEvents();
    }

});
