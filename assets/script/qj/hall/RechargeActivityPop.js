
const { ccclass, property } = cc._decorator;;

@ccclass
export default class RechargeActivityPop extends cc.Component {
  
    onLoad() {

     

    }

    init() {
       
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


