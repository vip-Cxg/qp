
const { ccclass, property } = cc._decorator
import Fee from './Fee'
import GameUtils from "../../common/GameUtils";
@ccclass
export default class Wsk extends cc.Component {
    @property(Fee)
    Fee = null

    // @property(cc.ToggleContainer)
    // togglePersons = null;

    @property(cc.Node)
    //底分加减操作框 add or reduce
    scoreAr = null;

    @property(cc.Node)
    //底子 add or reduce
    baseCredit = null;

    /** 局数选项 单选 */
    @property(cc.ToggleContainer)
    toggleTurn = null;

    /** 干锅带彩 单选 */
    @property(cc.ToggleContainer)
    toggleGgdc = null;

    /** 真五十K大过四炸 复选  */
    @property(cc.Toggle)
    toggleWsk = null;

    /** 尾游可以捡分 复选 */
    @property(cc.Toggle)
    toggleTail = null;

    /** 去掉34 复选 */
    @property(cc.Toggle)
    toggleRemove34 = null;

    /** 可观看队友手牌 复选 */
    @property(cc.Toggle)
    toggleTeammateHandsVisible = null;

    /** 有总炸分 复选 */
    @property(cc.Toggle)
    toggleFirstRound = null;
    

    /** 超时托管加减操作框 */
    @property(cc.Node)
    autoAr = null;

    /** 托管一局自动解散 复选 */
    @property(cc.Toggle)
    toggleAutoDisband = null;

    /** 防作弊 复选 */
    @property(cc.Toggle)
    toggleCheat = null;

    /** 禁止观战 复选 */
    @property(cc.Toggle)
    toggleBanObserver = null

    @property([cc.Node])
    nodeTips = [];

    colorLabel = [[64, 64, 64], [190, 31, 31]];
    
    defaultRules = {
        /** 人数 */
        person: 4,
        /** 底分 */
        base: 2,
        /** 底子 */
        baseCredit: 10,
        /** 局数 */
        turn: 3,
        /** 干锅带彩 */
        ggdc: 0,
        /** 真五十K大过四炸 */
        zwsk: true,
        /** 尾游可以捡分 */
        tail: true,
        /** 去掉34 */
        remove34: false,
        /** 观看队友手牌 */
        teammateHandsVisible: true,
        /** 总炸分 */
        firstRound:true,
        /** 超时托管 */
        auto: -1,
        /** 托管一局自动解散 */
        autoDisband: false,
        /** 防作弊 */
        cheat: false, 
        /** 禁止观战 */
        banObserver: false
    }

    gameType = 'WSK'
    rules = {}

    onLoad() {
        this._color = ['#4E6361', '#C13214'];
        // this.togglePersons.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'person'));
        this.toggleTurn.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'turn'));
        this.toggleGgdc.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggleContainer', 'ggdc'));
        this.toggleWsk.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'zwsk'));
        this.toggleTail.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'tail'));
        this.toggleRemove34.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'remove34'));
        this.toggleTeammateHandsVisible.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'teammateHandsVisible'));
        this.toggleAutoDisband.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'autoDisband'));
        this.toggleCheat.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'cheat'));
        this.toggleBanObserver.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'banObserver'));
        this.toggleFirstRound.checkEvents.push(GameUtils.eventHandle(this.node, 'onClickToggle', 'firstRound'));

    }

    init(data = {}, fee = {}, mode) {
        console.log("asdadsd",this.node.children)
        if (mode == 'LEAGUE') {
        console.log("1111",fee);
        console.log("222",this.Fee);

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


        this.baseCredit.getComponent('SelectAr').init(
            [10, 20, 50, 100, 200],
            null,
            this.rules,
            'baseCredit'
        );
        
        let toggleTurn = this.toggleTurn.toggleItems.find(t => t.node._name == this.rules.turn);
        toggleTurn.isChecked = true;
        this.onClickToggleContainer(toggleTurn, 'turn');

        let toggleGgdc = this.toggleGgdc.toggleItems.find(t => t.node._name == this.rules.ggdc);
        toggleGgdc.isChecked = true;
        this.onClickToggleContainer(toggleGgdc, 'ggdc');
        
        this.toggleWsk.isChecked = this.rules.zwsk;
        this.onClickToggle(this.toggleWsk, 'zwsk');

        this.toggleTail.isChecked = this.rules.tail;
        this.onClickToggle(this.toggleTail, 'tail');

        this.toggleFirstRound.isChecked = this.rules.firstRound;
        this.onClickToggle(this.toggleFirstRound, 'firstRound');

        this.toggleRemove34.isChecked = this.rules.remove34;
        this.onClickToggle(this.toggleRemove34, 'remove34');

        this.toggleTeammateHandsVisible.isChecked = this.rules.teammateHandsVisible;
        this.onClickToggle(this.toggleTeammateHandsVisible, 'teammateHandsVisible');

        this.autoAr.getComponent('SelectAr').init(
            ['不托管', '60', '180', '300'],
            [-1, 60, 180, 300], 
            this.rules, 
            'auto'
        );

        this.toggleAutoDisband.isChecked = this.rules.autoDisband;
        this.onClickToggle(this.toggleAutoDisband, 'autoDisband');

        this.toggleCheat.isChecked = this.rules.cheat;
        this.onClickToggle(this.toggleCheat, 'cheat');

        this.toggleBanObserver.isChecked = this.rules.banObserver;
        this.onClickToggle(this.toggleBanObserver, 'banObserver');
    }

    onClickToggle(target, field) {
        this.toggleFocus(target);
        this.rules[field] = target.isChecked;
    }

    onClickToggleContainer(target, field) {
        this.toggleFocus(target.node.parent.getComponent(cc.ToggleContainer));
        this.rules[field] = Number(target.node._name);
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


