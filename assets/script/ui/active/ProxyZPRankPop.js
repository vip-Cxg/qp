import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import { length } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class ProxyZPRankPop extends cc.Component {


    @property(cc.Node)
    rankContent = null;
    @property(cc.Prefab)
    rankItem = null;
    @property(cc.Label)
    lblRank = null;
    @property(cc.Label)
    lblTurn = null;
    @property(cc.Toggle)
    notips = null;
    @property([cc.SpriteFrame])
    rankArr = [];




    onLoad() {
        this.notips.isChecked = !GameUtils.getValue(GameConfig.StorageKey.ProxyZPTips, true);
        this.renderList();
    }

    renderList() {
        this.rankContent.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.ProxyZPRank, {}, (data) => {
            try {
                if (!GameUtils.isNullOrEmpty(data.turnRank)) {
                    // let a = [{ proxyID: 1001, turn: 4, name: "发财", rank: 1, phone: "15111016450" },
                    // { proxyID: 1001, turn: 4, name: "发财", rank: 2, phone: "15111016450" },
                    // { proxyID: 1001, turn: 4, name: "发财", rank: 3, phone: "15111016450" },
                    // { proxyID: 1001, turn: 4, name: "发财", rank: 4, phone: "15111016450" },
                    // { proxyID: 1001, turn: 4, name: "发财", rank: 5, phone: "15111016450" },
                    // { proxyID: 1001, turn: 4, name: "发财", rank: 6, phone: "15111016450" }];
    
                    // data.turnRank = a
                    data.turnRank.forEach(element => {
    
                        let rankItem = cc.instantiate(this.rankItem);
                        rankItem.getChildByName('amount').getComponent(cc.Label).string = '当前局数: ' + element.turn + '局';
                        if (element.rank > 4) {
                            rankItem.getChildByName('rank').active = true;
                            rankItem.getChildByName('rankIcon').active = false;
                            rankItem.getChildByName('rank').getComponent(cc.Label).string = '' + element.rank;
    
                        } else {
                            rankItem.getChildByName('rank').active = false;
                            rankItem.getChildByName('rankIcon').active = true;
                            rankItem.getChildByName('rankIcon').getComponent(cc.Sprite).spriteFrame = this.rankArr[element.rank - 1];
    
                        }
                        rankItem.getChildByName('name').getComponent(cc.Label).string = '' + GameUtils.getStringByLength(element.name, 2);
                        rankItem.getChildByName('phone').getComponent(cc.Label).string = '' + element.phone.substr(0, 3) + '****' + element.phone.substr(7);
                        this.rankContent.addChild(rankItem);
    
                    });
                }
    
                if (!GameUtils.isNullOrEmpty(data.selfData)) {
                    this.lblTurn.string = '当前局数: ' + data.selfData.turn + '局';
                    this.lblRank.string = '当前排名: ' + data.selfData.rank;
                }
            } catch (error) {
                
            }
            

        })
    }

    onClickClose() {
        
        GameUtils.saveValue(GameConfig.StorageKey.ProxyZPTips, !this.notips.isChecked)
        this.node.destroy();
    }



}


