import { GameConfig } from "../../GameBase/GameConfig";
import Connector from "../../Main/NetWork/Connector";
import AudioCtrl from "../../Main/Script/audio-ctrl";
import Cache from "../../Main/Script/Cache";
import DataBase from "../../Main/Script/DataBase";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../common/GameUtils";
import { App } from "../ui/hall/data/App";

const { ccclass, property } = cc._decorator
@ccclass
export default class BaseGame extends cc.Component {

    @property(cc.Label)
    lblPhoneTime = null;

    dtCount = 0;

    playManageAudio(msg) {
        let game = DataBase.gameType < 10 ? ("Game0" + DataBase.gameType) : ("Game" + DataBase.gameType);
        if (!cc.sys.isNative) {
            return;
        }
        let url = jsb.fileUtils.getWritablePath() + "remote-asset/Audio/" + game + "/" + msg;

        cc.loader.load(url, (err, data) => {
            if (!err) {
                AudioCtrl.getInstance().playSFX(data);
            }
        });
    }

    initGameBase(hn = false) {
        GameUtils.fitScreen();
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
    }




    tableBgmInit(hn = false) {
        let url = cc.url.raw('resources/Audio/Common/MJbgm.mp3');
        AudioCtrl.getInstance().playBGM(url);
    }
    removeDir() {
        let game = DataBase.gameType < 10 ? ("Game0" + DataBase.gameType) : ("Game" + DataBase.gameType);
        if (jsb.fileUtils.isDirectoryExist(jsb.fileUtils.getWritablePath() + "remote-asset")) {
            jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "remote-asset");
            DataBase.setString(DataBase.STORAGE_KEY.AUDIO[DataBase.gameType], "");
        }
    }
    joined = false;
    initVoice() {
        Connector.request('http://120.27.209.239:8082/fetch_rtc_token', {
            uid: App.Player.id,
            channelName: TableInfo.options.gameType + TableInfo.options.tableID,

        }, (res) => {
            console.log('声网token---', res);

            if (this.joined) {
                agora && agora.leaveChannel();
                console.log(`agora && agora.leaveChannel();`);
            } else {
                agora && agora.setDefaultAudioRouteToSpeakerphone(true);
                agora && agora.joinChannel(res.token, TableInfo.options.gameType + TableInfo.options.tableID, "", App.Player.id);
                console.log(`agora && agora.joinChannel( "", '${App.Player.id}');`);
            }
        })
        // cc.loader.loadRes("GameBase/preVoice", (err, prefab) => {
        //     if (!err) {
        //         this.winVoice = cc.instantiate(prefab).getComponent('ModuleVoice');
        //         this.winVoice.controlBtn = this.voiceCtrlButton;
        //         this.winVoice.node.parent = cc.find('Canvas');
        //         //this.winVoice.init();
        //     } else {
        //         //cc.log('initVoice error');
        //         //this.initVoice();
        //     }
        // });
    }

    showGps() {

    }

    gameReconnect() {
        //TODO
    }

    initShare() {
        cc.loader.loadRes("GameBase/preShare", (err, prefab) => {
            if (!err) {
                this.share = cc.instantiate(prefab).getComponent('ModuleShare');
            } else {
                this.initShare();
            }
        });
    }
    showSet() {
        App.pop(GameConfig.pop.GameSettingPop);
    }

    initChat() {
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
    }

    showChat() {
        if (this.chat == null)
            return;
        let nowTime = new Date().getTime();
        if (nowTime - this.lastClickChat < 1000) {
            return;
        }
        this.lastClickChat = nowTime;

        this.chat.showChat();
        // }
    }

    restartGame() {
        AudioCtrl.getInstance().stopAll();
        cc.game.restart();
    }

    addEvents() {
      
    }
    removeEvents() {
       
    }


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
    }
    onDestroy() {
        this.removeEvents();
    }
}


