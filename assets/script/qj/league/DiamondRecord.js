
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
import moment from "../other/moment";

@ccclass
export default class DiamondRecord extends cc.Component {
    @property(cc.Node)
    content = null

    @property(cc.Node)
    DiamondRecordItem = null

    @property(cc.Label)
    lblTotal = null

    init() {
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.DiamondLog, {}, ({ logs }) => {
            let { rows, count } = logs;
            this.lblTotal.string = `总条数:${count}`;
            rows.forEach(r => {
                let node = cc.instantiate(this.DiamondRecordItem);
                node.parent = this.content;
                this.initItem(node,r);
            })

        })  
    }
    //{"count":1,"rows":[{"id":1,"userID":59316062,"diamond":20,"strDate":"20220409","roomID":1,"clubID":245409,"source":0,"reason":"QJHH","remarks":"","remainDiamond":0,"createdAt":"2022-04-08T22:12:55.000Z","updatedAt":"2022-04-08T22:12:55.000Z"}]}
    initItem(node, data) {
        let color = ['#ff2f0b', '#138b04'];
        let { createdAt, reason, source, diamond } = data;
        let lblDate = node.getChildByName('lblDate').getComponent(cc.Label);
        let lblEvent = node.getChildByName('lblEvent').getComponent(cc.Label);
        let lblOperator = node.getChildByName('lblOperator').getComponent(cc.Label);
        let lblCount = node.getChildByName('lblCount').getComponent(cc.Label);
        lblDate.string = moment(createdAt).format('MM-DD HH:mm:ss');
        lblEvent.string = reason;
        lblOperator.string = source || '管理员';
        lblCount.string = diamond > 0 ? ('+' + diamond) : (diamond);
        lblCount.node.color = new cc.Color().fromHEX(color[Number(diamond > 0)]);
        node.active = true;
        // let { createdAt, operator,  }
    }

  
}


