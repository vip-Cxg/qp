import { GameConfig } from "../../../../GameBase/GameConfig"
import GameUtils from "../../../common/GameUtils"
import Avatar from "../../../ui/common/Avatar";
const { ccclass, property } = cc._decorator
@ccclass
export default class RecordHead extends cc.Component {
    @property(Avatar)
    avatar = null

    @property(cc.Label)
    lblName = null

    @property(cc.Sprite)
    sprWinner = null

    @property(cc.SpriteFrame)
    spriteFrameWinner = []

    init(data) {
        let { prop: { name, head }, total, maxScore } = data;
        this.lblName.string = name.slice(0, 5);
        this.avatar.avatarUrl = head;
        let isWinner = maxScore == total ? 1 : 0;
        this.sprWinner.spriteFrame = this.spriteFrameWinner[isWinner];
        this.node.active = true;
    }   




}


