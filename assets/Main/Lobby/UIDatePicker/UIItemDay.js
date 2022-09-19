cc.Class({
    extends: cc.Component,

    properties: {
        lbDay: cc.Label,
        spSel: cc.Sprite,
    },

    setDay(index, day, sel, cb, date) {
        let color = ['#8d4603', '#D83B00'];
        this.index = index;
        this.day = day;
        this.cb = cb;
        this.date = date;
        this.lbDay.node.color = new cc.Color().fromHEX(color[Number(sel)]);
        this.lbDay.string = day;
        // this.spSel.enabled = sel;
        
    },

    onClickItem() {
        if (this.cb) {
            this.cb(this.index, this.day, this.date);
        }
    },
});
