import { App } from "../../ui/hall/data/App";
import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
const { ccclass, property } = cc._decorator
let Connector = require("../../../Main/NetWork/Connector");
@ccclass
export default class InvitationCardPop extends cc.Component {
    @property(cc.Prefab)
    InvitationCardItem = null;

    @property(cc.Node)
    content = null

    // @property(cc.Node)
    // nodePoint = null

    first = true;

    onLoad() {
        GameUtils.saveValue(GameConfig.StorageKey.UnReadInvite, 0);
        
        App.EventManager.addEventListener(GameConfig.GameEventNames.UPDATE_INVITATION_CARD, this.init, this);
        // this.init();
    }

    init() {
        GameUtils.saveValue(GameConfig.StorageKey.UnReadInvite, 0);
        this.content.removeAllChildren();
        Connector.request("game/invitationCard", {}, ({ invitationCards }) => {
            this.first = false;
            invitationCards.forEach(element => {
                App.instancePrefab(this.InvitationCardItem, element, this.content);
            });
        })
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.UPDATE_INVITATION_CARD, this.init, this);
    }

    doExit() {
        this.node.removeFromParent();
        this.node.destroy();
    }
}


