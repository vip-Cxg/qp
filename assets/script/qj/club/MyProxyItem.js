const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import moment from "../other/moment"
import Avatar from "../../ui/common/Avatar";
@ccclass
export default class MyProxyItem extends cc.Component {
    @property(cc.Node)
    btnAdd = null
    @property(cc.Node)
    btnSub = null
    @property(cc.Label)
    lblScore = null
    @property(cc.Label)
    lblName = null
    @property(cc.Label)
    lblID = null
    @property(Avatar)
    avatar = null
    @property(cc.Node)
    sprOffice = []

    @property(cc.SpriteFrame)
    sprFrameBg = []
    @property(cc.Sprite)
    sprBg = null

    @property(cc.Label)
    lblSumScore = null

    @property(cc.Label)
    lblMemberCount = null

    @property(cc.Label)
    lblLevel = null

    @property(cc.Label)
    lblClubName = null
    @property(cc.Label)
    lblClubID = null

    user = null

    init(data) {
        cc.log('proxyItem',data);
        this.user = data;
        let { user : { name, head, id: userID }, league: { score, role }, index, membersCount = 0, sumScore = 0, club: { level = 0 } } = data;
        // this.sprBg.spriteFrame = this.sprFrameBg[index % 2];
        this.lblName.string = name;

        this.lblScore.string = App.transformScore(score);
        this.lblID.string = `ID:${userID}`;
        this.avatar.avatarUrl = head;

        this.lblClubID.string='茶馆ID: '+data.club.id;
        this.lblClubName.string='茶馆: '+data.club.name;

        this.sprOffice.forEach((node, i) => {
            if (node)
                node.active = i == role;
        })
        this.lblMemberCount.string = Math.max(membersCount-1,0);//去除自己
        this.lblSumScore.string = App.transformScore(sumScore);
        this.lblLevel.string = `${level}%`
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
    }

    updateInfo({ data }) {
        let { userID, score, remark, oglClubID } = data;
        if (userID != this.user.user.id || oglClubID != this.user.club.id) return;
        if (score || score == 0) {
            this.user.score = score;
            this.lblScore.string = App.transformScore(score);
        }
        if (remark || remark == 0) {
            this.user.remark = remark;
            this.lblName.string = `${this.user.user.name}(${remark})`;
        }
    }

    onClickHead() {

    }

    /**
     * 
     * @param {*} _ 
     * @param {string} eventData  -  '-' or '+'    
     *  */
    onClickModifyScore(_, eventData) {
        App.pop(GameConfig.pop.ModifyScorePop, [{ score: App.transformScore(this.user.league.score), symbol: eventData }, this.updateScoreCallback.bind(this)]);
    }

    onClickCheck() {
        App.pop(GameConfig.pop.SubMembersPop, { oglClubID: this.user.club.id, userID: this.user.user.id });
    }

    updateScoreCallback(score) {
        const { id: clubID } = App.Club;
        const { user: { id: userID }, club: { id: oglClubID } } = this.user;
        Connector.request(GameConfig.ServerEventName.UpdateScore, { score, clubID, userID, oglClubID }, (data) => {
            // this.lblSumScore.string = Number(this.lblSumScore.string) + App.transformScore(score);
            const { selfScore, targetScore } = data;
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID, score: targetScore, oglClubID })
            if (selfScore || selfScore == 0)
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID: App.Player.id, score: selfScore })
        })
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_MEMBERS, this.updateInfo, this);
    }

    onClickOperate() {
        App.pop(GameConfig.pop.UpgradeProxyPop, { ...this.user, node: this.node,type:'PROXY' } );
    }
}