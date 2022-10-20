import { GameConfig } from "../../GameBase/GameConfig";
import Cache from "../../Main/Script/Cache";
import TableInfo from "../../Main/Script/TableInfo";
import GameUtils from "../../script/common/GameUtils";
import Avatar from "../../script/ui/common/Avatar";
import { App } from "../../script/ui/hall/data/App";
import PokerSelfCard from "./PokerSelfCard";
const posHead = [
    cc.v2(-511, -232),
    cc.v2(509, 148),
    cc.v2(-511, 148)
];
const posBaodan = [
    cc.v2(106, 48),
    cc.v2(-106, 48),
    cc.v2(106, 48),
    cc.v2(106, 48)
];
const { ccclass, property } = cc._decorator
@ccclass
export default class PokerPlayer extends cc.Component {
    @property(Avatar)
    sprHead = null;

    @property(cc.Node)
    playLight = null;
    @property(cc.Node)
    imgBanker = null;
    @property(cc.Label)
    lblZongjifen = null;
    @property(cc.Label)
    lblName = null;
    @property(cc.Node)
    sprStatus = null;
    @property(cc.Node)
    sprBaodan = null;
    @property(cc.Node)
    nodeAutoPlay = null;
    @property(cc.Node)
    readyIcon = null;
    @property(cc.Node)
    scoreChange = null;
    @property(cc.Node)
    niaoNode = null;
    @property(cc.Node)
    clock = null;
    @property(cc.Node)
    cardContainer = null;
    @property(cc.Label)
    cardCount = null;
    @property(cc.Font)
    loseFont = null;
    @property(cc.Font)
    winFont = null;

    @property(cc.Node)
    zhuaScoreContainer = null;
    @property(cc.Label)
    zhuaScoreCount = null;

    @property(cc.Sprite)
    rankSpr = null;
    @property([cc.SpriteFrame])
    rankSfArr = [];

    @property(PokerSelfCard)
    zhuaCard = null;


    @property(cc.Node)
    voiceContent = null;
    @property(cc.Node)
    localAudioSpr = null;
    @property(cc.Sprite)
    allRemoteSprite = null;
    @property(cc.SpriteFrame)
    disableRemoteSprite = null;
    @property(cc.SpriteFrame)
    remoteSprite = null;
    muteLocal = true;
    muteRemote = false;
    
    playerData = null;
    lastTime = 0;

    /**初始化玩家状态 */
    init(data, index) {
        console.log("玩家; ", data)
        this.playerData = data;
        let windowNode = cc.find("Canvas")

        // let playPos = [
        //     cc.v2(-cc.winSize.width / 2 + this.node.width / 2 + GameConfig.FitScreen, -cc.winSize.height / 2 + this.node.height / 2+44),
        //     cc.v2(cc.winSize.width / 2 - this.node.width / 2 - GameConfig.FitScreen, 70),
        //     cc.v2(-350, cc.winSize.height / 2 - this.node.height / 2),
        //     cc.v2(-cc.winSize.width / 2 + this.node.width / 2 + GameConfig.FitScreen, 70)
        // ]
        let playPos = [
            cc.v2(-cc.winSize.width / 2 + this.node.width / 2 + 44, -cc.winSize.height / 2 + this.node.height / 2 + 44),
            cc.v2(cc.winSize.width / 2 - this.node.width / 2 - 44, 70),
            cc.v2(-350, cc.winSize.height / 2 - this.node.height / 2),
            cc.v2(-cc.winSize.width / 2 + this.node.width / 2 + 44, 70)
        ]
        this.node.position = playPos[TableInfo.realIdx[data.idx]];
        let cardPos = [
            cc.v2(90, 0),
            cc.v2(-90, 0),
            cc.v2(-90, 0),
            cc.v2(90, 0)
        ]
        let zhuaScorePos = [
            cc.v2(85, -50),
            cc.v2(-85, -50),
            cc.v2(-85, -50),
            cc.v2(85, -50)
        ]

        let voicePos = [
            cc.v2(107, 40),
            cc.v2(-107, 40),
            cc.v2(-107, 40),
            cc.v2(107, 40)
        ]

        this.voiceContent.position = voicePos[TableInfo.realIdx[data.idx]];
        this.allRemoteSprite.node.active = TableInfo.realIdx[data.idx] == 0;

        this.cardContainer.active = TableInfo.options?.rules.showRemainingCards;
        this.cardContainer.position = cardPos[TableInfo.realIdx[data.idx]];
        this.zhuaScoreContainer.position = zhuaScorePos[TableInfo.realIdx[data.idx]];

        if (GameUtils.isNullOrEmpty(data.prop))
            return;

        this.voiceContent.active = true;
        this.playLight.active = false;
        this.zhuaCard.node.active = false;

        // this.sprBaodan.active = false;
        this.sprStatus.active = data.offline;
        this.imgBanker.active = data.idx == TableInfo.zhuang && TableInfo.status != GameConfig.GameStatus.WAIT;
        this.lblZongjifen.string = GameUtils.formatGold(data.wallet);
        this.zhuaScoreCount.string = data.scores?.credit || 0;
        this.cardCount.string = typeof data.hands == 'number' ? '' + data.hands : '';

        if (!GameUtils.isNullOrEmpty(data.sign)) {
            this.zhuaCardAnim(data.sign, true)
        }

        this.readyIcon.active = data.ready && TableInfo.status != GameConfig.GameStatus.START;
        this.niaoNode.active = data.ready && data.ready.plus;

        this.lblName.string = GameUtils.getStringByLength(data.prop.name, 6);
        this.sprHead.avatarUrl = data.prop.head
        this.sprBaodan.setPosition(posBaodan[TableInfo.realIdx[data.idx]]);

        this.node.on('touchend', () => {
            if (TableInfo.idx != data.idx) {
                this.showInfo(data);
            }
        })
    }


    showInfo(data) {
        let myDate = new Date();
        let currentTime = myDate.getTime();
        if (currentTime - this.lastTime < 2000) {
            this.lastTime = currentTime;
            Cache.alertTip("发言间隔需要2秒");
            return;
        }
        let idx = data.idx;

        GameUtils.pop(GameConfig.pop.PlayerInfo, (node) => {
            node.getComponent("ModulePlayerInfo").init(idx)
        })
    }
    resetPlayer() {
        console.log('重置', this.playerData)

        this.imgBanker.active = false;
        this.playLight.active = false;
        this.sprBaodan.active = false;
        this.nodeAutoPlay.active = false;
        this.readyIcon.active = false;
        this.sprStatus.active = false;
        this.cardCount.string = '0';
        this.zhuaScoreCount.string = '0';

        this.niaoNode.active = false;

        this.rankSpr.node.active = false;
        this.zhuaCard.node.active = false;

        this.hideClock();


    }
    activeBanker(bool) {
        this.imgBanker.active = bool;
    }

    playCardLight(bool) {
        if (bool) {
            this.playLight.active = true;
            this.playLight.stopAllActions();
            this.playLight.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1), cc.delayTime(0.2), cc.fadeIn(1))));
        } else {
            this.playLight.stopAllActions();
            this.playLight.active = false;
        }
    }
    /**显示报单 */
    activeBaodan(bool) {
        this.sprBaodan.active = bool;
    }

    setZhuaScore(score) {
        this.zhuaScoreCount.string = '' + score;
    }
    /**显示托管状态 */
    activeAutoPlay(bool) {
        this.nodeAutoPlay.active = bool;
    }
    /**显示准备 */
    activeReady(bool) {
        this.readyIcon.active = bool;
    }
    /**改变剩余牌数 */
    changeCardCount(data) {
        this.cardCount.string = data + "";
    }
    /**设置钱包分数 */
    setScore(v) {
        this.lblZongjifen.string = GameUtils.formatGold(v);

    }
    /**离线 */
    activeOffline(bool) {
        this.sprStatus.active = bool && !GameUtils.isNullOrEmpty(this.playerData.prop);;
    }
    activeNiao(data) {
        console.log('鸟显示-1-', data)
        console.log('鸟显示-2-', data.readyStatus)
        console.log('鸟显示-3-', data.readyStatus.plus)
        if (GameUtils.isNullOrEmpty(data.readyStatus)) return;
        //打鸟显示
        if (data.readyStatus.plus) {
            this.niaoNode.active = true;
            this.niaoNode.scale = 0;
            // this.niaoNode.opacity=0;
            let ap = cc.fadeIn(0.5);
            let bp = cc.scaleTo(0.1, 3);
            let cp = cc.scaleTo(0.3, 0.2);
            let dp = cc.scaleTo(0.1, 1);
            let ep = cc.sequence(bp, cc.delayTime(0.3), cp, dp);
            let fp = cc.spawn(ap, ep);
            this.niaoNode.runAction(ep);

        } else {

            this.niaoNode.active = false;

        }

    }
    /**炸弹改变积分 */
    showBombScores(index, wallet, value, callBack) {
        //改变总积分显示
        this.lblZongjifen.string = GameUtils.formatGold(wallet);

        if (value < 0) {
            this.scoreChange.getComponent(cc.Label).font = this.loseFont;
            this.scoreChange.getComponent(cc.Label).string = GameUtils.formatGold(value);

        } else {
            this.scoreChange.getComponent(cc.Label).font = this.winFont;
            this.scoreChange.getComponent(cc.Label).string = GameUtils.formatGold(value);

        }
        this.scoreChange.anchorX = index == 1 ? 1 : 0;
        this.scoreChange.position = index == 1 ? cc.v2(-81, -108) : cc.v2(79, -108);
        if (this.scoreChange)
            this.scoreChange.opacity = 0;
        this.scoreChange.active = true;
        let bp = cc.fadeIn(0.3);
        let cp = index == 1 ? cc.moveTo(0.3, cc.v2(-81, -65)) : cc.moveTo(0.3, cc.v2(79, -65));
        let fp = cc.spawn(bp, cp);
        let dp = cc.delayTime(1);
        let ep = cc.callFunc(() => {
            this.scoreChange.active = false;
            if (!GameUtils.isNullOrEmpty(callBack))
                callBack();
        })
        this.scoreChange.runAction(cc.sequence(fp, dp, ep));
    }
    showClock(value) {
        // let a = new cc.Label();
        console.log('显示倒计时', value);

        let labelNode = this.clock.getChildByName("time").getComponent(cc.Label)
        labelNode.string = GameUtils.isNullOrEmpty(value) ? "15" : "" + parseInt(value);
        let times = GameUtils.isNullOrEmpty(value) ? 15 : parseInt(value);
        labelNode.unscheduleAllCallbacks();
        this.clock.active = true;
        labelNode.schedule(() => {
            times--;
            this.clock.getChildByName("time").getComponent(cc.Label).string = Math.max(times, 0);
            if (times <= 5) {

            }
        }, 1);
    }
    hideClock() {
        console.log('隐藏倒计时');
        this.clock.getChildByName("time").getComponent(cc.Label).unscheduleAllCallbacks();
        this.clock.active = false;
    }

    /**上下游动画 
     * @param rank 排名
     * @param resume 是否为重连
     */
    finishAnim(rank, resume = false) {
        if (rank >= 3)
            return;
        this.rankSpr.spriteFrame = this.rankSfArr[rank];

        if (resume) {
            this.rankSpr.node.position = cc.v2(-19, 40);
            this.rankSpr.node.active = true;
            return;
        }
        let pos1 = cc.find("Canvas").convertToWorldSpaceAR(cc.v2(0, 0));
        let pos2 = this.node.convertToNodeSpaceAR(pos1);
        this.rankSpr.node.position = pos2;
        this.rankSpr.node.scale = 10;
        this.rankSpr.node.active = true;
        let bp = cc.scaleTo(0.3, 3);
        let cp = cc.scaleTo(0.3, 1);
        Cache.playSound("addScore");
        this.rankSpr.node.runAction(cc.sequence(bp, cc.delayTime(0.3), cc.spawn(cp, cc.moveTo(0.3, cc.v2(-19, 40)))));
    }
    zhuaCardAnim(card, resume = false) {

        this.zhuaCard.init(card);
        let pos = TableInfo.realIdx[this.playerData.idx] == 2 ? cc.v2(-158, 0) : cc.v2(0, 125)
        if (resume) {
            this.zhuaCard.node.position = pos;
            this.zhuaCard.node.active = true;
            return;
        }
        let pos1 = cc.find("Canvas").convertToWorldSpaceAR(cc.v2(0, 0));
        let pos2 = this.node.convertToNodeSpaceAR(pos1);
        this.zhuaCard.node.position = pos2;
        this.zhuaCard.node.scale = 10;
        this.zhuaCard.node.active = true;
        let bp = cc.scaleTo(0.3, 3);
        let cp = cc.scaleTo(0.3, 1);
        this.zhuaCard.node.runAction(cc.sequence(bp, cc.delayTime(0.3), cc.spawn(cp, cc.moveTo(0.3, pos))));

    }

    changeLocalAudio() {
        if (this.playerData.prop && this.playerData.prop.pid == App.Player.id) {
            this.muteLocal = !this.muteLocal;
            this.updateMute();
            agora && agora.muteLocalAudioStream(this.muteLocal);
        }
    }
    changAllRemoteAudio() {
        if (this.playerData.prop && this.playerData.prop.pid == App.Player.id) {
            this.muteRemote = !this.muteRemote;
            this.updateMute();
            agora && agora.muteAllRemoteAudioStreams(this.muteRemote)
        }
    }

    updateMute() {
        this.localAudioSpr.active = !this.muteLocal;
        this.allRemoteSprite.spriteFrame = this.muteRemote ? this.disableRemoteSprite : this.remoteSprite;
    }

    otherIconChange(mute) {
        this.localAudioSpr.active = !mute;
    }

    removePlayer() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

}


