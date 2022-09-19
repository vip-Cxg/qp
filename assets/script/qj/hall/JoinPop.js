
const { ccclass, property } = cc._decorator
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
@ccclass
export default class InputPop extends cc.Component {
    @property(cc.Label)
    lbInput = null;
    @property(cc.Node)
    nodeBtn = null;
    
    callback = null;

    init(callback) {
        this.node.active = true;
        if (callback) this.callback = callback;
        this.lbInput.string = ''
        this.nodeBtn.children.forEach(node => {
            node.on(cc.Node.EventType.TOUCH_END, this.input, this);
        })
    }

    input(event) {
        let value = event.target._name;
        // 清除
        if (value == -2) {
            this.lbInput.string = ''
            return;
        }
          //确认
        if (value == -1) {
            this.lbInput.string = this.lbInput.string.slice(0, -2);
            return;
        }
        
        if (this.lbInput.string == '0') {
            this.lbInput.string = value;
            return;
        }
        this.lbInput.string += value + ' ';
        if (this.lbInput.string.length == 12) {
            this.doConfirm();
        }
    }

    doExit() {
        if (this.node) {
            this.node.active = false;
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    successCallback(data) {
        Connector.connect(data, () => {
            let { data: { gameType } } = data;
            GameConfig.CurrentGameType = gameType;
            cc.director.loadScene(GameConfig.TABLE_TYPE[gameType]);
        });
    }

    doConfirm() {
        if (this.callback) this.callback(Number(this.lbInput.string));
        Connector.request(GameConfig.ServerEventName.JoinClubGame, { tableID: Number(this.lbInput.string.replace(/\s+/g, '')) });
        this.doExit();
    }
}


