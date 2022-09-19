// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        wordItem: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initData(data) {
        data.forEach(element => {
            let wordItem = cc.instantiate(this.wordItem);
            wordItem.getComponent(cc.Label).string = element;
            this.node.addChild(wordItem);
        });
    }
    // update (dt) {},
});
