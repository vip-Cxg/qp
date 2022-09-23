
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class GameRecordItem extends cc.Component {
    @property(cc.Label)
    lblTableID = null

    @property(cc.Label)
    lblRules = null

    @property(cc.Label)
    lblDate = null

    @property(cc.Sprite)
    sprType = null

    @property(cc.Node)
    nodePlayers = []

    @property(cc.SpriteFrame)
    spriteFrameType = []

    data = null

    init(data) {
        console.log("回放",data)
        this.data = data;
        let { createdAt, data: { details, players }, gameType, tableID, person } = data;
        this.lblDate.string = new Date(createdAt).format('yyyy/MM/dd hh:mm:ss');
        this.lblTableID.string = '房号:' + tableID;
        this.lblRules.string = '玩法:' + GameConfig.GameName[gameType];
        this.sprType.spriteFrame = this.spriteFrameType[person];
        let tmpPlayer = players.slice().sort((a, b) => b.total - a.total);
        let winnerTotal = tmpPlayer[0].total;
        let loserTotal = tmpPlayer[tmpPlayer.length - 1].total;

        players.forEach((p, i) => {
            p.maxScore = winnerTotal;
            this.initPlayer(p, i, winnerTotal, loserTotal);
        })
    }

    initPlayer(data, idx, winnerTotal, loserTotal) {
        let color = ['#DC584C', '#039E1F'];
        let node = this.nodePlayers[idx];
        node.active=true;
        let { prop: { name, head }, total } = data;
        let avatar = node.getChildByName('Avatar').getComponent('Avatar');
        let lblName = node.getChildByName('lblName').getComponent(cc.Label);
        let lblScore =  node.getChildByName('lblScore').getComponent(cc.Label);
        let nodeWinner = node.getChildByName('sprWinner');
        let nodeLoser = node.getChildByName('sprLoser');
        avatar.avatarUrl = head;
        lblName.string = name;
        lblScore.string = (total >= 0 ? '+' : '') + App.transformScore(total);
        lblScore.node.color = new cc.Color().fromHEX(color[Number(total >= 0)]);
        if (total == 0) {
            nodeWinner.active = false;
            nodeLoser.active = false;
        } else if (total == winnerTotal) {
            nodeWinner.active = true;
            nodeLoser.active = false;
        } else if (total == loserTotal) {
            nodeWinner.active = false;
            nodeLoser.active = true;
        }
        
    }

    onClickShare() {
        App.pop(GameConfig.pop.SharePop);
    }

    onClickCheck() {
        App.pop(GameConfig.pop.RecordDetailPop, this.data);
    }

   

}


