// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const utils = require("../../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        sellerName: cc.Label,
        amount: cc.Label,
        desc: cc.Label,
        dealPro: cc.Label,
        avatar: cc.Sprite,
        alipayIcon: cc.Node,
        weChatIcon: cc.Node,
        bankIcon: cc.Node,
        createTradePop:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initData(data) {
        this.alipayIcon.active = data.alipay;
        this.weChatIcon.active = data.wechat;
        this.bankIcon.active = data.bank;
        if(data.user&&data.user.dealInfo&&data.user.dealInfo.stat){

            let arr=data.user.dealInfo.stat.confirm;
            let total=data.user.dealInfo.stat.total;
            this.desc.node.active=total>=3;
    
            this.dealPro.string=total<3?"成交单数过少":"约"+Math.ceil((arr[0]*2 + arr[1]*10 + arr[2]*30)/total)+"分钟"
        }

        this.sellerName.string = utils.getStringByLength(data.user.name, 5);
        if (data.user.head)
            utils.setHead(this.avatar, data.user.head);
        this.amount.string="可购买金额: "+((data.remain/100)>2000?"2000+":data.remain/100);
        
        this.node.on(cc.Node.EventType.TOUCH_END,()=>{
            let item=cc.instantiate(this.createTradePop);
            item.getComponent('CreateTradePop').initData(data);
            cc.find("Canvas").addChild(item);
        },this)
    }

    // update (dt) {},
});
