
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Avatar from "../../ui/common/Avatar";
import GameHelper from "../GameHelper";

@ccclass
export default class ClubListItem extends cc.Component {
    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblId = null
    @property(cc.Label)
    lblMyOffice = null
    @property(cc.Label)
    lblHostName = null
    @property(cc.Label)
    lblHostID = null
    @property(cc.EditBox)
    editBoxContact = null
    @property(cc.EditBox)
    editBoxNotice = null
    @property(cc.Toggle)
    toggleRoomPermission = null
    @property(cc.Toggle)
    toggleMode = []
    @property(cc.Toggle)
    toggleDisbandPermission = null
    @property(cc.Label)
    lblTableDisplay = null
    @property(cc.Node)
    nodeTableDisplayItem = null
    @property(cc.Node)
    btnCommit = null
    @property(cc.Button)
    btnTableDisplay = null
    @property(cc.Node)
    btnDisband = null
    @property(cc.Node)
    btnMask = null
    _tableDisplay = {
        '-1': '全显示',
        '0': '不显示',
        '5': '显示5桌',
        '10': '显示10桌',
        '20': '显示20桌'
    };
    _tableDisplayValue
    _colorLabel = [[64, 64, 64, 200], [190, 31, 31, 200]]
    data = null;

    init() {
        let { mode, roomPermission, disbandPermission, tableDisplay, notice, contact } = App.Club.clubInfo;
        cc.log(App.Club.clubInfo);
        let { id, name, head } = App.Club.owner;
        this.avatar.avatarUrl = App.Player.head;
        let role = App.Club.role;
        this.lblMyOffice.string = `我的职位：${ GameConfig.ROLE_DESC[role]}`;
        // this.data = data;
        this.lblName.string = name;
        this.lblId.string = `ID:${App.Player.id}`;
        this.lblHostName.string = `茶馆馆主：${name}`;
        this.lblHostID.string = `馆主ID：${id}`;
        if (!GameUtils.isNullOrEmpty(contact)) this.editBoxContact.string = contact;
        if (!GameUtils.isNullOrEmpty(notice))  this.editBoxNotice.string = notice;
        this.toggleRoomPermission.isChecked = roomPermission ? true : false;
        this.onClickToggle(this.toggleRoomPermission);
        this.toggleDisbandPermission.isChecked = disbandPermission ? true : false;
        this.onClickToggle(this.toggleDisbandPermission);
        this.toggleMode[mode].isChecked = true;
        this.onClickModeToggle();
        this.lblTableDisplay.string = this._tableDisplay[tableDisplay];
        this._tableDisplayValue = tableDisplay;
        this.nodeTableDisplayItem._children.forEach(node => {
            node.on(cc.Node.EventType.TOUCH_END, this.onClickTableDisPlay, this);
        })
        
        if (!GameHelper.hasClubPermission(role)) {
            this.btnCommit.active = false;
            this.editBoxContact.enabled = false;
            this.editBoxContact.node.opacity = 170;
            this.editBoxNotice.enabled = false;
            this.editBoxNotice.node.opacity = 170;
            this.toggleDisbandPermission.interactable = false;
            this.toggleDisbandPermission.node.opacity = 170;
            this.toggleRoomPermission.interactable = false;
            this.toggleRoomPermission.node.opacity = 170;
            this.toggleMode.forEach(toggle => {
                toggle.node.opacity = 170;
                toggle.interactable = false
            });
            this.btnTableDisplay.interactable = false;
            this.btnDisband.active = false;
            // this.btnMask.active = true;
        }
    }

    onClickModeToggle() {
        this.toggleMode.forEach((toggle, i) => {
            let isChecked = toggle.isChecked;
            toggle.node.getChildByName('label').color = new cc.color(...this._colorLabel[isChecked? 1 : 0]);
        })
    }

    onClickToggle(toggle) {
        let isChecked = toggle.isChecked;
        toggle.node.getChildByName('label').color = new cc.color(...this._colorLabel[isChecked? 1 : 0]);
    }

    onClickCommit() {
        let data = {
            clubID: App.Club.id,
            contact: this.editBoxContact.string,
            notice: this.editBoxNotice.string,
            config: {
                roomPermission: this.toggleRoomPermission.isChecked ? 1 : 0,
                disbandPermission: this.toggleDisbandPermission.isChecked ? 1 : 0,
                mode: this.toggleMode.findIndex(toggle => toggle.isChecked),
                tableDisplay: this._tableDisplayValue
            }
        }
        Connector.request(GameConfig.ServerEventName.UpdateClub, data, (data) => {
            let { contact, notice, config } = data
            App.Club.contact = contact;
            App.Club.notice = notice;
            App.Club.config = config;
            App.alertTips('修改成功');
        })
    }

    onClickTableDisPlay(event, data) {
        if (data == 1) {
            this.nodeTableDisplayItem.active = true;
            return;
        }
        if (data == 0) {
            this.nodeTableDisplayItem.active = false;
            return;
        }
        this._tableDisplayValue = event.target._name;
        this.lblTableDisplay.string = this._tableDisplay[event.target._name];
        this.nodeTableDisplayItem.active = false;
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickInvite() {
        cc.log('onClickInvite');
    }

    onClickShare() {
        cc.log('onClickShare');
    }
}


