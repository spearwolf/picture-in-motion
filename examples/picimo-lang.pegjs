Expression
  = ws expr:number_expression ws { return expr; }

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
  = "(" _ expr:Expression _ ")" { return expr; }
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


// ------ Common --------

ws "whitespaces or line break"
  = [ \t\n\r]*

_ "whitespace"
  = [ \t]*

DIGIT  = [0-9]
