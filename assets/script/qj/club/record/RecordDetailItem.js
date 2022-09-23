import { GameConfig } from "../../../../GameBase/GameConfig"
import Connector from "../../../../Main/NetWork/Connector";
import Cache from "../../../../Main/Script/Cache";
import { Social } from "../../../../Main/Script/native-extend";
import GameUtils from "../../../common/GameUtils"
import { App } from "../../../ui/hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class RecordDetailItem extends cc.Component {
    @property(cc.Label)
    lblIdx = null;

    @property(cc.Label)
    lblScores = [];

    @property(cc.Label)
    lblFileID = null;

    _color = ['#db5950', '#2EA63C']

    data = null
    init(data) {
        this.data = data;
        let { round, scores, fileID, strDate } = data;
        this.lblIdx.string = round;
        this.lblFileID.string = fileID + round;
        this.lblScores.forEach((lbl, i) => {
            if (i > scores.length - 1) {
                lbl.node.active = false;
            } else {
                lbl.string = (scores[i] >= 0 ? '+' : '') + App.transformScore(scores[i]);
                lbl.node.color = new cc.Color().fromHEX(this._color[scores[i] >= 0 ? 0 : 1])
            }
        })
    }

    onClickShare() {
        cc.log('onClickShare', this.data)
    }

    onClickCopy() {
        Social.setCopy(this.data.gameType +"|"+this.data.strDate + '/' + this.data.fileID + this.data.round + '.json');
        Cache.alertTip("回放码复制成功");
    }

    onClickPlay() {

        Connector.get(GameConfig.RecordUrl + this.data.strDate + '/' + this.data.fileID + this.data.round + '.json', "getJson", (resData) => {
            Cache.replayData = resData;
            console.log('回放数据: ', resData)
            if (resData == null) {
                Cache.alertTip("暂无回放");
                return;
            }
            // if (gameid == "") {
            //     Cache.alertTip("暂时无法播放");
            //     return
            // }
            switch (this.data.gameType) {
                case GameConfig.GameType.QJHH:
                    App.pop(GameConfig.pop.RecordGame16, { replayData: resData,gameType:this.data.gameType })

                    break;
                case GameConfig.GameType.QJHZMJ:
                    App.pop(GameConfig.pop.RecordGame19,  { replayData: resData,gameType:this.data.gameType })

                    break;
                case GameConfig.GameType.WSK:
                    App.pop(GameConfig.pop.RecordGame10, { replayData: resData,gameType:this.data.gameType })

                    break;
                case GameConfig.GameType.WSKBD:
                    App.pop(GameConfig.pop.RecordGame10,  { replayData: resData,gameType:this.data.gameType })

                    break;
                case GameConfig.GameType.PDK:
                    App.pop(GameConfig.pop.RecordGame07,  { replayData: resData,gameType:this.data.gameType })
                    break;
            }
        })

        // //播放
        // cc.loader.loadRes('QJHH1.json', (err, object) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     console.log("回放数据--", object.json)
        //     App.pop(GameConfig.pop.RecordGame16, { replayData: object.json })
        //     // App.pop(GameConfig.pop.RecordGame07,{replayData: object.json})
        // });

        // {
        //     "round": 4,
        //     "scores": [
        //         -2000,
        //         2000
        //     ],
        //     "fileID": "QJHH36232652KDRR2J",
        //     "strDate": "20220919"
        // }



        // return;

    }


}


