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
    @property(cc.Node)
    inviteRedPoint = null

    speed = 100
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

        agora && agora.leaveChannel();
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
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_INVITATION_CARD, this.updateInviteRed, this);
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
        // if (agora) {
        //     console.log('123123')
        //     // agora.on('join-channel-success', this.onJoinChannelSuccess, this);
        //     // agora.on('leave-channel', this.onLeaveChannel, this);

        //     // agora.on('leave-channel', this.onLeaveChannel, this);
        //     // agora.on('rejoin-channel-success', this.onRejoinChannelSuccess, this);
        //     // agora.on('warning', this.onWarning, this);
        //     // agora.on('error', this.onError, this);
        //     // agora.on('audio-quality', this.onAudioQuality, this);
        //     // agora.on('audio-volume-indication', this.onAudioVolumeIndication, this);
        //     // agora.on('network-quality', this.onNetworkQuality, this);
        //     // agora.on('user-joined', this.onUserJoined, this);
        //     // agora.on('user-offline', this.onUserOffline, this);
        //     // agora.on('user-mute-audio', this.onUserMuteAudio, this);
        //     // agora.on('audio-routing-changed', this.onAudioRoutingChanged, this);
        //     // agora.on('connection-lost', this.onConnectionLost, this);
        //     // agora.on('connection-interrupted', this.onConnectionInterrupted, this);
        //     // agora.on('request-token', this.onRequestToken, this);
        //     // agora.on('connection-banned', this.onConnectionBanned, this);
        //     // agora.on('client-role-changed', this.onClientRoleChanged, this);
        // }
    }
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_INVITATION_CARD, this.updateInviteRed, this);
        // if (agora) {
        //     console.log('22222')
        //     // agora.off('leave-channel', this.onLeaveChannel, this);
        //     // agora.off('join-channel-success', this.onJoinChannelSuccess, this);
        //     // agora.off('leave-channel', this.onLeaveChannel);
        //     // agora.off('rejoin-channel-success', this.onRejoinChannelSuccess, this);
        //     // agora.off('warning', this.onWarning, this);
        //     // agora.off('error', this.onError, this);
        //     // agora.off('audio-quality', this.onAudioQuality, this);
        //     // agora.off('audio-volume-indication', this.onAudioVolumeIndication, this);
        //     // agora.off('network-quality', this.onNetworkQuality, this);
        //     // agora.off('user-joined', this.onUserJoined, this);
        //     // agora.off('user-offline', this.onUserOffline, this);
        //     // agora.off('user-mute-audio', this.onUserMuteAudio, this);
        //     // agora.off('audio-routing-changed', this.onAudioRoutingChanged, this);
        //     // agora.off('connection-lost', this.onConnectionLost, this);
        //     // agora.off('connection-interrupted', this.onConnectionInterrupted, this);
        //     // agora.off('request-token', this.onRequestToken, this);
        //     // agora.off('connection-banned', this.onConnectionBanned, this);
        //     // agora.off('client-role-changed', this.onClientRoleChanged, this);
        // }
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
        // this.noticeNode.active = true;
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
        }, 1000)
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
            App.Player.init(player);
            console.log('大厅玩家信息--', App.Player)
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
        this.judgePopClub()
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

    onClickActivity() {
        Cache.alertTip('暂无活动')
        // return;
        // App.pop(GameConfig.pop.RechargeActivityPop);

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

    /**更新邀请函提示红点 */
    updateInviteRed() {
        let unReadInvite = GameUtils.getValue(GameConfig.StorageKey.UnReadInvite, 0);
        this.inviteRedPoint.active = unReadInvite > 0;
    }

    judgePopClub() {

        if (!GameConfig.ShowTablePop) return;
        GameConfig.ShowTablePop = true;
        if (App.Club.id && App.Club.oglID && App.Club.isLeague >= 0) {
            App.pop(GameConfig.pop.ClubPop, { update: true, clubID: App.Club.id, oglClubID: App.Club.oglID });
        }
    }




    initVoice() {
        // var appid = 'ff51d68e945b4f8e8682e1aab27c990b';
        // agora && agora.init(appid);
        // // agora.setChannelProfile(agora.CHANNEL_PROFILE_TYPE.CHANNEL_PROFILE_GAME);
    }

    onJoinChannelSuccess(channel, uid, elapsed) {
        // Cache.alertTip('进入频道')
        // this.joined = true;
        // //开启其他人喇叭
        // agora && agora.muteAllRemoteAudioStreams(false);
        // //关掉自己麦克风
        // agora && agora.muteLocalAudioStream(true);

    }
    joined = false;
    joinChannel() {
        // if (this.joined) {
        //     agora && agora.leaveChannel();
        //     console.log(`agora && agora.leaveChannel();`);
        // } else {
        //     let agoraToken = '007eJxTYBC5uU/30/uHh7xq5TX6hZKUVv3kZ1h1yzq3zOrstNeRPQUKDGlppoYpZhapliamSSZpFqkWZhZGqYaJiUlG5smWlgZJ9Tl+yQ2BjAxzdB4wMzJAIIjPzBDg4s3AAABBlx7Y'
        //     agora && agora.setDefaultAudioRouteToSpeakerphone(true);
        //     agora && agora.joinChannel(agoraToken, 'PDK', "", App.Player.id);
        //     console.log(`agora && agora.joinChannel( "", '${App.Player.id}');`);
        // }
    }
    leaveChannel() {
        // agora && agora.leaveChannel();
    }


    onLeaveChannel() {
        // Cache.alertTip('离开频道')
        // this.joined = false;
    }
    testtt(e) {
        // console.log('first-audio-frame-decode', e)
    }

    openServer() {
        let url = 'https://196ad724f7cc7.mstalk.cn/dist/standalone.html?eid=10a1d21c07548ec590f6c55245e115f2'
        let openUrl = `${url}&metadata={"id":"${App.Player.id}"}`//  ;
        if (cc.sys.os === cc.sys.OS_IOS) {
            _social.setCopy(openUrl);
            App.confirmPop('客服地址已复制,请打开浏览器粘贴访问')
        } else {
            _social.openUrl(openUrl)

        }

        // App.pop(GameConfig.pop.ServicePop)
    }


    onDestroy() {
        this.removeEvents();
    }
};




