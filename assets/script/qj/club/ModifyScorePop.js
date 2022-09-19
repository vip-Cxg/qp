const { ccclass, property } = cc._decorator;
import { App } from "../../ui/hall/data/App";
import Connector from "../../../Main/NetWork/Connector";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";

@ccclass
export default class ModifyScorePop extends cc.Component {
    @property(cc.Label)
    lblCurrentScore = null
    @property(cc.Label)
    lblScore = null
    @property(cc.Label)
    lblInput = null
    @property(cc.Node)
    nodeBtn = null
    callback = null
    @property(cc.Label)
    lblSymbol = null
    symbol = null

    init({ score, symbol }, callback) {
        this.symbol = symbol;
        this.lblSymbol.string = symbol;
        if (callback) this.callback = callback;
        this.lblCurrentScore.string = score;
        this.lblScore.string = score;
        this.lblInput.string = '0';
        this.nodeBtn._children.forEach(node => {
            node.on('touchend', this.input.bind(this));
        })
    }

    input(event) {
        let value = Number(event.target._name);
        /** 清除 */
        if (value == -2) {
            this.lblInput.string = '0';
            this.updateResultScore();
            return;
        }
        /**确定 */
        if (value == -1) {
            this.doConfirm();
            return;
        }
        /** 最多两位小数 */
        let array = this.lblInput.string.split('.');
        if (array.length > 1 && array[1].length >= 2) {
            return;
        }
        /** 最多7位 */
        if (this.lblInput.string.length >= 7) {
            return
        }
        /** 小数点 */
        if (value == -3 ) {
            if (this.lblInput.string.split('').filter(s => s == '.').length >= 1) {
                return;
            }
            this.lblInput.string += '.';
            return;
        }
     
        if (this.lblInput.string == '0') {
            this.lblInput.string = value;
            this.updateResultScore();
            return;
        } 
        this.lblInput.string += value;
        this.updateResultScore();
    }

    updateResultScore() {
        if (this.symbol == '+') {
            this.lblScore.string = Number(this.lblCurrentScore.string) + Number(this.lblInput.string) + '';
        } else {
            this.lblScore.string = Number(this.lblCurrentScore.string) - Number(this.lblInput.string) + '';
        }
        
    }

    doConfirm() {
        let value = Number(this.lblInput.string);
        if (this.symbol == '-')  value = value * -1;
        if (this.callback) this.callback(value * 100);
        this.onClickClose();

    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}