
import { GameConfig } from "../../GameBase/GameConfig";
import GameUtils from "../../script/common/GameUtils";
import ModuleFlowerMJ from "./ModuleFlowerMJ";
import ModuleHandGroundMJ from "./ModuleHandGroundMJ";

const { ccclass, property } = cc._decorator
@ccclass
export default class ModuleOtherHandsMJ extends cc.Component {

    @property(ModuleHandGroundMJ)
    layoutGround=null;
    @property(ModuleFlowerMJ)
    layoutFlower=null;
    realIdx=0;

    onLoad() {
        this.layoutHands = this.node.getChildByName('layoutHands');
        this.layoutGetCard = this.node.getChildByName('layoutGetCard');
        this.layoutGetCard.runAction((cc.repeatForever(cc.sequence(cc.fadeTo(0.5, 130), cc.fadeTo(0.5, 255)))));
    }
    //TODO 传 realIdx
    init(player, realIdx, anim = false) {
        this.realIdx = realIdx;
        this.node.active = true;
        console.log("初始化对方手牌-----", player)
        let { hands } = player;
        this.layoutGetCard.active = hands % 3 == 2;
        for (let i = 0; i < hands - Number(hands % 3 == 2); i++) {
            this.layoutHands.children[i].active = !anim;
            if (anim)
                setTimeout(() => {
                    this.layoutHands.children[i].active = true;
                }, 300 * Math.floor(i / 4))
        }
        if (!GameUtils.isNullOrEmpty(player.grounds)) {
            let groundArr = player.grounds.filter(e => e.event != GameConfig.GameAction.FLOWER);
            this.layoutGround.initGround(groundArr, realIdx);
            let flowerArr = player.grounds.filter(e => e.event == GameConfig.GameAction.FLOWER);
            this.layoutFlower.initFlower(flowerArr, realIdx);

        }
        if (!GameUtils.isNullOrEmpty(player.lai)) {
            this.layoutFlower.initFlower(player.lai, realIdx);

        }

    }

    outCard() {
        if (this.layoutGetCard.active)
            this.layoutGetCard.active = false;
        else {
            this.removeHands();
        }
    }

    getCard(handsCount) {
        // console.log("对面现在手牌数",----handsCount)
        console.log("11", this.layoutGetCard.active)
        this.layoutGetCard.active = true;
        // for (let i = 0; i < 13; i++) {
        //     this.layoutHands.children[i].active = i<handsCount;// true;
        // }
    }

    setHands(data) {
        console.log('--删除类型-', data);
        switch (data.event) {
            case GameConfig.GameAction.PONG:
            case GameConfig.GameAction.CHOW:
                console.log('--删除2张-');
                this.removeHands();
                this.removeHands();
                break;
            case GameConfig.GameAction.ZHI:
                console.log('--删除3张-');
                this.removeHands();
                this.removeHands();
                this.removeHands();
                break;
            // case GameConfig.GameAction.FLOWER: //花不减牌
            case GameConfig.GameAction.SHOW:
                // case GameConfig.GameAction.BU:
                console.log('--删除1张-');
                this.removeHands();
                break;
            case GameConfig.GameAction.KONG:
                console.log('--删除4张-');
                this.removeHands();
                this.removeHands();
                this.removeHands();
                this.removeHands();
                break;
        }
    }

    removeHands() {
        //cc.log('removeHands');
        if (this.layoutGetCard.active == true) {
            this.layoutGetCard.active = false;
            //cc.log(111);
            return;
        }
        console.log('位置', this.layoutHands.x)
        let hands = this.layoutHands.children;

        if (this.realIdx == 3) {
            let idx = hands.findIndex(node => node.active == true);
            //cc.log(idx);
            if (idx >= 0) {
                hands[idx].active = false;
            }
            return;
        }

        for (let i = hands.length - 1; i >= 0; i--) {
            if (hands[i].active) {
                hands[i].active = false;
                return;
            }
        }
    }

    //碰吃杠 
    action(data, realIdx) {
        this.setHands(data);
        this.layoutGround.addGround(data, realIdx);
    }

    /**海南麻将  花 */
    actionflower(data, realIdx) {

        this.setHands(data);

        this.layoutFlower.addFlower(data, realIdx);
    }

    /**潜江晃晃  出癞子牌 */
    actionLai(data, realIdx) {
        this.layoutFlower.addFlower(data, realIdx);
    }

    resetHands() {
        this.layoutGetCard.active = false;
        this.layoutHands.children.forEach(node => {
            node.active = false;
        });
    }

    reset() {
        this.layoutGround.resetGround();
        this.layoutFlower.resetFlower();

        this.layoutGetCard.active = false;
        this.layoutHands.children.forEach(node => {
            node.active = false;
        });
    }
}
