{
  function compact (arr) {
    return arr.filter(function (element) {
      return Boolean(element);
    });
  }

  var constants = {};

  function readConstant(name) {
    return name in constants ? constants[name] : name;
  }
}

start "picimo-lang"
  = ws statements:statement* ws
  {
    return compact(statements);
  }


// ----- Statements -----

statement "statement"
  = statement:(
      data_block
      / const_statement
      / data_statement
      / property_statement
    )
    nl ws
    {
      return statement;
    }


// ----- Blocks -----

data_block
  = name:name _ type:data_value_type? begin_block
    statements:statement*
    end_block
    {
      var block = {
        type: "dataBlock",
        name: name,
        data: compact(statements)
      };
      if (type) block.dataType = type;
      return block;
    }

begin_block = _ "{" ws
end_block   = ws "}" _


// ----- Constants -----

const_statement "constant statement"
  = name:name _ "=" _ value:value_expression
  {
    constants[name] = value;
  }


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


// ----- Data -----

data_statement "data statement"
  = name:name _ type:data_value_type? _ value:value?
  {
    var data = {
      type: "data",
      name: name
    }
    if (value) data.value = value;
    if (type) data.valueType = type;
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
  = value_array
  / false
  / true
  / null
  / value_expression
  / string

false = "false" { return false; }
null  = "null"  { return null;  }
true  = "true"  { return true;  }

value_expression
  = _ expr:number_expression _ {
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
end_array               = ws "]" _
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
  = firstChar:[a-z]i chars:name_char* { return firstChar + ((chars && chars.join("")) || ''); }

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
