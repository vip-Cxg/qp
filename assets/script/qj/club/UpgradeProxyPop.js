const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";

@ccclass
export default class UpgradeProxyPop extends cc.Component {
    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null

    @property(cc.Label)
    lblClubName = null

    @property(cc.Label)
    lblClubID = null

    @property(cc.Label)
    lblLevel = null

    @property(cc.Toggle)
    toggles = []

    @property(cc.Node)
    btnDownGrade = null

    data = null

    type = ''

    init(data, type ) {

        this.type = type||data.type;
        this.data = data;
        console.log('初始化-1-', data,type)
        console.log('初始化-3-', this.type)
        console.log('初始化-2-', App.Club)
        let { userID, remark = '', power = '0,0,0', level = 0, role, name: clubName, id: clubID } = data.club || data;
        if (this.type == 'INVITE') {
            level = 0;
        }
        this.btnDownGrade.active = role == GameConfig.ROLE.PROXY;
        this.avatar.avatarUrl =data.user.head;
        this.lblID.string = `馆主ID:${userID ? userID : data.user.id}`;
        this.lblName.string = `馆主: ${data.user.name}`;
        this.lblClubName.string = `茶馆: ${clubName || App.Club.name}`;
        this.lblClubID.string = `茶馆ID: ${clubID || App.Club.oglID}`;
        if (remark.length > 0) {
            this.lblName.string = `${data.user.name}(${remark})`;
        }

        this.lblLevel.string = `${level}%`;
        power = power.split(',').map(m => Number(m));
        // let selfPower = App.Club.power;
        // this.toggles[0].interactable = selfPower[0];
        // this.toggles[1].interactable = selfPower[1];
        // this.toggles[2].interactable = selfPower[2];
        this.toggles[0].uncheck();
        this.toggles[1].uncheck();
        this.toggles[2].uncheck();
    }

    onCLickLevel() {
        App.pop(GameConfig.pop.InputPop, (level) => {
            cc.log(level);
            this.lblLevel.string = `${level}%`;
        });
    }

    onClickDownGrade() {
        let post = {
            userID: this.user.userID,
            clubID: App.Club.id
        }
        App.confirmPop(`是否取消${this.user.user.name}[${this.user.userID}]的合伙人身份`, () => {
            Connector.request(GameConfig.ServerEventName.DownGradeProxy, post, (data) => {
                App.alertTips('操作成功');
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_MEMBERS_LIST);
                this.onClickClose();
            })
        })
    }

    onClickToggle(target) {
        let color = ['#895521', '#BE1F1FC8'];
        let isChecked = target.isChecked;
        let label = target.node.getChildByName('label');
        label.color = new cc.Color().fromHEX(color[Number(isChecked)]);
    }

    onClickConfirm() {
        let power = this.toggles.map(t => Number(t.isChecked));
        power = power.join();
        let level = Number(this.lblLevel.string.replace('%', ''));
        let post = {
            power,
            level,
            userID: this.data.userID||this.data.user.id,
            clubID: this.data.club?.id||App.Club.id
        }
        let path = GameConfig.ServerEventName.UpgradeProxy;

        if (this.type == 'INVITE') {
            post = {
                oglClubID: App.Club.oglID,
                targetClubID: this.data.club.id || App.Club.id,// this.data.id,
                data: {
                    power,
                    level
                }
            }
            path = GameConfig.ServerEventName.InviteClub
        }

        Connector.request(path, post, (data) => {
            App.alertTips(data.message);
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_MEMBERS_LIST);
            this.onClickClose();
        })
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

}