/**
 * LeetCode Problem: Valid Parentheses
 * 
 * Problema: Dada uma string contendo apenas os caracteres '(', ')', '{', '}', '[' e ']',
 * determine se a string de entrada é válida.
 * 
 * Uma string de entrada é válida se:
 * 1. Parênteses abertos devem ser fechados pelo mesmo tipo.
 * 2. Parênteses abertos devem ser fechados na ordem correta.
 * 3. Cada parêntese fechado tem um parêntese aberto correspondente do mesmo tipo.
 * 
 * Categoria: String, Stack
 * 
 * Exemplo:
 * Input: s = "()"
 * Output: true
 * 
 * Input: s = "()[]{}"
 * Output: true
 * 
 * Input: s = "(]"
 * Output: false
 * 
 * Input: s = "([)]"
 * Output: false
 * 
 * Input: s = "{[]}"
 * Output: true
 */

function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (let char of s) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;

  
}

  function findFirstError(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (['(', '[', '{'].includes(char)) {
      stack.push({ char, pos: i });
    } 
    else if ([')', ']', '}'].includes(char)) {
      if (stack.length === 0) {
        return {
          valid: false,
          error: `Fechamento inesperado '${char}' sem abertura correspondente`,
          position: i,
          character: char
        };
      }

      const top = stack.pop();
      if (top.char !== pairs[char]) {
        return {
          valid: false,
          error: `Esperava '${Object.keys(pairs).find(k => pairs[k] === top.char)}' mas encontrou '${char}'`,
          position: i,
          character: char
        };
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack.pop();
    return {
      valid: false,
      error: `Abertura '${unclosed.char}' na posição ${unclosed.pos} sem fechamento correspondente`,
      position: unclosed.pos,
      character: unclosed.char
    };
  }

  return { valid: true, error: null, position: null, character: null };
}



module.exports = { isValid, findFirstError };
console.log("Início Tarefa 1 - [Chat GPT]");