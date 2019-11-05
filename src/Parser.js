import { TokenType } from "./TokenType";
import * as AstNode from './Ast'
export class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = lexer.getNextToken();
        this.isParseValidate = true;//表示是否合格
    }
    /**
     * json:value
     */
    parseJSON() {
        return this.parseValue();
    }
    /**
      value
    : STRING (|STRING)*
    | NUMBER
    | obj
    | 'true'
    | 'false'
     */
    parseValue() {
        const _current = this.currentToken;
        let _valueObj = new AstNode.JsonValue();
        switch (this.currentToken.type) {
            case TokenType.OpenBrace://中括号开始，构建parseObject
                _valueObj.children.push(this.parseObject());
                break;
            case TokenType.StringLiteral:
                _valueObj.children = _valueObj.children.concat(this.parseString());
                break;
            case TokenType.Number:
                _valueObj.children.push(this.parseNumber());
                break;
            case TokenType.True://value是boolean，消耗掉，到下一个
                this.eat(TokenType.True);
                _valueObj.children.push(new AstNode.JsonBoolean(_current.value));
                break;
            case TokenType.False:
                this.eat(TokenType.False);
                _valueObj.children.push(new AstNode.JsonBoolean(_current.value));
                break;
            default:
                break;
        }
        return _valueObj;
    }
    eat(tokenType) {
        if (this.currentToken.type == tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.isParseValidate = false;
            throw new Error("don't match")
        }
    }
    /**
     * 处理Object，添加到数组中
     * "{" pair (,pair)*"}"
     */
    parseObject() {
        let _obj = new AstNode.JsonObject();

        this.eat(TokenType.OpenBrace);//消耗掉{
        let _pair = [];
        _pair.push(this.parsePair());//处理String: value,添加到堆栈中
        while (this.currentToken.type == TokenType.Comma) {//处理逗号，
            this.eat(TokenType.Comma);
            _pair.push(this.parsePair());//处理 String: value
        }
        this.eat(TokenType.CloseBrace);//消耗掉}
        _obj.pair = _pair;
        return _obj
    }
    /**
     *  String: value
     */
    parsePair() {
        let _pair = new AstNode.JsonPair();//构建key:value组合
        const _key = this.currentToken.value;
        let _pkey = new AstNode.JsonKey(_key);//构建key
        _pair.key = _pkey;//给pair赋值_key
        this.eat(TokenType.StringLiteral);//消耗掉key
        this.eat(TokenType.Colon);//消掉：
        let _value = this.parseValue();//deal value
        _pair.value = _value;
        return _pair;
    }
    /**
     *  STRING (|STRING)*
     * 解析字符，可能有多个
     */
    parseString() {
        let arr = [];
        arr.push(new AstNode.JsonString(this.currentToken.value));
        this.eat(TokenType.StringLiteral);
        while (this.currentToken.type == TokenType.BitOr) {
            this.eat(TokenType.BitOr);//消耗|
            arr.push(new AstNode.JsonString(this.currentToken.value));
            this.eat(TokenType.StringLiteral)//消耗string
        }
        return arr;
    }
    parseNumber() {
        const _value = this.currentToken.value;
        this.eat(TokenType.Number);
        return new AstNode.JsonNumber(_value);
    }
};
/**
grammar JSON;

json
    : value
    ;


value
    : STRING
    | NUMBER
    | obj
    | 'true'
    | 'false'
    ;

obj
    : "{" pair (,pair)* "}"
    ;

pair
    String: value

STRING
   : '"' (ESC | SAFECODEPOINT)* '"'
   ;

NUMBER
   : '-'? INT ('.' [0-9] +)? EXP?
   ;
 */