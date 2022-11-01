
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector, { connect } from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../common/GameUtils";
import Avatar from "../../ui/common/Avatar";
import { App } from "../../ui/hall/data/App";
import moment from "../other/moment";
@ccclass
export default class LeagueRulePop extends cc.Component {
    @property(cc.Node)
    item = null

    @property(cc.Node)
    content = null

    @property(cc.Node)
    btnAdd = null

    @property(cc.Prefab)
    selectDay = null


    @property(cc.ToggleContainer)
    togglePay = null

    @property(cc.ToggleContainer)
    toggleDisband = null


    @property(cc.Node)
    bgTop = null


    onLoad() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_ROOMS, this.init, this);
    }

    init() {
        let isLeague = App.Club.isLeague;
        let rooms = App.Club.rooms;
        console.log("房间信息All", rooms)
        rooms = rooms.filter(r => r.isLeague == isLeague);
        this.content._children.filter(node => node._name != 'btnAdd').forEach(node => node.removeFromParent());
        rooms.forEach((r, i) => {
            App.instancePrefab(this.item, { ...r, index: i }, this.content);
        });
        this.btnAdd.zIndex = 100;
        this.bgTop.active = isLeague;
        let leagueConfig = App.Club.leagueConfig;
        // cc.log()
        let payMode = leagueConfig.payMode;
        let disband = leagueConfig.disband || 0;

        console.log("leagueConfig", leagueConfig)

        // this.togglePay.node.children.forEach((item) => {
        //     item.getComponent(cc.Toggle).interactable = rooms.length == 0;
        // })

        this.togglePay.toggleItems.find(t => t.node._name == payMode).check();
        this.toggleDisband.toggleItems.find(t => t.node._name == disband).check();


    }

    onClickPayToggle() {
        let color = ['#73978B', '#D15A0A'];
        this.togglePay.toggleItems.forEach(toggle => {
            let isChecked = toggle.isChecked;
            let label = toggle.node.getChildByName('label');
            label.color = new cc.Color().fromHEX(color[Number(isChecked)]);
        })
    }
    onClickDisbandToggle() {
        let color = ['#73978B', '#D15A0A'];
        this.toggleDisband.toggleItems.forEach(toggle => {
            let isChecked = toggle.isChecked;
            let label = toggle.node.getChildByName('label');
            label.color = new cc.Color().fromHEX(color[Number(isChecked)]);
        })
    }

    onClickModify() {
        if (App.Club.rooms.length > 0) {
            Cache.alertTip('必须删除其他房型才可修改')
            return;
        }
        let payMode = this.togglePay.toggleItems.find(toggle => toggle.isChecked).node._name;
        payMode = Number(payMode);
        let disband = this.toggleDisband.toggleItems.find(toggle => toggle.isChecked).node._name;
        disband = Number(disband);
        let clubID = App.Club.id;
        let data = { payMode, disband, clubID };
        if (payMode != App.Club.payMode || disband != App.Club.disband) {
            App.confirmPop('重新保存模版才能生效', () => {
                this.request(data);
            })
            return;
        }
        this.request(data);
    }

    request(data) {
        Connector.request(GameConfig.ServerEventName.UpdateLeagueConfig, data, ({ leagueConfig }) => {
            App.alertTips('修改成功');
            App.Club.leagueConfig = leagueConfig;
            this.init();
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_CLUB)

        })
    }

    onClickPopCreate() {
        let pop = GameConfig.pop.CreatePop;
        App.pop(pop, 'LEAGUE');
    }


    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_ROOMS, this.init, this);
    }



}


