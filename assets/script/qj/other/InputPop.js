
const { ccclass, property } = cc._decorator
@ccclass
export default class InputPop extends cc.Component {
    @property(cc.Label)
    lbInput = null;
    @property(cc.Label)
    lblTitle = null;
    @property(cc.Node)
    nodeTitle = null;
    callback = null;

    @property(cc.Node)
    nodeBtn = null

    

    init(callback, title = '') {
        this.node.active = true;
        if (title.length > 0) {
            this.nodeTitle.active = true;
            this.lblTitle.string = title;
        } else {
            this.nodeTitle.active = false;
        }
        if (callback) this.callback = callback;
        this.lbInput.string = '0'
        this.nodeBtn._children.forEach(node => {
            node.on('touchend', this.input.bind(this));
        })
    }

    input(event) {
        let value = Number(event.target._name);
        // 清除
        if (value == -2) {
            this.lbInput.string = '0'
            return;
        }
          //确认
        if (value == -1) {
            this.doConfirm();
            return;
        }
        
        if (this.lbInput.string == '0') {
            this.lbInput.string = value;
            return;
        } 
        this.lbInput.string += value + '';
    }

    doExit() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    doConfirm() {
        if (this.callback) this.callback(Number(this.lbInput.string));
        this.doExit();
    }
}


