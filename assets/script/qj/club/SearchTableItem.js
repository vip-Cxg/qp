import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import { App } from "../../ui/hall/data/App";
import Cache from "../../../Main/Script/Cache";
import Avatar from "../../ui/common/Avatar";
import GameUtils from "../../common/GameUtils";
const { ccclass, property } = cc._decorator
@ccclass
export default class SearchTableItem extends cc.Component {

    @property([cc.Node])
    playerArr = []

    @property(cc.Label)
    lblBase = null
    @property(cc.Label)
    lblGameType = null
    @property(cc.Label)
    lblTableID = null


    _tableData = null;

    init(data) {
        this._tableData = data;


        data.players.forEach((player, index) => {
            this.playerArr[index].active = true;
            if (GameUtils.isNullOrEmpty(player)) return;

            let playerNode = this.playerArr[index];
            playerNode.getChildByName('Avatar').getComponent(Avatar).avatarUrl = player.head;
            playerNode.getChildByName('lblName').getComponent(cc.Label).string = player.name;
            playerNode.getChildByName('lblId').getComponent(cc.Label).string = 'ID: ' + player.pid;
        });

        this.lblTableID.string = '房间号: ' + data.tableID;
        this.lblGameType.string = '' + GameConfig.GameName[data.gameType];
        this.lblBase.string = '底分: ' + data.rules.base + (data.rules.baseCredit ? ' 底子: ' + data.rules.baseCredit : '');
        // {
        //     "players": [
        //         {},
        //         {}
        //     ],
        //     "status": "WAIT",
        //     "tableID": "361866",
        //     "person": 2,
        //     "createdAt": "2022-11-01 03:45:08",
        //     "mode": 0,
        //     "rules": {
        //         "person": 2,
        //         "turn": 8,
        //         "eastWind": 0,
        //         "wind": 0,
        //         "xi": 30,
        //         "mo": false,
        //         "chong": true,
        //         "auto": -1,
        //         "autoDisband": false,
        //         "cheat": false,
        //         "base": 5,
        //         "disband": 1,
        //         "color": 0,
        //         "title": "潜江红中麻将"
        //     },
        //     "round": 1,
        //     "gameType": "QJHZMJ",
        //     "fee": {
        //         "win": {
        //             "free": 0,
        //             "score": [
        //                 50,
        //                 100,
        //                 200,
        //                 500
        //             ],
        //             "winFee": [
        //                 5,
        //                 10,
        //                 15,
        //                 20
        //             ]
        //         },
        //         "isAA": true,
        //         "aaFee": 0,
        //         "limit": 0,
        //         "hostFee": 0,
        //         "payMode": 0,
        //         "hostFeeMode": 0
        //     },
        //     "isLeague": 1,
        //     "roomID": 258,
        //     "clubID": 770026
        // }







    }

    onClickDisband() {

        if(this._tableData.status=='WAIT'){
            Cache.alertTip('该房间未开始游戏')
            return;
        }

        App.confirmPop('是否解散房间 ' + this._tableData.tableID, () => {
            Connector.request(GameConfig.ServerEventName.DestroyTable, { roomID: this._tableData.roomID, gameType: this._tableData.gameType, tableID: this._tableData.tableID, clubID: App.Club.id, isLeague: App.Club.isLeague, oglClubID: App.Club.oglID }, (res) => {
                Cache.alertTip("解散成功");
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_TABLE_LIST);
            }, true, (err) => {
                Cache.alertTip(err.message || "解散失败");
            })
        })
    }

    onClickEnter() {
        let nowTime = new Date().getTime();
        if (nowTime - GameConfig.LastSocketTime < 2000) return;
        GameConfig.LastSocketTime = nowTime;
        //锁屏  防止双击
        App.lockScene();
        GameConfig.TableRoom = this._tableData;
        let { clubID, isLeague, roomID, tableID, gameType } = this._tableData;
        let questData = {
            club: {
                clubID,
                isLeague,
                roomID,
                oglClubID: App.Club.oglID
            },
            tableID,
            type: 0,
            gameType
        }
        Connector.request(GameConfig.ServerEventName.JoinClubGame, questData, () => {
            App.unlockScene();
        }, 1, () => {
            App.unlockScene();
        })
    }



}


