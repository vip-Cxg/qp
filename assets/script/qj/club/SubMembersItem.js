const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import moment from "../other/moment"
import Avatar from "../../ui/common/Avatar";
@ccclass
export default class SubMembersItem extends cc.Component {
    @property(cc.Label)
    lblScore = null
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
    btnOperate = null 

    @property(cc.Node)
    nodeSubMembers = null 

    @property(cc.Label)
    lblMembers = null

    user = null

    init(data, parent) {
        this._office = [GameConfig.ROLE.OWNER, GameConfig.ROLE.MANAGER, GameConfig.ROLE.PROXY, GameConfig.ROLE.USER]
        this.user = data;
        this.parent = parent;
        let { user : { name, head }, score, role, userID, index, memberCount, lastDate } = data;
        this.sprBg.spriteFrame = this.sprFrameBg[index % 2];
        this.lblName.string = name;
        this.lblScore.string = App.transformScore(score);
        this.lblID.string = `ID:${userID}`;
        this.avatar.avatarUrl = head;
        this.sprOffice.spriteFrame = this.sprFrameOffice[this._office.indexOf(role)];
        this.btnOperate.active = role == GameConfig.ROLE.USER;
        this.nodeSubMembers.active = role == GameConfig.ROLE.PROXY;
        this.lblMembers.string = memberCount;
        this.lblStatus.string = lastDate;
    }

    onClickOperate() {
        App.pop(GameConfig.pop.CheckGroupPop, this.user);
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
        const { userID } = this.user;
        Connector.request(GameConfig.ServerEventName.UpdateScore, { score, clubID, userID }, (data) => {
            this.lblScore.string = Number(this.lblScore.string) + App.transformScore(score);
            const { selfScore, targetScore } = data;
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID: this.user.userID, score: targetScore })
            if (selfScore || selfScore == 0)
                App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_MEMBERS, { userID: App.Player.id, score: selfScore })
        })
    }

    onClickCheck() {
        this.parent.init({ userID: this.user.userID });
    }

}