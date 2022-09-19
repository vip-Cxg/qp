let cache = require('Cache');
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    start () {
    },

    showPay(){
        this.node.parent = cc.find('Canvas');
    },

    exitPay () {
        
        this.node.removeFromParent(false);
    }
});
