import Connector from "../../../Main/NetWork/Connector";
import ROUTE from "../../../Main/Script/ROUTE";

const MASSAGE_TYPE = {
    FACE: 0,
    MESSAGE: 1,
    CUSTOMER: 2,
    VOICE: 3,
    INTERACT: 4
};

const MESSAGE_CONFIG=[
    {
        desc:'个子',
        audio:'gezi'
    },
    {
        desc:'对子',
        audio:'duizi'
    },
    {
        desc:'坎子',
        audio:'kanzi'
    },
    {
        desc:'有无需求',
        audio:'y'
    },
    {
        desc:'有无攻势',
        audio:'duizi'
    },
    {
        desc:'好赶不',
        audio:'duizi'
    },
    {
        desc:'我来搞',
        audio:'duizi'
    },
    {
        desc:'搞不好',
        audio:'duizi'
    }
]
const { ccclass, property } = cc._decorator
@ccclass
export default class WSKGameChat extends cc.Component {


    sendChat(e,v) {
        Connector.gameMessage(ROUTE.CS_GAME_CHAT, { messageType: 5, content: parseInt(e.currentTarget.name) });
    }

    handleChat(data){

    }



}


