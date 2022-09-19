 var { GameConfig } = require('../../../GameBase/GameConfig');
const Connector = require('../../../Main/NetWork/Connector');
const Cache = require('../../../Main/Script/Cache');
const DataBase = require('../../../Main/Script/DataBase');
const utils = require('../../../Main/Script/utils');
const { App } = require('../../ui/hall/data/App');
cc.Class({
    extends: cc.Component,

    properties: {
        avatar: [require('../../script/ui/common/Avatar')],
        player1: cc.Node,
        player2: cc.Node,
        player3: cc.Node,
        player4: cc.Node,
        statusNode: cc.Node,
        gameStatus: cc.Sprite,
        tableBg: cc.Sprite,
        inGame: cc.SpriteFrame,
        waitting: cc.SpriteFrame,
        customTable: cc.SpriteFrame,
        matchTable: cc.SpriteFrame,
        privateTable: cc.SpriteFrame,
        tableName: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
        this.refreshUI();
    },
    addEvents() {
    },
    removeEvents() {
    },
    /**更新UI */
    refreshUI() {
    },
    /**初始化数据 */
    initData(data, roomData, roomNameDict) {
        // this.PDKTips.active = roomData.gameType == GameConfig.GameType.PDK_SOLO;
        // this.tableName.node.y = roomData.gameType == GameConfig.GameType.PDK_SOLO ? 53 : 47
        // if (roomData.gameType == GameConfig.GameType.HZMJ_SOLO) {
        //     this.tableName.string = "" + roomData.name + "/8小局起";//+ GameConfig.GameName[roomData.gameType] 
        // } else {
        this.tableName.string = GameConfig.TableType[data.mode] + ' ' + roomNameDict.get(data.roomID);// roomData.name ;//+ (roomData.gameType == GameConfig.GameType.PDK_SOLO ? "/10小局起" : "");

        // }
        if (data.status == GameConfig.GameStatus.WAIT || data.status == GameConfig.GameStatus.SUMMARY) {
            this.gameStatus.spriteFrame = this.waitting;
        } else {
            this.gameStatus.spriteFrame = this.inGame;
        }
        switch (data.mode) {
            case 'CUSTOM':
                this.tableBg.spriteFrame = this.customTable;
                break;
            case 'MATCH':
                this.tableBg.spriteFrame = this.matchTable;
                break;
            case 'PRIVATE':
                this.tableBg.spriteFrame = this.privateTable;
                break;
        }

        this.statusNode.active = data.players.length != 0;
        // this.create.active = data.players.length == 0;

        this.player3.active = data.person >= 3;
        this.player4.active = data.person == 4;

        data.players.forEach((e, i) => {
            if (utils.isNullOrEmpty(e)) return;
            // if (GameConfig.IsLeague && data.person == 4) {
            //     this.avatar[i].avatarUrl = '';
            //     return;
            // }
            this.avatar[i].avatarUrl = e.head;

        });
        var self = this;

        if (data.status == GameConfig.GameStatus.WAIT || data.status == GameConfig.GameStatus.SUMMARY) {
            this.node.on(cc.Node.EventType.TOUCH_END, () => {
                //无法进入匹配模式的桌子
                if (!utils.isNullOrEmpty(data.matchID)) {
                    Cache.alertTip("无法加入有奖专区的牌桌");
                    return;
                }
                self.enterGame(data, roomData);
            }, this);
        } else if (App.Club.CurrentClubRole == 'owner' || App.Club.CurrentClubRole == 'manager') {
            this.node.on(cc.Node.EventType.TOUCH_END, () => {
                //无法进入匹配模式的桌子
                Cache.showConfirm('是否解散房间 ' + data.tableID, () => {
                    Connector.request(GameConfig.ServerEventName.DestroyTable, { roomID: data.roomID, gameType: roomData.gameType, tableID: data.tableID, clubID: App.Club.CurrentClubID }, (res) => {
                        Cache.alertTip("解散成功");
                        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.CLUB_ROOM_DESTROY);
                    }, true, (err) => {
                        Cache.alertTip(err.message || "解散失败");
                    })
                })
            }, this);
        }

    },

    enterGame(data, roomData) {
        console.log("桌子----", data)
        let nowTime = new Date().getTime();
        if (nowTime - GameConfig.LastSocketTime < 2000) return;
        GameConfig.LastSocketTime = nowTime;
        if (GameConfig.IsConnecting) {
            Cache.alertTip("正在进入房间");
            return;
        }
        GameConfig.TableRoom = roomData;

        if(App.Club.IsLeague&&roomData.gameType==GameConfig.GameType.XHZD){//联盟 新化炸弹进匹配
            utils.pop(GameConfig.pop.MatchPop, (node) => {
                node.getComponent("ModuleMatchPop").startMatch(data.roomID);
            })
            return;
        }


        GameConfig.IsConnecting = true;

        let questData = utils.isNullOrEmpty(data.tableID) ? { roomID: data.roomID, gameType: roomData.gameType, tableID: "", clubID: App.Club.CurrentClubID } : { roomID: data.roomID, gameType: roomData.gameType, tableID: data.tableID, clubID: App.Club.CurrentClubID };
        Connector.request(GameConfig.ServerEventName.JoinClubGame, questData, (data) => {
            utils.saveValue(GameConfig.StorageKey.LastRoomData, roomData);
            GameConfig.IsConnecting = false;
            GameConfig.ShowTablePop = true;
            Connector.connect(data, () => {
                GameConfig.CurrentGameType = data.data.gameType;
                DataBase.setGameType(DataBase.GAME_TYPE[data.data.gameType]);
                Connector.LogsClient(GameConfig.LogsEvents.SOCKET_LINK, { action: GameConfig.LogsActions.START_ENTER_SCENE, gametype: data.data.gameType })
                cc.director.loadScene(DataBase.TABLE_TYPE[data.data.gameType]);
            });
        }, true, (err) => {
            GameConfig.IsConnecting = false;
            Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "进入游戏失败" : err.message);

        })
    },

    onJoinTable() {

    },

    /**关闭弹窗 */
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    onDestroy() {
        this.removeEvents();
    }

});