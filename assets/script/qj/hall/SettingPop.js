
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
import Avatar from "../../ui/common/Avatar";
import AudioCtrl from "../../../Main/Script/audio-ctrl";

@ccclass
export default class SettingPop extends cc.Component {
    @property(cc.Node)
    sprMusicSlider = null
    @property(cc.Node)
    sprEffectSlider = null

    @property(cc.Toggle)
    toggleBgm = null

    @property(cc.Toggle)
    toggleEffect = null

    @property(cc.Slider)
    sliderBgm = null

    @property(cc.Slider)
    sliderEffect = null

    init() {
        
        let bgmVolume = AudioCtrl._instance.bgmVolume;
        let effectVolume = AudioCtrl._instance.sfxVolume;
        // cc.log(bgmVolume, effectVolume);
        this.sliderBgm.progress = Number(bgmVolume);
        this.sliderEffect.progress = Number(effectVolume);
        this.onClickMusicSlider();
        this.onClickEffectSlider();
        this.toggleBgm.isChecked = bgmVolume > 0;
        this.toggleEffect.isChecked = effectVolume > 0;
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onClickLogout() {
        cc.director.loadScene("Login");
    }

    onClickMusicToggle(toggle) {
        let volume = toggle.isChecked ? 1 : 0;
        AudioCtrl._instance.setBGMVolume(volume);
        this.sliderBgm.progress = volume;
        this.onClickMusicSlider();

    }

    onClickEffectToggle(toggle) {
        let volume = toggle.isChecked? 1 : 0;
        AudioCtrl._instance.setSFXVolume(volume);
        this.sliderEffect.progress = volume;
        this.onClickEffectSlider();
    }

    onClickMusicSlider() {
        let slider = this.sliderBgm;
        let progress = Number(slider.progress.toFixed(2));
        this.sprMusicSlider.width = progress * 374;
        AudioCtrl._instance.setBGMVolume(progress);
        this.toggleBgm.isChecked = progress > 0;
    }

    onClickEffectSlider() {
        let slider = this.sliderEffect;
        let progress = Number(slider.progress.toFixed(2));
        this.sprEffectSlider.width = progress * 374;
        AudioCtrl._instance.setSFXVolume(progress);
        this.toggleEffect.isChecked = progress > 0;
    }
}


