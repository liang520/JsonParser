
const TokenType = {
    OpenBrace: "{",
    CloseBrace: "}",
    StringLiteral: "StringLiteral",
    BitOr: "|",
    SingleSlash: "/",
    Colon: ":",
    Quote: '"',
    Number: "NUMBER",
    Comma: ",",
    Nil: "NIL",//结束的字符
    Eof: "EOF",//end token
    True: "true",
    False: "false"
}

const KeyWords = {
    true: TokenType.True,
    false: TokenType.False
}
export { KeyWords, TokenType }