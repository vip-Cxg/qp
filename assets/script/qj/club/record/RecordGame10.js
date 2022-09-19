
import { GameConfig } from "../../../../GameBase/GameConfig";
import PokerPlayCard from "../../../../GamePoker/commonScript/PokerPlayCard";
import PokerPlayer from "../../../../GamePoker/commonScript/PokerPlayer";
import PokerSelfCard from "../../../../GamePoker/commonScript/PokerSelfCard";
import WSKCurrentScore from "../../../../GamePoker/Game10/Script/WSKCurrentScore";
import WSKScoreCardCount from "../../../../GamePoker/Game10/Script/WSKScoreCardCount";
import WSKSummary from "../../../../GamePoker/Game10/Script/WSKSummry";
import WSKTeamHands from "../../../../GamePoker/Game10/Script/WSKTeamHands";
import AudioCtrl from "../../../../Main/Script/audio-ctrl";
import Cache from "../../../../Main/Script/Cache";
import ROUTE from "../../../../Main/Script/ROUTE";
import TableInfo from "../../../../Main/Script/TableInfo";
import GameUtils from "../../../common/GameUtils";
import { App } from "../../../ui/hall/data/App";

const { ccclass, property } = cc._decorator
@ccclass
export default class RecordGame10 extends cc.Component {


    @property([cc.Node])
    btnOperate = [];
    @property(cc.Sprite)
    sprProgress = null;
    @property(cc.Label)
    lblSpeed = null;




    @property(cc.Prefab)
    playerItem = null;
    @property([WSKTeamHands])
    hands = [];

    @property(cc.Label)
    lblRoomId = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Label)
    lblBase = null;

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
    bgTable = null;
    @property(cc.Node)
    sprDisnable = null;

    @property(cc.Sprite)
    bgNode = null;

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



    players = [];
    _delayTime = 0;
    _queueGameMsg = [];
    speed = 1;
    msgCount = 0;
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

    /**添加监听事件 */
    addEvents() {
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
                this.finish(msg.data);
                break;
            case ROUTE.SC_ROUND_SUMMARY:
                this.roundSummary(msg.data);
                break;
            default:
                console.log("缺少--", logs)
                break;
        }
    }
    /**要不起 */
    showPass(data) {
        let realIdx = TableInfo.realIdx[data.idx];
        this.dropCards[realIdx].destroyAllChildren();
        this.bgCount[realIdx].destroyAllChildren();
        this.imgPass[realIdx].active = false;
        this._delayTime = 5;
        this.sprDisnable.active = data.idx == TableInfo.idx;//&& TableInfo.options.gameType != GameConfig.GameType.WSK;

        let nodePass = this.imgPass[TableInfo.realIdx[data.idx]];
        nodePass.active = true;


        let sex = TableInfo.players[data.idx].prop.sex == "male" ? 'c1' : 'g_c1';
        let rom = Math.ceil(Math.random() * 3);
        let audio = sex + '_PASS' + rom + '.mp3';
        this.playManageAudio(audio);
    }


    /**初始化桌子 */
    initTable(data) {
        TableInfo.observers = data.observers;
        let windowNode = cc.find("Canvas")
        TableInfo.zhuang = data.banker;
        TableInfo.firstPlay = false;
        TableInfo.status = data.status;
        data.idx = 0;
        TableInfo.idx = data.idx;
        // data.options.rules['showRemainingCards'] = true;
        TableInfo.person = data.players.length;
        TableInfo.config = data.rule;
        TableInfo.current = data.currentCard;



        //显示游戏 类型 公会
        // this.lblBase.string = '' + data.options.rules.base;
        this.lblRoomId.string = '' + data.tableID;

        //TODO 设置位置
        let idx = Math.max(data.idx, 0);
        //设置玩家座位位置方位
        if (TableInfo.person == 4) {
            this.realIdx = [0, 0, 0, 0];
            this.realIdx[idx] = 0;
            this.realIdx[(idx + 1) % 4] = 1;
            this.realIdx[(idx + 2) % 4] = 2;
            this.realIdx[(idx + 3) % 4] = 3;
        } else if (TableInfo.person == 3) {
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

        // this.setTurn(data);

        this.initPlayers(data);


    }

    /**初始化玩家 */
    initPlayers(data) {
        this.players = new Array(TableInfo.person);
        TableInfo.players = data.players;
        data.players.forEach((player, i) => {
            let idx = TableInfo.realIdx[player.idx];
            let nodePlayer = cc.instantiate(this.playerItem);
            nodePlayer.parent = this.bgTable;
            let playerInfo = nodePlayer.getComponent(PokerPlayer);
            playerInfo.init(player, i);
            this.initHands(player);

            this.players[idx] = playerInfo;
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
            cc.v2(139 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen, - 63),
            cc.v2(cc.winSize.width / 2 - 139 / 2 - GameConfig.FitScreen, 130 - 63),
            cc.v2(139 / 2 - cc.winSize.width / 2 + GameConfig.FitScreen, 110 - 63),
        ]
        //结束点位置
        let endPos = playPos[TableInfo.realIdx[data.to[0].idx]];
        //分数显示
        this.players[TableInfo.realIdx[data.to[0].idx]].showBombScores(TableInfo.realIdx[data.to[0].idx], data.to[0].wallet, data.to[0].score, () => {
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
            this.players[TableInfo.realIdx[f.idx]].showBombScores(TableInfo.realIdx[f.idx], f.wallet, f.score);
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

        if (!GameUtils.isNullOrEmpty(data.groupScore)) {
            let idx = Math.max(TableInfo.idx, 0);
            this.myGroup.string = data.groupScore[idx % 2];
            this.otherGroup.string = data.groupScore[(idx + 1) % 2];
        }


        data.players.forEach((score, idx) => {
            this.players[TableInfo.realIdx[idx]].setZhuaScore(score);

        })
        this._delayTime=3
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
    }
    initDesk(index = 0) {  //继续游戏初始化桌子
        this.sprDisnable.active = false;
        this.currentScore.reset();
        this.updateWSKScore();
        this.myGroup.string = '0';
        this.otherGroup.string = '0';
        //移除结算界面
        if (this.summary) {
            this.summary.remove();
        }
        this.players.forEach((player) => {
            player.resetPlayer();
        });
        this.dropCards.forEach((ground, i) => {
            ground.destroyAllChildren();
            this.bgCount[i].destroyAllChildren();
            this.imgPass[i].active = false;
        });
    }

    refreshTableScore(data) {
        this.currentScore.renderUI(data.creditPool);
        this.updateWSKScore(data.creditPool);
    }

    showPlayCards(group, score = true) {
        let cardType = ["", "", "", "", "", "五连顺", "六连顺", "七连顺", "八连顺", "九连顺", "十连顺", "十一连顺", "十二连顺",];
        //刷新当前分数
        this.refreshTableScore(group);

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
    }

    roundSummary(data) {

        //删除提示牌
        if (this.tipsCardPrefab) this.tipsCardPrefab.removeCards()
        this.dropCards.forEach((ground, i) => {
            ground.destroyAllChildren();
            this.bgCount[i].destroyAllChildren();
            this.imgPass[i].active = false;
        });
        TableInfo.zhuang = null;
        TableInfo.baodan = new Array(TableInfo.person).fill(false)// TableInfo.person == 2 ? [false, false] : [false, false, false];
        TableInfo.status = data.status;
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

        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(() => {
                if (cc.find('Canvas/WSKSummry'))
                    cc.find('Canvas/WSKSummry').destroy();
                this.randomContent.removeAllChildren();
                this.randomNode.active = false;
                if (data.disband) {
                    let node = cc.instantiate(this.pokerSummaryFour);
                    node.getComponent('PokerSummaryFour').renderUI(data.ach,true);
                    this.node.addChild(node);
                } else {
                    let summary = cc.instantiate(this.summaryPrefab);
                    this.summary = summary.getComponent(WSKSummary).initData(data,true);
                    this.node.addChild(summary);
                }
                data.players.forEach((player, i) => {
                    let idx = TableInfo.realIdx[player.idx]
                    this.players[idx].setScore(player.total);
                    this.players[idx].setZhuaScore(player.scores.credit);
                });
            })
        ));
    }

    showPlayCardLight(idx) {
        this.players.forEach(node => node.playCardLight(false));
        this.players[TableInfo.realIdx[idx]].playCardLight(true);
    }

    /** 取消托管 */
    cancelAuto(data) {
        this.players[TableInfo.realIdx[data.idx]].activeAutoPlay(false);

    }
    /**开始托管 */
    startAuto(data) {
        this.players[TableInfo.realIdx[data.idx]].activeAutoPlay(true);

    }
    changeAutoState(data) {
        this.players[TableInfo.realIdx[data.idx]].activeAutoPlay(false);

    }

    /**显示提示牌 */
    showTipsCard(data) {
        this.tipsCardPrefab.refreshCard(data.cards);

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

    updateWSKScore(creditPool = []) {
        console.log("----桌面分数---",creditPool)
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
            console.log("当前分数--",score)
            this.lblCurrentScore.string = '' + score;
        }))
        this.lblCurrentScore.node.runAction(cp);



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


