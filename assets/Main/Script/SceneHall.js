import Avatar from "../../script/ui/common/Avatar";
import audioCtrl from './audio-ctrl';
// // let audioCtrl = require("audio-ctrl");
// // let Native = require('native-extend');
import Native from './native-extend';
import GameUtils from "../../script/common/GameUtils";
// // var { GameConfig } = require("../../GameBase/GameConfig");
import { GameConfig } from "../../GameBase/GameConfig";
// // const { App } = require("../../script/ui/hall/data/App");
import { App } from "../../script/ui/hall/data/App";
// // const { Social } = require("./native-extend");
// import { Social } from "./native-extend";
// // const Connector = require("../NetWork/Connector");
import Connector from "../NetWork/Connector"
import InvitationCardPop from "../../script/qj/hall/InvitationCardPop";
import Cache from "./Cache";
let _social = Native.Social;
const { ccclass, property } = cc._decorator;
@ccclass
export default class SceneHall extends cc.Component {
    @property(cc.Label)
    lblVersion = null
    @property(Avatar)
    sprHead = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblDiamond = null
    @property(cc.Label)
    lblId = null
    @property(cc.Label)
    lblNotice = null
    @property(cc.Node)
    nodeMenu = null

    speed = {
        default: 100,
        tips: '广播的速度'
    }
    @property(cc.Node)
    btnScreen = null

    onLoad() {
        App.fitScreen();
        this.addEvents();
    }

    start() {
        this.init();
    }

    init() {
        // GameConfig.IsConnecting = false;
        this.initBGM(); //大厅音乐初始化
        this.initNotice(); // 大厅信息初始化
        this.getPlayerData();
        App.pop(GameConfig.pop.CreatePop, 'INIT');
        cc.director.preloadScene('Game16');
        let schedule = cc.find("lblSchedule");
        if (schedule) {
            schedule.getComponent(cc.Label).unscheduleAllCallbacks();
        }
        if (cc.gameVersion == null)
            cc.gameVersion = GameConfig.DefaultVersion;

        this.lblVersion.string = "版本号: " + cc.gameVersion;
    }


    addEvents() {
        // App.EventManager.addEventListener(GameConfig.GameEventNames.CLUB_CHANGE, this.changeClubInfo, this);
        // App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_HALL_CLUB, this.updateClubInfo, this);
        // App.EventManager.addEventListener(GameConfig.GameEventNames.GOEASY_UPDATE_SERVICE, this.handleService, this);
        // this.joinRoomBtn.on(cc.Node.EventType.TOUCH_END, this.showJoinRoom, this);
        // this.DLMBtn.on(cc.Node.EventType.TOUCH_END, this.showDLM, this);
        // this.serviceBtn.on(cc.Node.EventType.TOUCH_END, this.onClickService, this);
        // this.settingBtn.on(cc.Node.EventType.TOUCH_END, this.onClickSetting, this);
        // this.infoBtn.on(cc.Node.EventType.TOUCH_END, this.onClickInfo, this);
        // this.shareBtn.on(cc.Node.EventType.TOUCH_END, this.onClickShare, this);
        // this.historyBtn.on(cc.Node.EventType.TOUCH_END, this.onClickHistory, this);
        // this.updateBtn.on(cc.Node.EventType.TOUCH_END, this.onClickRefresh, this);
        // this.emailBtn.on(cc.Node.EventType.TOUCH_END, this.showMessagePop, this);
        // this.lblId.node.on(cc.Node.EventType.TOUCH_END, this.copyId, this);
        // this.node.on(GameConfig.GameEventNames.PLAYER_DATA_UPDATE, this.initPlayer, this);
        // this.invitationCardBtn.on(cc.Node.EventType.TOUCH_END, this.showInvitationCard, this);
        // App.EventManager.addEventListener(GameConfig.GameEventNames.JUDGE_TIPS, this.judgeTips, this);

    }
    removeEvents() {
        // App.EventManager.removeEventListener(GameConfig.GameEventNames.CLUB_CHANGE, this.changeClubInfo, this);

        // App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_HALL_CLUB, this.updateClubInfo, this);

        // this.joinRoomBtn.off(cc.Node.EventType.TOUCH_END, this.showJoinRoom, this);
        // this.invitationCardBtn.off(cc.Node.EventType.TOUCH_END, this.showInvitationCard, this);
        // this.DLMBtn.off(cc.Node.EventType.TOUCH_END, this.showDLM, this);
        // this.serviceBtn.off(cc.Node.EventType.TOUCH_END, this.onClickService, this);
        // this.settingBtn.off(cc.Node.EventType.TOUCH_END, this.onClickSetting, this);
        // this.infoBtn.off(cc.Node.EventType.TOUCH_END, this.onClickInfo, this);
        // this.shareBtn.off(cc.Node.EventType.TOUCH_END, this.onClickShare, this);
        // this.historyBtn.off(cc.Node.EventType.TOUCH_END, this.onClickHistory, this);
        // this.updateBtn.off(cc.Node.EventType.TOUCH_END, this.onClickRefresh, this);
        // this.emailBtn.off(cc.Node.EventType.TOUCH_END, this.showMessagePop, this);

        // this.node.off(GameConfig.GameEventNames.PLAYER_DATA_UPDATE, this.initPlayer, this);

        // App.EventManager.removeEventListener(GameConfig.GameEventNames.JUDGE_TIPS, this.judgeTips, this);
    }

    /** 邀请函 */
    onClickInvitationCard() {
        App.pop(GameConfig.pop.InvitationCard);
    }

    /** 加入房间 */
    onClickJoin() {
        App.pop(GameConfig.pop.JoinPop);
    }

    /** 退出游戏 */
    onClickExit() {
        App.confirmPop("是否退出游戏", () => {
            cc.game.end();
        });
    }

    initNotice() {
        if (GameUtils.isNullOrEmpty(GameConfig.GameInfo.gameNotice)) return;
        this.noticeNode.active = true;
        this.lblNotice.string = GameConfig.GameInfo.gameNotice;
        setTimeout(() => {
            if (this.lblNotice) {
                this.lblNotice.node.stopAllActions();
                let distance = this.lblNotice.node.width + this.lblNotice.node.parent.width;
                let ap = cc.place(cc.v2(this.lblNotice.node.parent.width / 2, 0));
                let bp = cc.moveBy(distance / this.speed, cc.v2(-distance, 0));
                let cp = cc.sequence(ap, bp);
                let dp = cc.repeatForever(cp);
                this.lblNotice.node.runAction(dp);
            }
        }, 100)
    }

    initBGM() {
        let url = cc.url.raw(`resources/Audio/Common/HallMusic.mp3`);
        audioCtrl.getInstance().init();
        audioCtrl.getInstance().playBGM(url);
    }

    /**更新玩家数据 */
    getPlayerData() {
        App.lockScene();
        Connector.request(GameConfig.ServerEventName.GetPlayerInfo, {}, (data) => {
            let { ts, player, connectInfo = null } = data;
            if (!GameUtils.isNullOrEmpty(data.token)) {
                let decryptToken = GameConfig.Encrtyptor.decrypt(data.token);//data.token//
                GameUtils.saveValue(GameConfig.StorageKey.UserToken, decryptToken);
            }
            // Cache.hideMask();
            if (ts) GameConfig.ServerTimeDiff = ts - new Date().getTime();
            GameUtils.saveValue(GameConfig.StorageKey.UserLoginTime, parseInt(new Date().getTime() / 1000));
            App.Player = player;
            this.initPlayer();
            App.unlockScene();
        }, true, (data) => {
            App.unlockScene();
            if (!GameUtils.isNullOrEmpty(data.status) && data.status.code == 700) {
                // Cache.showTipsMsg(utils.isNullOrEmpty(data.message) ? "版本号错误" : data.message, () => {
                //     cc.director.loadScene("Update");
                // });
                return;
            }
            //登录失败  跳转登陆界面
            App.confirmPop(GameUtils.isNullOrEmpty(data.message) ? "长时间未登录，密码失效，请重新登录" : data.message, () => {
                cc.director.loadScene("Login");
            });
        });
    }

    /**初始化玩家信息 */
    initPlayer() {
        this.lblName.string = GameUtils.getStringByLength(App.Player.name, 8);
        this.lblId.string = 'ID: ' + App.Player.id;
        this.sprHead.avatarUrl = App.Player.head;
        this.lblDiamond.string = "" + App.Player.diamond;
        App.PushManager.connect();
    }


    /**个人中心 */
    onClickTopLeft() {
        App.pop(GameConfig.pop.PlayerCenterPop);
    }

    /** 创建房间 */
    onClicCreate() {
        App.pop(GameConfig.pop.CreatePop);
    }

    onClickCloseMenu() {
        this.nodeMenu.active = false;
        this.btnScreen.active = false;
    }

    /** 菜单 */
    onClickMenu() {
        this.nodeMenu.active = !this.nodeMenu.active;
        this.btnScreen.active = this.nodeMenu.active;
    }

    /** 游戏规则 */
    onClickGameRules() {
        this.onClickCloseMenu();
        App.pop(GameConfig.pop.GameRulesPop);
    }

    onClickShare() {
        //播放
        // cc.loader.loadRes('QJHH1.json', (err, object) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     console.log("player Data",App.Player)
        //     console.log("回放数据--", object.json)
        //     // App.pop(GameConfig.pop.RecordGame16, { replayData: object.json })
        //     // App.pop(GameConfig.pop.RecordGame07,{replayData: object.json})
        // });
        // return;

        App.pop(GameConfig.pop.SharePop);
    }

    onClickRecord() {
        App.pop(GameConfig.pop.GameRecordPop);
    }

    /** 茶馆 */
    onClickClub() {
        App.pop(GameConfig.pop.ClubListPop);
    }

    /** 设置 */
    onClickSetting() {
        this.onClickCloseMenu();
        App.pop(GameConfig.pop.SettingPop);
    }

    onClickQuitGame() {
        App.confirmPop('是否退出游戏?', () => {
            cc.game.end();
        });
    }

    /**复制id */
    copyId() {
        // 
        Cache.alertTip("id复制成功");
        _social.setCopy("" + App.Player.id);
    }

    onDestroy() {
        this.removeEvents();
    }
};




