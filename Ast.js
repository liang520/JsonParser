export const AstNodeTypes = {
    OBJECT: 'object',
    VALUE: 'value',
    DOCUMENT: 'document',
    KEY: 'key',
    PAIR: 'pair',
    STRING: 'string',
    NUMBER: 'number',
    COMMENT: 'comment',
    BOOLEAN: 'boolean',
    ARRAY: 'array',
}

/**
 * 每一个AST 节点包含一个accept方法，
 * 接受一个visit查看内部的结构，
 * 调用visit的查看方法，并且传入节点，执行，便可执行查看方法来查看节点
 */
/**
 * 主类
 */
class JsonNode {
    constructor(type) {
        this.type = type;
    }
    /**
     * 差用visitor模式
     */
    accept(visitor) {
        visitor.visitNode(this);
    }
}

// pair中的value
class JsonValue extends JsonNode {
    constructor() {
        super(AstNodeTypes.VALUE);
        this.children = [];
    }
    accept(visitor) {
        visitor.visitValue(this)
    }
}
class JsonString extends JsonNode {
    constructor(value) {
        super(AstNodeTypes.STRING);
        this.value = value;
    }
    accept(visitor) {
        visitor.visitString(this)
    }
}

class JsonNumber extends JsonNode {
    constructor(value) {
        super(AstNodeTypes.NUMBER)
        this.value = value
    }
    accept(visitor) {
        visitor.visitNumber(this);
    }
}

class JsonBoolean extends JsonNode {
    constructor(value) {
        super(AstNodeTypes.BOOLEAN)
        this.value = value
    }
    accept(visitor) {
        visitor.visitBoolean(this);
    }
}

class JsonComment extends JsonNode {
    constructor(value) {
        super(AstNodeTypes.COMMENT)
        this.value = value;
    }
    accept(visitor) {
        visitor.visitComment(this);
    }
}

class JsonObject extends JsonNode {
    constructor() {
        super(AstNodeTypes.OBJECT);
        this.pair = [];
    }
    accept(visitor) {
        visitor.visitObject(this);
    }
}
class JsonKey extends JsonNode {
    constructor(value) {
        super(AstNodeTypes.KEY)
        this.value = value;
    }
    accept(visitor) {
        visitor.visitKey(this);
    }
}

class JsonPair extends JsonNode {
    constructor(key, value) {
        super(AstNodeTypes.PAIR)
        this.key = key;
        this.value = value;
    }
    accept(visitor) {
        visitor.visitPair(this);
    }
}

class JsonDocument extends JsonNode {
    constructor() {
        super(AstNodeTypes.DOCUMENT)
        this.children = null;
    }
    accept(visitor) {
        visitor.visitDocument(this);
    }
}

export {
    JsonDocument,
    JsonPair,
    JsonKey,
    JsonObject,
    JsonValue,
    JsonBoolean,
    JsonNumber,
    JsonString,
    JsonComment
}