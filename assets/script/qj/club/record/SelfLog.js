const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from "../../other/moment";
@ccclass
export default class SelfLog extends cc.Component {
    // _gameType = GameConfig.GameType.PDK
    @property(cc.Node)
    nodeOption = null
    @property(cc.Node)
    content = null
    @property(cc.Node)
    item = null
    @property(cc.Label)
    lblType = null
    _type = undefined
    _color = ['#db5950', '#2EA63C']
    onLoad() {
        let options = [
            { value: undefined, name: '全部' }, 
            { value: ['OPERATED', 'OPERATE'], name: '修改记录' },
            { value: ['GAME'], name: '牌局记录' },
            { value: ['FEE'], name: '报名记录' },
        ];
        this.nodeOption.children.forEach(node => {
            node.on('touchend', () => {
                this.nodeOption.active = false;
                let idx = Number(node._name);
                this.lblType.string = options[idx].name;
                this._type = options[idx].value;
            });
        })
    }

    init() {
        this.content.removeAllChildren();
        let data = {
            type: this._type,
            clubID: App.Club.id,
            userID: App.Player.id,
        }
        Connector.request(GameConfig.ServerEventName.SelfScoreLog, JSON.parse(JSON.stringify(data)), this.rander.bind(this));
    }

    rander({ logs }) {
        logs.forEach(l => {
            let node = cc.instantiate(this.item);
            node.parent = this.content;
            this.initItem(node, l);
            node.active = true;
        })
    }

    initItem(node, data) {
        let { score, remainScore, createdAt, reason } = data;
        let lblDate = node.getChildByName('lblDate').getComponent(cc.Label);
        let lblEvent = node.getChildByName('lblEvent').getComponent(cc.Label);
        let lblCount = node.getChildByName('lblCount').getComponent(cc.Label);
        let lblRemain = node.getChildByName('lblRemain').getComponent(cc.Label);
        lblDate.string = moment(createdAt).format('YYYY-MM-DD HH:mm:ss');
        lblEvent.string = reason||'';
        lblCount.string = (score > 0 ? '+' : '') + App.transformScore(score);
        lblCount.node.color = new cc.Color().fromHEX(score >= 0 ? this._color[1] : this._color[0]);
        lblRemain.string = App.transformScore(remainScore);
    }

    onClickOption() {
        this.nodeOption.active = true;
    }
}