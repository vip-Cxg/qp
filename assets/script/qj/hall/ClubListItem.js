
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Avatar from "../../ui/common/Avatar";

@ccclass
export default class ClubListItem extends cc.Component {
    @property(Avatar)
    Avatar = null;
    @property(cc.Label)
    lblName = null;
    @property(cc.Label)
    lblId = null;
    @property(cc.Label)
    lblLeagueId = null;
    @property(cc.Label)
    lblHost = null;
    @property(cc.Label)
    lblLeagueHost = null;
    @property(cc.Label)
    lblPerson = null;
    @property(cc.Label)
    lblTable = null;
    @property(cc.Label)
    lblOffice = null;
    @property(cc.Label)
    lblLeagueOffice = null;
    @property(cc.Button)
    btnApply = null;
    @property(cc.Button)
    btnCancelApply = null;
    @property(cc.Sprite)
    sprClubInfo = null;
    @property(cc.Button)
    btnEnters = [];

    _club = null;

    init(data) {
        let { club: { id, name, leagueID },role,leagueUser, peoples = 0,  owner: { name: hostName, id: hostID, head }, status  } = data;
        this.Avatar.avatarUrl = head;
        /** 申请加入 */
    
        if (role == GameConfig.ROLE.APPLYER) {
            this.lblHost.node.y = 0;
            this.lblOffice.node.active = false;
            this.btnApply.node.active = true;
            this.btnEnters.forEach(btn => btn.node.active = false);
            this.sprClubInfo.node.active = false;
        }
        if (data.club.role == GameConfig.ROLE.USER) {
            this.sprClubInfo.node.active = false;
            this.lblHost.node.y = 0;
        }
        this.lblOffice.string = `职位: ${GameConfig.ROLE_DESC[data.club.role]||'无'}`;
        /** 未通过审核 */
        if (status == GameConfig.USER_STATUS.WAIT) {
            this.lblHost.node.y = 0;
            // this.lblOffice.node.active = true;
            this.lblOffice.string = '审批中'
            this.btnCancelApply.node.active = true;
            this.btnEnters.forEach(btn => btn.node.active = false);
            this.sprClubInfo.node.active = false;
        }
        /** 是否显示联盟入口 */
        // this.btnEnters[2].node.active = leagueID > 0;
        this._club = data;
        this.lblName.string = name;
        this.lblId.string = `ID:${id}`;

        this.lblLeagueId.string = `盟ID:${leagueID}`;
        this.lblLeagueId.node.active = leagueID > 0;

        this.lblPerson.string = peoples;
        this.lblTable.string = 1;
        this.lblHost.string = `馆主: ${hostName}`;
        // this.lblLeagueHost.string = `盟主: ${league?.user?.name}`
        // this.lblLeagueHost.node.active = leagueID > 0;

        this.lblLeagueOffice.string = `盟职位: ${leagueUser?.role || leagueUser?.role == 0 ? GameConfig.ROLE_LEAGUE_DESC[leagueUser?.role] : '未激活'}`;
        this.lblLeagueOffice.node.active = leagueID > 0 && status != GameConfig.USER_STATUS.APPLYER && status != GameConfig.USER_STATUS.WAIT;

    }
    /** 进入茶馆 */
    onClickEnterClub() {
        Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: this._club.club.id, isLeague: 0 }, (data) => {
            App.Club.isLeague = 0;
            App.Club.init(data);
            App.pop(GameConfig.pop.ClubPop);
        });
    }

    /** 申请加入 */
    onclickApply() {
        GameUtils.pop(GameConfig.pop.ApplyClubPop, this.popApply.bind(this));
    }

    /** 取消申请 */
    onclickCancelApply() {
        GameUtils.instancePrefab(
            GameConfig.pop.ConfirmPop, 
            { 
                message: '确定要取消对【收拾收拾】茶馆的申请吗?',
                callback1: this.confirmCallback.bind(this)
            }
        );
    }

    confirmCallback() {
        Connector.request(GameConfig.ServerEventName.CancelApplyJoinClub, { clubID: this._club.club.id }, this.successCancelApply, true)
    }

    successCancelApply() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.INIT_CLUB_LIST, {})
    }

    popApply(node) {
        node.getComponent(node._name).init(this._club);
    }

    popClub(node) {
        node.getComponent('ClubPop').init();
    }
    /** 进入比赛场 */
    onClickEnterMatch() {
        Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: this._club.club.id, isLeague: 1 }, (data) => {
            App.Club.init(data);
            App.Club.isLeague = 1;
            App.pop(GameConfig.pop.ClubPop);
        });
    }

    // onClickEnterLeague() {
    //     Connector.request(GameConfig.ServerEventName.ClubInfo, { clubID: this._club.club.leagueID}, (data) => {
    //         App.Club.init(data);
    //         App.Club.isLeague = 2;
    //         App.pop(GameConfig.pop.ClubPop);
    //     });
    // }
}


