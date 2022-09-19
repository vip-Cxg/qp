

import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import DataBase from "../../../Main/Script/DataBase";
import { Social } from "../../../Main/Script/native-extend";
import GameUtils from "../../common/GameUtils";
const { ccclass, property } = cc._decorator
@ccclass
export default class ClubHistoryDetailItem extends cc.Component {


    @property([cc.Label])
    tipsArr = [];
    @property(cc.Label)
    lblTurn = null;


    replayID = null;
    gameType = null;
    initData(data, i) {
        this.lblTurn.string = '' + data.turn;
        this.replayID = data.strDate + '/' + data.fileID + '_' + data.turn;
        data.score.scores.forEach((score, i) => {
            this.tipsArr[i].node.active = true;
            this.tipsArr[i].string = '' +GameUtils.formatGold( score);
        })

    }
    onClickCopy() {
        
        Cache.alertTip('复制 分享码 成功,可发送给他人');
        let firstIndex = this.replayID.indexOf('/');
        let endIndex = this.replayID.indexOf('_');
        let gametype = this.replayID.slice(firstIndex + 1, endIndex);
        Social.setCopy(this.replayID);
    }


    onClickHistory() {
        
        // http://192.168.1.102:8080/records/20211208/HNMJ_227830_QJE43TTC_1.json
        let firstIndex = this.replayID.indexOf('/');
        let endIndex = this.replayID.indexOf('_');
        let gametype = this.replayID.slice(firstIndex + 1, endIndex);
        let gameid = DataBase.GAME_TYPE[gametype]<10?'0'+DataBase.GAME_TYPE[gametype]:DataBase.GAME_TYPE[gametype];
        // Connector.get('http://hn.iyfxlfw.com/records/20211221/HNMJ_391141_CZE6H8KZ_1.json', "getJson", (resData) => {
        Connector.get(GameConfig.RecordUrl + 'records/' + this.replayID + '.json', "getJson", (resData) => {
            Cache.replayData = resData;
            console.log('回放数据: ', resData)
            if (resData == null) {
                Cache.alertTip("暂无回放");
                return;
            }
            if (gameid == "") {
                Cache.alertTip("暂时无法播放");
                return
            }
            cc.loader.loadRes(`Main/Prefab/replay${gameid}`, (err, prefab) => {
                if (!err) {
                    let nodeReplay = cc.instantiate(prefab);
                    nodeReplay.parent = cc.find('Canvas');
                    } else {
                    cc.log('error to load replay');
                }
            });
        });
    }


}


