import { AstNodeTypes } from "./Ast";
/**
 * 基础Visitor 没其他的可以继承并且重载方法
 */
export class Visitor {
    visitDocument() { }
    visitObject() { }
    visitNumber() { }
    visitBoolean() { }
    visitString() { }
    visitPair() { }
    visitKey() { }
    visitValue() { }
    visitNode() { }
    visitComment() { }
    visitArray() { }
    visit(node, jsonKey) {
        switch (node.type) {
            case AstNodeTypes.DOCUMENT:
                this.visitDocument(node)
                break;
            case AstNodeTypes.OBJECT:
                this.visitObject(node);
                break;
            case AstNodeTypes.PAIR:
                this.visitPair(node);
                break;
            case AstNodeTypes.KEY:
                this.visitKey(node);
                break;
            case AstNodeTypes.VALUE:
                this.visitValue(node, jsonKey);
                break;
            case AstNodeTypes.ARRAY:
                this.visitArray(node, jsonKey);
                break;
            case AstNodeTypes.NUMBER:
                this.visitNumber(node);
                break;
            case AstNodeTypes.STRING:
                this.visitString(node);
                break;
            case AstNodeTypes.BOOLEAN:
                this.visitBoolean(node);
                break;
            case AstNodeTypes.COMMENT:
                this.visitComment(node);
                break;
            default:
                break;
        }
    }
}