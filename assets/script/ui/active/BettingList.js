import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import { length } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../hall/data/App";
const STATUS_DESC = {
    'wait': '未开奖',
    'done': '中奖',
    'draw': '未中奖',
}
const { ccclass, property } = cc._decorator
@ccclass
export default class BettingList extends cc.Component {
    @property(cc.Node)
    listContainer = null;
    @property(cc.Node)
    historyContainer = null;
    @property(cc.Node)
    ruleContainer = null;
    @property(cc.Node)
    detailContainer = null;

    @property(cc.Node)
    listContent = null;
    @property(cc.Prefab)
    listItem = null;
    @property(cc.Node)
    historyContent = null;
    @property(cc.Prefab)
    historyItem = null;
    @property(cc.Node)
    noData = null;


    @property(cc.Node)
    detailContent = null;
    @property(cc.Prefab)
    detailItem = null;


    @property(cc.Label)
    lblTitle = null;
    @property(cc.SpriteFrame)
    redSf = null;

    renderList() {
        this.lblTitle.string = '投注记录'
        this.listContent.removeAllChildren();
        this.noData.active = false;
        this.listContainer.active = true;
        this.historyContainer.active = false;
        this.ruleContainer.active = false;
        this.detailContainer.active = false;
        Connector.request(GameConfig.ServerEventName.BettingList, {}, (data) => {
            if (GameUtils.isNullOrEmpty(data.list)) {
                this.noData.active = true;
            } else {
                // amount: 12300
                // createdAt: "2021-09-28T14:50:54.000Z"
                // id: 10000001
                // lottery: 0
                // rate: 220
                // reward: 27060
                // serialID: 2021114
                // status: "done"
                // strDate: "20210928"
                // updatedAt: "2021-10-07T00:27:03.000Z"
                // userID: 100019
                data.list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                data.list.forEach(element => {

                    let recordItem = cc.instantiate(this.listItem);
                    recordItem.getChildByName('turn').getComponent(cc.Label).string = '第' + (element.serialID || 1) + '期'; //(element.lottery == 1 ? '单' : '双');
                    recordItem.getChildByName('rate').getComponent(cc.Label).string = (element.rate / 100) + ''; //(element.lottery == 1 ? '单' : '双');
                    recordItem.getChildByName('amount').getComponent(cc.Label).string = (element.amount / 100) + '元';//#19CB40 绿    #E5B67A
                    if (element.status == 'done') {
                        recordItem.getChildByName('status').getComponent(cc.Label).string = element.reward > 0 ? '中奖' : '未中奖';
                        recordItem.getChildByName('status').color = element.reward > 0 ? new cc.color('#D7042A') : new cc.color('#888888');
                    }
                    if (element.lottery == 1) {
                        recordItem.getChildByName('oddIcon').getComponent(cc.Sprite).spriteFrame = this.redSf;
                    } else {
                        recordItem.getChildByName('evenIcon').getComponent(cc.Sprite).spriteFrame = this.redSf;

                    }
                    this.listContent.addChild(recordItem);
                });
            }
        })
    }

    renderHistory() {
        this.lblTitle.string = '往期记录'
        this.historyContent.removeAllChildren();
        this.noData.active = false;
        this.listContainer.active = false;
        this.historyContainer.active = true;
        this.ruleContainer.active = false;
        this.detailContainer.active = false;

        Connector.request(GameConfig.ServerEventName.Bettinghistory, {}, (data) => {
            if (GameUtils.isNullOrEmpty(data.history)) {
                this.noData.active = true;
            } else {
                data.history.sort((a, b) => b.serialID - a.serialID);
                data.history.forEach(element => {

                    let recordItem = cc.instantiate(this.historyItem);
                    recordItem.getChildByName('turn').getComponent(cc.Label).string = '第' + (element.serialID || 1) + '期'; //(element.lottery == 1 ? '单' : '双');
                    element.ball.forEach((e, i) => {
                        recordItem.getChildByName('icon' + i).getChildByName('desc').getComponent(cc.Label).string = '' + e;//#19CB40 绿    #E5B67A
                    })

                    let lastNum = parseInt(element.ball[6]);
                    if (lastNum % 2 == 0) {
                        recordItem.getChildByName('evenIcon').getComponent(cc.Sprite).spriteFrame = this.redSf;
                    } else {
                        recordItem.getChildByName('oddIcon').getComponent(cc.Sprite).spriteFrame = this.redSf;
                    }
                    this.historyContent.addChild(recordItem);
                });
            }
        })
    }
    renderRule() {
        this.lblTitle.string = '玩法说明';
        this.noData.active = false;
        this.listContainer.active = false;
        this.historyContainer.active = false;
        this.detailContainer.active = false;
        this.ruleContainer.active = true;
    }
    renderDetail() {
        this.lblTitle.string = '下级详情';
        this.noData.active = false;
        this.listContainer.active = false;
        this.historyContainer.active = false;
        this.ruleContainer.active = false;
        this.detailContainer.active = true;

        this.detailContent.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.BetSubDetail, {}, (data) => {

            if (!GameUtils.isNullOrEmpty(data.detail)) {
                data.detail.forEach(e => {
                    let detailItem = cc.instantiate(this.detailItem);
                    detailItem.getChildByName('avatar').getComponent('Avatar').avatarUrl = e.user.head;
                    detailItem.getChildByName('name').getComponent(cc.Label).string = e.user.name;
                    detailItem.getChildByName('id').getComponent(cc.Label).string = e.userID;
                    detailItem.getChildByName('wallet').getComponent(cc.Label).string = GameUtils.formatGold(parseInt(e.userScore)) + '元';
                    this.detailContent.addChild(detailItem);
                })
            } else {
                this.noData.active = true;
            }
        });

    }

    onClickClose() {
        
        this.node.destroy();
    }



}


