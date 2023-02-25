
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Avatar from "../../ui/common/Avatar";
import GameHelper from "../GameHelper";
import Tables from "./Tables";
import Cache from "../../../Main/Script/Cache";

@ccclass
export default class ClubPop extends cc.Component {
    @property(Avatar)
    avatar = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblId = null

    @property(cc.Label)
    lblScore = null


    @property(cc.Label)
    lblChangeBtn = null

    @property(cc.Node)
    btnPopRule = null

    @property(cc.Node)
    btnPopHome = null

    @property(cc.Node)
    btnPopMembers = null
    @property(cc.Node)
    btnPopRecord = null
    @property(cc.Node)
    btnPopStatistics = null
    @property(cc.Node)
    btnSearchTable = null

    @property(cc.Node)
    nodeSetting = null
    @property(cc.EditBox)
    editBoxClubName = null

    @property(cc.Node)
    sprScore = null

    @property(cc.Node)
    sprTableInfo = null
    @property(cc.Label)
    lblTableInfo = null

    @property(cc.Node)
    sprOnlineCount = null
    @property(cc.Label)
    lblOnlineCount = null

    @property(cc.Node)
    sprTotalScore = null
    @property(cc.Label)
    lblTotalScore = null


    @property(cc.Node)
    sprReward = null
    @property(cc.Label)
    lblReward = null

    @property(cc.Node)
    btnEnterLeague = null

    @property(Tables)
    tables = null

    /** 成员按钮的提醒红点 */
    @property(cc.Node)
    sprPoint = null


    /** 茶馆背景 */
    @property(cc.SpriteFrame)
    sprChaGuan = null
    /** 比赛场背景 */
    @property(cc.SpriteFrame)
    sprMatch = null

    onLoad() {

        this.node.getComponent(cc.Sprite).spriteFrame = App.Club.isLeague > 0 ? this.sprMatch : this.sprChaGuan;
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_CLUB, this.updateClub, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.CLUB_APPLY, this.updateApply, this);
   
    }

    init(data = { update: false, clubID: 0, oglClubID: 0 }) {
        this.node.getComponent(cc.Sprite).spriteFrame = App.Club.isLeague > 0 ? this.sprMatch : this.sprChaGuan;



        let { update, clubID, oglClubID } = data;
        if (update) {
            this.updateClub({ clubID, oglClubID });
            return;
        }
        let { id, name, role, isLeague, score, owner: { head } } = App.Club;
        console.log("123123123", App.Club);
        this.lblName.string = isLeague > 0 ? App.Player.name : name;
        this.lblId.string = isLeague > 0 ? `ID:${App.Player.id}` : `ID:${id}`;
        this.avatar.avatarUrl = isLeague > 0 ? App.Player.head : head;
        this.lblScore.string = App.transformScore(score);
        // this.sprTableInfo.active = GameConfig.CAN_OPERATE_ROLE.includes(role);



        this.sprScore.active = Boolean(isLeague > 0);



        this.changeBtnRender()
        this.updateCountRender();


        //role!=GameConfig.ROLE.USER&&role!=GameConfig.ROLE.APPLYER;// GameConfig.CAN_OPERATE_ROLE.includes(role);
        console.log(' ClubPop自身角色0', role);
        console.log(' ClubPop自身角色1', GameConfig.CAN_OPERATE_ROLE);
        console.log(' ClubPop自身角色2', GameConfig.ROLE.PROXY);


        this.btnPopMembers.active = !Boolean(isLeague > 0) || [...GameConfig.CAN_OPERATE_ROLE, GameConfig.ROLE.PROXY].includes(role);
        // this.btnPopRecord 记录  


        switch (isLeague) {
            case 0: //茶馆
                this.btnSearchTable.active = false;
                this.btnPopHome.active = true;
                this.btnPopRule.active = role == GameConfig.ROLE.OWNER;
                this.btnPopStatistics.active = role != GameConfig.ROLE.USER && role != GameConfig.ROLE.APPLYER && role != GameConfig.ROLE.LEAGUE_MANAGER
                break;
            case 1: //比赛场
                this.btnPopHome.active = false;

                this.btnSearchTable.active =App.Club.leagueConfig.disband==1&&( role == GameConfig.ROLE.LEAGUE_OWNER||role == GameConfig.ROLE.LEAGUE_MANAGER||role == GameConfig.ROLE.OWNER||role == GameConfig.ROLE.MANAGER);

                this.btnPopRule.active = role == GameConfig.ROLE.LEAGUE_OWNER;

                this.btnPopStatistics.active = role == GameConfig.ROLE.LEAGUE_OWNER||role==GameConfig.ROLE.OWNER;
                break;
        }






        this.btnEnterLeague.active = !Boolean(isLeague > 0);
        this.tables.init();
        this.sprPoint.active = App.Club.applyMembers > 0;
    }

    updateApply() {
        this.sprPoint.active = App.Club.applyMembers > 0;
    }

    updateClub(data) {
        console.log("123123123",data)
        Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: App.Club.oglID, isLeague: App.Club.isLeague }, (data) => {
            // Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: App.Club.id, isLeague: App.Club.isLeague, oglClubID: App.Club.oglID }, (data) => {
            App.Club.init(data);
            this.init();
        });
    }

    updateInfo({ data }) {
        if (data.userID == App.Player.id && (data.score || data.score == 0)) {
            this.lblScore.string = App.transformScore(data.score);
        }
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_CLUB, this.updateClub, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.CLUB_APPLY, this.updateApply, this);
   
     }

    onClickHead(event, eventData) {
        if (App.Club.isLeague > 0) {
            App.pop(GameConfig.pop.PlayerCenterPop);
            return;
        }
        if (eventData == -1) {
            this.nodeSetting.active = false;
            return;
        }
        if (eventData == 1) {
            if (!GameHelper.hasClubPermission(App.Club.role)) return;
            this.nodeSetting.active = true;
            return;
        }
        let name = this.editBoxClubName.string;
        name = name.replace(/\s*/g, "");
        /** 验证长度,特殊字符 */
        let { verify, message } = GameUtils.verifyString(name, 6);
        message = message.replace(/\$/, "茶馆名称");
        if (!verify) {
            GameUtils.alertTips(message);
            return;
        }
        Connector.request(GameConfig.ServerEventName.UpdateClub, { name, clubID: App.Club.clubInfo.id }, this.successSetting.bind(this), true)
    }

    successSetting(data) {
        let { name } = data;
        // this.data.club.name = name;
        App.Club.clubName = name;
        this.lblName.string = name;
        this.onClickHead(0, -1);
        GameUtils.alertTips('修改成功');
    }

    onClickMembers() {
        // App.pop(GameConfig.pop.ClubMembersPop);
        GameUtils.pop(GameConfig.pop.ClubMembersPop, this.pop);
    }

    onClickHome() {
        // App.pop(GameConfig.pop.ClubHomePop);
        GameUtils.pop(GameConfig.pop.ClubHomePop, this.pop);
    }

    onClickRecord() {
        App.pop(GameConfig.pop.ClubRecordPop);
        // App.instancePrefab(this.recordPop);
    }

    onClickRule() {
        let isLeague = App.Club.isLeague;
        let pop = isLeague > 0 ? GameConfig.pop.LeagueRulePop : GameConfig.pop.CreatePop;
        App.pop(pop, 'CLUB');
    }

    onClickStatistics() {
        GameUtils.pop(GameConfig.pop.ClubStatisticsPop, this.pop);
    }

    pop(node) {
        node.getComponent(node._name).init();
    }

    onClickQuickCreate() {
        GameUtils.pop(GameConfig.pop.QuickCreatePop, this.pop);
    }

    onClickEnterLeague() {
        Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: App.Club.id, isLeague: 1 }, (data) => {
            App.Club.init(data);
            App.Club.isLeague = 1;

            this.init();
        });
    }
    onClickChangeLeague() {
        let isLeague = App.Club.isLeague == 1 ? 0 : 1;
        Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: App.Club.id, isLeague }, (data) => {

            App.Club.init(data);
            App.Club.isLeague = isLeague;
            this.init();
        });
    }

    changeBtnRender() {
        this.lblChangeBtn.string = App.Club.isLeague == 1 ? '切换到茶馆' : '切换到比赛场';
    }

    /**获取每日收益 */
    getEarnWallet() {
        if (App.Club.reward <= 0) {
            Cache.alertTip('奖励不足,无法领取')

            return;

        }
        Connector.request(GameConfig.ServerEventName.WithDrawInClubScore, { clubID: App.Club.id, oglClubID: App.Club.oglID }, (data) => {
            Cache.alertTip('领取成功')
            // App.Club.init(data);
            let req = {
                clubID: App.Club.id,
                oglClubID: App.Club.oglID
            }
            this.updateClub(req)
            // this.init();
        });
    }

    updateCountRender() {

        if (App.Club.isLeague == 0) {
            this.sprOnlineCount.active = false;
            this.sprTableInfo.active = false;
            this.sprReward.active = false;
            this.sprTotalScore.active = false;

        } else {
            this.sprReward.active = App.Club.role == GameConfig.ROLE.OWNER || App.Club.role == GameConfig.ROLE.PROXY || App.Club.role == GameConfig.ROLE.LEAGUE_OWNER;
            this.sprTotalScore.active = App.Club.role == GameConfig.ROLE.OWNER || App.Club.role == GameConfig.ROLE.PROXY || App.Club.role == GameConfig.ROLE.LEAGUE_OWNER;
            this.sprOnlineCount.active = true;
            this.sprTableInfo.active = true;
            this.lblOnlineCount.string = (App.Club.leagueOnlineMembers || 0) + '/ ' + (App.Club.leagueMembers || 0) + '人在线';
            this.lblTableInfo.string = (App.Club.tableCount || 0) + '桌激战中';
            this.lblReward.string = App.transformScore(App.Club.reward);

        }

    }

    getTotalScore(){
        const { id: clubID } = App.Club;
        Connector.request(GameConfig.ServerEventName.SumClubScore, { clubID, targetClubID: App.Club.oglID}, (data) => {
            this.lblTotalScore.string = '' + (App.transformScore(data.sumScore) || 0);
        })
    }

    onClickSearch() {
        App.pop(GameConfig.pop.SearchTablePop)
    }

    onClickClose() {
        App.Club.reset();
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


