import { GameConfig } from "../../../GameBase/GameConfig";

export class PlayerManager {
    static _instance = null;
    static getInstance() {
        if (!this._instance)
            this._instance = new PlayerManager();
        return this._instance;
    }
    constructor() {
        this.reset();
    }

    _playerInfo = {}

    reset() {
        this._playerInfo = {}
        this._name = '';
        this._id = '';
        this._head = '';
        this._sex = '';
        this._phone = '';
        this._status = '';
        this._wallet = 0;
        this._card = 0;
        this._diamond = 0;
        this._createdAt = new Date();
        this._updatedAt = new Date();


    }



    init(data) {
        console.log('初始化玩家信息--', data)
        // {
        //     "wechatID": "******",
        //     "phone": "未绑定",
        //     "password": "******",
        //     "deviceID": "******",
        //     "hasBind": false,
        //     "id": 78660635,
        //     "name": "正直身影",
        //     "sex": "male",
        //     "head": "http://thirdwx.qlogo.cn/mmopen/vi_32/ly3xana9KAs20x0ukuBuKTLgicgG5mEnQneDF80tbphrC6Dz3b7MZIP1zrjT1tfn7rUhp7GiczVETJ6deickWQ45Q/132",
        //     "status": "normal",
        //     "wallet": 0,
        //     "card": 0,
        //     "diamond": 100000,
        //     "createdAt": "2022-04-07T22:38:58.000Z",
        //     "updatedAt": "2022-09-27T07:42:23.616Z"
        // }
        let { phone, hasBind, id, name, sex, head, status, wallet, card, diamond, createdAt, updatedAt } = data;

        this._playerInfo = data;

        this._playerInfo = {}
        this._name = name;
        this._id = id;
        this._head = head;
        this._sex = sex;
        this._phone = phone;
        this._status = status;
        this._wallet = wallet || 0;
        this._card = card || 0;
        this._diamond = diamond || 0;
        this._createdAt = createdAt || new Date();
        this._updatedAt = updatedAt || new Date();


    }

    get playerInfo() {
        return this.playerInfo;
    }

    get name() {
        return this._name;
    }
    get id() {
        return this._id;
    }
    get head() {
        return this._head;
    }
    get sex() {
        return this._sex;
    }
    get phone() {
        return this._phone;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    get createdAt() {
        return this._createdAt;
    }


    get wallet() {
        return this._wallet;
    }
    set wallet(v) {
        if (v != this._wallet)
            this._wallet = v;
    }

    get card() {
        return this._card;
    }
    set card(v) {
        if (v != this._card)
            this._card = v;
    }


    get diamond() {
        return this._diamond;
    }
    set diamond(v) {
        if (v != this._diamond)
            this._diamond = v;
    }

}


