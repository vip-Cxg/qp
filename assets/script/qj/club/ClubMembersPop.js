import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Cache from "../../../Main/Script/Cache";
const { ccclass, property } = cc._decorator
@ccclass
export default class ClubMembersPop extends cc.Component {

    @property(cc.ScrollView)
    scrollViews = []
    @property(cc.Label)
    lblAllMembers = null
    @property(cc.Label)
    lblOnlineMembers = null

    @property(cc.Prefab)
    prefabs = []
    @property(cc.EditBox)
    editBoxSearch = null
    @property(cc.Node)
    toggleLeft = null
    _pageIndex = '0'

    @property(cc.Node)
    nodeTopBgAllMembers = []

    @property(cc.Label)
    lblMyMembers = null
    @property(cc.Label)
    lblMyMembersCheck = null

    @property(cc.Label)
    lblMyProxy = null
    @property(cc.Label)
    lblMyProxyCheck = null


    @property(cc.Node)
    nodeBtn = null
    @property(cc.Label)
    lblLevel = null

    @property(cc.Node)
    sprPoint = null

    @property(cc.Toggle)
    allMembers = null
    @property(cc.Toggle)
    myMembers = null




    @property(cc.Node)
    pageContent = null
    @property(cc.Label)
    lblCurrentPage = null

    init() {
        let isLeague = App.Club.isLeague;



        let show = isLeague ? (App.Club.role == GameConfig.ROLE.LEAGUE_MANAGER ? [2, 6] : [2, 6, 7]) : [0, 1, 2, 4, 5];
        this._pageIndex = isLeague ? '6' : '0';
        this.toggleLeft._children.forEach(node => {
            node.active = show.includes(Number(node._name));
        })
        this.nodeBtn.active = isLeague && (App.Club.role == GameConfig.ROLE.OWNER || App.Club.role == GameConfig.ROLE.LEAGUE_OWNER);

        if (this.nodeBtn.active)
            this.lblLevel.string = App.Club.level + '%';

        if (!GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role) && !isLeague) {
            this.toggleLeft._children.forEach(node => {
                node.active = [0, 1, 2, 5].includes(Number(node._name))
            })
        }
        this.sprPoint.active = App.Club.applyMembers > 0;
        this.onClickLeftToggle(isLeague ? this.myMembers : this.allMembers);
        App.EventManager.addEventListener(GameConfig.GameEventNames.INIT_MEMBERS_LIST, this.render, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.CLUB_APPLY, this.updateApply, this);
    }

    updateApply() {
        this.sprPoint.active = App.Club.applyMembers > 0;
    }

    onClickAddMember() {
        App.pop(GameConfig.pop.InputPop, [(userID) => {
            Connector.request(GameConfig.ServerEventName.Invite, { userID, clubID: App.Club.id }, (data) => {
                this.render();
            });
        }, '????????????']);
    }

    onClickAddClub() {
        App.pop(GameConfig.pop.InputPop, [(clubID) => {
            Connector.request(GameConfig.ServerEventName.ClubBaseInfo, { clubID }, (data) => {
                data.user = data.club.user;
                data.type = 'INVITE'
                App.pop(GameConfig.pop.UpgradeProxyPop, data);
            });
        }, '????????????']);
    }

    onClickAddProxy() {
        App.pop(GameConfig.pop.InputPop, [(userID) => {
            Connector.request(GameConfig.ServerEventName.InviteProxy, { userID, clubID: App.Club.id }, (data) => {
                this.render();
            });
        }, '???????????????']);
    }

    onClickLeftToggle(toggle) {
        let index = toggle.node._name;
        this._pageIndex = index;
        this.currentPage = 1;
        this.totalPage = 1;
        this.lblCurrentPage.string = '??? 1 ???';

        this.scrollViews.forEach((scroll, i) => {
            if (i == index) this.render();
            scroll.node.parent.active = i == index;
        })
    }

    currentPage = 1;
    totalPage = 1;
    render() {
        let isLeague = App.Club.isLeague;
        let oglClubID = App.Club.oglID;
        console.log('????????????--', this._pageIndex);
        this.pageContent.active = this._pageIndex == '0' || this._pageIndex == '6';
        switch (this._pageIndex) {
            case '0':
                Connector.request(GameConfig.ServerEventName.UserList, { page: this.currentPage, pageSize: 50, clubID: App.Club.clubInfo.id, isLeague, oglClubID }, this.renderAllItems.bind(this), true);
                break;
            case '2':
                this.onClickSearch();
                break;
            case '1':
                Connector.request(GameConfig.ServerEventName.OnlineList, { page: 1, pageSize: 50, clubID: App.Club.clubInfo.id, oglClubID }, this.renderAllItems.bind(this), true);
                break;
            case '3':
                Connector.request(GameConfig.ServerEventName.ApplyList, { clubID: App.Club.clubInfo.id, oglClubID }, this.renderAllItems.bind(this), true);
                break;
            case '4':
                Connector.request(GameConfig.ServerEventName.UserList, { page: 1, pageSize: 50, clubID: App.Club.clubInfo.id, ban: true, isLeague, oglClubID }, this.renderAllItems.bind(this), true);
                break;
            case '5':
                Connector.request(GameConfig.ServerEventName.UserList, { page: 1, pageSize: 50, clubID: App.Club.clubInfo.id, black: true, isLeague, oglClubID }, this.renderAllItems.bind(this), true);
                break;
            case '6':
                Connector.request(GameConfig.ServerEventName.MyMembers, { page: this.currentPage, pageSize: 50, clubID: App.Club.clubInfo.id, oglClubID }, this.renderAllItems.bind(this), true);
                break;
            case '7':
                Connector.request(GameConfig.ServerEventName.MyProxy, { page: this.currentPage, pageSize: 50, clubID: App.Club.clubInfo.id, black: true, isLeague, oglClubID }, this.renderAllItems.bind(this), true);
                break;
        }
    }

    renderAllItems(data) {
        let scroll = this.scrollViews[this._pageIndex];
        scroll.content.removeAllChildren()
        let isLeague = App.Club.isLeague;
        console.log("??????item", this._pageIndex, data)

        let { userList, online, total, memberCount, proxyCount } = data;
        let { rows, count } = userList;

        if (!GameUtils.isNullOrEmpty(data.page))
            this.lblCurrentPage.string = '??? ' + data.page + ' ???';

        if (count){
            this.totalPage = (Math.ceil(count / 50)) || 1
            console.log("this.totalPage",this.totalPage);

        }


        if (GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role) || isLeague) {
            if (total || total == 0)
                this.lblAllMembers.string = `????????????(${total})`;
            if (online || online == 0)
                this.lblOnlineMembers.string = `????????????(${online})`;
        }
        if (memberCount) {
            this.lblMyMembers.string = `????????????(${memberCount})`;
            // this.lblMyMembersCheck.string = `????????????(${memberCount})`;
        }
        // if (proxyCount) {
        if (this._pageIndex == '7')
            this.lblMyProxy.string = `????????????(${userList.length})`;
        // this.lblMyProxyCheck.string = `????????????(${userList.length})`;
        // this.lblMyProxy.string = `????????????(${proxyCount})`;
        // }
        let prefab = this.prefabs[this._pageIndex];
        if ((this._pageIndex == 0 || this._pageIndex == 2) && App.Club.isLeague) {
            prefab = this.prefabs[6];
            this.nodeTopBgAllMembers[1].active = true;
            this.nodeTopBgAllMembers[0].active = true;
        }
        if (rows) {
            console.log('----', rows.length)

            rows.forEach((r, i) => {
                App.instancePrefab(prefab, { ...r, index: i, pageIndex: this._pageIndex }, scroll.content);
            })
        } else {
            console.log('----', userList.length)

            userList.forEach((r, i) => {
                App.instancePrefab(prefab, { ...r, index: i, pageIndex: this._pageIndex }, scroll.content);
            })
        }

    }



    addPage() {
        console.log("this.currentPage",this.currentPage);
        console.log("this.totalPage",this.totalPage);
        if (this.currentPage >= this.totalPage) {
            Cache.alertTip('?????????????????????');
            return;
        }
        this.currentPage++;
        this.render();
    }
    reducePage() {

        console.log("this.currentPage",this.currentPage);
        console.log("this.totalPage",this.totalPage);
        if (this.currentPage == 1) {
            Cache.alertTip('??????????????????');
            return;
        }
        this.currentPage--;

        this.render();
    }


    onClickSearch() {
        if (this.editBoxSearch.string == '') {
            // App.alertTips('?????????????????????');
            return;
        }
        Connector.request(GameConfig.ServerEventName.UserList, { clubID: App.Club.clubInfo.id, condition: this.editBoxSearch.string, isLeague: App.Club.isLeague, oglClubID: App.Club.oglID }, this.renderAllItems.bind(this), true);
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.INIT_MEMBERS_LIST, this.render, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.CLUB_APPLY, this.updateApply, this);
    }

}


