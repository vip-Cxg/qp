import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import { App } from "../hall/data/App";
const utils = require('../../../Main/Script/utils');
const icontime = 5;

const { ccclass, property } = cc._decorator
@ccclass
export default class CommonActivePop extends cc.Component {
    @property(cc.Sprite)
    btnSprite = null;
    @property(cc.Node)
    animNode = null;
    changeTime = 0;
    currentIndex = 0;
    interval = 0;
    endTime = null;

    start() {
        this.renderUI(0);
    };
    renderUI(index) {
        if (utils.isNullOrEmpty(GameConfig.ActiveContentData)) return;
        let url = GameConfig.ActiveContentData[index].url;
        GameUtils.loadImg(url).then((tex) => {
            // let spriteFrame = new cc.SpriteFrame(tex);
            this.btnSprite.spriteFrame = tex;
        });
    }

    onClickSprite() {
        if (GameUtils.isNullOrEmpty(GameConfig.ActiveContentData)) return;
        if (GameUtils.isNullOrEmpty(GameConfig.ActiveContentData[this.currentIndex].touchType)) return;
        GameUtils.LogsClient(GameConfig.LogsEvents.AD_BEHAVIOR, { action: GameConfig.LogsActions.CLICK_AD })
        utils.pop(GameConfig.pop[GameConfig.ActiveContentData[this.currentIndex].touchType])
    }


    changeIcon() {
        this.currentIndex++;
        if (this.currentIndex > (GameConfig.ActiveContentData.length - 1))
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
    onClosePop() {
        this.node.destroy();
    }
    update(dt) {
        this.interval++;
        if (this.interval % 60 == 0) {
            this.interval = 0;
            this.changeTime++;
            if (this.changeTime >= icontime && GameConfig.ActiveContentData.length > 1) {
                this.changeTime = 0;
                this.changeIcon();
            }
        }
    }
}


