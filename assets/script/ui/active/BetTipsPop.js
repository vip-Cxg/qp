import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import { length } from "../../../Main/Script/audio-ctrl";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import { App } from "../hall/data/App";
const { ccclass, property } = cc._decorator
@ccclass
export default class BetTipsPop extends cc.Component {

  
  
    @property(cc.Label)
    lblAmount = null;
    @property(cc.Label)
    lblMinReward = null;
    @property(cc.Label)
    lblDesc = null;
    @property(cc.Toggle)
    notips = null;


    onLoad() {
        this.notips.isChecked = !GameUtils.getValue(GameConfig.StorageKey.SummaryBetTips, true);

    }
    renderUI(data = 0) {
        this.lblAmount.string = '当局获胜金额: ' + (data / 100).toFixed(2) + '元';
        this.lblMinReward.string = '投注保底收益: ' + (data*GameConfig.BetRate / 200).toFixed(2) + '元';
        this.lblDesc.string = '平台送福利! 单双投注赔率均为1赔'+GameConfig.BetRate+' \n押注单双相同金额即可获得保底奖励.';
        // \n投注最高收益:' + ((data * 2.2) / 100).toFixed(2) + '元 \n投注最低收益: ' + ((data * 2.2) / 200).toFixed(2)  + '元
    }

    onClickClose() {
        
        GameUtils.saveValue(GameConfig.StorageKey.SummaryBetTips, !this.notips.isChecked)
        this.node.destroy();
    }



}


