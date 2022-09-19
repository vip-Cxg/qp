import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import GameUtils from "../../../script/common/GameUtils";
import DataBase from "../../../Main/Script/DataBase";
const GAME_TYPE = {
    PDK: 'PDK_SOLO',
    LDZP: 'LDZP_SOLO',
    XHZD: 'XHZD',
    HZMJ: 'HZMJ_SOLO'
}
const { ccclass, property } = cc._decorator
@ccclass
export default class RewardGameTable extends cc.Component {




    @property(cc.Node)
    clubContent = null;
    @property(cc.Node)
    noData = null;
    @property(cc.Prefab)
    clubItem = null;

    currentGameType = null;
    clubData = null;

    onLoad() {
        this.clubData = {};
        this.downloadClub('PDK_SOLO');
    }


    selectGameType(e, v) {
        
        this.downloadClub(v);

    }
    downloadClub(gametype) {
        //无缓存数据 下载游戏房型
        this.clubContent.removeAllChildren();
        this.noData.active = false;
        Connector.request(GameConfig.ServerEventName.GetGameType, { proxyID: DataBase.player.proxyID, isLeague: GameConfig.IsLeague, gameType: gametype }, (data) => {
            if (!GameUtils.isNullOrEmpty(data.rooms)) {
                this.renderUI(data.rooms);
                this.clubData[gametype] = data.rooms;
            } else {
                this.noData.active = true;
            }
        }, true, (err) => {
            this.noData.active = true;
        });
    }
    renderUI(club) {

        club.forEach((item, index) => {
            let clubItem = cc.instantiate(this.clubItem);
            clubItem.getChildByName('name').getComponent(cc.Label).string = GameConfig.GameName[item.gameType];//item.name;
            clubItem.getChildByName('level').getComponent(cc.Label).string =''+item.name+'元场';//item.level  GameConfig.GameName[item.gameType]+
            clubItem.getChildByName('base').getComponent(cc.Label).string = '' + GameUtils.formatGold(item.lower)+'元';

            clubItem.on(cc.Node.EventType.TOUCH_END, () => {
                // if (this.currentGameType == GAME_TYPE.XHZD && !DataBase.player.hasBind && !GameConfig.IsDebug) {
                //     Cache.alertTip("未绑定手机，无法进入新化炸弹");
                //     return;
                // }
                // if (this.currentGameType == GAME_TYPE.XHZD && Cache.location.lat == 0 && Cache.location.long == 0 && !GameConfig.IsDebug) {
                //     Cache.alertTip("未打开定位，无法进入新化炸弹");
                //     return;
                // }
                GameUtils.pop(GameConfig.pop.MatchPop, (node) => {
                    item.isLeague = GameConfig.IsLeague;
                    GameUtils.saveValue(GameConfig.StorageKey.LastRoomData, item);
                    node.getComponent("ModuleMatchPop").startMatch(item.id);
                })
            }, this);

            this.clubContent.addChild(clubItem);
        });
    }
    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


