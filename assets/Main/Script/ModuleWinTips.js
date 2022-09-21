cc.Class({
    extends: cc.Component,

    properties: {
        word: cc.Label,
        bgSf: [cc.SpriteFrame]
    },

    tipsInit(str, pos) {
        this.node.removeComponent(cc.Layout);
        // str = str.slice(0, 15);
        this.word.string = str;
        let node = this.node;
        node.parent = cc.find("Canvas");
        this.node.zIndex = 501;

        node.width = this.word.node.width + 60;
        node.height = this.word.node.height + 20;
        if (pos != null) {
            node.setPosition(pos);
        } else {
            node.setPosition(0, 100);
        }

        node.setScale(0);
        node.opacity = 0;
        node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.2, 1.2),
                    cc.fadeIn(0.2)
                ),
                cc.scaleTo(0.1, 0.9),
                cc.scaleTo(0.1, 1),
                cc.delayTime(1.5),
                cc.spawn(
                    cc.moveBy(0.5, 0, 50),
                    cc.fadeOut(0.5)
                ),
                cc.removeSelf()
            )
        );
    },

    tipsRightBottom(str) {
        this.node.getComponent(cc.Sprite).spriteFrame = this.bgSf[1];
        this.node.getComponent(cc.Layout).paddingRight = 5;
        this.node.getComponent(cc.Layout).paddingLeft = 5;
        this.word.string = str;
        let node = this.node;
        cc.find("Canvas").addChild(node, 501, "tipsRightBottom");
        // node.width = this.word.node.width + 100;
        // node.height = this.word.node.height + 200;
        node.setPosition(cc.winSize.width / 2 - node.width / 2-10, -cc.winSize.height / 2 + node.height / 2);
    },

    hideTipsRightBottom(str) {
        if (str)
            this.word.string = str;
        let ap = cc.fadeOut(0.5);
        let bp = cc.sequence(cc.delayTime(0.5), ap, cc.callFunc(() => {
            if (this.node) {
                this.node.removeFromParent();
                this.node.destroy();
            }
        }))
        this.node.stopAllActions();
        this.node.runAction(bp);
    }
});
