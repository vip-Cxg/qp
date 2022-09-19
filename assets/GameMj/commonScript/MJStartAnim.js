import AudioCtrl from "../../Main/Script/audio-ctrl";
import Cache from "../../Main/Script/Cache";
import TableInfo from "../../Main/Script/TableInfo";
const PositionIdx = ['bottom', 'right', 'top', 'left'];

const { ccclass, property } = cc._decorator
@ccclass
export default class MJStartAnim extends cc.Component {
    @property(cc.Node)
    leftNode = null;
    @property(cc.Node)
    rightNode = null;
    @property(cc.Node)
    light1 = null;
    @property(cc.Node)
    light2 = null;



    startAnim() {
        this.leftNode.active=true;
        this.rightNode.active=true;
        this.leftNode.position=cc.v2(-cc.winSize.width/2-this.leftNode.width/2,0);
        this.rightNode.position=cc.v2(cc.winSize.width/2+this.rightNode.width/2,0);
        this.light2.scale=1;

        let ap = cc.moveTo(0.3, cc.v2(-353, 0));
        let bp = cc.moveTo(0.3, cc.v2(338, 0));
        let dp=cc.scaleTo(0.3,5);
        let ep=cc.fadeOut(0.3);
        let fp=cc.spawn(dp,ep);
        let gp=cc.sequence(fp,cc.callFunc(()=>{
            this.leftNode.active=false;
            this.rightNode.active=false;
            this.light1.active=false;
            this.light2.active=false;
        }))
        let cp=cc.sequence(bp,cc.callFunc(()=>{
            this.light1.active=true;
            this.light2.active=true;
            this.light2.runAction(gp)
        }))
        Cache.playSound('MJ_begin');

        this.leftNode.runAction(ap);

        this.rightNode.runAction(cp);
        

    }




}


