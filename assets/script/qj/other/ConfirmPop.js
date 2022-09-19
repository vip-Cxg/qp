const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfirmPop extends cc.Component {
    @property(cc.Node)
    btnConfirm = null
    @property(cc.Node)
    btnCancel = null
    @property(cc.Label)
    lblMessage =  null

    onClickCancel() {
        if (this.callback2 != null)
            this.callback2();
        if (this.node)
            this.node.destroy();
    }

    onClickConfirm() {
        if (this.callback1 != null)
            this.callback1();
        if (this.node)
            this.node.destroy();
    }

    /**
     * 
     * @param {String} message     -弹窗信息
     * @param {Function} callback1   -确定回调
     * @param {Function} callback2   -取消回调
     */
    init({ message, callback1, callback2 }) {
        this.lblMessage.string = "   " + message;
        this.callback1 = callback1;
        this.callback2 = callback2;
        this.node.zIndex = 500;
    }
}
