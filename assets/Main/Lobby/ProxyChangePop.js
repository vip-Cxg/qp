const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils");
const http = require("SceneLogin");
 var { GameConfig } = require("../../GameBase/GameConfig");
const AudioCtrl = require("../Script/audio-ctrl");

cc.Class({
    extends: require('../Script/PopBase'),

    properties: {
        // phoneInput:cc.EditBox,
        // oldPhoneInput:cc.EditBox,
        userId:cc.EditBox,
        proxyId:cc.EditBox,
        frozenID:cc.EditBox,
        shuffleId:cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onConfirmData(){
        Connector.request(GameConfig.ServerEventName.ProxyChange,{id:this.proxyId.string,userID:this.userId.string},(data)=>{
            Cache.alertTip("提交成功");
        })
    },
    // onBindPhone(){
    //     Connector.request(GameConfig.ServerEventName.ProxyPhoneChanhe,{formerPhone:this.oldPhoneInput.string,phone:this.phoneInput.string},(data)=>{
    //         Cache.alertTip("提交成功");
    //     })
    // },

    onChangeShuffle(e,v){
        Connector.request(GameConfig.ServerEventName.ProxyChangeShuffle,{proxyID:this.shuffleId.string,shuffle:v},(data)=>{
            Cache.alertTip("提交成功");
        })
    },

    onFrozenProxy(e,v){
        
        if (utils.isNullOrEmpty(this.frozenID.string)) {
            Cache.alertTip("请输入代理id")
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyBanProxy,{id:parseInt(this.frozenID.string),status:v},(data)=>{
            Cache.alertTip(v=="normal"?"解封成功":"封号成功")
        })

    },

});
