
const { ccclass, property } = cc._decorator
import Avatar from "../../ui/common/Avatar";
import { App } from '../../ui/hall/data/App';
@ccclass
export default class PlayerInfo extends cc.Component {

    @property(cc.Label)
    lbName = null;
    @property(cc.Label)
    lbId = null;
    @property(cc.Label)
    lbDate = null;
    @property(cc.Label)
    lbIp = null;
    @property(cc.Label)
    lbAdress = null;
    @property(cc.Node)
    nodeGender = [];
    @property(Avatar)
    avatar = null

    onLoad() {
        let { createdAt, id, name, sex, ip = '暂无', adress = '暂无', head  } = App.Player;
        this.lbId.string = id;
        this.lbName.string = name,
        this.lbDate.string = new Date(createdAt).format("yyyy/MM/dd");
        this.lbAdress.string = adress;
        this.nodeGender[0].active = sex == 'male';
        this.nodeGender[1].active = sex != 'male';
        this.lbIp.string = ip;
        this.avatar.avatarUrl = head;
    }

    init() {

    }

    doExit() {
        if (this.node) {
            this.node.removeFromParent();
            this.node.destroy();
        }
    }

}


