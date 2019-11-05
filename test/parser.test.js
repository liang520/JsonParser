import { Lexer } from "../src/Lexer";
import { Parser } from "../src/Parser";
import { Interpreter } from "../src/Interpter";

test('parser normal', () => {
    const input = `{
        "resource":"song"
    }`
    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    parser.parseJSON();
    expect(parser.isParseValidate).toBe(true);
});


test(" a comma at the end sentence ", () => {
    const input = `{
        "resource": "song",
      }`

    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    try {
        parser.parseJSON();
    } catch (err) {
        expect(parser.isParseValidate).toBe(false);
    }
});
test(" parser normal with comment", () => {
    const input = `{
        "resource": "song" //isRequired
      }`
    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    parser.parseJSON();
    expect(parser.isParseValidate).toBe(true);
});

test(" parser normal with bitstring", () => {
    const input = `{
        "resource": "song|album" //isRequired
      }`
    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    parser.parseJSON();
    expect(parser.isParseValidate).toBe(true);
});

test(" parser normal with bitstring and one more vertical line", () => {
    const input = `{
        "resource": "song|album|" //isRequired
      }`


    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    try {
        parser.parseJSON();
    } catch (err) {
        expect(parser.isParseValidate).toBe(false);
    }
});

test(" two bitor throw error", () => {

    expect(() => {
        const input = `{
        "resource": "song||album" //isRequired
      }`
        let lexer = new Lexer(input);
        let parser = new Parser(lexer);
        parser.parseJSON();
    }).toThrow(Error);

});

test(" comment with isRequired AstNode", () => {
    const input = `{
        "resource": "song|album" //isRequired
      }`
    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    let jaonValue = parser.parseJSON();
    expect(jaonValue.children[0].type).toBe("object");
    expect(jaonValue.children[0].pair.length).toBe(1);
});

test(" interpter test", () => {
    const input = `{
        "resource": "song|album", //isRequired
        "resourceid":true //songid,123
      }`

    let lexer = new Lexer(input);
    let parser = new Parser(lexer);
    let astTree = parser.parseJSON();

    let interpter = new Interpreter();
    interpter.visitValue(astTree);
})