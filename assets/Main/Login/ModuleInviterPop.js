
const Cache = require("../Script/Cache");

cc.Class({
    extends: cc.Component,

    properties: {
        inviterBox: cc.EditBox,
        lblMsg: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    show(msg, callback) {
        this.lblMsg.string = "" + msg;
        this.callback = callback;
    },
    ensure() {
        

        if (this.callback) {
            this.callback(this.inviterBox.string.toUpperCase());
            if (this.node) {
                this.node.removeFromParent();
                this.node.destroy();
            }
        }
    },
    /**关闭弹窗 */
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },

    // update (dt) {},
});
