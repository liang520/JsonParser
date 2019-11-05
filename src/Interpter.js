import { Visitor } from "./Visitor"
import { Environment } from "./Environment";

/**
 * Interpreter 属于查看ast整个节点的遍历方法，
 * 每次传入ast的整个树，在树上的每个节点有接受具体操作的accept方法，
 * 会调用相应的类型的访问的方法，类型访问的方法，访问了之后，
 * 继续深入到内部，执行内部结点的accept方法
 */

export class Interpreter extends Visitor {
    constructor() {
        super();
        this.currentKey = null;
        //this.
        this.env = new Environment(null);
    }
    visitValue(jsonValue) {
        jsonValue.children.forEach((item) => {
            this.visit(item);
        });
        if (jsonValue.comment) {
            jsonValue.comment.accept(this);
        }
    }
    visitObject(obj) {
        obj.pair.forEach((pair) => {
            pair.accept(this)
        })
    }
    visitPair(pair) {
        pair.key.accept(this);
        pair.value.accept(this, pair.key)
    }
    visitKey(jsonKey) {
        this.currentKey = null;
        this.currentKey = jsonKey.value;
    }
    visitArray(node, jsonKey) { }
    visitComment(jsonComment) {
        this.env.define(this.currentKey, jsonComment.value)
    }
    visitString(jsonString) {
        console.log('查看%c', jsonString.value);
    }
    visitBoolean(jsonBlooean) {
        console.log("查看", jsonBlooean.value)
    }
    getComment(key) {
        this.env.resolve(key)
    }
}