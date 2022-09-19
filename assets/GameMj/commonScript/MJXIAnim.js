import TableInfo from "../../Main/Script/TableInfo";
const PositionIdx = ['bottom', 'right', 'top', 'left'];

const { ccclass, property } = cc._decorator
@ccclass
export default class MJXIAnim extends cc.Component {

    @property( [cc.SpriteFrame])
    bombArr=[];
    startAnim() {
        this.node.getComponent(cc.Sprite).spriteFrame =TableInfo.options.rules.xi==10? this.bombArr[0]: this.bombArr[1];
        this.node.scale = 7;
        let ap = cc.scaleTo(0.3, 1);
        let bp = cc.moveBy(0.3, cc.v2(0, 100));
        let cp = cc.fadeOut(0.3);
        let ep = cc.spawn(bp, cp);
        let dp = cc.sequence(ap, cc.delayTime(0.3), ep, cc.callFunc(() => {
            if (this.node) {

                this.node.removeFromParent();

                this.node.destroy();
            }
        }))

        this.node.runAction(dp)
    }




}


