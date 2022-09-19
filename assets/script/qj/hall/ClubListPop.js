
const { ccclass, property } = cc._decorator;
import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import GameUtils from "../../common/GameUtils";
import { App } from "../../ui/hall/data/App";
@ccclass
export default class ClubListPop extends cc.Component {
    @property(cc.Prefab)
    clubListItem = null
    @property(cc.Layout)
    layerItem = null
    @property(cc.EditBox)
    editBoxSearch = null
    @property(cc.Button)
    btnCancelSearch = null

    onLoad() {
        this.node.active = true;
        App.EventManager.addEventListener(GameConfig.GameEventNames.INIT_CLUB_LIST, this.init, this);
        // this.init();
    }

    init() {
        this.editBoxSearch.string = '';
        this.btnCancelSearch.node.active = false;
        this.layerItem.node.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.ClubList, {}, this.render.bind(this))
    }

    render(data) {
        this.layerItem.node.removeAllChildren();
        let { clubs } = data;
        for (let club of clubs) {
            GameUtils.instancePrefab(this.clubListItem, club, this.layerItem.node);
        }
    }

    onClickCreate() {
        GameUtils.pop(GameConfig.pop.CreateClubPop, this.popCreate);
    }

    popCreate(node) {
        node.active = true;
    }

    onClickSearch() {
        let option = this.editBoxSearch.string;
        /** 过滤空格 */
        option = option.replace(/\s*/g,"");
        if (option == '') {
            GameUtils.alertTips('搜索内容不能为空');
            return;
        }
        this.btnCancelSearch.node.active = true;
        Connector.request(GameConfig.ServerEventName.SearchClubs, { option }, this.render.bind(this), true)
    }

    onClickCancelSearch() {
        this.init();
    }

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

    onDestroy() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.INIT_CLUB_LIST, this.init, this);
    }





}


