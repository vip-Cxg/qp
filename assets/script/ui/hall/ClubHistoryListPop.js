import { GameConfig } from "../../../GameBase/GameConfig";
import Connector from "../../../Main/NetWork/Connector";
import Cache from "../../../Main/Script/Cache";
import DataBase from "../../../Main/Script/DataBase";
import { App } from "../../ui/hall/data/App";
import GameUtils from "../../common/GameUtils";

const { ccclass, property } = cc._decorator
@ccclass
export default class ClubHistoryListPop extends cc.Component {

    // @property(cc.Label)
    // lblTotalCount = null;
    @property(cc.EditBox)
    replayInput = null;
    @property(cc.Label)
    lblPage = null;
    // @property(cc.Node)
    // inviteBtn = null;
    @property(cc.Node)
    pageContainer = null;


    @property(cc.Node)
    itemContent = null;
    @property(cc.Prefab)
    userItem = null;


    page = 1;
    totalPage = 0;
    renderData = null;
    selfUserID = 0;
    onLoad() {
        this.renderData = {
            page: [],
            rows: {}
        }
        this.addEvents();
        //TODO

    }
    addEvents() {
    }
    removeEvents() {
    }
    initUserID(userId) {
        this.selfUserID = userId;
        // if (userId != DataBase.player.id) {
        //     this.inviteBtn.active = false;
        // }
        this.renderUI(1);
    }

    renderUI(page) {
        this.itemContent.removeAllChildren();
        //TODO
        if (this.renderData.page.indexOf(page) != -1) {
            this.page = page;
            this.lblPage.string = this.page + '/' + this.totalPage;
            this.renderData.rows['' + page].forEach((e, i) => {
                let userItem = cc.instantiate(this.userItem);
                userItem.getComponent('ClubHistoryListItem').initData(e, i);
                this.itemContent.addChild(userItem);
            });
            return;
        }
        // condition
        Connector.request(GameConfig.ServerEventName.ClubLogs, { clubID: App.Club.CurrentClubID, userID: this.selfUserID, page: page, pageSize: 5 }, (res) => {
            if (res.logs && !GameUtils.isNullOrEmpty(res.logs.rows)) {
                this.renderData.page.push(page);
                this.renderData.rows['' + page] = res.logs.rows;
                this.pageContainer.active = true;
                this.page = page;
                this.totalPage = Math.ceil(res.logs.count / 5);
                this.lblPage.string = page + '/' + Math.ceil(res.logs.count / 5);
                // this.lblTotalCount.string = '总人数: ' + res.logs.count;
                res.logs.rows.forEach((e, i) => {
                    let userItem = cc.instantiate(this.userItem);
                    userItem.getComponent('ClubHistoryListItem').initData(e, i);
                    this.itemContent.addChild(userItem);
                });
            } else {
                this.pageContainer.active = false;
            }


        })
    }
    addPage() {
        
        if (this.page >= this.totalPage) {
            Cache.alertTip('已经是最后一页');
            return;
        }
        let a = this.page + 1;
        this.renderUI(a);
    }
    reducePage() {
        
        if (this.page == 1) {
            Cache.alertTip('已经是第一页');
            return;
        }
        let a = this.page - 1;

        this.renderUI(a);
    }
    onClickSearch() {
        if (GameUtils.isNullOrEmpty(this.replayInput.string)) {
            Cache.alertTip('请输入回放码');
            return
        }

        let firstIndex = this.replayInput.string.indexOf('/');
        let endIndex = this.replayInput.string.indexOf('_');
        if (firstIndex == -1 || endIndex == -1) {
            Cache.alertTip('回放码错误');
            return;
        }
        let gametype = this.replayInput.string.slice(firstIndex + 1, endIndex);

        let gameid = DataBase.GAME_TYPE[gametype] < 10 ? '0' + DataBase.GAME_TYPE[gametype] : DataBase.GAME_TYPE[gametype];

        if (GameUtils.isNullOrEmpty(gameid)) {
            Cache.alertTip('回放码错误');
            return
        }

        Connector.get(GameConfig.RecordUrl + 'records/' + this.replayInput.string + '.json', "getJson", (resData) => {
            // db.gameDate = this.lblTime.string;
            // Cache.replayTime = this.lblTime.string;
            // Cache.turn = data.serialID;
            Cache.replayData = resData;
            console.log('回放数据: ', resData)
            if (resData == null) {
                Cache.alertTip("暂无回放");
                return;
            }
            if (gameid == "") {
                Cache.alertTip("暂时无法播放");
                return
            }
            cc.loader.loadRes(`Main/Prefab/replay${gameid}`, (err, prefab) => {
                if (!err) {
                    let nodeReplay = cc.instantiate(prefab);
                    nodeReplay.parent = cc.find('Canvas');
                    // if (gameid == "08")
                    //     nodeReplay.getComponent("ModuleReplay" + gameid).initData(data.gameType);
                } else {
                    cc.log('error to load replay');
                }
            });
        });
    }

    onClickClose() {
        
        this.removeEvents()
        this.node.destroy();
    }



}


