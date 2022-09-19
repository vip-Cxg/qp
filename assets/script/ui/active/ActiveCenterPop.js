import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../common/GameUtils";
import DataBase from "../../../Main/Script/DataBase"
import { App } from "../hall/data/App";
const utils = require('../../../Main/Script/utils');
const icontime = 5;

const { ccclass, property } = cc._decorator
@ccclass
export default class CommonActivePop extends cc.Component {
    @property(cc.Node)
    buyPage = null;
    @property(cc.EditBox)
    amountInput = null;
    @property(cc.Node)
    listPage = null;
    @property(cc.Node)
    listContent = null;
    @property(cc.Node)
    listNoData = null;
    @property(cc.Prefab)
    financeItem = null;

    start() {
        this.showBuyCenter()
    };

    controlPageShow(bool) {
        this.listPage.active = bool;
        this.buyPage.active = !bool;
        this.listContent.removeAllChildren();
    }

    showBuyCenter() {
        this.controlPageShow(false);
    }

    onBuyFinance() {

        let amount = parseInt(this.amountInput.string) || 0;
        if (amount <= 0 || amount > Math.floor(DataBase.player.wallet / 100)) {
            Cache.alertTip("金币不足")
            return;
        }
        if (amount % 1000 != 0) {
            Cache.alertTip("请输入1000的倍数")
            return;
        }
        let endTime=GameUtils.getTimeStamp()+30*24*60*60*1000;
        let endStr=GameUtils.timestampToTime(endTime);
        let ens=new Date(endTime).format("yyyy-MM-dd hh:mm");
        Cache.showConfirm('购买金额: '+amount+'元\n到期时间: '+ens+'\n预计收益(含本金): '+(amount*1.03)+'元',()=>{
            Connector.request(GameConfig.ServerEventName.BuyFinance, {amount:amount*100}, (data) => {
                Cache.alertTip('购买成功');
    
            }, true, (err) => {
                Cache.alertTip(err.message || '购买失败')
            })
        })

       
    }

    showList() {
        this.controlPageShow(true);

        Connector.request(GameConfig.ServerEventName.SearchFinanceRecord, {}, (data) => {
            if (data.fundList) {
                this.listNoData.active = false;
                // let testData=[
                //     {id:10001,reward:3000,amount:100000,endTime:'2021-09-16T17:22:49.000Z',status:'wait'},
                //     {id:100012,reward:3000,amount:100000,endTime:'2021-09-16T17:22:49.000Z',status:'done'},
                //     {id:10003,reward:3000,amount:100000,endTime:'2021-09-16T17:22:49.000Z',status:'cancel'},
                //     {id:100014,reward:3000,amount:100000,endTime:'2021-09-16T17:22:49.000Z',status:'wait'},
                // ]

                data.fundList.forEach(element => {
                    let financeItem = cc.instantiate(this.financeItem);
                    financeItem.getComponent('FinanceItem').renderUI(element);
                    this.listContent.addChild(financeItem);
                });

            } else {
                this.listNoData.active = true;
            }
        }, true, (err) => {
            this.listNoData.active = true;
            Cache.alertTip(err.message || '获取数据失败')
        })
    }
    addAmount() {
        
        let amount = parseInt(this.amountInput.string) || 0;

        amount += 1000;

        if (amount > Math.min(DataBase.player.wallet / 100, 10000))
            amount = Math.min(DataBase.player.wallet / 100, 10000);
        this.amountInput.string = "" + amount;

    }
    reduceAmount() {
        
        let amount = parseInt(this.amountInput.string) || 0;
        amount -= 1000;
        if (amount <= 0)
            amount = 0;
        this.amountInput.string = "" + amount;
    }


    onClosePop() {

        this.node.destroy();
    }
}


