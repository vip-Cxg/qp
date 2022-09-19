// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
 var { GameConfig } = require('../../../GameBase/GameConfig');
const { App } = require('../../../script/ui/hall/data/App');
const Cache = require('../../Script/Cache');
const utils = require('../../Script/utils');
cc.Class({
    extends: require('../../Script/Base_DragBtn'),

    properties: {

        imgSpr: cc.Sprite,
        leagueSf: cc.SpriteFrame,
        qinYouSf: cc.SpriteFrame,
        clickTime:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

        this.imgSpr.spriteFrame = GameConfig.ProxyIsLeague ? this.leagueSf :this. qinYouSf;
    },

    onClickBtn() {
        if(GameConfig.ProxyData.clanMaster==0&&GameConfig.ProxyData.role != "admin"&&GameConfig.ProxyData.role != "manager"){
            Cache.alertTip('未开通亲友圈');
            return;
        }

        let nowTime=utils.getTimeStamp();
        if(nowTime-this.clickTime<1500){
            Cache.alertTip('切换过于频繁,请稍后再试');
            return;
        }
        this.clickTime=nowTime;
        GameConfig.ProxyIsLeague = !GameConfig.ProxyIsLeague;
        this.imgSpr.spriteFrame = GameConfig.ProxyIsLeague ? this.leagueSf :this. qinYouSf;
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.EXCHANGE_LEAGUE_UPDATEDATA);
    }
    // update (dt) {},
});
