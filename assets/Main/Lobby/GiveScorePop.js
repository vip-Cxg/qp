
let { GameConfig } = require("../../GameBase/GameConfig");
const { App } = require("../../script/ui/hall/data/App");
const Connector = require("../NetWork/Connector");
const Cache = require("../Script/Cache");
const utils = require("../Script/utils");

cc.Class({
    extends: cc.Component,

    properties: {
        giveNode: cc.Node,
        userNode: cc.Node,

        scoreInput: cc.EditBox,
        idInput: cc.EditBox,
        pwdInput: cc.EditBox,

        lblId: cc.Label,
        lblName: cc.Label,
        lblWallet: cc.Label,
        lblPhone: cc.Label,
        avatarSpr: cc.Sprite,

        updatePage: cc.Prefab
    },

    // use this for initialization
    onLoad() {

    },

    confirm() {
        
        if (this.pwdInput.string == "") {
            Cache.alertTip("请输入交易密码")
            return;
        }
        if (this.idInput.string == "") {
            Cache.alertTip("请输入玩家id")
            return;
        }
        if (this.scoreInput.string == "") {
            Cache.alertTip("请输入转账金额")
            return;
        }
        let reg = /^[0-9]*[1-9][0-9]*$/;
        if (!reg.test(this.scoreInput.string)) {
            Cache.alertTip("请输入整数金额")
            return;
        }
        console.log("this.scoreInput.string", parseInt(this.scoreInput.string))
        if (parseInt(this.scoreInput.string) <= 0) {
            Cache.alertTip("转账金额必须大于0")
            return;
        }
        if (parseInt(this.scoreInput.string) % 10 != 0) {
            Cache.alertTip("转账金额必须为10的倍数")
            return;
        }
        Connector.request(GameConfig.ServerEventName.SearchUserInfo, { id: parseInt(this.idInput.string) }, (res) => {
            if (!utils.isNullOrEmpty(res.user)) {
                this.giveNode.active = false;
                this.userNode.active = true;

                this.lblId.string = '玩家ID: ' + res.user.id;
                this.lblName.string = '昵称: ' + utils.getStringByLength(res.user.name, 6);
                this.lblWallet.string = '转账金额: ' + this.scoreInput.string + '元'
                if (res.user.hasBind) {
                    let phoneStr = res.user.phone.substr(0, 3) + '****' + res.user.phone.substr(7);
                    this.lblPhone.string = '手机号: ' + phoneStr;

                } else {
                    this.lblPhone.string = '手机号: 未绑定';
                }

                if (!utils.isNullOrEmpty(res.user.head)) {
                    utils.setHead(this.avatarSpr, res.user.head)
                }

            }
        })

    },

    updateTradePwd() {
        
        let updatePage = cc.instantiate(this.updatePage);
        this.node.addChild(updatePage);
    },


    ensureConfirm() {
        
        let encryptPwd = utils.encryptToken(this.pwdInput.string);
        Connector.request(GameConfig.ServerEventName.GiveAwayScore, { targetID: parseInt(this.idInput.string), wallet: parseInt(this.scoreInput.string) * 100, password: encryptPwd }, (res) => {
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.UPDATE_WALLET_DATA)
            this.initUI();
            Cache.alertTip("转账成功");

        },1,(err)=>{
            Cache.showTipsMsg(err.message||'转账失败',()=>{
                this.giveNode.active = true;
                this.userNode.active = false;
            })
        })
    },
    cancelConfirm() {
        
        this.giveNode.active = true;
        this.userNode.active = false;

    },
    initUI() {
        this.pwdInput.string = "";
        this.scoreInput.string = "";
        this.idInput.string = "";
        this.giveNode.active = true;
        this.userNode.active = false;
    },

    onClickClose() {
        
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }


});
