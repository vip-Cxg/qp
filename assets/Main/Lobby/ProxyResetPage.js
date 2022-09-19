// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: require('../Script/PopBase'),

    properties: {
        userID: cc.EditBox,
        dateStr: cc.EditBox,
        player1: cc.EditBox,
        player2: cc.EditBox,

    },
    // 
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // resetProxyPwd(){
    //     if(this.proxyId.string==""){
    //         Cache.alertTip("请输入代理id")
    //         return;
    //     }
    //     Connector.request(GameConfig.ServerEventName.ProxyResetPwd,{id:parseInt(this.proxyId.string)},(data)=>{
    //         Cache.alertTip("重置成功");
    //     },null,(err)=>{
    //         Cache.showTipsMsg(utils.isNullOrEmpty(err.message)?"修改失败":err.message);
    //     })

    // },

    onClickConfirm() {
        if (this.player1.string == "") {
            Cache.alertTip("请输入玩家1id")
            return;
        }
        if (this.player2.string == "") {
            Cache.alertTip("请输入玩家2id")
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyBlackList, { id1: parseInt(this.player1.string), id2: parseInt(this.player2.string) }, (data) => {
            Cache.alertTip("设置成功");
        }, null, (err) => {
            Cache.showTipsMsg(utils.isNullOrEmpty(err.message) ? "设置失败" : err.message);
        })
    },

    onBanMarket() {
        if(utils.isNullOrEmpty(this.dateStr.string)){
            Cache.alertTip('请输入需要封禁的天数');
            return
        }
        Connector.request(GameConfig.ServerEventName.AdminBanMarket, {id:parseInt(this.userID.string),days:parseInt(this.dateStr.string),status:'ban'}, (res) => {
            Cache.alertTip('封禁至'+res.banDate);
        })
    },
    onOpenMarket() {
        Connector.request(GameConfig.ServerEventName.AdminBanMarket, {id:parseInt(this.userID.string),status:'liberation'}, (res) => {
            Cache.alertTip('解封成功');
        })
    },
    onBanBuy() {
        if(utils.isNullOrEmpty(this.dateStr.string)){
            Cache.alertTip('请输入需要封禁的天数');
            return
        }
        Connector.request(GameConfig.ServerEventName.AdminBanBuy, {id:parseInt(this.userID.string),days:parseInt(this.dateStr.string),status:'ban'}, (res) => {
            Cache.alertTip('封禁至'+res.banDate);
        })
    },
    onOpenBuy() {
        Connector.request(GameConfig.ServerEventName.AdminBanBuy, {id:parseInt(this.userID.string),status:'liberation'}, (res) => {
            Cache.alertTip('解封成功');
        })
    },

    // update (dt) {},
});
