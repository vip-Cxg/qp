// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../../GameBase/GameConfig");
const Connector = require("../../NetWork/Connector");
const utils = require('../../Script/utils');
cc.Class({
    extends: require('../../Script/PopBase'),

    properties: {
        proxyID: cc.EditBox,
        proxyItem: cc.Prefab,
        proxyContainer: cc.Node,
        userContainer: cc.Node,
        userContent: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    downloaduser(e, v) {
        let searchProxyData = utils.isNullOrEmpty(v) ? { id: this.proxyID.string } : e;
        this.userContent.active = true;
        this.userContainer.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.ProxySearchUser, { proxyID: searchProxyData.id }, (data) => {
            if (!utils.isNullOrEmpty(data.users)) {
                data.users.forEach(e => {
                    let proxyItem = cc.instantiate(this.proxyItem);
                    proxyItem.getChildByName('container').getChildByName('name').getComponent(cc.Label).string = utils.getStringByLength(e.name,6);
                    proxyItem.getChildByName('container').getChildByName('id').getComponent(cc.Label).string = '' + e.id;
                    proxyItem.getChildByName('container').getChildByName('phone').getComponent(cc.Label).string = '' + e.phone;
                    proxyItem.getChildByName('container').getChildByName('parent').getComponent(cc.Label).string = '' + e.proxyID;
                    proxyItem.getChildByName('container').getChildByName('wallet').getComponent(cc.Label).string = '' + (e.wallet / 100) + '元';
                    proxyItem.getChildByName('container').getChildByName('status').getComponent(cc.Label).string = e.status == 'normal' ? '正常' : '封禁';
                    this.userContainer.addChild(proxyItem);
                });
            }
        })
    },
    downloadProxy() {
        this.proxyContainer.removeAllChildren();
        Connector.request(GameConfig.ServerEventName.ProxySearchProxy, { proxyID: this.proxyID.string }, (data) => {
            if (!utils.isNullOrEmpty(data.proxies)) {
                data.proxies.forEach(e => {
                    let proxyItem = cc.instantiate(this.proxyItem);
                    proxyItem.getChildByName('container').getChildByName('name').getComponent(cc.Label).string = utils.getStringByLength(e.name,6);
                    proxyItem.getChildByName('container').getChildByName('id').getComponent(cc.Label).string = '' + e.id;
                    proxyItem.getChildByName('container').getChildByName('phone').getComponent(cc.Label).string = '' + e.phone;
                    proxyItem.getChildByName('container').getChildByName('parent').getComponent(cc.Label).string = '' + e.parent;
                    proxyItem.getChildByName('container').getChildByName('wallet').getComponent(cc.Label).string = '' + (e.wallet / 100) + '元';
                    proxyItem.getChildByName('container').getChildByName('status').getComponent(cc.Label).string = e.status == 'normal' ? '正常' : '封禁';
                    proxyItem.on(cc.Node.EventType.TOUCH_END, () => {
                        this.downloaduser(e, 1)
                    }, this)
                    this.proxyContainer.addChild(proxyItem);
                });

            }
        })
    },
    hideUserContent() {
        this.userContainer.removeAllChildren();
        this.userContent.active = false;
    }
    // update (dt) {},13707381400
});
