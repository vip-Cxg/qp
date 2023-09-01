const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import Avatar from "../../../ui/common/Avatar";

@ccclass
export default class HostStatisticsItem extends cc.Component {
    @property(Avatar)
    Avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblScore = null
    @property(cc.Label)
    lblTurn = null
    @property(cc.Label)
    lblBigWinnerCount = null
    @property(cc.Label)
    lblRemark = null

    data = null
    color = ['#3ebd3a', '#FC2B07']
    init(data) {
        this.data = data;
        
        let { turn = 0, user: { name = '', head = '',sumScore= 1,userID , score= 0  },  fee} = data;
        // turn: 2, fee: 500 , user: { name: '123', head: '', sumScore: 1, score: 0 }
        this.lblBigWinnerCount.string =  GameUtils.formatGold(score,0) ;
        this.lblTurn.string = turn;
        this.lblName.string = name;
        this.Avatar.avatarUrl = head;
        this.lblID.string = 'ID: '+userID;
        this.lblRemark.string = GameUtils.formatGold(fee) ;
        // let score = App.transformScore(sumScore);
        this.lblScore.string = GameUtils.formatGold(sumScore,0) ; ;//score > 0 ? `+${score}` : score;
        // this.lblScore.node.color = new cc.Color().fromHEX(score > 0 ? this.color[0] : this.color[1]);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
    }

    updateInfo({ data }) {
        if (data.userID == this.data.userID && data.remark) {
            this.lblRemark.string = data.remark;
        }
    }

    onClickRemark() {
        App.pop(GameConfig.pop.ChangeRemarkPop, this.data)
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
    }

    onClickDetail() {
        App.pop(GameConfig.pop.WinnerCountDetailPop, this.data)
    }
  
}