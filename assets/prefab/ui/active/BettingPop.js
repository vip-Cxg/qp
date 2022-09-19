import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import { length } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import DataBase from "../../../Main/Script/DataBase";
import BettingPre from "../../../script/ui/active/BettingPre";
import { App } from "../../../script/ui/hall/data/App";
const BET_STATUS = {
    WAIT: 'wait',
    DONE: 'done',
    DRAW: 'draw'
}
const STATUS_DESC = {
    'wait': '投注进行中: ',
    'done': '下期倒计时: ',
    'draw': '等待开奖中: ',
}
const { ccclass, property } = cc._decorator
@ccclass
export default class BettingPop extends cc.Component {



    @property(cc.EditBox)
    amountInput = null;


    @property(cc.Toggle)
    togOdd = null;

    @property(cc.Label)
    lblTotalAmount = null;

    @property([cc.Label])
    ballArr = [];

    @property(cc.Sprite)
    oddSpr = null;
    @property(cc.Sprite)
    evenSpr = null;
    @property(cc.SpriteFrame)
    redSf = null;

    @property(cc.Label)
    lblStatus = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Label)
    lblTurn1 = null;
    @property(cc.Label)
    lblTurn2 = null;


    @property(cc.Label)
    lblAmount = null;
    @property(cc.Label)
    lblEven = null;
    @property(cc.Label)
    lblOdd = null;


    @property([cc.Node])
    rankArr = [];



    @property(cc.Toggle)
    notips = null;
    @property(BettingPre)
    betPre = null;

    @property(cc.Label)
    lblRate1 = null;
    @property(cc.Label)
    lblRate2 = null;
    @property(cc.Label)
    lblRate3 = null;
    @property(cc.Label)
    lblRate4 = null;

    @property(cc.Node)
    oddTips = null;
    @property(cc.Node)
    evenTips = null;
    @property(cc.Label)
    lblOddTips = null;
    @property(cc.Label)
    lblEvenTips = null;


    @property(cc.Node)
    newTips = null;
    @property(cc.Node)
    vipContent = null;
    @property(cc.ProgressBar)
    vipProgress = null;
    @property([cc.SpriteFrame])
    vipSprArr = [];
    @property(cc.Sprite)
    vipIcon = null;
    @property(cc.Node)
    vip2Icon = null;
    @property(cc.Node)
    vip3Icon = null;
    @property(cc.Label)
    totalWallet = null;
    @property(cc.Label)
    childWallet = null;

    matchDowntime = 0;
    interval = 0;
    currentType = -1;
    // use this for initialization
    onLoad() {
        this.notips.isChecked = !GameUtils.getValue(GameConfig.StorageKey.BettingPopTips, true);
        if (!GameUtils.isNullOrEmpty(GameConfig.BetConfig)) {

            this.lblTurn1.string = '第' + (GameConfig.BetConfig.serialID || 1) + '期';
            this.lblTurn2.string = '第' + (GameConfig.BetConfig.serialID || 1) + '期投注';
            this.matchDowntime = GameUtils.getTimeStamp(GameConfig.BetConfig.endDate);
            this.lblStatus.string = '' + (STATUS_DESC[GameConfig.BetConfig.status] || '');
        }
        if (GameUtils.isNullOrEmpty(GameConfig.BetResult)) {
            this.betPre.node.active = false;

        } else {
            this.betPre.node.active = true;
            this.betPre.renderUI(GameConfig.BetResult);
        }
        this.renderUI(false);
    }
  
    renderUI(showTips) {
        Connector.request(GameConfig.ServerEventName.BettingInfo, {}, (data) => {
            GameConfig.BetRate = data.rate;
            this.lblAmount.string = (Math.floor(data.amount / 100) || 0) + '元';
            this.lblEven.string = '已投注 ' + (Math.floor(data.even / 100) || 0) + '元';
            this.lblOdd.string = '已投注 ' + (Math.floor(data.odd / 100) || 0) + '元';

            this.oddTips.active = data.even > data.odd;
            this.evenTips.active = data.odd > data.even;

            this.vipIcon.spriteFrame = this.vipSprArr[data.vip]

            if (data.vip && data.vip != 0) {
                this.vipContent.active = true;
                this.newTips.active = false;
                
                this.totalWallet.string = '我的累计可投注额 ' + (Math.floor(data.totalAmount / 100) || 0) + '元';
                this.childWallet.string = '下级总可投注额 ' + (Math.floor(data.subAmount / 100) || 0) + '元';
                let process =( data.subAmount / (data.totalAmount * 2))||0;

                if (process >= 1)
                    process = 1;
                this.vip2Icon.color = process >= 0.5 ? new cc.color(255, 255, 255) : new cc.color(100, 100, 100);
                this.vip3Icon.color = process >= 1 ? new cc.color(255, 255, 255) : new cc.color(100, 100, 100);
                this.vipProgress.progress = process;
            } else {
                this.newTips.active = true;
                this.vipContent.active = false;
            }



            this.lblOddTips.string = '再投注《单》   ' + Math.floor((data.even - data.odd) / 100) + '元即可100%获得' + Math.floor((data.even * GameConfig.BetRate) / 100) + '元'
            this.lblEvenTips.string = '再投注《双》   ' + Math.floor((data.odd - data.even) / 100) + '元即可100%获得' + Math.floor((data.odd * GameConfig.BetRate) / 100) + '元'
            if (showTips && data.odd != data.even) {
                let tipStr = '';
                if (data.even > data.odd)
                    tipStr = '再投注《单》' + Math.floor((data.even - data.odd) / 100) + '元即可100%获得' + Math.floor((data.even * GameConfig.BetRate) / 100) + '元';
                if (data.odd > data.even)
                    tipStr = '再投注《双》' + Math.floor((data.odd - data.even) / 100) + '元即可100%获得' + Math.floor((data.odd * GameConfig.BetRate) / 100) + '元';
                Cache.showTipsMsg(tipStr)
            }

            if (data.odd != data.even)
                this.startTipsAnim(data.odd - data.even)

            this.lblTotalAmount.string = (Math.floor((data.oddSum + data.evenSum) / 100) || 0) + '元';


            this.lblRate1.string = '1赔' + (GameConfig.BetRate || 1);
            this.lblRate2.string = '1赔' + (GameConfig.BetRate || 1);
            this.lblRate3.string = '1赔' + (GameConfig.BetRate || 1);
            this.lblRate4.string = '1赔' + (GameConfig.BetRate || 1);





            if (!GameUtils.isNullOrEmpty(data.history)) {
                this.ballArr.forEach((element, index) => {
                    element.string = data.history[index];
                });

                let lastNum = parseInt(data.history[6]);
                if (lastNum % 2 == 0) {
                    this.evenSpr.spriteFrame = this.redSf;
                } else {
                    this.oddSpr.spriteFrame = this.redSf;
                }

            }

            if (!GameUtils.isNullOrEmpty(data.rank)) {

                data.rank.forEach((e, i) => {
                    GameUtils.loadImg(e.user.head).then((res) => {
                        this.rankArr[i].getComponent(cc.Sprite).spriteFrame = res;
                    })
                    this.rankArr[i].getChildByName('name').getComponent(cc.Label).string = e.user.name.substr(0, 2) + '***';
                    this.rankArr[i].getChildByName('amount').getComponent(cc.Label).string = (e.reward / 100) + '元';
                })
            }

        })
    }
    startTipsAnim(diff) {
        // if()
        this.evenTips.stopAllActions();
        this.oddTips.stopAllActions();
        let ap = cc.scaleTo(0.5, 1.1);
        let bp = cc.scaleTo(0.5, 1);
        let cp = cc.sequence(ap, bp);
        let dp = cc.repeatForever(cp);
        diff > 0 ? this.evenTips.runAction(dp) : this.oddTips.runAction(dp);
    }
    selectType(e, v) {
        

        this.currentType = parseInt(v);
        console.log("---", this.currentType);
    }

    onConfirmBet(e, v) {
        
        let rule = /^[0-9]*$/;
        if (GameUtils.isNullOrEmpty(this.amountInput.string)) {
            Cache.alertTip('请输入金额');
            return;
        }
        if (!rule.test(this.amountInput.string)) {
            Cache.alertTip('请输入整数');
            return;
        }
        if (parseInt(this.amountInput.string) * 100 > DataBase.player.wallet) {
            Cache.showTipsMsg('钱包余额小于当前投注金额\n\n请在交易所中购买', () => {
                GameUtils.pop(GameConfig.pop.MarketPop);
            });
            return;
        }
        if (this.currentType == -1 && parseInt(this.amountInput.string) % 2 != 0) {
            Cache.alertTip('请输入偶数');
            return;
        }

        //-1 单双都压 
        // let betType = this.togOdd.isChecked ? 1 : 0;
        Connector.request(GameConfig.ServerEventName.BettingBuy, { amount: parseInt(this.amountInput.string) * 100, type: this.currentType }, (data) => {
            Cache.alertTip('投注成功');
            this.renderUI(true);
        }, true, (err) => {
            Cache.alertTip(err.message || '投注失败');

        })
    }

    openList() {
        
        GameUtils.pop(GameConfig.pop.BettingList, (node) => {
            node.getComponent('BettingList').renderList();
        })
    }
    openHistory() {
        
        GameUtils.pop(GameConfig.pop.BettingList, (node) => {
            node.getComponent('BettingList').renderHistory();
        })
    }
    openRule() {
        
        GameUtils.pop(GameConfig.pop.BettingList, (node) => {
            node.getComponent('BettingList').renderRule();
        })
    }

    openDetail() {
        
        GameUtils.pop(GameConfig.pop.BettingList, (node) => {
            node.getComponent('BettingList').renderDetail();
        })
    }

    onClickClose() {
        
        this.matchDowntime = 0;
        GameUtils.saveValue(GameConfig.StorageKey.BettingPopTips, !this.notips.isChecked)
        this.node.destroy();
    }

    updateConfig() {
        Connector.request(GameConfig.ServerEventName.BetConfig, {}, (data) => {
            try {
                if (!GameUtils.isNullOrEmpty(data.config)) {
                    GameConfig.BetRate = parseFloat(data.config.rate);
                    GameConfig.BetConfig = data.config;
                    this.matchDowntime = GameUtils.getTimeStamp(GameConfig.BetConfig.endDate);
                    this.lblStatus.string = '' + (STATUS_DESC[GameConfig.BetConfig.status] || '');
                    this.lblTurn1.string = '第' + (GameConfig.BetConfig.serialID || 1) + '期';
                    this.lblTurn2.string = '第' + (GameConfig.BetConfig.serialID || 1) + '期投注';

                } else {
                    GameConfig.BetRate = null;
                    GameConfig.BetConfig = null;
                }

                if (GameUtils.isNullOrEmpty(data.result)) {
                    this.betPre.node.active = false;

                } else {
                    GameConfig.BetResult = data.result;
                    this.betPre.node.active = true;
                    this.betPre.renderUI(GameConfig.BetResult);
                }
            } catch (error) {

            }

        }, false, null)
    }

    update(dt) {

        if (parseInt(this.matchDowntime) == 0) return;
        this.interval++;
        if (this.interval % 60 == 0) {
            this.interval = 0;
            let nowTime = GameUtils.getTimeStamp();
            let endTime = parseInt(this.matchDowntime);
            if (nowTime >= endTime) {
                this.matchDowntime = 0;
                this.lblTime.string = "";
                return
                this.updateConfig()
                return
            }
            this.lblTime.string = GameUtils.timeToString(Math.floor((endTime - nowTime) / 1000));
        }
    }

}


