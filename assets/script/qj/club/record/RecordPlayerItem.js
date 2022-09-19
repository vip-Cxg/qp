import { GameConfig } from "../../../../GameBase/GameConfig"
import GameUtils from "../../../common/GameUtils"
import Avatar from "../../../ui/common/Avatar";
import { App } from "../../../ui/hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class RecordItem extends cc.Component {
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblScore = null
    @property(Avatar)
    avatar = null
    @property(cc.Sprite)
    sprCrown = null
    @property(cc.SpriteFrame)
    spriteFrameCrown = []
    color = ['#159320', '#d24843']
    init(data) {
        let { prop: { head, name, id }, total: score, maxScore = 0 } = data;
        this.lblName.string = name;
        this.lblID.string = `ID:${id}`;

        if (score >= 0) {
            this.lblScore.string = '+' + App.transformScore(score);
            this.lblScore.node.color = new cc.Color().fromHEX(this.color[0]);
        } else {
            this.lblScore.string = App.transformScore(score);
            this.lblScore.node.color = new cc.Color().fromHEX(this.color[1]);
        }
        this.avatar.avatarUrl = head;
        let isWinner = maxScore == score ? 1 : 0;
        this.sprCrown.spriteFrame = this.spriteFrameCrown[isWinner];
    }   
}


