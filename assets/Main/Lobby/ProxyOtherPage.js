// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

 var { GameConfig } = require("../../GameBase/GameConfig");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");
const { GoEasy } = require("../GoEasy/GoEasy");

cc.Class({
    extends: cc.Component,

    properties: {
        lblScoreId: cc.EditBox,
        lblScore: cc.EditBox,
        lblMailId: cc.EditBox,
        lblMailTitle: cc.EditBox,
        lblMailContent: cc.EditBox,
        frozenID: cc.EditBox,
        banRemarks:cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onSendMail() {
        

        if (utils.isNullOrEmpty(this.lblMailTitle.string)) {
            Cache.alertTip("请输入邮件标题")
            return;
        }

        if (utils.isNullOrEmpty(this.lblMailContent.string)) {
            Cache.alertTip("请输入邮件内容")
            return;
        }
        // {"date":"2020-11-10","title":"上分成功","content":"管理员[ID:100001] 为您上分 10000分"}

        let title = this.lblMailTitle.string;
        let content = this.lblMailContent.string;

        let reqData = utils.isNullOrEmpty(this.lblMailId.string) ? { id: null, content, title } : { id: this.lblMailId.string, content, title };


        Cache.showConfirm("是否发送邮件", () => {
            Connector.request(GameConfig.ServerEventName.ProxyMail, reqData, (data) => {
                Cache.alertTip("发送成功");
            })
        })

    },

    addWellet() {
        
        if (utils.isNullOrEmpty(this.lblScoreId.string)) {
            Cache.alertTip("请输入用户id")
            return;
        }
        let reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(this.lblScore.string)) {
            Cache.alertTip("请输入整数金额")
            return;
        }
        Cache.showConfirm("确认充值金额：" + this.lblScore.string, () => {
            Connector.request(GameConfig.ServerEventName.ProxyAdminChange, { id: parseInt(this.lblScoreId.string), wallet: parseFloat(this.lblScore.string) * 100 }, (data) => {
                Cache.alertTip("上分成功");
            })
        })



    },
    reduceWellet() {
        
        if (utils.isNullOrEmpty(this.lblScoreId.string)) {
            Cache.alertTip("请输入用户id")
            return;
        }
        let reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(this.lblScore.string)) {
            Cache.alertTip("请输入整数金额")
            return;
        }
        Cache.showConfirm("确认下分金额：" + this.lblScore.string, () => {
            Connector.request(GameConfig.ServerEventName.ProxyAdminChange, { id: parseInt(this.lblScoreId.string), wallet: parseFloat("-" + this.lblScore.string) * 100 }, (data) => {
                Cache.alertTip("下分成功");
            })
        })
    },

    onFrozenUser(e,v){
        
        if (utils.isNullOrEmpty(this.frozenID.string)) {
            Cache.alertTip("请输入用户id")
            return;
        }
        if (utils.isNullOrEmpty(this.banRemarks.string)) {
            Cache.alertTip("请输入封禁理由")
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyBan,{id:parseInt(this.frozenID.string),remarks:"",status:v},(data)=>{
            Cache.alertTip(v=="normal"?"解封成功":"封号成功")
        })

    },

    onSetBlack(e,v){
        
        if (utils.isNullOrEmpty(this.frozenID.string)) {
            Cache.alertTip("请输入用户id")
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyHouseSet,{id:parseInt(this.frozenID.string),gameType:'XHZD'},(data)=>{
            Cache.alertTip('用户已关入小黑屋')
        })
    },
    onDelBlack(e,v){
        
        if (utils.isNullOrEmpty(this.frozenID.string)) {
            Cache.alertTip("请输入用户id")
            return;
        }
        Connector.request(GameConfig.ServerEventName.ProxyHouseDel,{id:parseInt(this.frozenID.string),gameType:'XHZD'},(data)=>{
            Cache.alertTip('用户已放出小黑屋')
        })
    },
    onClickClose(){
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
    // update (dt) {},
});
