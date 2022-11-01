import { GameConfig } from "../../../../GameBase/GameConfig"
import GameUtils from "../../../common/GameUtils"
import Avatar from "../../../ui/common/Avatar"
import moment from "../../other/moment"
const { ccclass, property } = cc._decorator
@ccclass
export default class RecordItem extends cc.Component {
    @property(cc.Label)
    lblDate = null
    @property(cc.Label)
    lblTableID = null
    @property(cc.Label)
    lblTurn = null
    @property(cc.Label)
    lblGame = null
    @property(cc.Label)
    lblPay = null
    @property(cc.Sprite)
    sprType = null
    @property(cc.SpriteFrame)
    spriteFrameType = []
    @property(cc.Prefab)
    recordPlayerItem = null
    @property(cc.Node)
    layerPlayer = null


    @property(cc.Node)
    disbandInfo = null

    _data = null;
    init(row) {
        this._data = row;
        let { createdAt, data: { details, players, fee }, gameType, tableID, isLeague } = row;
        this.lblDate.string = moment(createdAt).format('YYYY/MM/DD HH:mm:ss');
        this.lblTableID.string = '房号:' + tableID;
        let person = players.length;
        this.lblGame.string = '玩法:' + GameConfig.GameName[gameType]
        this.lblTurn.string = '局数:' + details.length;
        if (isLeague == 0) {
            this.lblPay.string = '馆主支付';
        } else if (isLeague == 1) {
            this.lblPay.string = fee.isAA ? 'AA支付' : '大赢家分档支付';
        }

        this.sprType.spriteFrame = this.spriteFrameType[person];
        this.layerPlayer.removeAllChildren();
        let maxScore = Math.max(...players.map(p => p.total));
        players.forEach(p => {
            p.maxScore = maxScore;
            GameUtils.instancePrefab(this.recordPlayerItem, p, this.layerPlayer);
        })

        console.log("disbandInfo",row.disbandInfo)
        if (!GameUtils.isNullOrEmpty(row.disbandInfo)) {
            this.disbandInfo.active = true;
            this.disbandInfo.getChildByName('Avatar').getComponent(Avatar).avatarUrl = row.disbandInfo.head;
            this.disbandInfo.getChildByName('lblName').getComponent(cc.Label).string = row.disbandInfo.name;
            this.disbandInfo.getChildByName('lblID').getComponent(cc.Label).string = 'ID: '+row.disbandInfo.id;
        } else {
            this.disbandInfo.active = false;
        }
    }

    onClickCheck() {
        GameUtils.instancePrefab(GameConfig.pop.RecordDetailPop, this._data);
    }


}


