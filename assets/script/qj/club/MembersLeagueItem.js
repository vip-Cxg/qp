const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import moment from "../other/moment"
import Avatar from "../../ui/common/Avatar";
@ccclass
export default class MembersLeagueItem extends cc.Component {
    @property(cc.Node)
    btnAdd = null
    @property(cc.Node)
    btnSub = null
    @property(cc.Node)
    btnOperate = null
    @property(cc.Label)
    lblScore = null
    @property(cc.Label)
    lblClubId = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(cc.Label)
    lblStatus = null
    @property(Avatar)
    avatar = null
    @property(cc.SpriteFrame)
    sprFrameOffice = []
    @property(cc.Sprite)
    sprOffice = null

    @property(cc.SpriteFrame)
    sprFrameBg = []
    @property(cc.Sprite)
    sprBg = null

    @property(cc.Node)
    btnRemark = null

    user = null

    init(data) {
        this._office = [GameConfig.ROLE.OWNER, GameConfig.ROLE.MANAGER, GameConfig.ROLE.PROXY, GameConfig.ROLE.USER]
        this.user = data;
        let { user : { name, head }, score, role, remark, lastDate, userID, index, parent, pageIndex } = data;

        this.sprBg.spriteFrame = this.sprFrameBg[index % 2];
        this.lblName.string = name;
        if (remark && remark.length > 0) {
            this.lblName.string += `(${remark})`;
        }
        if (!GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role) && pageIndex == 0) {
            let reg = /^(\d{1})\d{4}(\d{1})$/;
            userID = userID.toString().replace(reg, '$1****$2');
            this.btnAdd.active = false;
            this.btnSub.active = false;
            this.btnOperate.active = false;
            this.btnRemark.active = false;
            this.lblName.string = name;
        }
        // if ((pageIndex == 6 || pageIndex == 2) && (!App.Club.power[1] || userID == App.Player.id) && !GameConfig.CAN_OPERATE_ROLE.includes(App.Club.role)) {
        //     this.btnAdd.getComponent(cc.Button).interactable = false;
        //     this.btnSub.getComponent(cc.Button).interactable = false;
        // }
        if (userID == App.Player.id || this._pageIndex == 2) {
             this.btnRemark.active = false;
             this.btnOperate.active = false;
        }
        this.lblScore.string = App.transformScore(score);
        this.lblID.string = `ID:${userID}`;

        if(data.clubInfo&&data.clubInfo.id)
        this.lblClubId.string='茶馆ID: '+data.clubInfo.id;
        this.lblStatus.string = lastDate;
        this.avatar.avatarUrl = head;
        this.sprOffice.spriteFrame = this.sprFrameOffice[this._office.indexOf(role)];
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
    }

    updateInfo({ data }) {
        let { userID, score, remark, oglClubID } = data;
        if (userID != this.user.userID || oglClubID && this.user.oglClubID) return;
        if (score || score == 0) {
            this.user.score = score;
            this.lblScore.string = App.transformScore(score);
        }
        if (remark || remark == 0) {
            this.user.remark = remark;
            this.lblName.string = `${this.user.user.name}(${remark})`;
        }
    }

    /**
     * 
     * @param {*} _ 
     * @param {string} eventData  -  '-' or '+'    
     *  */
    onClickModifyScore(_, eventData) {
        App.pop(GameConfig.pop.ModifyScorePop, [{ score: App.transformScore(this.user.score), symbol: eventData }, this.updateScoreCallback.bind(this)]);
    }

    updateScoreCallback(score) {
        const { id: clubID } = App.Club;
        const { userID, oglClubID } = this.user;
        console.log("1231312",oglClubID,this.user)
        Connector.request(GameConfig.ServerEventName.UpdateScore, { score, clubID, userID, oglClubID }, (data) => {
            const { selfScore, targetScore } = data;
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID: this.user.userID, score: targetScore })
            if (selfScore || selfScore == 0)
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID: App.Player.id, score: selfScore })
        })
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
    }

    onClickRemark() {
        App.pop(GameConfig.pop.ChangeRemarkPop, this.user);
    }

    onClickOperate() {
        if (this.user.pageIndex == 0 || this.user.role != GameConfig.ROLE.PROXY) {
            App.pop(GameConfig.pop.ClubOperateMemberPop, { ...this.user, node: this.node } );
        } else {
            
            App.pop(GameConfig.pop.UpgradeProxyPop, { ...this.user, node: this.node } );
        }
        
    }
}