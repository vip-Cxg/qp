import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import { App } from "../../ui/hall/data/App";
import SearchTableItem from "./SearchTableItem";
const { ccclass, property } = cc._decorator
@ccclass
export default class SearchTablePop extends cc.Component {

    @property(cc.Label)
    lblTableID = null
    @property(cc.Node)
    emptyNode = null
    @property(cc.Node)
    content = null
    @property(cc.Prefab)
    searchTableItem = null

    init() {


    }

    onInputTableID() {
        let self = this;
        App.pop(GameConfig.pop.InputPop, [(tableID) => {
            console.log('adasd', tableID)
            self.lblTableID.string = tableID;

        }, '房间号']);
    }

    onSearchTable() {
        if (this.lblTableID.string == '') return;
        Connector.request(GameConfig.ServerEventName.Tables, { condition: { hideMahjong: false, hideStarted: false, hidePoker: false, hideInvite: false }, tableID: Number(this.lblTableID.string), clubID: App.Club.id, isLeague: App.Club.isLeague }, (data) => {
            this.render(data);
        });
    }

    render(data) {
        console.log('data', data);
        let tables=data.tables;
        this.content.removeAllChildren();

        if(tables.length==0){
            this.emptyNode.active=true;
            return;
        }
        this.emptyNode.active=false;
        tables.forEach(element => {
            let tableItem=cc.instantiate(this.searchTableItem);
            tableItem.getComponent(SearchTableItem).init(element);
            this.content.addChild(tableItem);
        });
        
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }


}


