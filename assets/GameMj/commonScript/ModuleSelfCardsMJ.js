import { GameConfig } from "../../GameBase/GameConfig";
import TableInfo from "../../Main/Script/TableInfo";



 const { ccclass, property } = cc._decorator
 @ccclass
 export default class ModuleSelfCardsMJ extends cc.Component {

    init(card, scale = 1, showLai = false) {
        //自己手牌
        if (card == 0) //红中 
            card = TableInfo.special?.lai;
        this.node.getChildByName('count').getComponent(cc.Sprite).spriteFrame = GameConfig.MJCard.getSpriteFrame("s_" + card);;
        // this.node.height *= scale;
        // this.node.width *= scale;
        // this.content.node.height *= scale;
        // this.content.node.width *= scale;
        if (this.node.getChildByName("ting")) {
            this.node.getChildByName("ting").height *= scale;
            this.node.getChildByName("ting").width *= scale;
        }
        if (this.node.getChildByName("lai") && TableInfo.special?.lai == card) {
            this.node.color = new cc.color('#F6E33B');
            this.node.getChildByName("lai").active = true;
        }
        if (this.node.getChildByName("chao") && TableInfo.special?.chao == card) {
            this.node.getChildByName("chao").active = true;
        }
        // if (this.node.getChildByName("back")) {
        //     this.node.getChildByName("back").height *= scale;
        //     this.node.getChildByName("back").width *= scale;
        // }

    }


    // update (dt) {},
}
