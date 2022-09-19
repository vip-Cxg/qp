import TableInfo from "../../../Main/Script/TableInfo"

const { ccclass, property } = cc._decorator
@ccclass
export default class WSKScoreCardCount extends cc.Component {

    // @property(cc.Node)
    // bgCardMask = null;

    renderUI(handsCard, teammateHands = []) {
        let totalScore={
            '18':2,
            '17':2,
            '16':8,
            '14':8,
            '113':2,
            '110':2,
            '105':2,
            '213':2,
            '210':2,
            '205':2,
            '313':2,
            '310':2,
            '305':2,
            '413':2,
            '410':2,
            '405':2,
        }
        console.log("hands",handsCard);
        console.log("TableInfo.outCards",TableInfo.outCards);
        let outScore=TableInfo.outCards.concat(handsCard).concat(teammateHands);
        outScore.forEach((e)=>{
            if(!totalScore[''+e]&&!totalScore['' + e%100]) return;
            if(e%100 >= 14){
                totalScore['' + e % 100]-=1;
            }else{
                totalScore['' + e]-=1;
            }
        })
        

        for(let key in totalScore){
            this.node.getChildByName(key).getChildByName('count').getComponent(cc.Label).string=totalScore[key]

            // if(Number(key)>=17){
            //     this.node.getChildByName(key).getChildByName('count').getComponent(cc.Label).string=totalScore[key]

            // }else if(Number(key)>=14) {
            //     this.node.getChildByName(''+(Number(key)%100)).getChildByName('count').getComponent(cc.Label).string=totalScore[key]

            // }
        }
        console.log("totalSccores",totalScore)
    }

}


