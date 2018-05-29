{
  var ctx = options.ctx;

  function readConstant(name) {
    return ctx.hasOption(name) ? ctx.readOption(name) : name;
  }

  function writeConstant(name, value) {
    if (!ctx.hasOption(name)) { // do not overwrite existing constants!
      ctx.writeOption(name, value);
    }
  }

  function compact (arr) {
    return arr.filter(function (element) {
      return Boolean(element);
    });
  }

  function flatten (values) {
    return compact(values).reduce(function (acc, val) {
      return acc + (Array.isArray(val) ? flatten(val) : val);
    }, '');
  }

  function copyAsAnnotation(target, propertyCall) {
    if (!target.annotations) target.annotations = [];
    target.annotations.push(propertyCall);
  }
}

start "picimo-lang"
  = ws statements:top_level_statement* ws
  {
    return compact(statements);
  }


// ----- Statements -----

top_level_statement "top-level statement"
  = statement:(
      const_statement
      / declaration
    )
    nl ws
    {
      return statement;
    }

statement "statement"
  = statement:(
      named_data_block
      / data_statement
      / property_statement
    )
    nl ws
    {
      return statement;
    }


// ----- Declaration -----

declaration
  = type:declaration_type
    _ name:name
    _ extension:(verb:declaration_verb _ subject:name { return { verb: verb, subject: subject }; })?
    _ block:data_block
  {
    block.type = "declaration",
    block.name = name;
    block.declarationType = type;
    if (extension) {
      block.verb = extension.verb;
      block.subject = extension.subject;
    }
    return block;
  }

declaration_type
  = type:( "VertexObject"i / "Primitive"i / "SpriteGroup"i ) { return type.toLowerCase(); }

declaration_verb
  = verb:( "instantiates"i ) { return verb.toLowerCase(); }


// ----- Blocks -----

named_data_block
  = name:name _ block:data_block
  {
    block.name = name;
    return block;
  }

data_block
  = type:data_value_type? anno:(_ a:property_statement { return a; })* begin_block
    statements:statement*
    end_block
    {
      var block = {
        type: "dataBlock",
        data: compact(statements)
      };
      if (type) block.dataType = type;
      if (anno.length) anno.forEach(copyAsAnnotation.bind(null, block));
      return block;
    }

begin_block = _ "{" ws
end_block   = ws "}" _


// ----- Constants -----

const_statement "constant statement"
  = name:name _ "=" _ value:value { writeConstant(name, value); }


// ----- Property Calls -----

property_statement "property-call statement"
  = "@" name:name _ args:property_arguments_list?
  {
    var props = {
      type: "propertyCall",
      name: name
    }
    if (args) props.args = args;
    return props;
  }

property_arguments_list "property call arguments list"
  = "("
    head:property_argument
    tail:("," _ a:property_argument { return a; })*
  ")"
  {
    return [head].concat(tail);
  }

property_argument "property call argument"
  = _ value:(value / name) _ {
    return value;
  }


// ----- Property Calls -----

named_arguments_list "named arguments list"
  = "("
    head:named_argument
    tail:("," _ a:named_argument { return a; })*
  ")"
  {
    return [head].concat(tail);
  }

named_argument "named argument"
  = _ name:name _ ":" _ value:value _ {
    return {
      name: name,
      value: value
    };
  }


// ----- Data -----

data_statement "data statement"
  = name:name _ type:data_value_type? anno0:(_ a0:property_statement { return a0; })* _ value:value? anno1:(_ a1:property_statement { return a1; })*
  {
    var data = {
      type: "data",
      name: name
    }
    if (value) data.value = value;
    if (type) data.valueType = type;
    if (anno0.length) anno0.forEach(copyAsAnnotation.bind(null, data));
    if (anno1.length) anno1.forEach(copyAsAnnotation.bind(null, data));
    return data;
  }

data_value_type "data value type"
  = ":" _ type:(
    "float32"
    / "int32"
    / "int16"
    / "int8"
    / "uint32"
    / "uint16"
    / "uint8"
  )
  {
    return type;
  }


// ----- Values -----

value
  = _ val:(
    null
    / false
    / true
    / value_array
    / value_expression
    / string
  ) _
  {
    return val;
  }

false
  = "false" { return false; }
  / "no" { return false; }
  / "off" { return false; }

true
  = "true" { return true; }
  / "on" { return true; }
  / "yes" { return true; }

null = "null" { return null;  }

value_expression
  = expr:number_expression {
    return expr;
  }

value_array "value array"
  = begin_array
    values:(
      head:value
      tail:(array_value_separator v:value { return v; })*
      {
         return [head].concat(tail);
      }
    )?
    end_array { return values || []; }

begin_array             = _ "[" ws
end_array               = ws ","? ws "]" _
array_value_separator   = ws "," ws


// Simple Arithmetics Grammar
// ==========================
//
// Accepts expressions like "-2 * (3.2 + 4)" and computes their value.

number_expression
  = head:number_term tail:(_ ("+" / "-") _ number_term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }

number_term
  = head:number_factor tail:(_ ("*" / "/") _ number_factor)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "*") { return result * element[3]; }
        if (element[1] === "/") { return result / element[3]; }
      }, head);
    }

number_factor
  = "(" _ expr:value_expression _ ")" { return expr; }
  / number
  / minus:minus? name:name
  {
    var val = readConstant(name);
     return minus ? -val : val;
  }


// ----- Numbers -----

number "number"
  = minus? int frac? exp? { return parseFloat(text()); }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = decimal_point DIGIT+

int
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"


// ------ Strings --------

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]

name
  = firstChar:[a-z]i chars:("."? name_char ("." name_char+ { return text(); })?)* { return firstChar + ((chars && flatten(chars)) || ''); }

name_char
  = [_a-z0-9-]i


// ----- Whitespaces -----

ws "whitespaces with optional line breaks"
  = [ \t\n\r]*

_ "whitespaces"
  = [ \t]*

nl "new line"
  = _ "\n"
  / _ "\r\n"
  / _ "\r"
  / _ "\f"


// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
