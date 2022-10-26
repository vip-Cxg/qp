import { App } from "../../ui/hall/data/App";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameServicePop extends cc.Component {
 
    @property(cc.WebView)
    web = null

    init() {
        let url='https://196ad724f7cc7.mstalk.cn/dist/standalone.html?eid=10a1d21c07548ec590f6c55245e115f2'
        this.web.url = `${url}&metadata={"id":"${App.Player.id}"}`//  ;
        console.log(`${url}&metadata={"id":"${App.Player.id}"}`)
    }

   

    onClickClose() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }
}


