import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../common/GameUtils";
import { App } from "../hall/data/App";

const STATUS_DESC = {
    deposit: '未到期',
    income: '已到期',
    withdraw: '已取出',
}

const { ccclass, property } = cc._decorator
@ccclass
export default class FinanceItem extends cc.Component {

    @property(cc.Label)
    lblAmount = null;
    @property(cc.Label)
    lblReward = null;
    @property(cc.Label)
    lblEndTime = null;
    @property(cc.Label)
    lblId = null;
    @property(cc.Label)
    lblStatus = null;
    @property(cc.Node)
    btnNode = null;
    // @property(cc.Label)
    // lblDesc = null;
    // amountInput: cc.EditBox,
    // amountLbl: cc.Label,
    // alipayBtn: cc.Toggle,
    // wechatBtn: cc.Toggle,
    // bankBtn: cc.Toggle,
    // tradeInfoPop: cc.Prefab,
    // payType: "",
    // tradeData: null,
    financeID = null
    renderUI(data) {
        this.lblAmount.string = '理财金额: ' + Math.floor(data.capital / 100) + '元';
        this.lblReward.string = '预计收益(含本金): ' + Math.floor((data.capital * (1 + data.rate / 100)) / 100) + '元';
        this.lblId.string = '订单号: ' + data.id;
        this.financeID = data.id;
        this.lblEndTime.string = '到期时间: ' + new Date(GameUtils.getTimeStamp(data.createdAt) + 30 * 24 * 60 * 60 * 1000).format("yyyy-MM-dd hh:mm");
        this.lblStatus.string = STATUS_DESC[data.status];
        this.btnNode.active = data.status != 'withdraw';

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (data.status == 'withdraw')
                return;
            if (data.status == 'deposit') {
                Cache.showConfirm('提前取出,无法获得收益\n是否继续取出?', () => {
                    this.onSellFinance();
                })
                return;
            }
            this.onSellFinance();
        }, this)
    }

    onSellFinance() {
        Connector.request(GameConfig.ServerEventName.SellFinance,{fundID:this.financeID},(res)=>{
            Cache.alertTip('取出成功,已存入钱包');
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_FINANCE_LIST);
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_WALLET_DATA);
        },true,(err)=>{
            Cache.alertTip(err.message||'取出失败,请稍后再试');
        })
    }

}


