## reference

### lexer

- [词法分析参考规则](https://github.com/antlr/grammars-v4/blob/master/javascript/JavaScriptLexer.g4)
- [token 分析参考规则](https://github.com/vtrushin/json-to-ast/blob/master/lib/tokenize.js)

### grammar

- [语法分析参考规则](https://github.com/antlr/grammars-v4/blob/master/json/JSON.g4)

```
grammar JSON;

json
    : value
    ;


value
    : STRING(|STRING)*
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
```
