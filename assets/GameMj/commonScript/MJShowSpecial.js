
const { ccclass, property } = cc._decorator
@ccclass
export default class MJShowSpecial extends cc.Component {
    @property(cc.Node)
    anim1 = null;
    @property(cc.Node)
    anim2 = null;
    @property(cc.Node)
    anim3 = null;
    @property(cc.Node)
    anim4 = null;
    @property(cc.Node)
    anim5 = null;
    @property(cc.Node)
    animContent = null;
    @property(require('../commonScript/ModuleSelfCardsMJ'))
    card = null;


    @property(cc.Node)
    laiAnim = null;
    @property(cc.Node)
    lai = null;
    @property(cc.Node)
    lai1 = null;
    @property(cc.Node)
    lai2 = null;
    @property(cc.Node)
    lai3 = null;


    onLoad() {
    }

    showSpecial(card) {
        this.animContent.active=true;
        this.card.node.active=true;
        this.animContent.opacity = 255;
        let a1 = cc.rotateBy(3, 360);
        let b1 = cc.repeatForever(a1);
        this.anim1.runAction(b1);


        let a2 = cc.rotateBy(3, -360);
        let b2 = cc.repeatForever(a2);
        this.anim2.runAction(b2);

        this.anim3.scale = 1;
        this.anim3.opacity = 255;
        let a3 = cc.scaleBy(0.5, 5);
        let b3 = cc.fadeOut(1);
        let c3 = cc.spawn(a3, b3);
        this.anim3.runAction(c3);

        this.anim4.scale = 1;
        this.anim5.opacity = 255;

        let a4 = cc.scaleBy(0.3, 1.2);
        let b4 = cc.sequence(a4, cc.callFunc(() => {
            this.anim5.runAction(cc.fadeOut(0.3));
        }))
        this.anim4.runAction(b4);
    
        this.card.init(card);
        this.card.node.position = cc.v2(0, this.node.getChildByName('btnLai').y);
        this.card.node.scale = 1;
        let xPos=this.node.getChildByName('btnLai').x;
        let ac = cc.scaleBy(0.3, 0.4);
        let bc = cc.moveTo(0.5, cc.v2(xPos, this.node.getChildByName('btnLai').y));
        let dc=cc.sequence(ac,bc);
        let ap = cc.delayTime(1);
        let bp = cc.sequence(ap, cc.fadeOut(0.2), cc.callFunc(() => {
            this.card.node.runAction(dc);
        }));
        this.animContent.runAction(bp);

    }
    reconnectSpecial(card){

        this.card.init(card);
        this.card.node.scale = 0.4;
        this.card.node.x=this.node.getChildByName('btnLai').x;
        this.card.node.y=this.node.getChildByName('btnLai').y;
        this.card.node.active=true;

    }

    hideSpecial(){
        this.card.node.active=false;
    }


    showLai(){

        this.laiAnim.active=true;
        this.lai.stopAllActions();
        this.lai1.stopAllActions();

        this.lai.scale=10;
        this.lai.opacity = 0;

        this.lai1.scale=0.7;
        this.lai1.opacity = 0;

        let a1= cc.scaleTo(0.15,1);
        let b1=cc.fadeIn(0.15);
        let c1=cc.spawn(a1,b1);
        // let e1=cc.spawn(cc.scaleTo(0.3,1),)
        let d1=cc.sequence(c1,cc.callFunc(()=>{
 
            let a2=cc.fadeOut(0.25);
            let a3=cc.fadeIn(0.25);
            // let b2=cc.scaleTo(0.4,1.1);
            let d2=cc.spawn(cc.scaleTo(0.15,1),a3)
            let d3=cc.spawn(cc.scaleTo(0.15,0.7),a2)
            let c2 =cc.sequence(d2,d3,cc.delayTime(0),cc.callFunc(()=>{
            // let c2 =cc.sequence(b2,d2,cc.delayTime(1),cc.callFunc(()=>{
                this.laiAnim.active=false;
            }));
            this.lai1.runAction(c2);
        }))
        this.lai.runAction(d1);
       
        

    }
    




}
