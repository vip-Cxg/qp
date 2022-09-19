
const { ccclass, property } = cc._decorator
@ccclass
export default class SelectAr extends cc.Component {

    @property(cc.Node)
    btnAdd = null;
    @property(cc.Node)
    btnReduce = null;
    @property(cc.Label)
    label = null;
    content = [1, 2, 3, 4, 5];
    value = [1, 2, 3, 4, 5];
    rule = null;
    field = '';

    init(content, value, rule, field) {
        this.rule = rule;
        this.field = field;
        this.value = value || content;
        this.content = content;
        if (this.value.findIndex(c => c == this.rule[this.field]) < 0) return;
        this.label.string = this.content[this.value.findIndex(v => v == this.rule[this.field])];
    }

    add() {
       let index = this.content.findIndex(c => c == this.label.string);
       if (index < 0) return;
       this.label.string = this.content[(index + 1) % this.content.length]
       this.rule[this.field] = this.value[(index + 1) % this.content.length];
    }

    reduce() {
        let content = this.content.slice().reverse();
        let index = content.findIndex(c => c == this.label.string);
        if (index < 0) return;
        this.label.string = content[(index + 1) % content.length];
        this.rule[this.field] = this.value.slice().reverse()[(index + 1) % content.length]
    }

    get() {
        return this.label.string;
    }
}


