// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html

import TableInfo from "../../Main/Script/TableInfo";

//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let lineLength = 0;
const ROW = 3;

const { ccclass, property } = cc._decorator
@ccclass
export default class ModuleGroundMJ extends cc.Component {
    @property(cc.Prefab)
    card = null;
    content = [];

    init(data, idx) {
        // let lastPlayer = TableInfo.currentPlayer - 1 >= 0 ? (TableInfo.currentPlayer - 1) : (TableInfo.config.person - 1);
        // let realLastPlayer = TableInfo.realIdx[lastPlayer];
        this.reset();
        data.forEach((card, i) => {
            this.outCard(card, idx, false);
        })
    }

    removeCard() {
        cc.sprFlag.removeFromParent();
        cc.sprFlag.active = false;
        let node = this.content.pop();
        if (node)
            node.destroy();
    }

    summaryDeck(data, idx, light) {
        data.forEach((card, i) => {
            let node = this.outCard(card, idx, false);
            node.color = cc.color(178, 178, 178);
        })
        if (light) {

            let lightNode = cc.instantiate(cc.sprFlag)
            lightNode.parent = this.node.children[this.node.childrenCount - 1];
            lightNode.position = cc.v2(0, 10); //出牌光标位置
            lightNode.active = true;
        }

    }

    outCard(card, realIdx, light) {
        const CARD_COUNT = TableInfo.options.rules.person == 2 ? 10 : 6

        let node = cc.instantiate(this.card);
        node._card = card;
        // TableInfo.outCards.push(card);
        node.active = true;
        this.content.push(node);
        let nodeIndex = this.content.length - 1;
        node.getComponent('ModuleGroundCardsMJ').init(card, realIdx, 1);
        //弃牌区位置摆放
        let x = 0;
        let y = 0;
        switch (realIdx) {
            case 0:
                let width0 = 44.4 - 2.5;
                x = nodeIndex > CARD_COUNT * 2 ? (-this.node.width / 2 + width0 / 2 + (nodeIndex % (CARD_COUNT * 2)) * width0) : (-this.node.width / 2 + width0 / 2 + (nodeIndex % CARD_COUNT) * width0);
                y = nodeIndex > CARD_COUNT * 2 ? (-29.4 - 41.8 * 2) : (-29.4 - 41.8 * Math.floor(nodeIndex / CARD_COUNT))
                break;
            case 1:
                node.zIndex = 88 - nodeIndex;
                let width1 = 58;
                let height1 = 27.55;
                x = nodeIndex > CARD_COUNT * 2 ? width1 / 2 + (width1 - 3.5) * 2 - 2.5 * (nodeIndex % (CARD_COUNT * 2)) : width1 / 2 + (width1 - 3.5) * Math.floor(nodeIndex / CARD_COUNT) - 1.5 * (nodeIndex % CARD_COUNT);
                y = nodeIndex > CARD_COUNT * 2 ? -this.node.height / 2 + height1 / 2 + height1 * (nodeIndex % (CARD_COUNT * 2)) : - this.node.height / 2 + height1 / 2 + height1 * (nodeIndex % CARD_COUNT);
                break;
            case 2:
                node.zIndex = 88 - nodeIndex;
                let width2 = 40.7 - 2.5;
                let height2 = 55;
                x = nodeIndex > CARD_COUNT * 2 ? this.node.width / 2 - width2 / 2 - (nodeIndex % (CARD_COUNT * 2)) * width2 : this.node.width / 2 - width2 / 2 - (nodeIndex % CARD_COUNT) * width2;
                y = nodeIndex > CARD_COUNT * 2 ? 24.7 + 37.5 * 2 : 24.7 + 37.5 * Math.floor(nodeIndex / CARD_COUNT);
                break;
            case 3:
                let width3 = 58;
                let height3 = 27.55
                x = nodeIndex > CARD_COUNT * 2 ? -width3 / 2 - (width3 - 3.5) * 2 - 1.5 * (nodeIndex % (CARD_COUNT * 2)) : -width3 / 2 - (width3 - 3.5) * Math.floor(nodeIndex / CARD_COUNT) - 1.5 * (nodeIndex % CARD_COUNT);
                y = nodeIndex > CARD_COUNT * 2 ? this.node.height / 2 - height3 / 2 - height3 * (nodeIndex % (CARD_COUNT * 2)) : this.node.height / 2 - height3 / 2 - height3 * (nodeIndex % CARD_COUNT);
                break;
        }


        node.position = cc.v2(x, y)
        this.node.addChild(node);
        if (light) {
            cc.sprFlag.parent = node;
            cc.sprFlag.position = cc.v2(0, 10); //出牌光标位置
            cc.sprFlag.active = true;
            // cc.sprFlag.stopAllActions();
            // cc.sprFlag.runAction(cc.repeatForever(
            //     cc.sequence(
            //         cc.moveBy(0.5, 0, 15),
            //         cc.moveBy(0.5, 0, -15),
            //     )
            // ));
        }

        return node
    }
    showSameCard(card) {
        this.resetSameCard();
        this.node.children.forEach(node => {
            if (node.active && node._card == card) {
                node.color = cc.color(150, 150, 150);
            }
        })
    }

    resetSameCard() {
        this.node.children.forEach(node => {
            node.color = node._card == TableInfo.special?.lai ? cc.color('#F6E33B') : cc.color(255, 255, 255);
        })
    }

    reset(idx) {
        this.content = [];
        if (TableInfo.config?.person == 2)
            this.node.width = 750;
        lineLength = TableInfo.config?.person == 2 ? 16 : 7;
        this.node.removeAllChildren();
        // let item = cc.instantiate(this.card);
        // lineLength = Math.floor(this.node.width / (item.width * 1.2))
        // console.log('一行最多' + lineLength + '个');

        // item.destroy();

    }

    // update (dt) {},
}
