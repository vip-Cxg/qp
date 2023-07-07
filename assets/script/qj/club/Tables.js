const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import moment from "../other/moment";

@ccclass
export default class Tables extends cc.Component {
    /** 桌子容器 */
    @property(cc.Node)
    content = null
    /** x桌激战中 */
    @property(cc.Label)
    lblTableCount = null

    @property(cc.Prefab)
    tableItem = null

    _config = {
        hideStarted: false,
        hideMahjong: false,
        hidePoker: false,
        hideInvite: false
    }

    /** TableItem 对象 */
    _tables = []
    _inRequest = false
    onLoad() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_TABLE_LIST, this.init, this);
    }

    onClickToggle(toggle) {
        let name = toggle.node._name;
        let isChecked = toggle.isChecked;
        switch (name) {
            case 'toggleHideStarted':
                this._config.hideStarted = isChecked;
                break;
            case 'toggleHideMahjong':
                this._config.hideMahjong = isChecked;
                break;
            case 'toggleHidePoker':
                this._config.hidePoker = isChecked;
                break;
            case 'toggleHideInvite':
                this._config.hideInvite = isChecked;
                break;
        }
        /** 记录配置 */
        cc.sys.localStorage.setItem('TABLES_CONFIG', JSON.stringify(this._config));
        this.requestTables();
    }

    /** 
     * @param {object}    data
     * @param {object[]}  data.tables  -桌子列表
     * @param {number}    data.count   -桌子总数
    */
    successCallback(data) {
        this._inRequest = false;
        let { tables, count, isLeague, timestamp } = data;
        if (isLeague != App.Club.isLeague) return;
        // return;

        try {
            

            this.lblTableCount.string = `${count}桌激战中`;
            this.content.removeAllChildren();
            let a = [
                {
                    players: [],
                    status: 'OPENPOP',
                    person: 4,
                    gameType: 'QJHH',
                    rules: { base: 0, turn: 0, title: '潜江晃晃', color: 0 },
                    specialTable:0,
                    tableID: 0,
                    round: 0
                },
                {
                    players: [],
                    status: 'OPENPOP',
                    person: 4,
                    gameType: 'QJHZMJ',
                    rules: { base: 0, turn: 0, title: '潜江红中麻将', color: 1 },
                    specialTable:0,
                    tableID: 0,
                    round: 0
                },
                {
                    players: [],
                    status: 'OPENPOP',
                    person: 4,
                    gameType: 'WSK',
                    rules: { base: 0, turn: 0, title: '五十K', color: 2 },
                    specialTable:0,
                    tableID: 0,
                    round: 0
                },
                {
                    players: [],
                    status: 'OPENPOP',
                    person: 4,
                    gameType: 'WSKBD',
                    rules: { base: 0, turn: 0, title: '五十K必打', color: 3 },
                    specialTable:0,
                    tableID: 0,
                    round: 0
                },
                {
                    players: [],
                    status: 'OPENPOP',
                    person: 3,
                    gameType: 'PDK',
                    rules: { base: 0, turn: 0, title: '跑得快', color: 4 },
                    specialTable:0,
                    tableID: 0,
                    round: 0
                },
            ]
            let b=[];
            let gameColor={
                'WSKBD':3,
                'WSK':2,
                'QJHZMJ':1,
                'QJHH':0,
                'PDK':4,
            }
            console.log("  App.Club.rooms",  App.Club.rooms)
            App.Club.rooms.forEach((item) => {
                let itemTable={
                    players: [],
                    status: 'WAIT',
                    person: item.person,
                    gameType: item.gameType,
                    roomID:item.roomID,
                    rules: { base: item.rules.base, turn: item.rules.turn, title: item.name , color: gameColor[item.gameType],baseCredit:item.rules.baseCredit },
                    tableID: 0,
                    clubID:item.clubID,
                    specialTable:1,
                    isLeague:item.isLeague,
                    round: 0
                }
                b.unshift(itemTable);
            });
            console.log("  b",  b)
           
            // tables.unshift(a);
            tables=a.concat(b).concat(tables)
            for (let table of tables) {
                let  item=cc.instantiate(this.tableItem);
                item.getComponent('TableItem').init(table);
                this.content.addChild(item);
                // this._tables.push(item.getComponent(item._name));
    
                // let node = App.instancePrefab(this.tableItem, table, this.content);
                // this._tables.push(node.getComponent(node._name));
            }
            // this.content.width = Math.ceil(this.content._children.length / 2) * 355;
            App.Club.updateTableMessage(timestamp);

        } catch (error) {
            
        }

    }

    requestTables() {
        if (!App.Club.needRequestTable || this._inRequest) {
            return;
        }
        this._inRequest = true;
        /** 请求服务器 拉取桌子列表 */
        Connector.request(
            GameConfig.ServerEventName.Tables,
            {
                clubID: App.Club.id,
                condition: this._config,
                isLeague: App.Club.isLeague
            },
            this.successCallback.bind(this),
            0,
            () => {
                console.log('fail', moment().format('HH:mm:ss'));
                this._inRequest = false;
            },
            4000
        );
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_TABLE_LIST, this.init, this);
    }

    /** 请求桌子状态 订阅俱乐部 */
    init() {
        /** 暂无房间sprite */
        this._nodeEmpty = this.node.getChildByName('sprEmpty');
        let layerBottom = this.node.getChildByName('layerBottom');
        /** 隐藏开始的桌子toggle */
        this._toggleHideStarted = layerBottom.getChildByName('toggleHideStarted').getComponent(cc.Toggle);
        /** 隐藏麻将的桌子toggle */
        this._toggleHideMahjong = layerBottom.getChildByName('toggleHideMahjong').getComponent(cc.Toggle);
        /** 隐藏扑克的桌子toggle */
        this._toggleHidePoker = layerBottom.getChildByName('toggleHidePoker').getComponent(cc.Toggle);
        /** 隐藏扑克的桌子toggle */
        this._toggleHideInvite = layerBottom.getChildByName('toggleHideInvite').getComponent(cc.Toggle);
        /** toggle监听 */
        this._toggleHideStarted.node.on('toggle', this.onClickToggle, this);
        this._toggleHideMahjong.node.on('toggle', this.onClickToggle, this);
        this._toggleHidePoker.node.on('toggle', this.onClickToggle, this);
        /** 读取缓存配置 */
        let config = cc.sys.localStorage.getItem('TABLES_CONFIG');
        config = GameUtils.parse(config);
        this._config = config || this._config;
        let { hideMahjong = false, hideStarted = false, hidePoker = false, hideInvite } = this._config
        /** 初始化配置 1.隐藏开始的桌子 2.隐藏麻将的桌子 3.隐藏扑克的桌子*/
        this._toggleHideStarted.isChecked = hideStarted;
        this._toggleHideMahjong.isChecked = hideMahjong;
        this._toggleHidePoker.isChecked = hidePoker;
        this._toggleHideInvite.node.active = App.Club.isLeague;
        this._toggleHideInvite.isChecked = hideInvite;
        this.unscheduleAllCallbacks();
        this.schedule(() => {
            this.requestTables();
        }, 1);
        this.requestTables();
    }
}