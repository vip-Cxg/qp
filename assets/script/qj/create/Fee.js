
const { ccclass, property } = cc._decorator
 var { GameConfig } = require("../../../GameBase/GameConfig");
import { App } from "../../ui/hall/data/App";
@ccclass
export default class Fee extends cc.Component {



    @property(cc.Label)
    lbAA = null;
    @property(cc.Toggle)
    togglePay = [];
    @property(cc.Label)
    lbLimit = null;
    @property(cc.Label)
    lbFree = null;
    @property(cc.Label)
    lbScore = [];
    @property(cc.Label)
    lbFee = [];
    @property(cc.Node)
    nodeAA = null
    @property(cc.Node)
    nodeLimit = null
    @property(cc.Node)
    nodeFee = null
    @property(cc.Node)
    nodeBmfs = null
    @property(cc.Label)
    lblFixed = null;
    @property(cc.Label)
    lblPercentage = null;

    @property(cc.Toggle)
    toggleHost = [];

    fee = {
        isAA: true,
        aaFee: 0,
        limit: 0,
        win: {
            score: [50, 100, 200, 500],
            winFee: [5, 10, 15, 20],
            free: 0
        },
        payMode: 0,
        hostFee: 0,
        hostFeeMode: 0
    }

    onLoad() {
       
    }

    init(data) {
        this.lblFixed.string = '123';

        this.lblHostFee = [this.lblFixed, this.lblPercentage];
        if (Object.keys(data).length > 0) {
            this.fee = {...this.fee, ...data };
        }
        let { win: { free, score, winFee }, isAA, aaFee, limit, hostFee = 0, hostFeeMode = 0 } = this.fee;
        this.lblHostFee[hostFeeMode].string = hostFee;
        if (hostFeeMode == 1) {
            this.lblHostFee[hostFeeMode].string += '%';
        }
        this.toggleHost[1].isChecked = hostFeeMode == 1;
        this.togglePay[0].isChecked = isAA == false;
        this.lbFree.string = free;
        this.lbLimit.string = limit;
        this.lbAA.string = aaFee;
        this.lbFee.forEach((lbl, i) => {
            lbl.string = winFee[i];
        })
        this.lbScore.forEach((lbl, i) => {
            if (i == 0) {
                lbl.string = 0;
                return;
            }
            if (i % 2 == 1) {
                lbl.string = score[Math.floor(i / 2)];
            } else {
                lbl.string = Number(this.lbScore[i - 1].string) + 1;
            }
        })
        let payMode = App.Club.payMode;

        /** 钻石代理AA支付 */
        if (payMode == 1) {
            this.nodeFee.active = false;
            this.nodeAA.position = cc.v2(-55, -60);
            this.nodeLimit.position = cc.v2(130, -60);
            this.nodeBmfs.position = cc.v2(-345, 35);
            this.node.height = 80;
            this.toggleHost[0].node.position = cc.v2(-193, -42);
        }
    }

    inputAA() {
        if (!this.togglePay[1].isChecked) {
            this.togglePay[1].isChecked = true;
            return;
        }
        App.pop(GameConfig.pop.InputPop, (value) => {
            this.lbAA.string = value;
        });
    }

    inputFixed() {
        if (!this.toggleHost[0].isChecked) {
            this.toggleHost[0].isChecked = true;
            return;
        }
        App.pop(GameConfig.pop.InputPop, (value) => {
            this.lblFixed.string = value;
        });
    }

    inputPercentage() {
        if (!this.toggleHost[1].isChecked) {
            this.toggleHost[1].isChecked = true;
            return;
        }
        App.pop(GameConfig.pop.InputPop, (value) => {
            if (value > 100) {
                App.alertTips('百分比范围0-100');
                return;
            }
            this.lblPercentage.string = value + '%';
        });
    }

    inputLimit() {
        App.pop(GameConfig.pop.InputPop, (value) => {
            this.lbLimit.string = value;
        });
    }

    onInputFree() {
        if (!this.togglePay[0].isChecked) {
            this.togglePay[0].isChecked = true;
            return;
        }
        App.pop(GameConfig.pop.InputPop, (value) => {
            this.lbFree.string = value;
        });
    }

    updateScore(index, value) {
        let initial = Number(this.lbScore[index].string);
        if (index + 2 < this.lbScore.length && value < Number(this.lbScore[index + 2].string)) {
            this.lbScore[index].string = value;
            this.lbScore[index + 1].string = Number(value) + 1;
            return;
        }
        for (let i = this.lbScore.length - 1; i >= index; i--) {
            if (i != index && i % 2 == 1) {
                let v = Number(this.lbScore[i].string);
                this.lbScore[i].string = v + (value - initial);
            }
            if (i == index) {
                this.lbScore[i].string = value;
            }
            if (i % 2 == 1 && i + 1 < this.lbScore.length) {
                this.lbScore[i + 1].string = Number(this.lbScore[i].string) + 1;
            }
        }
    }

    onInputScore(_, index) {
        index = Number(index);
        if (!this.togglePay[0].isChecked) {
            this.togglePay[0].isChecked = true;
            return;
        }
        App.pop(GameConfig.pop.InputPop, (value) => {
            if (value <= this.lbScore[index - 1].string) {
                App.alertTips('输入值不能小于区间最小值')
                return;
            }
            this.updateScore(index, value);
            // this.lbScore[index].string = value;
            // if (index < this.lbScore.length - 1) {
            //     this.lbScore[index + 1].string = Number(value) + 1;
            // }
        });
    }

    onInputFee(_, index) {
        if (!this.togglePay[0].isChecked) {
            this.togglePay[0].isChecked = true;
            return;
        }
        App.pop(GameConfig.pop.InputPop, (value) => {
            this.lbFee[index].string = value;
        });
    }

    get output() {
        if (!this.node.active) {
            return {};
        }
        let hostFeeMode = this.toggleHost.findIndex(p => p.isChecked);
        return {
            isAA: this.togglePay[1].isChecked,
            aaFee: Number(this.lbAA.string),
            limit: Number(this.lbLimit.string),
            win: {
                score: this.lbScore.map(label => Number(label.string)).
                filter((l, i) => [1, 3, 5, 7].includes(Number(i))),
                winFee: this.lbFee.map(label => Number(label.string)),
                free: Number(this.lbFree.string)
            },
            payMode: App.Club.payMode,
            hostFee: Number(this.lblHostFee[hostFeeMode].string.replace('%', '')),
            hostFeeMode
        }
    }
}


