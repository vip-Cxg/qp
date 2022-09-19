import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator
@ccclass
export default class VIPAdPop extends cc.Component {
    @property(cc.SpriteFrame)
    defaultSpr = null;
    @property(cc.Sprite)
    sprImg = null;
    startTime = 0;
    start() {
        this.startTime = GameUtils.getTimeStamp();
        this.renderUI()
    };
    renderUI(index) {
        let url='http://xy.shukecoffee.com/active/vip_desc.png'
        //'http://xy.shukecoffee.com/xyqp_client-release.apk'
        GameUtils.loadImg(url).then((tex) => {
            // let spriteFrame = new cc.SpriteFrame(tex);
            this.sprImg.spriteFrame = tex;
        }).catch((err)=>{
            this.sprImg.spriteFrame = this.defaultSpr;

        });
    }

   
    onClosePop() {
        this.node.destroy();
    }

    onDestroy() {
        let durTime = GameUtils.getTimeStamp() - this.startTime;
        GameUtils.LogsClient(GameConfig.LogsEvents.AD_BEHAVIOR, { action: GameConfig.LogsActions.AD_DURTIME, times: parseFloat((durTime / 1000).toFixed(2)) })
    }
    // update(dt) {
    //     this.interval++;
    //     if (this.interval % 60 == 0) {
    //         this.interval = 0;
    //         this.changeTime++;
    //         if (this.changeTime >= icontime && GameConfig.ActiveContentData.length > 1) {
    //             this.changeTime = 0;
    //             this.changeIcon();
    //         }
    //     }
    // }
}


