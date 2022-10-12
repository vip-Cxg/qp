
const { ccclass, property } = cc._decorator
import { GameConfig } from "../../../GameBase/GameConfig";
import { App } from "../../ui/hall/data/App";
import Qjhh from './Qjhh';
import Pdk from './Pdk';
import Qjhzmj from './Qjhzmj';
import Wskbd from './Wskbd';
import Wsk from './Wsk';
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
@ccclass
export default class CreatePop extends cc.Component {

    @property(cc.ToggleContainer)
    toggleGame = null;
    gameType = 'QJHH';
    listGameType = ['QJHH', 'QJHZMJ', 'PLYJ', 'WSK', 'WSKBD', 'PDK'];
    @property(cc.ScrollView)
    scrollViewGamePage = null;
    @property(Qjhh)
    qjhh = null
    @property(Pdk)
    pdk = null
    @property(Qjhzmj)
    qjhzmj = null
    @property(Wskbd)
    wskbd = null
    @property(Wsk)
    wsk = null
    @property(cc.ToggleContainer)
    toggleTopRule = null;
    room = null;
    mode = null
    ruleIndex = 0
    find(name) {
        return cc.find(`Canvas/${this.node._name}/bg/${name}`);
    }

    onLoad() {
        this._gamePage = {
            'qjhh': this.qjhh,
            'pdk': this.pdk,
            'qjhzmj': this.qjhzmj,
            'wskbd': this.wskbd,
            'wsk': this.wsk
        };
        this._game = this._gamePage['qjhh'];
        this.scrollViewGamePage.content = this._game.node;
        for (let g in this._gamePage) {
            this._gamePage[g].node.active = g == 'qjhh'
        }
        this._game.init();
        this._nodeBg = this.node.getChildByName('bg');
        // this.setGameType()
        this._btnClose = this.find('btnClose');
        this._btnClose.on('touchend', this.onClickClose.bind(this));
        /** 大厅创建按钮 */
        this._btnCreate = this.find('btnCreate');
        this._btnCreate.on('touchend', this.onClickCreate.bind(this));
        /** 茶馆/比赛场 保存按钮 */
        this._btnSave = this.find('btnSave');
        this._btnSave.on('touchend', this.onClickSave.bind(this));
        /** 底部玩法状态自动开房 */
        this._nodeBottom = this.find('nodeBottom');
        /** 底部玩法状态 */
        this._toggleRuleStatus = this.find('nodeBottom/toggleRuleStatus').getComponent(cc.Toggle);
        /** 底部自动开房 */
        this._toggleAutoCreate = this.find('nodeBottom/toggleAutoCreate').getComponent(cc.Toggle);

        this._toggleRuleStatus.node.on('toggle', this.onClickBottomToggle.bind(this));
        this._toggleAutoCreate.node.on('toggle', this.onClickBottomToggle.bind(this));
        /** 顶部玩法选择 */
        this._toggleTopRules = this.find('scrollViewRule/view/content/toggleTopRules');
        /** TEST */
        // Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: 146756}, this.testInit.bind(this));

        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_CREATE, this.updatePage, this)
    }

    updatePage() {
        if (this.mode == 'LEAGUE') {
            this.onClickClose();
            return;
        }
        this.init(this.mode);
    }

    /** 顶部玩法选择 */
    onClickTopRules(toggle) {
        const index = toggle.node._name;
        const rooms = App.Club.rooms;
        let room = rooms.find(r => r.index == index);
        this.ruleIndex = index;
        if (room) {
            let { isEnabled, auto, rules, gameType, fee } = room;
            this.room = room;
            let toggleGame = this.toggleGame.toggleItems.find(item => item.node._name == gameType.toLowerCase());
            // toggleGame.isChecked = true;
            this.onClickLeftGameToggle(toggleGame, rules, fee);
            /** 初始化下方玩法状态 */
            this._toggleRuleStatus.isChecked = isEnabled;
            this.onClickBottomToggle(this._toggleRuleStatus);
            this._toggleAutoCreate.isChecked = auto;
            this.onClickBottomToggle(this._toggleAutoCreate);
            return;
        }
        this.room = null;
        let toggleGame = this.toggleGame.toggleItems.find(item => item.node._name == 'qjhh');
        toggleGame.check();
        this._toggleRuleStatus.isChecked = true;
        this.onClickBottomToggle(this._toggleRuleStatus);
        this._toggleAutoCreate.isChecked = true;
        this.onClickBottomToggle(this._toggleAutoCreate);
    }

    /**
    * @param {string} mode  -CUSTOM-大厅创建  CLUB-茶馆创建  LEAGUE-比赛场创建 
    */
    
    init(mode = 'CUSTOM', roomID = 0) {
        if (mode == 'INIT') {
            this.node.active = false;
            this.node.destroy();
            return;
        }
        this.node.active = true;
        this.mode = mode;
        let toggleGame;
        switch (mode) {
            case 'CUSTOM':
                this._nodeBottom.active = false;
                this._btnSave.active = false;
                this._btnCreate.active = true;
                this.toggleTopRule.node.active = false;
                let lastGame = cc.sys.localStorage.getItem(`CREATE:CACHE:lASTGAME`) || 'QJHH';
                toggleGame = this.toggleGame.toggleItems.find(item => item.node._name == lastGame.toLowerCase());
                this.onClickLeftGameToggle(toggleGame);
                break;
            case 'CLUB':
                this.toggleTopRule.node.active = true;
                this._nodeBottom.active = true;
                this._btnCreate.active = false;
                this._btnSave.active = true;
                this.initTopSelection();
                let toggle = this.toggleTopRule.toggleItems.find(item => item.isChecked);
                /** 初始化第一个玩法页面 */
                this.onClickTopRules(toggle);
                break;
            case 'LEAGUE':
                this.toggleTopRule.node.active = false;
                this._nodeBottom.active = true;
                this._btnCreate.active = false;
                this._btnSave.active = true;
                let room = App.Club.rooms.find(r => r.roomID == roomID);
                let rules, fee, gameType = 'QJHH';
                if (room) {
                    this.room = room;
                    rules = this.room.rules;
                    fee = this.room.fee;
                    gameType = this.room.gameType;
                }
                toggleGame = this.toggleGame.toggleItems.find(item => item.node._name == gameType.toLowerCase());
                toggleGame.isChecked = true;
                this.onClickLeftGameToggle({ node: { _name: gameType.toLowerCase() } }, rules, fee);
                break
        }
    }

    /** 玩法状态toggle 自动开房toggle  */
    onClickBottomToggle(toggle) {
        let nodeBackground = toggle.node.getChildByName('background');
        nodeBackground.active = !toggle.isChecked;
    }

    /** 顶部玩法选择 */
    initTopSelection() {
        const rooms = App.Club.rooms;
        console.log("玩法--",GameConfig.CreateRules)
        this._toggleTopRules._children.forEach((node, i) => {
            let background = node.getChildByName('background');
            let checkmark = node.getChildByName('checkmark');
            let room = rooms.find(r => r.index == i);
            cc.log(room, 'room');
            if (room && room.isEnabled) {
                /**  玩法: 开 */ 
                background.getChildByName('name').getComponent(cc.Label).string='玩法'+(i+1)+' (开)'
                checkmark.getChildByName('name').getComponent(cc.Label).string='玩法'+(i+1)+' (开)'
                // background.spriteFrame = GameConfig.CreateRules[i * 4 + 2];
                // checkmark.spriteFrame = GameConfig.CreateRules[i * 4 + 3];

            } else {
                /**  玩法: 关 */
                background.getChildByName('name').getComponent(cc.Label).string='玩法'+(i+1)+' (关)'
                checkmark.getChildByName('name').getComponent(cc.Label).string='玩法'+(i+1)+' (关)'
                // background.spriteFrame = GameConfig.CreateRules[i * 4 + 0]; 
                // checkmark.spriteFrame = GameConfig.CreateRules[i * 4 + 1];
            }
        })
    }

    /** 初始化游戏规则选项 */
    onClickLeftGameToggle(toggle, data = {}, fee = {}) {
        toggle.isChecked = true;
        if (!this._gamePage[toggle.node._name]) {
            this._game = null;
            this.scrollViewGamePage.content.active = false;
            return;
        }
        this._game = this._gamePage[toggle.node._name];
        this.scrollViewGamePage.content.active = false;
        this._game.node.active = true;
        if (this.mode == 'CUSTOM') {
            let str = cc.sys.localStorage.getItem(`CREATE:CACHE:${this._game.gameType}`);
            data = App.parse(str) || {};
        }
        this._game.init(data, fee, this.mode);
        this.scrollViewGamePage.content = this._game.node;
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_CREATE, this.updatePage, this);
    }

    /**
     * 大厅创建
     */
    onClickCreate() {
        let { rules, gameType } = this._game.create();
        cc.sys.localStorage.setItem(`CREATE:CACHE:${gameType}`, JSON.stringify(rules));
        cc.sys.localStorage.setItem(`CREATE:CACHE:lASTGAME`, gameType);
        // cc.log(rules, gameType);
        Connector.request(GameConfig.ServerEventName.JoinClubGame, { club: { clubID: 0, isLeague: -1, roomID: -1 }, gameType, rules  });
    }

    createCallback(data) {
        Connector.connect(data, () => {
            let { data: { gameType } } = data;
            GameConfig.CurrentGameType = gameType;
            cc.director.loadScene(GameConfig.TABLE_TYPE[gameType]);
        });
    }

    /**
     * 茶馆/比赛场保存
     */
    onClickSave() {
        if (!this._game) {
            return;
        }
        let isEnabled = this._toggleRuleStatus.isChecked;
        /** 禁用玩法,无需弹窗,直接请求接口 */
        if (!isEnabled && !this.room) return;
        if (!isEnabled) {
            Connector.request(
                GameConfig.ServerEventName.GameRoom,
                { clubID: App.Club.id, roomID: this.room.roomID, isEnabled: 0 }, 
                this.successCallback.bind(this)
            );
            return;
        }
        let { rules, fee, gameType } = this._game.create()
        let auto = this._toggleAutoCreate.isChecked;
        let room = this.room;
        let isLeague = this.mode == 'LEAGUE';
        let person = rules.person;
        let base = rules.base;
        let index = this.ruleIndex;
        GameUtils.pop(GameConfig.pop.GameOptionPop, (node) => {
            node.getComponent(node._name).init({ base, person, isLeague, room, auto, rules, fee, gameType, index })
        });
    }

    successCallback(data) {
        GameUtils.alertTips('修改成功');
        let { rooms } = data;
        App.Club.rooms = rooms;
        this.init(this.mode);
    }
}


