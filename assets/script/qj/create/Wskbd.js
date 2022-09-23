
const { ccclass, property } = cc._decorator
import Fee from './Fee'
import GameUtils from "../../common/GameUtils";
import { GameConfig } from '../../../GameBase/GameConfig';
@ccclass
export default class Wskbd extends cc.Component {
    @property(Fee)
    Fee = null

    @property(cc.ToggleContainer)
    togglePersons = null;

    @property(cc.Node)
    //加减操作框 add or reduce
    scoreAr = null;

    @property(cc.Node)
    autoAr = null;

    @property(cc.Node)
    firstRoundAr = null;

    @property(cc.ToggleContainer)
    toggleTurn = null;

    @property(cc.Toggle)
    toggleWsk = null;

    @property(cc.Toggle)
    toggleTail = null;

    @property(cc.Toggle)
    toggleFirstRound = null;

    @property(cc.Node)
    scoreFirstRound = null;

    @property(cc.Toggle)
    toggleAutoDisband = null;

    @property(cc.Toggle)
    toggleCheat = null;

    @property(cc.Toggle)
    toggleBanObserver = null

    @property(cc.Toggle)
    toggleExtractCards = null

    @property(cc.Label)
    lblTurnLbl = [];


    @property([cc.Node])
    nodeTips = [];

    //加减操作框 add or reduce
    colorLabel = [[64, 64, 64], [190, 31, 31]];
    
    defaultRules = {
        person: 2, //几人模式
        base: 2, //底分
        turn: 3,  //小局数
        zwsk: true,
        tail: true,
        firstRound: false,
        auto: -1,   //托管
        autoDisband: false,
        cheat: false,  //防作弊
        banObserver: false,
        extractCards: false
    }

    gameType = 'WSKBD'
    rules = {}

    onLoad() {
        this._color = ['#4E6361', '#C13214'];
        this.togglePersons.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'person'));
        this.toggleTurn.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'turn'));
        this.toggleWsk.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'zwsk'));
        this.toggleTail.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'tail'));
        this.toggleFirstRound.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'firstRound'));
        this.toggleAutoDisband.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'autoDisband'));
        this.toggleCheat.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'cheat'));
        this.toggleBanObserver.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'banObserver'));
        this.toggleExtractCards.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'extractCards'));
    }

    init(data = {}, fee = {}, mode) {
        if (mode == 'LEAGUE') {
            this.Fee.init(fee)
            this.Fee.node.active = true;
        }

        this.rules = { ...this.defaultRules, ...data };

        this.scoreAr.getComponent('SelectAr').init(
            [0.1, 0.2, 0.5, 1, 2, 5],
            null, 
            this.rules,
            'base'
        );

        // this.scoreFirstRound.getComponent('SelectAr').init(
        //     [5, 10, 15, 20, 25],
        //     null, 
        //     this.rules,
        //     'base'
        // );
        
        let togglePerson = this.togglePersons.toggleItems.find(t => t.node._name == this.rules.person);
        togglePerson.isChecked = true;
        this.onClickToggleContainer(togglePerson, 'person');

        let toggleTurn = this.toggleTurn.toggleItems.find(t => t.node._name == this.rules.turn);
        toggleTurn.isChecked = true;
        this.onClickToggleContainer(toggleTurn, 'turn');
        
        this.toggleWsk.isChecked = this.rules.zwsk;
        this.onClickToggle(this.toggleWsk, 'zwsk');

        this.toggleTail.isChecked = this.rules.tail;
        this.onClickToggle(this.toggleTail, 'tail');

        this.toggleFirstRound.isChecked = this.rules.firstRound;
        this.onClickToggle(this.toggleFirstRound, 'firstRound');

        this.toggleAutoDisband.isChecked = this.rules.autoDisband;
        this.onClickToggle(this.toggleAutoDisband, 'autoDisband');

        this.toggleCheat.isChecked = this.rules.cheat;
        this.onClickToggle(this.toggleCheat, 'cheat');

        this.toggleBanObserver.isChecked = this.rules.banObserver;
        this.onClickToggle(this.toggleBanObserver, 'banObserver');

        this.toggleExtractCards.isChecked = this.rules.extractCards;
        this.onClickToggle(this.toggleExtractCards, 'extractCards');

        this.autoAr.getComponent('SelectAr').init(
            ['不托管', '60', '180', '300'],
            [-1, 60, 180, 300], 
            this.rules, 
            'auto'
        );
    }

    onClickToggle(target, field) {
        this.toggleFocus(target);
        this.rules[field] = target.isChecked;
    }

    onClickToggleContainer(target, field) {
        this.toggleFocus(target.node.parent.getComponent(cc.ToggleContainer));
        this.rules[field] = Number(target.node._name);
        if (field == 'person') {
            if (this.rules[field] == 4) {
                this.toggleExtractCards.uncheck();
                this.toggleExtractCards.interactable = false;
            } else {
                this.toggleExtractCards.interactable = true;
            }
            this.lblTurnLbl[3].string = `3局 (${GameConfig.getRoomFee(this.gameType, '3', this.rules.person)}个元宝)`;
            this.lblTurnLbl[6].string = `6局 (${GameConfig.getRoomFee(this.gameType, '6', this.rules.person)}个元宝)`;
            this.lblTurnLbl[9].string = `6局 (${GameConfig.getRoomFee(this.gameType, '9', this.rules.person)}个元宝)`;
        }
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

    showTips(event, index) {
        if (index == -1) {
            this.nodeTips.forEach(node => node.active = false);
            event.target.active = false;
            return;
        }
        this.nodeTips[index].parent.active = true;
        this.nodeTips[index].active = true;
    }

    create() {
        return { rules: this.rules, gameType: this.gameType, fee: this.Fee.output };
    }
}


