const { ccclass, property } = cc._decorator;
import { App } from "../../../ui/hall/data/App";
import Connector from "../../../../Main/NetWork/Connector";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import moment from "../../other/moment"
import Cache from "../../../../Main/Script/Cache";
@ccclass
export default class DiamondStatistics extends cc.Component {

    @property(cc.Node)
    item = null

    @property(cc.Node)
    content = null



    @property(cc.Label)
    lblStartDate = null

    @property(cc.Label)
    lblEndDate = null


    parameter = { date: 0, desc: ['turn', 'desc'] };

    onLoad() {
    
    }

    init() {


        this.lblStartDate.string = moment().hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm');
        this.lblEndDate.string =  moment().format('YYYY-MM-DD HH:mm');
        // this.content.removeAllChildren();
        // Connector.request(GameConfig.ServerEventName.MembersRank, { ...this.parameter, clubID: App.Club.id }, ({ ranks = [] }) => {
        //     ranks.forEach((r, i) => {
        //         App.instancePrefab(this.membersRankItem, { ...r, index: Number(i) + 1 }, this.content);
        //     })
        // })
    }

    onClickDate(e,idx) {
        let lbl = idx == 0 ? this.lblStartDate : this.lblEndDate;
        App.pop(GameConfig.pop.DayHourMinutePop, [lbl.string, (date) => {
            lbl.string = date;
        }]);
    }


    onClickDesc(event) {
        cc.log('onClickDesc');
        let field = event.target._name;
        this.parameter.desc[0] = field;
        this.parameter.desc[1] = this.parameter.desc[1] == 'desc' ? 'asc' : 'desc';
        this.init();
    }

    onClickDay(e, day) {
        if (day == 1) {
            this.lblStartDate.string = moment().add(-1, 'days').format('YYYY-MM-DD 00:00');
            this.lblEndDate.string = moment().add(-1, 'days').format('YYYY-MM-DD 23:59');
        }
        if (day == 3) {
            this.lblStartDate.string = moment().add(-3, 'days').format('YYYY-MM-DD HH:mm');
            this.lblEndDate.string = moment().format('YYYY-MM-DD HH:mm');
        }
        if (day == 7) {
            this.lblStartDate.string = moment().add(-7, 'days').format('YYYY-MM-DD HH:mm');
            this.lblEndDate.string = moment().format('YYYY-MM-DD HH:mm');
        }
    }

    onClickSearch() {
        let  req={
            oglClubID :App.Club.oglID,
            isLeague : App.Club.isLeague,
            date:[this.lblStartDate.string, this.lblEndDate.string],
            clubID:App.Club.id,
        }
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.DiamondStatistic, req, ({ logs }) => {
            if(logs.rows.length==0){
                Cache.alertTip('暂无数据')
                return;
            } 
            // for( let i=0)
            logs.rows.forEach(l => {
                App.instancePrefab(this.item, l, this.content);
            })
        })
    }


  
}