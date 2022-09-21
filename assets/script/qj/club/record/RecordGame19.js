import { GameConfig } from "../../../../GameBase/GameConfig";
import AudioCtrl from "../../../../Main/Script/audio-ctrl";
import Cache from "../../../../Main/Script/Cache";
import ROUTE from "../../../../Main/Script/ROUTE";
import TableInfo from "../../../../Main/Script/TableInfo";
import GameUtils from "../../../common/GameUtils";
import { App } from "../../../ui/hall/data/App";
import ModuleOtherHandsMJ from "../../../../GameMj/commonScript/ModuleOtherHandsMJ";
import ModuleGroundMJ from "../../../../GameMj/commonScript/ModuleGroundMJ";
import ModuleHandGroundMJ from "../../../../GameMj/commonScript/ModuleHandGroundMJ";
import ModuleFlowerMJ from "../../../../GameMj/commonScript/ModuleFlowerMJ";
import MJDeck from "../../../../GameMj/commonScript/MJDeck";
import MJSummaryHandsCard from "../../../../GameMj/commonScript/MJSummaryHandsCard";
import MJStartAnim from "../../../../GameMj/commonScript/MJStartAnim";
import ModuleHandsMJ from "../../../../GameMj/commonScript/ModuleHandsMJ";
import config from "../../../../GameMj/Game16/Script/MJGameConfig";

const { ccclass, property } = cc._decorator
@ccclass
export default class RecordGame19 extends cc.Component {



    @property([cc.Node])
    btnOperate = [];
    @property(cc.Sprite)
    sprProgress = null;
    @property(cc.Label)
    lblSpeed = null;



    @property(cc.Node)
    nodeDirection = null;
    @property(cc.Sprite)
    directionBg = null;
    @property([cc.SpriteFrame])
    directionImg = [];
    // @property([cc.SpriteFrame])
    // gameTypeSf = [];


    @property(cc.Prefab)
    player = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Label)
    lblTid = null;
    @property(cc.Label)
    lblBase = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Label)
    lblDeck = null;
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

    @property(cc.Prefab)
    preRoundSummary = null;
    @property(cc.Prefab)
    summaryFour = null;
    @property(cc.Node)
    imgQuest = null;
    @property([cc.SpriteFrame])
    spriteFrameQuest = [];
    @property([cc.SpriteFrame])
    bgFrameQuest = [];
    @property(cc.Prefab)
    preShowCard = null;
    @property(cc.Node)
    nextBtn = null;
    @property(cc.Node)
    summaryBtn = null;
    @property(cc.SpriteAtlas)
    texturee = null;
    @property(cc.Node)
    bgNode = null;
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
    pingNode = null;
    @property(cc.Node)
    sprFlag = null;

    @property(cc.Node)
    ruleBtn = null;
    @property(cc.Node)
    ruleContent = null;
    @property(cc.Label)
    lblRule = null;



    summaryData = [];
    lastTxTime = 0;
    _delayTime = 0;
    nodePlayerInfo = [];

    _queueGameMsg = []
    realIdx = [];
    speed = 0.5;
    // use this for initialization
    init(data) {
        //添加监听事件
        this.addEvents();
        TableInfo.idx = -1;
        cc.sprFlag = this.sprFlag;
        for (let key in this.texturee._spriteFrames) {
            TableInfo.cardsSpriteFrame[key] = this.texturee._spriteFrames[key];
        }
        //初始化存储玩家头像和玩家脚本的数组
        TableInfo.playerHead = [null, null, null, null];
        TableInfo.players = [null, null, null, null];
        this._queueGameMsg = data.replayData;
        this.msgCount = this._queueGameMsg.length;
        this.btnOperate[1].active = false;
        this.schedule(this.gameMsgSchedule.bind(this), 0.2);
        cc.director.getScheduler().setTimeScale(this.speed);

    }
    playSpeed(event, data) {
        let num = parseInt(data);
        // if(cc.director.getScheduler().isTargetPaused(this)){
        //     cc.log('====>3');
        //     this.resume();
        // }
        // cc.log('====>4');
        this.speed = (num == 1) ? (this.speed - 0.2) : (this.speed + 0.2);
        if (this.speed > 1.6)
            this.speed = 1.6;
        if (this.speed < 0.4)
            this.speed = 0.4;
        this.lblSpeed.string = '当前速度: x' + this.speed.toFixed(1);
        cc.director.getScheduler().setTimeScale(this.speed);
    }
    resume() {
        cc.director.getScheduler().resumeTarget(this);
        this.btnOperate[0].active = true;
        this.btnOperate[1].active = false;
    }
    pause() {
        cc.director.getScheduler().pauseTarget(this);
        this.btnOperate[0].active = false;
        this.btnOperate[1].active = true;
    }
    /**返回大厅 */
    onClickExit() {
        cc.director.getScheduler().setTimeScale(1);
        cc.director.getScheduler().unscheduleAllForTarget(this);
        this.removeEvents()
        this.node.destroy();
    }
    addEvents() {



        this.ruleBtn.on(cc.Node.EventType.TOUCH_START, this.showRuleNode, this);

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.ruleContent.active = false;
        })
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_SHOW_SAME_CARD, this.showSameCard, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_RESET_SAME_CARD, this.resetSameCard, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.HNMJ_GAME_SUMMARY, this.roundReset, this)
    }
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_SHOW_SAME_CARD, this.showSameCard, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_RESET_SAME_CARD, this.resetSameCard, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.HNMJ_GAME_SUMMARY, this.roundReset, this)
    }
    gameMsgSchedule() {
        if (this._delayTime > 0) {
            this._delayTime--;
            return;
        }
        this.sprProgress.fillRange = 1 - (this._queueGameMsg.length / this.msgCount);
        if (this._queueGameMsg.length <= 0)
            return;

        let msg = this._queueGameMsg.shift();
        let logs = cc.sys.isBrowser ? msg : JSON.stringify(msg)
        console.log(logs)

        switch (msg.route) {
            case ROUTE.SC_RECORD: //进桌 重连
                this.joinTable(msg.data);
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
            case ROUTE.SC_ACTION:
                this.action(msg.data);
                break;
            case ROUTE.SC_ROUND_SUMMARY:
                this.roundSummary(msg.data);
                break;
            case ROUTE.SC_REFRESH_CARD:
                db.player.card = msg.data.card;
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
            //同步手牌
            case ROUTE.SC_SYNC_HANDS:
                this.syncCard(msg.data)
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
        let playerIdx = -1;
        data.players.forEach((player) => {
            if (player.prop.pid == App.Player.id)
                playerIdx = player.idx;
        })
        data.idx = Math.max(playerIdx, 0);
        TableInfo.idx = data.idx;
        TableInfo.options = data.options;
        TableInfo.config = data.options;
        /**初始化房间信息显示 */
        this.initTableMsg(data);

        // mode: "CUSTOM"
        let idx = data.idx;
        if (TableInfo.config.rules.person == 4) { //四人麻将
            this.realIdx = [0, 0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 4] = 1;
            this.realIdx[(idx + 2) % 4] = 2;
            this.realIdx[(idx + 3) % 4] = 3;


        } else if (TableInfo.config.rules.person == 3) {//三人麻将
            this.realIdx = [0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 3] = 1;
            this.realIdx[(idx + 2) % 3] = 2;
        } else { //TODO 二人麻将 
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

        // 放置Player脚本
        this.players = new Array(4);
        // this.players = new Array(TableInfo.config.person);

        //初始化玩家状态显示
        this.initPlayer(data);
        //TODO  没坐下


    }
    /**初始化玩家状态显示 */
    initPlayer(data) {
        console.log("initPlayer----", this.players)
        data.players.forEach(player => {
            if (player != null) {
                let idx = TableInfo.realIdx[player.idx];
                let nodePlayer = cc.instantiate(this.player);
                //TODO  playerContainer
                this.node.addChild(nodePlayer);
                this.players[idx] = nodePlayer.getComponent('PlayerMJ');
                this.players[idx].playerInit(player);
                this.initHands(player);

            }
        })
    }

    initHands(data) {
        let realIdx = TableInfo.realIdx[data.idx];
        data.hands.sort((a, b) => a % 100 - b % 100);

        let handsData = {
            cards: data.hands,
            realIdx: realIdx,//==1&&TableInfo.options.rules.person==2?2:idx,
            hu: -1
        };
        this.summaryHandsCard[realIdx].renderUI(handsData);

    }
    /**初始化房间信息显示 */
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
        this.lblTurn.string = data.round == 0 ? "" : data.round + '/' + TableInfo.options.rules.turn + ' 局';
        this.lblTid.string = '' + data.options.tableID;
    }

    gameInit(data) {
        this._delayTime = 100;

        TableInfo.status = GameConfig.GameStatus.START;
        this.nextBtn.active = false;
        this.summaryBtn.active = false;

        this.summaryInfo.active = false;

        this.nodeDirection.active = true;

        TableInfo.outCards = [];

        // cc.find('Canvas/nodeTable/nodeHands').children.forEach((node, i) => {
        //     node.position = config.GAME_HZMJ.ELSE_HANDS_POS[i];
        // });

        this.lblDeck.string = data.decks + '';
        TableInfo.zhuang = data.banker;
        TableInfo.status = GameConfig.GameStatus.START;
        TableInfo.currentPlayer = null;

        TableInfo.special = {};// data.special;

        this.lblTurn.string = data.round == 0 ? "" : data.round + '/' + TableInfo.options.rules.turn + ' 局';



        //清除桌面弃牌
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
            //TODO  骰子动画
            this.diceSpine.defaultSkin = 'anim' + data.dice[0] + data.dice[1];
            this.diceSpine.setSkin('anim' + data.dice[0] + data.dice[1]);
            this.diceSpine.node.stopAllActions();
            this.diceSpine.node.active = true;

            Cache.playSound('MJ_roll');

            this.diceSpine.setAnimation(1, 'idle', false);
            let self = this;
            this.diceSpine.node.runAction(cc.sequence(cc.delayTime(1.2), cc.callFunc(() => {
                //TODO 显示牌剁 和一开始抓牌的动画
                this.nodeDeck.startCardAnim()
                //自己手牌动画
                self.hands.init(data, true);
                //其余手牌动画
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
            }), cc.delayTime(1.5), cc.callFunc(() => {
                this._delayTime = 10;
            })))

        }, 600)



        //重置东南西北
        this.resetPlayStatus(data);
    }

    playCard(data) {
        TableInfo.serialID = data.serialID;

        //gound 牌显示
        this.downloadTime(data);
        //是否为自己出牌
        cc.playCard = data.idx == TableInfo.idx;
        //牌桌显示c
        this.playCardLight(data);

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
        //  东风指向idx0
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
            '#FFC916', //东 黄
            '#2F9BE4', // 南  蓝
            '#46D85B', //西  绿
            '#FE4B4B'  //北  红
        ]

        this.directionIdx.forEach((e, i) => {
            this.nodePlayCard[i].color = new cc.color(color_rgb[e]);
            this.nodePlayCard[i].active = false;
        })
        this.players.forEach(player => {
            player.imgActive.active = false;
        })
    }

    /**抓牌 DRAW */
    getCard(data) {
        //TODO 牌剁出牌
        if (data.card == -1)
            return;
        console.log("抓牌---", data)

        if (data.pos === 'first') {
            this.nodeDeck.normalRemoveCard();
        } else {
            //牌尾抓牌 一次性抓多张
            data.cards.forEach((e) => {
                this.nodeDeck.specialRemoveCard();
            })
        }

        this._delayTime = 3;
        let idx = TableInfo.realIdx[data.idx];
        //更新牌垛显示
        this.lblDeck.string = data.decks + '';

        //TODO
        let { card } = data;
        this.summaryHandsCard[idx].getCard(card ? data.card : data.cards, idx)


    }
    //出牌
    outCard(data) {
        this.lblTime.unscheduleAllCallbacks();

        //倒计时
        this.downloadTime(data);
        let idx = TableInfo.realIdx[data.idx];
        // if (idx != 0) {
        //     //隐藏抓牌显示
        //     this.layoutHands[idx].outCard(data.card);
        // } else {
        //     if (TableInfo.idx < 0) {
        //         this.hands.initObserverhands(data.hands);
        //     }
        //     if (data.auto)
        //         this.hands.autoSortCard(data.card);
        // }
        //出牌放入弃牌区



        this.summaryHandsCard[idx].removeCard(data.card)

        this.changeAutoState(data);
        // //显示出牌
        // let url = cc.url.raw('resources/Audio/Common/outCardMj.mp3');
        let url = cc.url.raw('resources/Audio/Common/card_out.wav');
        AudioCtrl.getInstance().playSFX(url);
        this.ground[idx].outCard(data.card, idx, true);


        let audioCard = data.card;
        let sex = TableInfo.players[data.idx].prop.sex == "male" ? '' : 'g_';
        let audio = `${sex}c2_0x${audioCard}.mp3`;
        this.playManageAudio(audio);
    }

    /**四癞加分 */
    scoreFly(data) {

        //玩家自身无能出的牌 提示 隐藏
        let person = data.from.length;
        //播放加金币音效
        let url = cc.url.raw(`resources/Audio/Common/addScore.mp3`);
        AudioCtrl.getInstance().playSFX(url);
        let spawn = [];
        let playPos = [
            cc.v2(84 / 2 - cc.winSize.width / 2 + cc.gameConfig.FitScreen, -200),
            cc.v2(cc.winSize.width / 2 - 84 / 2 - cc.gameConfig.FitScreen, 100),
            cc.v2(450, cc.winSize.height / 2 - 128 / 2),
            cc.v2(84 / 2 - cc.winSize.width / 2 + cc.gameConfig.FitScreen, 100)

        ];
        //结束点位置
        let endPos = playPos[TableInfo.realIdx[data.to[0].idx]];
        //分数显示
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
            //分数隐藏后飘金币动画
            this.node.runAction(cc.spawn(spawn));
        });
        data.from.forEach((f, i) => {
            this.players[TableInfo.realIdx[f.idx]].showBombScores(TableInfo.realIdx[f.idx], f.total, f.score);
        });

    }
    action(data) {
        if (data.event == GameConfig.GameAction.DRAW || data.event == GameConfig.GameAction.DRAW_MULTI) { //抓牌
            this.getCard(data);
            return
        }
        if (data.cards) {
            TableInfo.outCards = TableInfo.outCards.concat(data.cards);
        }
        if (data.event == GameConfig.GameAction.PLAY) { //出牌
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
        // 朝牌  别人打的 点笑 ||  自己抓的 朝天

        let idx = TableInfo.realIdx[data.idx];
        let audioType = '';
        let imgIdx = -1;
        if (idx == 0) {
            this.hands._hands.forEach(node => node.getCard = false);
            // this.summaryHandsCard[idx].
            let hands = data.hands;
            switch (data.event) {
                case GameConfig.GameAction.LAI: //癞
                    audioType = '_dianxiao';
                    // this._delayTime = 0;
                    data.cards.forEach(card => {

                        this.selfHandFlower.addFlower({ card }, 0);
                        this.summaryHandsCard[idx].removeCard(card)

                    })
                    break;
                case GameConfig.GameAction.PONG: //碰
                    audioType = '_peng';
                    imgIdx = 0;
                    this.selfHandGround.addGround(data, 0);

                    this.summaryHandsCard[idx].removeCard(data.card, 2)

                    break;
                case GameConfig.GameAction.ZHI: //明杠1
                    audioType = '_dianxiao';
                    imgIdx = 13;
                    this.selfHandGround.addGround(data, 0);
                    this.summaryHandsCard[idx].removeCard(data.card, 3);
                    break;
                case GameConfig.GameAction.SHOW: // 补杠2
                    audioType = '_huitouxiao';
                    imgIdx = 11;
                    this.selfHandGround.addGround(data, 0);
                    this.summaryHandsCard[idx].removeCard(data.card, 1);
                    break;
                case GameConfig.GameAction.KONG: //暗杠
                    imgIdx = 8;
                    // audioType = 'c1_angang';
                    audioType = '_anxiao';//暗笑
                    this.selfHandGround.addGround(data, 0);
                    this.summaryHandsCard[idx].removeCard(data.card, 4);
                    break;

                case GameConfig.GameAction.FLOWER_MULTI: //补花
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
                        this.summaryHandsCard[idx].removeCard(card);

                    })
                    break;
                case GameConfig.GameAction.FLOWER: //补花
                    this._delayTime = 5;
                    imgIdx = 3;
                    this.selfHandFlower.addFlower(data, 0)
                    this.summaryHandsCard[idx].removeCard(data.card);
                    break;
                case GameConfig.GameAction.WIN://胡
                    console.log("胡牌--data---", data);
                    /** { event: 'WIN', card: lastAction.card, idx: this._idx, from: lastAction.idx, black: true, chong, chaoHu, qing } */
                    if (data.chong > 0) {
                        /** 热铳 */
                        audioType = '_rechong';
                        imgIdx = 7;
                    } else if (data.from != data.idx) {
                        /** 放炮 屁胡 */
                        audioType = '_pihu';
                        imgIdx = 5;
                    } else {
                        /** 自摸 */
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
            //TODO 动画
            switch (data.event) {
                case GameConfig.GameAction.PONG:
                    audioType = '_peng';
                    imgIdx = 0;
                    this.layoutHands[idx].action(data, idx);
                    this.summaryHandsCard[idx].removeCard(data.card, 2)

                    break;
                case GameConfig.GameAction.CHOW://吃
                    // imgIdx = 5;
                    this.layoutHands[idx].action(data, idx);
                    break;
                case GameConfig.GameAction.WIN://胡
                    if (data.chong > 0) {
                        /** 热铳 */
                        audioType = '_rechong';
                        imgIdx = 7;
                    } else if (data.from != data.idx) {
                        /** 放炮 屁胡 */
                        audioType = '_pihu';
                        imgIdx = 5;
                    } else {
                        /** 自摸 */
                        imgIdx = 6;
                        audioType = '_zimo';
                    }
                    break;
                case GameConfig.GameAction.FLOWER_MULTI: //补花
                    // this._delayTime = 5;
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
                case GameConfig.GameAction.FLOWER:
                    // this._delayTime = 5;
                    imgIdx = 3;
                    this.layoutHands[idx].actionflower(data, idx);
                    break;
                case GameConfig.GameAction.LAI: //癞
                    audioType = '_dianxiao';

                    data.cards.forEach(card => {
                        this.layoutHands[idx].actionLai({ card }, idx);
                        this.summaryHandsCard[idx].removeCard(card)
                    })


                    break;
                case GameConfig.GameAction.SHOW: // 补杠
                    audioType = '_huitouxiao';
                    imgIdx = 11;
                    this.layoutHands[idx].action(data, idx);
                    this.summaryHandsCard[idx].removeCard(data.card)

                    break;
                case GameConfig.GameAction.KONG: // 暗杠
                    audioType = '_anxiao';//暗笑
                    imgIdx = 8;
                    this.layoutHands[idx].action(data, idx);
                    this.summaryHandsCard[idx].removeCard(data.card, 4)

                    break;
                case GameConfig.GameAction.ZHI: // 杠
                    audioType = '_dianxiao';
                    imgIdx = 13;
                    this.layoutHands[idx].action(data, idx);
                    this.summaryHandsCard[idx].removeCard(data.card, 3)

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
            this.imgQuest.getComponent(cc.Sprite).spriteFrame = imgIdx >= 9 ? this.bgFrameQuest[0] : this.bgFrameQuest[1];
            this.imgQuest.getChildByName('img').getComponent(cc.Sprite).spriteFrame = this.spriteFrameQuest[imgIdx];
            this.imgQuest.stopAllActions();
            //TODO  吃碰杠花 动画位置
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
        // this.hands.
        TableInfo.status = data.status;
        this.stopTime();
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
        /** 托管一局自动解散 */
        if (data.disband?.type == 'auto') {
            return;
        }

        if (TableInfo.idx < 0) this.nextBtn.active = false;

        this.summaryInfo.active = true;

        this.layoutHands.forEach((l, i) => {
            // if (i != 0 && i < TableInfo.config.person)
            if (i != 0)
                l.resetHands()
        })

        let lightIdx = Math.floor(Math.random() * TableInfo.options.rules.person);


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
    /**重制各种区域数据 */
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
    }

    gameReady(data) {
        Cache.playSound('MJ_ready');

        let idx = TableInfo.realIdx[data.idx];
        if (idx == 0) {

            this.nextBtn.active = false;
            this.summaryBtn.active = false;
            this.summaryInfo.active = false;

            this.roundReset();
        }
        this.players[idx].imgReady.active = true;
        this.players[idx].activeNiao(data);
    }

    changeStatus(data) {
        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].offlineChange(data.offline);
        // this.players[idx].imgOffline.active = data.offline;
    }
    /** 取消托管 */
    cancelAuto(data) {
        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].activeAutoPlay(false);

    }
    /**开始托管 */
    startAuto(data) {

        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].activeAutoPlay(true);

    }

    changeAutoState(data) {
        let idx = TableInfo.realIdx[data.idx];
        this.players[idx].activeAutoPlay(data.auto);

    }
    /**同步手牌 */
    syncCard(data) {
        let currentCards = [];
        data.hands.sort((a, b) => a - b);
        this.hands._hands.forEach((e, i) => {
            currentCards[i] = e._card;
        })
        currentCards.sort((a, b) => a - b);

        if (currentCards.toString() != data.hands.toString()) {
            console.log("手牌同步: ", currentCards, data.hands)
            this.hands.init(data);
        }
    }
    /**出牌时显示相同手牌 */
    showSameCard(e) {
        let card = e.data
        this.ground.forEach((g, i) => {
            // if (i < TableInfo.config.person) {
            g.showSameCard(card);
            // }
        })
    }

    /**重置相同手牌 */
    resetSameCard() {
        this.ground.forEach((g, i) => {
            // if (i < TableInfo.config.person) {
            g.resetSameCard();
            // }
        })
    }



    downloadTime(data) {
        //出牌倒计时

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



    hideRuleNode() {
        this.ruleContent.active = false;
    }

    showRuleNode() {
        this.ruleContent.active = !this.ruleContent.active;
    }



    playManageAudio(msg) {
        if (!cc.sys.isNative) {
            return;
        }
        let url = jsb.fileUtils.getWritablePath() + "remote-asset/Audio/Game19/" + msg;

        cc.loader.load(url, (err, data) => {
            if (!err) {
                AudioCtrl.getInstance().playSFX(data);
            }
        });
    }
}
