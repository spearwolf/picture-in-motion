start
  = ws statements:statement* ws { return statements; }


// ----- Statements -----

statement
  = statement:(
      data_statement
      / property_statement
    )
    nl ws
    {
      return statement;
    }


// ----- Property Calls -----

property_statement
  = "@" key:name _ args:property_arguments_list?
  {
    var props = {
      type: "property",
      key: key
    }
    if (args) props.args = args;
    return props;
  }

property_arguments_list
  = "("
    head:property_argument
    tail:("," _ a:property_argument { return a; })*
  ")"
  {
    return [head].concat(tail);
  }

property_argument
  = value:(value / name) {
    return value;
  }


// ----- Data -----

data_statement
  = key:name _ value:value {
    return {
      type: "data",
      key: key,
      value: value
    }
  }


// ----- Values -----

value
  = false
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
  = firstChar:[a-z]i chars:name_char+ { return firstChar + chars.join(""); }

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
