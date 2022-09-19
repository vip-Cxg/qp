const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from "../../other/moment"
@ccclass
export default class DiamondStatistics extends cc.Component {
    @property(cc.Node)
    nodeDateOption = null

    @property(cc.Node)
    btnDate = null

    @property(cc.Node)
    membersRankItem = null

    @property(cc.Node)
    content = null

    @property(cc.Label)
    lblDate = null

    parameter = { date: 0, desc: ['turn', 'desc'] };

    onLoad() {
        // let btnOptions = this.nodeDateOption.getChildByName('option');
        // btnOptions._children.forEach((btn, i) => {
        //     btn.on('touchend', this.onClickDateOption.bind(this))
        //     if (i == 0) {
        //         this.onClickDateOption(btn);
        //     }
        // });
    }

    init() {
        // this.content.removeAllChildren();
        // Connector.request(GameConfig.ServerEventName.MembersRank, { ...this.parameter, clubID: App.Club.id }, ({ ranks = [] }) => {
        //     ranks.forEach((r, i) => {
        //         App.instancePrefab(this.membersRankItem, { ...r, index: Number(i) + 1 }, this.content);
        //     })
        // })
    }

    onClickDate() {
        this.nodeDateOption.active = !this.nodeDateOption.active;
    }

    onClickDesc(event) {
        cc.log('onClickDesc');
        let field = event.target._name;
        this.parameter.desc[0] = field;
        this.parameter.desc[1] = this.parameter.desc[1] == 'desc' ? 'asc' : 'desc';
        this.init();
    }

    onClickDateOption(node) {
        let date = node.target._name;
        this.parameter.date = Number(date);
        switch (date) {
            /** 昨天 */
            case '0':
                this.lblDate.string = '昨天';
                break;
            /** 最近7天 */
            case '7':
                this.lblDate.string = '最近7天';
                break;
            /** 最近30天 */
            case '30':
                this.lblDate.string = '最近30天';
                break;
        }
        this.onClickDate();
    }

    onClickSearch() {
        this.init();
    }


  
}