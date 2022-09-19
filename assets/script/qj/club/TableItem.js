const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import moment from "../other/moment"
import Cache from "../../../Main/Script/Cache";

@ccclass
export default class TableItem extends cc.Component {

    /** 头像位置 */
    _headConfig = [
        [cc.v2(-113, 66), cc.v2(113, -35)],
        [cc.v2(-4, 90), cc.v2(86, -26), cc.v2(-86, -26)],
        [cc.v2(-113, 66), cc.v2(86, -26), cc.v2(-86, -26), cc.v2(86, 66)]
    ]

    @property(cc.SpriteFrame)
    spriteFrameTable = []

    @property(cc.SpriteFrame)
    spriteFrameCheat = []

    @property(cc.Sprite)
    spriteCheat = null

    @property(cc.Label)
    lblCheat = null

    _tableID = null;

    _tableData=null;

    onLoad() {
        this._sprTable = this.node.getChildByName('sprTable').getComponent(cc.Sprite);
        this._lblTitle = this.node.getChildByName('lblTitle').getComponent(cc.Label);
        this._lblBase = this.node.getChildByName('lblBase').getComponent(cc.Label);
        this._lblRule = this.node.getChildByName('lblRule').getComponent(cc.Label);
        this._lblTurn = this.node.getChildByName('lblTurn').getComponent(cc.Label);
        this._lblPlay = this.node.getChildByName('lblPlay').getComponent(cc.Label);
        this._heads = [];
        let headsNode = this.node.getChildByName('heads');
        headsNode._children.forEach(node => {
            this._heads.push(node.getComponent('Avatar'));
        })
        this.node.on('touchend', this.onClickTable.bind(this));
    }

    onClickTable() {

    }

    onClickTitle() {
        App.pop(GameConfig.pop.RuleDetailPop, this._tableData);
    }

    /**
     * 
     * @param {object} data 
     * @param {object[]} data.players
     * @param {string} data.status
     * @param {number} data.person
     * @param {string} data.gameType
     * @param {object} rule
     * @param {number} rule.base
     */
    init(data) {
        this._tableData=data;
        /** color 桌子颜色 0-蓝色 1-绿色 2-紫色 3-红色 */
        let { players, status, person, gameType, rules: { base, turn, title = '潜江晃晃', color = 0 }, tableID, round, createdAt } = data;
        this._sprTable.spriteFrame = this.spriteFrameTable[(person - 2) * 4 + color];
        this._tableID = tableID;
        this._lblTitle.string = title;
        this._lblBase.node.active = true;
        this._lblTurn.node.active = true;
        this._lblPlay.node.active = false;
        this._lblBase.string = `${base}分`;
        this._lblTurn.string = `${turn}局`;
        this._lblRule.string = title;
        let isLeague = App.Club.isLeague;
        /** 防作弊 */
        if (App.Club.mode == 1 && isLeague) {
            this.spriteCheat.node.active = true;
            this.spriteCheat.spriteFrame = this.spriteFrameCheat[color];
            this.lblCheat.string = `${status == 'WAIT' ? '匹配中' : '激战中'}   ${players.filter(p => p.prop).length}/${person}`
        }
        /** 激战中 */
        if (status != 'WAIT') {
            this._lblBase.node.active = false;
            this._lblTurn.node.active = false;
            this._lblPlay.node.active = true;
            this._lblRule.string = `${round}/${turn}局 ${moment().format('HH:mm')}`
        }
        players.forEach((player, i) => {
            if (Object.keys(player).length <= 0) return;
            let { head } = player;
            this._heads[i].node.setPosition(this._headConfig[person - 2][i]);
            this._heads[i].node.active = true;
            if (App.Club.mode != 1 || isLeague == 0) this._heads[i].avatarUrl = head;
        })

    }

    /**点击桌子  */
    onClickTable() {
        //TODO 进入游戏 可能会根据不同角色 桌子状态有不同方法
        this.enterGame();

    }
    enterGame() {
        let nowTime = new Date().getTime();
        if (nowTime - GameConfig.LastSocketTime < 2000) return;
        GameConfig.LastSocketTime = nowTime;
        //锁屏  防止双击
        App.lockScene();
        GameConfig.TableRoom = this._tableData;
        /** { club = { clubID: 0, isLeague: -1, roomID: -1  }, tableID, gameType, rules } */
        let { clubID, isLeague, roomID, tableID, gameType } = this._tableData;
        let questData = {
            club: {
                clubID,
                isLeague,
                roomID,
                oglClubID: App.Club.oglID
            },
            tableID,
            gameType
        }
        Connector.request(GameConfig.ServerEventName.JoinClubGame, questData, () => {
            App.unlockScene();
        }, 1, () => {
            App.unlockScene();
        })
        // Connector.request(GameConfig.ServerEventName.JoinClubGame, questData, (data) => {
        //     GameUtils.saveValue(GameConfig.StorageKey.LastRoomData, this._tableData);
        //     GameConfig.ShowTablePop = true;
        //     App.lockScene();
        //     Connector.connect(data, () => {
        //         GameConfig.CurrentGameType = data.data.gameType;
        //         DataBase.setGameType(DataBase.GAME_TYPE[data.data.gameType]);
        //         Connector.LogsClient(GameConfig.LogsEvents.SOCKET_LINK, { action: GameConfig.LogsActions.START_ENTER_SCENE, gametype: data.data.gameType })
        //         cc.director.loadScene(DataBase.TABLE_TYPE[data.data.gameType]);
        //     });
        // }, true, (err) => {
        //     App.unlockScene();
        //     GameUtils.instancePrefab(
        //         GameConfig.pop.ConfirmPop, 
        //         { 
        //             message: GameUtils.isNullOrEmpty(err.message) ? "进入游戏失败" : err.message,
        //             callback1: () => {
        //             }
        //         }
        //     );
        //     // Cache.showTipsMsg(GameUtils.isNullOrEmpty(err.message) ? "进入游戏失败" : err.message);

        // })
    }
}