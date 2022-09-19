import { GameConfig } from "../../GameBase/GameConfig";

 const { ccclass, property } = cc._decorator
 @ccclass
 export default class ModuleHandGroundMJ extends cc.Component {
 
    @property(cc.Prefab)
    groundItem=null;

    // LIFE-CYCLE CALLBACKS:
    /**重制牌区 */
    resetGround() {
        this.node.removeAllChildren();
    }
    /**初始化牌区 */
    initGround(ground, realIdx) {
        this.resetGround();
        ground.forEach((element, i) => {
            let groundItem = cc.instantiate(this.groundItem);
            groundItem.msg = element;
            if (realIdx == 0)
                groundItem.scale = 1.1;
            groundItem.getComponent('ModuleGroundDetailMJ').init(element, realIdx);

            switch (realIdx) {
                case 1:
                    groundItem.x = 13 - 25.5 * i;
                    groundItem.y = 50.65 + 106 * i
                    break;
                case 3:
                    groundItem.x = - 26.6 * i;
                    groundItem.y = -51.85 - 103.7 * i
                    break;
            }

            this.node.addChild(groundItem);
        });
    }
    addGround(data, realIdx) {
        // let data ={ event: 'PONG', idx: 0, card: 2, from: 0 }

        let childIndex = this.node.children.findIndex(node => node.msg.card == data.card);
        if (childIndex == -1 || data.event == GameConfig.GameAction.CHOW) {
            let groundItem = cc.instantiate(this.groundItem);
            groundItem.msg = data;
            let cardIndex=this.node.childrenCount;//Math.max(this.node.childrenCount-1,0)
            switch (realIdx) {
                case 0:
                    groundItem.scale = 1.1;
                    break;
                case 1:
                    groundItem.x = 13 - 25.5 * cardIndex;
                    groundItem.y = 50.65 + 106 * cardIndex
                    break;
                case 3:
                    groundItem.x = - 26.6 * cardIndex;
                    groundItem.y = -51.85 - 103.7 * cardIndex
                    break;
            }
            groundItem.getComponent('ModuleGroundDetailMJ').init(data, realIdx);
            this.node.addChild(groundItem);
            console.log("1")
        } else {
            this.node.children[childIndex].msg = data;
            this.node.children[childIndex].getComponent('ModuleGroundDetailMJ').init(data, realIdx);
        }
    }

    // update (dt) {},
}
