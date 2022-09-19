let VoiceCtrl = require('voice-ctrl');
let connector = require('Connector');
let audioCtrl = require("audio-ctrl");
let db = require('DataBase');
let cache = require('Cache');
let tbInfo = require('TableInfo');
cc.Class({
    extends: cc.Component,

    properties: {
        recordingNode: cc.Node,
        barTime: cc.Sprite,
        barMic: cc.Sprite,
        // volumnGroup: cc.Node,

        fileName: 'record.amr',
        maxTime: 10000,
        minTime: 1000,

        _lastTouchTime: 0,
        _lastCheckTime: -1,
        _ctrl: null,
        lastTime:0,
    },

    pleaseWaite: function () {
        cache.alertTip("发言间隔需要5秒");
    },

    barInit: function () {
        this.barMic.fillRange = 0;
        this.barTime.fillRange = 0;
        this.barMic.unscheduleAllCallbacks();
        this.barTime.unscheduleAllCallbacks();
    },

    onLoad: function () {
        //cc.log("Voice=>onLoad");
        this._ctrl = VoiceCtrl.getInstance();
        this._ctrl.init();
        this.recordingNode.active = false;
        //cc.log('controlBtncontrolBtncontrolBtncontrolBtncontrolBtn',this.controlBtn);
        // this.controlBtn.on(cc.Node.EventType.TOUCH_START, this._onStart, this);
        // this.controlBtn.on(cc.Node.EventType.TOUCH_MOVE, this._onMove, this);
        // this.controlBtn.on(cc.Node.EventType.TOUCH_END, this._onEnd, this);
        // this.controlBtn.on(cc.Node.EventType.TOUCH_CANCEL, this._onCancel,this);
    },

    _onStart() {
        cc.log('touchStart');
        if(tbInfo.config.noCheat){
            cache.showTipsMsg("防作弊房型禁止发快捷语及表情");
            return;
        }
        if(Date.now() - this.lastTime<5000){
            this.pleaseWaite();
            return;
        }
        audioCtrl.getInstance().setBGMVolume(0);
        audioCtrl.getInstance().setSFXVolume(0);
        this.barInit();
        cc.log('voice start...' + this.fileName);
        this._ctrl.prepare(this.fileName);
        this._lastTouchTime = Date.now();
        this.recordingNode.active = true;
        this.barMic.schedule(()=>{
            this.barMic.fillRange = Math.random();
        },0.2);
        this.barTime.schedule(()=>{
            this.barTime.fillRange += 1/100;
        },0.1);
    },

    _onMove() {
        cc.log('voice move.....');
        // this.barInit();
    },

    _onEnd() {
        audioCtrl.getInstance().setBGMVolume(db.getFloat(db.STORAGE_KEY.SET_MUSIC, 1));
        audioCtrl.getInstance().setSFXVolume(db.getFloat(db.STORAGE_KEY.SET_SOUND, 1));
        this.recordingNode.active = false;
        this.barInit();
        if (Date.now() - this._lastTouchTime < this.minTime) {
            this._ctrl.cancel();
            let newEvent = new cc.Event.EventCustom('bubble', true);
            this.node.dispatchEvent(newEvent);
        } else {
            this._recordSuccess();
        }
        this._lastTouchTime = 0;

        cc.log('voice end....')
    },

    _onCancel() {
        audioCtrl.getInstance().setBGMVolume(db.getFloat(db.STORAGE_KEY.SET_MUSIC, 1));
        audioCtrl.getInstance().setSFXVolume(db.getFloat(db.STORAGE_KEY.SET_SOUND, 1));
        this.recordingNode.active = false;
        this._ctrl.cancel();
        this._lastTouchTime = 0;
        this.barInit();
        cache.alertTip("放弃发言");
        cc.log('voice cancel....')
    },

    _recordSuccess() {
        if (this._lastTouchTime > 0) {
            this._ctrl.release();
            this.lastTime = Date.now();
            let time = Date.now() - this._lastTouchTime;
            let voice = this._ctrl.getVoiceData(this.fileName);
            // cc.log(voice);
            if (voice.length > 0) {
                //里面是语音的内容
                // let newEvent = new cc.Event.EventCustom('chat', true);
                let detail = {
                    content:JSON.stringify({voice,time})
                };
                // this.node.dispatchEvent(newEvent);
                connector.emit("CS_GAME_VOICE",detail);
            }
        }
        this.recordingNode.active = false;
        cc.log('voice ok....');
    },
    update: function (dt) {
        // if (this.recordingNode.active == true) {
        //     if (Date.now() - this._lastCheckTime > 300) {
        //         for (let i = 0; i < this.volumnGroup.children.length; ++i) {
        //             this.volumnGroup.children[i].active = false;
        //         }
        //         var v = this._ctrl.getVoiceLevel(7);
        //         if (v >= 1 && v <= 7) {
        //             for (let i = 0; i < v; i++) {
        //                 this.volumnGroup.children[i].active = true;
        //             }
        //         }
        //         this._lastCheckTime = Date.now();
        //     }
        // }
        //
        if (this._lastTouchTime > 0) {
            let time = Date.now() - this._lastTouchTime;
            if (time >= this.maxTime) {
                this._recordSuccess();
                this._lastTouchTime = 0;
            }
            else {
                let percent = time / this.maxTime;
                this.barTime.progress = 1 - percent;
            }
        }
    },
});
