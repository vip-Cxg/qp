
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class GameRecordPop extends cc.Component {
    @property(cc.ToggleContainer)
    toggleContainer = null
    @property(cc.Node)
    sprEmpty = null
    @property(cc.Node)
    replayCodePop = null
    @property(cc.EditBox)
    editBoxRelayCode = null
    @property(cc.ToggleContainer)
    toggleContainerLeft = null
    @property(cc.ToggleContainer)
    toggleContainerTop = null
    @property(cc.Node)
    content = null
    @property(cc.Node)
    gameRecordItem = null

    init() {
        /** roomType 茶馆房间 or 普通房间*/
        let roomType,gameType;
        let leftToggleCur = this.toggleContainerLeft.toggleItems.find(toggle => toggle.isChecked);
        let topToggleCur = this.toggleContainerTop.toggleItems.find(toggle => toggle.isChecked);
        roomType = topToggleCur.node._name;
        gameType = leftToggleCur.node._name.toUpperCase();
        /** request 加载数据*/
        this.content.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.HallRecords, { roomType, gameType }, ({ records }) => {
            let { rows } = records;
            this.sprEmpty.active = rows.length <= 0;
            rows.forEach(r => {
                let node = cc.instantiate(this.gameRecordItem);
                node.getComponent(node._name).init(r);
                node.parent = this.content;
                node.active = true;
            })
        });
    }

    onClickLeftToggle() {
        /** 请求对应接口 刷新数据 */
        this.init();
    }

    onClickCheckReplay() {
        cc.log(this.editBoxRelayCode.string);
    }

    onClickPaste() {
        cc.log('paste');
    }

    onClickReplayCode() {
        this.replayCodePop.active = !this.replayCodePop.active;
    }

    onClickTopToggle() {
        this.toggleContainer.toggleItems.forEach(toggle => {
            let background = toggle.node.getChildByName('background');
            background.active = !toggle.isChecked;
            /** 请求对应接口 刷新数据*/
            if (toggle.isChecked) {
                this.init();
            }
        })
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


