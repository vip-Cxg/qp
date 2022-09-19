const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils");
const http = require("SceneLogin");
 var { GameConfig } = require("../../GameBase/GameConfig");
const AudioCtrl = require("../Script/audio-ctrl");

cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        ruleBtn: cc.Node,
        updateBtn: cc.Node,
        exitBtn: cc.Node,
        exitClubBtn: cc.Node,
        changeUserBtn: cc.Node,
        musicOff:cc.Node,
        musicOpen:cc.Node,
        soundOff:cc.Node,
        soundOpen:cc.Node,
        soundPage:cc.Node,
        marketAccountInfo:cc.Prefab,
        infoPage:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.addEvents();
        this.refreshUI();
    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.ruleBtn.on(cc.Node.EventType.TOUCH_END, this.onClickRule, this);
        this.updateBtn.on(cc.Node.EventType.TOUCH_END, this.onClickUpdate, this);
        this.exitBtn.on(cc.Node.EventType.TOUCH_END, this.onClickExit, this);
        this.exitClubBtn.on(cc.Node.EventType.TOUCH_END, this.onExitClub, this);
        this.changeUserBtn.on(cc.Node.EventType.TOUCH_END, this.onClickChange, this);
       
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.ruleBtn.off(cc.Node.EventType.TOUCH_END, this.onClickRule, this);
        this.updateBtn.off(cc.Node.EventType.TOUCH_END, this.onClickUpdate, this);
        this.exitBtn.off(cc.Node.EventType.TOUCH_END, this.onClickExit, this);
        this.exitClubBtn.off(cc.Node.EventType.TOUCH_END, this.onExitClub, this);
        this.changeUserBtn.off(cc.Node.EventType.TOUCH_END, this.onClickChange, this);
       
    },
    /**更新UI */
    refreshUI() {
        let musicVolume = utils.getValue(GameConfig.StorageKey.MusicVolume, 1);
        this.musicOff.active = musicVolume == 0;
        this.musicOpen.active = musicVolume == 1;

        let soundeVolume = utils.getValue(GameConfig.StorageKey.SoundVolume, 1);
        this.soundOff.active = soundeVolume == 0;
        this.soundOpen.active = soundeVolume == 1;

    },

    showSoundPage(){
        
        this.soundPage.active=true;
        this.infoPage.active=false;
    },
    showInfoPage(){
        
        this.soundPage.active=false;
        this.infoPage.active=true;
    },

    closeMusic() {
        
        this.musicOff.active = true;
        this.musicOpen.active = false;
        AudioCtrl.getInstance().setBGMVolume(0);
        utils.saveValue(GameConfig.StorageKey.MusicVolume, 0);
    },
    openMusic() {
        
        this.musicOff.active = false;
        this.musicOpen.active = true;
        AudioCtrl.getInstance().setBGMVolume(1);
        utils.saveValue(GameConfig.StorageKey.MusicVolume, 1);
    },
    closeSound(){
        
        this.closeMusic();
        this.soundOff.active = true;
        this.soundOpen.active = false;
        AudioCtrl.getInstance().setSFXVolume(0);
        utils.saveValue(GameConfig.StorageKey.SoundVolume, 0);
    },
    openSound(){
        
        this.openMusic();
        this.soundOff.active = false;
        this.soundOpen.active = true;
        AudioCtrl.getInstance().setSFXVolume(1);
        utils.saveValue(GameConfig.StorageKey.SoundVolume, 1);
    },

    /**脱离代理 */
    onExitClub() {
        
        Connector.request(GameConfig.ServerEventName.ExitClub,{},(data)=>{
            Cache.alertTip('脱离代理成功');
        })

    },
    /**切换用户 */
    onClickChange() {
        
        // utils.pop(GameConfig.pop.ProblemPop);
        cc.director.loadScene("Login");
    },
    /**规则说明 */
    onClickRule() {
        
        utils.pop(GameConfig.pop.RulePop);
    },
    /**退出游戏 */
    onClickExit() {
        
        Cache.showConfirm("是否退出游戏", () => {
            cc.game.end();
        })
    },
    /**检查更新 */
    onClickUpdate() {
        
        cc.director.loadScene("Update");

    },
    openMarketAccount(){
        
        let marketAccountInfo = cc.instantiate(this.marketAccountInfo);
        marketAccountInfo.getComponent('ModuleMarketAccount').renderData('player');
        this.node.addChild(marketAccountInfo);
    },
    /**关闭弹窗 */
    onClickClose() {
        
        this.removeEvents();
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
});
