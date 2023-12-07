let TableInfo = require("../../../Main/Script/TableInfo");//require('TableInfo');
let audioCtrl = require('audio-ctrl');
let cache = require('Cache');
const utils = require("../../../Main/Script/utils");
 var { GameConfig } = require("../../../GameBase/GameConfig");
const db = require("../../../Main/Script/DataBase");
const POS_QI = [cc.v2(48, 169), cc.v2(48, -119)];
const POS_GROUND = [cc.v2(160, 55), cc.v2(160, 55)];
// const POS_QI = [cc.v2(64, 184), cc.v2(-64, -53), cc.v2(64, -53)];
// const POS_GROUND = [cc.v2(145, 85), cc.v2(-145, 90), cc.v2(145, 90)];
const POS_GROUND_CARD = -76;
const POS_GROUND_RECT = 34;
const POS_QI_CARD = {
    x: -92,
    y: -38
};
const POS_GROUND_Y = 20;
const POS_IMG_SCORE = [
    cc.v2(-1.2, -38.6),
    cc.v2(105, 48)
];
const POS_QIHU = [
    cc.v2(56, -40),
    cc.v2(56, 2.5)
];
const POS_HUXI = [
    cc.v2(148, -30),
    cc.v2(148, -30)
];
const POS_CARD_RECT = {
    x: 34,
    y: 44.4
};

const POS_PIAO = [
    cc.v2(94, 49),
    cc.v2(-94, 49),
    cc.v2(94, 49)
];
cc.Class({
    extends: cc.Component,

    properties: {
        nodePlayer: cc.Node,
        lblName: cc.Label,
        sprHead: require('../../../script/ui/common/Avatar'),
        headCircle: cc.Node,
        lblHuxi: cc.Label,
        sprActive: cc.Sprite,
        sprReady: [cc.Sprite],
        lblscore: cc.Label,
        sprOffline: cc.Sprite,
        qi: cc.Node,
        ground: cc.Node,
        lblEmpty: cc.Label,
        group: cc.Prefab,
        card: cc.Prefab,
        headMask: cc.Node,
        //sfxAudioClips:cc.AudioClip,
        imgBanker: cc.Node,
        autoNode: cc.Node,
        betStr: cc.Label,
        clock: cc.Node,
        //打鸟
        niaoNode: cc.Node,

        scoreNode: cc.Node,

        maskBg: cc.Node,
        huxiBgNode: cc.Node,
        totalHuxi: cc.Node,
        totalHuxiLabel: cc.Label,
        playerData: null
    },

    // use this for initialization
    onLoad() {
        this.lastTime = 0;

    },
    /**初始化玩家信息 */
    init(data, record) {
        console.log("玩家信息",data)
        this.playerData = data;
        if (data == null || utils.isNullOrEmpty(data.prop))
            return;

        let idx = TableInfo.realIdx[data.idx];
        this.totalHuxi.active = true;
        this.totalHuxiLabel.string = data.scores.turn;
        // if(record)
        //     idx = data.idx;
        this.realIdx = idx;
        this.idx = data.idx;
        this.imgBanker.active = TableInfo.zhuang == this.idx && TableInfo.status != GameConfig.GameStatus.WAIT;
        this.realIdx = idx;
        this.qi.position = POS_QI[idx];
        if (idx == 0) {
            this.scoreNode.active = true;
            this.qi.getComponent(cc.Layout).verticalDirection = cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
        }

        this.ground.position = POS_GROUND[idx];
        // this.huxiBgNode.position = POS_HUXI[idx];
        TableInfo.players[data.idx] = data;
        this.sprHead.avatarUrl = data.prop.head;
        this.lblName.string = utils.getStringByLength(data.prop.name, 5);

        this.sprOffline.node.active = data.offline;
        this.lblHuxi.string = '0';
        this.lblHuxi.value = 0;

        this.lblscore.string = '' + utils.formatGold(data.wallet);
        this.sprReady[idx == 1 ? 1 : 0].node.active = data.ready;
        this.niaoNode.active = data.plus;
        this.lblEmpty.node.active = false;

        //初始化 碰,吃牌区数据 
        this.initGround(data.grounds);
        //初始化弃牌区数据 
        this.initQi(data.drops);

        if (data.idx != TableInfo.idx && !record) {
            this.headMask.off(cc.Node.EventType.TOUCH_END, this.showInfo, this)

            this.headMask.on(cc.Node.EventType.TOUCH_END, this.showInfo, this)
        }
    },


    /**改变托管状态显示 */
    activeAutoPlay(bool, idx) {
        this.autoNode.scale = 1;
        this.autoNode.active = bool;
    },
    showInfo(data) {
        let myDate = new Date();
        let currentTime = myDate.getTime();
        if (currentTime - this.lastTime < 2000) {
            cache.alertTip("发言间隔需要2秒");
            return;
        }
        let idx = this.idx;
        utils.pop(GameConfig.pop.PlayerInfo, (node) => {
            node.getComponent("ModulePlayerInfo").init(idx)
        })
        // let newEvent = new cc.Event.EventCustom('playerInfo', true);
        // newEvent.detail = { idx: idx };
        // this.node.dispatchEvent(newEvent);
    },

    reset(data) {  //玩家离开

        this.headMask.off('touchend');
        let idx = TableInfo.realIdx[data.idx];
        this.lblName.string = '';
        utils.setHead(this.sprHead, "");
        this.lblHuxi.string = '0';
        this.lblHuxi.value = 0;
        this.lblscore.string = '0.00';
        this.sprReady[idx == 1 ? 1 : 0].node.active = false;
        this.sprOffline.node.active = false;
        TableInfo.players[data.idx] = null;
        TableInfo.playerHead[data.idx] = null;
        this.lblEmpty.node.active = true;
        this.niaoNode.active = false;
        this.node.active = false;

    },
    setScore(v){
        this.lblscore.string = utils.formatGold(v);
    },
    showReady(data) {
        let idx = TableInfo.realIdx[data.idx];
        this.sprReady[idx == 1 ? 1 : 0].node.active = true;
        if (utils.isNullOrEmpty(data.readyStatus)) return;
        //打鸟显示
        if (data.readyStatus.plus) {
            this.niaoNode.active = true;
            this.niaoNode.scale = 0;
            // this.niaoNode.opacity=0;
            let ap = cc.fadeIn(0.5);
            let bp = cc.scaleTo(0.1, 3);
            let cp = cc.scaleTo(0.3, 0.2);
            let dp = cc.scaleTo(0.1, 1);
            let ep = cc.sequence(bp, cc.delayTime(0.3), cp, dp);
            let fp = cc.spawn(ap, ep);
            this.niaoNode.runAction(ep);

        } else {
            this.niaoNode.active = false;
        }
    },

    hideReady() {
        this.sprReady.forEach(spr => {
            spr.node.active = false;
        })
    },

    active(data) {
        let node = this.sprActive.node;
        node.active = this.idx == data.idx;
        node.stopAllActions();
        node.runAction(cc.repeatForever(
            cc.sequence(
                cc.delayTime(0.5),
                cc.fadeOut(1),
                cc.delayTime(0.5),
                cc.fadeIn(1)
            )
        ));
    },
    /**刷新胡息显示 */
    refreshHuxi(data) {
        let xi = 0;
        this.ground.content.forEach(group => {
            if (group.type == 'hu')
                group.xi = 0;
            xi += group.xi;
        });
        this.lblHuxi.value = xi;
        this.lblHuxi.string = '' + this.lblHuxi.value;
    },
    /**重置玩家信息 */
    roundReset(data = 0) {
        if (TableInfo.zhuang >= 0)
            this.imgBanker.active = TableInfo.zhuang == this.idx && TableInfo.status != GameConfig.GameStatus.WAIT;;
        this.lblHuxi.string = '0';
        this.lblHuxi.value = 0;
        this.qi.content = [];
        this.group.content = [];
        if (data == 0)
            this.hideReady();
        this.initGround(null);
        this.initQi(null);
    },

    changeStatus(data) {
        this.sprOffline.node.active = data.offline && !utils.isNullOrEmpty(this.playerData.prop);
    },
    /**初始化 碰,吃牌区数据 */
    initGround(data) {
        this.ground.removeAllChildren();
        this.ground.length = 0;
        this.ground.content = [];
        if (utils.isNullOrEmpty(data))
            return;
        data.forEach(g => {
            this.newGroup(g, true);
        })
    },
    /**初始化弃牌区数据 */
    initQi(data) {
        this.qi.removeAllChildren();
        this.qi.length = 0;
        this.qi.content = [];
        if (utils.isNullOrEmpty(data))
            return;
        data.forEach(q => {
            this.newQi(q, true);
        })
    },
    // 16, 18, 17
    newGroup(data, init) {
        if (data.type == 'wei')
            TableInfo.zhao.push(data.card);
        let seq = [];
        let nodeGroup = cc.instantiate(this.group);
        nodeGroup.scale = 0.35;
        nodeGroup.parent = this.ground;
        let endPos = {
            x: (POS_GROUND_CARD + this.ground.length * POS_GROUND_RECT),
            y: POS_GROUND_Y
        };
        let startPos = cc.v2(endPos.x + 80, POS_GROUND_Y);
        nodeGroup.getComponent('BaseGroupZP').init(data, { bg: false, click: false });
        this.ground.content.push(nodeGroup.getComponent('BaseGroupZP'));
        if (init)
            nodeGroup.position = cc.v2(endPos.x, POS_GROUND_Y);
        else {
            nodeGroup.position = startPos;
            seq.push(cc.targetedAction(nodeGroup, cc.sequence(
                cc.place(startPos),
                cc.delayTime(0.2),
                cc.moveTo(0.2, endPos.x, endPos.y)
            )));
        }
        this.ground.length++;
        this.refreshHuxi();
        return seq;
    },

    resetGroupPos() {
        for (let i = 0; i < this.ground.content.length; i++) {
            this.ground.content[i].node.position = cc.v2((POS_GROUND_CARD + i * POS_GROUND_RECT), POS_GROUND_Y);
        }
    },
    newQi(data, init) {
        this.qi.content.push(data);
        let qi = cc.instantiate(this.card);
        // qi.scale = 0.35;
        qi.width = 34;
        qi.height = 38.85;

        qi.parent = this.qi;
        // let y = (1 + Math.floor(this.qi.length / 5)) * POS_QI_CARD.y;
        // qi.position = cc.v2((POS_QI_CARD.x + this.qi.length % 5 * POS_CARD_RECT.x * (this.realIdx == 1 ? (-1) : 1)), y);
        qi.getComponent('BaseCardZP').init(data);
        qi.active = init;
        this.qi.length++;
        return qi;
    },

    showBet(str) {
        this.betStr.node.active = true;
        this.betStr.string = str;
    },
    hideBet() {
        this.betStr.node.active = false;
    },

    showClock(value) {
        // let a = new cc.Label();

        let labelNode = this.clock.getChildByName("time").getComponent(cc.Label)
        labelNode.string = utils.isNullOrEmpty(value) ? "15" : "" + parseInt(value);
        let times = utils.isNullOrEmpty(value) ? 15 : parseInt(value);
        labelNode.unscheduleAllCallbacks();
        this.clock.active = true;
        labelNode.schedule(() => {
            times--;
            this.clock.getChildByName("time").getComponent(cc.Label).string = Math.max(times, 0);
            if (times <= 5) {

            }
        }, 1);
    },
    hideClock() {
        this.clock.getChildByName("time").getComponent(cc.Label).unscheduleAllCallbacks();
        this.clock.active = false;
    },
    removePlayer() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update  (dt) {

    // },
});
