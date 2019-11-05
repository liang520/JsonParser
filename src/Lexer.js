import { TokenType, KeyWords } from "./TokenType";
import { Token } from "./Token";
export class Lexer {
    constructor(input) {
        this.input = input;//输入
        this.pos = 0;
        this.currentChar = this.input[this.pos];
        this.tokens = [];//返回的所有token
        this.currentTokenIndex = 0;//获取下一个token
        this.lex();//解析获取所有token
    }
    /**
     * 获取所有token
     */
    lex() {
        //当前不是结束字符
        while (this.currentChar && this.currentChar != TokenType.Nil) {
            this.skipWhiteSpace();//跳过空白
            let token = "";


            switch (this.currentChar) {
                case "{":
                    this.consume();
                    token = new Token(TokenType.OpenBrace, TokenType.OpenBrace);
                    break;
                case "}":
                    this.consume();
                    token = new Token(TokenType.CloseBrace, TokenType.CloseBrace);
                    break;
                case ":":
                    this.consume();
                    token = new Token(TokenType.Colon, TokenType.Colon);
                    break;
                case ",":
                    this.consume();
                    token = new Token(TokenType.Comma, TokenType.Comma);
                    break;
                case '"'://处理"page"或者"page|ufm"这种情况
                    token = this.getStringToken();
                    break;
                case "/"://处理备注符号//
                    token = this.getCommentToken();
                    break;
                default://处理数字
                    if (this.isNumber(this.currentChar)) {
                        token = this.getNumberToken();
                    } else if (this.isLetter(this.currentChar)) {
                        token = this.getIdentifierToken();
                    } else {
                        throw new Error(`${this.currentChar} is  not a valid type`)
                    }
                    break;
            }
            if (token) {
                this.tokens.push(token);
            }
        }
        this.tokens.push(new Token(TokenType.Eof, TokenType.Eof));
    }
    /**
     * 跳过连续的空白
     */
    skipWhiteSpace() {
        //没有结束的时候，并且当前字符是空白
        while (!this.isEnd() && this.isSpace(this.currentChar)) {
            this.consume();
        }
    }
    getIdentifierToken() {
        let buffer = '';
        while (this.isLetter(this.currentChar)) {
            buffer += this.currentChar;
            this.consume();
        }
        if (buffer) {
            const _tokenType = KeyWords[buffer];
            return new Token(_tokenType, buffer)
        }
    }
    /**
     * 判断字符是否是空白符
     * @param {string} char 
     * @return {boolean}
     */
    isSpace(char) {
        const re = /\s/gi;
        return re.test(char);
    }
    /**
     * 判断时候是字符
     * @param {string} char 
     */
    isLetter(char) {
        const re = /\w/gi;
        return re.test(char);
    }
    /**
     * 获取下一个字符
     */
    consume() {
        if (!this.isEnd()) {
            this.pos++;
            this.currentChar = this.input[this.pos];
        } else {
            this.currentChar = TokenType.Nil;
        }
    }
    /**
     * 字符结束
     */
    isEnd() {
        return this.pos > this.input.length - 1;
    }
    isNumber(char) {
        const re = /\d/g;
        return re.test(char);
    }
    /**
     * 字符及|匹配
     */
    getStringToken() {
        let buffer = "";
        this.match(TokenType.Quote);//匹配引号"，并且消费掉
        //判断是否是字符或者当前位置是|符号
        while (this.currentChar != TokenType.Quote && !this.isEnd() && (this.isLetter(this.currentChar) || this.currentChar == TokenType.BitOr)) {

            if (this.currentChar == TokenType.BitOr) {//遇到了|
                //如果遇到|,刚好又有buffer字符，那么就添加到数组中
                if (buffer) {
                    this.tokens.push(new Token(TokenType.StringLiteral, buffer));
                }
                this.tokens.push(new Token(TokenType.BitOr, TokenType.BitOr));
                buffer = "";//清空
            } else {
                buffer += this.currentChar;
            }
            this.consume();
        }
        if (buffer) {
            this.tokens.push(new Token(TokenType.StringLiteral, buffer));
        }
        this.match(TokenType.Quote);//匹配引号"，并且消费掉
    }
    getCommentToken() {
        //简单处理两个/
        this.match(TokenType.SingleSlash);
        this.match(TokenType.SingleSlash);
        // 切换到下一行
        while (!this.isNewLine(this.currentChar) && !this.isEnd()) {
            this.consume();
        }
        return;
    }
    getNumberToken() {
        let buffer = '';
        //是数字，并且没有结束
        while (this.isNumber(this.currentChar) && !this.isEnd()) {
            buffer += this.currentChar;
            this.consume();//切换到下一个
        }
        if (buffer) {
            return new Token(TokenType.Number, buffer)
        }
    }
    /**
     * 是否是新的一行
     * @param {string} char 
     */
    isNewLine(char) {
        const re = /\r?\n/;
        return re.test(char);
    }
    /**
     * 匹配输入的字符，如果相等，获取下一个
     */
    match(inputchar) {
        if (this.currentChar == inputchar) {
            this.consume();
        } else {
            throw new Error(`${inputchar} is not matched ${this.currentChar}`)
        }
    }
    getNextToken() {
        if (this.currentTokenIndex <= this.tokens.length - 1) {
            return this.tokens[this.currentTokenIndex++]
        } else {
            throw new Error('index is over')
        }
    }
}