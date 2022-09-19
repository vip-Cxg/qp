import { GameConfig } from "../../../GameBase/GameConfig";
import { PopupManager } from "../../base/pop/PopupManager";
import GameUtils from "../../common/GameUtils";
import utils from "../../../Main/Script/utils"
import { App } from "../hall/data/App";
const icontime = 5;

const { ccclass, property } = cc._decorator
@ccclass
export default class acitveBtn extends cc.Component {
    @property(cc.Sprite)
    btnSprite = null;
    @property(cc.Label)
    lblTime = null;
    @property(cc.Node)
    animNode = null;
    changeTime = 0;
    currentIndex = 0;
    interval = 0;
    endTime = null;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.openPop, this);
    };
    startRender(){
        this.renderUI(this.currentIndex);
    }
    stopRender(){
        this.endTime=null;
    }
    renderUI(index) {
        if(utils.isNullOrEmpty(GameConfig.ActiveIconData)) return;
        let url = GameConfig.ActiveIconData[index].url;
        this.endTime = GameConfig.ActiveIconData[index].endTime;
        GameUtils.loadImg(url).then((tex) => {
            // let spriteFrame = new cc.SpriteFrame(tex);
            // console.log("123123",spriteFrame)
            this.btnSprite.spriteFrame = tex;
        });
    }



    changeIcon() {
        this.currentIndex++;
        if (this.currentIndex > (GameConfig.ActiveIconData.length - 1))
            this.currentIndex = 0;
        this.changeAnim();
    }
    changeAnim() {
        // 0.5, spaw(fadeOut, scale, 1->0.4)  然后 0.5 spaw(fade, scale, 0.4->1)
        let ap = cc.fadeOut(0.5);
        let bp = cc.scaleTo(0.5, 0.4);
        let cp = cc.spawn(ap, bp);
        let dp = cc.fadeIn(0.5);
        let ep = cc.scaleTo(0.5, 1);
        let fp = cc.spawn(dp, ep);
        let gp = cc.sequence(cp, cc.callFunc(() => {
            this.renderUI(this.currentIndex);
        }), fp)
        this.animNode.runAction(gp)

    }

    update(dt) {
        this.interval++;
        if (this.interval % 60 == 0) {
            this.interval = 0;
            this.changeTime++;
            if (this.changeTime >= icontime && GameConfig.ActiveIconData.length > 1) {
                this.changeTime = 0;
                this.changeIcon();
                return;
            }
            if (!this.endTime) return;
            let second = Math.floor(GameUtils.getTimeStamp(this.endTime) / 1000) - Math.floor(GameUtils.getTimeStamp() / 1000);
            if (second > 0) {
                this.lblTime.string = '' + GameUtils.timeToString(second);
            }
        }
    }


    openPop() {
        PopupManager.show(GameConfig.pop.CommonActivePop)
        // PopupManager.show()
    }
}


