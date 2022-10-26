import { GameConfig } from "../../GameBase/GameConfig";
import Http from "./network/Http";
const JSEncrypt = require('../../Main/Script/jsencrypt');
export default class GameUtils {
    static eventHandle(target, handler, eventData = '') {
        let eventHandle = new cc.Component.EventHandler();
        eventHandle.target = target;
        eventHandle.component = target._name;
        eventHandle.handler = handler;
        eventHandle.customEventData = eventData;
        return eventHandle;
    }

    static randomNumber(len) {
        len = len || 4;
        let $chars = '1234567890';
        let maxPos = $chars.length;
        let rands = '';
        for (let i = 0; i < len; i++) {
            if (i == 0) {
                rands += $chars.charAt(Math.floor(Math.random() * (maxPos - 1)));
            } else {
                rands += $chars.charAt(Math.floor(Math.random() * maxPos));
            }

        }
        return rands;
    }

    static getChineseRule(rules, gameType) {
        switch (gameType) {
            case 'QJHH':
                return GameUtils.getChineseRuleQJHH(rules);
            case 'PDK':
                return GameUtils.getChineseRulePDK(rules);
            case 'WSKBD':
                return GameUtils.getChineseRuleWSKBD(rules);
            case 'WSK':
                return GameUtils.getChineseRuleWSK(rules);
            case 'QJHZMJ':
                return GameUtils.getChineseRuleHZMJ(rules);
        }
    }

    static getChineseRuleHZMJ(rules) {
        // QJHZMJ: {
        //     person: 2, //几人模式
        //     turn: 8,  //小局数
        //     /** 几个东风 */
        //     eastWind: 0,
        //     /** 杠几个 */
        //     wind: 0,
        //     /** 喜相逢 */
        //     xi: 32,  
        //     /** 只许自摸 */
        //     mo: false,
        //     chong: true,  //热铳 强制选项
        //     auto: -1,   //托管
        //     autoDisband: false,
        //     cheat: false,  //防作弊
        //     base: 5, //底分
        // },
        let rulesArray = [];
        let {
            eastWind,
            wind,
            xi,
            mo,
            chong,
            auto,
            autoDisband,
            cheat
        } = rules;
        let ruleTitle = '红中麻将';
        if (eastWind == 0) {
            rulesArray.push('无东风');
        } else {
            rulesArray.push(`东风${eastWind}个`);
        }
        rulesArray.push(`杠${wind}个`);
        if (xi > 0) rulesArray.push('喜相逢');
        if (mo) rulesArray.push('只许自摸');
        if (chong) rulesArray.push('热铳');
        if (auto > 0) rulesArray.push('超时自动托管');
        if (autoDisband) rulesArray.push('托管一局自动解散');
        if (cheat) rulesArray.push('防作弊');
        return [ruleTitle, rulesArray];
    }


    static getChineseRuleWSK(rules) {
        // defaultRules = {
        //     /** 人数 */
        //     person: 4,
        //     /** 底分 */
        //     base: 2,
        //     /** 底子 */
        //     baseCredit: 10,
        //     /** 局数 */
        //     turn: 3,
        //     /** 干锅带彩 */
        //     ggdc: 0,
        //     /** 真五十K大过四炸 */
        //     zwsk: true,
        //     /** 尾游可以捡分 */
        //     tail: true,
        //     /** 去掉34 */
        //     remove34: false,
        //     /** 观看队友手牌 */
        //     teammateHandsVisible: true,
        //     /** 超时托管 */
        //     auto: -1,
        //     /** 托管一局自动解散 */
        //     autoDisband: false,
        //     /** 防作弊 */
        //     cheat: false, 
        //     /** 禁止观战 */
        //     banObserver: false
        // }
        let rulesArray = [];
        let {
            ggdc,
            zwsk,
            tail,
            remove34,
            teammateHandsVisible,
            auto,
            autoDisband,
            cheat,
            banObserver
        } = rules;
        let ruleTitle = `五十K说胡子`;
        if (ggdc) {
            rulesArray.push(`干锅带彩${ggdc}倍`);
        } else {
            rulesArray.push('干锅不带彩');
        }
        if (zwsk) rulesArray.push('真五十K可打炸弹');
        if (tail) rulesArray.push('尾游可以捡分');
        if (remove34) rulesArray.push('去掉34');
        if (teammateHandsVisible) rulesArray.push('观看队友手牌');
        if (auto > 0) rulesArray.push('超时自动托管');
        if (autoDisband) rulesArray.push('托管一局自动解散');
        if (cheat) rulesArray.push('防作弊');
        if (banObserver) rulesArray.push('禁止观战');
        return [ruleTitle, rulesArray];
    }


    static getChineseRuleWSKBD(rules) {
        // person: 2, //几人模式
        // base: 2, //底分
        // turn: 3,  //小局数
        // zwsk: true,
        // tail: true,
        // firstRound: false,
        // auto: -1,   //托管
        // autoDisband: false,
        // cheat: false,  //防作弊
        // banObserver: false,
        // extractCards: false
        let rulesArray = [];
        let {
            zwsk,
            tail,
            firstRound,
            auto,
            autoDisband,
            cheat,
            banObserver,
            extractCards,
            advancedCheat,
            removeScoreCard
        } = rules;
        let ruleTitle = `五十K必打`;
        // rulesArray.push(`${cards}张模式`);
        if (zwsk) rulesArray.push('真五十K可打炸弹');
        if (tail) rulesArray.push('尾游可以捡分');
        if (firstRound) rulesArray.push('有总炸分');
        if (auto > 0) rulesArray.push('超时自动托管');
        if (autoDisband) rulesArray.push('托管一局自动解散');
        if (cheat) rulesArray.push('防作弊');
        if (banObserver) rulesArray.push('禁止观战');
        if (extractCards) rulesArray.push('抽牌');
        if (advancedCheat) rulesArray.push('高级防作弊');
        if (removeScoreCard) rulesArray.push('去分牌');
        return [ruleTitle, rulesArray];
    } 

    static getChineseRulePDK(rules) {
        let rulesArray = [];
        const {
            alwaysHost,
            anonymous,
            auto,
            autoDisband,
            banVoice,
            base,
            bombScore,
            bombWithThree,
            canSeperateBomb,
            cards,
            chainThree,
            cheat,
            counterSpring,
            force,
            heartsTenHasBird,
            heartsThreeFirst,
            person,
            showRemainingCards,
            threeAce,
            threeWithPair,
            turn
        } = rules;
        let ruleTitle = `跑得快${force ? '必打' : ''}`;
        rulesArray.push(`${cards}张模式`);
        if (showRemainingCards) rulesArray.push(`显示剩余手牌数`);
        if (alwaysHost) rulesArray.push(`连庄`);
        if (heartsThreeFirst) rulesArray.push(`先出红桃叁`);
        if (bombWithThree) rulesArray.push(`可四带三`);
        if (heartsTenHasBird) rulesArray.push(`红桃十抓鸟`);
        if (canSeperateBomb) rulesArray.push(`炸弹可拆`);
        if (chainThree) rulesArray.push(`三连对`);
        if (threeWithPair) rulesArray.push(`三带对`);
        if (bombScore) rulesArray.push(`带炸弹分`);
        if (threeAce) rulesArray.push(`AAA为炸弹`);
        if (counterSpring) rulesArray.push(`可反春天`);
        if (auto > 0) rulesArray.push(`超时托管`);
        if (autoDisband) rulesArray.push(`托管一局自动解散`);
        
        return [ruleTitle, rulesArray];
    }

    static getChineseRuleQJHH(rules) {
        let rulesArray = [];
        const { an, hard, person, mo, xi, qing, auto, cheat, autoDisband, chong } = rules;
        let ruleTitles = ['二人癞晃', '二人硬晃', '铁三角癞晃', '铁三角硬晃', '潜江癞晃', '土豪必杠'];
        let ruleTitle = ruleTitles[(person - 2) * 2 + Number(hard)];
        rulesArray.push('双大胡');
        rulesArray.push(`暗杠${an}倍`);
        if (mo) rulesArray.push('只许自摸');
        if (chong) rulesArray.push('热铳');
        if (qing) rulesArray.push('清一色');
        rulesArray.push(xi == 10 ? '飘癞有奖' : '喜相逢');
        if (auto > -1) rulesArray.push('自动托管');
        if (cheat) rulesArray.push('防作弊');
        if (autoDisband) rulesArray.push('托管一局自动解散');
        return [ruleTitle, rulesArray];
    }

    /**判断value是否为空 */
    static isNullOrEmpty(value) {

        // Check for undefined, null and NaN
        if (typeof value === 'undefined' || value === null ||
            (typeof value === 'number' && isNaN(value))) {
            return true;
        }
        // Numbers, booleans, functions and DOM nodes are never judged to be empty
        else if (typeof value === 'number' || typeof value === 'boolean' ||
            typeof value === 'function' || value.nodeType === 1) {
            return false;
        }

        // Check for arrays with zero length
        else if (value.constructor === Array && value.length < 1) {
            return true;
        }

        // Check for empty strings after accounting for whitespace
        else if (typeof value === 'string') {
            if (value.replace(/\s+/g, '') === '') {
                return true;
            }
            else {
                return false;
            }
        }

        // Check for objects with no properties, accounting for natives like window and XMLHttpRequest
        else if (Object.prototype.toString.call(value).slice(8, -1) === 'Object') {
            var props = 0;
            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    props++;
                }
            }
            if (props < 1) {
                return true;
            }
        }

        // If we've got this far, the thing is not null or empty
        return false;
    };
    /**深拷贝数组对象 */
    static deepcopyArr(arr) {
        let res = [];
        arr.forEach((element, i) => {
            let str = JSON.stringify(element);
            res[i] = JSON.parse(str);
        });
        return res;
    }
    /**排序 */
    static sortByProps(item1, item2) {
        var props = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            props[_i - 2] = arguments[_i];
        }

        var cps = []; // 存储排序属性比较结果。
        // 如果未指定排序属性，则按照全属性升序排序。    
        var asc = true;
        if (props.length < 1) {
            for (var p in item1) {
                if (item1[p] > item2[p]) {
                    cps.push(1);
                    break; // 大于时跳出循环。
                } else if (item1[p] === item2[p]) {
                    cps.push(0);
                } else {
                    cps.push(-1);
                    break; // 小于时跳出循环。
                }
            }
        } else {
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                for (var o in prop) {
                    asc = prop[o] === "asc";
                    if (item1[o] > item2[o]) {
                        cps.push(asc ? 1 : -1);
                        break; // 大于时跳出循环。
                    } else if (item1[o] === item2[o]) {
                        cps.push(0);
                    } else {
                        cps.push(asc ? -1 : 1);
                        break; // 小于时跳出循环。
                    }
                }
            }
        }

        for (var j = 0; j < cps.length; j++) {
            if (cps[j] === 1 || cps[j] === -1) {
                return cps[j];
            }
        }
        return 0;
    }
    /**md5 加密数据 */
    static encryptData(data, token) {
        let { ts } = data;
        const ignoreKey = ['ts', 'sign'];
        let keyArray = [];
        for (let key in data) {
            keyArray.push(key);
        }
        keyArray = keyArray.sort();
        let str = '';
        for (let key of keyArray) {
            if (!ignoreKey.includes(key)) {
                str += `${key}=${JSON.stringify(data[key])}&`;
            }
        }
        let firstMd5 = md5(`${str}key=${token}`);
        firstMd5 = firstMd5.toUpperCase();
        let lastMd5 = md5(`${firstMd5}${ts}`);
        lastMd5 = lastMd5.toUpperCase();
        return lastMd5
    };
    /**加密token */
    static encryptToken(token) {
        let encryptor = new JSEncrypt.JSEncrypt();
        let pubkey = GameUtils.getValue(GameConfig.StorageKey.TokenPKey)
        encryptor.setPublicKey(pubkey);
        let tkn = encryptor.encrypt(token);
        return tkn
    }
    /**储存本地
 * @param 仅支持 arr str num obj
 */
    static saveValue(key, value = "") {
        let data = new Object();

        switch (typeof value) {
            case "object":
                data['type'] = Array.isArray(value) ? "array" : typeof value;
                data['value'] = value;
                break;
            default:
                data['type'] = typeof value;
                data['value'] = value;
                break;
        }
        let res = JSON.stringify(data);
        console.log('saveValue', res)
        cc.sys.localStorage.setItem(GameConfig.ApkName + key, res)
    }
    /**获取本地 */
    static getValue(key, defaultValue = "") {
        let value = cc.sys.localStorage.getItem(GameConfig.ApkName + key)
        if (GameUtils.isNullOrEmpty(value))
            return defaultValue;
        let data = JSON.parse(value);
        let res = data.value;
        return res;
    }

    /**获取时间戳 ms */
    static getTimeStamp(dataStr = "") {
        if (dataStr == "")
            return new Date().getTime() + GameConfig.ServerTimeDiff;

        return new Date(dataStr).getTime() + GameConfig.ServerTimeDiff || 0;
    }
    /**
     * 格式化点数,以万为单位
     * @param  {Number} gold    点数
     * @param  {Number} precision 精度
     */
    static formatGold(gold, precision, limit) {
        return (parseFloat(gold) / 100).toFixed(2);
        // let goldNum = Math.abs(parseInt(gold)),
        //     transMin = limit || 100000,
        //     transBase = gold >= 100000000 ? 100000000 : 10000,
        //     result = null;

        // if (goldNum < transMin) {
        //     return gold;
        // }

        // if (isNaN(precision)) {
        //     precision = 2;
        // }

        // goldNum /= transBase;

        // if (goldNum % 1 > Math.pow(0.1, precision)) {
        //     let num = goldNum * Math.pow(10, precision);
        //     result = (Number.isFinite(num) ? Math.round(num) : Math.floor(num)) / Math.pow(10, precision);
        // } else {
        //     result = parseInt(goldNum);
        // }

        // return result + (transBase === 10000 ? '万' : '亿');
    }
    /**格式化时间戳 ms yy:mm:dd:hh:mm:ss */
    static timestampToTime(timestamp) {

        let date = new Date(timestamp);

        let Y = date.getFullYear() + '-';

        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';

        let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + ' ';

        let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';

        let m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ':';

        let s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())

        return Y + M + D + h + m + s;
    }

    /**获取指定长度字符串 */
    static getStringByLength(str, num) {
        if (str) {
            let str_1 = str.replace(/[\u4e00-\u9fa5]/g, "aa");
            let len = str_1.replace(/[A-Z]/g, "aa").length;
            if (len > num * 2) {
                str = str.substr(0, num) + "...";
            }
        }
        return str;
    };
    /**格式化时间戳 s 天时分 */

    static timeToString(second) {
        if (second == 0)
            return "";
        let duration;
        let days = Math.floor(second / 86400);
        let hours = Math.floor((second % 86400) / 3600);
        let minutes = Math.floor(((second % 86400) % 3600) / 60);
        let seconds = Math.floor(((second % 86400) % 3600) % 60);

        let daysStr = days > 9 ? days : '0' + days;
        let hoursStr = hours > 9 ? hours : '0' + hours;
        let minStr = minutes > 9 ? minutes : '0' + minutes;
        let secStr = seconds > 9 ? seconds : '0' + seconds;

        if (days > 0) duration = daysStr + "天" + hoursStr + "小时" + minStr + "分";
        else if (hours > 0) duration = hoursStr + "小时" + minStr + "分" + secStr + "秒";
        else if (minutes > 0) duration = minStr + "分" + secStr + "秒";
        else if (seconds > 0) duration = secStr + "秒";
        return duration;

    }

    /**获取时间戳 ms */
    static getTimeStamp(dataStr = "") {
        if (dataStr == "")
            return new Date().getTime() + GameConfig.ServerTimeDiff;

        return (new Date(dataStr).getTime() + GameConfig.ServerTimeDiff) || 0;
    }

    /**保存到本地 */
    static SaveToLocal(ImgUrl, callBack) {

        let fileName = "textureName";
        let fileType = ".png";
        let filePath = null;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.response && cc.sys.isNative) {
                    try {
                        let rootPath = jsb.fileUtils.getWritablePath();
                        filePath = rootPath + fileName + fileType;
                        let u8a = new Uint8Array(xhr.response);
                        jsb.fileUtils.writeDataToFile(u8a, filePath);
                        if (callBack)
                            callBack(filePath)
                    } catch (error) {
                        if (callBack)
                            callBack("error")

                    }
                }
            }

        };
        xhr.responseType = 'arraybuffer';
        xhr.open("GET", ImgUrl, true);
        xhr.send();

    }

    static fitScreen() {
        var DesignWidth = 1280;
        var DesignHeight = 720;
        // if(cc.sys.OS_ANDROID == cc.sys.os || cc.sys.OS_IOS == cc.sys.os) {
        
        if ((cc.view.getFrameSize().width / cc.view.getFrameSize().height) >= ((2436 / 1125) - 0.05)) {
            GameConfig.FitScreen = 44;

        } else {
            GameConfig.FitScreen = 44;
        }
        // GameConfig.FitScreen = (cc.view.getFrameSize().width - DesignWidth) / 2;
        if ((cc.view.getFrameSize().width / cc.view.getFrameSize().height) >= (DesignWidth / DesignHeight)) {
            //宽度超出
            var width = cc.view.getFrameSize().width * (DesignHeight / cc.view.getFrameSize().height);
            cc.view.setDesignResolutionSize(width, DesignHeight, cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            //高度超出
            var height = cc.view.getFrameSize().height * (DesignWidth / cc.view.getFrameSize().width);
            cc.view.setDesignResolutionSize(DesignWidth, height, cc.ResolutionPolicy.FIXED_WIDTH);
        }
        // }else{
        //     cc.view.setDesignResolutionSize(DesignWidth, DesignHeight, cc.ResolutionPolicy.EXACT_FIT);
        // }

        // if (this.isIphoneX) {
        // cc.find("Canvas/other/user1").getComponent(cc.Widget).left += this.node.width * (44/812);
        // cc.find("Canvas").getComponent(cc.Widget).left += cc.find("Canvas").width * (88/812);
        // var cvs = cc.find("Canvas").getComponent(cc.Canvas);
        // cvs.fitHeight = true;
        // cvs.fitWidth = true;
        // }
    }
    /**弹出弹窗 */
    static pop(popName, callback) {
        if (this.isNullOrEmpty(popName))
            return;
        // let nodeName = popName.replace(/[/]/g, "")
        let nodeName = popName.match(/.*\/(.*)/)[1];
        if (cc.find('Canvas').getChildByName(nodeName)) {
            if (callback)
                callback(cc.find('Canvas').getChildByName(nodeName))
            return;
        }

        cc.loader.loadRes(popName, (err, prefab) => {
            if (!err) {
                let popNode = cc.instantiate(prefab);
                cc.find('Canvas').addChild(popNode, 0, nodeName)
                if (callback)
                    callback(popNode)
            }
        });
    };
    static loadImg(url) {
        return new Promise((res, rej) => {
            // let imgCache = cc.sys.localStorage.getItem(GameConfig.StorageKey.ImgCache)
            // if (GameUtils.isNullOrEmpty(imgCache))
            //     imgCache = '{}';
            // console.log("imgCache", imgCache)
            // let index = imgCache.findIndex(a => a.url == url);
            // if (index != -1) {
            //     res(imgCache[index].tex)
            //     return;
            // }
            // let imgCacheObj=JSON.parse(imgCache)
            // if (!GameUtils.isNullOrEmpty(imgCacheObj[url])) {
            //     res(imgCacheObj[url])
            //     return;
            // }

            let urlType = url.split("://")[0];
            let imgUrl = url.split("://")[1];
            let finalUrl = url;
            switch (urlType) {
                case "remote":
                    finalUrl = GameConfig.ConfigUrl + imgUrl;

                    break;

                case "https":
                case "http":
                    finalUrl = url;
                    break;
            }

            if (urlType == 'file') {
                res(GameConfig.AvatartAtlas.getSpriteFrame("mj_face" + imgUrl));
                return;
            }
            cc.loader.load(finalUrl + '?file=a.png', (err, tex) => {
                if (err) {
                    rej(err);
                } else {
                    // let obj = {
                    //     url,
                    //     tex
                    // }
                    // imgCache.push(obj);
                    // if (imgCache.length > 30)
                    //     imgCache.shift();
                    // imgCacheObj[url]=tex;

                    // cc.sys.localStorage.setItem(GameConfig.StorageKey.ImgCache, JSON.stringify(imgCacheObj))
                    // GameUtils.saveValue(GameConfig.StorageKey.ImgCache, imgCache);
                    res(new cc.SpriteFrame(tex));
                }
            });
        })
    }

    /**打点
     * @param event 打点事件
     * @param data 打点携带参数
     */
    static LogsClient(event, data) {
        // if (cc.sys.isBrowser)
        //     return;
        // console.log("打点----", event)
        // let failArr = this.getValue(GameConfig.StorageKey.LogsClientFail, []);
        // let options = failArr.length > 0 ? {
        //     url: GameConfig.ServerEventName.LogsClient,
        //     data: {
        //         deviceID: GameConfig.DeviceID,
        //         event,
        //         data,
        //         failCount: failArr.length,
        //         failLogs: failArr,
        //     }
        // } : {
        //     url: GameConfig.ServerEventName.LogsClient,
        //     data: {
        //         deviceID: GameConfig.DeviceID,
        //         event,
        //         data
        //     }
        // }
        // Http.post(options).then((data) => {
        //     this.saveValue(GameConfig.StorageKey.LogsClientFail, [])
        //     console.log(data.action, "-打点成功-", JSON.stringify(options));
        // }).catch((err) => {
        //     let failData = { event, data };
        //     failArr.push(failData);
        //     this.saveValue(GameConfig.StorageKey.LogsClientFail, failArr)
        //     console.log(data.action, "-打点失败-", err.strack);
        // });
    }

    /**
     * 验证字符串
     * @param {String} string   -待检验字符串
     * @param {Number} length   -长度限制
     * @param {RegExp} reg      -自定义正则
     * @param {String} regMessage  -自定义正则自定义错误信息
     * @param {Boolean} required   -是否能为空串
     */
    static verifyString(string = '', len = 6, reg = null, regMessage = '', required = true) {
        if (GameUtils.isNullOrEmpty(string) && required) {
            return { verify: false, message: '请输入$' };
        }
        if (string.length > len) {
            return { verify: false, message: `$长度限制${len}个字符` };
        }
        const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        if (regEn.test(string) || regCn.test(string)) {
            return { verify: false, message: `$不能包含特殊字符` };
        }
        if (reg && reg.test(string)) {
            return { verify: false, message: `$${regMessage}` };
        }
        return { verify: true, message: '' };
    }

    static alertTips(str, pos) {
        cc.loader.loadRes("Main/Prefab/winTips", (err, prefeb) => {
            let emp = cc.instantiate(prefeb);
            emp.getComponent("ModuleWinTips").tipsInit(str, pos);
        });
    }

    static defaultCallback(node, data) {
        try {
            node.getComponent(node._name).init(data);
        } catch (ex) {
            cc.log(node.getComponent(node._name));
            cc.error(ex);
        }
    }

    static instancePrefab(prefab, data = {}, parent = cc.find('Canvas'), callback = null,) {
        let node;
        if (typeof (prefab) == 'string') {
            node = prefab.match(/.*\/(.*)/)[1];
            cc.loader.loadRes(prefab, (err, p) => {
                if (!err) {
                    node = cc.instantiate(p);
                    node.parent = parent;
                    if (callback) {
                        callback(node, data)
                    } else {
                        GameUtils.defaultCallback(node, data)
                    }
                }
            });
            return null;
        }
        node = cc.instantiate(prefab);
        node.parent = parent;
        if (callback) {
            callback(node, data)
        } else {
            GameUtils.defaultCallback(node, data)
        }
        return node;
    }

    static fixTime(value) {
        return (value + '').length == 1 ? `0${value}` : value + '';
    }

    static parse(msg) {
        try {
            if (typeof msg === 'string') {
                return JSON.parse(msg);
            } else {
                return msg;
            }
        } catch (ex) {
            //TODO
            return null;
        }
    }
}

