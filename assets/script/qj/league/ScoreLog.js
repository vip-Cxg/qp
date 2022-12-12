
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
import moment from "../other/moment";

@ccclass
export default class ScoreLog extends cc.Component {
    @property(cc.Node)
    content = null

    @property(cc.Node)
    operatorContent = null

    @property(cc.Label)
    lblOperator = null

    @property(cc.Node)
    ScoreLogItem = null

    @property(cc.Node)
    OperatorItem = null

    @property(cc.Label)
    lblTotal = null

    @property(cc.Label)
    lblIncr = null

    @property(cc.Label)
    lblDecr = null

    @property(cc.EditBox)
    editBox = null

    condition = {
        operator: undefined,
        date: 0,
        userID: undefined,
    }

    init() {
        this.condition.clubID = App.Club.id;
        this.condition.oglClubID = App.Club.oglID;
        this.operatorContent.removeAllChildren();
        this.createOperatorItem();
        Connector.request(GameConfig.ServerEventName.ProxiesList, { clubID: App.Club.id, oglClubID: App.Club.oglID }, this.randerProxyList.bind(this));
        this.requestData();
    }

    randerProxyList({ userList }) {
        userList.forEach(({ user: { id, name } }) => {
            this.createOperatorItem(id, name);
        })
    }

    rander({ logs, incr = 0, decr = 0 }) {
        let { rows, count } = logs;
            this.lblTotal.string = `总条数:${count}`;
            this.lblIncr.string = `总增量:${App.transformScore(incr)}`;
            this.lblDecr.string = `总扣除:${Math.abs(App.transformScore(decr))}`;
            rows.forEach(r => {
                let node = cc.instantiate(this.ScoreLogItem);
                node.parent = this.content;
                this.initItem(node,r);
            })
    }

    requestData() {
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.ScoreLog, this.condition, this.rander.bind(this));  
    }

    createOperatorItem(id, name) {
        let node = cc.instantiate(this.OperatorItem);
        node.parent = this.operatorContent;
        let lbl = node.getChildByName('lbl').getComponent(cc.Label);
        lbl.string = id ? `${name}(ID:${id})` : '全部管理员';
        lbl.fontSize = id ? 40 : 50;
        lbl.lineHeight = id ? 40 : 50;
        node.on('touchend', () => {
            this.condition.operator = id;
            this.lblOperator.string = name || '全部管理员';
            this.onClickOperator();
        })
        node.active = true;
    }

    onClickClearEditBox() {
        this.editBox.string = '';
    }

    onClickToggle(toggle) {
        this.condition.date = Number(toggle.node._name);
    }

    onClickSearch() {
        this.condition.userID = this.editBox.string.length > 0 ? this.editBox.string : undefined;
        this.requestData();
    }

    onClickOperator() {
        this.operatorContent.active = !this.operatorContent.active;
    }

    //{"count":1,"rows":[{"id":1,"userID":59316062,"diamond":20,"strDate":"20220409","roomID":1,"clubID":245409,"source":0,"reason":"QJHH","remarks":"","remainDiamond":0,"createdAt":"2022-04-08T22:12:55.000Z","updatedAt":"2022-04-08T22:12:55.000Z"}]}
    initItem(node, data) {
        let color = ['#ff2f0b', '#138b04'];
        let { createdAt, score, operator, name, remainScore } = data;
        score = App.transformScore(score);
        let lblDate = node.getChildByName('lblDate').getComponent(cc.Label);
        let lblUser = node.getChildByName('lblUser').getComponent(cc.Label);
        let lblOperator = node.getChildByName('lblOperator').getComponent(cc.Label);
        let lblScore = node.getChildByName('lblScore').getComponent(cc.Label);
        let lblRemain = node.getChildByName('lblRemain').getComponent(cc.Label);
        lblDate.string = moment(createdAt).format('MM-DD HH:mm:ss');
        lblUser.string = name;
        lblOperator.string = operator;
        lblScore.string = score > 0 ? ('+' + score) : (score);
        lblScore.node.color = new cc.Color().fromHEX(color[Number(score > 0)]);
        lblRemain.string = App.transformScore(remainScore);
        node.active = true;
        // let { createdAt, operator,  }
    }

  
}


