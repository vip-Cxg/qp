import { GameConfig } from "../../../GameBase/GameConfig";
import GameUtils from "../../common/GameUtils";
import { App } from "./data/App";
import moment from "../../qj/other/moment";

const defaultLeagueConfig = {
    date: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
    hour: ['00:00', '23:59'],
    payMode: 0
};

export class ClubManager {
    static _instance = null;
    static getInstance() {
        if (!this._instance)
            this._instance = new ClubManager();
        return this._instance;
    }
    constructor() {
        this.reset();
    }

    reset() {
        this._name = '';
        this._id = undefined;
        this._oglID = undefined;
        this._isLeague = undefined;
        this._notice = '';
        this._owner = {
            id: '',
            name: '',
            head: '',

        };
        this._data = {
            online: 0,
            peoples: 0
        };
        this._leagueConfig = {};
        this._power = '0,0,0';
        this._payMode = 0;
        this._score = 0;
        this._config = {
            mode: 1,  //0正常模式 1防作弊模式
            roomPermission: 1,   //1仅限管理员开房
            disbandPermission: 1, //1解散需要管理员确认
            tableDisplay: 0 //显示几张桌子
        }
        this._contact = '';
        this._role = GameConfig.ROLE.USER;
        this._rooms = [];
        this._tableMessage = [];
        this._applyMembers = 0;
        this._lastRequestTable = 0;

        this._leagueMembers = 0;

        this._leagueOnlineMembers = 0;

        this._tableCount = 0;

        this._reward = 0;
        this._level = 0;
    }

    get leagueConfig() {
        return { ...defaultLeagueConfig, ...this._leagueConfig }
    }

    set leagueConfig(value) {
        this._leagueConfig = { ...defaultLeagueConfig, ...value };
    }

    get mode() {
        return this._config.mode;
    }

    init(data) {
        let { club, rooms } = data;
        let { club: { name, id, config, level, contact, leagueConfig = {}, oglClubID, notice, power: clubPower }, owner, peoples = 0, online = 0, user: { role, score, power: userPower } } = club;
        this._name = name;
        // this._power = power;
        this._id = id;
        this._oglID = oglClubID;
        this._score = score;
        // this._isLeague = 0;
        this._leagueConfig = leagueConfig;
        this._owner = owner;
        this._contact = contact;
        this._data = {
            online,
            peoples: 0
        };
        console.log('初始化club--', data);
        this._reward = data.oglClubScore || 0;
        this._config = config;
        this._notice = notice;
        this._role = role;
        this._rooms = rooms;
        this._applyMembers = club.applyMembers || 0;


        this._leagueMembers = data.leagueMembers || 0;

        this._leagueOnlineMembers = data.leagueOnlineMembers || 0;

        this._tableCount = data.tableCount || 0;

        this._level = level || 0;
    }

    get reward() {
        return this._reward;
    }
    get oglID() {
        return this._oglID;
    }

    get applyMembers() {
        return this._applyMembers;
    }

    set applyMembers(val) {
        this._applyMembers = val;
    }

    get isLeague() {
        return this._isLeague;
    }

    set isLeague(value) {
        this._isLeague = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value
    }

    get level() {
        return this._level;
    }

    get applyMembers() {
        return this._applyMembers;
    }
    get leagueMembers() {
        return this._leagueMembers;
    }
    get leagueOnlineMembers() {
        return this._leagueOnlineMembers;
    }
    get tableCount() {
        return this._tableCount;
    }

    // set payMode(value) {
    //     this._payMode = value;
    // }

    get payMode() {
        return this.leagueConfig.payMode;
    }

    pushTableMessage(data) {
        this._tableMessage.push(data);
    }

    get needRequestTable() {
        // cc.log(new Date().getTime() - this._lastRequestTable);
        return this._tableMessage.length > 0 || new Date().getTime() - this._lastRequestTable > 7000;
    }

    updateTableMessage(timestamp) {
        this._lastRequestTable = new Date().getTime();
        this._tableMessage = this._tableMessage.filter(d => d.timestamp >= timestamp);
    }

    get power() {
        return this._power.split(',').map(p => Number(p));
    }

    get score() {
        return this._score;
    }

    set score(value) {
        this._score = value;
    }

    get rooms() {
        return this._rooms.slice().filter(r => r.isLeague == this.isLeague);
    }

    set rooms(rooms) {
        this._rooms = rooms;
    }

    get contact() {
        return this._contact || '';
    }

    set contact(value) {
        this._contact = value;
    }

    get notice() {
        return this._notice || '';
    }

    set notice(value) {
        this._notice = value;
    }

    get config() {
        return JSON.parse(JSON.stringify(this._config || {}))
    }

    set config(value) {
        this._config = value || {};
    }

    get clubInfo() {
        return {
            name: this.name,
            id: this.id,
            notice: this.notice,
            contact: this.contact,
            ...this.config,
        }
    }

    get owner() {
        return {
            id: this._owner.id,
            name: this._owner.name,
            head: this._owner.head,
        }
    }

    get name() {
        return this._name;
    }

    get role() {
        return this._role
    }

    set name(value) {
        this._name = value;
    }

    clear() {
        this._allClub = [];
        this._clubIDList = [];
        this._clubList = {};
        this._currentClubRole = 'user';
    }
}


