import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import AudioCtrl from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import PACK from "../../../Main/Script/PACK";
import DataBase from "../../../Main/Script/DataBase";
import ROUTE from "../../../Main/Script/ROUTE";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../../../script/ui/hall/data/App";
import MJDeck from "../../commonScript/MJDeck";
import MJShowSpecial from "../../commonScript/MJShowSpecial";
import MJStartAnim from "../../commonScript/MJStartAnim";
import MJSummaryHandsCard from "../../commonScript/MJSummaryHandsCard";
import ModuleFlowerMJ from "../../commonScript/ModuleFlowerMJ";
import ModuleGroundMJ from "../../commonScript/ModuleGroundMJ";
import ModuleHandGroundMJ from "../../commonScript/ModuleHandGroundMJ";
import ModuleHandsMJ from "../../commonScript/ModuleHandsMJ";
import ModuleOtherHandsMJ from "../../commonScript/ModuleOtherHandsMJ";
import ModuleSelfCardsMJ from "../../commonScript/ModuleSelfCardsMJ";
import { Calc } from "../../Game16/Hulib/calc16";
import config from "../../Game16/Script/MJGameConfig";
import BaseGame from "../../../script/base/BaseGame";
const TING_POSTION = [
    cc.v2(6, -168),
    cc.v2(526 + GameConfig.FitScreen * 2, 3)
]
const { ccclass, property } = cc._decorator
@ccclass
export default class SceneTable19 extends BaseGame {
    @property(cc.Node)
    playCardMask = null;
    @property(cc.Node)
    nodeDirection = null;
    @property(cc.Sprite)
    directionBg = null;
    @property([cc.SpriteFrame])
    directionImg = [];
    @property(cc.Prefab)
    player = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Node)
    btnDisband = null

    @property(cc.Label)
    lblTid = null;
    @property(cc.Label)
    lblBase = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Label)
    lblDeck = null;

    @property(cc.Node)
    btnDestory = null;
    @property(cc.Node)
    btnReady = null;

    @property(cc.Prefab)
    card = null;

    @property([cc.Node])
    nodePlayCard = [];
    @property(ModuleHandsMJ)
    hands = null;
    @property([ModuleOtherHandsMJ])
    layoutHands = [];
    @property([ModuleGroundMJ])
    ground = [];
    @property(ModuleHandGroundMJ)
    selfHandGround = null;
    @property(ModuleFlowerMJ)
    selfHandFlower = null;

    @property(cc.Node)
    nodeQuest = null;
    @property(cc.Node)
    nodeSelectQuest = null;
    @property(cc.Prefab)
    preRoundSummary = null;
    @property(cc.Prefab)
    summaryFour = null;

    @property(cc.Node)
    imgQuest = null;

    @property([cc.SpriteFrame])
    spriteFrameQuest = [];

    @property(cc.Prefab)
    preShowCard = null;


    @property(cc.Node)
    bgTing = null;
    @property(cc.Node)
    btnTing = null;
    @property(cc.Prefab)
    preTingCard = null;
    @property(cc.Label)
    lblTing = null;
    @property(cc.Label)
    lblTingCount = null;

    @property(cc.Node)
    nextBtn = null;
    @property(cc.Node)
    summaryBtn = null;

    @property(cc.SpriteAtlas)
    texturee = null;

    @property(cc.Node)
    btnExit = null;

    @property(cc.Node)
    bgNode = null;
    @property(cc.Node)
    autoMask = null;
    @property(cc.Node)
    btnAuto = null;

    @property(sp.SkeletonData)
    cutAnim = null;

    @property(cc.Node)
    cutTips = null;

    @property(sp.Skeleton)
    diceSpine = null;
    @property(sp.Skeleton)
    huSpine = null;

    @property(cc.Node)
    summaryInfo = null;


    @property(MJDeck)
    nodeDeck = null;

    @property([MJSummaryHandsCard])
    summaryHandsCard = [];
    @property(MJStartAnim)
    startAnim = null;

    @property(cc.Prefab)
    xiAnim = null;
    @property(cc.Prefab)
    preCoin = null;

    @property(cc.Node)
    seatBtnContent = null;
    @property(cc.Node)
    pingNode = null;
    @property(cc.Node)
    ruleBtn = null;
    @property(cc.Node)
    ruleContent = null;
    @property(cc.Label)
    lblRule = null;
    @property(cc.Node)
    playerContent = null;

    summaryData = [];
    lastTxTime = 0;



    onLoad() {
        this.playCardMask.active = false;
        // let indexBg = GameUtils.getValue(GameConfig.StorageKey.tableBgIndex, 0)
        // this.bgNode.spriteFrame = GameConfig.tableBgSprite[indexBg];

        //??????????????? true  ????????????????????????
        this.initGameBase(true);
        this.addEvents();
        //cc.log(TableInfo.cardsSpriteFrame);
        //TODO
        // this.gps = this.gps.getComponent('ModuleGPS11');
        cc.sprFlag = cc.find('Canvas/nodeTable/sprFlag');
        for (let key in this.texturee._spriteFrames) {
            TableInfo.cardsSpriteFrame[key] = this.texturee._spriteFrames[key];
        }

        //???????????????????????????????????????????????????
        TableInfo.playerHead = [null, null, null, null];
        TableInfo.players = [null, null, null, null];
        //?????????????????????
        this.initChatContent();
        //??????????????????????????????????????????
        this.alReady = false;

        this.schedule(this.gameMsgSchedule, 0.1);

        //????????????????????????????????????????????? 
        //TODO ??????JOINDONE
        Connector.emit(PACK.CS_JOIN_DONE, {});
        // }
        //TODO

        //????????????
        Cache.hideMask();

    }
    addEvents() {
        this.btnTing.on(cc.Node.EventType.TOUCH_START, this.showTingNode, this);
        // this.btnTing.on(cc.Node.EventType.TOUCH_CANCEL, this.hideTingNode, this);
        // this.btnTing.on(cc.Node.EventType.TOUCH_END, this.hideTingNode, this);

        this.ruleBtn.on(cc.Node.EventType.TOUCH_START, this.showRuleNode, this);
        // this.ruleBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.hideRuleNode, this);
        // this.ruleBtn.on(cc.Node.EventType.TOUCH_END, this.hideRuleNode, this);

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.ruleContent.active = false;
            this.hands.resetHandsPos();
            this.bgTing.active = false;
        })

        if (agora) {
            agora.on('join-channel-success', this.onJoinChannelSuccess, this);
            agora.on('leave-channel', this.onLeaveChannel, this);
            agora.on('user-mute-audio', this.onUserMuteAudio, this);
        }

        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_SHOW_SAME_CARD, this.showSameCard, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_RESET_SAME_CARD, this.resetSameCard, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_CHECK_HU, this.handleCheckHu, this)
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_HIDE_TING, this.hideTingUI, this)
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_QUEST_CALL, this.questCall, this)
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_GAME_SUMMARY, this.roundReset, this)
        App.EventManager.addEventListener(GameConfig.GameEventNames.MJ_GAME_NEXT, this.sendReady, this)
    }
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_SHOW_SAME_CARD, this.showSameCard, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_RESET_SAME_CARD, this.resetSameCard, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_CHECK_HU, this.handleCheckHu, this)
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_HIDE_TING, this.hideTingUI, this)
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_QUEST_CALL, this.questCall, this)
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_GAME_SUMMARY, this.roundReset, this)
        App.EventManager.removeEventListener(GameConfig.GameEventNames.MJ_GAME_NEXT, this.sendReady, this)

        // this.node.off(GameConfig.GameEventNames.PDK_BACK_HALL, this.backHall, this);
        if (agora) {
            agora.off('leave-channel', this.onLeaveChannel, this);
            agora.off('join-channel-success', this.onJoinChannelSuccess, this);
            agora.off('user-mute-audio', this.onUserMuteAudio, this);
        }
    }
    initChatContent() {
        this.node.on('chatAlready', () => {
            let data = {
                str: [
                    '???????????????,???????????????!',
                    '???????????????,?????????!',
                    '????????????????????????,???????????????!',
                    '?????????????????????',
                    '???????????????????????????!',
                    '???????????????,??????????????????!',
                    '??????????????????!',
                    '??????,?????????????????????,?????????!',
                    '???????????????????????????????',
                    '???????????????,??????????????????!'
                ],
                url: 'ChatImg/Game11',
                aniPos: [
                    cc.v2(84.5 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen, -cc.winSize.height / 2 + 128 / 2 + 30),
                    cc.v2(cc.winSize.width / 2 - 84.5 / 2 - GameConfig.FitScreen, 120 + 30),
                    cc.v2(450, cc.winSize.height / 2 - 128 / 2 + 30),
                    cc.v2(84.5 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen, 120 + 30)
                ],
                msgPos: [
                    cc.v2(84.5 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen + 80, -cc.winSize.height / 2 + 128),
                    cc.v2(cc.winSize.width / 2 - 84.5 / 2 - GameConfig.FitScreen - 80, 120),
                    cc.v2(450 - 80, cc.winSize.height / 2 - 128 / 2),
                    cc.v2(84.5 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen + 80, 120)

                ],
                facePos: [
                    cc.v2(84.5 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen + 130, -cc.winSize.height / 2 + 128 / 2 + 30),
                    cc.v2(cc.winSize.width / 2 - 84.5 / 2 - GameConfig.FitScreen - 130, 120),
                    cc.v2(450 - 130, cc.winSize.height / 2 - 128 / 2),
                    cc.v2(84.5 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen + 130, 120)
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


        // if (this._status != QUEUE_STATUS.DONE) return;
        // let msg = Queue.next();
        // if (!msg) return;
        // console.log(msg.route + ":", msg.data)
        // this._status = QUEUE_STATUS.HANDLE;
        // this.scheduleOnce(() => {
        //     this._status = QUEUE_STATUS.DONE;
        // }, 1)


        switch (msg.route) {
            case ROUTE.SC_GAME_DATA: //?????? ??????
                this.reconnect(msg.data);
                break;
            case ROUTE.SC_CHAPTER:
            case ROUTE.SC_GAME_READY:
                this.gameReady(msg.data);
                break;
            case ROUTE.SC_CHANGE_STATUS:
                this.changeStatus(msg.data);
                break;
            case ROUTE.SC_GAME_INIT:
                this.gameInit(msg.data);
                break;
            case ROUTE.SC_PLAY_CARD:
                this.playCard(msg.data);
                break;
            // case ROUTE.SC_GET_CARD:
            //     this.getCard(msg.data);
            //     break;
            case ROUTE.SC_OUT_CARD:
                this.outCard(msg.data);
                break;
            case ROUTE.SC_PLAYER_LEAVE:
                this.onPlayerLeave(msg.data);
                break;
            case ROUTE.SC_SCORE:
                this.score(msg.data);
                break;
            // case ROUTE.SC_GAME_VOTE:
            //     this.gameVote(msg.data);
            //     break;
            case ROUTE.SC_GAME_CHAT:
                this.chat.contentFly(msg.data);
                break;
            case ROUTE.SC_GAME_DRAW:
                this.gameDraw(msg.data);
                break;
            case ROUTE.SC_QUEST:
                this.quest(msg.data);
                break;
            case ROUTE.SC_ACTION:
                this.action(msg.data);
                break;
            case ROUTE.SC_ROUND_SUMMARY:
                this.roundSummary(msg.data);
                break;
            case ROUTE.SC_REFRESH_CARD:
                DataBase.player.card = msg.data.card;
                break;
            case ROUTE.SC_DEAD:
                this.dead(msg.data);
                break;
            case ROUTE.SC_SYSTEM_NOTICE:
                //TODO
                GameUtils.pop(GameConfig.pop.NoticePop, (node) => {
                    node.getComponent('ModuleNotice').showTips(msg.data.message, msg.data.times);
                })
                break;
            case ROUTE.SC_CANCEL_AUTO:
                this.cancelAuto(msg.data);
                break;
            case ROUTE.SC_START_AUTO:
                this.startAuto(msg.data);
                break;
            //????????????
            case ROUTE.SC_SYNC_HANDS:
                this.syncCard(msg.data)
                break;
            // case ROUTE.SC_QUICK_FINISH:
            case ROUTE.SC_DISBAND:
                this.showVotePop(msg.data);
                break;
            case ROUTE.SC_GAME_DESTORY:
                this.playerLeave(msg.data);
                break;
            case ROUTE.SC_TOAST:
                if (!GameUtils.isNullOrEmpty(msg.data.message))
                    Cache.alertTip(msg.data.message);
                break;
            case ROUTE.SC_OBSERVER:
                TableInfo.observers = msg.data.observers;
                break;
            default:
                console.log('default------', logs)
                break;
        }
    }

    joinTable(data) {
        TableInfo.observers = data.observers;
        TableInfo.status = data.status;
        TableInfo.zhuang = null;
        TableInfo.tid = data.tid;
        let idx = data.idx == -1 ? 0 : data.idx;
        TableInfo.idx = data.idx;
        TableInfo.options = data.options;
        TableInfo.config = data.options;
        /**??????????????????????????? */
        this.initTableMsg(data);





        // mode: "CUSTOM"
        if (TableInfo.config.rules.person == 4) { //????????????
            this.realIdx = [0, 0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 4] = 1;
            this.realIdx[(idx + 2) % 4] = 2;
            this.realIdx[(idx + 3) % 4] = 3;


        } else if (TableInfo.config.rules.person == 3) {//????????????
            this.realIdx = [0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 3] = 1;
            this.realIdx[(idx + 2) % 3] = 2;
        } else { //TODO ???????????? 
            this.realIdx = [0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 2] = 2;
        }
        TableInfo.realIdx = this.realIdx;

        if (!GameUtils.isNullOrEmpty(this.players)) {
            this.players.forEach(player => {
                if (player)
                    player.node.destroy();
            })
        }

        // ??????Player??????
        // this.players = new Array(4);
        this.players = new Array(TableInfo.options.rules.person);

        this.initVoice();

        //???????????????????????????
        this.initPlayer(data);
        //TODO  ?????????

        // this.handleSeatDownBtn(data);

    }
    /**??????????????????????????? */
    initPlayer(data) {
        data.players.forEach(player => {
            if (player != null) {
                let idx = TableInfo.realIdx[player.idx];
                this.seatBtnContent.getChildByName('seat' + idx).active = GameUtils.isNullOrEmpty(player.prop) && data.idx == -1;
                let nodePlayer = cc.instantiate(this.player);
                //TODO  playerContainer
                this.playerContent.addChild(nodePlayer);
                this.players[idx] = nodePlayer.getComponent('PlayerMJ');
                this.players[idx].playerInit(player);
                if (((player.idx == TableInfo.idx) && !player.ready && data.status != GameConfig.GameStatus.START))
                    this.btnReady.active = true;
            }
        })
    }
    /**??????????????????????????? */
    initTableMsg(data) {
        TableInfo.ruleDesc = GameUtils.getChineseRuleHZMJ(data.options.rules);
        this.lblRule.string = TableInfo.ruleDesc[0] + '\n' + TableInfo.ruleDesc[1].join(' || ')

        this.bgNode.getChildByName("line").children.forEach((e) => {
            if (e.name == 'xi') {
                e.active = data.options.rules[e.name] > 0
            } else {
                e.active = data.options.rules[e.name];
            }
        })
        this.lblBase.string = "" + data.options.rules.base;
        TableInfo.round = data.round;
        this.lblTurn.string = data.round == 0 ? "" : data.round + '/' + TableInfo.options.rules.turn + ' ???';
        this.lblTid.string = '' + data.options.tableID;
    }
    /**???????????? */
    seatDown(e, v) {
        // CS_SEAT_DOWN
        let realIdx = parseInt(v);
        let idx = TableInfo.realIdx.findIndex(a => a == realIdx);
        Connector.gameMessage(ROUTE.CS_SEAT_DOWN, { idx });
    }

    gameInit(data) {
        this._delayTime = 100;

        TableInfo.status = GameConfig.GameStatus.START;
        this.nextBtn.active = false;
        this.summaryBtn.active = false;

        this.summaryInfo.active = false;

        this.nodeDirection.active = true;

        this.btnDestory.active = false;
        TableInfo.outCards = [];

        this.bgTing.getChildByName("cardContainer").removeAllChildren();

        this.btnTing.active = false;
        this.lblTing.node.active = false;



        // cc.find('Canvas/nodeTable/nodeHands').children.forEach((node, i) => {
        //     node.position = config.GAME_HZMJ.ELSE_HANDS_POS[i];
        // });

        this.lblDeck.string = data.decks + '';
        TableInfo.zhuang = data.banker;
        TableInfo.status = GameConfig.GameStatus.START;
        TableInfo.currentPlayer = null;

        TableInfo.special = {};// data.special;
        TableInfo.round = data.round;
        this.btnReady.active = false;
        this.lblTurn.string = data.round == 0 ? "" : data.round + '/' + TableInfo.options.rules.turn + ' ???';
        this.exitBtnStatus();
        // //??????
        // if (data.shuffle) {
        //     this.cutCount = 0;
        //     this.cutIdx = [];
        //     this.shuffleData = data;
        //     data.shuffle.forEach((e) => {
        //         if (e.shuffle) {
        //             this.cutCount++;
        //             this.cutIdx.push(e.idx)
        //         }
        //         let idx = TableInfo.realIdx[e.idx];
        //         // this.players[idx].ssetScore(e.wallet)
        //     })

        //     this.handleShuffle();

        // } else {
        //     this.hands.init(data, false);
        // }


        //??????????????????
        this.selfHandGround.resetGround();
        this.selfHandFlower.resetFlower();
        this.ground.forEach((g, i) => {
            g.reset(i);
        });
        this.players.forEach(e => {
            e.roundReset();
        })
        // data.decks += 1;
        this.startAnim.startAnim();
        // this.nodeDeck.initData(data, true);

        setTimeout(() => {
            this.nodeDeck.initData(data, true);
            //TODO  ??????
            this.diceSpine.defaultSkin = 'anim' + data.dice[0] + data.dice[1];
            this.diceSpine.setSkin('anim' + data.dice[0] + data.dice[1]);
            this.diceSpine.node.stopAllActions();
            this.diceSpine.node.active = true;

            Cache.playSound('MJ_roll');

            this.diceSpine.setAnimation(0.5, 'idle', false);
            let self = this;
            this.diceSpine.node.runAction(cc.sequence(cc.delayTime(0.2), cc.callFunc(() => {
                //TODO ????????????
                this.nodeDeck.startCardAnim()

                self.hands.init(data, true);
                self.layoutHands.forEach((lay, i) => {
                    if (TableInfo.config.rules.person == 2) {
                        if (i == 2) {
                            let msg = {
                                hands: 13
                            };
                            lay.reset();
                            lay.init(msg, i, true);
                        }
                        return;
                    }
                    if (TableInfo.config.rules.person == 3) {
                        if (i == 1 || i == 2) {
                            let msg = {
                                hands: 13
                            };
                            lay.reset();
                            lay.init(msg, i, true);
                        }
                        return;
                    }

                    if (i != 0) {
                        let msg = {
                            hands: 13
                        };
                        lay.reset();
                        lay.init(msg, i, true);
                    }
                })
            }), cc.delayTime(0.5), cc.callFunc(() => {
                this._delayTime = 5;

            })))

        }, 600)



        //??????????????????
        this.resetPlayStatus(data);
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
            this.cutTips.getChildByName("name").getComponent(cc.Label).string = "" + TableInfo.players[idx].prop.name + "????????????"
            if (ani) {
                // ???????????????????????????
                ani.setCompleteListener((trackEntry, loopCount) => {
                    nodeAnimation.destroy();
                    this.cutTips.active = false;
                    this.cutCount--;
                    this.handleShuffle();
                });
            }
        } else {
            this._delayTime = 0;
            this.hands.init(this.shuffleData, false);

        }
    }

    showBtnQuest() {
        let node = cc.find('Canvas/nodeTable/btnQuest');
        if (!node)
            return;
        node.active = true;
        node.getChildByName('layout').children.forEach(node => {
            //cc.log(node._name);
        })
    }



    playCard(data) {
        TableInfo.serialID = data.serialID;
        if (!GameUtils.isNullOrEmpty(data.hands))
            this.nodeQuest.active = false;
        if (data.idx == TableInfo.idx) {
            //todo ???????????????  ????????????
            if (this.hands._hands.length % 3 != 2) {
                // Connector.disconnect();// disconnect
            }
            this.checkOutCard();
            this.hands._hands[this.hands._hands.length - 1].getCard = true;
            this.hands.sortCards(false, true);
        }
        // ?????????????????? ?????????????????????????????????
        // this.playCardMask.active = data.idx == TableInfo.idx;
        this.hideTingUI();
        //gound ?????????
        this.hands.resetSameCard();
        this.downloadTime(data);
        //?????????????????????
        cc.playCard = data.idx == TableInfo.idx;
        //????????????c
        this.playCardLight(data);

    }

    showTingNode() {
        this.bgTing.active = !this.bgTing.active;
    }

    // hideTingNode() {
    //     this.bgTing.active = false;
    // }

    /**???????????? ?????????????????????ting */
    checkOutCard() {
        let out = TableInfo.outCards.slice();
        let hands = [];
        let alOut = new Array(40).fill(0);
        this.hands._hands.forEach(node => {
            if (node) {
                hands.push(node._card);
                alOut[node._card]++;
                node.ting = false;
            }
        });
        out.forEach(card => alOut[card]++);
        for (let i = 0; i < hands.length; i++) {
            let play = hands.slice();
            play.splice(i, 1);
            for (let k = 0; k < 30; k++) {
                if (k == 0 || k == 10 || k == 20 || k == 30)
                    continue;
                let newHands = play.slice();
                newHands.push(k);
                if (Calc.checkHu(newHands.slice(), 0)) {
                    this.hands._hands[i].ting = true;
                }
            }
        }
        this.hands.showTing();
    }

    checkHuCard(moveCard, showTing = false) {
        let out = TableInfo.outCards.slice();
        this.lblTing.node.active = false;
        this.bgTing.getChildByName("cardContainer").removeAllChildren();
        let alOut = new Array(40).fill(0);
        out.forEach(card => alOut[card]++);
        let hands = [];
        this.hands._hands.forEach(node => {
            if (node) {
                hands.push(node._card);
                alOut[node._card]++;
            }
        });
        let huCard = 0;
        this.btnTing.active = false;
        this.bgTing.active = false;
        /** ????????????????????? */
        let huCount = 0;
        for (let i = 0; i < 30; i++) {
            if (i == 0 || i == 10 || i == 20 || i == 30)
                continue;
            let newHands = hands.slice();
            newHands.push(i);
            if (moveCard) {
                newHands.splice(newHands.indexOf(moveCard), 1);
            }
            if (Calc.checkHu(newHands.slice(), 0)) {
                huCard++;
                let node = cc.instantiate(this.preTingCard);
                node.parent = this.bgTing.getChildByName("cardContainer");
                let remain = 4 - alOut[i];
                huCount += Math.max(remain, 0);
                node.getChildByName('cardCount').getComponent(cc.Label).string = Math.max(remain, 0);
                node.scale = 0.7;
                node.getComponent('ModuleSelfCardsMJ').init(i);
            }
        }
        if (huCard > 0) {
            this.lblTingCount.string = huCount;
            if (showTing) {
                this.bgTing.active = true;
            } else {
                this.btnTing.active = true;
            }
            this.bgTing.anchorX = showTing ? 0.5 : 1;
            this.bgTing.setPosition(TING_POSTION[showTing ? 0 : 1]);
        }
        if (huCard >= 34) {
            this.bgTing.getChildByName("cardContainer").removeAllChildren();
            this.lblTing.node.active = true;
        }
    }

    showTingUI() {
        this.bgTing.active = true;
    }
    hideTingUI() {
        this.bgTing.active = false;
    }


    playCardLight(data) {
        //TODO 
        this.nodePlayCard.forEach(node => {
            node.active = false;
        });
        let node = this.nodePlayCard[TableInfo.realIdx[data.idx]];
        node.active = true;
        node.stopAllActions();

        node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.8, 100), cc.fadeTo(0.8, 255))));
        this.players.forEach(player => {
            player.clockAnim(data);
        });
    }

    resetPlayStatus(data) {
        //TODO 
        //  ????????????idx0
        let zhuangRealIdx = TableInfo.realIdx[0];
        this.directionIdx = [0, 0, 0, 0];
        this.directionBg.spriteFrame = this.directionImg[zhuangRealIdx];



        switch (zhuangRealIdx) {
            case 0:
                this.directionIdx = [0, 1, 2, 3];

                // this.layoutDirection.rotation = 0
                break;
            case 1:
                // this.layoutDirection.rotation = -90
                this.directionIdx = [3, 0, 1, 2];
                break;
            case 2:
                // this.layoutDirection.rotation = 180
                this.directionIdx = [2, 3, 0, 1];
                break;
            case 3:
                // this.layoutDirection.rotation = 90
                this.directionIdx = [1, 2, 3, 0];

                break;
        }
        let color_rgb = [
            '#FFC916', //??? ???
            '#2F9BE4', // ???  ???
            '#46D85B', //???  ???
            '#FE4B4B'  //???  ???
        ]

        this.directionIdx.forEach((e, i) => {
            this.nodePlayCard[i].color = new cc.color(color_rgb[e]);
            this.nodePlayCard[i].active = false;
        })
        this.players.forEach(player => {
            player.imgActive.active = false;
        })
    }

    /**?????? DRAW */
    getCard(data) {
        //TODO ????????????
        if (data.pos === 'first') {
            this.nodeDeck.normalRemoveCard();
        } else {
            //???????????? ??????????????????
            data.cards.forEach((e) => {
                this.nodeDeck.specialRemoveCard();
            })
        }

        this.nodeQuest.active = false;

        this._delayTime = 3;
        let idx = TableInfo.realIdx[data.idx];
        //??????????????????
        this.lblDeck.string = data.decks + '';

        if (data.idx != TableInfo.idx && idx != 0) {
            this.layoutHands[idx].getCard(data.hands);
            return;
        }

        this.hands.getCard(data);
        // if (data.event == GameConfig.GameAction.DRAW_MULTI) {
        //     this.hands.getCard(data.cards);
        // } else {
        //     this.hands.getCard(data.card);
        // }
        //??????????????????
        // data.hands.push(data.card);
        // this.syncCard(data);
        this.checkHuCard();
    }
    //??????
    outCard(data) {
        this.playCardMask.active = false;



        this.nodeQuest.active = false;
        this.lblTime.unscheduleAllCallbacks();
        // //????????????icon
        // let msg = { idx: data.idx, status: false };
        // this.changeStatus(msg);
        //?????????
        this.downloadTime(data);

        let idx = TableInfo.realIdx[data.idx];
        if (idx != 0) {
            //??????????????????
            this.layoutHands[idx].outCard(data.card);
        } else {
            if (TableInfo.idx < 0) {
                this.hands.initObserverhands(data.hands);
            }
            if (data.auto)
                this.hands.autoSortCard(data.card);
        }
        //?????????????????????

        this.changeAutoState(data);
        // //????????????
        // let url = cc.url.raw('resources/Audio/Common/outCardMj.mp3');
        let url = cc.url.raw('resources/Audio/Common/card_out.wav');
        AudioCtrl.getInstance().playSFX(url);
        this.ground[idx].outCard(data.card, idx, true);

        if (idx == 0) {
            //?????????????????????{}
            this.checkHuCard();
            this.hands.sortCards(false, true);
        }


        // let audioCard = 0;

        // if (data.card >= 11 && data.card <= 19) {
        //     audioCard = data.card + 10;

        // } else if (data.card >= 21 && data.card <= 29) {
        //     audioCard = data.card - 10;

        // } else {
        //     audioCard = data.card;
        // }

        let audioCard = data.card;
        let sex = TableInfo.players[data.idx].prop.sex == "male" ? '' : 'g_';
        let audio = `${sex}c2_0x${audioCard}.mp3`;
        this.playManageAudio(audio);
    }

    playerLeave(data) {
        //TODO  ???????????????  ???????????????  ????????????
        if (!GameUtils.isNullOrEmpty(data.reason)) {
            this.btnDestory.active = true;
            Cache.alertTip(data.reason)

        }
        TableInfo.status = GameConfig.GameStatus.DESTORY;
        Connector.disconnect(false);
        this.exitBtnStatus();
        this.btnReady.active = false;
        this.players.forEach((e, i) => {
            if (e && i != 0) {
                e.removePlayer();
            }
        })

    }

    score(data) {

    }

    gameDraw(data) {

    }

    quest(data) {
        TableInfo.serialID = data.serialID;
        //?????? ????????????
        this.nodeQuest.active = true;
        let hu = this.nodeQuest.getChildByName('hu');
        let peng = this.nodeQuest.getChildByName('peng');
        let gang = this.nodeQuest.getChildByName('gang');
        let chi = this.nodeQuest.getChildByName('chi');
        this.nodeQuest.getChildByName('guo').active = true;
        hu.active = false;
        peng.active = false;
        gang.active = false;
        chi.active = false;
        let downloadData = {
            idx: TableInfo.idx,
            clock: data.clock
        }
        this.downloadTime(downloadData);

        this.chiArr = [];
        this.gangArr = [];
        data.quests.forEach((quest, i) => {
            switch (quest.event) {

                case GameConfig.GameAction.PLAY://??????
                    let playCardData = {
                        idx: TableInfo.idx,
                        clock: data.clock,
                        serialID: data.serialID
                    }
                    this.playCard(playCardData);
                    break;
                case GameConfig.GameAction.PONG://???
                    peng.active = true;
                    peng.card = quest.card;
                    peng.answer = i;
                    break;
                case GameConfig.GameAction.CHOW://???
                    chi.active = true;
                    quest.index = i;
                    this.chiArr.push(quest);

                    // chi.card = quest.card;
                    // chi.answer = i;
                    break;
                case GameConfig.GameAction.WIN://??????
                    hu.active = true;
                    this.lblTing.node.active = false;
                    this.btnTing.active = false;
                    hu.card = quest.card;
                    hu.answer = i;
                    break;
                // case GameConfig.GameAction.ZHI://??????
                //     this.gangArr.push(quest);
                //     gang.active = true;
                //     gang.card = quest.card;
                //     gang.answer = i;
                //     break;
                default:
                    gang.active = true;
                    quest.index = i;
                    this.gangArr.push(quest);
                // gang.active = true;
                // // gang.getChildByName('selfCards').getComponent('ModuleSelfCardsMJ').init(quest.card);
                // gang.card = quest.card;
                // gang.answer = i;
            }
        })
    }

    btnQuestCall(event, type) {
        let hu = this.nodeQuest.getChildByName('hu');

        if (hu.active && type != GameConfig.GameAction.WIN) {
            App.confirmPop('??????????????????', () => {
                this.handleQuestCall(type);
            });
        } else {
            this.handleQuestCall(type);
        }



    }

    handleQuestCall(type) {
        switch (type) {
            case GameConfig.GameAction.GUO: //???
                Connector.gameMessage(ROUTE.CS_ANSWER, { answer: -1, serialID: TableInfo.serialID });
                this.nodeQuest.active = false;
                break;
            case GameConfig.GameAction.PONG: //???
                Connector.gameMessage(ROUTE.CS_ANSWER, { answer: this.nodeQuest.getChildByName('peng').answer, serialID: TableInfo.serialID });
                this.nodeQuest.active = false;
                break;
            case GameConfig.GameAction.CHOW: //???
                if (this.chiArr.length > 1) {//????????????
                    //??????????????????
                    this.chiArr.forEach(e => {
                        this.nodeSelectQuest.getChildByName('groundContent').getComponent('ModuleHandGroundMJ').addGround(e, 0)
                    })
                    this.nodeSelectQuest.active = true;
                    return;
                }
                Connector.gameMessage(ROUTE.CS_ANSWER, { answer: this.chiArr[0].index, serialID: TableInfo.serialID });
                this.nodeQuest.active = false;
                break;
            case 'GANG'://GameConfig.GameAction.ZHI: //??????
                if (this.gangArr.length > 1) {//????????????
                    //??????????????????
                    this.gangArr.forEach(e => {
                        this.nodeSelectQuest.getChildByName('groundContent').getComponent('ModuleHandGroundMJ').addGround(e, 0)
                    })
                    this.nodeSelectQuest.active = true;
                    return;
                }
                Connector.gameMessage(ROUTE.CS_ANSWER, { answer: this.gangArr[0].index, serialID: TableInfo.serialID });
                this.nodeQuest.active = false;
                break;
            case GameConfig.GameAction.WIN:
                Connector.gameMessage(ROUTE.CS_ANSWER, { answer: this.nodeQuest.getChildByName('hu').answer, serialID: TableInfo.serialID });
                this.nodeQuest.active = false;
                break;
        }
    }
    questCall(e) {
        this.hideSelectQuest();
        Connector.gameMessage(ROUTE.CS_ANSWER, { answer: e.data.index, serialID: TableInfo.serialID });
        this.nodeQuest.active = false;
    }
    hideSelectQuest() {
        this.nodeSelectQuest.getChildByName('groundContent').getComponent('ModuleHandGroundMJ').resetGround();
        this.nodeSelectQuest.active = false;

    }

    /**???????????? */
    scoreFly(data) {

        //??????????????????????????? ?????? ??????
        let person = data.from.length;
        //?????????????????????
        let url = cc.url.raw(`resources/Audio/Common/addScore.mp3`);
        AudioCtrl.getInstance().playSFX(url);
        let spawn = [];
        let playPos = [
            cc.v2(84 / 2 - cc.winSize.width / 2 + cc.gameConfig.FitScreen, -200),
            cc.v2(cc.winSize.width / 2 - 84 / 2 - cc.gameConfig.FitScreen, 100),
            cc.v2(450, cc.winSize.height / 2 - 128 / 2),
            cc.v2(84 / 2 - cc.winSize.width / 2 + cc.gameConfig.FitScreen, 100)

        ];
        //???????????????
        let endPos = playPos[TableInfo.realIdx[data.to[0].idx]];
        //????????????
        this.players[TableInfo.realIdx[data.to[0].idx]].showBombScores(TableInfo.realIdx[data.to[0].idx], data.to[0].total, data.to[0].score, () => {
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
            //??????????????????????????????
            this.node.runAction(cc.spawn(spawn));
        });
        data.from.forEach((f, i) => {
            this.players[TableInfo.realIdx[f.idx]].showBombScores(TableInfo.realIdx[f.idx], f.total, f.score);
        });

    }
    action(data) {
        if (data.event == GameConfig.GameAction.DRAW || data.event == GameConfig.GameAction.DRAW_MULTI) { //??????
            this.getCard(data);
            return
        }
        if (data.cards) {
            TableInfo.outCards = TableInfo.outCards.concat(data.cards);
        }
        if (data.event == GameConfig.GameAction.PLAY) { //??????
            this.outCard(data);
            return
        }
        if (data.event == GameConfig.GameAction.XI) {
            setTimeout(() => {
                let item = cc.instantiate(this.xiAnim);
                item.parent = cc.find("Canvas");
                item.getComponent("MJXIAnim").startAnim();
                this.scoreFly(data)
            }, 1000)
            return;
        }
        let idx = TableInfo.realIdx[data.idx];
        let audioType = '';// (data.type == 'fang' || data.type == 'suo' || data.type == 'an') ? 'gang' : data.type;
        let imgIdx = -1;
        if (idx == 0) {
            this.hands._hands.forEach(node => node.getCard = false);
            let hands = data.hands;
            switch (data.event) {
                case GameConfig.GameAction.LAI: //???
                    audioType = '_dianxiao';
                    this._delayTime = 5;
                    data.cards.forEach(card => {
                        this.selfHandFlower.addFlower({ card }, 0);
                        this.hands.removeCard(card);
                    })
                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.PONG: //???
                    audioType = '_peng';
                    imgIdx = 0;
                    this.selfHandGround.addGround(data, 0);
                    this.hands.removeCard(data.card, 2, hands);
                    this.hands.checkedCard = null;
                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.CHOW: //???
                    // audioType = 'chi';

                    imgIdx = 5;
                    this.selfHandGround.addGround(data, 0);

                    let a = [data.tile, data.tile + 1, data.tile + 2];// 2, 3, 4     .splice(data.card, 1, 1)
                    a.forEach(e => {
                        if (e != data.card)
                            this.hands.removeCard(e);
                    })
                    this.hands.checkedCard = null;
                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.ZHI: //??????1
                    audioType = '_dianxiao';
                    imgIdx = 13;
                    this.selfHandGround.addGround(data, 0);
                    this.hands.removeCard(data.card, 3, hands);
                    this.hands.checkedCard = null;
                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.SHOW: // ??????2
                    audioType = '_huitouxiao';
                    imgIdx = 11;
                    this.selfHandGround.addGround(data, 0);
                    this.hands.removeCard(data.card, 1, hands);
                    this.hands.checkedCard = null;
                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.KONG: //??????
                    imgIdx = 8;
                    audioType = '_anxiao';//??????
                    this.selfHandGround.addGround(data, 0);
                    this.hands.removeCard(data.card, 4, hands);
                    this.hands.sortCards();
                    break;

                case GameConfig.GameAction.FLOWER_MULTI: //??????
                    this._delayTime = 5;
                    imgIdx = 3;
                    data.cards.forEach(card => {
                        let newFLower = {
                            auto: data.auto,
                            card: card,
                            event: GameConfig.GameAction.FLOWER,
                            idx: data.idx,
                        }
                        this.selfHandFlower.addFlower(newFLower, 0)
                        this.hands.removeCard(card);
                    })

                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.FLOWER: //??????
                    this._delayTime = 5;
                    imgIdx = 3;
                    this.selfHandFlower.addFlower(data, 0)
                    this.hands.removeCard(data.card);
                    this.hands.sortCards();
                    break;
                case GameConfig.GameAction.WIN://???
                    console.log("??????--data---", data);
                    if (data.chong > 0) {
                        /** ?????? */
                        audioType = '_rechong';
                        imgIdx = 7;
                    } else if (data.from != data.idx) {
                        /** ?????? ?????? */
                        audioType = '_pihu';
                        imgIdx = 5;
                    } else {
                        /** ?????? */
                        imgIdx = 6;
                        audioType = '_zimo';
                    }
                    this.huSpine.defaultSkin = 'default';
                    this.huSpine.node.stopAllActions();
                    this.huSpine.node.active = true;
                    this.huSpine.setAnimation(1, 'idle', false);
                    this.huSpine.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
                        this.huSpine.node.active = false;

                    })))
                    break;
            }
        } else {
            //TODO ??????
            switch (data.event) {
                case GameConfig.GameAction.PONG:
                    audioType = '_peng';
                    imgIdx = 0;
                    this.layoutHands[idx].action(data, idx);
                    break;
                case GameConfig.GameAction.CHOW:
                    imgIdx = 5;
                    this.layoutHands[idx].action(data, idx);
                    break;
                case GameConfig.GameAction.WIN://???
                    if (data.chong > 0) {
                        /** ?????? */
                        audioType = '_rechong';
                        imgIdx = 7;
                    } else if (data.from != data.idx) {
                        /** ?????? ?????? */
                        audioType = '_pihu';
                        imgIdx = 5;
                    } else {
                        /** ?????? */
                        imgIdx = 6;
                        audioType = '_zimo';
                    }
                    // imgIdx = data.from == data.idx ? 4 : 2;
                    break;
                case GameConfig.GameAction.FLOWER_MULTI: //??????
                    this._delayTime = 5;
                    imgIdx = 3;
                    data.cards.forEach(card => {
                        let newFLower = {
                            auto: data.auto,
                            card: card,
                            event: GameConfig.GameAction.FLOWER,
                            idx: data.idx,
                        }
                        this.layoutHands[idx].actionflower(newFLower, idx);
                    })

                    break;
                case GameConfig.GameAction.LAI: //???
                    audioType = '_dianxiao';
                    this._delayTime = 5;
                    data.cards.forEach(card => {
                        this.layoutHands[idx].actionLai({ card }, idx);
                    })
                    break;
                case GameConfig.GameAction.FLOWER:
                    this._delayTime = 5;
                    imgIdx = 3;
                    this.layoutHands[idx].actionflower(data, idx);
                    break;
                case GameConfig.GameAction.SHOW: // ??????
                    audioType = '_huitouxiao';
                    imgIdx = 11;
                    this.layoutHands[idx].action(data, idx);
                    break;
                case GameConfig.GameAction.KONG: // ??????
                    audioType = '_anxiao';//??????
                    imgIdx = 8;
                    this.layoutHands[idx].action(data, idx);
                    break;
                case GameConfig.GameAction.ZHI: // ???
                    audioType = '_dianxiao';
                    imgIdx = 13;
                    this.layoutHands[idx].action(data, idx);
                    break;
                // default:
                //     audioType = 'gang';
                //     imgIdx = 1;
                //     this.layoutHands[idx].action(data, idx);
            }
        }
        if (data.event == GameConfig.GameAction.PONG || data.event == GameConfig.GameAction.CHOW || data.event == GameConfig.GameAction.ZHI) {
            this.ground[TableInfo.realIdx[data.from]].removeCard();
        }
        if (data.event == GameConfig.GameAction.WIN)
            this._delayTime = 10;

        if (imgIdx != -1) {
            this.imgQuest.active = true;



            this.imgQuest.scale = 0;
            this.imgQuest.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.spriteFrameQuest[imgIdx];


            this.imgQuest.stopAllActions();
            //TODO  ???????????? ????????????
            let fp = cc.place(config.GAME_HZMJ.QUEST_IMG_POS[idx]);
            let ep = cc.delayTime(0.2);
            let gp = cc.scaleTo(0.3, 0.5).easing(cc.easeBackOut())
            let dp = cc.sequence(fp, gp, ep, cc.callFunc(() => {
                this.imgQuest.scale = 0;
            }))
            this.imgQuest.runAction(dp);
        }

        let sex = TableInfo.players[data.idx].prop.sex == "male" ? 'c1' : 'g_c1';
        let audio = `${sex}${audioType}.mp3`;
        this.playManageAudio(audio);
    }
    roundSummary(data) {
        if (data.destory) {
            return;
        }
        TableInfo.status = data.status;
        this.onCancelAuto();
        this.exitBtnStatus();
        this.nodeQuest.active = false;
        this.bgTing.active = false;
        this.btnTing.active = false;
        this.playCardMask.active = false;
        this.stopTime();

        // cc.sprFlag.removeFromParent();
        cc.playCard = false;

        if (GameUtils.isNullOrEmpty(data.ach)) {

            this.nextBtn.active = true;
            this.summaryBtn.active = false;
        } else {
            this.summaryData = data.ach;
            this.nextBtn.active = false;
            this.summaryBtn.active = true;
        }
        this.nodeDeck.reset();

        if (TableInfo.idx < 0) this.nextBtn.active = false;
        this.summaryInfo.active = true;
        /** ???????????????????????? */
        if (data.disband?.type == 'auto') {
            return;
        }
        this.hands.reset();
        this.hands.hideTing();

        this.layoutHands.forEach((l, i) => {
            // if (i != 0 && i < TableInfo.config.person)
            if (i != 0)
                l.resetHands()
        })


        Cache.playSound('daopai');
        if (GameUtils.isNullOrEmpty(data.winner)) {
            Cache.playSound('ping');
            this.pingNode.active = true;
            setTimeout(() => {
                this.pingNode.active = false;
            }, 1000)

        } else if (data.winner[0].idx == TableInfo.idx) {
            Cache.playSound('win');
        } else {
            Cache.playSound('lose');

        }


        let lightIdx = Math.floor(Math.random() * TableInfo.options.rules.person);
        data.players.forEach((p, i) => {

            let idx = TableInfo.realIdx[p.idx];
            let huCard = GameUtils.isNullOrEmpty(data.winner) || p.idx != data.winner[0].idx ? -1 : data.winner[0].card;

            let handsData = {
                cards: p.hands,
                realIdx: idx,//==1&&TableInfo.options.rules.person==2?2:idx,
                hu: huCard
            };
            this.summaryHandsCard[idx].renderUI(handsData);
            this.players[idx].roundReset();
            // if (!GameUtils.isNullOrEmpty(data.ach)) {
            //     this.players[idx].setScore(0);
            // } else {
            this.players[idx].setScore(p.total);
            // }
            this.players[idx].showSummaryScore(p.turn);
            this.ground[idx].summaryDeck(p.decks, idx, i == lightIdx)

            if (p.idx == TableInfo.idx) {
                this.summaryInfo.getChildByName('hu').getComponent(cc.Label).string = '' + GameUtils.formatGold(p.scores.hu);
                this.summaryInfo.getChildByName('gangWin').getComponent(cc.Label).string = '' + GameUtils.formatGold(p.scores.gangWin);
                this.summaryInfo.getChildByName('gangLose').getComponent(cc.Label).string = '' + GameUtils.formatGold(p.scores.gangLose);
                this.summaryInfo.getChildByName('other').getComponent(cc.Label).string = '' + GameUtils.formatGold(p.scores.chong);
            }
        })

    }

    showSummaryPrefab() {

        if (TableInfo.options.rules.person == 2) {

            let node = cc.instantiate(this.preRoundSummary);
            node.getComponent('MJSummary').renderUI(this.summaryData);
            cc.find('Canvas').addChild(node);
        } else {
            let node = cc.instantiate(this.summaryFour);
            node.getComponent('MJSummaryFour').renderUI(this.summaryData);
            cc.find('Canvas').addChild(node);
        }

    }
    dead(data) {

    }

    sendReady() {

        Connector.gameMessage(ROUTE.CS_GAME_READY, {});
        // Connector.gameMessage(ROUTE.CS_GAME_READY, { plus: v == '-1', shuffle: false });

    }

    /**???????????????????????? */
    roundReset() {
        this.hands.reset();
        this.selfHandGround.resetGround();
        this.selfHandFlower.resetFlower();
        this.ground.forEach((g, i) => {
            // if (i < TableInfo.config.person)
            g.reset(i)
        });
        this.players.forEach((g, i) => {
            // if (i < TableInfo.config.person)
            g.hideSummaryScore()
        });
        this.layoutHands.forEach((l, i) => {
            // if (i != 0 && i < TableInfo.config.person)
            if (i != 0)
                l.reset()
        });
        this.summaryHandsCard.forEach((e) => {
            e.reset();
        })
        this.nodeDeck.reset()
        this.lblTing.node.active = false;
        this.btnTing.active = false;
    }

    gameReady(data) {
        Cache.playSound('MJ_ready');

        let idx = TableInfo.realIdx[data.idx];
        if (idx == 0) {

            this.nextBtn.active = false;
            this.summaryBtn.active = false;
            this.summaryInfo.active = false;

            this.roundReset();
            this.btnReady.active = false;
        }
        this.players[idx].imgReady.active = true;
        this.players[idx].activeNiao(data);
    }

    /** ????????????????????? active?????? */
    refreshMenuActive() {
        this.btnAuto.active = TableInfo.idx >= 0 && TableInfo.options.rules.auto > 0;
        if( TableInfo.options.club.isLeague){
            this.btnDisband.active = TableInfo.idx >= 0&&TableInfo.options.rules.disband==0;
        }else{
            this.btnDisband.active = TableInfo.idx >= 0;
        }
    }

    reconnect(data) {

        TableInfo.outCards = data.drops;
        TableInfo.special = {};// data.special;

        this.joinTable(data);
        this.roundReset();
        TableInfo.zhuang = data.banker;
        this.refreshMenuActive();


        if (data.status == GameConfig.GameStatus.WAIT) {
            //TODO  ??????????????????
            // data.players.forEach(player => {

            //     if (player.idx == TableInfo.idx && player.ready == null)
            //         Connector.gameMessage(ROUTE.CS_GAME_READY, {});
            // })
        }

        if (data.disband && data.disband.status == 'VOTE')
            this.showVotePop(data.disband)
        if (data.status == GameConfig.GameStatus.START || data.status == GameConfig.GameStatus.PLAY || data.status == GameConfig.GameStatus.QUEST) {
            //TODO ???????????????
            this.nodeDeck.initData(data);

            this.nodeDirection.active = true;
            this.lblDeck.string = data.decks + '';
            TableInfo.turn = data.turn;
            //TODO ????????????  
            this.resetPlayStatus(data);


            if (TableInfo.idx < 0) {
                data.hands = data.players[0].hands;
                data.grounds = data.players[0].grounds;
            }
            this.hands.init(data);
            if (data.currentIDX != null && data.currentCard == null) {
                let msg = { idx: data.currentIDX, clock: data.clock, serialID: data.serialID };
                this.playCard(msg);
                TableInfo.currentPlayer = data.currentIDX;
            }
            //?????????ground??? ?????????
            if (!GameUtils.isNullOrEmpty(data.grounds)) {
                let groundArr = data.grounds.filter(e => e.event != GameConfig.GameAction.FLOWER);
                this.selfHandGround.initGround(groundArr, 0);
                let flowerArr = data.grounds.filter(e => e.event == GameConfig.GameAction.FLOWER);
                this.selfHandFlower.initFlower(flowerArr, 0);
            }
            // let player = this.
            // ?????????????????? 
            // if (!GameUtils.isNullOrEmpty(data.drops)) {
            //     this.ground[0].init(data.drops, 0);
            // }
            data.players.forEach(player => {
                if (player) {
                    if (player.auto)
                        this.startAuto(player);
                    let idx = TableInfo.realIdx[player.idx];
                    this.ground[idx].init(player.drops, idx);
                    if (idx != 0) {
                        this.layoutHands[idx].init(player, idx);
                    } else {
                        this.selfHandFlower.initFlower(player.lai, 0);
                    }
                    // player.drops=[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19]
                    this.players[idx].playerInit(player);
                    this.players[idx].hideReady();
                    this.players[idx].clockAnim({ idx: data.currentIDX, clock: data.clock });

                }
            });

            // {
            //     "card": 12,
            //     "idx": 3,
            //     "src": "SHOW"
            // }
            if (data.currentCard != null && data.currentCard.src != GameConfig.GameAction.SHOW) {
                TableInfo.currentCard = data.currentCard;
                this.outCard(data.currentCard);
                // this.showCard(data.currentCard);
            }

            if (this.hands._hands.length % 3 == 2) {
                this.checkOutCard();
            } else {
                this.checkHuCard();
            }

            if (data.quest) {
                data.quest.clock = data.clock
                this.quest(data.quest);
            }
            this.btnReady.active = false;

        }

        if (data.status == GameConfig.GameStatus.SUMMARY) {
            this.nodeDirection.active = true;
            let downloadData = {
                idx: data.currentIDX,
                clock: data.clock
            }
            this.downloadTime(downloadData);
            data.players.forEach(player => {
                if (player.idx == TableInfo.idx)
                    this.btnReady.active = player.ready == null;

            })
        }
        this.exitBtnStatus();
    }




    changeStatus(data) {
        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].offlineChange(data.offline);
        // this.players[idx].imgOffline.active = data.offline;
    }
    onExitGame() {

        //??????
        // if (TableInfo.options.mode == 'CUSTOM') {
        // GameConfig.ShowTablePop = true;
        App.confirmPop("??????????????????", () => {
            Connector.gameMessage(ROUTE.CS_PLAYER_LEAVE, {});
        });
        // } else {
        //     //??????
        //     if (TableInfo.status != GameConfig.GameStatus.DESTORY) return;
        //     //????????????????????????
        //     cc.director.loadScene("Lobby");
        // }
    }

    /**?????? ?????????????????? */
    onPlayerLeave() {
        Connector.disconnect();
    }

    onContinueMatch() {

        GameUtils.pop(GameConfig.pop.MatchPop, (node) => {
            node.getComponent("ModuleMatchPop").startMatch(TableInfo.config.roomID);
        })
    }
    /** ???????????? */
    cancelAuto(data) {

        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].activeAutoPlay(false);
        if (TableInfo.idx == data.idx) {
            this.btnAuto.active = true && TableInfo.options.rules.auto > 0;
            this.autoMask.active = false;
        }
    }
    /**???????????? */
    startAuto(data) {

        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].activeAutoPlay(true);
        if (TableInfo.idx == data.idx) {
            this.btnAuto.active = false;
            this.autoMask.active = true;
        }
    }
    /**?????????????????? */
    onStartAuto() {
        if (TableInfo.status != GameConfig.GameStatus.START && TableInfo.status != GameConfig.GameStatus.QUEST && TableInfo.status != GameConfig.GameStatus.PLAY) {
            return;
        }
        this.btnAuto.active = false;
        this.autoMask.active = true;
        Connector.gameMessage(ROUTE.CS_START_AUTO, {});
    }
    /**?????????????????? */
    onCancelAuto() {
        this.btnAuto.active = TableInfo.idx >= 0 && TableInfo.options.rules.auto > 0;
        this.autoMask.active = false;
        Connector.gameMessage(ROUTE.CS_CANCEL_AUTO, {});
    }
    changeAutoState(data) {
        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].activeAutoPlay(data.auto);
        if (TableInfo.idx == data.idx) {
            this.btnAuto.active = !data.auto && TableInfo.options.rules.auto > 0;
            this.autoMask.active = data.auto;
        }
    }
    /**???????????? */
    syncCard(data) {
        let currentCards = [];
        data.hands.sort((a, b) => a - b);
        this.hands._hands.forEach((e, i) => {
            currentCards[i] = e._card;
        })
        currentCards.sort((a, b) => a - b);

        if (currentCards.toString() != data.hands.toString()) {
            console.log("????????????: ", currentCards, data.hands)
            this.hands.init(data);
        }
    }
    /**??????????????????????????? */
    showSameCard(e) {
        let card = e.data
        this.ground.forEach((g, i) => {
            // if (i < TableInfo.config.person) {
            g.showSameCard(card);
            // }
        })
    }

    /**?????????????????? */
    resetSameCard() {
        this.ground.forEach((g, i) => {
            // if (i < TableInfo.config.person) {
            g.resetSameCard();
            // }
        })
    }
    /**???????????? */
    handleCheckHu(e) {
        this.checkHuCard(e.data.card, e.data.showTing)
    }
    /**?????? */
    acTx() {
        let nowTime = new Date().getTime();
        if ((nowTime - this.lastTxTime) < 10000) {
            Cache.alertTip('??????????????????,????????????10???')
            return
        }
        if (TableInfo.status == GameConfig.GameStatus.WAIT) {
            Cache.alertTip('???????????????,????????????');
            return;
        }
        this.lastTxTime = nowTime;
        Connector.gameMessage(ROUTE.CS_DISBAND, 'allow');
    }
    onDistancePop() {
        GameUtils.pop(GameConfig.pop.DistanceMJPop);
    }
    onRulePop() {
        GameUtils.pop(GameConfig.pop.MJRulePop);
    }



    downloadTime(data) {
        //???????????????

        this.lblTime.unscheduleAllCallbacks();
        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].clockAnim(data);
        let endTime = GameUtils.getTimeStamp(data.clock);
        let newTime2 = GameUtils.getTimeStamp();
        let time1 = Math.floor((endTime - newTime2) / 1000);
        if (time1 > 0)
            this.lblTime.string = time1;
        this.lblTime.schedule(() => {
            // time--;
            let newTime1 = GameUtils.getTimeStamp();
            let time = Math.floor((endTime - newTime1) / 1000);
            // let nowTime=new Date().children
            if (time < 0) return;
            this.lblTime.string = time;
        }, 1);
    }



    stopTime() {
        this.lblTime.string = '';
        this.lblTime.unscheduleAllCallbacks();
    }

    exitBtnStatus() {
        this.btnExit.active = TableInfo.status == GameConfig.GameStatus.WAIT || TableInfo.idx < 0;

    }
    hideRuleNode() {
        this.ruleContent.active = false;
    }

    showRuleNode() {
        this.ruleContent.active = !this.ruleContent.active;
    }
    /**??????????????? */
    showObservers() {
        console.log("?????????--", TableInfo.observers)
        App.pop(GameConfig.pop.ObserversPop);
    }

    onJoinChannelSuccess(channel, uid, elapsed) {
        this.joined = true;
        //?????????????????????
        agora && agora.muteAllRemoteAudioStreams(false);
        //?????????????????????
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
            if (player&&player.prop&& player.prop?.pid == uid)
                audioIndex = player.idx;
        })
        if (audioIndex != -1) {
            this.players[TableInfo.realIdx[audioIndex]].otherIconChange(muted);
        }
    }
    /**?????? */
    showVotePop(voteData) {
        App.pop(GameConfig.pop.GameVotePop, voteData);
    }

}


