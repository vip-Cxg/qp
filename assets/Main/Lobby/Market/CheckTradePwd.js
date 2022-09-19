
// let { GameConfig } = require("../../../GameBase/GameConfig");
// const Cache = require("../../Script/Cache");
// const utils = require("../../Script/utils");

// cc.Class({
//     extends: require("ModuleWinConfirm"),

//     properties: {
//         pwdInput: cc.EditBox,
//         updatePage: cc.Prefab
//     },

//     // use this for initialization
//     onLoad() {

//     },

//     confirm() {
//         


//         if (this.pwdInput.string == "") {
//             Cache.alertTip("请输入交易密码")
//             return;
//         }
//         if (this.callback1 != null)
//             this.callback1(this.pwdInput.string);
//         if (this.node)
//             this.node.destroy();
//     },

//     updateTradePwd() {
//         
//         let updatePage = cc.instantiate(this.updatePage);
//         this.node.addChild(updatePage);
//     },

// });
