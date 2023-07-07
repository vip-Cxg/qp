import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import AudioCtrl from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import PACK from "../../../Main/Script/PACK";
import ROUTE from "../../../Main/Script/ROUTE";
import TableInfo from "../../../Main/Script/TableInfo";
import BaseGame from "../../../script/base/BaseGame";
import DataBase from "../../../script/base/DataBase";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../../../script/ui/hall/data/App";
import PokerPlayer from "../../commonScript/PokerPlayer";
import SelfHandsCard10 from "./SelfHandsCard10";
import Calc from "./Calc10";
import PokerPlayCard from "../../commonScript/PokerPlayCard";
import WSKSummary from "./WSKSummry";
import WSKScoreCardCount from "./WSKScoreCardCount";
import WSKCurrentScore from "./WSKCurrentScore";
import PokerSelfCard from "../../commonScript/PokerSelfCard";
import WSKTeamHands from "./WSKTeamHands";

const { ccclass, property } = cc._decorator
@ccclass
export default class SceneTable10 extends BaseGame {

    @property(cc.Prefab)
    playerItem = null;
    @property(SelfHandsCard10)
    layerHandCards = null;
    @property(WSKTeamHands)
    teamHands = null;

    @property(cc.Label)
    lblRoomId = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Label)
    lblBase = null;
    @property(cc.Label)
    lblBaseCredit = null;
    @property(cc.Label)
    lblDistance = null;
    @property(cc.Node)
    btnTips = null;
    @property(cc.Node)
    btnPlayCards = null;
    @property(cc.Node)
    btnQuest = null;
    @property(cc.Node)
    btnPass = null;
    @property(cc.Node)
    btnNoGrater = null;
    @property([cc.Node])
    bgCount = [];
    @property([cc.Node])
    dropCards = [];
    @property([cc.Node])
    imgPass = [];
    @property(cc.Prefab)
    preCoin = null;
    @property(cc.Prefab)
    preType = null;
    @property(cc.Prefab)
    summaryPrefab = null;
    @property(cc.Prefab)
    pokerSummaryFour = null;
    @property(cc.Prefab)
    prePlayCards = null;
    @property(cc.Prefab)
    aniNode = null;
    @property(cc.Node)
    nodeAnim = null;
    @property(cc.Prefab)
    nodeBack = null;
    @property(cc.Prefab)
    zhuaCardPre = null;

    @property(cc.Node)
    normalReadyBtn = null;
    @property(cc.Node)
    bgTable = null;
    @property(cc.Node)
    sprDisnable = null;
    @property(cc.Node)
    startAutoBtn = null;
    @property(cc.Node)
    cancelAutoBtn = null;
    @property(cc.Node)
    exitBtn = null;
    @property(cc.Node)
    btnDisband = null;

    @property(cc.Node)
    autoMask = null;


    @property(sp.SkeletonData)
    cutAnim = null;

    @property(cc.Sprite)
    bgNode = null;
    @property(cc.Node)
    cutTips = null;
    @property(cc.Node)
    seatBtnContent = null;

    @property([sp.SkeletonData])
    pokerSkeleton = [];
    @property([cc.SpriteFrame])
    cardTypeSf = [];
    @property(cc.Node)
    ruleBtn = null;
    @property(cc.Node)
    ruleContent = null;
    @property(cc.Label)
    lblRule = null;

    @property(cc.Node)
    randomNode = null;
    @property(cc.Node)
    randomContent = null;

    @property(WSKScoreCardCount)
    scoreCardContent = null;
    @property(WSKCurrentScore)
    currentScore = null;

    @property(cc.Node)
    groupScore = null;
    @property(cc.Label)
    myGroup = null;
    @property(cc.Label)
    otherGroup = null;
    @property(cc.Label)
    lblCurrentScore = null;

    @property(WSKTeamHands)
    summaryHands = [];

    @property(cc.Node)
    wskGameChat = null;

    @property(cc.Node)
    btnChat = null;

    players = [];
    hands = [];
    _delayTime = 0;
    lastAutoTime = 0;
    currentAutoStatus = false;

    // use this for initialization
    onLoad() {
        // this.summaryHands = this.summaryHands.map(s => s && s.getComponent('WSKTeamHands'));
        this.summaryHands.forEach(s => s && s.reset());
        cc.log(this.summaryHands);
        // let indexBg = GameUtils.getValue(GameConfig.StorageKey.tableBgIndex, 0)
        // this.bgNode.spriteFrame = GameConfig.tableBgSprite[indexBg];
        this.initChatContent();
        this.initGameBase();
        //添加监听事件
        this.addEvents();
        this.alReady = false;
        TableInfo.idx = -1;
        Connector.emit(PACK.CS_JOIN_DONE, {});
        Connector.LogsClient(GameConfig.LogsEvents.SOCKET_LINK, { action: GameConfig.LogsActions.ENTER_SCENE, gamtype: "PDK_SOLO" });
        this.schedule(() => {
            this.gameMsgSchedule();
        }, 0.1);

        //tianjia
        GameUtils.pop(GameConfig.pop.TipsCard, (node) => {
            node.setPosition(-cc.winSize.width / 2 + 200, cc.winSize.height / 2 - node.height / 2)
            this.tipsCardPrefab = node.getComponent("ModuleTipsCard");
        })
    }
    /**添加监听事件 */
    addEvents() {
        if (agora) {
            agora.on('join-channel-success', this.onJoinChannelSuccess, this);
            agora.on('leave-channel', this.onLeaveChannel, this);
            agora.on('user-mute-audio', this.onUserMuteAudio, this);
        }
        this.ruleBtn.on(cc.Node.EventType.TOUCH_END, this.showRuleNode, this);

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.ruleContent.active = false;
            // this.hands.resetHandsPos();
            // this.bgTing.active = false;
            // this._hands
            this.layerHandCards.resetHands();
        }, this)

        this.startAutoBtn.on(cc.Node.EventType.TOUCH_END, this.onStartAuto, this);
        this.cancelAutoBtn.on(cc.Node.EventType.TOUCH_END, this.onCancelAuto, this);
        this.exitBtn.on(cc.Node.EventType.TOUCH_END, this.onClickExit, this);
        this.normalReadyBtn.on(cc.Node.EventType.TOUCH_END, this.normalReady, this);

        App.EventManager.addEventListener(GameConfig.GameEventNames.PDK_CONTINUE_GAME, this.normalReady, this);

        // this.node.on(GameConfig.GameEventNames.PDK_BACK_HALL, this.backHall, this);

    }
    /**移除监听事件 */
    removeEvents() {
        this.startAutoBtn.off(cc.Node.EventType.TOUCH_END, this.onStartAuto, this);
        this.cancelAutoBtn.off(cc.Node.EventType.TOUCH_END, this.onCancelAuto, this);
        this.exitBtn.off(cc.Node.EventType.TOUCH_END, this.onClickExit, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.PDK_CONTINUE_GAME, this.normalReady, this);

        // this.node.off(GameConfig.GameEventNames.PDK_BACK_HALL, this.backHall, this);
        if (agora) {
            agora.off('leave-channel', this.onLeaveChannel, this);
            agora.off('join-channel-success', this.onJoinChannelSuccess, this);
            agora.off('user-mute-audio', this.onUserMuteAudio, this);
        }
    }
    initChatContent() {
        this.node.on('chatAlready', () => {
            let windowNode = cc.find("Canvas")
            let data = {
                str: [
                    '不要跟我假噶玛噶',
                    '好不好开',
                    '沃斯地搞',
                    '几个玛',
                    '有没得之尊',
                    '背时佬起坎咯',
                    '我立起拉，要不要踩刹车的',
                    '在跳把你搞的蹲到的列',
                    '你是不是清水哦',
                    '必须要搞了，别个在检就赢了',
                    '这牌神仙都医不活哒',
                    '投降输一半'
                ],
                url: 'ChatImg/Game11',
                aniPos: [
                    cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen, -240 + 30),
                    cc.v2(cc.winSize.width / 2 - 139 / 2 - GameConfig.FitScreen, 35 + 30),
                    cc.v2(-350, cc.winSize.height / 2 - 40),
                    cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen, 35 + 30)
                ],
                msgPos: [
                    cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen + 50, -240 + 60),
                    cc.v2(cc.winSize.width / 2 - 139 / 2 - GameConfig.FitScreen - 50, 35 + 60),
                    cc.v2(-350 + 50, 220 + 60),
                    cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen + 50, 35 + 60)
                ],
                facePos: [
                    cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen + 139, -240 + 44),
                    cc.v2(cc.winSize.width / 2 - 139 / 2 - GameConfig.FitScreen - 139, 35 + 44),
                    cc.v2(-350 + 139, 220 + 44),
                    cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen + 139, 35 + 44)
                ]
            };
            this.chat.init(data);
        });
    }
    gameMsgSchedule() {
        if (this._delayTime > 0) {
            this._delayTime--;
            return;
        }
        if (Connector._queueGameMsg.length <= 0)
            return;
        let msg = Connector._queueGameMsg.shift();
        let logs = cc.sys.isBrowser ? msg : JSON.stringify(msg)
        console.log(logs)
        if (msg.route == ROUTE.SC_GAME_DATA || msg.route == ROUTE.SC_JOIN_TABLE || msg.route == ROUTE.SC_RECONNECT)
            this.alReady = true;
        if (!this.alReady)
            return;

        switch (msg.route) {
            case ROUTE.SC_GAME_DATA: //进桌 重连
                this.resume(msg.data);
                break;
            //玩家进入房间
            case ROUTE.SC_JOIN_TABLE:
                this.initTable(msg.data);
                break;
            //游戏开始
            case ROUTE.SC_GAME_INIT:
                this.initGame(msg.data);
                break;
            //玩家出牌
            case ROUTE.SC_PLAY_CARD:
                this.playCard(msg.data);
                break;
            //显示玩家出牌
            case ROUTE.SC_SHOW_CARD:
                this.showPlayCards(msg.data);
                break;
            case ROUTE.SC_SHOW_HOST:
                this.resetPlayers(msg.data);
                break;
            case ROUTE.SC_GAME_READY:
                this.changeReady(msg.data);
                break;
            case ROUTE.SC_PASS_CARD:
                this.showPass(msg.data);
                break;
            case ROUTE.SC_REFRESH_CARD:
                DataBase.player.card = msg.data.card;
                break;
            case ROUTE.SC_PLAYER_LEAVE:
                this.leavePlayer(msg.data.idx);
                break;
            case ROUTE.SC_CHANGE_STATUS:
                this.changeStatus(msg.data);
                break;
            //分数改变
            case ROUTE.SC_SCORE:
                this.scoreFly(msg.data);
                break;
            case ROUTE.SC_FINISH:
                this.finish(msg.data);
                break;
            case ROUTE.SC_ROUND_SUMMARY:
                this.roundSummary(msg.data);
                break;
            case ROUTE.SC_GAME_SUMMARY:
                // this.gameSummary(msg.data);
                break;

            case ROUTE.SC_GAME_CHAT:
                if (this.chat != null)
                    this.chat.contentFly(msg.data);
                break;
            case ROUTE.SC_SYSTEM_NOTICE:
                GameUtils.pop(GameConfig.pop.NoticePop, (node) => {
                    node.getComponent('ModuleNotice').showTips(msg.data.msg, message.data.times);
                })
                break;
            case ROUTE.SC_PLAY_ERROR:
                //Cache.alertTip("必须带黑桃三");
                break;
            case ROUTE.SC_ALERT:
                this.acBaodan(msg.data);
                break;
            case ROUTE.SC_LOCATION:
                this.refreshLoc(msg.data);
                break;
            case ROUTE.SC_CANCEL_AUTO:
                this.cancelAuto(msg.data);
                break;
            case ROUTE.SC_START_AUTO:
                this.startAuto(msg.data);
                break;
            case ROUTE.SC_TIPS:
                this.showTipsCard(msg.data);
                break;
            case ROUTE.SC_TOAST:
                if (!GameUtils.isNullOrEmpty(msg.data.message))
                    Cache.alertTip(msg.data.message);
                break;
            case ROUTE.SC_GAME_DESTORY:
                this.destoryGame();
                break;
            case ROUTE.SC_DISBAND:
                this.showVotePop(msg.data);
                break;
            case ROUTE.SC_OBSERVER:
                TableInfo.observers = msg.data.observers;
                break;
            case ROUTE.SC_SYNC_HANDS:
                this.layerHandCards.handsCard = msg.data.hands;
                this.teamHands.handsCard = msg.data.teammateHands;
                this.scoreCardContent.renderUI(msg.data.hands, msg.data.teammateHands || []);

                break;
            case ROUTE.SC_DONE:
                let idx = TableInfo.realIdx[msg.data.idx];
                if (msg.data.idx == TableInfo.idx)
                    TableInfo.status = GameConfig.GameStatus.FINISH;
                this.players[idx].activeBaodan(false);
                this.players[idx].finishAnim(msg.data.rank);
                TableInfo.players[msg.data.idx]['rank'] = msg.data.rank;
                break;
            default:
                cc.error(msg);
                break;
        }
    }
    destoryGame() {
        Connector._queueGameMsg = [];
        Connector._queueChatMsg = [];
        Connector.disconnect();
    }
    refreshLoc(data) {
        let idx = data.idx;
        let targetPlayer = TableInfo.players[idx];
        if (targetPlayer) {
            targetPlayer.prop.loc = data.loc;
        }
    }
    /**要不起 */
    showPass(data) {
        let realIdx = TableInfo.realIdx[data.idx];
        this.dropCards[realIdx].destroyAllChildren();
        this.bgCount[realIdx].destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this._delayTime = 5;
        this.changeBtn(false);

        this.players[realIdx].playCardLight(false);
        this.players[realIdx].hideClock();

        this.sprDisnable.active = data.idx == TableInfo.idx && TableInfo.options.gameType != GameConfig.GameType.WSK;
        // let voice = this.bgTable.getComponent("BgTableAudioCtr07");
        // voice.PassVoice(TableInfo.players[data.idx].prop.sex);
        let nodePass = this.imgPass[TableInfo.realIdx[data.idx]];
        nodePass.active = true;
        // nodePass.scale = 0;
        // nodePass.runAction(cc.scaleTo(0.2, 1));


        let sex = TableInfo.players[data.idx].prop.sex == "male" ? 'c1' : 'g_c1';
        let rom = Math.ceil(Math.random() * 3);
        let audio = sex + '_PASS' + rom + '.mp3';
        this.playManageAudio(audio);
    }

    /**坐下桌子 */
    seatDown(e, v) {
        // CS_SEAT_DOWN
        let realIdx = parseInt(v);
        let idx = TableInfo.realIdx.findIndex(a => a == realIdx);
        Connector.gameMessage(ROUTE.CS_SEAT_DOWN, { idx });
    }

    initGame(data) {
        this.initDesk();

        this.scoreCardContent.node.active = true;
        this.groupScore.active = TableInfo.options.gameType == GameConfig.GameType.WSK;

        this.myGroup.string = '0';
        this.otherGroup.string = '0';

        TableInfo.status = GameConfig.GameStatus.START;

        this.players.forEach((playerInfo, i) => {
            playerInfo.activeReady(false);
            //更新剩余牌数

            playerInfo.changeCardCount(data.hands.length);
        });
        TableInfo.baodan = new Array(TableInfo.options.rules.person).fill(false);
        TableInfo.zhuang = data.banker;
        TableInfo.firstPlay = true;
        TableInfo.current = null;
        TableInfo.outCards = [];
        this.exitBtnStatus();
        this.setTurn(data);
        this.startAutoBtn.active = true && TableInfo.options.rules.auto > 0;
        // if (!GameUtils.isNullOrEmpty(data.shuffle)) {
        //     this.cutCount = 0;
        //     this.cutIdx = [];
        //     this.shuffleData = data;
        //     data.shuffle.forEach((e) => {
        //         if (e.shuffle) {
        //             this.cutCount++;
        //             this.cutIdx.push(e.idx)
        //         }
        //         let idx = TableInfo.realIdx[e.idx];
        //         // this.players[idx].setScore(e.wallet);
        //     })
        //     this.handleShuffle();

        // } else {
        //初始化玩家手牌

        this.teamHands.handsCard = data.teammateHands ? data.teammateHands : new Array(data.hands.length || data.hands).fill(-1);
        this.initHands(data, true);
        // }
    }

    handleShuffle() {
        if (this.cutCount > 0) {
            this._delayTime = 100;
            let nodeAnimation = new cc.Node();
            nodeAnimation.parent = this.node;
            nodeAnimation.addComponent(sp.Skeleton);
            let ani = nodeAnimation.getComponent(sp.Skeleton);
            ani.skeletonData = this.cutAnim;
            ani.premultipliedAlpha = false
            ani.setAnimation(1, "idle", false)
            this.cutTips.active = true;
            let idx = this.cutIdx.shift();
            this.cutTips.getChildByName("name").getComponent(cc.Label).string = "" + TableInfo.players[idx].prop.name + "正在洗牌";
            if (ani) {
                // 注册动画的结束回调
                ani.setCompleteListener((trackEntry, loopCount) => {
                    nodeAnimation.destroy();
                    this.cutTips.active = false;
                    this.cutCount--;
                    this.handleShuffle();
                });
            }
        } else {
            this.initHands(this.shuffleData, true);
        }
    }

    /**初始化桌子 */
    initTable(data) {
        console.log('路由信息---initTable', data)
        TableInfo.observers = data.observers;
        let windowNode = cc.find("Canvas")
        TableInfo.zhuang = data.banker;
        TableInfo.firstPlay = false;
        TableInfo.status = data.status;
        this.exitBtnStatus();
        TableInfo.idx = data.idx;
        data.options.rules['showRemainingCards'] = true;
        TableInfo.options = data.options;
        TableInfo.config = data.rule;
        TableInfo.current = data.currentCard;

        //要不起按钮显示
        this.btnPass.active = data.options.gameType == GameConfig.GameType.WSK;
        this.btnChat.active = data.options.gameType == GameConfig.GameType.WSK;
        //初始化逻辑规则
        this.calc = new Calc(data.options.rules, data.options.gameType);
        this.layerHandCards.logic = this.calc;

        this.wskGameChat.active = data.options.gameType == GameConfig.GameType.WSK;

        //显示游戏 类型 公会

        this.lblBase.string = '' + data.options.rules.base;
        if (data.options.rules.baseCredit) {
            this.lblBaseCredit.node.parent.active = true;
            this.lblBaseCredit.string = '' + data.options.rules.baseCredit;
        } else {
            this.lblBaseCredit.node.parent.active = false;
        }
        this.lblRoomId.string = '' + data.tableID;

        //TODO 设置位置
        let idx = Math.max(data.idx, 0);
        //设置玩家座位位置方位
        if (TableInfo.options.rules.person == 4) {
            this.realIdx = [0, 0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 4] = 1;
            this.realIdx[(idx + 2) % 4] = 2;
            this.realIdx[(idx + 3) % 4] = 3;
        } else if (TableInfo.options.rules.person == 3) {
            this.realIdx = [0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 3] = 1;
            this.realIdx[(idx + 2) % 3] = 2;
        } else {
            this.realIdx = [0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 2] = 2;
        }
        TableInfo.realIdx = this.realIdx;

        //建立玩家数据数组
        if (!GameUtils.isNullOrEmpty(this.players)) {
            this.players.forEach((player) => {
                player.removePlayer();
            })
        }

        //初始化语音开黑
        if (data.options.gameType == 'WSK' && data.idx != -1)
            this.initVoice();
        this.setTurn(data);

        this.initPlayers(data);

        //隐藏托管
        this.changeAutoBtn(false)

    }


    /**初始化玩家 */
    initPlayers(data) {
        this.players = new Array(TableInfo.options.rules.person);
        TableInfo.players = data.players;
        data.players.forEach((player, i) => {
            let idx = TableInfo.realIdx[player.idx];
            let nodePlayer = cc.instantiate(this.playerItem);
            this.seatBtnContent.getChildByName('seat' + idx).active = GameUtils.isNullOrEmpty(player.prop) && data.idx == -1;
            nodePlayer.parent = this.bgTable;
            let playerInfo = nodePlayer.getComponent(PokerPlayer);
            playerInfo.init(player, i);
            this.players[idx] = playerInfo;
            if (TableInfo.idx == player.idx && (TableInfo.status == GameConfig.GameStatus.WAIT || TableInfo.status == GameConfig.GameStatus.SUMMARY))
                this.readyBtnStatus(!player.ready)
            if (TableInfo.idx == player.idx)
                this.changeAutoState(player)
        });
    }

    /**换位置 */
    resetPlayers(data) {
        if ((data.group[0] == data.group[1]) || (Math.abs(data.group[1] - data.group[0]) == 2))
            return;
        TableInfo.players.forEach((p, i) => p.idx = data.playerIDX[i]);
        TableInfo.idx = TableInfo.players[TableInfo.idx].idx;
        TableInfo.players.sort((a, b) => a.idx - b.idx);
        this.resetRealIdx(TableInfo.idx);
        // this.players.forEach(node => node.removePlayer());
        this._delayTime = 10
        setTimeout(() => {
            TableInfo.players.forEach((player, i) => {
                // let nodePlayer = cc.instantiate(this.playerItem);
                // nodePlayer.parent = this.bgTable;
                // let playerInfo = nodePlayer.getComponent(PokerPlayer);
                // playerInfo.init(player, i);
                this.players[TableInfo.realIdx[i]].init(player, i);
            });
        }, 1000)

    }

    resetRealIdx(idx) {
        let realIdx = [0, 0, 0, 0];
        realIdx[idx] = 0;
        realIdx[(idx + 1) % 4] = 1;
        realIdx[(idx + 2) % 4] = 2;
        realIdx[(idx + 3) % 4] = 3;
        TableInfo.realIdx = realIdx;
    }

    leavePlayer(idx) {
        this.node.removeAllChildren();
        Connector.disconnect();
    }

    refreshMenuActive() {

        this.startAutoBtn.active = TableInfo.options.rules.auto > 0;//TableInfo.idx >= 0;
        if (TableInfo.options.club.isLeague) {
            this.btnDisband.active =false //TableInfo.idx >= 0 && TableInfo.options.rules.disband == 0;
        } else {
            this.btnDisband.active = TableInfo.idx >= 0;
        }
    }

    /**重连 */
    resume(data) {
        this.summaryHands.forEach(s => s && s.reset());

        TableInfo.cardRecord = data.playRecords;
        this.initTable(data);
        if (!GameUtils.isNullOrEmpty(data.drops)) {
            TableInfo.outCards = TableInfo.outCards.concat(data.drops);
        }
        if (data.disband && data.disband.status == 'VOTE')
            this.showVotePop(data.disband)
        // setTimeout(() => {
        //     Connector._queueGameMsg.push({ route: 'SC_ROUND_SUMMARY', data: {"round":1,"players":[{"userID":84799100,"idx":0,"rank":0,"hands":[103,203,204,304,305,106,406,107,307,208,110,410,410,111,112,212,412,213,313,413,413,114,214,414,116,316,316],"scores":{"credit":0,"turn":0,"rank":0,"base":0,"ggdc":0,"score":0},"total":0},{"userID":90139782,"idx":1,"rank":1,"hands":[203,403,104,204,105,205,305,405,107,307,108,308,109,209,309,211,211,311,311,411,312,113,113,213,314,414,117],"scores":{"credit":0,"turn":0,"rank":0,"base":0,"ggdc":0,"score":0},"total":0},{"userID":57907326,"idx":2,"rank":2,"hands":[103,404,105,205,206,206,306,406,407,108,208,109,309,409,409,210,210,310,212,312,214,314,216,216,416,416,117],"scores":{"credit":0,"turn":0,"rank":0,"base":0,"ggdc":0,"score":0},"total":0},{"userID":78660635,"idx":3,"rank":3,"hands":[303,303,403,104,304,404,405,106,306,207,207,407,308,408,408,209,110,310,111,411,112,412,313,114,116,118,118],"scores":{"credit":0,"turn":0,"rank":0,"base":0,"ggdc":0,"score":0},"total":0}],"status":"WAIT","clock":1651504761007,"ach":[{"win":0,"first":0,"tail":0,"total":0},{"win":0,"first":0,"tail":0,"total":0},{"win":0,"first":0,"tail":0,"total":0},{"win":0,"first":0,"tail":0,"total":0}],"disband":true} })
        // }, 500);
        this.refreshMenuActive();
        if (data.status == GameConfig.GameStatus.WAIT || data.status == GameConfig.GameStatus.PREPARE || data.status == GameConfig.GameStatus.SUMMARY) {
            this.myGroup.string = '0';
            this.otherGroup.string = '0';
            return;
        }
        this.scoreCardContent.node.active = true;

        this.readyBtnStatus(false);
        this.groupScore.active = TableInfo.options.gameType == GameConfig.GameType.WSK;

        if (TableInfo.options.gameType == GameConfig.GameType.WSK && data.groupScore) {
            let idx = Math.max(TableInfo.idx, 0);
            this.myGroup.string = data.groupScore[idx % 2];
            this.otherGroup.string = data.groupScore[(idx + 1) % 2];
        }
        if (TableInfo.idx >= 0)
            this.teamHands.handsCard = data.teammateHands;

        data.players.forEach((player) => {
            this.players[TableInfo.realIdx[player.idx]].activeAutoPlay(player.auto);
            //隐藏准备按钮
            this.players[TableInfo.realIdx[player.idx]].activeReady(false);

            if (TableInfo.realIdx[player.idx] == 2)
                this.teamHands.handsCard = data.teammateHands ? data.teammateHands : new Array(player.hands).fill(-1);


            if (player.rank != -1) {
                if (player.idx == TableInfo.idx)
                    TableInfo.status = GameConfig.GameStatus.FINISH;
                this.players[TableInfo.realIdx[player.idx]].finishAnim(player.rank, true);
                // TableInfo.players[TableInfo.realIdx[player.idx]].rank = player.rank;
            }

            if (TableInfo.idx == player.idx)
                this.changeAutoState(player)
            if (player.hands == 1) {
                TableInfo.baodan[player.idx] = true;
                this.players[TableInfo.realIdx[player.idx]].activeBaodan(true);
            }
            if (player.historyCard != null) {
                this.showPlayCards(player.historyCard, false);
            }
            if (data.currentCard != null && player.idx == data.currentCard.idx) {
                this.showPlayCards(data.currentCard, false);
            }
        });
        // TableInfo.creditCards = data.creditPool;
        if (TableInfo.idx < 0) {
            data.hands = data.players[0].hands;
        }

        this.initHands(data, false);

        let playCardData = {
            idx: data.currentIDX,
            clock: data.clock,//new Date().getTime() + 26 * 1000
            playRecords: data.playRecords
        }

        this.playCard(playCardData);

    }
    /**炸弹加分 */
    scoreFly(data) {

        data.players.sort((a, b) => a.idx - b.idx);

        //出牌区归零
        this.dropCards.forEach((ground, i) => {
            ground.removeAllChildren(true);
            //牌的类型 归零
            this.bgCount[i].removeAllChildren(true);
            //隐藏要不起
            this.imgPass[i].active = false;
        });
        //玩家自身无能出的牌 提示 隐藏
        this.sprDisnable.active = false;
        let person = data.from.length;
        //播放加金币音效
        let url = cc.url.raw(`resources/Audio/Common/addScore.mp3`);
        AudioCtrl.getInstance().playSFX(url);
        let spawn = [];
        let playPos = [
            cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen, -240 + 30),
            cc.v2(cc.winSize.width / 2 - 139 / 2 - GameConfig.FitScreen, 35 + 30),
            cc.v2(-350, cc.winSize.height / 2 - 40),
            cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen, 35 + 30)
        ]
        //结束点位置
        let endPos = playPos[TableInfo.realIdx[data.to[0]]];

        //分数显示
        this.players[TableInfo.realIdx[data.to[0]]].showBombScores(TableInfo.realIdx[data.to[0]], data.players[data.to[0]].total, data.players[data.to[0]].score, () => {
            for (let i = 0; i < 20; i++) {
                let nodeCoin = cc.instantiate(this.preCoin);
                nodeCoin.parent = this.node;
                nodeCoin.setPosition(playPos[TableInfo.realIdx[data.from[i % person]]]);
                let pos = cc.v2(Math.random() * 100 - 50, Math.random() * 100 - 50);
                spawn.push(cc.targetedAction(nodeCoin,
                    cc.sequence(
                        cc.delayTime(0.1 * Math.random()),
                        cc.spawn(
                            cc.moveBy(0.3, pos),
                            cc.scaleTo(0.3, 0.7)
                        ),
                        cc.moveTo(0.4, endPos),
                        cc.callFunc(function () {
                            this.destroy();
                        }, nodeCoin)
                    )
                ));
            }
            //分数隐藏后飘金币动画
            this.node.runAction(cc.spawn(spawn));
        });
        data.from.forEach((f, i) => {
            this.players[TableInfo.realIdx[f]].showBombScores(TableInfo.realIdx[f], data.players[f].total, data.players[f].score);
        });

    }

    finish(data) {
        this.dropCards.forEach((ground, i) => {
            ground.destroyAllChildren(true);
            this.bgCount[i].destroyAllChildren(true);
            this.imgPass[i].active = false;
        });
        this.sprDisnable.active = false;
        TableInfo.current = null;
        this.currentScore.reset();
        this.updateWSKScore();

        if (TableInfo.options.gameType == GameConfig.GameType.WSK && data.groupScore) {
            let idx = Math.max(TableInfo.idx, 0);
            this.myGroup.string = data.groupScore[idx % 2];
            this.otherGroup.string = data.groupScore[(idx + 1) % 2];
        }

        //已经出完  取消报单
        TableInfo.baodan[data.idx] = false;

        data.players.forEach((score, idx) => {
            this.players[TableInfo.realIdx[idx]].setZhuaScore(score);

        })
    }


    resetCards() {  //重选按钮
        this.layerHandCards.nodeCards.forEach(card => {
            let bgCardMask = card.getChildByName("bgCardMask");
            bgCardMask.active = false;
            card._prior = false;
            card.isZhankai = false;
            card.setPosition(card.pos0);
        });
        this.btnPlayCards.getComponent(cc.Button).interactable = false;
    }

    initHands(data, anim) {
        let hands = data.hands;
        if (TableInfo.idx < 0) {
            hands = new Array(data.hands).fill(-1);
        }
        hands.sort((a, b) => b % 100 - a % 100);
        this.hands = hands;
        this.hands.reverse();
        // this.layerHandCards.refreshHandCards(this.hands, bool);
        this.layerHandCards.cutCards(this.hands, anim);
        this.scoreCardContent.renderUI(hands, data.teammateHands || []);

        this.currentScore.renderUI(data.creditPool);
        this.updateWSKScore(data.creditPool);

        if (!anim) return;
        this.cutCards(this.hands);

        if (data.sign) {
            TableInfo.players[data.sign.idx]['sign'] = data.sign.card;
            this.players[TableInfo.realIdx[data.sign.idx]].zhuaCardAnim(data.sign.card)
        }

    }

    cutCards(data) {
        this._delayTime = 100;
        let pos = [
            cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen, -240 + 30),
            cc.v2(cc.winSize.width / 2 - 139 / 2 - GameConfig.FitScreen, 35 + 30),
            cc.v2(-350, cc.winSize.height / 2 - 40),
            cc.v2(-cc.winSize.width / 2 + 139 / 2 + GameConfig.FitScreen, 35 + 30)
        ];
        let nodeShowCard = [];
        let nodeMyCard = [];
        let seq = [];
        let spawn = [];
        let dealSpawn = [];
        let handsSeq = [];
        let url = cc.url.raw(`resources/Audio/Common/deal07.mp3`);
        let middle = Math.ceil(data.length / 2);
        for (let i = 0; i < data.length * (TableInfo.options.rules.person - 1); i++) {
            let node = cc.instantiate(this.nodeBack);
            node.parent = this.bgNode.node;
            node.setPosition(0, 0);
            nodeShowCard.push(node);
        }
        for (let i = 0; i < data.length; i++) {
            let node = cc.instantiate(this.nodeBack);
            node.parent = this.bgNode.node;
            node.setPosition(0, 0);
            nodeMyCard.push(node);
        }
        let dealSpawn1 = [], dealSpawn2 = [];
        nodeShowCard.forEach((back, i) => {
            dealSpawn1.push(cc.targetedAction(back,
                cc.sequence(
                    cc.delayTime(0.02 * i % 3),
                    cc.spawn(
                        cc.rotateBy(0.3, 180),
                        cc.scaleTo(0.3, 1),
                        cc.moveTo(0.6, pos[i % (TableInfo.options.rules.person - 1)]),
                        cc.sequence(
                            cc.delayTime(0.4),
                            cc.fadeOut(0.2)
                        )
                    ),
                    cc.delayTime(0.2),
                    cc.callFunc(function () {
                        this.destroy();
                    }, back)
                )));
        });
        nodeMyCard.forEach((back, i) => {
            dealSpawn2.push(cc.targetedAction(back,
                cc.sequence(
                    cc.delayTime(0.02 * i % 3),
                    cc.spawn(
                        cc.rotateBy(0.3, 180),
                        cc.scaleTo(0.3, 1),
                        cc.moveTo(0.6, -273 + (8 - middle + i) * 40, 80),
                        cc.callFunc(() => {
                            if (i % 9 == 0)
                                AudioCtrl.getInstance().playSFX(url);
                        }),
                        cc.sequence(
                            cc.delayTime(0.4),
                            cc.fadeOut(0.2)
                        )
                    ),
                    cc.callFunc(function () {
                        this.destroy();
                    }, back)
                )));
        });

        spawn.push(cc.spawn(dealSpawn1));
        spawn.push(cc.spawn(dealSpawn2));
        spawn.push(cc.spawn(handsSeq));
        seq.push(cc.spawn(spawn));
        seq.push(cc.callFunc(() => {
            this._delayTime = 3;
        }));
        try {
            this.node.runAction(cc.sequence(seq));
        } catch (ex) {
            nodeMyCard.forEach(e => {
                e.destroy();
            })
            nodeShowCard.forEach(e => {
                e.destroy();
            })
            cards.nodeCards.forEach((card, x) => {
                card.active = true;
                if (card)
                    card.opacity = 255;
            });
            this._delayTime = 3;
        }
    }

    passCard(data) {
        Connector.gameMessage(ROUTE.CS_PLAY_CARD, []);
        this.resetCards();
    }

    playCard(data) {
        TableInfo.cardRecord = data.playRecords;
        TableInfo.currentPlayer = data.idx;
        let idx = data.idx;
        let realIdx = TableInfo.realIdx[idx];
        this.dropCards[realIdx].destroyAllChildren();
        this.bgCount[realIdx].destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this.showPlayCardLight(idx);
        if (TableInfo.firstPlay) {
            this.players[TableInfo.realIdx[idx]].activeBanker(true);
        }
        //TODO 倒计时
        let time = Math.max((data.clock - GameUtils.getTimeStamp()) / 1000, 0);
        this.players[TableInfo.realIdx[idx]].showClock(time);
        if (idx == TableInfo.idx) {
            this.layerHandCards.checkCurrent();
            this.changeBtn(true);
            if (TableInfo.options.gameType == GameConfig.GameType.WSK) {
                let hasGrater = this.layerHandCards.hasGrater;
                this.btnPlayCards.active = hasGrater;
                this.btnTips.active = hasGrater && TableInfo.current != null;
                this.sprDisnable.active = !hasGrater;
                this.btnNoGrater.active = !hasGrater;
                this.btnPass.active = hasGrater && TableInfo.current != null;
            } else {
                this.btnTips.active = TableInfo.current != null;
                this.btnTips.getComponent(cc.Button).interactable = TableInfo.current != null;
            }
            this.btnTips.tipsTime = 0;
        }
        TableInfo.firstPlay = false;
    }


    acChupai() {   //出牌按钮
        if (this.btnPlayCards._last == null)
            this.btnPlayCards._last = 0;
        if (new Date().getTime() - this.btnPlayCards._last < 1000)
            return;
        this.btnPlayCards._last = new Date().getTime();
        let emp = JSON.parse(JSON.stringify(TableInfo.select));
        Connector.gameMessage(ROUTE.CS_PLAY_CARD, emp.cards, true);
    }

    // continueGame(e) {
    //     TableInfo.shuffle = e.data.cut;
    //     // if (GameConfig.GameCurrentScore <  TableInfo.options.lower) {
    //     this.initDesk();
    //     Connector.gameMessage(ROUTE.CS_GAME_READY, { plus: false, shuffle: TableInfo.shuffle });
    // },
    normalReady() {
        this.initDesk();
        Connector.gameMessage(ROUTE.CS_GAME_READY, { plus: false });
    }

    initDesk(index = 0) {  //继续游戏初始化桌子
        this.sprDisnable.active = false;
        this.currentScore.reset();
        this.updateWSKScore();
        this.summaryHands.forEach(s => s && s.reset());
        this.myGroup.string = '0';
        this.otherGroup.string = '0';
        //移除结算界面
        if (this.summary) {
            this.summary.remove();
        }
        this.players.forEach((player) => {
            player.resetPlayer();
        });
        this.teamHands.reset();
        this.layerHandCards.reset();
        this.dropCards.forEach((ground, i) => {
            ground.destroyAllChildren();
            this.bgCount[i].destroyAllChildren();
            this.imgPass[i].active = false;
        });
    }
    acBaodan(data) {
        let sex = TableInfo.players[data.idx].prop.sex == 'male' ? 'c1' : 'g_c1';
        Cache.playSound(`${sex}_baodan`);
        TableInfo.baodan[data.idx] = true;
        this.players[TableInfo.realIdx[data.idx]].activeBaodan(true);
    }

    refreshTableScore(data) {
        this.currentScore.renderUI(data.creditPool);
        this.updateWSKScore(data.creditPool);
    }

    showPlayCards(group, score = true) {
        this.summaryHands.forEach(s => s && s.reset());

        let cardType = ["", "", "", "", "", "五连顺", "六连顺", "七连顺", "八连顺", "九连顺", "十连顺", "十一连顺", "十二连顺",];
        //刷新当前分数
        this.refreshTableScore(group);

        //隐藏出牌按钮
        this.changeBtn(false);
        //当前出牌数据
        TableInfo.current = group;
        this._delayTime = 7;
        //隐藏出牌者出牌提示
        let idx = TableInfo.realIdx[group.idx];
        this.players[idx].activeOffline(false);
        this.players[idx].activeAutoPlay(group.auto);
        this.players[idx].playCardLight(false);
        this.players[idx].hideClock();
        this.players[idx].changeCardCount(group.hands);

        if (idx == 2 && TableInfo.idx < 0)
            this.teamHands.handsCard = new Array(group.hands).fill(-1);

        if (score) {
            TableInfo.outCards = TableInfo.outCards.concat(group.cards);
            this.scoreCardContent.renderUI(this.layerHandCards.handsCard, this.teamHands.handsCard || []);
        }

        if (TableInfo.idx == group.idx)
            this.changeAutoState(group)
        //  播放出牌动画
        let url = cc.url.raw(`resources/Audio/Common/playCard.mp3`);
        AudioCtrl.getInstance().playSFX(url);
        //  出牌者位置下标
        let realIdx = TableInfo.realIdx[group.idx];
        //清除出牌区
        if (this.dropCards[realIdx].children.length > 0) {
            this.dropCards[realIdx].destroyAllChildren();
            this.bgCount[realIdx].destroyAllChildren();
        }
        //玩家自身无能出的牌 提示 隐藏
        this.sprDisnable.active = false;
        // 判断出牌类型
        let idxType;
        let audioType = '';
        let imgType = -1;
        switch (group.type) {
            case "BOMB":
                idxType = 0;
                imgType = 3;
                audioType = '_' + group.cards.length + '_' + group.cards[0] % 100;
                Cache.playSound('wsk_bomb');

                break
            case "LIANDUI":
                idxType = 1;
                imgType = 4;

                break
            case "SHUN":
                //显示牌类型
                let type = cc.instantiate(this.preType);
                type.parent = this.bgCount[realIdx];
                let numCard = group.cards.length;
                idxType = 2;
                type.getComponent("cc.Label").string = cardType[numCard];
                break
            case "FEIJI":
                imgType = 2;
                idxType = realIdx != 0 ? 4 : 3;

                break;
            case 'DAN':

                audioType = '_' + group.cards.length + '_' + group.cards[0] % 100
                break;
            case 'SAN':
                if (group.count > 1) {
                    imgType = 2;
                    audioType = '_FEIJI';
                    Cache.playSound('wsk_feiji');

                } else {
                    imgType = 1;
                    audioType = '_SAN_1_' + group.cards[0] % 100;
                }
                break;
            case 'DUI':
                imgType = group.count > 1 ? 4 : 0;

                if (group.count > 3) { //四连对
                    audioType = '_LIANDUI';
                } else {
                    audioType = '_DUI_' + group.count + '_' + group.cards[0] % 100;
                }
                break;
            case 'ZWSK':
                imgType = 7;
                audioType = '_' + Math.floor(group.cards[0] / 100) + '_510k';
                Cache.playSound('wsk_bomb');
                break;
            case 'WSK':
                imgType = 6;
                audioType = '_510k';
                Cache.playSound('wsk_bomb');
                break;
            case 'KING':
                imgType = 3;
                audioType = '_KING';
                Cache.playSound('wsk_bomb');
                break;
            case 'LTWSK':
                imgType = 5;
                audioType = '_liti510k';
                Cache.playSound('wsk_bomb');
                break;
            default:
                break;
        }
        //  播放出牌种类特效
        if (imgType != -1) {
            // if (!GameUtils.isNullOrEmpty(idxType)) {

            // let nodeAnimation = cc.instantiate(this.aniNode);

            // nodeAnimation.parent = this.bgCount[realIdx].node;

            // nodeAnimation.addComponent(sp.Skeleton);

            // let ani = nodeAnimation.getComponent(sp.Skeleton);

            // ani.skeletonData = this.pokerSkeleton[idxType];
            // ani.premultipliedAlpha = false
            // ani.setAnimation(1, "animation", false)
            // this.playManageAudio(`texiao_${idxType}.mp3`);


            let nodeAnim = cc.instantiate(this.nodeAnim);
            nodeAnim.getChildByName('img').getComponent(cc.Sprite).spriteFrame = this.cardTypeSf[imgType];
            // nodeAnim.sizeMode=cc.Sprite.SizeMode.TRIMMED;
            nodeAnim.position = cc.v2(0, 50);
            nodeAnim.scale = 0;
            let ap = cc.scaleTo(0.5, 1).easing(cc.easeBackOut(3.0));
            let bp = cc.sequence(ap, cc.delayTime(0.3), cc.removeSelf())
            this.node.addChild(nodeAnim);
            // this.bgCount[realIdx].addChild(nodeAnim);
            nodeAnim.active = true;
            nodeAnim.runAction(bp);


        }


        let sex = TableInfo.players[group.idx].prop.sex == "male" ? 'c1' : 'g_c1';
        let audio = sex + audioType + '.mp3';

        this.playManageAudio(audio)

        // let audioCtr = this.bgTable.getComponent("BgTableAudioCtr07");
        // audioCtr.playVoice(group, TableInfo.players[group.idx].prop.sex);
        //移除手牌
        this.removeHands(group);
        //显示出牌
        let nodePlayCards = cc.instantiate(this.prePlayCards);
        nodePlayCards.scale = 1;
        nodePlayCards.parent = this.dropCards[realIdx];
        let empGroup = JSON.parse(JSON.stringify(group));
        nodePlayCards.getComponent(PokerPlayCard).init(empGroup);
    }

    removeHands(data) {
        let realIdx = TableInfo.realIdx[data.idx];
        if (realIdx == 0) {
            let cards = data.cards.slice();
            if (TableInfo.idx < 0) {
                cards = cards.map(c => -1);
            }
            cards.forEach(card => {
                for (let x = 0; x < this.hands.length; x++) {
                    let idx = this.hands.findIndex(c => card == c);
                    if (idx >= 0) {
                        this.hands.splice(idx, 1);
                        return;
                    }
                }
            });
            this.layerHandCards.handsCard = this.hands;
        }
    }

    roundSummary(data) {
        this.changeBtn(false);

        //删除提示牌
        if (this.tipsCardPrefab) this.tipsCardPrefab.removeCards()
        this.dropCards.forEach((ground, i) => {
            ground.destroyAllChildren();
            this.bgCount[i].destroyAllChildren();
            this.imgPass[i].active = false;
        });
        TableInfo.zhuang = null;
        TableInfo.baodan = new Array(TableInfo.options.rules.person).fill(false);
        TableInfo.status = data.status;
        this.exitBtnStatus();
        if (data.winner == TableInfo.idx) {
            this.playManageAudio(`audio_win.mp3`);
        } else {
            this.playManageAudio(`audio_lose.mp3`);
        }
        let delayTime = 0.5;
        if (!GameUtils.isNullOrEmpty(data.extractCards)) {
            delayTime = 1.5;
            this.randomContent.removeAllChildren();
            data.extractCards.forEach((card) => {
                let randomItem = cc.instantiate(this.zhuaCardPre);
                randomItem.getComponent(PokerSelfCard).init(card);
                randomItem.scale = 0.5;
                this.randomContent.addChild(randomItem);
            })
            this.randomNode.active = true;
        }
        this.teamHands.reset();
        data.players.forEach((player, i) => {
            let idx = TableInfo.realIdx[player.idx]
            /** 自己的不用显示 */
            if (idx == 0) return;
            this.summaryHands[idx].idx = idx;
            this.summaryHands[idx].type = 'summaryHands';
            this.summaryHands[idx].handsCard = player.hands;
            delayTime = 1.5;
            // let nodePlayCards = cc.instantiate(this.prePlayCards);
            // nodePlayCards.scale = 1;
            // nodePlayCards.parent = this.dropCards[idx];
            // if (player.hands.length > 0) {
            //     delayTime = 1.5;
            // }
            // if (idx == 1) {
            //     nodePlayCards.y -= 150;
            // }
            // let empGroup = player.hands.slice();
            // nodePlayCards.getComponent(PokerPlayCard).initRemainCard(empGroup);
        });
        if (data.vote?.type == 'auto') {
            delayTime = 0;
        }
        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(() => {
                if (cc.find('Canvas/WSKSummry'))
                    cc.find('Canvas/WSKSummry').destroy();
                this.randomContent.removeAllChildren();
                this.randomNode.active = false;
                if (data.disband) {
                    let node = cc.instantiate(this.pokerSummaryFour);
                    node.getComponent('PokerSummaryFour').renderUI(data.ach);
                    this.node.addChild(node);
                } else {
                    let summary = cc.instantiate(this.summaryPrefab);
                    this.summary = summary.getComponent(WSKSummary).initData(data);
                    this.node.addChild(summary);
                }
                data.players.forEach((player, i) => {
                    let idx = TableInfo.realIdx[player.idx]
                    // this.players[idx].resetPlayer();
                    // if (!GameUtils.isNullOrEmpty(data.ach)) {
                    //     this.players[idx].setScore(0);
                    // } else {
                    this.players[idx].setScore(player.total);
                    // }
                    this.players[idx].setZhuaScore(player.scores.credit);
                });
            })
        ));
    }

    vote() {
        App.confirmPop("是否解散房间", () => {
            Connector.gameMessage(ROUTE.CS_GAME_VOTE, { agree: true });
        });
    }

    backHall() {
        this.onLeaveChannel()
        GameConfig.ShowTablePop = true;
        Cache.showMask("正在返回大厅...请稍后");
        Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
    }

    restartGame() {
        AudioCtrl.getInstance().stopAll();
        cc.game.restart();
    }

    changeStatus(data) {
        let idx = TableInfo.realIdx[data.idx];
        let playerInfo = this.players[idx].activeOffline(data.offline);
    }

    changeReady(data) {
        if (TableInfo.idx == data.idx) {
            this.readyBtnStatus(false);
        }
        this.players[TableInfo.realIdx[data.idx]].activeReady(true);
        this.players[TableInfo.realIdx[data.idx]].activeNiao(data);
    }
    showPlayCardLight(idx) {
        this.players.forEach(node => node.playCardLight(false));
        this.players[TableInfo.realIdx[idx]].playCardLight(true);
    }

    setTurn(data) {

        TableInfo.ruleDesc = TableInfo.options.gameType == GameConfig.GameType.WSK ? GameUtils.getChineseRuleWSK(TableInfo.config) : GameUtils.getChineseRuleWSKBD(TableInfo.config);
        this.lblRule.string = TableInfo.ruleDesc[0] + '\n' + TableInfo.ruleDesc[1].join(' || ')

        this.bgNode.node.getChildByName('line1').children.forEach((e) => {
            if (e.name.indexOf('ggdc') != -1)
                return;
            if (e.name == 'tail') {
                e.active = !TableInfo.config[e.name]
            } else {
                e.active = TableInfo.config[e.name]
            }
        })
        this.bgNode.node.getChildByName('line2').children.forEach((e) => {
            e.active = TableInfo.config[e.name]
        })

        this.bgNode.node.getChildByName('' + TableInfo.options.gameType).active = true;
        if (TableInfo.config.ggdc) {
            this.bgNode.node.getChildByName('line1').getChildByName('ggdc' + Math.floor(TableInfo.config.ggdc)).active = true;
        } else {
            this.bgNode.node.getChildByName('line1').getChildByName('ggdc').active = TableInfo.options.gameType == GameConfig.GameType.WSK;

        }


        TableInfo.turn = data.round;
        this.lblTurn.string = data.round == 0 ? "" : data.round + '/' + TableInfo.config.turn + "局";
    }

    restart(data) {
        AudioCtrl.getInstance().stopAll();
        cc.game.restart();
    }

    /** 取消托管 */
    cancelAuto(data) {
        this.players[TableInfo.realIdx[data.idx]].activeAutoPlay(false);
        if (TableInfo.idx == data.idx) {
            this.changeAutoBtn(false)
        }
    }
    /**开始托管 */
    startAuto(data) {
        this.players[TableInfo.realIdx[data.idx]].activeAutoPlay(true);
        if (TableInfo.idx == data.idx) {
            this.changeAutoBtn(true)
        }
    }
    changeAutoBtn(bool) {
        this.startAutoBtn.active = !bool && TableInfo.options.rules.auto > 0;
        this.autoMask.active = bool;
        this.currentAutoStatus = bool;

    }
    changeAutoState(data) {
        this.players[TableInfo.realIdx[data.idx]].activeAutoPlay(false);
        if (TableInfo.idx == data.idx)
            this.changeAutoBtn(data.auto)
    }

    /**点击开始托管 */
    onStartAuto() {

        if (TableInfo.status != GameConfig.GameStatus.START) {
            return;
        }
        this.changeAutoBtn(true)

        Connector.gameMessage(ROUTE.CS_START_AUTO, {});
    }
    /**点击取消托管 */
    onCancelAuto() {
        this.changeAutoBtn(false)
        Connector.gameMessage(ROUTE.CS_CANCEL_AUTO, {});
    }

    /**显示提示牌 */
    showTipsCard(data) {
        this.tipsCardPrefab.refreshCard(data.cards);

    }
    /**返回大厅 */
    onClickExit() {

        if (TableInfo.status == GameConfig.GameStatus.START && TableInfo.idx >= 0) return;
        App.confirmPop("是否退出房间", () => {
            this.onLeaveChannel()
            Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
        }, () => {
        });

    }

    /**更新玩家距离 */
    updatePlayerDistance() {
        if (GameUtils.isNullOrEmpty(TableInfo.players[0]) || GameUtils.isNullOrEmpty(TableInfo.players[1])) {
            this.lblDistance.node.active = false;
            return;
        }
        this.lblDistance.node.active = true;
        if (this.checkLoc(TableInfo.players[0]) && this.checkLoc(TableInfo.players[1])) {
            this.lblDistance.string = "玩家距离: " + GameUtils.getDistance(TableInfo.players[0].location, TableInfo.players[1].location);
        } else {
            this.lblDistance.string = "玩家距离: 未知";
        }
    }
    checkLoc(data) {
        return data.prop != null && data.location != null && data.location.lat != 0 && data.location.long != 0;
    }

    readyBtnStatus(bool) {
        this.normalReadyBtn.active = bool;
    }

    changeBtn(boolean) {

        // this.btnPlayCards.active = boolean;//&& !this.currentAutoStatus;
        this.btnQuest.active = boolean;//&& !this.currentAutoStatus;
        // this.btnPass.active = boolean;//&& !this.currentAutoStatus;

        // this.btnTips.active = boolean;//&& !this.currentAutoStatus;

    }
    exitBtnStatus() {
        this.exitBtn.active = TableInfo.status == GameConfig.GameStatus.WAIT || TableInfo.idx < 0;

    }
    showRuleNode() {
        this.ruleContent.active = !this.ruleContent.active;
    }

    showScoreCardNode() {
        this.scoreCardContent.node.active = !this.scoreCardContent.node.active;
    }
    /**解散 */
    onQuickFinish() {
        if (this.quickFinished) return;
        Connector.gameMessage(ROUTE.CS_DISBAND, 'allow');
        // this.quickFinished = true;
        // App.confirmPop('是否结束本局游戏？', () => {
        //     Connector.gameMessage(ROUTE.CS_DISBAND, 'allow');
        //     this.quickFinished = false;

        // }, () => {
        //     this.quickFinished = false;
        // })
    }
    /**显示旁观者 */
    showObservers() {
        App.pop(GameConfig.pop.ObserversPop)
    }
    /**显示打牌记录 */
    showCardRecord() {
        App.pop(GameConfig.pop.CardRecordPop)
    }

    /**解散 */
    showVotePop(voteData) {
        App.pop(GameConfig.pop.GameVotePop, voteData);
    }

    updateWSKScore(creditPool = []) {
        let score = 0
        creditPool.forEach((card, i) => {
            if (card % 100 == 10 || card % 100 == 13)
                score += 10;
            if (card % 100 == 5)
                score += 5;
        });
        if (score == 0)
            score = ''
        this.lblCurrentScore.node.stopAllActions();
        this.lblCurrentScore.node.scale = 1;
        let ap = cc.scaleBy(0.3, 1.2);
        let bp = cc.scaleBy(0.3, 1);
        let cp = cc.sequence(ap, bp, cc.callFunc(() => {
            this.lblCurrentScore.string = '' + score;
        }))
        this.lblCurrentScore.node.runAction(cp);



    }
    onJoinChannelSuccess(channel, uid, elapsed) {
        this.joined = true;
        //开启其他人喇叭
        agora && agora.muteAllRemoteAudioStreams(false);
        //关掉自己麦克风
        agora && agora.muteLocalAudioStream(true);
        // agora && agora.adjustPlaybackSignalVolume(100);
        // agora && agora.adjustAudioMixingPlayoutVolume(100);
    }
    onLeaveChannel() {
        this.joined = false;
    }
    onUserMuteAudio(uid, muted) {
        let audioIndex = -1;
        TableInfo.players.forEach((player) => {
            if (player.prop?.pid == uid)
                audioIndex = player.idx;
        })
        if (audioIndex != -1) {
            this.players[TableInfo.realIdx[audioIndex]].otherIconChange(muted);
        }
    }
    sortHandsCard() {
        this.layerHandCards.sortCard();
    }
}


