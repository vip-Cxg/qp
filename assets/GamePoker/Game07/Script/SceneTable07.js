import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import AudioCtrl from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import { Social } from "../../../Main/Script/native-extend";
import DataBase from "../../../Main/Script/DataBase";
import PACK from "../../../Main/Script/PACK";
import ROUTE from "../../../Main/Script/ROUTE";
import TableInfo from "../../../Main/Script/TableInfo";
import BaseGame from "../../../script/base/BaseGame";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../../../script/ui/hall/data/App";

import poker from '../Script/Logic07';
import { isBuffer } from "util";
// let logic = require("Logic07");

const { ccclass, property } = cc._decorator
@ccclass
export default class SceneTable07 extends BaseGame {
    @property(cc.Prefab)
    prePlayerInfo = null;

    @property(cc.Label)
    lblRoomId = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Label)
    lblBase = null;
    @property(cc.Label)
    lblDistance = null;

    @property(cc.Node)
    layerHandCards = null;
    @property(cc.Node)
    btnTips = null;
    @property(cc.Node)
    btnPlayCards = null;
    @property([cc.Layout])
    dropCards = [];
    @property([cc.Layout])
    bgCount = [];
    @property([cc.Node])
    imgPass = [];
    @property(cc.Prefab)
    preCards = null;
    @property(cc.Prefab)
    preCoin = null;
    @property(cc.Node)
    normalReadyBtn = null;
    @property(cc.Node)
    bgTable = null;
    @property(cc.Node)
    sprDisnable = null;
    @property(cc.Prefab)
    preType = null;
    @property(cc.Prefab)
    summaryPrefab = null;
    @property(cc.Prefab)
    prePlayCards = null;
    @property([sp.SkeletonData])
    pokerSkeleton = [];
    @property(cc.Prefab)
    aniNode = null;
    @property(cc.Prefab)
    nodeBack = null;


    @property(cc.Node)
    startAutoBtn = null;
    @property(cc.Node)
    cancelAutoBtn = null;


    @property(cc.Node)
    autoMask = null;
    @property(cc.Node)
    exitBtn = null;
    @property(cc.Node)
    showCardContent1 = null;
    @property(cc.Node)
    showCardContent2 = null;

    @property(sp.SkeletonData)
    cutAnim = null;


    @property(cc.Sprite)
    bgNode = null;
    @property(cc.Node)
    cutTips = null;
    @property(cc.Node)
    seatBtnContent = null;

    @property(cc.Node)
    btnDisband = null;
    @property(cc.Node)
    ruleBtn = null;
    @property(cc.Label)
    lblRule = null;
    @property(cc.Node)
    ruleContent = null;


    _delayTime = 0;
    hands = [];
    nodePlayerInfo = [];
    currentAutoStatus = false;
    lastAutoTime = 0;


    // use this for initialization
    onLoad() {

        //换桌子背景
        // let indexBg = GameUtils.getValue(GameConfig.StorageKey.tableBgIndex, 0)
        // this.bgNode.spriteFrame = cc.gameConfig.tableBgSprite[indexBg];
        this.initChatContent();
        this.initGameBase();
        //添加监听事件
        this.addEvents();
        this.alReady = false;
        TableInfo.idx = -1;
        this.layerHandCards.getComponent("LayerHandsCards07").touchEvent();
        Connector.emit(PACK.CS_JOIN_DONE, {});
        // Connector.LogsClient(GameConfig.LogsEvents.SOCKET_LINK, { action: GameConfig.LogsActions.ENTER_SCENE, gamtype: "PDK_SOLO" });
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



        this.ruleBtn.on(cc.Node.EventType.TOUCH_START, this.showRuleNode, this);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.ruleContent.active = false;
        }, this)
        this.bgNode.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.layerHandCards.getComponent("LayerHandsCards07").resetHands();
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
        if (agora) {
            agora.off('leave-channel', this.onLeaveChannel, this);
            agora.off('join-channel-success', this.onJoinChannelSuccess, this);
            agora.off('user-mute-audio', this.onUserMuteAudio, this);
        }
        this.startAutoBtn.off(cc.Node.EventType.TOUCH_END, this.onStartAuto, this);
        this.cancelAutoBtn.off(cc.Node.EventType.TOUCH_END, this.onCancelAuto, this);
        this.exitBtn.off(cc.Node.EventType.TOUCH_END, this.onClickExit, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.PDK_CONTINUE_GAME, this.normalReady, this);

        // this.node.off(GameConfig.GameEventNames.PDK_BACK_HALL, this.backHall, this);

    }
    initChatContent() {
        this.node.on('chatAlready', () => {
            let windowNode = cc.find("Canvas")
            let data = {
                str: [
                    '我不来你们搞不好吧！噶事啦',
                    '是浪在搞啊蛮不好搞吧?',
                    '巧巧的母妈生巧巧，这都打的起',
                    '这个牌神仙都医不活哪',
                    '枪你这样滴日子，我一天都没过过',
                    '哎呀，饭都没吃就来了，好积极',
                    '实话实说？要搞收益啦',
                    '你跟我回克洗啦睡哦！',
                    '上家好精神呐！'
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
                // let a = { "idx": 0, "hands": [], "options": { "tableID": "365063", "clubID": 580479, "gameID": "TDG43CQH", "roomID": 8, "mode": "CUSTOM", "person": 2, "base": 2, "fee": 2, "lower": 50, "gameType": "PDK", "maxRound": 8, "clock": 30 }, "turn": 1, "round": 1, "status": "DESTORY", "players": [{ "prop": { "pid": 294643, "name": "辛勤招牌", "sex": "male", "head": "avatar/m/325.jpg", "cluster": [294643], "parent": 294643 }, "wallet": 1000, "location": { "lat": 27.37237464320103, "long": 112.04149989818204 }, "ip": "110.53.7.215", "idx": 0, "auto": false, "clock": 1641367986248, "offline": false, "ready": null, "total": 0, "hands": 0 }, { "prop": null, "wallet": null, "idx": 1, "auto": false, "clock": 1641367918762, "offline": false, "ready": null, "total": 0, "hands": 0 }], "disband": { "idx": -1, "last": 0, "clock": 0, "status": "EMPTY", "data": ["wait", "wait"] }, "gameID": "TDG43CQH", "tableID": "365063", "banker": 1, "records": [], "currentCard": null, "currentIDX": 0 }
                // console.log("--a-", a)
                // this.resume(a);
                this.resume(msg.data);
                break;
            //玩家进入房间
            case ROUTE.SC_JOIN_TABLE:
                this.initTable(msg.data);
                break;
            //重连
            case ROUTE.SC_RECONNECT:
                this.resume(msg.data);
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
                this.finish();
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
                this.destoryGame()
                break;
            case ROUTE.SC_DISBAND:
                this.showVotePop(msg.data)
                break;
            case ROUTE.SC_OBSERVER:
                TableInfo.observers = msg.data.observers;
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
        console.log("showPass", data);
        let realIdx = TableInfo.realIdx[data.idx];
        this.dropCards[realIdx].node.destroyAllChildren();
        this.bgCount[realIdx].node.destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this._delayTime = 5;
        this.changeBtn(false);
        //闹钟
        this.sprDisnable.active = data.idx == TableInfo.idx;
        // let voice = this.bgTable.getComponent("BgTableAudioCtr07");
        // voice.PassVoice(TableInfo.players[data.idx].prop.sex);

        let sex = TableInfo.players[data.idx].prop.sex == "male" ? 'c1' : 'g_c1';
        let rom = Math.ceil(Math.random() * 3);
        let audio = sex + '_PASS' + rom + '.mp3';
        this.playManageAudio(audio);


        let nodePass = this.imgPass[TableInfo.realIdx[data.idx]];
        nodePass.active = true;
        // nodePass.scale = 0;
        // nodePass.runAction(cc.scaleTo(0.2, 1));
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
        this.nodePlayerInfo.forEach((playerInfo, i) => {
            playerInfo.activeReady(false);
            //更新剩余牌数
            playerInfo.changeCardCount(TableInfo.config.cards);
        });
        TableInfo.baodan = TableInfo.options.rules.person == 2 ? [false, false] : [false, false, false];
        TableInfo.zhuang = data.banker;
        TableInfo.firstPlay = true;
        TableInfo.current = null;
        TableInfo.status = GameConfig.GameStatus.START;
        this.exitBtn.active = false;
        this.setTurn(data);
        this.startAutoBtn.active = true && TableInfo.options.rules.auto > 0;
        if (!GameUtils.isNullOrEmpty(data.shuffle)) {
            this.cutCount = 0;
            this.cutIdx = [];
            this.shuffleData = data;
            data.shuffle.forEach((e) => {
                if (e.shuffle) {
                    this.cutCount++;
                    this.cutIdx.push(e.idx)
                }
                let idx = TableInfo.realIdx[e.idx];
                // this.nodePlayerInfo[idx].setScore(e.wallet);
            })
            this.handleShuffle();

        } else {
            //初始化玩家手牌
            this.initHands(data, false);
        }
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
            this.initHands(this.shuffleData, false);
        }
    }

    /** 修改菜单栏按钮 active状态 */
    refreshMenuActive() {
        if (TableInfo.options.club.isLeague) {
            this.btnDisband.active = TableInfo.idx >= 0 && TableInfo.options.rules.disband == 0;
        } else {
            this.btnDisband.active = TableInfo.idx >= 0;
        }
    }

    /**初始化桌子 */
    initTable(data) {
        TableInfo.observers = data.observers;
        let windowNode = cc.find("Canvas");
        TableInfo.zhuang = data.banker;
        TableInfo.firstPlay = false;
        TableInfo.status = data.status;
        this.exitBtnStatus();
        TableInfo.idx = data.idx;
        TableInfo.options = data.options;
        TableInfo.config = data.rule;
        TableInfo.current = data.current;
        //显示游戏 类型 公会
        this.lblBase.string = '' + data.options.rules.base;
        this.lblRoomId.string = '' + data.tableID;
        this.refreshMenuActive();
        //TODO 设置位置
        let idx = Math.max(data.idx, 0);
        //设置玩家座位位置方位
        if (TableInfo.options.rules.person == 3) {
            this.realIdx = [0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 3] = 1;
            this.realIdx[(idx + 2) % 3] = 3;
        } else {
            this.realIdx = [0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 2] = 2;
        }
        TableInfo.realIdx = this.realIdx;

        //建立玩家数据数组
        if (!GameUtils.isNullOrEmpty(this.nodePlayerInfo)) {
            this.nodePlayerInfo.forEach((player) => {
                player.removePlayer();
            })
        }

        this.initVoice();

        this.setTurn(data);

        this.initPlayers(data);

        //隐藏托管
        this.changeAutoBtn(false)
    }


    /**初始化玩家 */
    initPlayers(data) {
        this.nodePlayerInfo = new Array(TableInfo.options.rules.person);
        TableInfo.players = data.players;
        data.players.forEach((player, i) => {
            let idx = TableInfo.realIdx[player.idx];
            let nodePlayer = cc.instantiate(this.prePlayerInfo);
            this.seatBtnContent.getChildByName('seat' + idx).active = GameUtils.isNullOrEmpty(player.prop) && data.idx == -1;
            nodePlayer.parent = this.bgTable;
            let playerInfo = nodePlayer.getComponent("ModulePlayerHead07");
            playerInfo.init(player, i);
            this.nodePlayerInfo[idx] = playerInfo;

            if (TableInfo.idx == player.idx && (TableInfo.status == GameConfig.GameStatus.WAIT || TableInfo.status == GameConfig.GameStatus.SUMMARY))
                this.readyBtnStatus(!player.ready)


            if (TableInfo.idx == player.idx)
                this.changeAutoState(player)
        });
    }

    leavePlayer(idx) {
        this.node.removeAllChildren();
        Connector.disconnect();
    }

    /**重连 */
    resume(data) {
        this.initTable(data);
        if (data.disband && data.disband.status == 'VOTE')
            this.showVotePop(data.disband)
        if (data.status == GameConfig.GameStatus.WAIT || data.status == GameConfig.GameStatus.PREPARE || data.status == GameConfig.GameStatus.SUMMARY) {
            return;
        }
        this.readyBtnStatus(false);
        data.players.forEach(player => {
            this.nodePlayerInfo[TableInfo.realIdx[player.idx]].activeAutoPlay(player.auto);
            //隐藏准备按钮
            this.nodePlayerInfo[TableInfo.realIdx[player.idx]].activeReady(false);
            if (TableInfo.idx == player.idx)
                this.changeAutoState(player)
            //报单
            console.log('---', player.hands)
            if (player.hands == 1) {
                TableInfo.baodan[player.idx] = true;
                this.nodePlayerInfo[TableInfo.realIdx[player.idx]].activeBaodan(true);
            }
            if (player.historyCard != null) {
                this.showPlayCards(player.historyCard);
            }
            if (data.currentCard != null && player.idx == data.currentCard.idx) {
                this.showPlayCards(data.currentCard);
            }
        });
        if (TableInfo.idx < 0) {
            data.hands = data.players[0].hands;
        }
        this.initHands(data, true);
        //TODO 
        // TableInfo.current = data.current;

        let playCardData = {
            idx: data.currentIDX,
            clock: data.clock//new Date().getTime() + 26 * 1000
        }
        this.playCard(playCardData);

    }
    /**炸弹加分 */
    scoreFly(data) {

        //出牌区归零
        this.dropCards.forEach((ground, i) => {
            ground.node.removeAllChildren(true);
            //牌的类型 归零
            this.bgCount[i].node.removeAllChildren(true);
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
        ];
        //结束点位置
        let endPos = playPos[TableInfo.realIdx[data.to[0].idx]];
        //分数显示
        this.nodePlayerInfo[TableInfo.realIdx[data.to[0].idx]].showBombScores(TableInfo.realIdx[data.to[0].idx], data.to[0].total, data.to[0].score, () => {
            for (let i = 0; i < 20; i++) {
                let nodeCoin = cc.instantiate(this.preCoin);
                nodeCoin.parent = this.node;
                nodeCoin.setPosition(playPos[TableInfo.realIdx[data.from[i % person].idx]]);
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
            this.nodePlayerInfo[TableInfo.realIdx[f.idx]].showBombScores(TableInfo.realIdx[f.idx], f.total, f.score);
        });

    }

    finish() {
        this.dropCards.forEach((ground, i) => {
            ground.node.destroyAllChildren(true);
            this.bgCount[i].node.destroyAllChildren(true);
            this.imgPass[i].active = false;
        });
        this.sprDisnable.active = false;
        TableInfo.current = null;
    }


    resetCards() {  //重选按钮
        let objHands = this.layerHandCards.getComponent("LayerHandsCards07");
        objHands.nodeCards.forEach(card => {
            let bgCardMask = card.getChildByName("bgCardMask");
            bgCardMask.active = false;
            card._prior = false;
            card.isZhankai = false;
            card.setPosition(card.pos0);
        });
        this.btnPlayCards.getComponent(cc.Button).interactable = false;
    }

    initHands(data, bool) {
        let hands = data.hands;
        if (TableInfo.idx < 0) {
            hands = new Array(hands).fill(-1);
        }
        hands.sort((a, b) => a % 100 - b % 100);

        this.hands = hands;
        this.hands.reverse();
        let layerHandCards = this.layerHandCards.getComponent("LayerHandsCards07");
        layerHandCards.refreshHandCards(this.hands, bool);
        if (!bool)
            this.cutCards(this.hands);
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
        let cards = this.layerHandCards.getComponent("LayerHandsCards07");
        cards.nodeCards.forEach((card, x) => {
            card.active = true;
            if (card)
                card.opacity = 0;
            // card.runAction(cc.sequence(cc.delayTime(x / data.length), cc.fadeIn(0.2)));
            handsSeq.push(cc.targetedAction(card, cc.sequence(cc.delayTime(x / data.length), cc.fadeIn(0.2))));
        });
        this._delayTime = 0;

        spawn.push(cc.spawn(dealSpawn1));
        spawn.push(cc.spawn(dealSpawn2));
        spawn.push(cc.spawn(handsSeq));
        seq.push(cc.spawn(spawn));
        seq.push(cc.callFunc(() => {
            this._delayTime = 0;
        }));
        try {
            this.node.runAction(cc.sequence(seq));
        } catch (ex) {
            Social.reportError(ex);
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
            this._delayTime = 0;
        }

    }


    playCard(data) {
        TableInfo.currentPlayer = data.idx;
        let idx = data.idx
        let realIdx = TableInfo.realIdx[idx];
        this.dropCards[realIdx].node.destroyAllChildren();
        this.bgCount[realIdx].node.destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this.showPlayCardLight(idx);
        if (TableInfo.firstPlay) {
            this.nodePlayerInfo[TableInfo.realIdx[idx]].activeBanker(true);
        }

        //TODO 倒计时
        let time = Math.max((data.clock - GameUtils.getTimeStamp()) / 1000, 0);


        this.nodePlayerInfo[TableInfo.realIdx[idx]].showClock(time);


        if (idx == TableInfo.idx) {
            console.log("显示出牌按钮", idx, TableInfo.idx)
            let cards = this.layerHandCards.getComponent("LayerHandsCards07");
            cards.checkCurrent();
            this.changeBtn(true);
            this.btnTips.tipsTime = 0;
            this.btnTips.getComponent(cc.Button).interactable = TableInfo.current != null;

            let hands = this.hands;  //add
            let newHands = [];
            hands.forEach(card => {
                newHands.push(card);
            });
            let results = poker.autoplay(newHands, TableInfo.current, 0, TableInfo.config);
            if (results && results.length == 1) {
                this.btnTips.getComponent("BtnTips07").tipsStart();
            }
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
        //移除结算界面
        if (this.summary) this.summary.remove();
        if (this.node.getChildByName("nodeSummry")) {
            this.node.getChildByName("nodeSummry").removeFromParent();
        }
        // this.nodePlayerInfo.forEach((player) => {
        //     player.resetPlayer();
        // });
        this.layerHandCards.destroyAllChildren();
        this.layerHandCards.getComponent("LayerHandsCards07").nodeCards = [];
        this.dropCards.forEach((ground, i) => {
            ground.node.destroyAllChildren();
            this.bgCount[i].node.destroyAllChildren();
            this.imgPass[i].active = false;
        });
    }
    acBaodan(data) {
        let sex = TableInfo.players[data.idx].prop.sex == 'male' ? 'c1' : 'g_c1';
        Cache.playSound(`${sex}_baodan`);
        TableInfo.baodan[data.idx] = true;
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeBaodan(true);
    }

    showPlayCards(group) {
        console.log("打牌", group)

        let cardType = ["", "", "", "", "", "五连顺", "六连顺", "七连顺", "八连顺", "九连顺", "十连顺", "十一连顺", "十二连顺",];
        //隐藏出牌按钮
        this.changeBtn(false);
        //当前出牌数据
        TableInfo.current = null;
        TableInfo.current = group;
        this._delayTime = 7;
        //隐藏出牌者出牌提示
        let idx = TableInfo.realIdx[group.idx];
        this.nodePlayerInfo[idx].activeOffline(false);
        this.nodePlayerInfo[idx].activeAutoPlay(group.auto);
        this.nodePlayerInfo[idx].playCardLight(false);
        this.nodePlayerInfo[idx].hideClock();
        this.nodePlayerInfo[idx].changeCardCount(group.hands);


        if (TableInfo.idx == group.idx)
            this.changeAutoState(group)
        //  播放出牌动画
        let url = cc.url.raw(`resources/Audio/Common/playCard.mp3`);
        AudioCtrl.getInstance().playSFX(url);
        //  出牌者位置下标
        let realIdx = TableInfo.realIdx[group.idx];
        //清除出牌区
        if (this.dropCards[realIdx].node.children.length > 0) {
            this.dropCards[realIdx].node.destroyAllChildren();
            this.bgCount[realIdx].node.destroyAllChildren();
        }
        //玩家自身无能出的牌 提示 隐藏
        this.sprDisnable.active = false;
        // 判断出牌类型
        let idxType;
        let audioType = '';

        switch (group.type) {
            case "BOMB":
                idxType = 0;
                audioType = '_4_' + group.card;
                break
            case "LIANDUI":
                idxType = 1;
                audioType = '_LIANDUI';
                break
            case "SHUN":
                //显示牌类型
                let type = cc.instantiate(this.preType);
                type.parent = this.bgCount[realIdx].node;
                let numCard = group.cards.length;
                idxType = 2;
                type.getComponent("cc.Label").string = cardType[numCard];
                audioType = '_SHUN';
                break
            case "FEIJI":
                idxType = realIdx != 0 ? 4 : 3;
                audioType = '_FEIJI';
                break;
            case 'DUI':
                audioType = '_DUI_1_' + group.card;
                break;
            case 'SAN':
                if (group.cards.length == 3) {
                    audioType = '_SAN_1_' + group.card;
                } else if ((group.cards.length == 4)) {
                    audioType = '_SAN_1';
                } else if (group.cards[3] % 100 == group.cards[4] % 100) {
                    audioType = '_SAN_DUI';
                } else {
                    audioType = '_SAN_2';

                }


                break;
            case 'DAN':
                audioType = '_1_' + group.card;
                break;
            case 'SI':
                audioType = '_SI_' + (group.cards.length - 4);
                break;
            default:
                break;
        }
        //  播放出牌种类特效
        if (!GameUtils.isNullOrEmpty(idxType)) {

            let nodeAnimation = cc.instantiate(this.aniNode);

            nodeAnimation.parent = this.bgCount[realIdx].node;

            nodeAnimation.addComponent(sp.Skeleton);

            let ani = nodeAnimation.getComponent(sp.Skeleton);

            ani.skeletonData = this.pokerSkeleton[idxType];
            ani.premultipliedAlpha = false
            ani.setAnimation(1, "animation", false)
            this.playManageAudio(`texiao_${idxType}.mp3`);
        }

        let sex = TableInfo.players[group.idx].prop.sex == "male" ? 'c1' : 'g_c1';
        let audio = sex + audioType + '.mp3';
        this.playManageAudio(audio)

        // let audioCtr = this.bgTable.getComponent("BgTableAudioCtr07");
        // audioCtr.playVoice(group, TableInfo.players[group.idx].prop.sex);
        //移除手牌
        this.removeHands(group);
        //显示牌
        let nodePlayCards = cc.instantiate(this.prePlayCards);
        nodePlayCards.scale = 1;
        nodePlayCards.parent = this.dropCards[realIdx].node;
        let empGroup = JSON.parse(JSON.stringify(group));
        nodePlayCards.getComponent("LayoutShowCards07").init(empGroup);
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
            this.layerHandCards.getComponent("LayerHandsCards07").refreshHandCards(this.hands, true);
        }
    }

    roundSummary(data) {
        //TODO //隐藏托管
        // if (TableInfo.turn >= 10)
        //     this.changeAutoBtn(false);
        //删除提示牌

        this.btnPlayCards.active = false;
        this.btnTips.active = false;
        //结算时解散会再此次弹出
        if (this.node.getChildByName("nodeSummry")) {
            this.node.getChildByName("nodeSummry").removeFromParent();
        }

        this.tipsCardPrefab.removeCards()
        this.dropCards.forEach((ground, i) => {
            ground.node.destroyAllChildren();
            this.bgCount[i].node.destroyAllChildren();
            this.imgPass[i].active = false;
        });
        TableInfo.zhuang = null;
        TableInfo.baodan = TableInfo.options.rules.person == 2 ? [false, false] : [false, false, false];
        TableInfo.status = data.status;
        this.exitBtnStatus();
        if (data.winner == TableInfo.idx) {
            this.playManageAudio(`audio_win.mp3`);
        } else {
            this.playManageAudio(`audio_lose.mp3`);
        }


        let showSpring = data.players.findIndex((v) => { return v.scores.spring > 0 })
        let summaryDelayTime = showSpring != -1 ? 1.5 : 0.5
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                if (showSpring != -1) {

                    let nodeAnimation = cc.instantiate(this.aniNode);
                    this.node.addChild(nodeAnimation, 1, 'springAnim')
                    nodeAnimation.addComponent(sp.Skeleton);
                    let ani = nodeAnimation.getComponent(sp.Skeleton);
                    ani.skeletonData = this.pokerSkeleton[5];
                    ani.premultipliedAlpha = false
                    ani.setAnimation(1, "animation", false)
                    Cache.playSound('spring');

                    // ani.setCompleteListener(() => {
                    //     nodeAnimation.destroy();
                    // })
                }
            }),
            cc.delayTime(summaryDelayTime),
            cc.callFunc(() => {
                if (this.node.getChildByName('springAnim'))
                    this.node.getChildByName('springAnim').destroy();
                let summary = cc.instantiate(this.summaryPrefab);
                this.summary = summary.getComponent("ModuleSummary07").initData(data);
                this.node.addChild(summary)

                data.players.forEach((player, i) => {
                    let idx = TableInfo.realIdx[player.idx]
                    this.nodePlayerInfo[idx].resetPlayer();
                    // if (!GameUtils.isNullOrEmpty(data.ach)){
                    //     this.nodePlayerInfo[idx].setScore(0);
                    // }else{
                    this.nodePlayerInfo[idx].setScore(player.total);
                    // }

                    // let nodePlayCards = cc.instantiate(this.prePlayCards);
                    // nodePlayCards.scale = 1;
                    // nodePlayCards.parent = this.dropCards[idx].node;
                    // let empGroup = JSON.parse(JSON.stringify(player.hands));
                    // nodePlayCards.getComponent("LayoutShowCards07").initRemainCard(empGroup);
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
        let playerInfo = this.nodePlayerInfo[idx].activeOffline(data.offline);
    }

    changeReady(data) {
        if (TableInfo.idx == data.idx) {
            this.readyBtnStatus(false);
        }
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeReady(true);
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeNiao(data);
    }
    showPlayCardLight(idx) {
        this.nodePlayerInfo.forEach(node => node.playCardLight(false));
        this.nodePlayerInfo[TableInfo.realIdx[idx]].playCardLight(true);
    }

    setTurn(data) {
        TableInfo.ruleDesc = GameUtils.getChineseRulePDK(TableInfo.config);
        this.lblRule.string = TableInfo.ruleDesc[0] + '\n' + TableInfo.ruleDesc[1].join(' || ')

        this.bgNode.node.getChildByName('line1').children.forEach((e) => {
            e.active = TableInfo.config[e.name]
        })
        this.bgNode.node.getChildByName('line2').children.forEach((e) => {
            e.active = TableInfo.config[e.name]
        })
        TableInfo.turn = data.round;
        this.lblTurn.string = data.round == 0 ? "" : data.round + '/' + TableInfo.config.turn + "局";
    }

    restart(data) {
        AudioCtrl.getInstance().stopAll();
        cc.game.restart();
    }

    /** 取消托管 */
    cancelAuto(data) {
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeAutoPlay(false);
        if (TableInfo.idx == data.idx) {
            this.changeAutoBtn(false)
        }
    }
    /**开始托管 */
    startAuto(data) {
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeAutoPlay(true);
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
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeAutoPlay(false);
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
        if (TableInfo.status == GameConfig.GameStatus.START&&TableInfo.idx>=0) return;
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

        this.btnPlayCards.active = boolean;//&& !this.currentAutoStatus;
        this.btnTips.active = boolean;//&& !this.currentAutoStatus;

    }
    exitBtnStatus() {
        this.exitBtn.active = TableInfo.status == GameConfig.GameStatus.WAIT || TableInfo.idx < 0;;

    }


    showRuleNode() {
        this.ruleContent.active = !this.ruleContent.active;
    }
    /**解散 */
    onQuickFinish() {
        // if (this.quickFinished) return;
        Connector.gameMessage(ROUTE.CS_DISBAND, 'allow');
        // this.quickFinished = true;
        // App.confirmPop('是否结束本局游戏？', () => {
        //     Connector.gameMessage(ROUTE.CS_DISBAND, 'allow');
        //     this.quickFinished = false;
        // }, () => {
        //     this.quickFinished = false;
        // })
    }
    /**解散 */
    showVotePop(voteData) {
        App.pop(GameConfig.pop.GameVotePop, voteData);
    }
    /**显示旁观者 */
    showObservers() {
        App.pop(GameConfig.pop.ObserversPop)
    }

    onJoinChannelSuccess(channel, uid, elapsed) {
        Cache.alertTip('进入频道')
        this.joined = true;
        //开启其他人喇叭
        agora && agora.muteAllRemoteAudioStreams(false);
        //关掉自己麦克风
        agora && agora.muteLocalAudioStream(true);
        // agora && agora.adjustPlaybackSignalVolume(100);
        // agora && agora.adjustAudioMixingPlayoutVolume(100);
    }
    onLeaveChannel() {
        // Cache.alertTip('离开频道')
        this.joined = false;
    }
    onUserMuteAudio(uid, muted) {
        let audioIndex = -1;
        TableInfo.players.forEach((player) => {
            if (player.prop?.pid == uid)
                audioIndex = player.idx;
        })
        if (audioIndex != -1) {
            this.nodePlayerInfo[TableInfo.realIdx[audioIndex]].otherIconChange(muted);
        }

        console.log("onUserMuteAudio, uid: " + uid + " muted: " + muted);
    }



}
