const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const dataBase = require("../Script/DataBase");
const utils = require("../Script/utils")
let { GameConfig } = require("../../GameBase/GameConfig");
let http = require("SceneLogin");
const Native = require("../Script/native-extend");
const { App } = require("../../script/ui/hall/data/App");
const _social = Native.Social
cc.Class({
    extends: cc.Component,

    properties: {
        closeBtn: cc.Node,
        infoContainer: cc.Node,
        totalPage: cc.Prefab,
        userInfoPage: cc.Prefab,
        childProxyPage: cc.Prefab,
        lblNotice:cc.Label,
        nodeNotice:cc.Node,
        proxyUsersData: null,
        proxyChildData: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        GameConfig.ProxyIsLeague=true;
        // return;
        this.addEvents();
        this.openTotalPage();

        // this.refreshProxyData();
     
       

    },
    addEvents() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },
    removeEvents() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    },


    /**统计页面 */
    openTotalPage() {
        
        this.infoContainer.destroyAllChildren();
        let totalPage = cc.instantiate(this.totalPage);
        this.infoContainer.addChild(totalPage);
    },

    /**用户信息页面 */
    openUserInfoPage() {
        
        this.infoContainer.destroyAllChildren();
        let userInfoPage = cc.instantiate(this.userInfoPage);
        this.infoContainer.addChild(userInfoPage);
    },
    /**下级代理页面 */
    openChildProxyPage() {
        
        this.infoContainer.destroyAllChildren();
        let childProxyPage = cc.instantiate(this.childProxyPage);
        this.infoContainer.addChild(childProxyPage);
    },

    /**注销 */
    onLogout() {
        
        utils.saveValue(GameConfig.StorageKey.ProxyToken, "");
        utils.pop(GameConfig.pop.ProxyLoginPop)
        this.onClickClose();
    },

    /**admin 设置  */
    onClickSetting() {
        
        utils.pop(GameConfig.pop.AdminSettingPop);
    },

    onClickActivity() {
        
        utils.pop(GameConfig.pop.ProxyActivityPop);


    },
    openProxyActive() {

        
        // utils.pop(GameConfig.pop.ProxyActivePop, (node) => {
        //     node.getComponent("ProxyActivePop").downloadData();
        // });
    },
   

    /**关闭弹窗 */
    onClickClose() {
        
        this.removeEvents();
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
});
