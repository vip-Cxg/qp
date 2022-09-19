
// let { GameConfig } = require("../../../GameBase/GameConfig");
// const Cache = require("../../Script/Cache");
// const Native = require("../../Script/native-extend");
// const utils = require("../../Script/utils");
// const _social = Native.Social

// cc.Class({
//     extends: require("ModuleWinConfirm"),

//     properties: {
//         receiptSpr: cc.Sprite,
//         receiptUrl: ""
//     },

//     // use this for initialization
//     onLoad() {
//         GameConfig.isUpdateReceipt = true;
//         _social.ReceiptCallBack = (data) => {
//             console.log("上传付款凭证: ", data);
//             // if (utils.isNullOrEmpty(data)) {

//             // }
//             this.receiptUrl = data;
//             utils.setHead(this.receiptSpr, GameConfig.GameInfo.resourceURL + data);
//         }
//     },
//     cancel() {
//         
//         if (this.callback2 != null)
//             this.callback2();
//         _social.ReceiptCallBack = null;
//         try {

//             if (this.node)
//                 this.node.destroy();
//         } catch (error) {

//         }
//     },
//     confirm() {
//         


//         if (this.receiptUrl == "") {
//             //TODO
//             Cache.showConfirm("未上传付款凭证,是否继续?", () => {
//                 if (this.callback1 != null)
//                     this.callback1(this.receiptUrl);
//                 if (this.node)
//                     this.node.destroy();
//             })
//             return;
//         }
//         if (this.callback1 != null)
//             this.callback1(this.receiptUrl);
//         if (this.node)
//             this.node.destroy();
//         _social.ReceiptCallBack = null;
//     },


//     /**上传收款码 */
//     onUpdateReceipt() {
//         
//         if (cc.sys.isBrowser)
//             this.receiptUrl = "qrcode/b7a22bb0-3ac3-4e4f-be77-564745767f68.jpg";

//         _social.selectReceipt();
//     },


// });
