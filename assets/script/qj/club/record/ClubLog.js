const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector, { LogsClient } from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from "../../other/moment";
@ccclass
export default class ClubLog extends cc.Component {
    @property(cc.Node)
    item = null
    @property(cc.Label)
    lblCount = null
    @property(cc.Node)
    content = null

    onLoad() {

    }

    init() {
        this.content.removeAllChildren();
        let clubID = App.Club.id;
        Connector.request(GameConfig.ServerEventName.ClubLogs, { clubID }, ({ logs }) => {
            let { rows, count } = logs;
            this.lblCount.string = `总条数: ${count}`;
            rows.forEach(r => {
                let node = cc.instantiate(this.item);
                node.parent = this.content;
                this.initItem(node, r);
                node.active = true;
            });
        })
    }

    initItem(node, data) {
        const TYPE = {
            'UPGRADE_USER': {
                color: '#de9d64',
                name: '职位调整'
            },
            'DEGRADE_USER': {
                color: '#de9d64',
                name: '职位调整'
            },
            'JOIN_APPLY_USER': {
                color: '#b86f4f',
                name: '加入审批'
            },
            'KICK_USER': {
                color: '#3c4590',
                name: '清理成员'
            }
        }
        let lblType = node.getChildByName('lblType').getComponent(cc.Label);
        let lblDate = node.getChildByName('lblDate').getComponent(cc.Label);
        let lblRemarks = node.getChildByName('lblRemarks').getComponent(cc.RichText);
        lblType.string = TYPE[data.type].name;
        lblType.node.color = new cc.Color().fromHEX(TYPE[data.type].color);
        lblDate.string = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
        let remarks = data.remarks.split(',');
        lblRemarks.string = `<color=#0884ce>${data.operator.name}</color><color=#121212>${remarks[0]}</color><color=#b13da4>${data.target.name}(${data.targetID})</color><color=#121212>${remarks[1]}</color>`  
    }
}