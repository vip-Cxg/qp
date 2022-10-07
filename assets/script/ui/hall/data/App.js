import { PopQueue } from "../../../base/pop/PopQueue";
import { ClubManager } from "../ClubManager";
import { EventManager } from "./EventManager";
import { Proxy } from "./Proxy";
import { PushManager } from "./PushManager";
import { GameConfig } from "../../../../GameBase/GameConfig";
import GameUtils from "../../../common/GameUtils";
import { PlayerManager } from "./PlayerManager";

class Application {
    static Instance = new Application();

    constructor() {

    }
    
    /** 代理 */
    get Proxy() {
        return Proxy.getInstance();
    }
    /** 玩家信息 */
    get Player() {
        return PlayerManager.getInstance();
    }
    /** 公会 */
    get Club() {
        return ClubManager.getInstance();
    }
    /** 弹窗队列 */
    get PopQueue() {
        return PopQueue.getInstance();
    }
    /** 推送 */
    get PushManager() {
        return PushManager.getInstance();
    }
    /** 事件管理 */
    get EventManager() {
        return EventManager.getInstance();
    }


    // Player = {}

    fitScreen() {
        var DesignWidth = 1280;
        var DesignHeight = 720;
        // if(cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {

        if ((cc.view.getFrameSize().width / cc.view.getFrameSize().height) >= ((2436 / 1125) - 0.05)) {
            GameConfig.FitScreen = 44;

        } else {
            GameConfig.FitScreen = 0;
        }

        if ((cc.view.getFrameSize().width / cc.view.getFrameSize().height) >= (DesignWidth / DesignHeight)) {
            //宽度超出
            var width = cc.view.getFrameSize().width * (DesignHeight / cc.view.getFrameSize().height);
            cc.view.setDesignResolutionSize(width, DesignHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            //高度超出
            var height = cc.view.getFrameSize().height * (DesignWidth / cc.view.getFrameSize().width);
            cc.view.setDesignResolutionSize(DesignWidth, height, cc.ResolutionPolicy.FIXED_WIDTH);
        }
        // }else{
        //     cc.view.setDesignResolutionSize(DesignWidth, DesignHeight, cc.ResolutionPolicy.EXACT_FIT);
        // }

        // if (this.isIphoneX) {
        // cc.find("Canvas/other/user1").getComponent(cc.Widget).left += this.node.width * (44/812);
        // cc.find("Canvas").getComponent(cc.Widget).left += cc.find("Canvas").width * (88/812);
        // var cvs = cc.find("Canvas").getComponent(cc.Canvas);
        // cvs.fitHeight = true;
        // cvs.fitWidth = true;
        // }
    }

    /**锁屏 */
    lockScene() {
        let scene = cc.director.getScene();
        if (App._lockSceneNode && App._lockSceneNode.getParent()) {
            if (App._lockSceneNode.getParent() == scene)
                return;
            App._lockSceneNode.destroy();
            App._lockSceneNode = null;
        }
        let winSize = cc.winSize;
        let node = new cc.Node();
        node.width = winSize.width;
        node.height = winSize.height;
        node.x = winSize.width / 2;
        node.y = winSize.height / 2;
        node.addComponent(cc.BlockInputEvents);
        App._lockSceneNode = node;
        scene.addChild(App._lockSceneNode);
    }
    /**解锁 */
    unlockScene() {
        if (App._lockSceneNode && App._lockSceneNode.getParent()) {
            App._lockSceneNode.destroy();
            App._lockSceneNode = null;
        }
    }

    /** 提示气泡 */
    tipsBubble(str, pos) {
        cc.loader.loadRes("Main/Prefab/winTips", (err, prefeb) => {
            let emp = cc.instantiate(prefeb);
            emp.getComponent("ModuleWinTips").tipsInit(str, pos);
        });
    }
    /** TODO 预先加载 */
    /**弹出弹窗 */
    pop(popName, data, name) {
        if (GameUtils.isNullOrEmpty(popName))
            return;
        // let nodeName = popName.replace(/[/]/g, "")
        let nodeName = name || popName.match(/.*\/(.*)/)[1];
        let node = cc.find('Canvas').getChildByName(nodeName);
        if (node) {
            if (data instanceof Array) {
                node.getComponent(node._name).init(...data);
            } else {
                node.getComponent(node._name).init(data);
            }
            return;
        }

        cc.loader.loadRes(popName, (err, prefab) => {

            if (!err) {

                let popNode = cc.instantiate(prefab);
                cc.find('Canvas').addChild(popNode, 0, nodeName)
                if (data instanceof Array) {
                    popNode.getComponent(popNode._name).init(...data);
                } else {
                    popNode.getComponent(popNode._name).init(data);
                }
            } else {
                cc.log(err)
            }
        });
    };

    parse(msg) {
        try {
            if (typeof msg === 'string') {
                return JSON.parse(msg);
            } else {
                return msg;
            }
        } catch (ex) {
            //TODO
            return null;
        }
    }

    confirmPop(message, callback1) {
        App.instancePrefab(
            GameConfig.pop.ConfirmPop,
            {
                message,
                callback1: callback1
            }
        );
    }

    defaultCallback(node, data) {
        // try {
        node.getComponent(node._name).init(data);
        // } catch(ex) {
        //     cc.log(node);
        //     cc.error(ex);
        // }
    }

    instancePrefab(prefab, data = {}, parent = cc.find('Canvas'), callback = null,) {
        let node;
        if (typeof (prefab) == 'string') {
            node = prefab.match(/.*\/(.*)/)[1];
            cc.loader.loadRes(prefab, (err, p) => {
                if (!err) {
                    node = cc.instantiate(p);
                    node.parent = parent;
                    if (callback) {
                        callback(node, data)
                    } else {
                        App.defaultCallback(node, data)
                    }
                }
            });
            return null;
        }
        node = cc.instantiate(prefab);
        node.parent = parent;
        node.active = true;
        if (callback) {
            callback(node, data);
        } else {
            App.defaultCallback(node, data);
        }
        return node;
    }

    alertTips(str, pos) {
        cc.loader.loadRes("Main/Prefab/winTips", (err, prefeb) => {
            let emp = cc.instantiate(prefeb);
            emp.getComponent("ModuleWinTips").tipsInit(str, pos);
        });
    }

    transformScore(score) {
        return Number((Number(score) / 100).toFixed(2));
    }

}
export const App = Application.Instance;