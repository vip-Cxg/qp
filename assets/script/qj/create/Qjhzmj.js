
const { ccclass, property } = cc._decorator
import Fee from './Fee'
import { GameConfig } from '../../../GameBase/GameConfig';
@ccclass
export default class Qjhh extends cc.Component {
    @property(Fee)
    fee = null
    @property(cc.ToggleContainer)
    togglePersons = null;
    @property(cc.Node)
    //加减操作框 add or reduce
    scoreAr = null;
    @property(cc.ToggleContainer)
    toggleTurn = null;
    @property(cc.ToggleContainer)
    toggleEastWind = null;
    @property(cc.Toggle)
    toggleMo = null;
    @property(cc.Toggle)
    toggleXi = null;
    @property(cc.Node)
    autoAr = null;
    @property(cc.Toggle)
    toggleAutoDisband = null;
    @property(cc.Toggle)
    toggleCheat = null;
    @property(cc.ToggleContainer)
    toggleWind = null;
    @property(cc.Label)
    lblTurnLbl = [];

    @property([cc.Node])
    nodeTips = [];
    
    //加减操作框 add or reduce
    colorLabel = [[64, 64, 64], [190, 31, 31]];
    defaultRules = {
        person: 2, //几人模式
        turn: 8,  //小局数
        /** 几个东风 */
        eastWind: 0,
        /** 杠几个 */
        wind: 0,
        /** 喜相逢 */
        xi: 30,  
        /** 只许自摸 */
        mo: false,
        chong: true,  //热铳 强制选项
        auto: -1,   //托管
        autoDisband: false,
        cheat: false,  //防作弊
        base: 5, //底分
    }
    gameType = 'QJHZMJ'
    rules = {}
    onLoad() {
    }

    init(data = {}, fee = {}, mode) {
        if (mode == 'LEAGUE') {
            this.fee.init(fee)
            this.fee.node.active = true;
        }
        // if (mode == 'CUSTOM') {
        //     let str = cc.sys.localStorage.getItem(`CREATE:CACHE:${this.gameType}`);
        //     data = App.parse(str) || {};
        // }
        this.rules = { ...this.defaultRules, ...data  };
        this.scoreAr.getComponent('SelectAr').init(
            [0.2, 0.5, 1, 2, 2.5, 5, 10],
            null, 
            this.rules, 
            'base'
        );
        
        let togglePerson = this.togglePersons.toggleItems.find(t => t.node._name == this.rules.person);
        togglePerson.check();

        let toggleTurn = this.toggleTurn.toggleItems.find(t => t.node._name == this.rules.turn);
        toggleTurn.check();
        
        let toggleEastWind = this.toggleEastWind.toggleItems.find(t => t.node._name == this.rules.eastWind);
        toggleEastWind.check();

        let toggleWind = this.toggleWind.toggleItems.find(t => t.node._name == this.rules.wind);
        toggleWind.check();

        this.toggleMo.isChecked = this.rules.mo;
        this.onChangeMo(this.toggleMo);
        if (this.rules.mo) {
            this.modifyToggleStatus();
        }

        this.toggleXi.isChecked = this.rules.xi > 0;
        this.onChangeXi(this.toggleXi);

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

    onChangeWind() {
        this.toggleWind.toggleItems.forEach((t, i) => {
            let isChecked = t.isChecked;
            t.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.wind = Number(t.node._name);
            }
        })
    }

    modifyToggleStatus(status = 0) {
        if (!status) {
            this.toggleWind.toggleItems[0].check();
        }
        this.toggleWind.node.opacity = status ? 255 : 140;
        this.toggleWind.toggleItems.forEach(t => {
            t.interactable = Boolean(status);
        })
    }

    onChangeEastWind() {
        this.toggleEastWind.toggleItems.forEach((t, i) => {
            let isChecked = t.isChecked;
            t.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.eastWind = Number(t.node._name);
            }
        })
    }

    onChangePerson() {
        this.togglePersons.toggleItems.forEach((t, i) => {
            let isChecked = t.isChecked;
            t.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.person = Number(t.node._name);
                this.lblTurnLbl[8].string = `8局 (${GameConfig.getRoomFee(this.gameType, '8', this.rules.person)}个元宝)`;
                this.lblTurnLbl[16].string = `16局 (${GameConfig.getRoomFee(this.gameType, '16', this.rules.person)}个元宝)`;
            }
        })
    }

    onChangeTurn() {
        this.toggleTurn.toggleItems.forEach((t, i) => {
            let isChecked = t.isChecked;
            t.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
            if (isChecked) {
                this.rules.turn = Number(t.node._name);
            }
        })
    }

    onChangeMo(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.mo = isChecked;
        this.modifyToggleStatus(!isChecked);
    }

    onChangeXi(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.xi = isChecked ? 30 : 0;
    }

    onChangeAutoDisband(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.autoDisband = isChecked;
    }
    onChangeCheat(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('lbl').color = new cc.color(...this.colorLabel[isChecked? 1 : 0]);
        this.rules.cheat = isChecked;
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
        return { rules: this.rules, gameType: this.gameType, fee: this.fee.output };
    }
}


