const Connector = require("../../../Main/NetWork/Connector");
const Cache = require("../../../Main/Script/Cache");
const dataBase = require("../../../Main/Script/DataBase");
const utils = require("../../../Main/Script/utils");
const { App } = require("../../ui/hall/data/App");
 var { GameConfig } = require("../../../GameBase/GameConfig");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        walletBtn: cc.Node,
        // word1: cc.Node,
        // word2: cc.Node,
        tableItem: cc.Prefab,
        tableContent: cc.Node,
        avatar: require('../common/Avatar'),
        username: cc.Label,
        lblScore: cc.Label,
        userId: cc.Label,
        onlyWaitIcon: cc.Node,
        clubName: cc.Label,
        clubID: cc.Label,
        rewardNode: cc.Node,

        levelContainer: cc.Node,
        typeContainer: cc.Node,

        quickStartBtn: cc.Node,
        gameBtnItem: cc.Prefab,
        roomBtnItem: cc.Prefab,
        gameContent: cc.Node,
        roomContent: cc.Node,
        noticeBtn: cc.Node,
        proxyBtn: cc.Node,
        childBtn: cc.Node,
        userBtn: cc.Node,
        noticeNode: cc.Node,
        lblNotice: cc.Label,
        currentType: '',
        currentRoom: '',
        connecting: false,
        interval: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.addEvents();

        this.refreshUI();
    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.GAME_TYPE_CHANGE, this.renderRoom, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.ROOM_TYPE_CHANGE, this.selectRoom, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.CLUB_DATA_CHANGE, this.updateUI, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.CLUB_ROOM_CHANGE, this.refreshUI, this);
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.GAME_TYPE_CHANGE, this.renderRoom, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.ROOM_TYPE_CHANGE, this.selectRoom, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.CLUB_DATA_CHANGE, this.updateUI, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.CLUB_ROOM_CHANGE, this.refreshUI, this);
    },
    updateUI() {
        this.lblScore.string = App.Club.ClubScore;
        this.initNotice();
    },

    /**??????UI */
    refreshUI() {

        this.roomData = new Object();
        this.currentRoomData = new Object();

        this.connecting = true;
        Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: App.Club.CurrentClubID }, (data) => {
            this.connecting = true;
            if (!utils.isNullOrEmpty(data.club)) {

                //TODO ????????????????????????
                App.Club.ClubNotice = data.club.club.notice;
                App.Club.ClubBank = data.club.bank;
                App.Club.ClubScore = data.club.score;
                App.Club.ClubReward = data.club.reward;
                App.Club.ClubLevel = data.club.level;
                App.Club.CurrentClubRole = data.club.role;
                this.walletBtn.active = data.club.role == 'owner';
                this.rewardNode.active = data.club.role == 'owner' || data.club.role == 'proxy';



                this.avatar.avatarUrl = dataBase.player.head;
                this.userId.string = "ID: " + dataBase.player.id;
                this.username.string = utils.getStringByLength(dataBase.player.name);
                this.lblScore.string = App.Club.ClubScore;
                this.clubName.string = '' + data.club.club.name;
                this.clubID.string = 'ID: ' + data.club.club.id;



                if (data.club.role == 'user') {
                    this.noticeBtn.active = false;
                    this.proxyBtn.active = false;
                    this.childBtn.active = false;
                    this.userBtn.active = false;
                } else {
                    this.noticeBtn.active = true;
                    this.proxyBtn.active = true;
                    this.childBtn.active = true;
                    this.userBtn.active = true;
                }
                this.initNotice()
            }


            if (!utils.isNullOrEmpty(data.rooms)) {

                data.rooms.forEach((e) => {
                    if (utils.isNullOrEmpty(this.roomData[e.gameType]))
                        this.roomData[e.gameType] = [];
                    this.roomData[e.gameType].push(e);
                })
                let roomArr = {}
                for (let key in this.roomData) {
                    if (utils.isNullOrEmpty(roomArr[key]))
                        roomArr[key] = [];
                    this.roomData[key].forEach(e => {
                        roomArr[key].push(e.id);
                    });


                }

                for (let key in roomArr) {
                    let copyData = utils.deepcopyArr(this.roomData[key]);// [0];
                    let hallData = copyData[0];
                    hallData.id = roomArr[key];
                    hallData.name = '??????';
                    this.roomData[key].unshift(hallData)
                }
                console.log('??????????????????--add--', this.roomData);
                this.renderGame();
            } else {
                //TODO ???????????????
            }
        }, true, (err) => {
            Cache.showTipsMsg(err.message || '????????????????????????', () => {
                this.node.destroy();
            })
        })
        //TODO
    },



    initNotice() {
        if (utils.isNullOrEmpty(App.Club.ClubNotice)) return;
        this.noticeNode.active = true;
        this.lblNotice.string = App.Club.ClubNotice;
        setTimeout(() => {
            if (this.lblNotice) {
                this.lblNotice.node.stopAllActions();
                let distance = this.lblNotice.node.width + this.lblNotice.node.parent.width;
                let ap = cc.place(cc.v2(this.lblNotice.node.parent.width / 2, 0));
                let bp = cc.moveBy(distance / 100, cc.v2(-distance, 0));
                let cp = cc.sequence(ap, bp);
                let dp = cc.repeatForever(cp);
                this.lblNotice.node.runAction(dp);
            }
        }, 500)
    },
    renderGame() {
        this.gameContent.removeAllChildren();
        let firstKey = '';
        for (let key in this.roomData) {
            if (firstKey == '')
                firstKey = key;
            let gameBtn = cc.instantiate(this.gameBtnItem)
            gameBtn.getComponent('TableGameItem').initData(key);
            this.gameContent.addChild(gameBtn);
        }
        //TODO ???????????????????????????

        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.GAME_TYPE_CHANGE, firstKey)
    },
    renderRoom(e) {
        let gameType = e.data;
        this.currentType = gameType;
        this.currentRoomData = new Object();
        this.roomContent.removeAllChildren();
        this.roomData[gameType].forEach(e => {
            let roomBtn = cc.instantiate(this.roomBtnItem)
            roomBtn.getComponent('TableRoomItem').initData(e);
            this.roomContent.addChild(roomBtn);
        });
        //TODO ???????????????????????????
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.ROOM_TYPE_CHANGE, this.roomData[gameType][0])

    },

    selectRoom(e) {
        let roomData = e.data;
        this.currentRoomData = roomData;

        this.downloadTableData(roomData);

    },

    /**?????????????????? */
    downloadTableData(roomData) {
        let rooms = [];
        if (typeof (roomData.id) != "object") {
            rooms.push(roomData.id)
        } else {
            rooms = roomData.id;
        }

        this.connecting = true;
        //TODO  ????????????limit 
        Connector.request(GameConfig.ServerEventName.Tables, { rooms: rooms, clubID: App.Club.CurrentClubID }, (data) => {

            Cache.hideMask();
            this.connecting = false;
            this.interval = 0;

            if (data.success) {

                if (typeof (roomData.id) != "object") {
                    this.quickStartBtn.active = true;
                } else {
                    this.quickStartBtn.active = false;
                }

                let newArr = [];
                let index = 0;
                let tables = []
                newArr = data.rooms.map(room => (room.tables.map(strTable => {
                    let d = JSON.parse(strTable);
                    d.roomID = room.roomID;
                    return d;
                }))).reduce((p, i) => p.concat(i));
                newArr.sort(function (a, b) {
                    return utils.sortByProps(a, b, { "status": "desc", "players": "asc" });
                });
                console.log("???????????????----- ", JSON.stringify(newArr))
                this.tableData = newArr;
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.ROOM_TYPE_BTN_CHANGE, roomData);
                this.renderTableUI(roomData);
            }
        }, null, (err) => {
            this.connecting = false;
            this.interval = 0;
        })
    },
    /**??????????????? */
    onWaitTable() {
        
        if (utils.isNullOrEmpty(this.currentRoomData)) {
            return
        }

        this.onlyWaitIcon.active = !this.onlyWaitIcon.active;
        this.renderTableUI(this.currentRoomData);
    },

    renderTableUI(roomData) {
        console.log("roomData--",roomData)
        try {
            this.tableContent.removeAllChildren();
            if (typeof (roomData.id) != 'object') {
                let tableItem = cc.instantiate(this.tableItem);
                let firstTableData = {
                    "person": roomData.config.person, "players": [], "status": "WAIT", "roomID": roomData.id
                }
                tableItem.getComponent("ModuleTableItem").initData(firstTableData, roomData);
                this.tableContent.addChild(tableItem);
            }

            this.tableData.forEach((data, i) => {
                //?????????????????????????????????
                // if (GameConfig.IsLeague && roomData.gameType == GameConfig.GameType.XHZD && (data.status == GameConfig.GameStatus.WAIT || data.status == GameConfig.GameStatus.SUMMARY))
                //     return;
                //?????????

                if (this.onlyWaitIcon.active) {
                    if (data.status == GameConfig.GameStatus.WAIT || data.status == GameConfig.GameStatus.SUMMARY) {

                        let tableItem = cc.instantiate(this.tableItem);
                        tableItem.getComponent("ModuleTableItem").initData(data, roomData);
                        this.tableContent.addChild(tableItem);
                    }
                } else {
                    let tableItem = cc.instantiate(this.tableItem);
                    tableItem.getComponent("ModuleTableItem").initData(data, roomData);
                    this.tableContent.addChild(tableItem);
                }
            })
        } catch (error) {
            console.log('-?????????--??????--', error)
            //?????????  ????????????????????????  ??????????????????
        }

    },


    onQuickStart() {
        
        this.enterGame();
    },

    enterGame() {
        //TODO  ??????????????????
        let nowTime = new Date().getTime();
        if (nowTime - GameConfig.LastSocketTime < 2000) return;
        GameConfig.LastSocketTime = nowTime;

        // if (!dataBase.player.hasBind && !GameConfig.IsDebug) {
        //     Cache.alertTip("??????????????????????????????????????????");
        //     return;
        // }
        // if (Cache.location.lat == 0 && Cache.location.long == 0 && !GameConfig.IsDebug) {
        //     Cache.alertTip("??????????????????????????????????????????");
        //     return;
        // }

        utils.pop(GameConfig.pop.MatchPop, (node) => {
            node.getComponent("ModuleMatchPop").startMatch(this.currentRoomData.id);
        })


    },


    refreshTableData() {
        
        this.downloadTableData(this.currentRoomData);
    },
    /**??????*/
    openNotice() {
        
        utils.pop(GameConfig.pop.ClubNoticePop)

    },
    /**???????????? */
    openClubUserList() {
        
        utils.pop(GameConfig.pop.ClubUserListPop)
    },
    /**??????*/
    openHistory() {
        
        utils.pop(GameConfig.pop.ClubHistoryListPop, (node) => {
            node.getComponent('ClubHistoryListPop').initUserID(dataBase.player.id);
        });

    },
    /**?????????*/
    openClubBank() {
        
        utils.pop(GameConfig.pop.ClubBankPop)
    },
    /**??????*/
    openClubReward() {
        
        utils.pop(GameConfig.pop.ClubRewardPop)
    },
    /**???????????????*/
    openProxyList() {
        
        utils.pop(GameConfig.pop.ClubProxyListPop, (node) => {
            node.getComponent('ClubProxyListPop').initUserID(dataBase.player.id);
        })
    },
    /**????????????*/
    openChildUser() {
        
        utils.pop(GameConfig.pop.ChildUserListPop, (node) => {
            node.getComponent('ChildUserListPop').initUserID(dataBase.player.id);
        })
    },
    openInfoPop() {
        
        utils.pop(GameConfig.pop.InfoPop);
    },
    openWalletPop() {
        
        utils.pop(GameConfig.pop.ClubWalletListPop);
    },

    /**???????????? */
    onClickClose() {
        

        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.JUDGE_TIPS);
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    onDestroy() {

        this.removeEvents();
    },
    update(dt) {
        this.interval++;
        if (utils.isNullOrEmpty(this.currentRoomData))
            return;
        if (this.currentType == '')
            return;
        if (this.connecting)
            return;

        if (this.interval >= 1800) {
            this.interval = 0;
            this.downloadTableData(this.currentRoomData);
        }
    }
});

