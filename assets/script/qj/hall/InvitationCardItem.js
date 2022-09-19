import { GameConfig } from "../../../GameBase/GameConfig";
import { App } from "../../ui/hall/data/App";
import moment from "../other/moment";

const { ccclass, property } = cc._decorator
let Connector = require("../../../Main/NetWork/Connector");
@ccclass
export default class InvitationCardItem extends cc.Component {
    @property(cc.Label)
    lblDate = null;
    @property(cc.RichText)
    lblText = null;

    @property(cc.Node)
    btnAgree = null

    @property(cc.Node)
    btnRefuse = null

    @property(cc.Node)
    btnDel = null

    @property(cc.Label)
    lblStatus = null

    data = null
    init(data) {
        this.data = data;
        let { createdAt, describe, operate, role, status } = data;
        this.lblDate.string = moment(createdAt).format('YYYY-MM-DD HH:mm');
        let text = describe[role].reduce((p, c) => p += `<color=${c[1]}>${c[0]}</c>`, '')
        if (status != 'none') {
            let str = '等待接受';
            if (status == 'agree') {
                str = '已同意'
            }
            if (status == 'refuse') {
                str = '已拒绝'
            }
            this.lblStatus.string = str;
            this.btnDel.active = true;
        }
        this.lblStatus.node.active = role == 'source' || status != 'none';
        this.lblText.string = text;
        this.oringinalText = describe[role].reduce((p, c) => p += c[0], '');
        for (let o in operate) {
            if (o == 'agree' && role == 'operator' && status == 'none') {
                this.btnAgree.active = true;
            }
            if (o == 'refuse' && role == 'operator' && status == 'none') {
                this.btnRefuse.active = true;
            }
        }
    }

    onClickAgree() {
        let path = this.data.operate.agree.path;
        let data = this.data.operate.agree.param;
        App.confirmPop(`是否同意`, () => {
            Connector.request(path, data, () => {
                App.alertTips('操作成功');
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_INVITATION_CARD);
            });
        });
       
    }

    onClickDel() {
        let path = this.data.operate.refuse.path;
        let data = this.data.operate.refuse.param;
        data.operate = 'del';
        App.confirmPop(`是否删除`, () => {
            Connector.request(path, data, () => {
                App.alertTips('操作成功');
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_INVITATION_CARD);
            });
        });
    }

    onClickRefuse() {
        let path = this.data.operate.refuse.path;
        let data = this.data.operate.refuse.param;
        App.confirmPop(`是否拒绝`, () => {
            Connector.request(path, data, () => {
                App.alertTips('操作成功');
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_INVITATION_CARD);
            });
        });
    }
}


