import { GameConfig } from '../../GameBase/GameConfig';
import GameUtils from '../../script/common/GameUtils';
import Http from '../../script/common/network/Http';
import { App } from '../../script/ui/hall/data/App';
import Connector from '../NetWork/Connector';
import utils from '../Script/utils';
import Cache from './Cache';
import { SC_ROUND_SUMMARY } from './ROUTE';
export class SelectLink {
    // static _instance = null;

    // static getInstance(apiCallback,hotCallback) {
    //     if (!this._instance)
    //         this._instance = new SelectLink(apiCallback,hotCallback);
    //     return this._instance;
    // }

    _apiUrl = null;
    _apiSelected = false;
    _hotSelected = false;
    _apiCallback = null;
    _hotCallback = null;
    _startTime = 0;
    constructor(apiCallback = null, hotCallback = null) {
        this._apiUrl = null;
        this._apiSelected = false;
        this._hotSelected = false;
        this._apiCallback = apiCallback;
        this._hotCallback = hotCallback;
        this._startTime = 0;
        this.loadLocalConfig();
    }

    /**加载本地配置 */
    loadLocalConfig() {
        this.changeLocalUrl();
    }
    serverFailed = null;
    /**选择最快链路 */
    selectQuickestUrl(data) {
        this._apiSelected = false;
        if (this.serverFailed)
            clearTimeout(this.serverFailed);
        this._startTime = GameUtils.getTimeStamp();
        this.serverFailed = setTimeout(() => {
            //请求失败 调用备用域名  
            Cache.alertTip("网络较卡,正在选择新线路")
            this.loadDefaultUrl()
        }, 20 * 1000);
        data.servers.forEach(url => {   
            utils.XMLRequest(url, this.changeLocalUrl.bind(this));
        })
    }
    /**无法获取新的 下载默认配置域名 */
    loadDefaultUrl() {
        utils.testConnect(GameConfig.DefaultUrl, (err, res) => {
            console.log("loadDefaultUrl---", err, res)
            if (!err) {
                //将新配置保存至本地
                // GameUtils.LogsClient(GameConfig.LogsEvents.SELECT_LINK, { action: GameConfig.LogsActions.SELECT_SPARE_LINK })
                utils.saveValue(GameConfig.StorageKey.ServerUrlObj, res);
                this.selectQuickestUrl(res);
            } else {
                // GameUtils.LogsClient(GameConfig.LogsEvents.SELECT_LINK, { action: GameConfig.LogsActions.SELECT_LINK_FAIL })
                App.confirmPop("无法访问服务器,请检查网络后再重启游戏", () => {
                    cc.game.end();
                })
            }

        })
    }

    changeLocalUrl(url, serverData) {
        console.log("选择url----",url,serverData)
        if (this._apiSelected) return;
        console.log("选择url---1-",this._apiSelected)
        this._apiSelected = true;
        clearTimeout(this.serverFailed); 
        // url ='http://192.168.10.7:8000/';////'http://192.168.10.10:8000/';//'http://192.168.10.10:8000/';
        url = 'http://114.132.55.75:8000/';//'http://8.134.137.113:8000/';// 'http://120.27.209.239:8000/';//'http://121.40.34.183:8000/';//
        Connector.logicUrl = url;//url;//xyhldqp.com   "http://resource.qyhnmj.com/hnupdate/"//xyhldqp.com
        Http.API_URL = url;

        // let durTime = ((GameUtils.getTimeStamp() - this._startTime) / 1000).toFixed(2);
        // GameUtils.LogsClient(GameConfig.LogsEvents.SELECT_LINK, { action: GameConfig.LogsActions.SELECT_LINK_TIME, url: url, times: durTime })

        //将新配置保存至本地
        utils.saveValue(GameConfig.StorageKey.ServerUrlObj, serverData);
        if (this._apiCallback)
            this._apiCallback();






    }


    get ApiUrl() {
        return this._apiUrl;
    }


    // --------------热更新地址--------------------------------

    selectHot() {
        this._hotSelected = false;
        let serverData = utils.getValue(GameConfig.StorageKey.ServerUrlObj, {});
        if (utils.isNullOrEmpty(serverData) || utils.isNullOrEmpty(serverData.update)) {
            if (this._hotCallback)
                this._hotCallback("");
            return;
        }
        if (typeof serverData.update == 'string') {
            //TODO 只有一个字符串
            if (this._hotCallback)
                this._hotCallback(serverData.update);
            return;
        }

        if (this.hotSelectFail)
            clearTimeout(this.hotSelectFail)
        this.hotSelectFail = setTimeout(() => {
            //TODO 所有热更新域名都无法访问 
            if (this._hotCallback)
                this._hotCallback("");
        }, 12 * 1000);
        serverData.update.forEach(url => {
            Connector.get(url + 'version.manifest', 'getJson', (resData) => {
                this.changeHotUrl(url);
            }, null, (err) => {
                console.log(url + "---err--", err)

            });
        })
    }

    changeHotUrl(url) {
        if (this._hotSelected) return;
        this._hotSelected = true;
        clearTimeout(this.hotSelectFail)
        console.log("新的热更新地址-----", url)
        if (this._hotCallback)
            this._hotCallback(url);
    }

}

