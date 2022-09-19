import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import { App } from "../../ui/hall/data/App";
import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator
@ccclass
export default class ClubNoticePop extends cc.Component {

    @property(cc.Label)
    lblTitle = null;
    @property(cc.Label)
    lblDescName = null;
    @property(cc.Label)
    lblDescNotice = null;

    @property(cc.EditBox)
    roomNameInput = null;
    @property(cc.EditBox)
    noticeInput = null;
    @property(cc.Node)
    noticeNode = null;
    @property(cc.Node)
    bugNode = null;
    @property(cc.Node)
    tagNode = null;
    @property(cc.Sprite)
    bugImg = null;

    @property(cc.Node)
    tagContent = null;
    @property(cc.Prefab)
    tagItem = null;
    @property(cc.Prefab)
    listItem = null;
    
    chooseRoom = [];

    onLoad() {
        this.addEvents();
        this.renderNotice(true)
        // this.downloadAllRooms()
    }
    addEvents() {
        App.EventManager.addEventListener(GameConfig.GameEventNames.SELECT_TAG_HISTORY, this.addTag, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.CANCEL_TAG_HISTORY, this.removeTag, this);
        App.EventManager.addEventListener(GameConfig.GameEventNames.CLUB_ROOM_CHANGE, this.downloadAllRooms, this);
    }
    removeEvents() {
        App.EventManager.removeEventListener(GameConfig.GameEventNames.SELECT_TAG_HISTORY, this.addTag, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.CANCEL_TAG_HISTORY, this.removeTag, this);
        App.EventManager.removeEventListener(GameConfig.GameEventNames.CLUB_ROOM_CHANGE, this.downloadAllRooms, this);

    }
    renderNotice() {
        this.lblTitle.string="公告";
        this.lblDescName.string=App.Club.IsLeague? '联盟名:':'公会名:';
        this.lblDescNotice.string=App.Club.IsLeague? '联盟公告:':'公会公告:';
        this.changeUIActive(true);
        this.roomNameInput.string=App.Club.ClubName;
        if (!GameUtils.isNullOrEmpty(App.Club.ClubNotice)) {
            this.noticeInput.string = App.Club.ClubNotice;
        }
    }
    renderBug() {
        this.lblTitle.string="外挂悬赏";

        this.changeUIActive(false);
        let url = GameConfig.ConfigUrl + "info/ad.jpg";;
        GameUtils.loadImg(url).then((tex) => {
            this.bugImg.spriteFrame = tex;
        });
    }

    changeUIActive(bool) {

        this.noticeNode.active = bool;
        this.bugNode.active = !bool;
        this.tagNode.active = false;

    }


    onUpdateNotice() {
        
        if (GameUtils.isNullOrEmpty(this.noticeInput.string)) {
            Cache.alertTip('请输入公会公告')
            return;
        }
        if (GameUtils.isNullOrEmpty(this.roomNameInput.string)) {
            Cache.alertTip('请输入公会名')
            return;
        }
        Connector.request(GameConfig.ServerEventName.UpdateClubNotice, { clubID: App.Club.CurrentClubID,name:this.roomNameInput.string, notice: this.noticeInput.string }, (data) => {
            Cache.alertTip('修改成功');
            App.Club.ClubNotice = this.noticeInput.string;
            App.Club.ClubName = this.roomNameInput.string;
        })

    }

    openCreatePop() {
        
        GameUtils.pop(GameConfig.pop.CreateRoomPop);
    }


    downloadAllRooms() {
        this.lblTitle.string="房型管理";

        this.noticeNode.active = false;
        this.bugNode.active = false;
        this.tagNode.active = true;
        this.tagContent.removeAllChildren();
        this.chooseRoom = [];

        Connector.request(GameConfig.ServerEventName.AllRooms, { clubID: App.Club.CurrentClubID }, (data) => {
            // {
            //     "success": true,
            //     "status": 0,
            //     "message": null,
            //     "detail": null,
            //     "version": "1.0.1",
            //     "rooms": [
            //         {
            //             "roomID": 100000,
            //             "name": "10元",
            //             "gameType": "XHZD",
            //             "base": 100,
            //             "fee": 10,
            //             "lower": 2000,
            //             "person": 4
            //         }
            //     ]
            // }
            if (!GameUtils.isNullOrEmpty(data.rooms)) {
                data.rooms.forEach(element => {
                    let tagBtn = cc.instantiate(this.listItem);
                    tagBtn.getComponent('RoomListItem').initData(element)
                    this.tagContent.addChild(tagBtn);
                });
                //     let gameType = {};
                //     //选择当前默认
                //     this.chooseRoom = this.chooseRoom.concat(GameConfig.TableAllRooms);
                //     data.rooms.forEach(element => {
                //         let index= this.chooseRoom.findIndex(a => a.roomID == element.roomID);
                //         if(index!=-1){
                //             element=this.chooseRoom[index];
                //             element.choose=true;
                //         }else{
                //             element.choose=false;
                //         }
                //         // this.chooseRoom.push(element);
                //         if (GameUtils.isNullOrEmpty(gameType[element.gameType]))
                //             gameType[element.gameType] = [];
                //         gameType[element.gameType].push(element);
                //     });

                //     console.log('--rooms--', gameType);
                //     for (let key in gameType) {
                //         let tagBtn = cc.instantiate(this.tagItem);
                //         tagBtn.getComponent('RoomTagItem').renderUI(key, gameType[key])
                //         this.tagContent.addChild(tagBtn);
                //     }
            }
        });

    }

    onConfrimRooms() {
        console.log("提交----", this.chooseRoom);
        // return;
        Connector.request(GameConfig.ServerEventName.UpdateClubNotice, { clubID: App.Club.CurrentClubID, rooms: this.chooseRoom }, (data) => {
            Cache.alertTip('修改成功');
            App.EventManager.dispatchEventWith(GameConfig.GameEventNames.CLUB_ROOM_CHANGE);
        })
    }

    addTag(e) {
        let index = this.chooseRoom.findIndex(a => a.roomID == e.data.roomID);
        if (index == -1)
            this.chooseRoom.push(e.data);
    }
    removeTag(e) {
        let index = this.chooseRoom.findIndex(a => a.roomID == e.data.roomID);
        if (index != -1)
            this.chooseRoom.splice(index, 1);
    }

    onClickClose() {
        
        this.removeEvents()
        this.node.destroy();
    }



}


