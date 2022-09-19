
const { ccclass, property } = cc._decorator;
import GameUtils from "../../common/GameUtils";
import Fee from './Fee'
import SelectAr from './SelectAr'
import { GameConfig } from '../../../GameBase/GameConfig';
@ccclass
export default class Pdk extends cc.Component {
    @property(Fee)
    fee = null
    @property(SelectAr)
    scoreAr = null

    @property(cc.ToggleContainer)
    toggleContainerPerson = null

    @property(cc.ToggleContainer)
    toggleContainerTurn = null

    @property(cc.ToggleContainer)
    toggleContainerCards = null

    @property(cc.Toggle)
    toggleForce = null

    @property(cc.Toggle)
    toggleAlwaysHost = null

    @property(cc.Toggle)
    toggleHeartsThreeFirst = null

    @property(cc.Toggle)
    toggleShowRemainingCards = null

    @property(cc.Toggle)
    toggleChainThree = null

    @property(cc.Toggle)
    toggleThreeWithPair = null

    @property(cc.Toggle)
    toggleBombWithThree = null

    @property(cc.Toggle)
    toggleheartsTenHasBird = null

    @property(cc.Toggle)
    toggleCanSeperateBomb = null

    @property(cc.Toggle)
    toggleBombScore = null

    @property(cc.Toggle)
    toggleThreeAce = null

    @property(cc.Toggle)
    toggleCounterSpring = null

    @property(SelectAr)
    autoAr = null

    @property(cc.Toggle)
    toggleAutoDisband = null

    @property(cc.Toggle)
    toggleCheat = null

    @property(cc.Toggle)
    toggleAnonymous = null

    @property(cc.Toggle)
    toggleBanVoice = null

    @property(cc.Label)
    lblTurnLbl = [];

    gameType = 'PDK'

    defaultRules = {
        person: 2, //几人模式
        base: 1,  //底分
        turn: 8,  //小局数
        cards: 16,   //多少张牌
        force: true,  //要得起强制要 必打
        alwaysHost: false,   //连庄
        heartsThreeFirst: false,  //红桃叁先出
        showRemainingCards: false,   //显示剩余牌数
        chainThree: true,  //三连对
        threeWithPair: true,  //三带对
        bombWithThree: true, //可四带三
        heartsTenHasBird: false, //红桃10抓鸟
        canSeperateBomb: true, //炸弹可拆
        bombScore: true, //带炸弹分
        threeAce: false,  //3A为炸弹
        counterSpring: false, //可反春天
        auto: -1,
        autoDisband: false, //托管一局自动解散
        cheat: true,  //反作弊
        anonymous: false, //游戏内匿名
        banVoice: false  //禁止语音
    }
    onLoad() {
        this._color = ['#4E6361', '#C13214'];
        this.toggleContainerPerson.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'person'));
        this.toggleContainerTurn.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'turn'));
        this.toggleContainerCards.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'cards'));
        this.toggleForce.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'force'));
        this.toggleAlwaysHost.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickFirst', 'alwaysHost'));
        this.toggleHeartsThreeFirst.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickFirst', 'heartsThreeFirst'));
        this.toggleShowRemainingCards.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'showRemainingCards'));
        this.toggleChainThree.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'chainThree'));
        this.toggleThreeWithPair.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'threeWithPair'));
        this.toggleBombWithThree.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'bombWithThree'));
        this.toggleheartsTenHasBird.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'heartsTenHasBird'));
        this.toggleCanSeperateBomb.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'canSeperateBomb'));
        this.toggleBombScore.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'bombScore'));
        this.toggleThreeAce.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'threeAce'));
        this.toggleCounterSpring.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'counterSpring'));
        this.toggleAutoDisband.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'autoDisband'));
        this.toggleCheat.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'cheat'));
        this.toggleAnonymous.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'anonymous'));
        this.toggleBanVoice.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'banVoice'));
        // this.init();
    }

    init(data = {}, fee = {}, mode) {
        if (mode == 'LEAGUE') {
            this.fee.init(fee)
            this.fee.node.active = true;
        }

        cc.log(data);
        this._rules = { ...this.defaultRules, ...data };
        cc.log(this._rules);
        /** 初始化底分选择组件 */
        this.scoreAr.init(
            [0.1, 0.2, 0.5, 1, 2, 3, 5],
            null, 
            this._rules, 
            'base'
        );
 
        this.autoAr.init(
            ['不托管', '60', '180', '300'],
            [-1, 60, 180, 300], 
            this._rules, 
            'auto'
        );
        
        this.toggleContainerPerson.toggleItems.find(t => t.node._name == this._rules.person).check();
        this.toggleContainerTurn.toggleItems.find(t => t.node._name == this._rules.turn).check();
        this.toggleContainerCards.toggleItems.find(t => t.node._name == this._rules.cards).check();
        if (!this._rules.force) this.toggleForce.uncheck();
        if (!this._rules.alwaysHost) this.toggleAlwaysHost.uncheck();
        if (!this._rules.heartsThreeFirst) this.toggleHeartsThreeFirst.uncheck();
        if (!this._rules.showRemainingCards) this.toggleShowRemainingCards.uncheck();
        if (!this._rules.chainThree) this.toggleChainThree.uncheck();
        if (!this._rules.threeWithPair) this.toggleThreeWithPair.uncheck();
        if (!this._rules.bombWithThree) this.toggleBombWithThree.uncheck();
        if (!this._rules.heartsTenHasBird) this.toggleheartsTenHasBird.uncheck();
        if (!this._rules.canSeperateBomb) this.toggleCanSeperateBomb.uncheck();
        if (!this._rules.bombScore) this.toggleBombScore.uncheck();
        if (!this._rules.threeAce) this.toggleThreeAce.uncheck();
        if (!this._rules.counterSpring) this.toggleCounterSpring.uncheck();
        if (!this._rules.autoDisband) this.toggleAutoDisband.uncheck();
        if (!this._rules.cheat) this.toggleCheat.uncheck();
        if (!this._rules.anonymous) this.toggleAnonymous.uncheck();
        if (!this._rules.banVoice) this.toggleBanVoice.uncheck();
    }

    /** 更改Toggle label颜色 选中的为红色 */
    toggleFocus(target) {
        /** is toggleContainer */
        if (target instanceof cc.ToggleContainer) {
            target.toggleItems.forEach(t => {
                let isChecked = t.isChecked
                let lbl = t.node.getChildByName('lbl');
                lbl.color = new cc.Color().fromHEX(this._color[Number(isChecked)]);
            })
            return;
        } 
        /** toggle */
        let isChecked = target.isChecked
        let lbl = target.node.getChildByName('lbl');
        lbl.color = new cc.Color().fromHEX(this._color[Number(isChecked)]);
    }

    onClickFirst(target, field) {
        let parent = target.node.parent.getComponent(cc.ToggleContainer);
        parent.toggleItems.forEach(t => {
            let isChecked = t.isChecked;
            let lbl = t.node.getChildByName('lbl');
            lbl.color = new cc.Color().fromHEX(this._color[Number(isChecked)]);
            this._rules[t.node._name] = isChecked;
        })
    }

    onClickToggle(target, field) {
        this.toggleFocus(target);
        this._rules[field] = target.isChecked;
    }

    onClickToggleContainer(target, field) {
        this.toggleFocus(target.node.parent.getComponent(cc.ToggleContainer));
        this._rules[field] = Number(target.node._name);
        if (field == 'person') {
            if (target.node._name == 2) {
                this.toggleAlwaysHost.interactable = false;
                this.toggleHeartsThreeFirst.interactable = false;
                this.toggleAlwaysHost.node.opacity = 140;
                this.toggleHeartsThreeFirst.node.opacity = 140;
                this.toggleAlwaysHost.check();
                this.toggleHeartsThreeFirst.uncheck();
                this._rules.alwaysHost = true;
                this._rules.heartsThreeFirst = false;
            } else {
                this.toggleAlwaysHost.interactable = true;
                this.toggleHeartsThreeFirst.interactable = true;
                this.toggleAlwaysHost.node.opacity = 255;
                this.toggleHeartsThreeFirst.node.opacity = 255;
            }
            this.lblTurnLbl[6].string = `6局 (${GameConfig.getRoomFee(this.gameType, '6', this._rules.person)}个元宝)`;
            this.lblTurnLbl[8].string = `8局 (${GameConfig.getRoomFee(this.gameType, '8', this._rules.person)}个元宝)`;
            this.lblTurnLbl[10].string = `10局 (${GameConfig.getRoomFee(this.gameType, '10', this._rules.person)}个元宝)`;
            this.lblTurnLbl[16].string = `16局 (${GameConfig.getRoomFee(this.gameType, '16', this._rules.person)}个元宝)`;
        }
    }

    create() {
        cc.log(this._rules);
        return { rules: this._rules, gameType: this.gameType, fee: this.fee.output }; 
    }
}