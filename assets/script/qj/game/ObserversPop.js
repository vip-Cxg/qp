import Cache from "../../../Main/Script/Cache";
import TableInfo from "../../../Main/Script/TableInfo";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";

const { ccclass, property } = cc._decorator
@ccclass
export default class ObserversPop extends cc.Component {
    @property(cc.Node)
    itemContainer = null;
    @property(cc.Prefab)
    itemPrefab = null;

    init() {
        this.itemContainer.removeAllChildren();
        if(GameUtils.isNullOrEmpty(TableInfo.observers)) return;
        TableInfo.observers.forEach(element => {
            let item=cc.instantiate(this.itemPrefab)
            item.getChildByName('Avatar').getComponent(Avatar).avatarUrl=element.head
            item.getChildByName('name').getComponent(cc.Label).string=element.name
            item.getChildByName('id').getComponent(cc.Label).string='ID: '+element.id
            this.itemContainer.addChild(item)
        });
    }

    onClickClose() {
        
        this.node.destroy();
    }



}


