
const { ccclass, property } = cc._decorator
import Fee from './Fee';
import { App } from "../../ui/hall/data/App";
import { GameConfig } from '../../../GameBase/GameConfig';
@ccclass
export default class Qjhh extends cc.Component {
    @property(Fee)
    fee = null
    @property(cc.Toggle)
    togglePersons = [];
    @property(cc.Node)
    //加减操作框 add or reduce
    scoreAr = null;
    @property(cc.Toggle)
    toggleScores = [];
    @property(cc.Toggle)
    toggleTurn = [];
    @property(cc.Toggle)
    toggleReward = [];
    @property(cc.Toggle)
    toggleQing = null;
    @property(cc.Toggle)
    toggleMo = null;
    @property(cc.Node)
    autoAr = null;
    @property(cc.Toggle)
    toggleAutoDisband = null;
    @property(cc.Toggle)
    toggleCheat = null;
    @property(cc.Label)
    lblTurnLbl = [];
    @property(cc.Node)
    //加减操作框 add or reduce
    nodeTips = [];
    colorLabel = [[64, 64, 64], [190, 31, 31]];
    defaultRules = {
        person: 2, //几人模式
        hard: false,  //癞子是否可变
        an: 4,    //暗杠几倍底分
        turn: 8,  //小局数
        xi: 10,   //下四个癞子 10倍底分  32倍底分
        qing: false,  //清一色
        mo: false,   //只允许自摸
        chong: true,  //热铳 强制选项
        auto: -1,   //托管
        autoDisband: false, 
        cheat: false,  //防作弊
        base: 5, //底分
    }
    gameType = 'QJHH'
    rules = {}
    onLoad() {
    }

    init(data = {}, fee = {}, mode) {
        if (mode == 'LEAGUE') {
            this.fee.init(fee)
            this.fee.node.active = true;
        }
        this.rules = { ...this.defaultRules, ...data  };
        // cc.log(this.rules);
        this.scoreAr.getComponent('SelectAr').init(
            [0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100],
            null, 
            this.rules, 
            'base'
        );
        let togglePerson = this.togglePersons[(this.rules.person - 2) * 2 + Number(this.rules.hard)];
        cc.log(this.rules.hard, this.rules.person);
        cc.log(togglePerson.node._name);
        togglePerson.isChecked = true;

        let toggleScore = this.toggleScores[this.rules.an / 2 - 1];
        toggleScore.isChecked = true;

        let toggleTurn = this.toggleTurn[this.rules.turn / 8 - 1];
        toggleTurn.isChecked = true;

        let toggleReward = this.toggleReward[this.rules.xi == 10 ? 0 : 1];
        toggleReward.isChecked = true;

        this.toggleQing.isChecked = this.rules.qing;
        this.onChangeQing(this.toggleQing);

        this.toggleMo.isChecked = this.rules.mo;
        this.onChangeMo(this.toggleMo);

        this.autoAr.getComponent('SelectAr').init(
            ['不托管', '60', '180', '300'],
            [-1, 60, 180, 300], 
            this.rules, 
            'auto'
        );

        this.toggleAutoDisband.isChecked = this.rules.autoDisband;
        this.onChangeAutoDisband(this.toggleAutoDisband);
        
        this.toggleCheat.isChecked = this.rules.cheat;
        this.onChangeCheat(this.toggleCheat);

    }

    onChangePerson() {
        this.togglePersons.forEach((t, i) => {
            let isChecked = t.isChecked;
            t.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.person = Math.floor(i / 2) + 2;
                this.rules.hard = (i % 2 ? true : false);
                this.lblTurnLbl[8].string = `8局 (${GameConfig.getRoomFee(this.gameType, '8', this.rules.person)}个元宝)`;
                this.lblTurnLbl[16].string = `16局 (${GameConfig.getRoomFee(this.gameType, '16', this.rules.person)}个元宝)`;
            }
        })
    }

    onChangeScore() {
        this.toggleScores.forEach((toggle, i) => {
            let isChecked = toggle.isChecked;
            toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.an = (i + 1) * 2;
            }
        })
    }

    onChangeTurn() {
        this.toggleTurn.forEach((toggle, i) => {
            let isChecked = toggle.isChecked;
            toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.turn = (i + 1) * 8;
            }
        })
    }

    onChangeReward() {
        this.toggleReward.forEach((toggle, i) => {
            let isChecked = toggle.isChecked;
            toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.xi = i == 0 ? 10 : 32;
            }
        })
    }

    onChangeQing(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.qing = isChecked;
    }

    onChangeMo(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.mo = isChecked;
    }

    onChangeAutoDisband(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.autoDisband = isChecked;
    }
    onChangeCheat(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('label').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.cheat = isChecked;
    }

    showTips(event, index) {
        // cc.log(event);
        if (index == -1) {
            this.nodeTips.forEach(node => node.active = false);
            event.target.active = false;
            return;
        }
        this.nodeTips[index].parent.active = true;
        this.nodeTips[index].active = true;
    }

    create() {
        return { rules: this.rules, gameType: this.gameType, fee: this.fee.output };
    }
}


