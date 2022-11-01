const DataBase = require('DataBase');
var { GameConfig } = require('../../GameBase/GameConfig');
const utils = require('./utils');

let AudioCtrl = cc.Class({
    name: 'AudioCtrl',

    properties: {
        bgmVolume: 1.0,
        sfxVolume: 1.0,
        bgmAudioID: -1,
    },

    statics: {
        _instance: null,

        getInstance() {
            if (!this._instance) {
                this._instance = new AudioCtrl();
                this._instance.init();
            }
            return this._instance;
        }
    },

    init(isBGmOn, isSFXOn) {
        AudioCtrl._instance = this;

        if (isBGmOn === false) {
            this.bgmVolume = 0;
        }

        if (isSFXOn === false) {
            this.sfxVolume = 0;
        }
        this.bgmVolume = utils.isNullOrEmpty(cc.sys.localStorage.getItem('BGM_VOLUME')) ? 1 : Number(cc.sys.localStorage.getItem('BGM_VOLUME'));
        this.sfxVolume =  utils.isNullOrEmpty(cc.sys.localStorage.getItem('SFX_VOLUME')) ? 1 : Number(cc.sys.localStorage.getItem('SFX_VOLUME'));
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeAll();
        });
    },

    getState() {
        return { bgm: this.bgmVolume > 0, sfx: this.sfxVolume > 0 };
    },

    isBGMPlaying() {
        return this.bgmVolume > 0;
    },

    playBGM(url) {
        // let value = utils.getValue(GameConfig.StorageKey.MusicVolume);
        // if (value)
        // this.bgmVolume =  utils.getValue(GameConfig.StorageKey.MusicVolume, 1);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(url, true, this.bgmVolume);
        //fix engine bug
        cc.audioEngine.setVolume(this.bgmAudioID, this.bgmVolume);
    },


    playSFX(url) {
        // let value = utils.getValue(GameConfig.StorageKey.SoundVolume);
        // if (value)
        // this.sfxVolume =  utils.getValue(GameConfig.StorageKey.SoundVolume, 1);
        if (this.sfxVolume > 0) {
            let audioId = cc.audioEngine.play(url, false, this.sfxVolume);
            return cc.audioEngine.getDuration(audioId);
        }
        return 0;
    },

    setSFXVolume(v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem('SFX_VOLUME', v.toString())
            this.sfxVolume = v;
        }
    },

    setBGMVolume(v, force) {
        console.log("123123123: ",v);
        // if (this.bgmAudioID >= 0) {
        //     if (v > 0) {
        //         cc.audioEngine.resume(this.bgmAudioID);
        //     }
        //     else {
        //         cc.audioEngine.pause(this.bgmAudioID);
        //     }
        // }
        cc.sys.localStorage.setItem('BGM_VOLUME', v.toString())
        if (this.bgmVolume != v || force) {
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    pauseAll() {
        cc.audioEngine.pauseAll();
    },

    resumeAll() {
        cc.audioEngine.resumeAll();
        this.setBGMVolume(DataBase.getFloat(DataBase.STORAGE_KEY.SET_MUSIC, 1));
        this.setSFXVolume(DataBase.getFloat(DataBase.STORAGE_KEY.SET_SOUND, 1));
    },

    stopAll() {
        cc.audioEngine.stopAll();
    }
});

module.exports = AudioCtrl;