// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
 var { GameConfig } = require('../../GameBase/GameConfig');
const TableInfo = require('../../Main/Script/TableInfo');
const { App } = require('../../script/ui/hall/data/App');

const TYPE_STR = {
    'ZHI': '点杠 x1',
    'KONG': '暗杠 x2',
    'BU': '明杠 x1',
    'PONG': '',
    'CHOW': '',
}

cc.Class({
    extends: cc.Component,

    properties: {
        currentData: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    //TODO  传 realIdx
    init(data, realIdx = 0, showStr = false) {


        this.currentData = data;
        // if (showStr && (data.event == GameConfig.GameAction.ZHI || data.event == GameConfig.GameAction.KONG || data.event == GameConfig.GameAction.BU)) {
        //     this.node.getChildByName('desc').active = true;
        //     this.node.getChildByName('desc').getComponent(cc.Label).string = data.card > 30 ? '字' + TYPE_STR[data.event] : '' + TYPE_STR[data.event];
        // }
        //TODO 吃结构改变


        let fromIdx = TableInfo.realIdx[data.from];
        // let nodeName = '';
        // let gangName = ''
        switch (fromIdx) {
            case 0:
                this.node.getChildByName('arror').rotation = 0;
                // nodeName = '3';
                break;
            case 1:
                this.node.getChildByName('arror').rotation = -90;

                // nodeName = '3';

                break;
            case 2:
                // nodeName = '2';
                this.node.getChildByName('arror').rotation = 180;
                // gangName = 'gang';
                break;
            case 3:
                this.node.getChildByName('arror').rotation = 90;
                // nodeName = '1';
                break;
        }
        let chiArr = [];
        // { event: 'CHOW', idx: 0, card: 2, tile: 2, from: 0 } 吃
        if (data.event == GameConfig.GameAction.CHOW) {
            let a = [data.tile, data.tile + 1, data.tile + 2];// 2, 3, 4     .splice(data.card, 1, 1)
            // TableInfo.outCards.push(a[0]);
            // TableInfo.outCards.push(a[1]);
            // TableInfo.outCards.push(a[2]);
            let cardIndex = a.indexOf(data.card);
            switch (cardIndex) {
                case 0:
                    chiArr = [a[1], a[0], a[2]];
                    break;
                case 1:
                    chiArr = [a[0], a[1], a[2]];
                    break;
                case 2:
                    chiArr = [a[0], a[2], a[1]];
                    break;
            }

        }
        if (data.event == GameConfig.GameAction.PONG || data.card == TableInfo.special?.chao) {
            // TableInfo.outCards.push(data.card);
            // TableInfo.outCards.push(data.card);
            // TableInfo.outCards.push(data.card);
        }
        // if (data.event != 'peng') {

        if ((data.event == GameConfig.GameAction.KONG || data.event == GameConfig.GameAction.ZHI || data.event == GameConfig.GameAction.BU || data.event == GameConfig.GameAction.SHOW) && data.card != TableInfo.special?.chao) {

            // TableInfo.outCards.push(data.card);
            // TableInfo.outCards.push(data.card);
            // TableInfo.outCards.push(data.card);
            // if (data.from == data.idx)
            //     TableInfo.outCards.push(data.card);
        }
        this.node.active = true;
        if (data.event == GameConfig.GameAction.KONG) {

            this.node.getChildByName('gang').active = true;
            this.node.getChildByName('gang').getChildByName('an').active = false;
            this.node.getChildByName('1').getChildByName('an').active = true;
            this.node.getChildByName('3').getChildByName('an').active = true;

            if(data.card != TableInfo.special?.chao){
                this.node.getChildByName('2').getChildByName('an').active = true;
            }else{
                this.node.getChildByName('1').x=-(this.node.getChildByName('1').width/2)*this.node.getChildByName('1').scale;
                this.node.getChildByName('2').active = false;
                this.node.getChildByName('3').x=(this.node.getChildByName('3').width/2)*this.node.getChildByName('3').scale;
            }


            this.node.children.forEach((node, i) => {
                if (node._name == 'desc' || node._name == 'smoke' || node._name == 'arror') return;

                //     node.active = data.card != TableInfo.special?.chao
                // } else {
                //     node.active = true;
                // }
                node.getComponent('ModuleGroundCardsMJ').init(data.card, realIdx);

                // node.getChildByName('an').active = realIdx != 0 || i != 3;
                // if(node._name=='2'){
                //     node.getChildByName('an').active =  data.card != TableInfo.special?.chao
                // }else{
                    // node.getChildByName('an').active = node._name != 'gang'
                // }



            });

            return;
        }
       



        this.node.children.forEach((node, i) => {
            if (node._name == 'desc' || node._name == 'smoke' || node._name == 'arror') return;
            // node.active = data.event == GameConfig.GameAction.ZHI || data.event == GameConfig.GameAction.BU || data.event == GameConfig.GameAction.SHOW || ((data.event == GameConfig.GameAction.CHOW || data.event == GameConfig.GameAction.PONG) && node._name != 'gang');

            if (node._name == 'gang')
                node.active = (data.event == GameConfig.GameAction.ZHI || data.event == GameConfig.GameAction.BU || data.event == GameConfig.GameAction.SHOW) && data.card != TableInfo.special?.chao
            // node.getComponent('ModuleGroundCardsMJ').init(  data.card, realIdx);

            // if (data.idx == TableInfo.idx && (node._name == nodeName || node._name == gangName))
            //     node.color = new cc.color(255, 255, 0);

            node.getComponent('ModuleGroundCardsMJ').init(data.event == GameConfig.GameAction.CHOW ? chiArr[i] : data.card, realIdx);
            node.getChildByName('an').active = false;
        })
    },

    onClickQuest() {
        App.EventManager.dispatchEventWith(GameConfig.GameEventNames.HNMJ_QUEST_CALL, this.currentData);
    },
    // update (dt) {},
});
