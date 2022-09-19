import { GameConfig } from "../../../../GameBase/GameConfig";
import AudioCtrl from "../../../../Main/Script/audio-ctrl";
import Cache from "../../../../Main/Script/Cache";
import { Social } from "../../../../Main/Script/native-extend";
import DataBase from "../../../../Main/Script/DataBase";
import PACK from "../../../../Main/Script/PACK";
import ROUTE from "../../../../Main/Script/ROUTE";
import TableInfo from "../../../../Main/Script/TableInfo";
import GameUtils from "../../../common/GameUtils";
import { App } from "../../../ui/hall/data/App";
import WSKTeamHands from "../../../../GamePoker/Game10/Script/WSKTeamHands";

const { ccclass, property } = cc._decorator
@ccclass
export default class RecordGame07 extends cc.Component {



    @property([cc.Node])
    btnOperate = [];
    @property(cc.Sprite)
    sprProgress = null;
    @property(cc.Label)
    lblSpeed = null;



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
    @property([WSKTeamHands])
    hands = [];
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

    @property(cc.Sprite)
    bgNode = null;

    @property(cc.Node)
    ruleBtn = null;
    @property(cc.Label)
    lblRule = null;
    @property(cc.Node)
    ruleContent = null;



    _delayTime = 0;
    nodePlayerInfo = [];

    _queueGameMsg = []
    realIdx = [];
    speed = 1;
    // use this for initialization
    init(data) {
        //添加监听事件
        this.addEvents();
        TableInfo.idx = -1;
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
        // if (this.node) {
        this.node.destroy();
        // }
    }
    /**添加监听事件 */
    addEvents() {
        this.ruleBtn.on(cc.Node.EventType.TOUCH_START, this.showRuleNode, this);
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.ruleContent.active = false;
        }, this)
        App.EventManager.addEventListener(GameConfig.GameEventNames.PDK_CONTINUE_GAME, this.onClickExit, this);
    }
    /**移除监听事件 */
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.PDK_CONTINUE_GAME, this.onClickExit, this);
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
            case ROUTE.SC_RECORD:
                this.initTable(msg.data);
                break;
            case ROUTE.SC_SHOW_CARD:
                this.showPlayCards(msg.data);
                break;
            case ROUTE.SC_PASS_CARD:
                this.showPass(msg.data);
                break;
            case ROUTE.SC_PLAY_CARD:
                this.playCard(msg.data);
                break;
            case ROUTE.SC_SCORE:
                this.scoreFly(msg.data);
                break;
            case ROUTE.SC_FINISH:
                this.finish();
                break;
            case ROUTE.SC_ROUND_SUMMARY:
                this.roundSummary(msg.data);
                break;
        }
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
        this.dropCards[realIdx].node.destroyAllChildren();
        this.bgCount[realIdx].node.destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this._delayTime = 5;
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
    /**初始化桌子 */
    initTable(data) {
        TableInfo.observers = data.observers;
        let windowNode = cc.find("Canvas");
        TableInfo.zhuang = data.banker;
        TableInfo.firstPlay = false;
        TableInfo.status = data.status;
        data.idx = 0;
        TableInfo.idx = data.idx;
        TableInfo.options = data.options;
        TableInfo.config = data.options.rules;
        TableInfo.current = data.current;
        //显示游戏 类型 公会
        this.lblBase.string = '' + data.options.rules.base;
        this.lblRoomId.string = '' + data.tableID;

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

        this.setTurn(data);

        this.initPlayers(data);

    }


    /**初始化玩家 */
    initPlayers(data) {
        this.nodePlayerInfo = new Array(TableInfo.options.rules.person);
        TableInfo.players = data.players;
        data.players.forEach((player, i) => {
            let idx = TableInfo.realIdx[player.idx];
            let nodePlayer = cc.instantiate(this.prePlayerInfo);
            nodePlayer.parent = this.bgTable;
            let playerInfo = nodePlayer.getComponent("ModulePlayerHead07");
            playerInfo.init(player, i);
            this.nodePlayerInfo[idx] = playerInfo;
            this.initHands(player);

            if (TableInfo.idx == player.idx)
                this.changeAutoState(player)
        });
    }
    initHands(data) {
        let realIdx = TableInfo.realIdx[data.idx];
        data.hands.sort((a, b) => a % 100 - b % 100);

        this.hands[realIdx].idx = realIdx;
        this.hands[realIdx].type = 'summaryHands';
        this.hands[realIdx].handsCard = data.hands;

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

    playCard(data) {
        TableInfo.currentPlayer = data.idx;
        let idx = data.idx
        let realIdx = TableInfo.realIdx[idx];
        this.dropCards[realIdx].node.destroyAllChildren();
        this.bgCount[realIdx].node.destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this.showPlayCardLight(idx);
    }
    acBaodan(data) {
        let sex = TableInfo.players[data.idx].prop.sex == 'male' ? 'c1' : 'g_c1';
        Cache.playSound(`${sex}_baodan`);
        TableInfo.baodan[data.idx] = true;
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeBaodan(true);
    }

    showPlayCards(group) {

        let cardType = ["", "", "", "", "", "五连顺", "六连顺", "七连顺", "八连顺", "九连顺", "十连顺", "十一连顺", "十二连顺",];

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
            this.imgPass[realIdx].active = false;

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
        // if (realIdx == 0) {
        let cards = data.cards.slice();
        if (TableInfo.idx < 0) {
            cards = cards.map(c => -1);
        }

        let newHands = this.hands[realIdx].handsCard.concat();
        cards.forEach(card => {
            for (let x = 0; x < newHands.length; x++) {
                let idx = newHands.findIndex(c => card == c);
                if (idx >= 0) {
                    newHands.splice(idx, 1);
                    return;
                }
            }
        });
        this.hands[realIdx].handsCard = newHands;
        // }
    }

    roundSummary(data) {

        this.dropCards.forEach((ground, i) => {
            ground.node.destroyAllChildren();
            this.bgCount[i].node.destroyAllChildren();
            this.imgPass[i].active = false;
        });
        TableInfo.zhuang = null;
        TableInfo.baodan = TableInfo.options.rules.person == 2 ? [false, false] : [false, false, false];
        TableInfo.status = data.status;
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
                    
                    console.log("showSpring",showSpring);

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
                this.summary = summary.getComponent("ModuleSummary07").initData(data, true);
                this.node.addChild(summary)

                data.players.forEach((player, i) => {
                    let idx = TableInfo.realIdx[player.idx]
                    this.nodePlayerInfo[idx].resetPlayer();
                    this.nodePlayerInfo[idx].setScore(player.total);
                });
            })
        ));
    }

    changeStatus(data) {
        let idx = TableInfo.realIdx[data.idx];
        let playerInfo = this.nodePlayerInfo[idx].activeOffline(data.offline);
    }

    changeReady(data) {
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

    }
    /**开始托管 */
    startAuto(data) {
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeAutoPlay(true);

    }
    changeAutoState(data) {
        this.nodePlayerInfo[TableInfo.realIdx[data.idx]].activeAutoPlay(false);
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
    showRuleNode() {
        this.ruleContent.active = !this.ruleContent.active;
    }

    playManageAudio(msg) {
        if (!cc.sys.isNative) {
            return;
        }
        let url = jsb.fileUtils.getWritablePath() + "remote-asset/Audio/Game07/" + msg;

        cc.loader.load(url, (err, data) => {
            if (!err) {
                AudioCtrl.getInstance().playSFX(data);
            }
        });
    }
}
